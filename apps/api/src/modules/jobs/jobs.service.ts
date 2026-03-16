import { FilterQuery } from 'mongoose';
import { JobModel, type JobDocument } from './jobs.model';
import { JobAnalysisModel } from './jobAnalysis.model';
import type { IJob, IJobAnalysis, JobFilters, PaginatedJobs } from './jobs.types';
import { hashUrl, normalizeUrl, calculateFreshness, calculateCompanyScore } from '../../shared/utils';
import logger from '../../shared/logger';

export class JobsService {
    /**
     * Upsert a job from scraping — deduplication via sourceUrlHash
     */
    async upsertJob(jobData: Omit<IJob, '_id' | 'sourceUrlHash' | 'scrapedAt' | 'freshnessScore' | 'companyQualityScore' | 'isExpired'>): Promise<JobDocument> {
        const normalizedUrl = normalizeUrl(jobData.sourceUrl);
        const sourceUrlHash = hashUrl(normalizedUrl);

        const freshnessScore = calculateFreshness(jobData.postedAt);
        const companyQualityScore = calculateCompanyScore({
            hasFunding: jobData.hasFunding,
            employeeCount: jobData.employeeCount,
            isRemote: jobData.workMode === 'remote',
        });

        const job = await JobModel.findOneAndUpdate(
            { sourceUrlHash },
            {
                $set: {
                    ...jobData,
                    sourceUrl: normalizedUrl,
                    sourceUrlHash,
                    scrapedAt: new Date(),
                    freshnessScore,
                    companyQualityScore,
                    isExpired: false,
                },
            },
            { upsert: true, new: true, runValidators: true }
        );

        return job;
    }

