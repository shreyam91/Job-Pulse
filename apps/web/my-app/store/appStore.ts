import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Job, Resume, JobFilters, SavedJob, ApplicationStatus, GroupedJobs } from '@/types';

interface AppState {
    resume: Resume | null;
    setResume: (resume: Resume | null) => void;
    groupedJobs: GroupedJobs | null;
    setGroupedJobs: (jobs: GroupedJobs | null) => void;
    selectedJob: Job | null;
    setSelectedJob: (job: Job | null) => void;
    filters: JobFilters;
    setFilter: <K extends keyof JobFilters>(key: K, value: JobFilters[K]) => void;
    resetFilters: () => void;
    savedJobs: SavedJob[];
    toggleSaveJob: (jobId: string) => void;
    isJobSaved: (jobId: string) => boolean;
    applicationStatuses: Record<string, ApplicationStatus>;
    setApplicationStatus: (jobId: string, status: ApplicationStatus) => void;
    activeTab: 'all' | 'saved' | 'applied';
    setActiveTab: (tab: 'all' | 'saved' | 'applied') => void;
    isLoadingJobs: boolean;
    setIsLoadingJobs: (loading: boolean) => void;
    dashboardType: 'jobs' | 'interview';
    setDashboardType: (type: 'jobs' | 'interview') => void;
}

const DEFAULT_FILTERS: JobFilters = {
    search: '',
    techStack: [],
    location: '',
    country: '',
    workMode: [],
    experienceYears: '',
    sortBy: 'recent',
    page: 1,
};

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            resume: null,
            setResume: (resume) => set({ resume }),
            groupedJobs: null,
            setGroupedJobs: (groupedJobs) => set({ groupedJobs }),
            selectedJob: null,
            setSelectedJob: (selectedJob) => set({ selectedJob }),
            filters: DEFAULT_FILTERS,
            setFilter: (key, value) => set((state) => ({ 
                filters: { 
                    ...state.filters, 
                    [key]: value,
                    ...(key !== 'page' ? { page: 1 } : {})
                } 
            })),
            resetFilters: () => set({ filters: DEFAULT_FILTERS }),
            savedJobs: [],
            toggleSaveJob: (jobId) =>
                set((state) => {
                    const exists = state.savedJobs.find((s) => s.jobId === jobId);
                    if (exists) return { savedJobs: state.savedJobs.filter((s) => s.jobId !== jobId) };
                    return { savedJobs: [...state.savedJobs, { jobId, savedAt: new Date().toISOString() }] };
                }),
            isJobSaved: (jobId) => get().savedJobs.some((s) => s.jobId === jobId),
            applicationStatuses: {},
            setApplicationStatus: (jobId, status) =>
                set((state) => ({ applicationStatuses: { ...state.applicationStatuses, [jobId]: status } })),
            activeTab: 'all',
            setActiveTab: (activeTab) => set({ activeTab }),
            isLoadingJobs: false,
            setIsLoadingJobs: (isLoadingJobs) => set({ isLoadingJobs }),
            dashboardType: 'jobs',
            setDashboardType: (dashboardType) => set({ dashboardType }),
        }),
        {
            name: 'aijob-store',
            partialize: (state) => ({
                resume: state.resume,
                savedJobs: state.savedJobs,
                applicationStatuses: state.applicationStatuses,
                filters: state.filters,
                dashboardType: state.dashboardType,
            }),
        }
    )
);
