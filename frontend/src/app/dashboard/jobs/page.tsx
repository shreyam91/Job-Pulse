import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, DollarSign, Building } from "lucide-react";

export const metadata = { title: "Jobs | ApplyGenie" };

// Mock jobs data
const JOBS = [
  { id: 1, title: "Senior Frontend Engineer", company: "Vercel", location: "Remote", salary: "$140k - $180k", type: "Full-time", logo: "V" },
  { id: 2, title: "Product Designer", company: "Linear", location: "San Francisco, CA", salary: "$120k - $160k", type: "Full-time", logo: "L" },
  { id: 3, title: "Software Engineer, Backend", company: "Stripe", location: "New York, NY", salary: "$150k - $200k", type: "Full-time", logo: "S" },
  { id: 4, title: "Developer Advocate", company: "Supabase", location: "Remote", salary: "$130k - $170k", type: "Full-time", logo: "S" },
];

export default function JobsPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading tracking-tight text-foreground">Discover Jobs</h1>
          <p className="text-muted-foreground mt-1">Find your next role powered by AI matching.</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search job titles, companies, or keywords..." className="pl-9" />
        </div>
        <Button>Search</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {JOBS.map((job) => (
          <Card key={job.id} className="flex flex-col hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-start gap-4 space-y-0">
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xl flex-shrink-0">
                {job.logo}
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg line-clamp-1">{job.title}</CardTitle>
                <CardDescription className="flex items-center gap-1 mt-1 text-sm font-medium text-foreground">
                  <Building className="h-3 w-3" />
                  {job.company}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {job.location}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                {job.salary}
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                  {job.type}
                </span>
                <span className="inline-flex items-center rounded-md bg-green-500/10 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-400">
                  92% Match
                </span>
              </div>
            </CardContent>
            <CardFooter className="pt-4 border-t gap-2">
              <Button variant="outline" className="w-full">Save</Button>
              <Button className="w-full">Apply Now</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
