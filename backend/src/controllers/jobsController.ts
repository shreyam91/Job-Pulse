import { Request, Response } from 'express';
import { scraperService } from '../services/scraperService';

export const scrapeJobs = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log('[JobsController] Triggering job scraper...');
        const jobs = await scraperService.scrapeAll();
        
        // Return jobs dynamically for now
        // In a real application, you might want to upsert these into your database using Prisma
        res.json({
            success: true,
            count: jobs.length,
            jobs,
        });
    } catch (error: any) {
        console.error('[JobsController] Scraping error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
