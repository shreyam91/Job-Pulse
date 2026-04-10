'use client';

import React, { useState } from 'react';
import { Mic2, Wand2, Check, Sparkles, Brain, Lock, Zap, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InterviewContentProps {
  isInterviewActive: boolean;
  onInterviewStart: () => void;
}

export default function InterviewContent({ isInterviewActive, onInterviewStart }: InterviewContentProps) {
  return (
    <div className="relative h-full overflow-hidden">
      {/* --- UNDER DEVELOPMENT OVERLAY --- */}
      <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 text-center mt-20 bg-[#0a0b0f]/80 backdrop-blur-md animate-fade-in">
        <div className="relative mb-12 transform scale-90 md:scale-100">
          <div className="absolute -inset-10 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -inset-10 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-700" />
          
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-linear-to-br from-[#1a1c23] to-[#0f1117] border border-white/[0.08] flex items-center justify-center shadow-2xl">
            <Mic2 className="w-16 h-16 md:w-20 md:h-20 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]" />
            <div className="absolute -bottom-2 -right-2 w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-indigo-600 border-4 border-[#0a0b0f] flex items-center justify-center shadow-lg">
              <Lock className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
          </div>
        </div>

        <div className="max-w-xl space-y-6 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Under Construction</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            AI Interview <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">Agent</span>
          </h1>
          <p className="text-white/40 text-base md:text-lg leading-relaxed font-medium">
            The mock interview engine is currently being calibrated.
            We are working on bringing you the most advanced AI coach.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
             {[
              { icon: Zap, label: 'Real-time feedback' },
              { icon: Timer, label: '100+ Scenarios' },
              { icon: Sparkles, label: 'Visual Analysis' }
            ].map((f, i) => (
              <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] flex flex-col items-center gap-1.5">
                <f.icon className="w-4 h-4 text-white/30" />
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-tight">{f.label}</span>
              </div>
            ))}
          </div>

          <div className="pt-6">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
               <div className="flex -space-x-1.5">
                 {[1,2,3].map(i => <div key={i} className="w-5 h-5 rounded-full border-2 border-[#0a0b0f] bg-white/10" />)}
               </div>
               <p className="text-[11px] font-semibold text-white/40">420+ candidates waitlisted</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- ORIGINAL CONTENT (HIDDEN/BLURRED) --- */}
      <div className="opacity-10 grayscale blur-sm pointer-events-none select-none h-full">
        {!isInterviewActive ? (
          <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20">
              <Mic2 className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">AI Interview Agent</h2>
            <p className="text-white/40 text-sm leading-relaxed mb-8">
              Practice your interview skills with our real-time AI interviewer.
            </p>
          </div>
        ) : (
          <div className="h-full flex flex-col p-4 sm:p-6 lg:p-10 space-y-8">
            <div className="bg-[#1a1c23] border border-white/10 rounded-2xl p-6 italic text-white/60">
              Preview of the dashboard interface...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
