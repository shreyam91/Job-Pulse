'use client';

import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Bookmark, BookmarkCheck, MapPin, Clock, Check } from 'lucide-react';
import type { Job, ApplicationStatus } from '@/types';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface JobCardProps {
  job: Job;
  onClick: () => void;
  isSelected?: boolean;
}

const STATUS_LABELS: Record<ApplicationStatus, { label: string; color: string }> = {
  applied: { label: 'Applied', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  interview: { label: 'Interview', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  rejected: { label: 'Rejected', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  offer: { label: 'Offer! 🎉', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
};

function MatchBadge({ score }: { score: number }) {
  if (score >= 80) return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-500/15 text-green-400 border border-green-500/25">
      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
      {score}% Match
    </span>
  );
  if (score >= 60) return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-500/15 text-yellow-400 border border-yellow-500/25">
      <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
      {score}% Match
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/5 text-gray-400 border border-white/10">
      <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
      {score}% Match
    </span>
  );
}

const WORK_MODE_STYLES: Record<string, string> = {
  remote: 'bg-emerald-500/10 text-emerald-400',
  hybrid: 'bg-amber-500/10 text-amber-400',
  onsite: 'bg-blue-500/10 text-blue-400',
};

export default function JobCard({ job, onClick, isSelected }: JobCardProps) {
  const { toggleSaveJob, isJobSaved, applicationStatuses } = useAppStore();
  const saved = isJobSaved(job._id);
  const status = applicationStatuses[job._id];
  const matchScore = job.analysis?.matchScore;

  const postedTime = (() => {
    try { return formatDistanceToNow(new Date(job.postedAt), { addSuffix: true }); }
    catch { return 'Recently'; }
  })();

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative rounded-xl border p-4 cursor-pointer transition-all duration-200',
        'hover:border-white/20 hover:bg-white/[0.02]',
        isSelected
          ? 'border-indigo-500/50 bg-indigo-600/10 shadow-lg shadow-indigo-600/10'
          : 'border-white/[0.06] bg-[#13151c]'
      )}
    >
      {/* Left accent */}
      <div className={cn(
        'absolute left-0 top-4 bottom-4 w-0.5 rounded-full transition-all duration-200',
        isSelected ? 'bg-indigo-500' : 'bg-transparent group-hover:bg-white/20'
      )} />

      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          {matchScore !== undefined && <div className="mb-2"><MatchBadge score={matchScore} /></div>}
          <h3 className="font-semibold text-sm text-white/90 truncate">{job.title}</h3>
          <p className="text-xs text-white/50 mt-0.5 truncate">{job.company}</p>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); toggleSaveJob(job._id); toast.success(saved ? 'Removed from saved' : 'Job saved!'); }}
          className="flex-shrink-0 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
        >
          {saved
            ? <BookmarkCheck className="w-4 h-4 text-indigo-400" />
            : <Bookmark className="w-4 h-4 text-white/30 group-hover:text-white/50 transition-colors" />
          }
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3 text-xs text-white/40">
        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
        <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium capitalize', WORK_MODE_STYLES[job.workMode] || 'bg-white/5 text-white/40')}>
          {job.workMode}
        </span>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{postedTime}</span>
      </div>

      {job.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {job.skills.slice(0, 5).map((skill) => (
            <span key={skill} className="px-2 py-0.5 rounded-md bg-white/5 text-white/50 text-xs border border-white/8 font-mono">
              {skill}
            </span>
          ))}
          {job.skills.length > 5 && (
            <span className="px-2 py-0.5 rounded-md text-white/30 text-xs">+{job.skills.length - 5}</span>
          )}
        </div>
      )}

      {status && (
        <div className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border', STATUS_LABELS[status].color)}>
          <Check className="w-3 h-3" />{STATUS_LABELS[status].label}
        </div>
      )}
    </div>
  );
}
