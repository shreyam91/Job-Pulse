import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../../shared/config';
import logger from '../../shared/logger';
import type { IJob, IJobAnalysis } from '../jobs/jobs.types';
import type { IParsedResume } from '../resume/resume.types';
import { computeFinalScore, calculateFreshness, calculateCompanyScore } from '../../shared/utils';

interface AIMatchResult {
    matchScore: number;
    atsScore: number;
    matchedSkills: string[];
    missingSkills: string[];
    strengthSummary: string;
    aiExplanation: string;
    improvementSuggestion: string;
    matchBreakdown: {
        skillsAlignment: number;
        experienceFit: number;
        techStackMatch: number;
        roleRelevance: number;
    };
}

const MATCH_PROMPT_TEMPLATE = `
You are an expert ATS (Applicant Tracking System) and career consultant AI.

TASK: Analyze job-resume match with PRECISION and focus on ACTUAL skill alignment.

---
JOB TITLE: {JOB_TITLE}
COMPANY: {COMPANY}
JOB DESCRIPTION:
{JOB_DESCRIPTION}

REQUIRED SKILLS: {JOB_SKILLS}
---

CANDIDATE RESUME:
Skills: {RESUME_SKILLS}
Technologies: {RESUME_TECHNOLOGIES}
Roles: {RESUME_ROLES}
Experience: {EXPERIENCE_YEARS} years
Resume Text (excerpt): {RESUME_TEXT}
---

CRITICAL INSTRUCTIONS:
1. ONLY count skills that EXACTLY match between resume and job requirements
2. Prioritize hard skills (React, Next.js, TypeScript, etc.) over soft skills
3. Consider technology stack compatibility and framework experience
4. Be strict about missing core requirements
5. Experience years must align with role seniority level

SCORING CRITERIA:
- matchScore: Weight 40% - Exact skill matches, 20% - Experience fit, 20% - Tech stack, 20% - Role relevance
- DO NOT give high scores for partial matches or "related" skills
- Missing core required skills should significantly reduce score

Respond ONLY with valid JSON matching this exact schema (no markdown, no explanation outside JSON):
{
  "matchScore": <integer 0-100>,
  "atsScore": <integer 0-100>,
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "strengthSummary": "<2-3 sentence summary of candidate strengths>",
  "aiExplanation": "<3-4 sentence explanation of why this job matches or doesn't match candidate>",
  "improvementSuggestion": "<1-2 sentence actionable suggestion to improve match score>",
  "matchBreakdown": {
    "skillsAlignment": <integer 0-100>,
    "experienceFit": <integer 0-100>,
    "techStackMatch": <integer 0-100>,
    "roleRelevance": <integer 0-100>
  }
}
matchBreakdown: Granular breakdown of match dimensions.
`.trim();

export class AIMatchService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor() {
        this.genAI = new GoogleGenerativeAI(config.gemini.apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    }

    /**
     * Analyze a job against a resume using Gemini
     */
    async analyzeMatch(job: IJob, resume: IParsedResume): Promise<AIMatchResult> {
        const prompt = MATCH_PROMPT_TEMPLATE
            .replace('{JOB_TITLE}', job.title)
            .replace('{COMPANY}', job.company)
            .replace('{JOB_DESCRIPTION}', job.description.substring(0, 2000))
            .replace('{JOB_SKILLS}', job.skills.join(', '))
            .replace('{RESUME_SKILLS}', resume.skills.join(', '))
            .replace('{RESUME_TECHNOLOGIES}', resume.technologies.join(', '))
            .replace('{RESUME_ROLES}', resume.roles.join(', '))
            .replace('{EXPERIENCE_YEARS}', String(resume.experienceYears))
            .replace('{RESUME_TEXT}', resume.rawText.substring(0, 1500));

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Extract JSON from response (handles cases where model adds markdown)
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No JSON found in AI response');
            }

            const parsed = JSON.parse(jsonMatch[0]) as AIMatchResult;

            // Validate and clamp scores
            parsed.matchScore = Math.min(100, Math.max(0, Math.round(parsed.matchScore)));
            parsed.atsScore = Math.min(100, Math.max(0, Math.round(parsed.atsScore)));
            parsed.matchBreakdown.skillsAlignment = Math.min(100, Math.max(0, Math.round(parsed.matchBreakdown.skillsAlignment)));
            parsed.matchBreakdown.experienceFit = Math.min(100, Math.max(0, Math.round(parsed.matchBreakdown.experienceFit)));
            parsed.matchBreakdown.techStackMatch = Math.min(100, Math.max(0, Math.round(parsed.matchBreakdown.techStackMatch)));
            parsed.matchBreakdown.roleRelevance = Math.min(100, Math.max(0, Math.round(parsed.matchBreakdown.roleRelevance)));

