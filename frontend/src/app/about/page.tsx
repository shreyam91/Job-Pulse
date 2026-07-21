import Link from "next/link";
import { ArrowLeft, Bot } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center px-6">
          <Link href="/" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-4 max-w-3xl">
        <div className="flex justify-center mb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Bot className="h-8 w-8" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center tracking-tight">Our Mission</h1>
        <p className="text-xl text-muted-foreground leading-relaxed mb-4 text-center font-medium">
          ApplyGenie was founded on a simple belief: finding a job shouldn't be a full-time job itself.
        </p>
        
        <div className="prose prose-lg dark:prose-invert mx-auto">
          <p>
            In today's competitive market, talented professionals spend hundreds of hours tailoring resumes, writing cover letters, and tracking applications. It's an exhausting, manual process that drains energy away from what actually matters: preparing for the role and excelling at the interview.
          </p>
          <p>
            We built <strong>ApplyGenie</strong> to level the playing field. By leveraging cutting-edge Artificial Intelligence, we automate the repetitive tasks of the job search. Our AI doesn't just fill in templates; it understands the semantic requirements of a job description and precisely highlights your relevant experience.
          </p>
          <h2 className="text-2xl font-bold mt-2 mb-2">Designed for the Modern Professional</h2>
          <p>
            We drew inspiration from the best tools you already use every day. ApplyGenie feels like a combination of a blazingly fast issue tracker, a modern workspace, and a brilliant executive assistant.
          </p>
          <p>
            You stay in control. You approve every resume edit and cover letter before it's submitted. We just do the heavy lifting.
          </p>
        </div>
      </main>
    </div>
  );
}
