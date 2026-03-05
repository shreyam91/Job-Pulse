import { Schema, model, Document } from 'mongoose';
import type { IJobAnalysis } from './jobs.types';

export interface JobAnalysisDocument extends Omit<IJobAnalysis, '_id'>, Document { }

const jobAnalysisSchema = new Schema<JobAnalysisDocument>(
    {
        jobId: { type: String, required: true, index: true },
        resumeId: { type: String, required: true, index: true },
        matchScore: { type: Number, required: true, min: 0, max: 100 },
        atsScore: { type: Number, required: true, min: 0, max: 100 },
        finalScore: { type: Number, required: true, min: 0, max: 100 },
        matchedSkills: [{ type: String }],
        missingSkills: [{ type: String }],
        strengthSummary: { type: String, required: true },
        aiExplanation: { type: String, required: true },
        improvementSuggestion: { type: String, default: '' },
        matchBreakdown: {
            skillsAlignment: { type: Number, min: 0, max: 100, default: 0 },
            experienceFit: { type: Number, min: 0, max: 100, default: 0 },
            techStackMatch: { type: Number, min: 0, max: 100, default: 0 },
            roleRelevance: { type: Number, min: 0, max: 100, default: 0 },
        },
        analysedAt: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Composite unique index: one analysis per job+resume combo
jobAnalysisSchema.index({ jobId: 1, resumeId: 1 }, { unique: true });
jobAnalysisSchema.index({ resumeId: 1, finalScore: -1 });

export const JobAnalysisModel = model<JobAnalysisDocument>('JobAnalysis', jobAnalysisSchema);
