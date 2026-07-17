import { Router, Request, Response } from 'express';
import multer from 'multer';
import { addResumeJob } from '../../services/resumeProcessor';
import { supabase } from '../../shared/supabase';
import { calculateAtsScore, calculateSkillMatch } from '../../scoring/atsEngine';
import { explainATSScore, generateColdEmail } from '../../modules/ai/generator';
import { computeSimilarity } from '../../services/embedder';
import logger from '../../shared/logger';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const upload = multer({ dest: 'uploads/' });

/**
 * Endpoint to upload a resume for parsing.
 * Queues the job for background processing via BullMQ.
 */
router.post('/upload', upload.single('resume'), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No resume file uploaded' });
        }

        const userId = req.body.userId || '00000000-0000-0000-0000-000000000000'; // Fallback for testing
        const resumeId = uuidv4();
        
        // 1. Create a placeholder record in Supabase
        await supabase
            .from('resumes')
            .insert({
                id: resumeId,
                user_id: userId,
                file_url: req.file.path,
                raw_text: '',
                parsed_data: {}
            });

        // 2. Queue the job
        await addResumeJob(resumeId, `http://localhost:3000/${req.file.path}`, `job-${Date.now()}`);

        res.json({ message: 'Resume uploaded and queued for processing', resumeId });
    } catch (error) {
        logger.error('Error in /upload route:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * Endpoint to compute the ATS Score against a specific job.
 */
router.post('/analyze', async (req: Request, res: Response) => {
    try {
        const { resumeId, jobId } = req.body;

        if (!resumeId || !jobId) {
            return res.status(400).json({ error: 'Missing resumeId or jobId' });
        }

        // 1. Fetch resume and job data
        const { data: resumeData, error: resumeErr } = await supabase.from('resumes').select('*').eq('id', resumeId).single();
        const { data: jobData, error: jobErr } = await supabase.from('jobs').select('*').eq('id', jobId).single();

        if (resumeErr || !resumeData) return res.status(404).json({ error: 'Resume not found or still processing' });
        if (jobErr || !jobData) return res.status(404).json({ error: 'Job not found' });

        // 2. Compute components of the ATS score
        const resumeSkills = resumeData.parsed_data?.normalized_skills || [];
        const jobSkills = jobData.required_skills || [];
        const skillMatch = calculateSkillMatch(resumeSkills, jobSkills);

        // Fetch embeddings to calculate semantic similarity
        const { data: resumeEmb } = await supabase.from('embeddings').select('embedding').eq('resume_id', resumeId).single();
        const { data: jobEmb } = await supabase.from('embeddings').select('embedding').eq('job_id', jobId).single();
        
        let semanticSimilarity = 0;
        if (resumeEmb && jobEmb) {
            let resEmb = typeof resumeEmb.embedding === 'string' ? JSON.parse(resumeEmb.embedding) : resumeEmb.embedding;
            let jEmb = typeof jobEmb.embedding === 'string' ? JSON.parse(jobEmb.embedding) : jobEmb.embedding;
            // Convert array similarity (0-1) to score (0-100)
            semanticSimilarity = Math.round(computeSimilarity(resEmb, jEmb) * 100);
        }

        const scores = {
            skillMatch,
            semanticSimilarity,
            experienceMatch: 80, // Simplification
            keywordCoverage: 70, // Simplification
            formattingScore: 95, // Simplification
            educationScore: 100  // Simplification
        };

        const overallScore = calculateAtsScore(scores);

        // 3. Generate AI Explanation
        const aiExplanation = await explainATSScore(resumeData, jobData, scores, overallScore);
        const coldEmail = await generateColdEmail(resumeData, jobData, "Hiring Manager");

        // 4. Save analysis
        const { data: analysis, error: analysisErr } = await supabase
            .from('ats_analyses')
            .insert({
                resume_id: resumeId,
                job_id: jobId,
                overall_score: overallScore,
                skill_match_score: scores.skillMatch,
                semantic_similarity_score: scores.semanticSimilarity,
                experience_match_score: scores.experienceMatch,
                keyword_coverage_score: scores.keywordCoverage,
                formatting_score: scores.formattingScore,
                education_score: scores.educationScore,
                ai_explanation: aiExplanation,
                cold_email_draft: coldEmail
            })
            .select()
            .single();

        if (analysisErr) throw analysisErr;

        res.json({ success: true, analysis });
    } catch (error) {
        logger.error('Error in /analyze route:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
