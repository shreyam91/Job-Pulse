"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2, Copy, Check } from "lucide-react";
import { generateCoverLetter } from "@/actions/ai";

interface Props {
  jobTitle: string;
  companyName: string;
  buttonVariant?: "default" | "outline" | "ghost";
}

export function AICoverLetterGenerator({ jobTitle, companyName, buttonVariant = "default" }: Props) {
  const [open, setOpen] = useState(false);
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedText, setGeneratedText] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      // In a real app we'd fetch the user's profile context.
      const mockProfileContext = `Software Engineer with 4 years of experience. Currently working at a fast-paced startup. Skilled in React, Node.js, and scaling applications.`;
      
      const res = await generateCoverLetter({
        jobTitle,
        companyName,
        jobDescription: jobDesc,
        resumeContext: mockProfileContext,
      });
      setGeneratedText(res.content);
    } catch (error) {
      console.error(error);
      alert("Failed to generate cover letter. Check backend logs and OPENAI_API_KEY.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} className="w-full">
          <Sparkles className="h-4 w-4 mr-2" />
          AI Cover Letter
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Generate Cover Letter</DialogTitle>
          <DialogDescription>
            Generate a personalized cover letter for the <strong>{jobTitle}</strong> role at <strong>{companyName}</strong>.
          </DialogDescription>
        </DialogHeader>

        {!generatedText ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Job Description (Optional but recommended)</label>
              <Textarea 
                placeholder="Paste the job description here so the AI can tailor the letter..."
                className="min-h-[150px]"
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleGenerate} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                {loading ? "Generating..." : "Generate Letter"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2 relative">
              <label className="text-sm font-medium text-primary">Generated Cover Letter</label>
              <div className="p-4 bg-muted rounded-md max-h-[400px] overflow-y-auto whitespace-pre-wrap text-sm border">
                {generatedText}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="absolute top-6 right-2"
                onClick={copyToClipboard}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setGeneratedText("")}>Regenerate</Button>
              <Button onClick={() => setOpen(false)}>Done</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
