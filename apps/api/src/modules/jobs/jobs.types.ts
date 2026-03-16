export type WorkMode = 'remote' | 'hybrid' | 'onsite';
export type JobSource = 'wellfound' | 'ycombinator' | 'greenhouse' | 'lever' | 'manual';
export type ApplicationStatus = 'applied' | 'interview' | 'rejected' | 'offer';

export interface IJob {
    _id?: string;
    title: string;
    company: string;
    location: string;
    workMode: WorkMode;
    skills: string[];
    tags: string[];
    description: string;
    source: JobSource;
    sourceUrl: string;
    sourceUrlHash: string;
    postedAt: Date;
    scrapedAt: Date;
    isExpired: boolean;
    freshnessScore: number;
    companyQualityScore: number;
    employeeCount?: number;
    hasFunding?: boolean;
    salary?: {
        min?: number;
        max?: number;
        currency?: string;
    };
    experienceYears?: {
        min?: number;
        max?: number;
    };
}

export interface IJobAnalysis {
    _id?: string;
    jobId: string;
    resumeId: string;
    matchScore: number;
    atsScore: number;
    finalScore: number;
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
    analysedAt: Date;
}

export interface JobFilters {
    search?: string;
    techStack?: string[];
    location?: string;
    country?: string;
    workMode?: WorkMode[];
    experienceYears?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
    resumeId?: string;
}

export interface PaginatedJobs {
    jobs: IJob[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
