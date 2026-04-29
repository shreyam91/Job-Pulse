'use client';

import React, { useState } from 'react';
import { X, Sparkles, Loader2, ArrowRight, Download, FileText } from 'lucide-react';
import type { Job } from '@/types';
import { resumeApi } from '@/lib/apiServices';
import { useAppStore } from '@/store/appStore';
import { toast } from 'sonner';
import TipTapEditor from './TipTapEditor';

interface OptimizeResumeModalProps {
  job: Job;
  onClose: () => void;
}

export default function OptimizeResumeModal({ job, onClose }: OptimizeResumeModalProps) {
  const { resume } = useAppStore();
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const optimize = async () => {
    if (!resume?.parsedData?.rawText) {
      toast.error('Resume text not found. Please upload your resume first.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const data = await resumeApi.optimize(resume.parsedData.rawText, job.description);
      setResult(data);
      toast.success('Resume optimized!');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Optimization failed';
      setError(msg);
      toast.error('Failed to optimize resume', { description: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const highlightChangesHtml = (originalText: string, newText: string) => {
    if (!originalText || !newText) return newText || '';
    
    // Find all words in original text
    const oldWords = new Set(originalText.toLowerCase().match(/\\b[a-z0-9]+\\b/gi) || []);
    
    // Clean markdown code blocks if the AI accidentally wrapped it
    let cleanNewText = newText.replace(/```html/g, '').replace(/```/g, '').trim();
    
    // Match HTML tags OR words
    const regex = /(<[^>]+>)|(\\b[a-zA-Z0-9]+\\b)/g;
    
    let highlighted = cleanNewText.replace(regex, (match, tag, word) => {
      if (tag) return tag; // It's an HTML tag, don't touch it
      
      if (word && !oldWords.has(word.toLowerCase()) && word.length > 2) {
        return `<span class="bg-emerald-500/30 text-emerald-300 font-bold px-1 rounded shadow-sm border border-emerald-500/20" data-highlight="true">${word}</span>`;
      }
      return match;
    });
    
    return highlighted;
  };

  const handleEditBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    let newHtml = e.currentTarget.innerHTML;
    // Strip out the highlight spans before saving to state, keeping the edited text
    const regex = new RegExp('<span class="bg-emerald[^>]+data-highlight="true"[^>]*>(.*?)<\\\\/span>', 'g');
    newHtml = newHtml.replace(regex, '$1');
    setResult({ ...result, improvedResume: newHtml });
  };

  const downloadDoc = () => {
    if (!result?.improvedResume) return;
    
    const regex = new RegExp('<span class="bg-emerald[^>]+data-highlight="true"[^>]*>(.*?)<\\\\/span>', 'g');
    const cleanHtml = result.improvedResume.replace(regex, '$1');
      
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Resume</title><style>body{font-family: Arial, sans-serif; line-height: 1.6;} h1{font-size: 24pt; margin-bottom: 10pt;} h2{font-size: 14pt; border-bottom: 1px solid #ccc; padding-bottom: 3pt; margin-top: 15pt; margin-bottom: 10pt;} p, li{font-size: 11pt; margin-bottom: 5pt;} ul{margin-top: 0; padding-left: 20pt;}</style></head><body>";
    const footer = "</body></html>";
    const html = header + cleanHtml + footer;
    
    const blob = new Blob(['\\ufeff', html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Optimized_Resume.doc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPdf = () => {
    if (!result?.improvedResume) return;
    
    const regex = new RegExp('<span class="bg-emerald[^>]+data-highlight="true"[^>]*>(.*?)<\\\\/span>', 'g');
    const cleanHtml = result.improvedResume.replace(regex, '$1');
      
    const printWindow = window.open('', '', 'height=800,width=800');
    if (!printWindow) return;
    printWindow.document.write('<html><head><title>Optimized Resume</title>');
    printWindow.document.write('<style>body { font-family: Arial, sans-serif; line-height: 1.6; padding: 40px; color: #000; max-w: 800px; margin: 0 auto; } h1 { font-size: 24px; margin-bottom: 10px; } h2 { font-size: 16px; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-top: 20px; margin-bottom: 12px; } p, li { font-size: 12px; margin-bottom: 6px; } ul { margin-top: 4px; padding-left: 20px; }</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(cleanHtml);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-5xl bg-[#13151c] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        <div className="flex items-center justify-between p-5 border-b border-white/[0.06] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white/80">AI Resume Optimizer</h3>
              <p className="text-xs text-white/30">Tailor your resume for {job.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
            <X className="w-4 h-4 text-white/30" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {!result && !isLoading && (
            <div className="space-y-4 text-center py-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                <Sparkles className="w-8 h-8 text-emerald-400" />
              </div>
              <h4 className="text-lg font-bold text-white">Optimize Your Resume</h4>
              <p className="text-sm text-white/50 max-w-sm mx-auto">
                Our AI will analyze the job description and your resume, calculate ATS fit, and seamlessly weave in missing keywords.
              </p>
              <button
                onClick={optimize}
                className="mt-4 flex items-center justify-center gap-2 px-8 py-3 mx-auto rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold transition-all shadow-xl shadow-emerald-900/20"
              >
                Start Optimization <ArrowRight className="w-4 h-4" />
              </button>
              {error && <p className="text-xs text-red-400 mt-4">{error}</p>}
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
              <div className="text-center">
                <p className="text-sm font-bold text-white">Analyzing & Optimizing...</p>
                <p className="text-xs text-white/40">Integrating ATS keywords naturally.</p>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-white/30 mb-1">Score Before</p>
                  <p className="text-3xl font-black text-white/50">{result.scoreBefore}%</p>
                </div>
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.05] p-4 text-center">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-emerald-400/70 mb-1">Score After</p>
                  <p className="text-3xl font-black text-emerald-400">{result.scoreAfter}%</p>
                </div>
              </div>

              {result.suggestions && result.suggestions.length > 0 && (
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <h4 className="text-xs font-bold text-white/70 mb-2">AI Improvements</h4>
                  <ul className="space-y-1">
                    {result.suggestions.map((s: string, i: number) => (
                      <li key={i} className="text-xs text-white/50 flex items-start gap-2">
                        <span className="text-emerald-400 mt-0.5">•</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Original Resume */}
                <div className="rounded-xl border border-white/10 bg-white/[0.02] flex flex-col h-full">
                  <div className="p-3 border-b border-white/[0.06] flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white/50">Original Resume</h4>
                    <span className="text-[10px] uppercase font-bold text-white/30 tracking-wider">Score: {result.scoreBefore}%</span>
                  </div>
                  <div className="p-4 h-[400px] overflow-y-auto custom-scrollbar">
                    <div className="text-[11px] text-white/60 whitespace-pre-wrap font-mono leading-relaxed opacity-80">
                      {resume?.parsedData?.rawText || ''}
                    </div>
                  </div>
                </div>

                {/* Optimized Resume */}
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.02] flex flex-col h-full shadow-[0_0_15px_rgba(16,185,129,0.05)]">
                  <div className="p-3 border-b border-emerald-500/20 flex items-center justify-between bg-emerald-500/[0.05]">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <h4 className="text-xs font-bold text-emerald-400">Optimized Resume</h4>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Score: {result.scoreAfter}%</span>
                  </div>
                  <div className="p-4 h-[400px] overflow-y-auto custom-scrollbar relative">
                    <div className="absolute top-2 right-2 text-[9px] text-emerald-400/50 uppercase font-bold tracking-widest bg-emerald-950/50 px-2 py-1 rounded border border-emerald-500/20 backdrop-blur-md z-10 pointer-events-none">
                      Keywords Highlighted (Click to Edit)
                    </div>
                    <TipTapEditor 
                      content={highlightChangesHtml(resume?.parsedData?.rawText || '', result.improvedResume)}
                      onChange={(newHtml) => {
                        // Strip out the highlight spans before saving to state
                        const regex = new RegExp('<span class="bg-emerald[^>]+data-highlight="true"[^>]*>(.*?)<\\\\/span>', 'g');
                        const cleanHtml = newHtml.replace(regex, '$1');
                        setResult({ ...result, improvedResume: cleanHtml });
                      }}
                    />
                  </div>
                  <div className="p-3 border-t border-emerald-500/20 bg-emerald-500/[0.02] flex flex-wrap gap-2 items-center justify-end">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(result.improvedResume);
                        toast.success('Copied to clipboard');
                      }}
                      className="text-[11px] flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg font-semibold transition-colors border border-white/10 text-white/70"
                    >
                      Copy
                    </button>
                    <button 
                      onClick={downloadDoc}
                      className="text-[11px] flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 rounded-lg font-semibold transition-colors border border-indigo-500/30"
                    >
                      <FileText className="w-3 h-3" /> DOC
                    </button>
                    <button 
                      onClick={downloadPdf}
                      className="text-[11px] flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 rounded-lg font-semibold transition-colors border border-emerald-500/30"
                    >
                      <Download className="w-3 h-3" /> PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
