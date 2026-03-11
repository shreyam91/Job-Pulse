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
import { LayoutDashboard, BarChart3, BookmarkCheck, ClipboardList, Menu, Wand2, MapPin, Clock, Check, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type PanelTab = 'jobs' | 'analytics';

interface DashboardProps {
  onBackToLanding?: () => void;
}

export default function Dashboard({ onBackToLanding }: DashboardProps) {
  const {
    resume, filters, groupedJobs, setGroupedJobs, selectedJob, setSelectedJob,
    isLoadingJobs, setIsLoadingJobs, activeTab, setActiveTab,
    savedJobs, applicationStatuses,
  } = useAppStore();

  const [panelTab, setPanelTab] = useState<PanelTab>('jobs');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [avgMatchScore, setAvgMatchScore] = useState(0);

  const fetchRankedJobs = useCallback(async () => {
    setIsLoadingJobs(true);
    try {
      if (resume?.id) {
        const grouped = await jobsApi.getRankedJobs(resume.id, filters);
        setGroupedJobs(grouped);
        const all = [...grouped.topMatches, ...grouped.goodMatches, ...grouped.stretchOpportunities];
        if (all.length > 0) {
          const avg = Math.round(all.reduce((s, j) => s + (j.analysis?.matchScore || 0), 0) / all.length);
          setAvgMatchScore(avg);
        } else {
          setAvgMatchScore(0);
        }
      } else {
        const data = await jobsApi.getJobs({ ...filters, limit: 100 });
        setGroupedJobs({
          topMatches: data.jobs || [],
          goodMatches: [],
          stretchOpportunities: []
        });
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
        <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-[#0f1117]">
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

          {/* Tab bar */}
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

          {totalAnalysed > 0 && (
            <span className="text-xs text-white/30 hidden sm:block">
              <span className="font-semibold text-indigo-400">{totalAnalysed}</span> matched
            </span>
          )}
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

        {/* Job List / Applied tab */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'applied' ? (
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
            <JobList
              groupedJobs={groupedJobs}
              allJobs={allJobs}
              isLoading={isLoadingJobs}
            />
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
          {panelTab === 'jobs' ? (
            <JobDetailPanel />
          ) : (
            <div className="h-full overflow-y-auto">
              <Analytics data={analytics} matchedToday={totalAnalysed} avgMatchScore={avgMatchScore} />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Job Detail Sheet */}
      <MobileJobSheet />
    </div>
  );
}
