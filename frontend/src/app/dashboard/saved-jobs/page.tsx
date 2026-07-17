import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, DollarSign, Building, Bookmark, Trash2 } from "lucide-react";

export const metadata = { title: "Saved Jobs | ApplyGenie" };

// Mock data
const SAVED_JOBS = [
  { id: 2, title: "Product Designer", company: "Linear", location: "San Francisco, CA", salary: "$120k - $160k", type: "Full-time", logo: "L" },
];

export default function SavedJobsPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-heading tracking-tight text-foreground">Saved Jobs</h1>
        <p className="text-muted-foreground mt-1">Jobs you've saved for later.</p>
      </div>

      {SAVED_JOBS.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-card text-center px-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Bookmark className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">No saved jobs</h3>
          <p className="text-muted-foreground mt-1 max-w-sm">
            You haven't saved any jobs yet. Go to the Jobs page to discover and save opportunities.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {SAVED_JOBS.map((job) => (
            <Card key={job.id} className="flex flex-col">
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
              </CardContent>
              <CardFooter className="pt-4 border-t gap-2">
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button className="flex-1">Apply Now</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
