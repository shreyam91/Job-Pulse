'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import MobileJobSheet from '@/components/jobs/MobileJobSheet';
import { jobsApi } from '@/lib/apiServices';
import { useAppStore } from '@/store/appStore';
import type { AnalyticsData, Job } from '@/types';
import { toast } from 'sonner';
import DashboardHeader from '../dashboard/DashboardHeader';
import AIHintBar from '../dashboard/AIHintBar';
import JobContent from '../dashboard/JobContent';
import InterviewContent from '../dashboard/InterviewContent';
import RightPanel from '../dashboard/RightPanel';

interface DashboardProps {
  onBackToLanding?: () => void;
}

export default function Dashboard({ onBackToLanding }: DashboardProps) {
  const {
    resume, filters, setFilter, groupedJobs, setGroupedJobs, selectedJob, setSelectedJob,
    isLoadingJobs, setIsLoadingJobs, activeTab, setActiveTab,
    savedJobs, applicationStatuses, dashboardType, setDashboardType,
  } = useAppStore();

  const [panelTab, setPanelTab] = useState<'jobs' | 'analytics'>('jobs');
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
  }, [resume?.id, filters, setGroupedJobs, setIsLoadingJobs]);

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
        <DashboardHeader
          dashboardType={dashboardType}
          onDashboardTypeChange={setDashboardType}
          activeTab={activeTab}
          onActiveTabChange={setActiveTab}
          savedJobs={savedJobs}
          appliedCount={appliedCount}
          totalAnalysed={totalAnalysed}
          onMobileSidebarOpen={() => setMobileSidebarOpen(true)}
          onBackToLanding={onBackToLanding}
        />

        <AIHintBar
          resume={resume}
          totalAnalysed={totalAnalysed}
          isLoadingJobs={isLoadingJobs}
        />

        {/* Job List / Interview View */}
        <div className="flex-1 overflow-y-auto">
          {dashboardType === 'jobs' ? (
            <JobContent
              activeTab={activeTab}
              groupedJobs={groupedJobs}
              allJobs={allJobs}
              isLoadingJobs={isLoadingJobs}
              selectedJob={selectedJob}
              onJobSelect={setSelectedJob}
              appliedJobs={appliedJobs}
              hasMore={hasMore}
              filters={filters}
              onFilterChange={setFilter}
            />
          ) : (
            <InterviewContent
              isInterviewActive={isInterviewActive}
              onInterviewStart={() => setIsInterviewActive(true)}
            />
          )}
        </div>
      </div>

      {/* Right: Detail / Analytics Panel (Desktop) */}
      <RightPanel
        panelTab={panelTab}
        onPanelTabChange={setPanelTab}
        dashboardType={dashboardType}
        analytics={analytics}
        totalAnalysed={totalAnalysed}
        avgMatchScore={avgMatchScore}
        isInterviewActive={isInterviewActive}
      />

      {/* Mobile Job Detail Sheet */}
      <MobileJobSheet />
    </div>
  );
}
