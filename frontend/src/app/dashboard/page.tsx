import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Briefcase,
  Building,
  CheckCircle,
  Clock,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Applications",
      value: "24",
      icon: Briefcase,
      color: "text-blue-500",
    },
    {
      title: "Interviews",
      value: "3",
      icon: Clock,
      color: "text-amber-500",
    },
    {
      title: "Offers",
      value: "1",
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      title: "Companies",
      value: "18",
      icon: Building,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading tracking-tight text-foreground">
            Welcome back, Jordan!
          </h1>

          <p className="text-muted-foreground mt-1">
            Here is what's happening with your job search today.
          </p>
        </div>

        <Link
          href="/dashboard/applications/new"
          className="shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground h-8 gap-1.5 px-2.5 inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all"
        >
          Add Application
        </Link>
      </div>


      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;

          return (
            <Card
              key={i}
              className="relative overflow-hidden border-border bg-card shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Background Icon */}
              <Icon
                className={`absolute -right-6 -bottom-6 h-36 w-36 ${stat.color} opacity-[0.08]`}
                strokeWidth={1.2}
              />

              <CardContent className="relative z-10 p-6">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>

                <p className="mt-2 text-3xl font-bold font-sans tracking-tight text-foreground">
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>


      {/* Main Grid */}
      <div className="grid gap-6 md:grid-cols-7">

        {/* Recent Applications Activity */}
        <Card className="col-span-1 md:col-span-4 border-border shadow-sm">
          <CardHeader>
            <CardTitle className="font-heading">
              Recent Activity
            </CardTitle>

            <CardDescription>
              Your latest application updates
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-8">
              {[
                {
                  company: "Vercel",
                  role: "Frontend Engineer",
                  status: "Interview",
                  time: "2 hours ago",
                },
                {
                  company: "Stripe",
                  role: "Software Engineer",
                  status: "Applied",
                  time: "Yesterday",
                },
                {
                  company: "Linear",
                  role: "Product Engineer",
                  status: "Saved",
                  time: "2 days ago",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center mr-4 border border-accent/10">
                    <Building className="w-5 h-5 text-accent" />
                  </div>

                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none text-foreground">
                      {item.company}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {item.role}
                    </p>
                  </div>

                  <div className="text-right space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      {item.status}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>


        {/* ATS Score Overview */}
        <Card className="col-span-1 md:col-span-3 border-border shadow-sm">
          <CardHeader>
            <CardTitle className="font-heading">
              Resume Optimization
            </CardTitle>

            <CardDescription>
              Average ATS match score
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col items-center justify-center py-6">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-muted/30"
                />

                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray="283"
                  strokeDashoffset="42"
                  className="text-primary transition-all duration-1000 ease-out"
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-bold font-sans text-foreground">
                  85
                </span>

                <span className="text-xs font-medium text-muted-foreground">
                  SCORE
                </span>
              </div>
            </div>

            <p className="text-sm text-center text-muted-foreground mt-6 px-4">
              Your tailored resumes are matching well with job descriptions.
              Keep it up!
            </p>

            <Link
              href="/dashboard/resumes"
              className="mt-4 w-full h-8 px-2.5 inline-flex shrink-0 items-center justify-center rounded-lg border border-border bg-background text-sm font-medium transition-all hover:bg-muted hover:text-foreground"
            >
              Optimize New Resume
            </Link>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}