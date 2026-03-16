'use client';

import React, { useState } from 'react';
import { Mic2, Wand2, Check, Sparkles, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InterviewContentProps {
  isInterviewActive: boolean;
  onInterviewStart: () => void;
}

export default function InterviewContent({ isInterviewActive, onInterviewStart }: InterviewContentProps) {
  if (!isInterviewActive) {
    return (
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
          onClick={onInterviewStart}
          className="mt-10 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold hover:from-emerald-700 hover:to-emerald-600 transition-all shadow-xl shadow-emerald-900/20"
        >
          Start Mock Interview
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 lg:p-10 space-y-8 bg-gradient-to-b from-transparent to-emerald-500/[0.02]">
      {/* Character & Question Section */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-shrink-0 relative group">
          <div className="absolute -inset-1 bg-gradient-to-tr from-emerald-500 to-indigo-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition-opacity" />
          <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#0f1117]">
            <img 
              src="/images/ai-character.png" 
              alt="AI Interviewer" 
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
            <div className="absolute -left-3 top-4 w-3 h-3 bg-[#1a1c23] rotate-45 border-l border-t border-white/10 hidden md:block" />
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
  );
}
