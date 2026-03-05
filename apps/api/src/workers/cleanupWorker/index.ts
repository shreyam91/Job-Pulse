import { Worker } from 'bullmq';
import cron from 'node-cron';
import { connectDatabase } from '../../shared/database';
import { redisConnection, QUEUE_NAMES, type CleanupJobData } from '../queues';
import { jobsService } from '../../modules/jobs/jobs.service';
import logger from '../../shared/logger';
import config from '../../shared/config';

async function processCleanupJob(job: any): Promise<void> {
    const { tasks } = job.data as CleanupJobData;
    logger.info(`[CleanupWorker] Running tasks: ${tasks.join(', ')}`);

    const results: Record<string, number | string> = {};

    if (tasks.includes('dedup')) {
        const removed = await jobsService.removeDuplicates();
        results.duplicatesRemoved = removed;
        await job.updateProgress(33);
    }

    if (tasks.includes('expire')) {
        const expired = await jobsService.expireOldJobs(60);
        results.jobsExpired = expired;
        await job.updateProgress(66);
    }

    if (tasks.includes('freshen')) {
        await jobsService.updateFreshnessScores();
        results.freshnessUpdated = 'OK';
        await job.updateProgress(100);
    }

    logger.info('[CleanupWorker] Cleanup complete:', results);
}

async function startWorker(): Promise<void> {
    await connectDatabase();

    const worker = new Worker<CleanupJobData>(
        QUEUE_NAMES.CLEANUP,
        processCleanupJob,
        {
            connection: redisConnection,
            concurrency: 1,
        }
    );

    worker.on('completed', (job) => {
        logger.info(`[CleanupWorker] Job ${job.id} completed`);
    });

    worker.on('failed', (job, err) => {
        logger.error(`[CleanupWorker] Job ${job?.id} failed:`, err);
    });

    logger.info('[CleanupWorker] Worker started');

    cron.schedule(config.cron.cleanup, async () => {
        logger.info('[CleanupWorker] Cron triggered: enqueueing cleanup');
        const { enqueueCleanup } = await import('../queues');
        await enqueueCleanup();
    });

    logger.info(`[CleanupWorker] Cron scheduled: ${config.cron.cleanup}`);

    process.on('SIGTERM', async () => {
        logger.info('[CleanupWorker] Shutting down...');
        await worker.close();
        process.exit(0);
    });
}

startWorker().catch((err) => {
    logger.error('[CleanupWorker] Failed to start:', err);
    process.exit(1);
});
