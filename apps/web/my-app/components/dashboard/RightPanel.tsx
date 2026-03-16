'use client';

import React from 'react';
import JobDetailPanel from '@/components/jobs/JobDetailPanel';
import Analytics from '@/components/analytics/Analytics';
import { LayoutDashboard, BarChart3, Mic2, Check, Sparkles, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AnalyticsData } from '@/types';

type PanelTab = 'jobs' | 'analytics' | 'sessions' | 'analysis';

interface RightPanelProps {
  panelTab: PanelTab;
  onPanelTabChange: (tab: PanelTab) => void;
  dashboardType: 'jobs' | 'interview';
  analytics: AnalyticsData | null;
  totalAnalysed: number;
  avgMatchScore: number;
  isInterviewActive: boolean;
}

export default function RightPanel({
  panelTab,
  onPanelTabChange,
  dashboardType,
  analytics,
  totalAnalysed,
  avgMatchScore,
  isInterviewActive
}: RightPanelProps) {
  return (
    <div className="hidden lg:flex w-96 xl:w-[420px] flex-shrink-0 flex-col">
      {/* Panel tab switcher */}
      <div className="flex-shrink-0 flex border-b border-white/[0.06] bg-[#0f1117]">
        {dashboardType === 'jobs' ? (
          <>
            {[
              { id: 'jobs' as PanelTab, label: 'Match Details', icon: LayoutDashboard },
              { id: 'analytics' as PanelTab, label: 'Analytics', icon: BarChart3 },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onPanelTabChange(tab.id)}
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
          </>
        ) : (
          <>
            {[
              { id: 'sessions' as PanelTab, label: 'Past Sessions', icon: Mic2 },
              { id: 'analysis' as PanelTab, label: 'AI Analysis', icon: Brain },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onPanelTabChange(tab.id)}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 px-4 py-3 text-xs font-medium transition-colors border-b-2',
                    panelTab === tab.id
                      ? 'text-emerald-400 border-emerald-500 bg-emerald-600/5'
                      : 'text-white/30 border-transparent hover:text-white/50'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />{tab.label}
                </button>
              );
            })}
          </>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        {dashboardType === 'jobs' ? (
          <>
            {panelTab === 'jobs' ? (
              <JobDetailPanel />
            ) : (
              <div className="h-full overflow-y-auto">
                <Analytics data={analytics} matchedToday={totalAnalysed} avgMatchScore={avgMatchScore} />
              </div>
            )}
          </>
        ) : (
          <>
            {panelTab === 'sessions' ? (
              <PastSessionsContent isInterviewActive={isInterviewActive} />
            ) : (
              <AIAnalysisContent isInterviewActive={isInterviewActive} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

function PastSessionsContent({ isInterviewActive }: { isInterviewActive: boolean }) {
  return (
    <div className="h-full flex flex-col p-6 space-y-6 overflow-y-auto">
      {/* Interview Readiness Section */}
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

      {/* Past Sessions Section */}
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
            <p className="text-xs text-white/30 mt-2">Start your first mock interview to see your AI analysis here</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AIAnalysisContent({ isInterviewActive }: { isInterviewActive: boolean }) {
  if (!isInterviewActive) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <Brain className="w-12 h-12 text-white/10 mb-4" />
        <h3 className="text-lg font-bold text-white/80 mb-2">AI Analysis</h3>
        <p className="text-sm text-white/40 mb-4">Start an interview session to see detailed AI analysis</p>
        <p className="text-xs text-white/30">Get feedback on technical accuracy, communication, and problem-solving skills</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6 space-y-6 overflow-y-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            AI Analysis
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
            "Try to mention specific tools you've used in the past, like New Relic or Datadog, to show hands-on experience with performance monitoring. Also, briefly discussing horizontal scaling would strengthen your 'Problem Solving' category."
          </p>
        </div>
      </div>
    </div>
  );
}
