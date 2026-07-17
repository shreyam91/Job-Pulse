import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../../shared/config';
import logger from '../../shared/logger';
import { ScoringInputs } from '../../scoring/atsEngine';

// Note: The package.json uses @google/generative-ai so we use Gemini
const apiKey = process.env.GEMINI_API_KEY || 'mock-api-key';
const genAI = new GoogleGenerativeAI(apiKey);

export async function explainATSScore(resumeData: any, jobData: any, scores: ScoringInputs, overallScore: number): Promise<string> {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const prompt = `
    You are an expert ATS (Applicant Tracking System) analyst. 
    Explain why this resume received an overall ATS match score of ${overallScore}/100 for the following job.
    
    Scores Breakdown:
    - Skill Match: ${scores.skillMatch}
    - Semantic Similarity: ${scores.semanticSimilarity}
    - Experience Match: ${scores.experienceMatch}
    - Keyword Coverage: ${scores.keywordCoverage}
    - Formatting Score: ${scores.formattingScore}
    - Education Score: ${scores.educationScore}
    
    Job Description:
    ${jobData.description}
    
    Resume Data:
    ${JSON.stringify(resumeData)}
    
    Be concise, objective, and provide 3 actionable tips for improvement. Do not hallucinate.
    `;

    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        logger.error('Error generating ATS explanation:', error);
        return "Explanation could not be generated at this time.";
    }
}

export async function generateColdEmail(resumeData: any, jobData: any, recruiterName: string): Promise<string> {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const prompt = `
    Write a concise, professional cold email to a recruiter named ${recruiterName} for the role of ${jobData.title} at ${jobData.company}.
    Use the following resume data to highlight 1-2 highly relevant achievements.
    Do NOT invent or hallucinate any facts. Keep it under 150 words.
    
    Resume Data:
    ${JSON.stringify(resumeData)}
    `;

    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        logger.error('Error generating cold email:', error);
        return "Cold email could not be generated at this time.";
    }
}
