'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, User, Code2, Loader2 } from 'lucide-react';
import { resumeApi } from '@/lib/apiServices';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function ResumeUpload() {
  const { resume, setResume } = useAppStore();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setIsUploading(true);
    setError(null);
    toast.loading('Parsing resume...', { id: 'resume-upload' });
    try {
      const result = await resumeApi.upload(file);
      setResume(result);
      toast.success(`Resume "${file.name}" uploaded successfully!`, {
        id: 'resume-upload',
        description: `${result.parsedData.skills.length} skills detected · ${result.parsedData.experienceYears}y experience`,
      });
    } catch (err: any) {
      const msg = err.message || 'Upload failed';
      setError(msg);
      toast.error('Resume upload failed', {
        id: 'resume-upload',
        description: msg,
      });
    } finally {
      setIsUploading(false);
    }
  }, [setResume]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    disabled: isUploading,
  });

  const handleRemove = async () => {
    if (resume?.id) {
      try { await resumeApi.delete(resume.id); } catch { /* ignore */ }
    }
    setResume(null);
    toast.info('Resume removed');
  };

  if (resume) {
    return (
      <div className="space-y-2">
        <div className="rounded-xl border border-green-500/25 bg-green-500/[0.05] p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-green-500/15 flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-green-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-green-300 truncate">{resume.fileName}</p>
                <p className="text-[10px] text-white/30">{(resume.fileSize / 1024).toFixed(0)} KB</p>
              </div>
            </div>
            <button onClick={handleRemove} className="p-1 rounded hover:bg-white/10 transition-colors flex-shrink-0">
              <X className="w-3.5 h-3.5 text-white/30" />
            </button>
          </div>
          <div className="mt-2.5 pt-2.5 border-t border-green-500/15 grid grid-cols-2 gap-1">
            <div className="flex items-center gap-1.5 text-[10px] text-white/30">
              <User className="w-3 h-3" />{resume.parsedData.experienceYears}y exp
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-white/30">
              <Code2 className="w-3 h-3" />{resume.parsedData.skills.length} skills
            </div>
          </div>
          {resume.parsedData.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {resume.parsedData.skills.slice(0, 4).map((s) => (
                <span key={s} className="px-1.5 py-0.5 rounded text-[10px] bg-white/5 text-white/30 font-mono">{s}</span>
              ))}
              {resume.parsedData.skills.length > 4 && (
                <span className="text-[10px] text-white/20">+{resume.parsedData.skills.length - 4}</span>
              )}
            </div>
          )}
        </div>
        <button {...getRootProps()} className="w-full text-[10px] text-white/25 hover:text-white/40 transition-colors text-center">
          <input {...getInputProps()} />
          Click to replace resume
        </button>
      </div>
    );
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={cn(
          'rounded-xl border-2 border-dashed p-5 text-center cursor-pointer transition-all duration-200',
          isDragActive ? 'border-indigo-500 bg-indigo-600/10 scale-[1.01]'
            : 'border-white/10 hover:border-indigo-500/50 hover:bg-indigo-600/5',
          isUploading && 'pointer-events-none opacity-60'
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          {isUploading ? (
            <><Loader2 className="w-8 h-8 text-indigo-400 animate-spin" /><p className="text-xs text-white/40">Parsing resume...</p></>
          ) : isDragActive ? (
            <><Upload className="w-8 h-8 text-indigo-400" /><p className="text-xs font-medium text-indigo-400">Drop your PDF here</p></>
          ) : (
            <>
              <div className="w-10 h-10 rounded-xl bg-indigo-600/15 border border-indigo-500/20 flex items-center justify-center">
                <Upload className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white/70">Upload Resume</p>
                <p className="text-[10px] text-white/30 mt-0.5">PDF, max 10MB</p>
              </div>
            </>
          )}
        </div>
      </div>
      {error && <p className="text-xs text-red-400 mt-2 text-center">{error}</p>}
    </div>
  );
}
