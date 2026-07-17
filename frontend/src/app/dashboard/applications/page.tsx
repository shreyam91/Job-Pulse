import { getApplications } from "@/actions/applications";
import KanbanBoard from "./KanbanBoard";

export const metadata = {
  title: "Applications | ApplyGenie",
};

export default async function ApplicationsPage() {
  const applications = await getApplications();

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold font-heading tracking-tight text-foreground">Applications</h1>
          <p className="text-muted-foreground mt-1">Track and manage your job applications.</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden min-h-0">
        <KanbanBoard initialApplications={applications} />
      </div>
    </div>
  );
}
