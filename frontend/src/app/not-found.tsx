import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bot, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/10 flex flex-col items-center justify-center p-4">
      {/* Decorative Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative z-10 text-center max-w-md">
        <div className="mb-8 flex justify-center">
          <div className="rounded-3xl bg-primary/10 p-6 shadow-sm">
            <Bot className="h-16 w-16 text-primary" />
          </div>
        </div>
        
        <h1 className="text-8xl font-black text-primary/20 font-heading mb-4">404</h1>
        <h2 className="text-3xl font-bold tracking-tight mb-3">Page not found</h2>
        <p className="text-muted-foreground text-lg mb-8">
          Sorry, we couldn't find the page you're looking for. The link might be broken, or the page may have been removed.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button render={<Link href="/" />} size="lg" className="w-full sm:w-auto gap-2 rounded-xl">
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
          <Button render={<Link href="/dashboard" />} variant="outline" size="lg" className="w-full sm:w-auto gap-2 rounded-xl">
            <ArrowLeft className="h-4 w-4" />
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
