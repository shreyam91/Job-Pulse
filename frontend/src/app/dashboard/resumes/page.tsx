import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Download, Edit3, Trash2 } from "lucide-react";
import { AIResumeOptimizer } from "@/components/dashboard/AIResumeOptimizer";

export const metadata = { title: "Resumes | ApplyGenie" };

const RESUMES = [
  { id: 1, name: "Frontend Engineer - Vercel", updatedAt: "2 days ago", matchScore: "95%" },
  { id: 2, title: "Full Stack - General", updatedAt: "1 week ago", matchScore: "N/A" },
];

export default function ResumesPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading tracking-tight text-foreground">Resumes</h1>
          <p className="text-muted-foreground mt-1">Manage and optimize your tailored resumes.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create New Resume
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {RESUMES.map((resume) => (
          <Card key={resume.id} className="flex flex-col hover:border-primary/50 transition-colors cursor-pointer">
            <CardHeader>
              <div className="h-40 bg-muted rounded-md mb-4 flex items-center justify-center border border-dashed border-border/50">
                <FileText className="h-12 w-12 text-muted-foreground/30" />
              </div>
              <CardTitle className="text-lg">{resume.name || resume.title}</CardTitle>
              <CardDescription>Updated {resume.updatedAt}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">ATS Match Score</span>
                <span className="font-semibold text-green-600 dark:text-green-400">{resume.matchScore}</span>
              </div>
            </CardContent>
            <CardFooter className="pt-4 border-t flex justify-between gap-2">
              <div className="flex-1">
                <AIResumeOptimizer resumeId={resume.id} resumeName={resume.name || resume.title} />
              </div>
              <Button variant="ghost" size="icon">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
