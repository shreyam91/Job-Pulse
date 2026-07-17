import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';

import { supabase } from '../shared/supabase';
import logger from '../shared/logger';
import config from '../shared/config';
import { extractTextFromPdf } from './pdfParser';
import { extractEntities } from './extractor';
import { getEmbedding } from './embedder';

// Redis connection
const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
});

// Create Queue
export const resumeQueue = new Queue('resumeProcessing', { connection });

// Function to add a resume processing job
export async function addResumeJob(resumeId: string, fileUrl: string, jobId: string) {
    await resumeQueue.add('process-resume', { resumeId, fileUrl, jobId });
}

// Setup Worker
const worker = new Worker('resumeProcessing', async (job: Job) => {
    const { resumeId, fileUrl, jobId } = job.data;
    logger.info(`Processing resume ${resumeId} for job ${jobId}`);

    try {
        // 1. Fetch the file (assuming fileUrl is accessible)
        // Note: For local files, we might need to adjust this depending on how the file is served.
        // If it's a local path from multer, we can just read it directly.
        // Assuming fileUrl contains the local path for this demo since we don't have a real storage bucket yet.
        const localPath = fileUrl.replace('http://localhost:3000/', '');
        
        // 2. Parse PDF and extract entities
        const raw_text = await extractTextFromPdf(localPath);
        const structured_data = await extractEntities(raw_text);
        
        // 3. Generate embedding
        const embedding = await getEmbedding(raw_text);

        // 4. Update the Resume in Supabase
        await supabase
            .from('resumes')
            .update({
                raw_text,
                parsed_data: structured_data as any
            })
            .eq('id', resumeId);

        // 5. Save embedding
        await supabase
            .from('embeddings')
            .insert({
                resume_id: resumeId,
                job_id: null,
                embedding,
                type: 'resume'
            });
            
        logger.info(`Successfully processed resume ${resumeId}`);
        return { success: true };
    } catch (error) {
        logger.error(`Error processing resume ${resumeId}:`, error);
        throw error;
    }
}, { connection });

worker.on('failed', (job, err) => {
    logger.error(`Job ${job?.id} failed:`, err);
});
