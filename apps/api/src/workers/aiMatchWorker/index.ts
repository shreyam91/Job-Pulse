import { Worker } from 'bullmq';
import { connectDatabase } from '../../shared/database';
import { getRedis, QUEUE_NAMES, type AIMatchJobData } from '../queues';
import { jobsService } from '../../modules/jobs/jobs.service';
import { resumeService } from '../../modules/resume/resume.service';
import { aiMatchService } from '../../modules/ai/aiMatch.service';
import logger from '../../shared/logger';

async function processAIMatchJob(job: any): Promise<void> {
    const { jobId, resumeId } = job.data as AIMatchJobData;
    logger.info(`[AIMatchWorker] Analyzing job ${jobId} vs resume ${resumeId}`);

    await job.updateProgress(10);

    // Step 1: Fetch job
    const jobDoc = await jobsService.getJobById(jobId);
    if (!jobDoc) throw new Error(`Job not found: ${jobId}`);

    await job.updateProgress(30);

    // Step 2: Fetch resume
    const resumeDoc = await resumeService.getResumeById(resumeId);
    if (!resumeDoc) throw new Error(`Resume not found: ${resumeId}`);

    await job.updateProgress(50);

    // Step 3: Run AI analysis
    const analysis = await aiMatchService.buildFullAnalysis(
        jobId,
        resumeId,
        jobDoc,
        resumeDoc.parsedData
    );

    await job.updateProgress(80);

    // Step 4: Store analysis
    await jobsService.upsertAnalysis(analysis);

    await job.updateProgress(100);
    logger.info(
        `[AIMatchWorker] Done. Job: ${jobDoc.title} @ ${jobDoc.company} | Score: ${analysis.matchScore}`
    );
}

async function startWorker(): Promise<void> {
    await connectDatabase();

    const worker = new Worker<AIMatchJobData>(
        QUEUE_NAMES.AI_MATCH,
        processAIMatchJob,
        {
            connection: getRedis() as any,
            concurrency: 3, // Process 3 AI analyses in parallel
            limiter: {
                max: 10,      // Max 10 jobs per duration
                duration: 1000 * 60, // per minute (Gemini rate limiting)
            },
        }
    );

    worker.on('completed', (job) => {
        logger.info(`[AIMatchWorker] Job ${job.id} completed`);
    });

    worker.on('failed', (job, err) => {
        logger.error(`[AIMatchWorker] Job ${job?.id} failed:`, err.message);
    });

    logger.info('[AIMatchWorker] Worker started (concurrency: 3)');

    process.on('SIGTERM', async () => {
        logger.info('[AIMatchWorker] Shutting down...');
        await worker.close();
        process.exit(0);
    });
}

startWorker().catch((err) => {
    logger.error('[AIMatchWorker] Failed to start:', err);
    process.exit(1);
});
