"use client";

import Link from "next/link";
import { ArrowLeft, Building2, Briefcase, Link as LinkIcon, MapPin, DollarSign, Calendar, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AddApplicationPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in-0 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" asChild className="rounded-full h-10 w-10">
          <Link href="/dashboard">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold font-heading tracking-tight text-foreground">Add New Application</h1>
          <p className="text-muted-foreground mt-1">Track a job you've applied to manually.</p>
        </div>
      </div>

      <div className="rounded-[24px] border border-border/50 bg-card shadow-sm p-6 md:p-8">
        <form className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Company Name *</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/70" />
                <Input placeholder="e.g. Acme Corp" className="pl-10 h-12 rounded-xl" required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Job Title / Role *</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/70" />
                <Input placeholder="e.g. Senior Frontend Engineer" className="pl-10 h-12 rounded-xl" required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Job Posting URL</label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/70" />
                <Input placeholder="https://..." type="url" className="pl-10 h-12 rounded-xl" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Status</label>
              <select className="flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <option value="saved">Saved</option>
                <option value="applied">Applied</option>
                <option value="interview">Interviewing</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Location / Work Mode</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/70" />
                <Input placeholder="e.g. Remote, NYC" className="pl-10 h-12 rounded-xl" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Salary Range</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/70" />
                <Input placeholder="e.g. $120k - $150k" className="pl-10 h-12 rounded-xl" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Date Applied</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/70" />
                <Input type="date" className="pl-10 h-12 rounded-xl" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Notes</label>
            <Textarea 
              placeholder="Any details about the interview process, recruiters, etc." 
              className="min-h-[140px] rounded-xl resize-y text-base p-4"
            />
          </div>

          <div className="pt-6 flex items-center justify-end gap-3 border-t border-border/50">
            <Button variant="ghost" asChild className="rounded-xl h-11 px-6">
              <Link href="/dashboard">Cancel</Link>
            </Button>
            <Button type="submit" className="rounded-xl h-11 gap-2 px-6">
              <Save className="h-4 w-4" />
              Save Application
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
