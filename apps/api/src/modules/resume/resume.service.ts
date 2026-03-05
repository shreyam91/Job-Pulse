import fs from 'fs';
import path from 'path';
// @ts-ignore — pdf-parse has incomplete types
import pdfParse from 'pdf-parse';
import { ResumeModel, type ResumeDocument } from './resume.model';
import type { IResume, IParsedResume } from './resume.types';
import logger from '../../shared/logger';
import { unique } from '../../shared/utils';

// Common tech skills dictionary
const TECH_SKILLS = [
    'react', 'nextjs', 'next.js', 'vue', 'angular', 'svelte', 'typescript', 'javascript', 'html', 'css',
    'node.js', 'nodejs', 'express', 'fastapi', 'django', 'flask', 'rails', 'spring', 'laravel',
    'python', 'java', 'go', 'golang', 'rust', 'c++', 'c#', 'php', 'ruby', 'kotlin', 'swift',
    'aws', 'gcp', 'azure', 'docker', 'kubernetes', 'terraform', 'ansible', 'jenkins', 'ci/cd',
    'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch', 'kafka', 'rabbitmq', 'sqlite',
    'graphql', 'rest', 'grpc', 'websocket', 'oauth', 'jwt',
    'pytorch', 'tensorflow', 'langchain', 'openai', 'llm', 'machine learning', 'ml', 'ai',
    'git', 'github', 'gitlab', 'jira', 'figma', 'linux', 'bash', 'zsh',
];

const ROLE_PATTERNS = [
    /software engineer/i, /frontend developer/i, /backend developer/i,
    /full.?stack/i, /devops/i, /data scientist/i, /ml engineer/i,
    /product manager/i, /designer/i, /qa engineer/i, /site reliability/i,
    /android developer/i, /ios developer/i, /cloud architect/i,
];

export class ResumeService {
    /**
     * Parse a PDF file and extract structured data
     */
    async parsePdf(filePath: string): Promise<IParsedResume> {
        const buffer = fs.readFileSync(filePath);
        const data = await pdfParse(buffer);
        const rawText = data.text;

        const skills = this.extractSkills(rawText);
        const technologies = this.extractTechnologies(rawText);
        const roles = this.extractRoles(rawText);
        const experienceYears = this.extractExperienceYears(rawText);
        const education = this.extractEducation(rawText);
        const summary = this.extractSummary(rawText);

        return {
            rawText,
            skills,
            technologies,
            roles,
            experienceYears,
            education,
            summary,
        };
    }

    private extractSkills(text: string): string[] {
        const found: string[] = [];
        const lowerText = text.toLowerCase();

        for (const skill of TECH_SKILLS) {
            if (lowerText.includes(skill.toLowerCase())) {
                found.push(skill);
            }
        }

        // Also look for skills section
        const skillsMatch = text.match(/skills?[:\s\n]+([^\n]{10,200})/i);
        if (skillsMatch) {
            const extraSkills = skillsMatch[1]
                .split(/[,|•·\n]/)
                .map((s) => s.trim())
                .filter((s) => s.length > 1 && s.length < 30);
            found.push(...extraSkills);
        }

        return unique(found).slice(0, 30);
    }

    private extractTechnologies(text: string): string[] {
        return this.extractSkills(text).filter((s) =>
            TECH_SKILLS.some((t) => t.toLowerCase() === s.toLowerCase())
        );
    }

    private extractRoles(text: string): string[] {
        const roles: string[] = [];
        for (const pattern of ROLE_PATTERNS) {
            const match = text.match(pattern);
            if (match) roles.push(match[0]);
        }
        return unique(roles);
    }

    private extractExperienceYears(text: string): number {
        // Look for patterns like "5+ years", "3 years of experience"
        const patterns = [
            /(\d+)\+?\s*years?\s*of\s*(?:professional\s*)?experience/i,
            /experience[:\s]+(\d+)\+?\s*years?/i,
            /(\d+)\+?\s*years?\s*(?:of\s*)?(?:work|professional|industry)/i,
        ];

        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match) return parseInt(match[1], 10);
        }

        // Fallback: count job entries by date ranges
        const dateRanges = text.match(/\b(20\d\d|19\d\d)\s*[-–]\s*(20\d\d|present|current)/gi);
        if (dateRanges) return Math.min(dateRanges.length * 2, 15);

        return 0;
    }

    private extractEducation(text: string): string[] {
        const degreePatterns = [
            /\b(B\.?S\.?|B\.?E\.?|B\.?Tech\.?|Bachelor[s]?)\b[^,\n]{0,60}/gi,
            /\b(M\.?S\.?|M\.?E\.?|M\.?Tech\.?|Master[s]?)\b[^,\n]{0,60}/gi,
            /\b(Ph\.?D\.?|Doctor)\b[^,\n]{0,60}/gi,
        ];
        const edu: string[] = [];
        for (const pattern of degreePatterns) {
            const matches = text.match(pattern);
            if (matches) edu.push(...matches.map((m) => m.trim()));
        }
        return unique(edu).slice(0, 5);
    }

    private extractSummary(text: string): string {
        const summaryMatch = text.match(
            /(?:summary|objective|profile)[:\s\n]+([^\n]{50,500})/i
        );
        return summaryMatch ? summaryMatch[1].trim() : '';
    }

    /**
     * Upload and save a resume for a user
     */
    async uploadResume(
        userId: string,
        file: Express.Multer.File
    ): Promise<ResumeDocument> {
        // Deactivate existing resume
        await ResumeModel.updateMany({ userId }, { $set: { isActive: false } });

        // Parse PDF
        const parsedData = await this.parsePdf(file.path);

        const resume = await ResumeModel.create({
            userId,
            originalFileName: file.originalname,
            filePath: file.path,
            fileSize: file.size,
            parsedData,
            uploadedAt: new Date(),
            isActive: true,
        });

        logger.info(`Resume uploaded for user ${userId}: ${file.originalname}`);
        return resume;
    }

    /**
     * Get the active resume for a user
     */
    async getActiveResume(userId: string): Promise<ResumeDocument | null> {
        return ResumeModel.findOne({ userId, isActive: true });
    }

    /**
     * Get a resume by ID
     */
    async getResumeById(id: string): Promise<ResumeDocument | null> {
        return ResumeModel.findById(id);
    }

    /**
     * Delete a resume file and its record
     */
    async deleteResume(id: string, userId: string): Promise<boolean> {
        const resume = await ResumeModel.findOne({ _id: id, userId });
        if (!resume) return false;

        if (fs.existsSync(resume.filePath)) {
            fs.unlinkSync(resume.filePath);
        }

        await resume.deleteOne();
        return true;
    }
}

export const resumeService = new ResumeService();
