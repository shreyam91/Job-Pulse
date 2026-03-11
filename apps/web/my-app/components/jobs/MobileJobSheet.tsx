'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ExternalLink, MapPin, Briefcase, Clock, Bookmark, BookmarkCheck,
  ChevronRight, Mail, Check, Zap, Target, Brain, ChevronDown
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { ApplicationStatus } from '@/types';
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

export default function MobileJobSheet() {
  const { selectedJob, setSelectedJob, resume, toggleSaveJob, isJobSaved, applicationStatuses, setApplicationStatus } = useAppStore();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  // Only render on mobile (lg:hidden)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (!isMobile) return null;

  const job = selectedJob;

  const matchColor = (score: number) => score >= 80 ? '#12b76a' : score >= 60 ? '#f79009' : '#667085';
  const breakdownColor = (val: number) => val >= 80 ? '#12b76a' : val >= 60 ? '#f79009' : '#6172f3';

  return (
    <>
      <AnimatePresence>
        {job && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setSelectedJob(null)}
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-50 lg:hidden"
              style={{ maxHeight: '90vh' }}
            >
              <div className="bg-[#0f1117] rounded-t-3xl border-t border-x border-white/[0.08] flex flex-col" style={{ maxHeight: '90vh' }}>
                {/* Drag handle */}
                <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
                  <div className="w-10 h-1 rounded-full bg-white/20" />
                </div>

                {/* Header */}
                <div className="flex-shrink-0 px-5 pb-4 border-b border-white/[0.06]">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-base font-bold text-white/90 leading-tight mb-0.5">{job.title}</h2>
                      <p className="text-sm font-semibold text-indigo-400">{job.company}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          toggleSaveJob(job._id);
                          toast.success(isJobSaved(job._id) ? 'Removed from saved' : 'Job saved!');
                        }}
                        className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        {isJobSaved(job._id) ? <BookmarkCheck className="w-5 h-5 text-indigo-400" /> : <Bookmark className="w-5 h-5 text-white/30" />}
                      </button>
                      <button onClick={() => setSelectedJob(null)} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                        <X className="w-5 h-5 text-white/30" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-2.5 text-xs text-white/40">
                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
                    <span className="flex items-center gap-1.5 capitalize"><Briefcase className="w-3.5 h-3.5" />{job.workMode}</span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {(() => { try { return formatDistanceToNow(new Date(job.postedAt), { addSuffix: true }); } catch { return 'Recently'; } })()}
                    </span>
                  </div>

                  <div className="flex gap-2 mt-3.5">
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
                    </button>
                  </div>
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4" style={{ maxHeight: 'calc(90vh - 220px)' }}>
                  {job.analysis ? (
                    <>
                      {/* Score cards */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl border border-white/[0.06] bg-[#13151c] p-4 text-center">
                          <div className="text-3xl font-bold mb-1" style={{ color: matchColor(job.analysis.matchScore) }}>
                            {job.analysis.matchScore}%
                          </div>
                          <p className="text-xs text-white/40">Match Score</p>
                        </div>
                        <div className="rounded-xl border border-white/[0.06] bg-[#13151c] p-4 text-center">
                          <div className="text-3xl font-bold mb-1 text-indigo-400">{job.analysis.atsScore}%</div>
                          <p className="text-xs text-white/40">ATS Score</p>
                        </div>
                      </div>

                      {/* AI Explanation */}
                      <div className="rounded-xl border border-white/[0.06] bg-[#13151c] p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-7 h-7 rounded-lg bg-indigo-600/20 flex items-center justify-center">
                            <Brain className="w-4 h-4 text-indigo-400" />
                          </div>
                          <h4 className="text-sm font-semibold text-white/80">Why This Matches</h4>
                        </div>
                        <p className="text-xs text-white/50 leading-relaxed">{job.analysis.aiExplanation}</p>
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
                          <ProgressBar label="Skills Alignment" value={job.analysis.matchBreakdown.skillsAlignment} color={breakdownColor(job.analysis.matchBreakdown.skillsAlignment)} />
                          <ProgressBar label="Experience Fit" value={job.analysis.matchBreakdown.experienceFit} color={breakdownColor(job.analysis.matchBreakdown.experienceFit)} />
                          <ProgressBar label="Tech Stack Match" value={job.analysis.matchBreakdown.techStackMatch} color={breakdownColor(job.analysis.matchBreakdown.techStackMatch)} />
                          <ProgressBar label="Role Relevance" value={job.analysis.matchBreakdown.roleRelevance} color={breakdownColor(job.analysis.matchBreakdown.roleRelevance)} />
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl border border-green-500/20 bg-green-500/[0.04] p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Check className="w-4 h-4 text-green-400" />
                            <h4 className="text-xs font-semibold text-green-400">Matched</h4>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {job.analysis.matchedSkills.slice(0, 6).map((skill) => (
                              <span key={skill} className="px-2 py-0.5 rounded-md bg-green-500/10 text-green-300 text-[10px] border border-green-500/20 font-mono">{skill}</span>
                            ))}
                            {!job.analysis.matchedSkills.length && <p className="text-[10px] text-green-700">None</p>}
                          </div>
                        </div>
                        <div className="rounded-xl border border-red-500/20 bg-red-500/[0.04] p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <X className="w-4 h-4 text-red-400" />
                            <h4 className="text-xs font-semibold text-red-400">Missing</h4>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {job.analysis.missingSkills.slice(0, 6).map((skill) => (
                              <span key={skill} className="px-2 py-0.5 rounded-md bg-red-500/10 text-red-300 text-[10px] border border-red-500/20 font-mono">{skill}</span>
                            ))}
                            {!job.analysis.missingSkills.length && <p className="text-[10px] text-red-700">None</p>}
                          </div>
                        </div>
                      </div>

                      {/* Improvement tip */}
                      {job.analysis.improvementSuggestion && (
                        <div className="rounded-xl border border-indigo-500/20 bg-indigo-600/[0.05] p-4">
                          <div className="flex items-start gap-2">
                            <Zap className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="text-xs font-semibold text-indigo-400 mb-1">Improvement Tip</h4>
                              <p className="text-xs text-white/50 leading-relaxed">{job.analysis.improvementSuggestion}</p>
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

                  {/* Status tracker */}
                  <div className="relative">
                    <button
                      onClick={() => setStatusOpen(!statusOpen)}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium border transition-colors',
                        applicationStatuses[job._id]
                          ? STATUS_OPTIONS.find(s => s.value === applicationStatuses[job._id])?.color
                          : 'bg-white/[0.03] text-white/40 border-white/10 hover:border-white/20'
                      )}
                    >
                      <span>{applicationStatuses[job._id] ? STATUS_OPTIONS.find(s => s.value === applicationStatuses[job._id])?.label : 'Track Application Status'}</span>
                      <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', statusOpen && 'rotate-180')} />
                    </button>
                    {statusOpen && (
                      <div className="absolute bottom-full left-0 right-0 mb-1 bg-[#13151c] border border-white/10 rounded-xl overflow-hidden z-20 shadow-2xl">
                        {STATUS_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => {
                              setApplicationStatus(job._id, opt.value);
                              setStatusOpen(false);
                              toast.success(`Status updated to ${opt.label}`);
                            }}
                            className={cn('w-full flex items-center justify-between px-3 py-2.5 text-xs hover:bg-white/5 transition-colors',
                              applicationStatuses[job._id] === opt.value && 'bg-white/5')}
                          >
                            <span className={cn('font-medium', opt.color.split(' ')[1])}>{opt.label}</span>
                            {applicationStatuses[job._id] === opt.value && <Check className="w-3.5 h-3.5" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Job description */}
                  <div className="rounded-xl border border-white/[0.06] bg-[#13151c] p-5">
                    <h4 className="text-sm font-semibold text-white/70 mb-4 flex items-center gap-2">
                       <Briefcase className="w-4 h-4 text-indigo-400" />
                       Description
                    </h4>
                    <div 
                      className="text-[13px] text-white/60 leading-relaxed font-sans max-h-[600px] overflow-y-auto pr-2 custom-scrollbar prose prose-invert prose-sm prose-p:my-2 prose-ul:my-2 prose-li:my-0.5 max-w-none"
                      dangerouslySetInnerHTML={{ __html: job.description }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {showEmailModal && job && (
        <ColdEmailModal job={job} resumeId={resume?.id || ''} onClose={() => setShowEmailModal(false)} />
      )}
    </>
  );
}
