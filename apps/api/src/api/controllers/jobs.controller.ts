import { Request, Response } from 'express';
import { jobsService } from '../../modules/jobs/jobs.service';
import { aiMatchService } from '../../modules/ai/aiMatch.service';
import { resumeService } from '../../modules/resume/resume.service';
import { enqueueAIMatch, enqueueScraperRun } from '../../workers/queues';
import { asyncHandler, createError } from '../middleware/errorHandler';
import type { JobFilters } from '../../modules/jobs/jobs.types';
import logger from '../../shared/logger';

export const jobsController = {
    /**
     * GET /api/jobs — List jobs with filters
     */
    getJobs: asyncHandler(async (req: Request, res: Response) => {
        const filters: JobFilters = {
            search: req.query.search as string,
            techStack: req.query.techStack
                ? (req.query.techStack as string).split(',')
                : undefined,
            location: req.query.location as string,
            country: req.query.country as string,
            workMode: req.query.workMode
                ? (req.query.workMode as string).split(',') as any
                : undefined,
            experienceYears: req.query.experienceYears as string,
            page: parseInt(req.query.page as string || '1', 10),
            limit: parseInt(req.query.limit as string || '20', 10),
        };

        const result = await jobsService.getJobs(filters);

        res.json({
            success: true,
            data: result,
        });
    }),

    /**
     * GET /api/jobs/:id — Single job
     */
    getJobById: asyncHandler(async (req: Request, res: Response) => {
        const job = await jobsService.getJobById(req.params.id);
        if (!job) throw createError('Job not found', 404);

        res.json({ success: true, data: job });
    }),

    /**
     * GET /api/jobs/ranked?resumeId=xxx — Jobs ranked by AI match score
     */
    getRankedJobs: asyncHandler(async (req: Request, res: Response) => {
        const { resumeId } = req.query;
        if (!resumeId) throw createError('resumeId is required', 400);

        const filters: JobFilters = {
            search: req.query.search as string,
            techStack: req.query.techStack ? (req.query.techStack as string).split(',') : undefined,
            workMode: req.query.workMode ? (req.query.workMode as string).split(',') as any : undefined,
            location: req.query.location as string,
            country: req.query.country as string,
            experienceYears: req.query.experienceYears as string,
            page: parseInt(req.query.page as string || '1', 10),
            limit: parseInt(req.query.limit as string || '50', 10),
        };

        const jobs = await jobsService.getJobsWithAnalysis(resumeId as string, filters);

        // Group by match tier
        const grouped = {
            topMatches: jobs.filter((j) => j.analysis?.matchScore >= 80),
            goodMatches: jobs.filter((j) => j.analysis?.matchScore >= 60 && j.analysis?.matchScore < 80),
            stretchOpportunities: jobs.filter((j) => j.analysis?.matchScore >= 40 && j.analysis?.matchScore < 60),
        };

        res.json({ success: true, data: grouped });
    }),

    /**
     * GET /api/jobs/:id/analysis?resumeId=xxx
     */
    getJobAnalysis: asyncHandler(async (req: Request, res: Response) => {
        const { resumeId } = req.query;
        if (!resumeId) throw createError('resumeId is required', 400);

        const analysis = await jobsService.getAnalysis(req.params.id, resumeId as string);
        if (!analysis) {
            // Run directly instead of queuing (Redis-free fallback)
            try {
                const job = await jobsService.getJobById(req.params.id);
                const resume = await resumeService.getResumeById(resumeId as string);
                if (!job || !resume) {
                    res.status(202).json({ success: true, message: 'Analysis pending. Resume or job not found.', data: null });
                    return;
                }
                const newAnalysis = await aiMatchService.buildFullAnalysis(
                    req.params.id,
                    resumeId as string,
                    job,
                    resume.parsedData
                );
                await jobsService.upsertAnalysis(newAnalysis);
                res.json({ success: true, data: newAnalysis });
            } catch {
                await enqueueAIMatch(req.params.id, resumeId as string).catch(() => { });
                res.status(202).json({
                    success: true,
                    message: 'Analysis queued. Please retry in a moment.',
                    data: null,
                });
            }
            return;
        }

        res.json({ success: true, data: analysis });
    }),

    /**
     * POST /api/jobs/:id/analyze — Manually trigger AI analysis
     */
    triggerAnalysis: asyncHandler(async (req: Request, res: Response) => {
        const { resumeId } = req.body;
        if (!resumeId) throw createError('resumeId is required', 400);

        const job = await jobsService.getJobById(req.params.id);
        if (!job) throw createError('Job not found', 404);

        const resume = await resumeService.getResumeById(resumeId);
        if (!resume) throw createError('Resume not found', 404);

        try {
            // Try to queue (Redis optional)
            await enqueueAIMatch(req.params.id, resumeId);
            res.status(202).json({
                success: true,
                message: 'AI analysis queued successfully',
            });
        } catch {
            // Redis unavailable — run synchronously
            try {
                const analysis = await aiMatchService.buildFullAnalysis(
                    req.params.id,
                    resumeId,
                    job,
                    resume.parsedData
                );
                await jobsService.upsertAnalysis(analysis);
                res.json({ success: true, message: 'AI analysis completed', data: analysis });
            } catch (err: any) {
                logger.error('[TriggerAnalysis] Direct AI analysis failed:', err.message);
                res.status(500).json({ success: false, message: 'AI analysis failed', error: err.message });
            }
        }
    }),

    /**
     * POST /api/jobs/refresh — Trigger scraper run (direct, no Redis needed)
     */
    refreshJobs: asyncHandler(async (req: Request, res: Response) => {
        const { scraperService } = await import('../../modules/scraper/scraper.service');

        logger.info('[RefreshJobs] Starting direct scraper run...');
        let stored = 0;
        let skipped = 0;

        try {
            const rawJobs = await scraperService.scrapeAll();
            logger.info(`[RefreshJobs] Scraped ${rawJobs.length} raw jobs`);

            for (const rawJob of rawJobs) {
                try {
                    await jobsService.upsertJob({
                        title: rawJob.title,
                        company: rawJob.company,
                        location: rawJob.location,
                        workMode: rawJob.workMode,
                        skills: rawJob.skills,
                        tags: rawJob.tags,
                        description: rawJob.description,
                        source: rawJob.source,
                        sourceUrl: rawJob.sourceUrl,
                        postedAt: rawJob.postedAt,
                        hasFunding: rawJob.hasFunding,
                        employeeCount: rawJob.employeeCount,
                        salary: rawJob.salary,
                        experienceYears: rawJob.experienceYears,
                    });
                    stored++;
                } catch (err: any) {
                    if (err.code === 11000) skipped++;
                    else logger.warn(`[RefreshJobs] Failed to store job:`, err.message);
                }
            }

            await scraperService.closeBrowser();
        } catch (error: any) {
            logger.error('[RefreshJobs] Scraper failed:', error.message);
            // Even if scraper fails, return what we have
        }

        // Trigger AI analysis for all unanalysed jobs if a resume exists
        const userId = req.body.userId || req.headers['x-user-id'] || 'default-user';
        const resume = await resumeService.getActiveResume(userId as string);
        if (resume) {
            try {
                const allJobs = await jobsService.getJobs({ page: 1, limit: 50 });
                let analysed = 0;
                for (const job of allJobs.jobs) {
                    const existing = await jobsService.getAnalysis(job._id!.toString(), resume._id!.toString());
                    if (!existing) {
                        try {
                            const analysis = await aiMatchService.buildFullAnalysis(
                                job._id!.toString(),
                                resume._id!.toString(),
                                job,
                                resume.parsedData
                            );
                            await jobsService.upsertAnalysis(analysis);
                            analysed++;
                        } catch (err: any) {
                            logger.warn(`[RefreshJobs] AI analysis failed for job ${job._id}:`, err.message);
                        }
                    }
                }
                logger.info(`[RefreshJobs] AI analysis completed for ${analysed} new jobs`);
            } catch (err: any) {
                logger.warn('[RefreshJobs] AI analysis pass failed:', err.message);
            }
        }

        res.json({
            success: true,
            message: `Scraping complete. Stored: ${stored}, Skipped: ${skipped}`,
            data: { stored, skipped },
        });
    }),

    /**
     * POST /api/jobs/:id/cold-email — Generate cold email
     */
    generateColdEmail: asyncHandler(async (req: Request, res: Response) => {
        const { resumeId, candidateName } = req.body;
        if (!resumeId) throw createError('resumeId is required', 400);

        const job = await jobsService.getJobById(req.params.id);
        if (!job) throw createError('Job not found', 404);

        const resume = await resumeService.getResumeById(resumeId);
        if (!resume) throw createError('Resume not found', 404);

        const email = await aiMatchService.generateColdEmail(
            job,
            resume.parsedData,
            candidateName || 'Candidate'
        );

        res.json({ success: true, data: email });
    }),

    /**
     * GET /api/jobs/analytics — Dashboard metrics
     */
    getAnalytics: asyncHandler(async (_req: Request, res: Response) => {
        const summary = await jobsService.getAnalyticsSummary();
        res.json({ success: true, data: summary });
    }),
};
