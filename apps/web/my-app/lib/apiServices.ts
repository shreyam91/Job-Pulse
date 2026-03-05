import api from './api';
import type { Job, GroupedJobs, JobAnalysis, Resume, AnalyticsData, JobFilters, ColdEmail } from '@/types';

export const jobsApi = {
    getJobs: async (filters: Partial<JobFilters> & { page?: number; limit?: number }) => {
        const params = new URLSearchParams();
        if (filters.search) params.set('search', filters.search);
        if (filters.techStack?.length) params.set('techStack', filters.techStack.join(','));
        if (filters.workMode?.length) params.set('workMode', filters.workMode.join(','));
        if (filters.location) params.set('location', filters.location);
        if (filters.country) params.set('country', filters.country);
        if (filters.experienceYears) params.set('experienceYears', filters.experienceYears);
        if (filters.page) params.set('page', String(filters.page));
        if (filters.limit) params.set('limit', String(filters.limit));
        const res = await api.get(`/jobs?${params.toString()}`);
        return res.data.data;
    },

    getRankedJobs: async (resumeId: string, filters?: Partial<JobFilters>): Promise<GroupedJobs> => {
        const params = new URLSearchParams({ resumeId });
        if (filters?.search) params.set('search', filters.search);
        if (filters?.workMode?.length) params.set('workMode', filters.workMode.join(','));
        const res = await api.get(`/jobs/ranked?${params.toString()}`);
        return res.data.data;
    },

    getJobById: async (id: string): Promise<Job> => {
        const res = await api.get(`/jobs/${id}`);
        return res.data.data;
    },

    getJobAnalysis: async (jobId: string, resumeId: string): Promise<JobAnalysis | null> => {
        try {
            const res = await api.get(`/jobs/${jobId}/analysis?resumeId=${resumeId}`);
            return res.data.data;
        } catch { return null; }
    },

    triggerAnalysis: async (jobId: string, resumeId: string): Promise<void> => {
        await api.post(`/jobs/${jobId}/analyze`, { resumeId });
    },

    refreshJobs: async (): Promise<void> => {
        await api.post('/jobs/refresh');
    },

    generateColdEmail: async (jobId: string, resumeId: string, candidateName: string): Promise<ColdEmail> => {
        const res = await api.post(`/jobs/${jobId}/cold-email`, { resumeId, candidateName });
        return res.data.data;
    },

    getAnalytics: async (): Promise<AnalyticsData> => {
        const res = await api.get('/jobs/analytics');
        return res.data.data;
    },
};

export const resumeApi = {
    upload: async (file: File): Promise<Resume> => {
        const formData = new FormData();
        formData.append('resume', file);
        const res = await api.post('/resume/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data.data;
    },

    getActive: async (): Promise<Resume | null> => {
        const res = await api.get('/resume/active');
        return res.data.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/resume/${id}`);
    },
};
