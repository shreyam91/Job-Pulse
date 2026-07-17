import Link from "next/link";
import { SidebarNav } from "@/components/dashboard/SidebarNav";
import { Bot, LayoutDashboard, Briefcase, Bookmark, FileText, Settings, CreditCard, LogOut, Search, Bell, User, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 border-r border-border bg-card hidden md:flex flex-col z-20">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/" className="flex items-center space-x-2">
            <Bot className="h-6 w-6 text-primary" />
            <span className="font-bold font-heading text-xl tracking-tight">ApplyGenie</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-6">
          <SidebarNav />
        </div>

        <div className="p-4 border-t border-border">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-64 relative min-h-screen min-w-0">
        {/* Top Navbar */}
        <header className="h-16 flex items-center justify-between border-b border-border bg-card/80 backdrop-blur-sm px-4 md:px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md hidden sm:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search jobs, applications..."
                className="w-full h-9 rounded-md border border-input bg-background pl-9 pr-4 text-sm shadow-sm outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* <Button variant="ghost" size="icon" className="text-muted-foreground relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500"></span>
            </Button> */}
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-accent shadow-inner border border-border flex items-center justify-center text-primary-foreground font-bold text-xs">
              SK
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-auto min-h-0">
          {children}
        </main>
      </div>
    </div>
  );
}
