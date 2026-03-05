'use client';

import React, { useState } from 'react';
import { X, Copy, ExternalLink, Mail, Loader2, Check } from 'lucide-react';
import type { Job } from '@/types';
import { jobsApi } from '@/lib/apiServices';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ColdEmailModalProps {
  job: Job;
  resumeId: string;
  onClose: () => void;
}

export default function ColdEmailModal({ job, resumeId, onClose }: ColdEmailModalProps) {
  const { resume } = useAppStore();
  const [email, setEmail] = useState<{ subject: string; body: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [candidateName, setCandidateName] = useState('');

  const generate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await jobsApi.generateColdEmail(job._id, resumeId, candidateName || 'Your Name');
      setEmail(result);
      toast.success('Cold email generated!');
    } catch (err: any) {
      const msg = err.message || 'Generation failed';
      setError(msg);
      toast.error('Failed to generate email', { description: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const copyEmail = async () => {
    if (!email) return;
    await navigator.clipboard.writeText(`Subject: ${email.subject}\n\n${email.body}`);
    setCopied(true);
    toast.success('Email copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const openGmail = () => {
    if (!email) return;
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.body)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#13151c] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center">
              <Mail className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white/80">Cold Email Generator</h3>
              <p className="text-xs text-white/30">{job.title} at {job.company}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
            <X className="w-4 h-4 text-white/30" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {!email && !isLoading && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Your Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 transition-colors"
                />
              </div>
              <button
                onClick={generate}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
              >
                <Mail className="w-4 h-4" /> Generate AI Cold Email
              </button>
              {error && <p className="text-xs text-red-400 text-center">{error}</p>}
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center py-8 gap-3">
              <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
              <p className="text-sm text-white/40">Generating personalized email...</p>
            </div>
          )}

          {email && (
            <div className="space-y-3">
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                <p className="text-[10px] font-medium text-white/30 uppercase tracking-wider mb-1">Subject</p>
                <p className="text-xs font-semibold text-white/70">{email.subject}</p>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 max-h-48 overflow-y-auto">
                <p className="text-[10px] font-medium text-white/30 uppercase tracking-wider mb-2">Body</p>
                <p className="text-xs text-white/50 whitespace-pre-wrap leading-relaxed">{email.body}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={copyEmail}
                  className={cn(
                    'flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all border',
                    copied ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-white/5 hover:bg-white/10 text-white/60 border-white/10'
                  )}
                >
                  {copied ? <><Check className="w-3.5 h-3.5" />Copied!</> : <><Copy className="w-3.5 h-3.5" />Copy Email</>}
                </button>
                <button
                  onClick={openGmail}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />Open Gmail
                </button>
              </div>
              <button onClick={() => setEmail(null)} className="w-full text-xs text-white/25 hover:text-white/40 transition-colors">
                Generate another
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
