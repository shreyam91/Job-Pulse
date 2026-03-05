import IORedis from 'ioredis';
import { Queue, Worker, QueueEvents } from 'bullmq';
import config from '../../shared/config';
import logger from '../../shared/logger';

// Shared Redis connection
export const redisConnection = new IORedis({
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
    maxRetriesPerRequest: null, // Required by BullMQ
    enableReadyCheck: false,
});

redisConnection.on('connect', () => logger.info('Redis connected'));
redisConnection.on('error', (err) => logger.error('Redis error:', err));

// Queue names
export const QUEUE_NAMES = {
    JOB_SCRAPER: 'job-scraper',
    AI_MATCH: 'ai-match',
    CLEANUP: 'cleanup',
} as const;

// Default job options
export const DEFAULT_JOB_OPTIONS = {
    attempts: 3,
    backoff: {
        type: 'exponential' as const,
        delay: 2000,
    },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 50 },
};

// Create queues
export const jobScraperQueue = new Queue(QUEUE_NAMES.JOB_SCRAPER, {
    connection: redisConnection,
    defaultJobOptions: DEFAULT_JOB_OPTIONS,
});

export const aiMatchQueue = new Queue(QUEUE_NAMES.AI_MATCH, {
    connection: redisConnection,
    defaultJobOptions: DEFAULT_JOB_OPTIONS,
});

export const cleanupQueue = new Queue(QUEUE_NAMES.CLEANUP, {
    connection: redisConnection,
    defaultJobOptions: DEFAULT_JOB_OPTIONS,
});

// Job data types
export interface ScraperJobData {
    sources?: string[];
}

export interface AIMatchJobData {
    jobId: string;
    resumeId: string;
}

export interface CleanupJobData {
    tasks: ('dedup' | 'expire' | 'freshen')[];
}

/**
 * Queue helpers
 */
export async function enqueueAIMatch(jobId: string, resumeId: string): Promise<void> {
    await aiMatchQueue.add(
        'analyze',
        { jobId, resumeId } satisfies AIMatchJobData,
        { jobId: `ai-match-${jobId}-${resumeId}` }
    );
}

export async function enqueueScraperRun(sources?: string[]): Promise<void> {
    await jobScraperQueue.add('scrape', { sources } satisfies ScraperJobData);
}

export async function enqueueCleanup(): Promise<void> {
    await cleanupQueue.add('cleanup', {
        tasks: ['dedup', 'expire', 'freshen'],
    } satisfies CleanupJobData);
}