    /**
     * Get paginated, filtered jobs with optional AI analysis joined
     */
    async getJobs(filters: JobFilters): Promise<PaginatedJobs> {
        const {
            search,
            techStack,
            location,
            country,
            workMode,
            experienceYears,
            page = 1,
            limit = 20,
        } = filters;

        const query: FilterQuery<JobDocument> = { isExpired: false };

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { skills: { $in: [new RegExp(search, 'i')] } },
                { tags: { $in: [new RegExp(search, 'i')] } },
                { company: { $regex: search, $options: 'i' } },
            ];
        }

        if (techStack && techStack.length > 0) {
            query.skills = { $in: techStack.map((t) => new RegExp(t, 'i')) };
        }

        if (workMode && workMode.length > 0) {
            query.workMode = { $in: workMode };
        }

        if (location === 'Remote Only') {
            query.workMode = 'remote';
        } else if (location === 'Remote + Global') {
            query.workMode = { $in: ['remote', 'hybrid'] };
        } else if (country) {
            query.location = { $regex: country, $options: 'i' };
        }

        if (experienceYears) {
            const [min, max] = experienceYears.split('-').map(Number);
            if (!isNaN(max)) {
                // The candidate's max experience is `max`. The job's minimum required experience should be <= `max`.
                query['$or'] = [
                    ...query['$or'] || [],
                    { 'experienceYears.min': { $lte: max } },
                    { 'experienceYears.min': { $exists: false } },
                    { 'experienceYears.min': null }
                ];
            }
        }

        const skip = (page - 1) * limit;
        
        // Sorting logic based on filters.sortBy
        let sortParam: any = { postedAt: -1, freshnessScore: -1 };
        if (filters.sortBy === 'recent') {
            sortParam = { postedAt: -1 };
        } else if (filters.sortBy === 'bestMatch') {
            sortParam = { freshnessScore: -1, companyQualityScore: -1, postedAt: -1 };
        }

        const [jobs, total] = await Promise.all([
            JobModel.find(query)
                .sort(sortParam)
                .skip(skip)
                .limit(limit)
                .lean(),
            JobModel.countDocuments(query),
        ]);

        return {
            jobs: jobs as unknown as IJob[],
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    /**
     * Get a single job by ID
     */
    async getJobById(id: string): Promise<IJob | null> {
        return JobModel.findById(id).lean() as unknown as IJob | null;
    }

    /**
     * Get jobs with AI analysis for a given resume, sorted by finalScore
     */
    async getJobsWithAnalysis(resumeId: string, filters: JobFilters): Promise<any[]> {
        const analyses = await JobAnalysisModel.find({ resumeId })
            .sort({ finalScore: -1 })
            .lean();

        if (!analyses.length) return [];

        const jobIds = analyses.map((a) => a.jobId);

        const query: FilterQuery<JobDocument> = { _id: { $in: jobIds }, isExpired: false };

        if (filters.search) {
            query.$or = [
                { title: { $regex: filters.search, $options: 'i' } },
                { skills: { $in: [new RegExp(filters.search, 'i')] } },
                { tags: { $in: [new RegExp(filters.search, 'i')] } },
                { company: { $regex: filters.search, $options: 'i' } },
            ];
        }

        if (filters.techStack && filters.techStack.length > 0) {
            query.skills = { $in: filters.techStack.map((t) => new RegExp(t, 'i')) };
        }

        if (filters.workMode && filters.workMode.length > 0) {
            query.workMode = { $in: filters.workMode };
        }

        if (filters.location === 'Remote Only') {
            query.workMode = 'remote';
        } else if (filters.location === 'Remote + Global') {
            query.workMode = { $in: ['remote', 'hybrid'] };
        } else if (filters.country) {
            query.location = { $regex: filters.country, $options: 'i' };
        }

        if (filters.experienceYears) {
            const [min, max] = filters.experienceYears.split('-').map(Number);
            if (!isNaN(max)) {
                query['$or'] = [
                    ...query['$or'] || [],
                    { 'experienceYears.min': { $lte: max } },
                    { 'experienceYears.min': { $exists: false } },
                    { 'experienceYears.min': null }
                ];
            }
        }

        const jobs = await JobModel.find(query).lean();

        const jobMap = new Map(jobs.map((j) => [String(j._id), j]));

        let results = analyses
            .filter((analysis) => jobMap.has(analysis.jobId)) // only keep analyses whose job matches filters
            .map((analysis) => ({
                ...(jobMap.get(analysis.jobId) || {}),
                analysis: {
                    matchScore: analysis.matchScore,
                    atsScore: analysis.atsScore,
                    finalScore: analysis.finalScore,
                    matchedSkills: analysis.matchedSkills,
                    missingSkills: analysis.missingSkills,
                    strengthSummary: analysis.strengthSummary,
                    aiExplanation: analysis.aiExplanation,
                    improvementSuggestion: analysis.improvementSuggestion,
                    matchBreakdown: analysis.matchBreakdown,
                },
            }));
            
        // Sorting logic based on filters.sortBy
        if (filters.sortBy === 'recent') {
            results.sort((a, b) => new Date(b.postedAt || 0).getTime() - new Date(a.postedAt || 0).getTime());
        } else {
            // Default bestMatch (already sorted by finalScore from analysis DB query, but let's be explicit and stable)
            results.sort((a, b) => (b.analysis.finalScore || 0) - (a.analysis.finalScore || 0));
        }

        const page = filters.page || 1;
        const limit = filters.limit || 20;
        const skip = (page - 1) * limit;

        return results.slice(skip, skip + limit);
    }

    /**
     * Get analysis for a specific job + resume pair
     */
    async getAnalysis(jobId: string, resumeId: string): Promise<IJobAnalysis | null> {
        return JobAnalysisModel.findOne({ jobId, resumeId }).lean() as unknown as IJobAnalysis | null;
    }

    /**
     * Store AI analysis result
     */
    async upsertAnalysis(analysis: Omit<IJobAnalysis, '_id' | 'analysedAt'>): Promise<IJobAnalysis> {
        const result = await JobAnalysisModel.findOneAndUpdate(
            { jobId: analysis.jobId, resumeId: analysis.resumeId },
            { $set: { ...analysis, analysedAt: new Date() } },
            { upsert: true, new: true, runValidators: true }
        );
        return result.toObject() as unknown as IJobAnalysis;
    }

    /**
     * Mark jobs as expired
     */
    async expireOldJobs(olderThanDays = 60): Promise<number> {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - olderThanDays);

        const result = await JobModel.updateMany(
            { postedAt: { $lt: cutoff }, isExpired: false },
            { $set: { isExpired: true } }
        );

        logger.info(`Expired ${result.modifiedCount} old jobs`);
        return result.modifiedCount;
    }

    /**
     * Remove duplicate jobs (keep most recently scraped)
     */
    async removeDuplicates(): Promise<number> {
        const duplicates = await JobModel.aggregate([
            { $group: { _id: '$sourceUrlHash', count: { $sum: 1 }, ids: { $push: '$_id' }, latestId: { $last: '$_id' } } },
            { $match: { count: { $gt: 1 } } },
        ]);

        let removed = 0;
        for (const dup of duplicates) {
            const toDelete = dup.ids.filter((id: any) => String(id) !== String(dup.latestId));
            const res = await JobModel.deleteMany({ _id: { $in: toDelete } });
            removed += res.deletedCount;
        }

        logger.info(`Removed ${removed} duplicate jobs`);
        return removed;
    }

    /**
     * Update freshness scores for all non-expired jobs
     */
    async updateFreshnessScores(): Promise<void> {
        const jobs = await JobModel.find({ isExpired: false }).select('_id postedAt').lean();

        const ops = jobs.map((job) => ({
            updateOne: {
                filter: { _id: job._id },
                update: { $set: { freshnessScore: calculateFreshness(job.postedAt) } },
            },
        }));

        if (ops.length) {
            await JobModel.bulkWrite(ops);
            logger.info(`Updated freshness for ${ops.length} jobs`);
        }
    }

    /**
     * Get analytics counts
     */
    async getAnalyticsSummary(): Promise<Record<string, any>> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [scrapedToday, totalJobs, workModeBreakdown, topCategories] = await Promise.all([
            JobModel.countDocuments({ scrapedAt: { $gte: today } }),
            JobModel.countDocuments({ isExpired: false }),
            JobModel.aggregate([
                { $match: { isExpired: false } },
                { $group: { _id: '$workMode', count: { $sum: 1 } } },
            ]),
            JobModel.aggregate([
                { $match: { isExpired: false } },
                { $unwind: '$skills' },
                { $group: { _id: '$skills', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 5 },
            ]),
        ]);

        return {
            scrapedToday,
            totalJobs,
            workModeBreakdown: workModeBreakdown.reduce((acc: Record<string, number>, item) => {
                acc[item._id] = item.count;
                return acc;
            }, {}),
            topCategories: topCategories.map((c) => ({ name: c._id, count: c.count })),
        };
    }
}

export const jobsService = new JobsService();
