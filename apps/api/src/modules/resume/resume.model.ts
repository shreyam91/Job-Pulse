import { Schema, model, Document } from 'mongoose';
import type { IResume } from './resume.types';

export interface ResumeDocument extends Omit<IResume, '_id'>, Document { }

const parsedResumeSchema = new Schema({
    rawText: { type: String, default: '' },
    skills: [{ type: String }],
    technologies: [{ type: String }],
    roles: [{ type: String }],
    experienceYears: { type: Number, default: 0 },
    education: [{ type: String }],
    summary: { type: String },
}, { _id: false });

const resumeSchema = new Schema<ResumeDocument>(
    {
        userId: { type: String, required: true, index: true },
        originalFileName: { type: String, required: true },
        filePath: { type: String, required: true },
        fileSize: { type: Number, required: true },
        parsedData: { type: parsedResumeSchema, required: true },
        uploadedAt: { type: Date, default: Date.now },
        isActive: { type: Boolean, default: true, index: true },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// One active resume per user
resumeSchema.index({ userId: 1, isActive: 1 });

export const ResumeModel = model<ResumeDocument>('Resume', resumeSchema);
