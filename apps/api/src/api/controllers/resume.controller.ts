import { Request, Response } from 'express';
import { resumeService } from '../../modules/resume/resume.service';
import { asyncHandler, createError } from '../middleware/errorHandler';
import logger from '../../shared/logger';

export const resumeController = {
    /**
     * POST /api/resume/upload
     */
    uploadResume: asyncHandler(async (req: Request, res: Response) => {
        if (!req.file) throw createError('No PDF file uploaded', 400);

        // Use a fixed userId for MVP (auth to be added later)
        const userId = req.body.userId || req.headers['x-user-id'] || 'default-user';

        const resume = await resumeService.uploadResume(userId as string, req.file);

        res.status(201).json({
            success: true,
            message: 'Resume uploaded and parsed successfully',
            data: {
                id: resume._id,
                fileName: resume.originalFileName,
                fileSize: resume.fileSize,
                parsedData: {
                    skills: resume.parsedData.skills,
                    technologies: resume.parsedData.technologies,
                    roles: resume.parsedData.roles,
                    experienceYears: resume.parsedData.experienceYears,
                    education: resume.parsedData.education,
                    summary: resume.parsedData.summary,
                },
                uploadedAt: resume.uploadedAt,
            },
        });
    }),

    /**
     * GET /api/resume/active
     */
    getActiveResume: asyncHandler(async (req: Request, res: Response) => {
        const userId = req.query.userId || req.headers['x-user-id'] || 'default-user';
        const resume = await resumeService.getActiveResume(userId as string);

        if (!resume) {
            res.json({ success: true, data: null, message: 'No resume uploaded yet' });
            return;
        }

        res.json({
            success: true,
            data: {
                id: resume._id,
                fileName: resume.originalFileName,
                fileSize: resume.fileSize,
                parsedData: resume.parsedData,
                uploadedAt: resume.uploadedAt,
            },
        });
    }),

    /**
     * DELETE /api/resume/:id
     */
    deleteResume: asyncHandler(async (req: Request, res: Response) => {
        const userId = req.body.userId || req.headers['x-user-id'] || 'default-user';
        const deleted = await resumeService.deleteResume(req.params.id, userId as string);

        if (!deleted) throw createError('Resume not found', 404);

        res.json({ success: true, message: 'Resume deleted' });
    }),
};
