'use client';

import React from 'react';
import { Wand2 } from 'lucide-react';

interface AIHintBarProps {
  resume: any;
  totalAnalysed: number;
  isLoadingJobs: boolean;
}

export default function AIHintBar({ resume, totalAnalysed, isLoadingJobs }: AIHintBarProps) {
  if (!resume || totalAnalysed > 0 || isLoadingJobs) {
    return null;
  }

  return (
    <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-indigo-600/10 border-b border-indigo-500/20">
      <Wand2 className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
      <p className="text-xs text-indigo-300">
        Resume uploaded! Click <strong>Refresh Job Matches</strong> to start AI analysis.
      </p>
    </div>
  );
}
