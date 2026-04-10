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
        // With resume: Use AI analysis to categorize jobs
        const grouped = await jobsApi.getRankedJobs(resume.id, { ...filters, limit: 100 });
        const currentGrouped = useAppStore.getState().groupedJobs;
        
        let newGrouped = grouped;
        if (filters.page && filters.page > 1 && currentGrouped) {
            // Create a Set of existing job IDs to prevent duplicates
            const existingTopIds = new Set((currentGrouped.topMatches || []).map(job => job._id));
            const existingGoodIds = new Set((currentGrouped.goodMatches || []).map(job => job._id));
            const existingStretchIds = new Set((currentGrouped.stretchOpportunities || []).map(job => job._id));
            
            newGrouped = {
               topMatches: [
                 ...(currentGrouped.topMatches || []),
                 ...(grouped.topMatches || []).filter(job => !existingTopIds.has(job._id))
               ],
               goodMatches: [
                 ...(currentGrouped.goodMatches || []),
                 ...(grouped.goodMatches || []).filter(job => !existingGoodIds.has(job._id))
               ],
               stretchOpportunities: [
                 ...(currentGrouped.stretchOpportunities || []),
                 ...(grouped.stretchOpportunities || []).filter(job => !existingStretchIds.has(job._id))
               ],
            };
        }
        
        setGroupedJobs(newGrouped);
        const all = [...newGrouped.topMatches, ...newGrouped.goodMatches, ...newGrouped.stretchOpportunities];
        setHasMore((grouped.topMatches.length + grouped.goodMatches.length + grouped.stretchOpportunities.length) >= 100);
        if (all.length > 0) {
          const avg = Math.round(all.reduce((s, j) => s + (j.analysis?.matchScore || 0), 0) / all.length);
          setAvgMatchScore(avg);
        } else {
          setAvgMatchScore(0);
        }
      } else {
        // No resume: Check if any filters are applied
        const hasActiveFilters = filters.search || 
          (filters.techStack && filters.techStack.length > 0) || 
          filters.location || 
          filters.country || 
          (filters.workMode && filters.workMode.length > 0) || 
          filters.experienceYears;
        
        const data = await jobsApi.getJobs({ ...filters, limit: 100 });
        const currentGrouped = useAppStore.getState().groupedJobs;
        
        let newGrouped;
        if (filters.page && filters.page > 1 && currentGrouped) {
          // Pagination logic
          if (hasActiveFilters) {
            // With filters: Show as "Good Matches" 
            const existingGoodIds = new Set((currentGrouped.goodMatches || []).map(job => job._id));
            newGrouped = {
              topMatches: [],
              goodMatches: [
                ...(currentGrouped.goodMatches || []),
                ...(data.jobs || []).filter(job => !existingGoodIds.has(job._id))
              ],
              stretchOpportunities: []
            };
          } else {
            // No filters: Show as "All Jobs" in topMatches
            const existingTopIds = new Set((currentGrouped.topMatches || []).map(job => job._id));
            newGrouped = {
              topMatches: [
                ...(currentGrouped.topMatches || []),
                ...(data.jobs || []).filter(job => !existingTopIds.has(job._id))
              ],
              goodMatches: [],
              stretchOpportunities: []
            };
          }
        } else {
          // First page
          if (hasActiveFilters) {
            // With filters: Show as "Good Matches"
            newGrouped = {
              topMatches: [],
              goodMatches: (data.jobs || []),
              stretchOpportunities: []
            };
          } else {
            // No filters: Show as "All Jobs"
            newGrouped = {
              topMatches: (data.jobs || []),
              goodMatches: [],
              stretchOpportunities: []
            };
          }
        }
        
        console.log('Dashboard - newGrouped:', newGrouped);
        console.log('Dashboard - hasActiveFilters:', hasActiveFilters);
        setGroupedJobs(newGrouped);
        setHasMore((data.jobs || []).length >= 100);
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

  
  const allJobs: Job[] = groupedJobs
    ? [...groupedJobs.topMatches, ...groupedJobs.goodMatches, ...groupedJobs.stretchOpportunities]
    : [];
  const totalAnalysed = allJobs.length;
  const appliedJobs = allJobs.filter((j) => applicationStatuses[j._id]);
  const appliedCount = Object.keys(applicationStatuses).length;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0a0b0f' }}>
      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && dashboardType === 'jobs' && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 z-50">
            <Sidebar onFilter={handleFilterJobs} isRefreshing={isRefreshing} />
          </div>
        </div>
      )}

      {/* Left: Sidebar - Only show for Jobs */}
      {dashboardType === 'jobs' && (
        <div className="hidden lg:flex w-64 xl:w-72 flex-shrink-0 flex-col">
          <Sidebar onFilter={handleFilterJobs} isRefreshing={isRefreshing} />
        </div>
      )}

      {/* Center: Content Area */}
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
          filters={filters}
          onFilterChange={setFilter}
        />

        {dashboardType === 'jobs' && (
          <AIHintBar
            resume={resume}
            totalAnalysed={totalAnalysed}
            isLoadingJobs={isLoadingJobs}
          />
        )}

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

      {/* Right: Detail / Analytics Panel (Desktop) - Only show for Jobs */}
      {dashboardType === 'jobs' && (
        <RightPanel
          panelTab={panelTab}
          onPanelTabChange={setPanelTab}
          dashboardType={dashboardType}
          analytics={analytics}
          totalAnalysed={totalAnalysed}
          avgMatchScore={avgMatchScore}
          isInterviewActive={isInterviewActive}
        />
      )}

      {/* Mobile Job Detail Sheet */}
      {dashboardType === 'jobs' && <MobileJobSheet />}
    </div>
  );
}
