"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, MapPin, Building, Loader2, Link as LinkIcon, RefreshCcw, Clock, Globe, Filter } from "lucide-react";
import { fetchScrapedJobs } from "@/actions/jobs";

function formatTimeAgo(dateString: string) {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (isNaN(diffInSeconds)) return "Recently";
  if (diffInSeconds < 60) return `Just now`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
}

const LOADING_MESSAGES = [
  "🔍 Hunting the freshest jobs across the internet...",
  "🚀 Searching company career pages...",
  "💼 Collecting opportunities just for you...",
  "🌍 Scanning LinkedIn, Indeed & more...",
  "⚡ Finding remote, hybrid & onsite roles...",
  "🤖 AI is sorting the best matches...",
  "✨ Almost there! Great jobs are on the way..."
];

export function JobsList() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(21);
  const [selectedSource, setSelectedSource] = useState<string>("All");
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>("All");
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);

  useEffect(() => {
    if (!loading) return;

    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % LOADING_MESSAGES.length;
      setLoadingMessage(LOADING_MESSAGES[index]);
    }, 1800);

    return () => clearInterval(interval);
  }, [loading]);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const data = await fetchScrapedJobs();
      setJobs(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const sources = useMemo(() => {
    const s = new Set<string>();
    jobs.forEach(job => {
      if (job.source) s.add(job.source);
    });
    return ["All", ...Array.from(s).sort()];
  }, [jobs]);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = 
      job.title.toLowerCase().includes(search.toLowerCase()) || 
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.skills?.some((s: string) => s.toLowerCase().includes(search.toLowerCase()));
    
    const matchesSource = selectedSource === "All" || job.source === selectedSource;
    const matchesWorkMode = selectedWorkMode === "All" || (job.workMode || "onsite").toLowerCase() === selectedWorkMode.toLowerCase();

    return matchesSearch && matchesSource && matchesWorkMode;
  });

  const visibleJobs = filteredJobs.slice(0, visibleCount);

  return (
    <>
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search job titles, companies, or skills..." 
              className="pl-9" 
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setVisibleCount(21);
              }}
            />
          </div>
          <Button onClick={loadJobs} disabled={loading} variant="outline">
            <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading && jobs.length > 0 ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-muted/30 rounded-xl border border-border/50">
  {/* Platform Filter */}
  <div className="flex flex-wrap items-center gap-2">
    <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground w-24">
      <Filter className="h-4 w-4" />
      Platforms
    </div>

    {sources.map((source) => (
      <button
        key={source}
        onClick={() => {
          setSelectedSource(source);
          setVisibleCount(21);
        }}
        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
          selectedSource === source
            ? "bg-primary text-primary-foreground"
            : "bg-background border border-border text-foreground hover:bg-muted"
        }`}
      >
        <span className="capitalize">{source}</span>
      </button>
    ))}
  </div>

  {/* Work Mode Filter */}
  <div className="flex flex-wrap items-center gap-2">
    <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground w-[100px] whitespace-nowrap">
      <Globe className="h-4 w-4" />
      Work Mode
    </div>

    {["All", "Remote", "Hybrid", "Onsite"].map((mode) => (
      <button
        key={mode}
        onClick={() => {
          setSelectedWorkMode(mode);
          setVisibleCount(21);
        }}
        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
          selectedWorkMode === mode
            ? "bg-primary text-primary-foreground"
            : "bg-background border border-border text-foreground hover:bg-muted"
        }`}
      >
        {mode}
      </button>
    ))}
  </div>
