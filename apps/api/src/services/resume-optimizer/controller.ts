import { Request, Response } from 'express';
import { resumeOptimizerService } from './service';

export class ResumeOptimizerController {
    async optimize(req: Request, res: Response) {
        try {
            const { resume, jobDescription } = req.body;

            if (!resume || !jobDescription) {
                return res.status(400).json({
                    success: false,
                    message: 'Both resume and jobDescription are required.'
                });
            }

            const result = await resumeOptimizerService.optimizeResume({
                resume,
                jobDescription
            });

            return res.status(200).json({
                success: true,
                data: result
            });
        } catch (error: any) {
            console.error('Error in ResumeOptimizerController.optimize:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to optimize resume',
                error: error.message
            });
        }
    }
}

export const resumeOptimizerController = new ResumeOptimizerController();
