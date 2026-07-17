"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Briefcase, Bookmark, FileText, Settings, CreditCard, User, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

const OVERVIEW_LINKS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Jobs", href: "/dashboard/jobs", icon: Compass },
  { name: "Applications", href: "/dashboard/applications", icon: Briefcase },
  { name: "Saved Jobs", href: "/dashboard/saved-jobs", icon: Bookmark },
  { name: "Resumes", href: "/dashboard/resumes", icon: FileText },
];

const ACCOUNT_LINKS = [
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <>
      <div>
        <p className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Overview</p>
        <nav className="space-y-1">
          {OVERVIEW_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                  isActive ? "bg-primary/10 text-primary" : "text-foreground"
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div>
        <p className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Account</p>
        <nav className="space-y-1">
          {ACCOUNT_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                  isActive ? "bg-primary/10 text-primary" : "text-foreground"
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
