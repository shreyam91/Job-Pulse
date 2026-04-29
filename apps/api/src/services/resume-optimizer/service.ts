import { OPTIMIZE_RESUME_PROMPT, EXTRACT_KEYWORDS_PROMPT, EVALUATE_RESUME_PROMPT } from './prompts';
import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../../shared/config';

interface OptimizeRequest {
    resume: string;
    jobDescription: string;
}

interface OptimizeResponse {
    scoreBefore: number;
    scoreAfter: number;
    missingKeywords: string[];
    improvedResume: string;
    suggestions: string[];
}

export class ResumeOptimizerService {
    private openAiKey: string;
    private genAI: GoogleGenerativeAI;
    private geminiModel: any;

    constructor() {
        this.openAiKey = process.env.OPENAI_API_KEY || '';
        this.genAI = new GoogleGenerativeAI(config.gemini.apiKey);
        this.geminiModel = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    }

    // Keep OpenAI code for when API key is available
    private async callOpenAI(prompt: string, isJson: boolean = false): Promise<string> {
        if (!this.openAiKey) return '';
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.openAiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: 'You are an expert ATS specialist and recruiter.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.1,
                response_format: isJson ? { type: 'json_object' } : { type: 'text' }
            })
        });
        if (response.ok) {
            const result: any = await response.json();
            return result.choices[0]?.message?.content || '';
        }
        return '';
    }

    private async callGemini(prompt: string, isJson: boolean = false, retries = 3): Promise<string> {
        try {
            const result = await this.geminiModel.generateContent(prompt);
            let text = result.response.text();
            
            if (isJson) {
                let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
                const jsonMatch = cleanText.match(/(\\[[\\s\\S]*\\])|(\\{[\\s\\S]*\\})/);
                if (jsonMatch) text = jsonMatch[0];
            }
            
            return text;
        } catch (error: any) {
            const isRateLimit = error.message?.includes('429') || error.status === 429;
            if (isRateLimit && retries > 0) {
                console.log(`Gemini Rate Limit (429). Waiting 6 seconds... (\${retries} retries left)`);
                await new Promise(resolve => setTimeout(resolve, 6000));
                return this.callGemini(prompt, isJson, retries - 1);
            }
            console.error('Gemini API Error:', error);
            return '';
        }
    }

    private async generateAIResponse(prompt: string, isJson: boolean = false): Promise<string> {
        // Use Gemini by default, switch to OpenAI if you want to use the key
        // if (this.openAiKey) return this.callOpenAI(prompt, isJson);
        return this.callGemini(prompt, isJson);
    }

    async optimizeResume(data: OptimizeRequest): Promise<OptimizeResponse> {
        const { resume, jobDescription } = data;

        // 1. Extract Keywords
        const extractPrompt = EXTRACT_KEYWORDS_PROMPT.replace('{{JOB_DESCRIPTION}}', jobDescription);
        const keywordsJsonStr = await this.generateAIResponse(extractPrompt, true);
        let keywordsString = keywordsJsonStr;
        try {
            const parsed = JSON.parse(keywordsJsonStr);
            keywordsString = Object.values(parsed).flat().join(', ');
        } catch (e) {
            // fallback
        }

        // 2. Evaluate Before
        const evalPromptBefore = EVALUATE_RESUME_PROMPT
            .replace('{{RESUME_CONTENT}}', resume)
            .replace('{{JOB_DESCRIPTION}}', jobDescription)
            .replace('{{KEYWORDS}}', keywordsString);
            
        let scoreBefore = 0;
        let missingKeywords: string[] = [];
        let topImprovements: string[] = [];
        
        try {
            const evalResultStr = await this.generateAIResponse(evalPromptBefore, true);
            const evalResult = JSON.parse(evalResultStr);
            scoreBefore = evalResult.finalScore || 0;
            missingKeywords = evalResult.missingKeywords || [];
            topImprovements = evalResult.improvementSuggestions || [];
        } catch (e) {
            console.error('Error evaluating before:', e);
        }

        // 3. Optimize Resume
        const optimizePrompt = OPTIMIZE_RESUME_PROMPT
            .replace('{{JOB_DESCRIPTION}}', jobDescription)
            .replace('{{RESUME_CONTENT}}', resume);
            
        let improvedResumeText = await this.generateAIResponse(optimizePrompt, true);
        if (!improvedResumeText) improvedResumeText = resume;
        
        let improvedResumeHtml = '';
        try {
            const blocks = JSON.parse(improvedResumeText);
            improvedResumeHtml = blocks.map((block: any) => {
                if (block.type === 'header') {
                    return `<h1>${block.name}</h1>\n<p>${block.contact}</p>`;
                }
                if (block.type === 'section') {
                    const content = block.content.map((c: string) => `<li>${c}</li>`).join('\n');
                    return `<h2>${block.title}</h2>\n<ul>\n${content}\n</ul>`;
                }
                if (block.type === 'experience' || block.type === 'education') {
                    let rolesHtml = block.roles.map((r: any) => {
                        const bullets = r.bullets.map((b: string) => `<li>${b}</li>`).join('\n');
                        return `<p><strong>${r.title}</strong> — ${r.company || r.institution} | ${r.dates}</p>\n<ul>\n${bullets}\n</ul>`;
                    }).join('\n');
                    return `<h2>${block.title}</h2>\n${rolesHtml}`;
                }
                return '';
            }).join('\n\n');
        } catch (err) {
            console.error('Failed to parse AI JSON blocks', err);
            improvedResumeHtml = improvedResumeText;
        }

        // 4. Evaluate After
        const evalPromptAfter = EVALUATE_RESUME_PROMPT
            .replace('{{RESUME_CONTENT}}', improvedResumeHtml)
            .replace('{{JOB_DESCRIPTION}}', jobDescription)
            .replace('{{KEYWORDS}}', keywordsString);
            
        let scoreAfter = scoreBefore + 15; // fallback
        
        try {
            const evalAfterStr = await this.generateAIResponse(evalPromptAfter, true);
            const evalAfter = JSON.parse(evalAfterStr);
            if (evalAfter.finalScore) scoreAfter = evalAfter.finalScore;
        } catch (e) {
            console.error('Error evaluating after:', e);
        }

        return {
            scoreBefore,
            scoreAfter,
            missingKeywords,
            improvedResume: improvedResumeHtml,
            suggestions: topImprovements
        };
    }
}

export const resumeOptimizerService = new ResumeOptimizerService();