            return parsed;
        } catch (error) {
            logger.error('AI match analysis failed:', error);
            // Return a safe fallback
            return this.fallbackAnalysis(job, resume);
        }
    }

    /**
     * Rule-based fallback when AI call fails
     */
    private fallbackAnalysis(job: IJob, resume: IParsedResume): AIMatchResult {
        const jobSkillsLower = (job.skills || []).map((s) => s.toLowerCase());
        const resumeSkillsLower = (resume.skills || []).map((s) => s.toLowerCase());

        // Only count EXACT matches, not partial matches
        const matchedSkills = (resume.skills || []).filter((s) =>
            jobSkillsLower.includes(s.toLowerCase())
        );
        const missingSkills = (job.skills || []).filter((s) =>
            !resumeSkillsLower.includes(s.toLowerCase())
        );

        // Be strict about matching - penalize heavily for missing core skills
        const skillsAlignment = Math.round(
            (matchedSkills.length / Math.max(job.skills?.length || 1, 1)) * 100
        );

        // Calculate experience fit based on years vs role requirements
        const experienceFit = resume.experienceYears >= 5 ? 85 : 
                          resume.experienceYears >= 3 ? 65 : 
                          resume.experienceYears >= 1 ? 45 : 25;

        const matchScore = Math.round(skillsAlignment * 0.7 + experienceFit * 0.3);

        return {
            matchScore,
            atsScore: Math.round(skillsAlignment * 0.85),
            matchedSkills,
            missingSkills,
            strengthSummary: matchedSkills.length > 0 
                ? `Matched core skills: ${matchedSkills.slice(0, 5).join(', ')}.`
                : `Candidate meets experience requirements (${resume.experienceYears} years).`,
            aiExplanation: `Profile matches ${matchScore}% of requirements based on keyword analysis. ${matchedSkills.length} key skills were found in your resume.`,
            improvementSuggestion: missingSkills.length > 0
                ? `Adding ${missingSkills.slice(0, 3).join(', ')} to your profile would improve your visibility for this role.`
                : 'Your profile is a strong technical match for this position.',
            matchBreakdown: {
                skillsAlignment,
                experienceFit,
                techStackMatch: skillsAlignment,
                roleRelevance: Math.round((skillsAlignment + experienceFit) / 2),
            },
        };
    }


    /**
     * Generate a cold email draft for a job
     */
    async generateColdEmail(
        job: IJob,
        resume: IParsedResume,
        candidateName: string
    ): Promise<{ subject: string; body: string }> {
        const prompt = `
Write a professional cold outreach email for a job application.

Job: ${job.title} at ${job.company}
Candidate: ${candidateName}
Candidate Skills: ${resume.skills.slice(0, 10).join(', ')}
Candidate Experience: ${resume.experienceYears} years

Write a concise, professional email (150-200 words).
Format response as JSON: { "subject": "...", "body": "..." }
Do NOT use markdown code blocks. Return only raw JSON.
`.trim();

        try {
            const result = await this.model.generateContent(prompt);
            const text = result.response.text();
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error('No JSON in cold email response');
            return JSON.parse(jsonMatch[0]);
        } catch (error) {
            logger.error('Cold email generation failed:', error);
            return {
                subject: `Application for ${job.title} at ${job.company}`,
                body: `Dear Hiring Manager,\n\nI am writing to express my interest in the ${job.title} position at ${job.company}. With ${resume.experienceYears} years of experience in ${resume.skills.slice(0, 3).join(', ')}, I believe I would be a strong fit for your team.\n\nI would love the opportunity to discuss how my background aligns with your needs.\n\nBest regards,\n${candidateName}`,
            };
        }
    }

    /**
     * Build full analysis record for storage
     */
    async buildFullAnalysis(
        jobId: string,
        resumeId: string,
        job: IJob,
        resume: IParsedResume
    ): Promise<Omit<IJobAnalysis, '_id' | 'analysedAt'>> {
        const aiResult = await this.analyzeMatch(job, resume);

        const freshness = calculateFreshness(job.postedAt);
        const companyQuality = calculateCompanyScore({
            hasFunding: job.hasFunding,
            employeeCount: job.employeeCount,
            isRemote: job.workMode === 'remote',
        });

        const finalScore = computeFinalScore({
            matchScore: aiResult.matchScore,
            freshness,
            companyQuality,
        });

        // Final clamp — ensure AI never returns out-of-range values that fail DB validation
        const clamp = (n: number) => Math.min(100, Math.max(0, Math.round(n)));
        aiResult.matchScore = clamp(aiResult.matchScore);
        aiResult.atsScore = clamp(aiResult.atsScore);
        aiResult.matchBreakdown.skillsAlignment = clamp(aiResult.matchBreakdown.skillsAlignment);
        aiResult.matchBreakdown.experienceFit = clamp(aiResult.matchBreakdown.experienceFit);
        aiResult.matchBreakdown.techStackMatch = clamp(aiResult.matchBreakdown.techStackMatch);
        aiResult.matchBreakdown.roleRelevance = clamp(aiResult.matchBreakdown.roleRelevance);

        return {
            jobId,
            resumeId,
            ...aiResult,
            finalScore,
        };

    }
}

export const aiMatchService = new AIMatchService();
