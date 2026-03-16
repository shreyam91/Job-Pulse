'use client';

import React, { useEffect, useState, useCallback } from 'react';
import JobCard from '@/components/jobs/JobCard';
import Sidebar from '@/components/layout/Sidebar';
import JobList from '@/components/jobs/JobList';
import JobDetailPanel from '@/components/jobs/JobDetailPanel';
import Analytics from '@/components/analytics/Analytics';
import MobileJobSheet from '@/components/jobs/MobileJobSheet';
import { jobsApi } from '@/lib/apiServices';
import { useAppStore } from '@/store/appStore';
import type { GroupedJobs, AnalyticsData, Job } from '@/types';
import { LayoutDashboard, BarChart3, BookmarkCheck, ClipboardList, Menu, Wand2, MapPin, Clock, Check, Home, Briefcase, Mic2, Sparkles, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type PanelTab = 'jobs' | 'analytics';

interface DashboardProps {
  onBackToLanding?: () => void;
}

export default function Dashboard({ onBackToLanding }: DashboardProps) {
  const {
    resume, filters, setFilter, groupedJobs, setGroupedJobs, selectedJob, setSelectedJob,
    isLoadingJobs, setIsLoadingJobs, activeTab, setActiveTab,
    savedJobs, applicationStatuses, dashboardType, setDashboardType,
  } = useAppStore();

  const [panelTab, setPanelTab] = useState<PanelTab>('jobs');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [avgMatchScore, setAvgMatchScore] = useState(0);
  const [isInterviewActive, setIsInterviewActive] = useState(false);

  const fetchRankedJobs = useCallback(async () => {
    setIsLoadingJobs(true);
    try {
      if (resume?.id) {
        const grouped = await jobsApi.getRankedJobs(resume.id, { ...filters, limit: 20 });
        const currentGrouped = useAppStore.getState().groupedJobs;
        
        let newGrouped = grouped;
        if (filters.page && filters.page > 1 && currentGrouped) {
            newGrouped = {
               topMatches: [...(currentGrouped.topMatches || []), ...grouped.topMatches],
               goodMatches: [...(currentGrouped.goodMatches || []), ...grouped.goodMatches],
               stretchOpportunities: [...(currentGrouped.stretchOpportunities || []), ...grouped.stretchOpportunities],
            };
        }
        
        setGroupedJobs(newGrouped);
        const all = [...newGrouped.topMatches, ...newGrouped.goodMatches, ...newGrouped.stretchOpportunities];
        setHasMore((grouped.topMatches.length + grouped.goodMatches.length + grouped.stretchOpportunities.length) >= 20);
        if (all.length > 0) {
          const avg = Math.round(all.reduce((s, j) => s + (j.analysis?.matchScore || 0), 0) / all.length);
          setAvgMatchScore(avg);
        } else {
          setAvgMatchScore(0);
        }
      } else {
        const data = await jobsApi.getJobs({ ...filters, limit: 20 });
        const currentGrouped = useAppStore.getState().groupedJobs;
        
        const newGrouped = {
          topMatches: (filters.page && filters.page > 1 && currentGrouped) 
            ? [...(currentGrouped.topMatches || []), ...(data.jobs || [])]
            : (data.jobs || []),
          goodMatches: [],
          stretchOpportunities: []
        };
        
        setGroupedJobs(newGrouped);
        setHasMore((data.jobs || []).length >= 20);
        setAvgMatchScore(0);
      }
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setIsLoadingJobs(false);
    }
  }, [resume?.id, JSON.stringify(filters)]);

  const fetchAnalytics = useCallback(async () => {
    try {
      const data = await jobsApi.getAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    }
  }, []);

  useEffect(() => { fetchRankedJobs(); }, [fetchRankedJobs]);
  useEffect(() => { if (panelTab === 'analytics') fetchAnalytics(); }, [panelTab, fetchAnalytics]);

  const handleFilterJobs = async () => {
    setIsRefreshing(true);
    try {
      await fetchRankedJobs();
      toast.success('Job matches filtered!');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleScrapeJobs = async () => {
    setIsRefreshing(true);
    toast.loading('Scraping fresh jobs...', { id: 'scrape' });
    try {
      await jobsApi.refreshJobs();
      await new Promise((r) => setTimeout(r, 1500));
      await fetchRankedJobs();
      toast.success('Jobs scraped successfully!', { id: 'scrape' });
    } catch (err) {
      console.error('Scrape failed:', err);
      toast.error('Failed to scrape jobs. Check your API connection.', { id: 'scrape' });
    } finally {
      setIsRefreshing(false);
    }
  };

  const allJobs: Job[] = groupedJobs
    ? [...groupedJobs.topMatches, ...groupedJobs.goodMatches, ...groupedJobs.stretchOpportunities]
    : [];
  const totalAnalysed = allJobs.length;
  const appliedJobs = allJobs.filter((j) => applicationStatuses[j._id]);
  const appliedCount = Object.keys(applicationStatuses).length;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0a0b0f' }}>
      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 z-50">
            <Sidebar onFilter={handleFilterJobs} onScrape={handleScrapeJobs} isRefreshing={isRefreshing} />
          </div>
        </div>
      )}

      {/* Left: Sidebar */}
      <div className="hidden lg:flex w-64 xl:w-72 flex-shrink-0 flex-col">
        <Sidebar onFilter={handleFilterJobs} onScrape={handleScrapeJobs} isRefreshing={isRefreshing} />
      </div>

      {/* Center: Job List */}
      <div className="flex-1 flex flex-col min-w-0 border-x border-white/[0.06]">
        {/* Center header */}
        <div className="flex-shrink-0 flex flex-col border-b border-white/[0.06] bg-[#0f1117]">
          {/* Top Switcher */}
          <div className="flex items-center justify-center p-2 border-b border-white/[0.04]">
            <div className="flex items-center gap-1 bg-white/[0.03] rounded-xl p-1 w-full max-w-[300px]">
              <button
                onClick={() => setDashboardType('jobs')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200',
                  dashboardType === 'jobs'
                    ? 'bg-indigo-600/20 text-indigo-300 shadow-sm'
                    : 'text-white/30 hover:text-white/50'
                )}
              >
                <Briefcase className="w-3.5 h-3.5" />
                Job Agent
              </button>
              <button
                onClick={() => setDashboardType('interview')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200',
                  dashboardType === 'interview'
                    ? 'bg-emerald-600/20 text-emerald-300 shadow-sm'
                    : 'text-white/30 hover:text-white/50'
                )}
              >
                <Mic2 className="w-3.5 h-3.5" />
                Interview Agent
              </button>
            </div>
          </div>

          {/* Sub Header (Tabs) */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-1.5 rounded-lg hover:bg-white/5 text-white/30"
              >
                <Menu className="w-5 h-5" />
              </button>
              {onBackToLanding && (
                <button
                  onClick={onBackToLanding}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-white/50 transition-colors"
                  title="Back to landing page"
                >
                  <Home className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Tab bar - Only show for Jobs */}
            {dashboardType === 'jobs' ? (
              <div className="flex items-center gap-1 bg-white/[0.03] rounded-xl p-1">
                {[
                  { id: 'all', label: 'All Jobs', icon: LayoutDashboard },
                  { id: 'saved', label: `Saved${savedJobs.length ? ` (${savedJobs.length})` : ''}`, icon: BookmarkCheck },
                  { id: 'applied', label: `Applied${appliedCount ? ` (${appliedCount})` : ''}`, icon: ClipboardList },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as 'all' | 'saved' | 'applied')}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150',
                        activeTab === tab.id
                          ? 'bg-[#13151c] text-white/80 shadow-sm'
                          : 'text-white/30 hover:text-white/50'
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />{tab.label}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-xs font-bold text-emerald-400/80 tracking-tight flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                AI INTERVIEW READY
              </div>
            )}

            {dashboardType === 'jobs' && totalAnalysed > 0 && (
              <span className="text-xs text-white/30 hidden sm:block">
                <span className="font-semibold text-indigo-400">{totalAnalysed}</span> matched
              </span>
            )}
            {dashboardType === 'interview' && (
              <span className="text-xs text-white/30 hidden sm:block">
                Interview Prep Mode
              </span>
            )}
          </div>
        </div>

        {/* AI hint bar */}
        {resume && totalAnalysed === 0 && !isLoadingJobs && (
          <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-indigo-600/10 border-b border-indigo-500/20">
            <Wand2 className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <p className="text-xs text-indigo-300">
              Resume uploaded! Click <strong>Refresh Job Matches</strong> to start AI analysis.
            </p>
          </div>
        )}

        {/* Job List / Interview View */}
        <div className="flex-1 overflow-y-auto">
          {dashboardType === 'jobs' ? (
            activeTab === 'applied' ? (
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
                      onClick={() => setSelectedJob(job)}
                      isSelected={selectedJob?._id === job._id}
                    />
                  ))
                )}
              </div>
            ) : (
              <div className="pb-10">
                <JobList
                  groupedJobs={groupedJobs}
                  allJobs={allJobs}
                  isLoading={isLoadingJobs && (filters.page || 1) === 1}
                />
                {hasMore && allJobs.length > 0 && (
                  <div className="flex justify-center p-6">
                    <button
                      onClick={() => setFilter('page', (filters.page || 1) + 1)}
                      disabled={isLoadingJobs}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/[0.03] text-white/50 text-sm font-medium hover:bg-white/[0.06] hover:text-white/80 transition-all border border-white/[0.08]"
                    >
                      {isLoadingJobs ? 'Loading...' : 'Load More'}
                    </button>
                  </div>
                )}
              </div>
            )
          ) : !isInterviewActive ? (
            <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-center max-w-2xl mx-auto">
                <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20">
                    <Mic2 className="w-10 h-10 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">AI Interview Agent</h2>
                <p className="text-white/40 text-sm leading-relaxed mb-8">
                    Practice your interview skills with our real-time AI interviewer. Get instant feedback on your answers, 
                    body language, and technical accuracy based on your target job role.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-left">
                        <div className="p-2 rounded-lg bg-indigo-500/10 w-fit mb-3">
                            <Wand2 className="w-4 h-4 text-indigo-400" />
                        </div>
                        <h3 className="text-white/80 font-semibold text-sm mb-1">Tailored Questions</h3>
                        <p className="text-white/30 text-xs">Questions generated specifically for your resume and target jobs.</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-left">
                        <div className="p-2 rounded-lg bg-emerald-500/10 w-fit mb-3">
                            <Check className="w-4 h-4 text-emerald-400" />
                        </div>
                        <h3 className="text-white/80 font-semibold text-sm mb-1">Live Feedback</h3>
                        <p className="text-white/30 text-xs">Instant evaluation of your answers with scoring and suggestions.</p>
                    </div>
                </div>
                <button 
                  onClick={() => setIsInterviewActive(true)}
                  className="mt-10 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold hover:from-emerald-700 hover:to-emerald-600 transition-all shadow-xl shadow-emerald-900/20"
                >
                    Start Mock Interview
                </button>
            </div>
          ) : (
            /* Active Interview Session Simulation */
            <div className="h-full flex flex-col p-4 sm:p-6 lg:p-10 space-y-8 bg-gradient-to-b from-transparent to-emerald-500/[0.02]">
                {/* Character & Question Section */}
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex-shrink-0 relative group">
                        <div className="absolute -inset-1 bg-gradient-to-tr from-emerald-500 to-indigo-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition-opacity" />
                        <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#0f1117]">
                            <img 
                              src="/images/ai-character.png" 
                              alt="AI Interviwer" 
                              className="w-full h-full object-cover opacity-90"
                            />
                            {/* Pulse indicator */}
                            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] text-white/50 font-bold tracking-widest uppercase">Live</span>
                            </div>
                        </div>
                        <p className="text-center mt-3 text-xs font-bold text-white/40 uppercase tracking-widest">AI Agent: Nova</p>
                    </div>

                    <div className="flex-1 space-y-6 pt-2">
                        <div className="relative">
                            <div className="absolute -left-3 top-4 w-3 s-3 bg-[#1a1c23] rotate-45 border-l border-t border-white/10 hidden md:block" />
                            <div className="bg-[#1a1c23] border border-white/10 rounded-2xl rounded-tl-none md:rounded-tl-2xl p-6 shadow-xl relative">
                                <Wand2 className="absolute top-4 right-4 w-4 h-4 text-emerald-500/30" />
                                <h4 className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-2">Current Question</h4>
                                <p className="text-white text-lg font-medium leading-relaxed">
                                    "Based on your experience with React and Node.js at TechCorp, how would you handle a situation where a high-traffic API endpoint is consistently bottlenecking your frontend performance?"
                                </p>
                            </div>
                        </div>

                        {/* Student Answer Mockup */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white/40">YOU</div>
                                <div className="h-px flex-1 bg-white/[0.05]" />
                            </div>
                            <div className="bg-white/[0.02] border border-white/[0.03] rounded-2xl p-5 italic text-white/60 text-sm leading-relaxed">
                                "I would first use performance monitoring tools to identify the exact cause—whether it's database queries, heavy computation, or payload size. If it's DB-related, I'd look into indexing or implementing a caching layer like Redis. For heavy computation, I might offload it to a background worker..."
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Feedback Section */}
                <div className="pt-8 border-t border-white/[0.06] space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-emerald-400" />
                                AI Impact Analysis
                            </h3>
                            <p className="text-white/30 text-xs">Evaluating your technical accuracy and communication style.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-[10px] text-white/30 uppercase font-bold tracking-wider">Overall Score</p>
                                <p className="text-2xl font-black text-emerald-400">85<span className="text-sm text-white/20">/100</span></p>
                            </div>
                            <button className="px-6 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white/80 text-xs font-bold hover:bg-white/10 transition-colors">
                                Next Question
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { label: 'Technical Accuracy', score: 88, color: 'bg-emerald-500', desc: 'Detailed explanation of Redis and indexing.' },
                            { label: 'Clarity of Speech', score: 92, color: 'bg-indigo-500', desc: 'Professional tone, well-structured thoughts.' },
                            { label: 'Problem Solving', score: 75, color: 'bg-amber-500', desc: 'Good, but could mention CDN or pagination.' }
                        ].map((metric) => (
                            <div key={metric.label} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-[11px] font-bold text-white/50 uppercase tracking-tight">{metric.label}</span>
                                    <span className="text-sm font-bold text-white">{metric.score}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-3">
                                    <div className={cn("h-full rounded-full transition-all duration-1000", metric.color)} style={{ width: `${metric.score}%` }} />
                                </div>
                                <p className="text-[10px] text-white/30 leading-tight">{metric.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex gap-4 items-start">
                        <div className="p-2 rounded-lg bg-indigo-500/10">
                            <Brain className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                            <h4 className="text-indigo-300 text-xs font-bold mb-1">Top Suggestion</h4>
                            <p className="text-white/40 text-[11px] leading-relaxed">
                                "Try to mention specific tools you've used in the past, like New Relic or Datadog, to show hands-on experience with performance monitoring. Also, briefly discussing horizontal scaling would strengthen the 'Problem Solving' category."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Detail / Analytics Panel (Desktop) */}
      <div className="hidden lg:flex w-96 xl:w-[420px] flex-shrink-0 flex-col">
        {/* Panel tab switcher */}
        <div className="flex-shrink-0 flex border-b border-white/[0.06] bg-[#0f1117]">
          {[
            { id: 'jobs' as PanelTab, label: 'Match Details', icon: LayoutDashboard },
            { id: 'analytics' as PanelTab, label: 'Analytics', icon: BarChart3 },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setPanelTab(tab.id)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 px-4 py-3 text-xs font-medium transition-colors border-b-2',
                  panelTab === tab.id
                    ? 'text-indigo-400 border-indigo-500 bg-indigo-600/5'
                    : 'text-white/30 border-transparent hover:text-white/50'
                )}
              >
                <Icon className="w-3.5 h-3.5" />{tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-hidden">
          {dashboardType === 'jobs' ? (
            panelTab === 'jobs' ? (
              <JobDetailPanel />
            ) : (
              <div className="h-full overflow-y-auto">
                <Analytics data={analytics} matchedToday={totalAnalysed} avgMatchScore={avgMatchScore} />
              </div>
            )
          ) : (
            <div className="h-full flex flex-col p-6 space-y-6 overflow-y-auto">
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                <h3 className="text-white/80 font-bold text-sm mb-4">Interview Readiness</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-[10px] text-white/40 mb-1.5 uppercase font-bold tracking-tight">
                        <span>Overall Ready</span>
                        <span>{isInterviewActive ? '85%' : '0%'}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className={cn("h-full bg-emerald-500 transition-all duration-1000", isInterviewActive ? "w-[85%]" : "w-[0%]")} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                     <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                        <p className="text-[10px] text-white/30 uppercase font-bold mb-1">Sessions</p>
                        <p className="text-xl font-bold text-white">{isInterviewActive ? '1' : '0'}</p>
                     </div>
                     <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                        <p className="text-[10px] text-white/30 uppercase font-bold mb-1">Avg Score</p>
                        <p className="text-xl font-bold text-white">{isInterviewActive ? '85' : 'N/A'}</p>
                     </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                 <h3 className="text-white/60 font-bold text-[10px] uppercase tracking-widest px-1">Past Sessions</h3>
                 {isInterviewActive ? (
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                <Check className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-white">System Design</p>
                                <p className="text-[10px] text-white/20">Today, 2:45 PM</p>
                            </div>
                        </div>
                        <span className="text-xs font-black text-emerald-400">85</span>
                    </div>
                 ) : (
                    <div className="py-12 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl">
                        <Mic2 className="w-8 h-8 text-white/5 mb-3" />
                        <p className="text-xs text-white/20">No sessions yet</p>
                    </div>
                 )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Job Detail Sheet */}
      <MobileJobSheet />
    </div>
  );
}
