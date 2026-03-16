'use client';

import React from 'react';
import JobCard from '@/components/jobs/JobCard';
import JobList from '@/components/jobs/JobList';
import { ClipboardList } from 'lucide-react';
import type { Job } from '@/types';

interface JobContentProps {
  activeTab: 'all' | 'saved' | 'applied';
  groupedJobs: any;
  allJobs: Job[];
  isLoadingJobs: boolean;
  selectedJob: Job | null;
  onJobSelect: (job: Job) => void;
  appliedJobs: Job[];
  hasMore: boolean;
  filters: any;
  onFilterChange: (key: string, value: any) => void;
}

export default function JobContent({
  activeTab,
  groupedJobs,
  allJobs,
  isLoadingJobs,
  selectedJob,
  onJobSelect,
  appliedJobs,
  hasMore,
  filters,
  onFilterChange
}: JobContentProps) {
  if (activeTab === 'applied') {
    return (
      <div className="p-4 space-y-2">
        {appliedJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ClipboardList className="w-12 h-12 text-white/10 mb-3" />
            <p className="text-sm text-white/30">No applications tracked yet.</p>
            <p className="text-xs text-white/20 mt-1">Use the status tracker on any job card to track progress.</p>
          </div>
        ) : (
          appliedJobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onClick={() => onJobSelect(job)}
              isSelected={selectedJob?._id === job._id}
            />
          ))
        )}
      </div>
    );
  }

  return (
    <div className="pb-10">
      <JobList
        groupedJobs={groupedJobs}
        allJobs={allJobs}
        isLoading={isLoadingJobs && (filters.page || 1) === 1}
      />
      {hasMore && allJobs.length > 0 && (
        <div className="flex justify-center p-6">
          <button
            onClick={() => onFilterChange('page', (filters.page || 1) + 1)}
            disabled={isLoadingJobs}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/[0.03] text-white/50 text-sm font-medium hover:bg-white/[0.06] hover:text-white/80 transition-all border border-white/[0.08]"
          >
            {isLoadingJobs ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}
