export type WorkMode = 'remote' | 'hybrid' | 'onsite';
export type ApplicationStatus = 'applied' | 'interview' | 'rejected' | 'offer';

export interface Job {
    _id: string;
    title: string;
    company: string;
    location: string;
    workMode: WorkMode;
    skills: string[];
    tags: string[];
    description: string;
    source: string;
    sourceUrl: string;
    postedAt: string;
    scrapedAt: string;
    freshnessScore: number;
    companyQualityScore: number;
    salary?: { min?: number; max?: number; currency?: string };
    experienceYears?: { min?: number; max?: number };
    analysis?: JobAnalysis;
}

export interface JobAnalysis {
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
}

export interface GroupedJobs {
    topMatches: Job[];
    goodMatches: Job[];
    stretchOpportunities: Job[];
}

export interface Resume {
    id: string;
    fileName: string;
    fileSize: number;
    parsedData: ParsedResume;
    uploadedAt: string;
}

export interface ParsedResume {
    skills: string[];
    technologies: string[];
    roles: string[];
    experienceYears: number;
    education: string[];
    summary?: string;
}

export interface JobFilters {
    search: string;
    techStack: string[];
    location: string;
    country: string;
    workMode: WorkMode[];
    experienceYears: string;
}

export interface AnalyticsData {
    scrapedToday: number;
    totalJobs: number;
    workModeBreakdown: Record<string, number>;
    topCategories: { name: string; count: number }[];
}

export interface SavedJob {
    jobId: string;
    savedAt: string;
    status?: ApplicationStatus;
}

export interface ColdEmail {
    subject: string;
    body: string;
}
