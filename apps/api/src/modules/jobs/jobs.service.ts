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
    async upsertJob(jobData: Omit<IJob, '_id' | 'sourceUrlHash' | 'scrapedAt' | 'freshnessScore' | 'companyQualityScore' | 'isExpired'>): Promise<JobDocument | null> {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 3);

        if (new Date(jobData.postedAt) < cutoff) {
            return null;
        }

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
        // 1. Get existing analyses
        const analyses = await JobAnalysisModel.find({ resumeId })
            .sort({ finalScore: -1 })
            .lean();

        const analysisMap = new Map();
        analyses.forEach(a => analysisMap.set(String(a.jobId), a));
        const analyzedJobIds = analyses.map(a => String(a.jobId));

        // 2. Fetch the resume to get keywords for fallback/discovery
        const { resumeService } = await import('../resume/resume.service');
        const resume = await resumeService.getResumeById(resumeId);
        const resumeSkills = resume?.parsedData.skills || [];

        // 3. Build the query
        const query: FilterQuery<JobDocument> = { isExpired: false };
        
        // We want jobs that ARE analyzed OR jobs that MATCH keywords
        const matchConditions: any[] = [
            { _id: { $in: analyzedJobIds } }
        ];

        if (resumeSkills.length > 0) {
            const topSkills = resumeSkills.slice(0, 12);
            matchConditions.push({
                skills: { $in: topSkills.map(s => new RegExp(s, 'i')) }
            });
        }

        query.$or = matchConditions;

        // Apply additional filters if provided
        if (filters.search) {
            const searchRegex = new RegExp(filters.search, 'i');
            const searchConditions = [
                { title: searchRegex },
                { company: searchRegex },
                { skills: { $in: [searchRegex] } }
            ];
            
            // If we already have an $or from matchConditions, we need to wrap it in an $and
            query.$and = [
                { $or: query.$or },
                { $or: searchConditions }
            ];
            delete query.$or;
        }

        if (filters.techStack && filters.techStack.length > 0) {
            const techStackFilter = { skills: { $in: filters.techStack.map((t) => new RegExp(t, 'i')) } };
            if (query.$and) {
                query.$and.push(techStackFilter);
            } else if (query.$or) {
                query.$and = [{ $or: query.$or }, techStackFilter];
                delete query.$or;
            } else {
                query.skills = techStackFilter.skills;
            }
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
                const expFilter = { 
                    $or: [
                        { 'experienceYears.min': { $lte: max } },
                        { 'experienceYears.min': { $exists: false } },
                        { 'experienceYears.min': null }
                    ]
                };
                if (query.$and) {
                    query.$and.push(expFilter);
                } else {
                    query.$and = [{ $or: query.$or }, expFilter];
                    delete query.$or;
                }
            }
        }

        const jobs = await JobModel.find(query)
            .sort({ postedAt: -1 })
            .limit(100)
            .lean();

        // 4. Transform to include analysis (or mock analysis for fallback)
        let results = jobs.map((job) => {
            const analysis = analysisMap.get(String(job._id));
            if (analysis) {
                return {
                    ...job,
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
                };
            } else {
                // Keyword-based fallback analysis for jobs not yet processed by AI
                const jobSkillsLower = (job.skills || []).map(s => s.toLowerCase());
                const resumeSkillsLower = resumeSkills.map(s => s.toLowerCase());
                const matched = (job.skills || []).filter(s => resumeSkillsLower.includes(s.toLowerCase()));
                
                // Simple score for pending jobs
                const matchScore = Math.round((matched.length / Math.max(job.skills?.length || 1, 1)) * 100);
                
                return {
                    ...job,
                    analysis: {
                        matchScore,
                        finalScore: matchScore * 0.8, // Slightly lower weight for non-AI scores
                        pending: true,
                        matchedSkills: matched,
                    }
                };
            }
        });


        // 5. Sorting
        if (filters.sortBy === 'recent') {
            results.sort((a, b) => new Date(b.postedAt || 0).getTime() - new Date(a.postedAt || 0).getTime());
        } else {
            // Sort by finalScore, then by postedAt
            results.sort((a, b) => {
                const scoreDiff = (b.analysis?.finalScore || 0) - (a.analysis?.finalScore || 0);
                if (scoreDiff !== 0) return scoreDiff;
                return new Date(b.postedAt || 0).getTime() - new Date(a.postedAt || 0).getTime();
            });
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
     * Delete jobs older than 3 days
     */
    async expireOldJobs(olderThanDays = 3): Promise<number> {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - olderThanDays);

        const result = await JobModel.deleteMany(
            { postedAt: { $lt: cutoff } }
        );

        logger.info(`Deleted ${result.deletedCount} old jobs (older than ${olderThanDays} days)`);
        return result.deletedCount;
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

    /**
     * Trigger batch AI analysis for all (or new) jobs for a resume
     */
    async triggerBatchAnalysis(resumeId: string, parsedData: any): Promise<number> {
        const { aiMatchService } = await import('../ai/aiMatch.service');
        const { enqueueAIMatch } = await import('../../workers/queues');

        // Find jobs that don't have analysis for this resume
        const analyses = await JobAnalysisModel.find({ resumeId }).select('jobId').lean();
        const analysedJobIds = new Set(analyses.map(a => a.jobId));

        const unanalysedJobs = await JobModel.find({ 
            _id: { $nin: Array.from(analysedJobIds) },
            isExpired: false
        }).limit(100).lean(); // Limit to 100 for initial pass to avoid overwhelm

        let triggered = 0;
        for (const job of unanalysedJobs) {
            try {
                // Try queuing first (preferred)
                await enqueueAIMatch(String(job._id), resumeId);
                triggered++;
            } catch (err) {
                // Fallback to synchronous analysis for the first few top jobs if queue fails
                if (triggered < 5) {
                    try {
                        const analysis = await aiMatchService.buildFullAnalysis(
                            String(job._id),
                            resumeId,
                            job as any,
                            parsedData
                        );
                        await this.upsertAnalysis(analysis);
                        triggered++;
                    } catch (innerErr: any) {
                        logger.warn(`Synchronous matching failed for job ${job._id}: ${innerErr.message}`);
                    }
                }
            }
        }
        
        return triggered;
    }
}

export const jobsService = new JobsService();
