import Link from "next/link";
import { ArrowLeft, Mail, MessageSquare, Building } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center px-6">
          <Link href="/" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Get in touch</h1>
            <p className="text-xl text-muted-foreground mb-12 font-medium">
              Have questions about our Pro plan or want to request a feature? We&apos;d love to hear from you.
            </p>

            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted border border-border/50">
                  <Mail className="h-6 w-6 text-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Email us</h3>
                  <p className="text-muted-foreground mb-1">Our friendly team is here to help.</p>
                  <a href="mailto:hello@applygenie.com" className="text-primary font-medium hover:underline">hello@applygenie.com</a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted border border-border/50">
                  <MessageSquare className="h-6 w-6 text-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Support</h3>
                  <p className="text-muted-foreground mb-1">We&apos;re available via in-app chat.</p>
                  <a href="#" className="text-primary font-medium hover:underline">Visit Support Center</a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted border border-border/50">
                  <Building className="h-6 w-6 text-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Office</h3>
                  <p className="text-muted-foreground mb-1">Come say hello at our HQ.</p>
                  <p className="text-foreground font-medium">100 Tech Hub Blvd<br/>San Francisco, CA 94105</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-3xl p-8 border border-border/50 shadow-sm">
            <h3 className="text-2xl font-bold mb-6">Send a message</h3>
            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First name</label>
                  <input type="text" className="w-full h-11 px-3 rounded-md bg-background border border-input text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="Jane" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last name</label>
                  <input type="text" className="w-full h-11 px-3 rounded-md bg-background border border-input text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <input type="email" className="w-full h-11 px-3 rounded-md bg-background border border-input text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="jane@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <textarea className="w-full p-3 rounded-md bg-background border border-input text-sm outline-none focus:ring-2 focus:ring-ring min-h-30 resize-y" placeholder="How can we help?"></textarea>
              </div>
              <Button type="button" className="w-full h-12 text-base font-semibold mt-2">Send Message</Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
