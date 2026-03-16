'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface DashboardHeaderProps {
  dashboardType: 'jobs' | 'interview';
  onDashboardTypeChange: (type: 'jobs' | 'interview') => void;
  activeTab: 'all' | 'saved' | 'applied';
  onActiveTabChange: (tab: 'all' | 'saved' | 'applied') => void;
  savedJobs: any[];
  appliedCount: number;
  totalAnalysed: number;
  onMobileSidebarOpen: () => void;
  onBackToLanding?: () => void;
}

export default function DashboardHeader({
  dashboardType,
  onDashboardTypeChange,
  activeTab,
  onActiveTabChange,
  savedJobs,
  appliedCount,
  totalAnalysed,
  onMobileSidebarOpen,
  onBackToLanding
}: DashboardHeaderProps) {
  return (
    <div className="flex-shrink-0 flex flex-col border-b border-white/[0.06] bg-[#0f1117]">
      {/* Top Switcher */}
      <div className="flex items-center justify-center p-2 border-b border-white/[0.04]">
        <div className="flex items-center gap-1 bg-white/[0.03] rounded-xl p-1 w-full max-w-[300px]">
          <button
            onClick={() => onDashboardTypeChange('jobs')}
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
            onClick={() => onDashboardTypeChange('interview')}
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
            onClick={onMobileSidebarOpen}
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
                  onClick={() => onActiveTabChange(tab.id as 'all' | 'saved' | 'applied')}
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
  );
}

import { Briefcase, Mic2, LayoutDashboard, BookmarkCheck, ClipboardList, Menu, Home } from 'lucide-react';
