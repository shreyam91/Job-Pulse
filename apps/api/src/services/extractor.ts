import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../shared/config';
import logger from '../shared/logger';

const apiKey = process.env.GEMINI_API_KEY || 'mock-api-key';
const genAI = new GoogleGenerativeAI(apiKey);

export interface ExtractedEntities {
    personalInfo: {
        emails: string[];
        phones: string[];
    };
    skills: string[];
    normalized_skills: string[];
    experience: string[];
    education: string[];
    projects: string[];
}

/**
 * Extracts structured entities and normalizes skills using Gemini API.
 */
export async function extractEntities(text: string): Promise<ExtractedEntities> {
    try {
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-pro"
        });
        
        const prompt = `Extract the following entities from this text. For skills, provide both the raw extracted skills and a normalized version mapping to standard tech industry terms.
        
Return EXACTLY a JSON object with this structure:
{
    "personalInfo": {
        "emails": ["string"],
        "phones": ["string"]
    },
    "skills": ["string"],
    "normalized_skills": ["string"],
    "experience": ["string"],
    "education": ["string"],
    "projects": ["string"]
}

Text:
${text}`;
        
        const result = await model.generateContent(prompt);
        let jsonStr = result.response.text();
        
        // Strip markdown blocks if present
        if (jsonStr.startsWith('```json')) {
            jsonStr = jsonStr.substring(7);
        }
        if (jsonStr.startsWith('```')) {
            jsonStr = jsonStr.substring(3);
        }
        if (jsonStr.endsWith('```')) {
            jsonStr = jsonStr.substring(0, jsonStr.length - 3);
        }
        
        return JSON.parse(jsonStr.trim()) as ExtractedEntities;
    } catch (error) {
        logger.error('Error extracting entities with Gemini:', error);
        return {
            personalInfo: { emails: [], phones: [] },
            skills: [],
            normalized_skills: [],
            experience: [],
            education: [],
            projects: []
        };
    }
}
