import { Worker } from 'bullmq';
import cron from 'node-cron';
import { connectDatabase } from '../../shared/database';
import { getRedis, QUEUE_NAMES, type ScraperJobData } from '../queues';
import { scraperService } from '../../modules/scraper/scraper.service';
import { jobsService } from '../../modules/jobs/jobs.service';
import { enqueueAIMatch } from '../queues';
import logger from '../../shared/logger';
import config from '../../shared/config';

async function processScraperJob(job: any): Promise<void> {
    logger.info(`[ScraperWorker] Processing job ${job.id}`);

    try {
        // Step 1: Scrape raw jobs from all sources
        const rawJobs = await scraperService.scrapeAll();
        logger.info(`[ScraperWorker] Scraped ${rawJobs.length} raw jobs`);

        // Step 2: Normalize, deduplicate, and store
        let stored = 0;
        let skipped = 0;

        for (const rawJob of rawJobs) {
            try {
                const saved = await jobsService.upsertJob({
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
                if (saved) {
                    stored++;
                } else {
                    skipped++; // Too old
                }
                job.updateProgress(Math.round((stored / rawJobs.length) * 100));
            } catch (err: any) {
                if (err.code === 11000) {
                    skipped++; // Duplicate
                } else {
                    logger.warn(`[ScraperWorker] Failed to store job:`, err.message);
                }
            }
        }

        await job.updateProgress(100);
        logger.info(`[ScraperWorker] Done. Stored: ${stored}, Skipped (old/duplicates): ${skipped}`);

        await scraperService.closeBrowser();
    } catch (error) {
        logger.error('[ScraperWorker] Job failed:', error);
        await scraperService.closeBrowser();
        throw error;
    }
}

async function startWorker(): Promise<void> {
    await connectDatabase();

    const worker = new Worker<ScraperJobData>(
        QUEUE_NAMES.JOB_SCRAPER,
        processScraperJob,
        {
            connection: getRedis() as any,
            concurrency: 1, // One scrape at a time
        }
    );

    worker.on('completed', (job) => {
        logger.info(`[ScraperWorker] Job ${job.id} completed`);
    });

    worker.on('failed', (job, err) => {
        logger.error(`[ScraperWorker] Job ${job?.id} failed:`, err);
    });

    worker.on('progress', (job, progress) => {
        logger.info(`[ScraperWorker] Job ${job.id} progress: ${progress}%`);
    });

    logger.info('[ScraperWorker] Worker started');

    // Schedule cron job
    cron.schedule(config.cron.scraper, async () => {
        logger.info('[ScraperWorker] Cron triggered: enqueueing scraper run');
        const { enqueueScraperRun } = await import('../queues');
        await enqueueScraperRun();
    });

    logger.info(`[ScraperWorker] Cron scheduled: ${config.cron.scraper}`);

    // Graceful shutdown
    process.on('SIGTERM', async () => {
        logger.info('[ScraperWorker] Shutting down...');
        await worker.close();
        process.exit(0);
    });
}

startWorker().catch((err) => {
    logger.error('[ScraperWorker] Failed to start:', err);
    process.exit(1);
});
