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
    private genAI: GoogleGenerativeAI;
    private geminiModel: any;

    constructor() {
        this.genAI = new GoogleGenerativeAI(config.gemini.apiKey);
        this.geminiModel = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    }

    // ===============================
    // 🔥 CORE AI CALL
    // ===============================
    private async callGemini(prompt: string, retries = 2): Promise<string> {
        try {
            const result = await this.geminiModel.generateContent(prompt);
            let text = result.response.text();

            // Clean JSON wrappers
            text = text.replace(/```json|```/g, '').trim();

            return text;
        } catch (error: any) {
            const isRateLimit = error.message?.includes('429');

            if (isRateLimit && retries > 0) {
                console.log(`Rate limited. Retrying... (${retries})`);
                await new Promise(r => setTimeout(r, 4000));
                return this.callGemini(prompt, retries - 1);
            }

            console.error('Gemini Error:', error);
            return '';
        }
    }

    private async generateAIResponse(prompt: string): Promise<string> {
        return this.callGemini(prompt);
    }

    // ===============================
    // 🧠 SAFE JSON PARSER
    // ===============================
    private safeParseJSON(content: string) {
        try {
            const clean = content.replace(/```json|```/g, '').trim();
            return JSON.parse(clean);
        } catch (err) {
            console.error("❌ JSON Parse Error:", content);
            throw err;
        }
    }

    // ===============================
    // 📊 SCORE CALCULATOR (REAL FIX)
    // ===============================
    private calculateFinalScore(categoryScores: any): number {
        if (!categoryScores) return 0;

        let total = 0;

        Object.values(categoryScores).forEach((c: any) => {
            total += (c.score / 100) * c.weight;
        });

        return Math.round(total);
    }

    // ===============================
    // 🔥 MAIN FUNCTION
    // ===============================
    async optimizeResume(data: OptimizeRequest): Promise<OptimizeResponse> {
        const { resume, jobDescription } = data;

        // ===============================
        // 1. KEYWORD EXTRACTION
        // ===============================
        let keywords: string[] = [];
        let keywordsString = '';

        try {
            const extractPrompt = EXTRACT_KEYWORDS_PROMPT.replace('{{JOB_DESCRIPTION}}', jobDescription);
            const raw = await this.generateAIResponse(extractPrompt);

            const parsed = this.safeParseJSON(raw);

            keywords = Object.values(parsed)
                .flat()
                .filter((k: any) => typeof k === 'string');

            keywordsString = keywords.join(', ');
        } catch (e) {
            console.error("Keyword extraction failed:", e);
        }

        console.log("🧠 KEYWORDS:", keywords);

        // ===============================
        // 2. EVALUATE BEFORE
        // ===============================
        let scoreBefore = 0;
        let missingKeywords: string[] = [];
        let suggestions: string[] = [];

        try {
            const evalPrompt = EVALUATE_RESUME_PROMPT
                .replace('{{RESUME_CONTENT}}', resume)
                .replace('{{JOB_DESCRIPTION}}', jobDescription)
                .replace('{{KEYWORDS}}', keywordsString);

            const raw = await this.generateAIResponse(evalPrompt);
            const parsed = this.safeParseJSON(raw);

            scoreBefore = this.calculateFinalScore(parsed.categoryScores);
            missingKeywords = parsed.missingKeywords || [];
            suggestions = parsed.improvementSuggestions || [];
        } catch (e) {
            console.error("Evaluation before failed:", e);
        }

        // ===============================
        // 3. OPTIMIZE RESUME
        // ===============================
        let improvedResumeHTML = resume;

        try {
            const optimizePrompt = OPTIMIZE_RESUME_PROMPT
                .replace('{{RESUME_CONTENT}}', resume)
                .replace('{{JOB_DESCRIPTION}}', jobDescription)
                .replace('{{KEYWORDS}}', keywordsString);

            const raw = await this.generateAIResponse(optimizePrompt);
            const blocks = this.safeParseJSON(raw);

            improvedResumeHTML = this.convertBlocksToHTML(blocks);
        } catch (e) {
            console.error("Optimization failed:", e);
        }

        // ===============================
        // 4. EVALUATE AFTER
        // ===============================
        let scoreAfter = scoreBefore;

        try {
            const evalPrompt = EVALUATE_RESUME_PROMPT
                .replace('{{RESUME_CONTENT}}', improvedResumeHTML)
                .replace('{{JOB_DESCRIPTION}}', jobDescription)
                .replace('{{KEYWORDS}}', keywordsString);

            const raw = await this.generateAIResponse(evalPrompt);
            const parsed = this.safeParseJSON(raw);

            scoreAfter = this.calculateFinalScore(parsed.categoryScores);
        } catch (e) {
            console.error("Evaluation after failed:", e);
        }

        console.log("📊 SCORE BEFORE:", scoreBefore);
        console.log("📈 SCORE AFTER:", scoreAfter);

        return {
            scoreBefore,
            scoreAfter,
            missingKeywords,
            improvedResume: improvedResumeHTML,
            suggestions
        };
    }

    // ===============================
    // 🧾 JSON → HTML (FOR TIPTAP)
    // ===============================
    private convertBlocksToHTML(blocks: any[]): string {
        return blocks.map(block => {

            if (block.type === 'header') {
                return `<h1>${block.name}</h1><p>${block.contact}</p>`;
            }

            if (block.type === 'section') {
                const items = block.content.map((c: string) => `<li>${c}</li>`).join('');
                return `<h2>${block.title}</h2><ul>${items}</ul>`;
            }

            if (block.type === 'experience' || block.type === 'education') {
                const roles = block.roles.map((r: any) => {
                    const bullets = r.bullets.map((b: string) => `<li>${b}</li>`).join('');
                    return `<p><strong>${r.title}</strong> — ${r.company || r.institution} | ${r.dates}</p><ul>${bullets}</ul>`;
                }).join('');

                return `<h2>${block.title}</h2>${roles}`;
            }

            return '';
        }).join('');
    }
}

export const resumeOptimizerService = new ResumeOptimizerService();