</div>
      </div>

      {loading && jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Loader2 className="h-12 w-12 animate-spin mb-6 text-primary" />
        
          <h3 className="text-xl font-semibold mb-2">
            Finding your next opportunity...
          </h3>
        
          <p className="text-muted-foreground">
            {loadingMessage}
          </p>
        
          <p className="text-sm text-muted-foreground/70 mt-3">
            This usually takes <span className="font-medium">15–20 seconds</span>.
            Grab a coffee ☕ while we do the heavy lifting.
          </p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p>No jobs found matching your filters.</p>
          <Button variant="link" onClick={() => { setSearch(""); setSelectedSource("All"); setSelectedWorkMode("All"); }}>
            Clear all filters
          </Button>
        </div>
      ) : (
        <div className={`space-y-6 transition-opacity duration-200 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {visibleJobs.map((job, idx) => (
              <Card key={`${job.sourceUrl}-${idx}`} className="flex flex-col hover:border-primary/50 transition-colors bg-card">
                <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xl flex-shrink-0 uppercase">
                    {job.company.charAt(0)}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <CardTitle className="text-lg truncate" title={job.title}>{job.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1 text-sm font-medium text-foreground truncate">
                      <Building className="h-3 w-3 shrink-0" />
                      <span className="truncate">{job.company}</span>
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-3 pt-2 pb-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {formatTimeAgo(job.postedAt)}
                    </div>
                    <div className="flex items-center gap-1.5 capitalize text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full">
                      <Globe className="h-3.5 w-3.5" />
                      {job.source}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span className="capitalize truncate">{job.location || job.workMode}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground capitalize">
                      {job.workMode || 'Remote'}
                    </span>
                    {job.skills?.slice(0, 3).map((skill: string) => (
                      <span key={skill} className="inline-flex items-center rounded-md border border-border px-2 py-0.5 text-xs font-medium text-foreground">
                        {skill}
                      </span>
                    ))}
                    {job.skills?.length > 3 && (
                      <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        +{job.skills.length - 3}
                      </span>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-3 border-t flex flex-row items-center justify-between gap-2 bg-muted/20">
                  <Dialog>
                    <DialogTrigger 
                      render={<Button variant="outline" size="sm" className="flex-1 bg-background" />}
                    >
                      Details
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
                      <DialogHeader className="shrink-0 pb-6 border-b">
                        <DialogTitle className="text-2xl font-bold leading-tight">{job.title}</DialogTitle>
                        <DialogDescription asChild>
                          <div className="flex flex-col gap-3 mt-4">
                            <div className="flex flex-wrap items-center gap-4 text-sm">
                              <span className="flex items-center gap-1.5 text-foreground font-semibold bg-muted/50 px-3 py-1 rounded-full">
                                <Building className="h-4 w-4 text-muted-foreground" />
                                {job.company}
                              </span>
                              <span className="flex items-center gap-1.5 text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span className="capitalize">{job.location}</span>
                              </span>
                              <span className="flex items-center gap-1.5 text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>{formatTimeAgo(job.postedAt)}</span>
                              </span>
                              <span className="flex items-center gap-1.5 capitalize text-primary bg-primary/10 px-3 py-1 rounded-full font-medium">
                                <Globe className="h-4 w-4" />
                                {job.source}
                              </span>
                            </div>
                            
                            {/* Skills Row */}
                            {job.skills && job.skills.length > 0 && (
                              <div className="flex flex-wrap gap-2 pt-2">
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mr-1 py-1">Skills:</span>
                                {job.skills.map((skill: string) => (
                                  <span key={skill} className="inline-flex items-center rounded-md border border-border bg-background px-2.5 py-0.5 text-xs font-medium text-foreground shadow-sm">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex-1 overflow-y-auto py-6 pr-4 custom-scrollbar">
                        <div 
                          className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-foreground/90 
                            prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg 
                            prose-p:leading-relaxed prose-p:mb-5 
                            prose-ul:my-5 prose-ul:list-disc prose-ul:pl-6 prose-li:mb-2 prose-li:leading-relaxed
                            prose-a:text-primary prose-a:font-medium prose-a:underline-offset-4 hover:prose-a:text-primary/80
                            marker:text-muted-foreground
                            [&>div]:mb-5 [&>br]:mb-2 [&>span]:mb-4"
                          dangerouslySetInnerHTML={{ __html: job.description || "No description provided by the platform." }}
                        />
                      </div>
                      <div className="shrink-0 pt-4 border-t flex justify-end gap-2">
                        <Button variant="outline" className="w-32">Save Job</Button>
                        <Button className="w-32" onClick={() => window.open(job.sourceUrl, '_blank')}>
                          Apply Now
                          <LinkIcon className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button size="sm" className="flex-1" onClick={() => window.open(job.sourceUrl, '_blank')}>
                    Apply <LinkIcon className="h-3 w-3 ml-1.5" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="flex flex-col items-center gap-2 mt-8 pb-8">
            <p className="text-sm text-muted-foreground">
              Showing {visibleJobs.length} of {filteredJobs.length} jobs
            </p>
            {visibleCount < filteredJobs.length && (
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => setVisibleCount(prev => prev + 21)}
              >
                Load More Jobs
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
