'use client';

import React from 'react';
import JobCard from './JobCard';
import type { Job, GroupedJobs } from '@/types';
import { useAppStore } from '@/store/appStore';
import { TrendingUp, Target, Compass, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface JobListProps {
  groupedJobs: GroupedJobs | null;
  allJobs?: Job[];
  isLoading: boolean;
}

const SECTION_CONFIG = [
  { key: 'topMatches' as keyof GroupedJobs, label: 'Top Matches', sublabel: '80–100%', icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10', dot: 'bg-green-400' },
  { key: 'goodMatches' as keyof GroupedJobs, label: 'Good Matches', sublabel: '60–79%', icon: Target, color: 'text-yellow-400', bg: 'bg-yellow-500/10', dot: 'bg-yellow-400' },
  { key: 'stretchOpportunities' as keyof GroupedJobs, label: 'Stretch Opportunities', sublabel: '40–59%', icon: Compass, color: 'text-gray-400', bg: 'bg-white/5', dot: 'bg-gray-400' },
];

const SORT_OPTIONS = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'bestMatch', label: 'Best AI Match' },
  { value: 'freshness', label: 'Job Freshness' },
];

function sortJobs(jobs: Job[], sortBy: string): Job[] {
  const sorted = [...jobs];
  
  switch (sortBy) {
    case 'recent':
      return sorted.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
    case 'bestMatch':
      return sorted.sort((a, b) => (b.analysis?.finalScore || 0) - (a.analysis?.finalScore || 0));
    case 'freshness':
      return sorted.sort((a, b) => b.freshnessScore - a.freshnessScore);
    default:
      return sorted;
  }
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#13151c] p-4 space-y-3">
      <div className="h-4 w-24 rounded bg-white/5 animate-pulse" />
      <div className="h-5 w-3/4 rounded bg-white/5 animate-pulse" />
      <div className="h-4 w-1/2 rounded bg-white/5 animate-pulse" />
      <div className="flex gap-2">
        {[16,20,14].map((w) => <div key={w} className={`h-6 w-${w} rounded-md bg-white/5 animate-pulse`} />)}
      </div>
    </div>
  );
}

function EmptyState({ hasResume }: { hasResume: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-6">
      <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center mb-4">
        <Target className="w-8 h-8 text-indigo-400" />
      </div>
      <h3 className="text-lg font-semibold text-white/80 mb-2">
        {hasResume ? 'No matches yet' : 'Upload your resume to get started'}
      </h3>
      <p className="text-sm text-white/40 max-w-xs">
        {hasResume
          ? 'Click "Refresh Job Matches" in the sidebar to start AI analysis.'
          : 'Upload your PDF resume to see AI-ranked job matches tailored to your profile.'}
      </p>
    </div>
  );
}

export default function JobList({ groupedJobs, allJobs, isLoading }: JobListProps) {
  const { selectedJob, setSelectedJob, activeTab, savedJobs, resume, filters, setFilter } = useAppStore();

  // Check if this is "All Jobs" mode (no resume and no filters)
  const isAllJobsMode = !resume && !filters.search && 
    (!filters.techStack || filters.techStack.length === 0) && 
    !filters.location && 
    !filters.country && 
    (!filters.workMode || filters.workMode.length === 0) && 
    !filters.experienceYears;

  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (!groupedJobs) return <EmptyState hasResume={!!resume} />;

  return (
    <div>
      {/* Job Sections */}
      <div className="divide-y divide-white/4">
        {SECTION_CONFIG.map((section) => {
          let jobs: Job[] = groupedJobs[section.key] as Job[];

          if (activeTab === 'saved') {
            const savedIds = new Set(savedJobs.map((s) => s.jobId));
            jobs = jobs.filter((j) => savedIds.has(j._id));
          }

          if (!jobs?.length) return null;
          
          // Apply sorting
          jobs = sortJobs(jobs, filters.sortBy || 'recent');
          
          const Icon = section.icon;

          // Customize section header for "All Jobs" mode
          const isAllJobsSection = isAllJobsMode && section.key === 'topMatches';
          const sectionLabel = isAllJobsSection ? 'All Jobs' : section.label;
          const sectionSublabel = isAllJobsSection ? 'Latest opportunities' : section.sublabel;
          const sectionColor = isAllJobsSection ? 'text-blue-400' : section.color;
          const sectionBg = isAllJobsSection ? 'bg-blue-500/10' : section.bg;
          const sectionDot = isAllJobsSection ? 'bg-blue-400' : section.dot;

          return (
            <div key={section.key} className="p-4">
              <div className={cn('flex items-center gap-2 mb-3 px-2.5 py-1.5 rounded-lg w-fit', sectionBg)}>
                <Icon className={cn('w-3.5 h-3.5', sectionColor)} />
                <span className={cn('text-xs font-semibold', sectionColor)}>{sectionLabel}</span>
                <span className="text-xs text-white/30">{sectionSublabel}</span>
                <span className={cn('text-xs font-bold px-1.5 py-0.5 rounded-full', sectionBg, sectionColor)}>
                  {jobs.length}
                </span>
              </div>
              <div className="space-y-2">
                {jobs.map((job, idx) => (
                  <div key={`${section.key}-${job._id}-${idx}`} style={{ animationDelay: `${idx * 40}ms` }} className="animate-fade-in-up">
                    <JobCard
                      job={job}
                      onClick={() => setSelectedJob(job)}
                      isSelected={selectedJob?._id === job._id}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
