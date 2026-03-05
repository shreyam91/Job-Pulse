import { Schema, model, Document } from 'mongoose';
import type { IJob, WorkMode, JobSource } from './jobs.types';

export interface JobDocument extends Omit<IJob, '_id'>, Document { }

const jobSchema = new Schema<JobDocument>(
    {
        title: { type: String, required: true, index: true },
        company: { type: String, required: true, index: true },
        location: { type: String, required: true },
        workMode: {
            type: String,
            enum: ['remote', 'hybrid', 'onsite'] as WorkMode[],
            required: true,
            index: true,
        },
        skills: [{ type: String }],
        tags: [{ type: String }],
        description: { type: String, required: true },
        source: {
            type: String,
            enum: ['wellfound', 'ycombinator', 'greenhouse', 'lever', 'manual'] as JobSource[],
            required: true,
        },
        sourceUrl: { type: String, required: true },
        sourceUrlHash: { type: String, required: true, unique: true, index: true },
        postedAt: { type: Date, required: true, index: true },
        scrapedAt: { type: Date, default: Date.now },
        isExpired: { type: Boolean, default: false, index: true },
        freshnessScore: { type: Number, default: 50, min: 0, max: 100 },
        companyQualityScore: { type: Number, default: 50, min: 0, max: 100 },
        employeeCount: { type: Number },
        hasFunding: { type: Boolean },
        salary: {
            min: { type: Number },
            max: { type: Number },
            currency: { type: String, default: 'USD' },
        },
        experienceYears: {
            min: { type: Number },
            max: { type: Number },
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Compound indexes for filters
jobSchema.index({ skills: 1, workMode: 1, isExpired: 1 });
jobSchema.index({ tags: 1 });
jobSchema.index({ postedAt: -1, isExpired: 1 });
jobSchema.index({ source: 1, scrapedAt: -1 });

// Text search index
jobSchema.index({ title: 'text', company: 'text', skills: 'text', tags: 'text' });

export const JobModel = model<JobDocument>('Job', jobSchema);
