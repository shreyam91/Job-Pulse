import { pipeline, env } from '@xenova/transformers';
import logger from '../shared/logger';

// Configure transformers to download models to a local cache directory and not use remote symlinks
env.localModelPath = './models';
env.allowRemoteModels = true; 

// Singleton pattern for the embedding pipeline
let embedderPipeline: any = null;

async function getEmbedder() {
    if (!embedderPipeline) {
        logger.info("Loading sentence-transformers/all-MiniLM-L6-v2 model...");
        // Use the feature-extraction pipeline which is suitable for sentence embeddings
        embedderPipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }
    return embedderPipeline;
}

/**
 * Generates a 384-dimensional vector embedding for the input text using all-MiniLM-L6-v2 in Node.js.
 */
export async function getEmbedding(text: string): Promise<number[]> {
    try {
        if (!text || text.trim() === '') {
            return new Array(384).fill(0.0);
        }

        const embedder = await getEmbedder();
        
        // Output is a Tensor. For feature-extraction with this model, shape is usually [1, seq_len, 384].
        // We typically want the mean pooling across tokens, which Xenova does by default if we pass pooling: 'mean'
        const output = await embedder(text, { pooling: 'mean', normalize: true });
        
        // output.data contains the flattened array.
        return Array.from(output.data);
    } catch (error) {
        logger.error('Error generating embedding:', error);
        return new Array(384).fill(0.0);
    }
}

/**
 * Computes cosine similarity between two embeddings.
 */
export function computeSimilarity(emb1: number[], emb2: number[]): number {
    if (emb1.length !== emb2.length) return 0.0;
    
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;
    
    for (let i = 0; i < emb1.length; i++) {
        dotProduct += emb1[i] * emb2[i];
        norm1 += emb1[i] * emb1[i];
        norm2 += emb2[i] * emb2[i];
    }
    
    if (norm1 === 0 || norm2 === 0) return 0.0;
    
    const similarity = dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
    return Math.max(0.0, Math.min(1.0, similarity));
}
