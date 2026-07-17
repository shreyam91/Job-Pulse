import { JobsList } from "@/components/dashboard/JobsList";

export const metadata = { title: "Jobs | ApplyGenie" };

export default function JobsPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading tracking-tight text-foreground">Discover Jobs</h1>
          <p className="text-muted-foreground mt-1">Live jobs pulled directly from Greenhouse, Lever, Remotive, and LinkedIn.</p>
        </div>
      </div>

      <JobsList />
    </div>
  );
}
