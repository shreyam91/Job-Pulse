"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2 } from "lucide-react";
import { optimizeResume } from "@/actions/ai";

interface Props {
  resumeId: string | number;
  resumeName?: string;
  buttonVariant?: "default" | "outline" | "ghost";
}

export function AIResumeOptimizer({ resumeId, resumeName, buttonVariant = "outline" }: Props) {
  const [open, setOpen] = useState(false);
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [optimizedText, setOptimizedText] = useState("");

  const handleOptimize = async () => {
    if (!jobDesc) return;
    setLoading(true);
    try {
      // In a real app we'd fetch the resume content by resumeId.
      // Here we just pass a mock base string for demonstration.
      const mockResumeContent = `Software Engineer with 3 years of experience in React and Node.js. Built web apps and improved performance.`;
      
      const res = await optimizeResume({
        resumeContent: mockResumeContent,
        jobDescription: jobDesc
      });
      setOptimizedText(res.content);
    } catch (error) {
      console.error(error);
      alert("Failed to optimize resume. Check backend logs and OPENAI_API_KEY.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} size="sm" className="w-full">
          <Sparkles className="h-4 w-4 mr-2 text-primary" />
          Optimize
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>AI Resume Optimization</DialogTitle>
          <DialogDescription>
            Tailor "{resumeName}" to a specific job description to boost your ATS score.
          </DialogDescription>
        </DialogHeader>

        {!optimizedText ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Job Description</label>
              <Textarea 
                placeholder="Paste the job description here..."
                className="min-h-[200px]"
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleOptimize} disabled={!jobDesc || loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                {loading ? "Optimizing..." : "Optimize Resume"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-green-600">Optimized Resume Output</label>
              <div className="p-4 bg-muted rounded-md max-h-[400px] overflow-y-auto whitespace-pre-wrap text-sm border border-green-500/20">
                {optimizedText}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOptimizedText("")}>Start Over</Button>
              <Button onClick={() => setOpen(false)}>Save to Profile</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
