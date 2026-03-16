'use client';

import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  X, ExternalLink, MapPin, Briefcase, Clock, Bookmark, BookmarkCheck,
  ChevronRight, Mail, Check, Zap, Target, Brain
} from 'lucide-react';
import type { Job, ApplicationStatus } from '@/types';
import { useAppStore } from '@/store/appStore';
import { jobsApi } from '@/lib/apiServices';
import ColdEmailModal from '../email/ColdEmailModal';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const STATUS_OPTIONS: { value: ApplicationStatus; label: string; color: string }[] = [
  { value: 'applied', label: 'Applied', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { value: 'interview', label: 'Interview', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  { value: 'offer', label: 'Offer 🎉', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
];

function ProgressBar({ label, value, color = '#6172f3' }: { label: string; value: number; color?: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-white/50 font-medium">{label}</span>
        <span className="font-bold" style={{ color }}>{value}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }}
        />
      </div>
    </div>
  );
}

export default function JobDetailPanel() {
  const { selectedJob, setSelectedJob, resume, toggleSaveJob, isJobSaved, applicationStatuses, setApplicationStatus } = useAppStore();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  if (!selectedJob) {
    return (
      <div className="hidden lg:flex flex-col items-center justify-center h-full text-center p-10">
        <div className="w-20 h-20 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mb-5">
          <Brain className="w-10 h-10 text-indigo-400" />
        </div>
        <h3 className="text-base font-semibold text-white/70 mb-2">Select a job to view AI insights</h3>
        <p className="text-sm text-white/30 max-w-xs">
          Click any job card to see your AI match score, skill breakdown, and cold email generator.
        </p>
      </div>
    );
  }

  const job = selectedJob;
  const analysis = job.analysis;
  const isSaved = isJobSaved(job._id);
  const status = applicationStatuses[job._id];

  const postedTime = (() => {
    try { return formatDistanceToNow(new Date(job.postedAt), { addSuffix: true }); }
    catch { return 'Recently'; }
  })();

  const matchColor = (score: number) => score >= 80 ? '#12b76a' : score >= 60 ? '#f79009' : '#667085';
  const breakdownColor = (val: number) => val >= 80 ? '#12b76a' : val >= 60 ? '#f79009' : '#6172f3';

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#0f1117]">
      {/* Header */}
      <div className="flex-shrink-0 p-5 border-b border-white/[0.06]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-white/90 leading-tight mb-1">{job.title}</h2>
            <p className="text-sm font-semibold text-indigo-400">{job.company}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                toggleSaveJob(job._id);
                toast.success(isSaved ? 'Removed from saved jobs' : 'Job saved!');
              }}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              {isSaved ? <BookmarkCheck className="w-5 h-5 text-indigo-400" /> : <Bookmark className="w-5 h-5 text-white/30" />}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-3 text-xs text-white/40">
          <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
          <span className="flex items-center gap-1.5 capitalize"><Briefcase className="w-3.5 h-3.5" />{job.workMode}</span>
          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{postedTime}</span>
        </div>

        <div className="flex gap-2 mt-4">
          <a
            href={job.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
          >
            Apply Now <ExternalLink className="w-4 h-4" />
          </a>
          <button
            onClick={() => setShowEmailModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 text-sm font-medium transition-colors border border-white/10"
          >
            <Mail className="w-4 h-4" />
            Cold Email
          </button>
        </div>

        {/* Status tracker */}
        <div className="mt-3 relative">
          <button
            onClick={() => setStatusOpen(!statusOpen)}
            className={cn(
              'w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium border transition-colors',
              status
                ? STATUS_OPTIONS.find(s => s.value === status)?.color
                : 'bg-white/[0.03] text-white/40 border-white/10 hover:border-white/20'
            )}
          >
            <span>{status ? STATUS_OPTIONS.find(s => s.value === status)?.label : 'Track Application Status'}</span>
            <ChevronRight className={cn('w-3.5 h-3.5 transition-transform', statusOpen && 'rotate-90')} />
          </button>
          {statusOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#13151c] border border-white/10 rounded-xl overflow-hidden z-20 shadow-2xl">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setApplicationStatus(job._id, opt.value);
                    setStatusOpen(false);
                    toast.success(`Status updated to ${opt.label}`);
                  }}
                  className={cn('w-full flex items-center justify-between px-3 py-2.5 text-xs hover:bg-white/5 transition-colors', status === opt.value && 'bg-white/5')}
                >
                  <span className={cn('font-medium', opt.color.split(' ')[1])}>{opt.label}</span>
                  {status === opt.value && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {analysis ? (
          <>
            {/* Score cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/[0.06] bg-[#13151c] p-4 text-center">
                <div className="text-3xl font-bold mb-1" style={{ color: matchColor(analysis.matchScore) }}>
                  {analysis.matchScore}%
                </div>
                <p className="text-xs text-white/40">Match Score</p>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-[#13151c] p-4 text-center">
                <div className="text-3xl font-bold mb-1 text-indigo-400">{analysis.atsScore}%</div>
                <p className="text-xs text-white/40">ATS Score</p>
              </div>
            </div>

            {/* AI Explanation */}
            <div className="rounded-xl border border-white/[0.06] bg-[#13151c] p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-600/20 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-indigo-400" />
                </div>
                <h4 className="text-sm font-semibold text-white/80">Why This Job Matches You</h4>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">{analysis.aiExplanation}</p>
            </div>

            {/* Match Breakdown */}
            <div className="rounded-xl border border-white/[0.06] bg-[#13151c] p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Target className="w-4 h-4 text-purple-400" />
                </div>
                <h4 className="text-sm font-semibold text-white/80">Match Breakdown</h4>
              </div>
              <div className="space-y-3.5">
                <ProgressBar label="Skills Alignment" value={analysis.matchBreakdown.skillsAlignment} color={breakdownColor(analysis.matchBreakdown.skillsAlignment)} />
                <ProgressBar label="Experience Fit" value={analysis.matchBreakdown.experienceFit} color={breakdownColor(analysis.matchBreakdown.experienceFit)} />
                <ProgressBar label="Tech Stack Match" value={analysis.matchBreakdown.techStackMatch} color={breakdownColor(analysis.matchBreakdown.techStackMatch)} />
                <ProgressBar label="Role Relevance" value={analysis.matchBreakdown.roleRelevance} color={breakdownColor(analysis.matchBreakdown.roleRelevance)} />
              </div>
            </div>

            {/* Skills */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-green-500/20 bg-green-500/[0.04] p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Check className="w-4 h-4 text-green-400" />
                  <h4 className="text-xs font-semibold text-green-400">Matched Skills</h4>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.matchedSkills.slice(0, 8).map((skill) => (
                    <span key={skill} className="px-2 py-0.5 rounded-md bg-green-500/10 text-green-300 text-xs border border-green-500/20 font-mono">{skill}</span>
                  ))}
                  {!analysis.matchedSkills.length && <p className="text-xs text-green-700">None detected</p>}
                </div>
              </div>
              <div className="rounded-xl border border-red-500/20 bg-red-500/[0.04] p-4">
                <div className="flex items-center gap-2 mb-3">
                  <X className="w-4 h-4 text-red-400" />
                  <h4 className="text-xs font-semibold text-red-400">Missing Skills</h4>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.missingSkills.slice(0, 8).map((skill) => (
                    <span key={skill} className="px-2 py-0.5 rounded-md bg-red-500/10 text-red-300 text-xs border border-red-500/20 font-mono">{skill}</span>
                  ))}
                  {!analysis.missingSkills.length && <p className="text-xs text-red-700">None detected</p>}
                </div>
              </div>
            </div>

            {/* Improvement tip */}
            {analysis.improvementSuggestion && (
              <div className="rounded-xl border border-indigo-500/20 bg-indigo-600/[0.05] p-4">
                <div className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold text-indigo-400 mb-1">Improvement Tip</h4>
                    <p className="text-xs text-white/50 leading-relaxed">{analysis.improvementSuggestion}</p>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-xl border border-white/[0.06] bg-[#13151c] p-6 text-center">
            <Brain className="w-10 h-10 text-white/20 mx-auto mb-3" />
            <h4 className="text-sm font-semibold text-white/60 mb-1">No AI analysis yet</h4>
            <p className="text-xs text-white/30">Upload your resume and click &ldquo;Refresh Job Matches&rdquo; to get AI analysis.</p>
          </div>
        )}

        {/* Job description */}
        <div className="rounded-xl border border-white/[0.06] bg-[#13151c] p-5">
           <h4 className="text-sm font-bold text-white/80 mb-4 flex items-center gap-2">
             <Briefcase className="w-4 h-4 text-indigo-400" />
             Description
           </h4>
           <div 
             className="text-[13px] text-white/60 leading-relaxed font-sans prose prose-invert prose-p:my-2 prose-ul:my-2 prose-li:my-0.5 max-w-none"
             dangerouslySetInnerHTML={{ __html: job.description }}
           />
        </div>
      </div>

      {showEmailModal && (
        <ColdEmailModal job={job} resumeId={resume?.id || ''} onClose={() => setShowEmailModal(false)} />
      )}
    </div>
  );
}
