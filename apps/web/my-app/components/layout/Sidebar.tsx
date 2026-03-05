'use client';

import React, { useState } from 'react';
import { Search, X, ChevronDown, RotateCcw, Loader2, SlidersHorizontal } from 'lucide-react';
import type { WorkMode } from '@/types';
import { useAppStore } from '@/store/appStore';
import ResumeUpload from '../resume/ResumeUpload';
import { cn } from '@/lib/utils';

const TECH_STACK_OPTIONS = [
  'React', 'Next.js', 'Node.js', 'Python', 'Java', 'Go',
  'AWS', 'Docker', 'Kubernetes', 'TypeScript', 'Vue', 'Angular',
];

const WORK_MODE_OPTIONS: { value: WorkMode; label: string }[] = [
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'onsite', label: 'Onsite' },
];

const LOCATION_OPTIONS = [
  { value: '', label: 'All Locations' },
  { value: 'Remote Only', label: 'Remote Only' },
  { value: 'Remote + Global', label: 'Remote + Global' },
  { value: 'specific', label: 'Specific Country' },
];

const COUNTRIES = ['India', 'United States', 'United Kingdom', 'Canada', 'Germany', 'Singapore', 'Australia'];

const EXPERIENCE_OPTIONS = [
  { value: '', label: 'Any Experience' },
  { value: '0-1', label: '0–1 years' },
  { value: '1-3', label: '1–3 years' },
  { value: '3-5', label: '3–5 years' },
  { value: '5-99', label: '5+ years' },
];

interface SidebarProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

const selectClass = 'w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-xs text-white/70 focus:outline-none focus:border-indigo-500/50 appearance-none transition-colors';
const labelClass = 'block text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2';

export default function Sidebar({ onRefresh, isRefreshing }: SidebarProps) {
  const { filters, setFilter, resetFilters } = useAppStore();
  const [locationMode, setLocationMode] = useState('');
  const [showCountry, setShowCountry] = useState(false);

  const handleLocationChange = (value: string) => {
    setLocationMode(value);
    if (value === 'specific') {
      setShowCountry(true);
      setFilter('location', '');
    } else {
      setShowCountry(false);
      setFilter('location', value);
      setFilter('country', '');
    }
  };

  const toggleTechStack = (tech: string) => {
    const current = filters.techStack;
    setFilter('techStack', current.includes(tech) ? current.filter((t) => t !== tech) : [...current, tech]);
  };

  const toggleWorkMode = (mode: WorkMode) => {
    const current = filters.workMode;
    setFilter('workMode', current.includes(mode) ? current.filter((m) => m !== mode) : [...current, mode]);
  };

  const activeCount = [
    filters.search, filters.techStack.length > 0, !!filters.location || !!filters.country,
    filters.workMode.length > 0, filters.experienceYears,
  ].filter(Boolean).length;

  return (
    <div className="h-full flex flex-col bg-[#0f1117] border-r border-white/[0.06] overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center">
            <SlidersHorizontal className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-bold text-white/80">JobMatch</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-600/20 text-indigo-400 font-medium">AI</span>
        </div>
        {activeCount > 0 && (
          <button onClick={resetFilters} className="flex items-center gap-1 text-[10px] text-white/30 hover:text-white/50 transition-colors">
            <RotateCcw className="w-3 h-3" />Reset ({activeCount})
          </button>
        )}
      </div>

      {/* Scrollable filters */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Resume */}
        <section>
          <p className={labelClass}>Resume</p>
          <ResumeUpload />
        </section>

        {/* Search */}
        <section>
          <p className={labelClass}>Role or Skill</p>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
            <input
              type="text"
              placeholder="React, AI Engineer, Backend..."
              value={filters.search}
              onChange={(e) => setFilter('search', e.target.value)}
              className={cn(selectClass, 'pl-9 pr-9')}
            />
            {filters.search && (
              <button onClick={() => setFilter('search', '')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-3 h-3 text-white/30" />
              </button>
            )}
          </div>
        </section>

        {/* Tech Stack */}
        <section>
          <p className={labelClass}>
            Tech Stack
            {filters.techStack.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-indigo-600/20 text-indigo-400">
                {filters.techStack.length}
              </span>
            )}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {TECH_STACK_OPTIONS.map((tech) => {
              const selected = filters.techStack.includes(tech);
              return (
                <button
                  key={tech}
                  onClick={() => toggleTechStack(tech)}
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-xs font-mono font-medium border transition-all duration-150',
                    selected
                      ? 'bg-indigo-600/25 text-indigo-300 border-indigo-500/40'
                      : 'bg-white/[0.03] text-white/40 border-white/[0.06] hover:border-white/15 hover:text-white/60'
                  )}
                >
                  {tech}
                </button>
              );
            })}
          </div>
        </section>

        {/* Location */}
        <section>
          <p className={labelClass}>Location</p>
          <div className="relative">
            <select value={locationMode} onChange={(e) => handleLocationChange(e.target.value)} className={selectClass}>
              {LOCATION_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20 pointer-events-none" />
          </div>
          {showCountry && (
            <div className="relative mt-2">
              <select value={filters.country} onChange={(e) => setFilter('country', e.target.value)} className={selectClass}>
                <option value="">Select Country</option>
                {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20 pointer-events-none" />
            </div>
          )}
        </section>

        {/* Work Mode */}
        <section>
          <p className={labelClass}>Work Mode</p>
          <div className="flex gap-2">
            {WORK_MODE_OPTIONS.map((mode) => {
              const selected = filters.workMode.includes(mode.value);
              return (
                <button
                  key={mode.value}
                  onClick={() => toggleWorkMode(mode.value)}
                  className={cn(
                    'flex-1 py-2 rounded-xl text-xs font-medium border transition-all duration-150',
                    selected
                      ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40'
                      : 'bg-white/[0.03] text-white/40 border-white/[0.06] hover:border-white/15'
                  )}
                >
                  {mode.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Experience */}
        <section>
          <p className={labelClass}>Experience Level</p>
          <div className="relative">
            <select value={filters.experienceYears} onChange={(e) => setFilter('experienceYears', e.target.value)} className={selectClass}>
              {EXPERIENCE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20 pointer-events-none" />
          </div>
        </section>
      </div>

      {/* Refresh button */}
      <div className="flex-shrink-0 p-4 border-t border-white/[0.06]">
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className={cn(
            'w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200',
            isRefreshing
              ? 'bg-indigo-600/30 text-indigo-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white shadow-lg shadow-indigo-900/30'
          )}
        >
          {isRefreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
          {isRefreshing ? 'Matching...' : 'Refresh Job Matches'}
        </button>
      </div>
    </div>
  );
}
