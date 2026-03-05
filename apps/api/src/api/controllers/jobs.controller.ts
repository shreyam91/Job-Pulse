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
            // Enqueue if not analysed
            await enqueueAIMatch(req.params.id, resumeId as string);
            res.status(202).json({
                success: true,
                message: 'Analysis queued. Please retry in a moment.',
                data: null,
            });
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

        await enqueueAIMatch(req.params.id, resumeId);

        res.status(202).json({
            success: true,
            message: 'AI analysis queued successfully',
        });
    }),

    /**
     * POST /api/jobs/refresh — Trigger scraper run
     */
    refreshJobs: asyncHandler(async (_req: Request, res: Response) => {
        await enqueueScraperRun();
        res.json({ success: true, message: 'Job scraping queued' });
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
