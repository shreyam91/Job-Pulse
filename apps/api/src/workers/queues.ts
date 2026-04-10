import IORedis from 'ioredis';
import { Queue, Worker, QueueEvents } from 'bullmq';
import config from '../shared/config';
import logger from '../shared/logger';

// ─── Redis Connection (lazy & optional) ─────────────────────────────────────
let redisConnection: IORedis | null = null;
let redisAvailable = false;

function getRedis(): IORedis {
    if (!redisConnection) {
        redisConnection = new IORedis({
            host: config.redis.host,
            port: config.redis.port,
            password: config.redis.password,
            tls: config.redis.tls ? {} : undefined,
            maxRetriesPerRequest: null,
            enableReadyCheck: false,
            retryStrategy(times) {
                if (times > 3) {
                    logger.warn('[Redis] Max retries reached, giving up');
                    return null; // stop retrying
                }
                return Math.min(times * 200, 2000);
            },
            lazyConnect: true,
        });

        redisConnection.on('connect', () => {
            redisAvailable = true;
            logger.info('[Redis] Connected to Upstash');
        });
        redisConnection.on('error', (err) => {
            redisAvailable = false;
            logger.warn(`[Redis] Connection error (queues disabled): ${err.message}`);
        });
        redisConnection.on('close', () => {
            redisAvailable = false;
        });
    }
    return redisConnection;
}

export { getRedis, redisAvailable };

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

// ─── Lazy queue creation ────────────────────────────────────────────────────
let _jobScraperQueue: Queue | null = null;
let _aiMatchQueue: Queue | null = null;
let _cleanupQueue: Queue | null = null;

function getQueue(name: string): Queue | null {
    try {
        const redis = getRedis();
        return new Queue(name, {
            connection: redis as any,
            defaultJobOptions: DEFAULT_JOB_OPTIONS,
        });
    } catch (err) {
        logger.warn(`[Queue] Failed to create queue ${name}: ${(err as Error).message}`);
        return null;
    }
}

export function getJobScraperQueue(): Queue | null {
    if (!_jobScraperQueue) _jobScraperQueue = getQueue(QUEUE_NAMES.JOB_SCRAPER);
    return _jobScraperQueue;
}

export function getAiMatchQueue(): Queue | null {
    if (!_aiMatchQueue) _aiMatchQueue = getQueue(QUEUE_NAMES.AI_MATCH);
    return _aiMatchQueue;
}

export function getCleanupQueue(): Queue | null {
    if (!_cleanupQueue) _cleanupQueue = getQueue(QUEUE_NAMES.CLEANUP);
    return _cleanupQueue;
}

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
 * Queue helpers — gracefully no-op when Redis is unavailable
 */
export async function enqueueAIMatch(jobId: string, resumeId: string): Promise<void> {
    const queue = getAiMatchQueue();
    if (!queue) {
        logger.warn('[Queue] AI Match queue unavailable — skipping enqueue');
        return;
    }
    await queue.add(
        'analyze',
        { jobId, resumeId } satisfies AIMatchJobData,
        { jobId: `ai-match-${jobId}-${resumeId}` }
    );
}

export async function enqueueScraperRun(sources?: string[]): Promise<void> {
    const queue = getJobScraperQueue();
    if (!queue) {
        logger.warn('[Queue] Scraper queue unavailable — skipping enqueue');
        return;
    }
    await queue.add('scrape', { sources } satisfies ScraperJobData);
}

export async function enqueueCleanup(): Promise<void> {
    const queue = getCleanupQueue();
    if (!queue) {
        logger.warn('[Queue] Cleanup queue unavailable — skipping enqueue');
        return;
    }
    await queue.add('cleanup', {
        tasks: ['dedup', 'expire', 'freshen'],
    } satisfies CleanupJobData);
}
