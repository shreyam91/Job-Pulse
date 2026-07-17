"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function AtsAnalyzerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file || !jobDescription) {
      toast.error('Please upload a resume and paste a job description.');
      return;
    }

    setLoading(true);
    try {
      // 1. Upload Resume
      const formData = new FormData();
      formData.append('resume', file);
      
      const uploadRes = await fetch('http://localhost:5000/api/ats/upload', {
        method: 'POST',
        body: formData,
      });
      const uploadData = await uploadRes.json();
      
      if (!uploadRes.ok) throw new Error(uploadData.error || 'Upload failed');
      
      const resumeId = uploadData.resumeId;

      // 2. We mock a Job creation for this demo as we didn't build the job creation UI endpoint
      // In a real flow, the job is selected or created first.
      const mockJobId = "00000000-0000-0000-0000-000000000001"; 

      // 3. Trigger Analysis
      // We would ideally poll this because BullMQ is async, but for demo we just call analyze
      const analyzeRes = await fetch('http://localhost:5000/api/ats/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId, jobId: mockJobId }),
      });
      
      const analyzeData = await analyzeRes.json();
      if (!analyzeRes.ok) throw new Error(analyzeData.error || 'Analysis failed');

      setResult(analyzeData.analysis);
      toast.success('Analysis complete!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <h1 className="text-3xl font-bold tracking-tight mb-6">AI ATS Resume Analyzer</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>1. Upload Resume</CardTitle>
            <CardDescription>Upload your resume in PDF format.</CardDescription>
          </CardHeader>
          <CardContent>
            <input 
              type="file" 
              accept=".pdf" 
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Job Description</CardTitle>
            <CardDescription>Paste the target job description.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea 
              placeholder="Paste job description here..." 
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={4}
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center mb-10">
        <Button onClick={handleAnalyze} disabled={loading || !file || !jobDescription} size="lg">
          {loading ? 'Analyzing...' : 'Analyze Match'}
        </Button>
      </div>

      {result && (
        <Card className="mt-8 border-green-200 shadow-lg">
          <CardHeader className="bg-green-50 rounded-t-lg">
            <CardTitle className="text-green-800">Analysis Results</CardTitle>
            <CardDescription>Overall Match Score: {result.overall_score}/100</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Skill Match</p>
                <p className="text-xl font-bold">{result.skill_match_score}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Semantic</p>
                <p className="text-xl font-bold">{result.semantic_similarity_score}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Experience</p>
                <p className="text-xl font-bold">{result.experience_match_score}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold mb-2">AI Feedback & Explanation</h3>
              <p className="text-gray-700 whitespace-pre-wrap bg-blue-50 p-4 rounded-lg">
                {result.ai_explanation}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Cold Email Draft</h3>
              <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 border p-4 rounded-lg">
                {result.cold_email_draft}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
