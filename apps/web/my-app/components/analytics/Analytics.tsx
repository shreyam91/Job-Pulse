'use client';

import React from 'react';
import type { AnalyticsData } from '@/types';
import { BarChart3, Briefcase, TrendingUp, Globe2, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnalyticsProps {
  data: AnalyticsData | null;
  matchedToday?: number;
  avgMatchScore?: number;
  isLoading?: boolean;
}

function MetricCard({
  icon: Icon,
  label,
  value,
  sub,
  iconBg,
  iconColor,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#13151c] p-4">
      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center mb-3', iconBg)}>
        <Icon className={cn('w-4 h-4', iconColor)} />
      </div>
      <div className={cn('text-2xl font-bold mb-0.5', iconColor)}>{value}</div>
      <div className="text-xs font-medium text-white/50">{label}</div>
      {sub && <div className="text-[10px] text-white/30 mt-0.5">{sub}</div>}
    </div>
  );
}

export default function Analytics({ data, matchedToday = 0, avgMatchScore = 0, isLoading }: AnalyticsProps) {
  if (isLoading) {
    return (
      <div className="p-4 grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-white/[0.03] animate-pulse" />
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 text-center">
        <BarChart3 className="w-12 h-12 text-white/10 mb-3" />
        <p className="text-sm text-white/30">Analytics will appear once jobs are loaded.</p>
      </div>
    );
  }

  const total = data.totalJobs || 1;
  const remoteCount = data.workModeBreakdown?.remote || 0;
  const hybridCount = data.workModeBreakdown?.hybrid || 0;
  const onsiteCount = data.workModeBreakdown?.onsite || 0;
  const remoteRatio = Math.round((remoteCount / total) * 100);
  const max = data.topCategories?.[0]?.count || 1;

  return (
    <div className="p-4 space-y-4">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard icon={BarChart3} label="Scraped Today" value={data.scrapedToday} iconBg="bg-indigo-600/15" iconColor="text-indigo-400" />
        <MetricCard icon={Briefcase} label="Active Jobs" value={data.totalJobs} iconBg="bg-blue-500/15" iconColor="text-blue-400" />
        <MetricCard icon={TrendingUp} label="Jobs Matched" value={matchedToday} sub="for your resume" iconBg="bg-green-500/15" iconColor="text-green-400" />
        <MetricCard icon={Star} label="Avg Match" value={avgMatchScore ? `${avgMatchScore}%` : '—'} iconBg="bg-yellow-500/15" iconColor="text-yellow-400" />
      </div>

      {/* Remote ratio donut */}
      <div className="rounded-xl border border-white/[0.06] bg-[#13151c] p-4 flex items-center gap-4">
        <div className="relative w-16 h-16 flex-shrink-0">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3.5" />
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#12b76a"
              strokeWidth="3.5"
              strokeDasharray={`${remoteRatio} ${100 - remoteRatio}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-green-400">{remoteRatio}%</span>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-white/70">Remote vs Onsite</p>
          <p className="text-xs text-white/30 mt-0.5">{remoteCount} remote · {onsiteCount} onsite · {hybridCount} hybrid</p>
        </div>
      </div>

      {/* Work mode stacked bar */}
      {total > 0 && (
        <div className="rounded-xl border border-white/[0.06] bg-[#13151c] p-4">
          <div className="flex items-center gap-2 mb-4">
            <Globe2 className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Work Mode Split</span>
          </div>
          <div className="flex rounded-full overflow-hidden h-3 mb-3 gap-px">
            {[
              { count: remoteCount, color: 'bg-emerald-400' },
              { count: hybridCount, color: 'bg-amber-400' },
              { count: onsiteCount, color: 'bg-blue-400' },
            ].map(({ count, color }, i) => {
              const pct = Math.round((count / total) * 100);
              return pct > 0 ? <div key={i} className={cn('h-full', color)} style={{ width: `${pct}%` }} /> : null;
            })}
          </div>
          <div className="flex justify-between text-xs">
            {[
              { label: 'Remote', count: remoteCount, color: 'text-emerald-400', dot: 'bg-emerald-400' },
              { label: 'Hybrid', count: hybridCount, color: 'text-amber-400', dot: 'bg-amber-400' },
              { label: 'Onsite', count: onsiteCount, color: 'text-blue-400', dot: 'bg-blue-400' },
            ].map(({ label, count, color, dot }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className={cn('w-2 h-2 rounded-full', dot)} />
                <span className="text-white/30">{label}</span>
                <span className={cn('font-semibold', color)}>{Math.round((count / total) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top skills */}
      {data.topCategories?.length > 0 && (
        <div className="rounded-xl border border-white/[0.06] bg-[#13151c] p-4">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Top Skills in Market</span>
          </div>
          <div className="space-y-3">
            {data.topCategories.slice(0, 5).map(({ name, count }) => (
              <div key={name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-mono text-white/50">{name}</span>
                  <span className="text-white/30">{count} jobs</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-indigo-400"
                    style={{ width: `${Math.round((count / max) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
