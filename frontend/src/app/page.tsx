import Link from "next/link";
import { ArrowRight, FileText, Briefcase, Bot, LayoutDashboard, CheckCircle2, Star, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/20">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="flex items-center space-x-3 transition-opacity hover:opacity-80">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Bot className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">ApplyGenie</span>
          </Link>
          <nav className="hidden md:flex gap-8 items-center">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</Link>
            <Link href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Testimonials</Link>
            <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
            <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">About</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/sign-in">
              <Button variant="ghost" className="text-sm font-medium hidden sm:inline-flex">Log in</Button>
            </Link>
            <Link href="/sign-up">
              <Button className="text-sm font-medium rounded-full px-6 shadow-sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-24 lg:pt-20 lg:pb-20">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-30 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/30 to-transparent rounded-full blur-3xl mix-blend-screen"></div>
          </div>

          <div className="container relative mx-auto px-6 lg:px-8 text-center">
            <div className="inline-flex items-center rounded-full border border-border/50 bg-muted/50 px-3 py-1 text-sm font-medium text-muted-foreground mb-8 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              ApplyGenie 1.0 is now live
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 max-w-5xl mx-auto leading-[1.1]">
              Apply to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">Latest Jobs</span> Faster with AI
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
              ApplyGenie discovers matching jobs, expertly tailors your resume, writes compelling cover letters, and organizes your entire job search automatically.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/sign-up">
                <Button size="lg" className="h-14 px-8 rounded-full text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-0.5">
                  Start for free <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              {/* <Link href="/contact">
                <Button size="lg" variant="outline" className="h-14 px-8 rounded-full text-base font-medium border-border/50 bg-background/50 backdrop-blur-sm hover:bg-muted/50 transition-all">
                  Contact Sales
                </Button>
              </Link> */}
            </div>

            {/* Dashboard Mockup */}
            {/* Dashboard Mockup */}
            <div className="relative mx-auto mt-16 max-w-6xl rounded-2xl border border-border/50 bg-background/50 shadow-2xl backdrop-blur-xl ring-1 ring-border/50 p-2 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none"></div>
              
              <div className="rounded-xl overflow-hidden border border-border/80 bg-card/80 shadow-inner relative flex flex-col md:flex-row">
                
                {/* Sidebar */}
                <aside className="hidden w-64 shrink-0 border-r border-border/50 bg-card/50 backdrop-blur-md md:flex md:flex-col relative z-10">
                  <div className="flex h-16 items-center px-6 border-b border-border/50">
                    <h2 className="text-xl font-heading font-bold tracking-tight">ApplyGenie</h2>
                  </div>

                  <nav className="flex-1 space-y-1 p-3 font-sans">
                    {[
                      { icon: "LayoutDashboard", label: "Dashboard", active: false },
                      { icon: "Briefcase", label: "Jobs", active: true },
                      { icon: "Bookmark", label: "Saved Jobs", active: false },
                      { icon: "FileText", label: "Applications", active: false },
                    ].map((item, i) => (
                      <div
                        key={item.label}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all cursor-default ${
                          item.active
                            ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                            : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-sm flex items-center justify-center ${item.active ? 'bg-primary-foreground/20' : 'bg-muted-foreground/20'}`}></div>
                        {item.label}
                      </div>
                    ))}
                  </nav>

                  <div className="p-4 border-t border-border/50">
                    <div className="rounded-xl bg-gradient-to-br from-primary/10 to-accent/5 p-4 border border-primary/10">
                      <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Pro Plan</p>
                      <p className="text-sm font-heading font-bold text-foreground">27 Applications Sent</p>
                      <div className="mt-3 h-1.5 w-full bg-primary/20 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[65%] rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col bg-muted/10 relative z-10">
                  
                  {/* Header */}
                  <header className="flex h-16 items-center justify-between border-b border-border/50 bg-card/30 backdrop-blur-md px-6">
                    <div className="flex items-center gap-4">
                      <div className="flex gap-1.5 md:hidden">
                        <div className="h-3 w-3 rounded-full bg-red-500/80" />
                        <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                        <div className="h-3 w-3 rounded-full bg-green-500/80" />
                      </div>
                      <div className="hidden md:flex h-9 w-64 items-center rounded-md border border-input bg-background/50 px-3 text-sm text-muted-foreground shadow-sm">
                        Search jobs, companies...
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="h-8 rounded-full bg-primary/10 border border-primary/20 px-3 flex items-center justify-center text-xs font-semibold text-primary">
                        Upgrade to Pro
                      </div>
                      <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-accent shadow-inner border border-border/50"></div>
                    </div>
                  </header>

                  <div className="flex-1 p-6 space-y-8 overflow-hidden">
                    
                    {/* Top Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { title: "Applications", value: "127", trend: "+14%", positive: true },
                        { title: "Interviews", value: "12", trend: "+3", positive: true },
                        { title: "Saved Jobs", value: "48", trend: "Active", positive: true },
                        { title: "Avg. ATS Score", value: "91%", trend: "Excellent", positive: true },
                      ].map((stat, i) => (
                        <div key={stat.title} className="rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-5 shadow-sm relative overflow-hidden group">
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">{stat.title}</p>
                          <div className="flex items-end justify-between">
                            <h3 className="text-3xl font-sans font-bold text-foreground tracking-tight">{stat.value}</h3>
                            <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-500 border border-emerald-500/20">
                              {stat.trend}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Jobs List */}
                    <div>
                      <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-heading font-bold text-foreground">AI Matched Roles</h2>
                        <div className="text-sm font-medium text-primary cursor-pointer hover:underline">View all matches</div>
                      </div>

                      <div className="space-y-3">
                        {[
                          { role: "Senior Frontend Engineer", company: "Stripe", location: "San Francisco, CA", platform: "Lever", ats: 97, color: "from-[#635BFF]/20 to-[#635BFF]/5", border: "border-[#635BFF]/30", text: "text-[#635BFF]" },
                          { role: "Product Engineer", company: "Linear", location: "Remote", platform: "Ashby", ats: 94, color: "from-[#5E6AD2]/20 to-[#5E6AD2]/5", border: "border-[#5E6AD2]/30", text: "text-[#5E6AD2]" },
                          { role: "Software Engineer, UI", company: "Vercel", location: "Remote", platform: "Greenhouse", ats: 89, color: "from-foreground/10 to-foreground/5", border: "border-foreground/20", text: "text-foreground" },
                        ].map((job, i) => (
                          <div key={job.company} className="rounded-xl border border-border/50 bg-card/80 p-4 shadow-sm transition-all hover:shadow-md hover:border-border flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-sm relative overflow-hidden">
                            <div className="flex items-center gap-4 z-10">
                              <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${job.color} border ${job.border} flex items-center justify-center font-heading font-bold text-xl ${job.text} shadow-inner`}>
                                {job.company[0]}
                              </div>
                              <div>
                                <h3 className="text-base font-heading font-bold text-foreground">{job.role}</h3>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium mt-0.5">
                                  <span>{job.company}</span>
                                  <span className="w-1 h-1 rounded-full bg-border"></span>
                                  <span>{job.location}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-6 md:gap-8 z-10">
                              <div className="hidden lg:block w-32">
                                <div className="flex justify-between text-xs font-semibold mb-1.5">
                                  <span className="text-muted-foreground">ATS Match</span>
                                  <span className={job.ats >= 90 ? "text-emerald-500" : "text-amber-500"}>{job.ats}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                  <div className={`h-full rounded-full ${job.ats >= 90 ? "bg-emerald-500" : "bg-amber-500"}`} style={{ width: `${job.ats}%` }}></div>
                                </div>
                              </div>
                              
                              <div className="flex gap-2 w-full md:w-auto">
                                <button className="flex-1 md:flex-none rounded-lg border border-border/60 bg-background/50 px-4 py-2 text-sm font-semibold hover:bg-muted transition-colors">
                                  Save
                                </button>
                                <button className="flex-1 md:flex-none rounded-lg bg-foreground text-background px-4 py-2 text-sm font-semibold shadow-sm hover:bg-foreground/90 transition-colors">
                                  Apply Now
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </main>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-10 relative">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">The ultimate operating system for your career</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
                Everything you need to move from application to offer, wrapped in a beautiful, lightning-fast interface.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
              {[
                {
                  icon: <FileText className="h-6 w-6 text-primary" />,
                  title: "AI Resume Optimization",
                  description: "Upload your PDF. We parse it, structure it, and dynamically generate ATS-perfect versions tailored to each job description."
                },
                {
                  icon: <Briefcase className="h-6 w-6 text-accent" />,
                  title: "Intelligent Job Matching",
                  description: "Stop scrolling. Our engine calculates match likelihood based on your precise skills and experience, serving only highly relevant roles."
                },
                {
                  icon: <Bot className="h-6 w-6 text-primary" />,
                  title: "One-Click Cover Letters",
                  description: "Generate highly personalized, non-generic cover letters in seconds. Our AI reads the company's culture and the job's exact requirements."
                },
                {
                  icon: <LayoutDashboard className="h-6 w-6 text-accent" />,
                  title: "Kanban Application Tracker",
                  description: "Drag and drop your applications across stages. From 'Applied' to 'Offer', keep your pipeline organized automatically."
                },
                {
                  icon: <CheckCircle2 className="h-6 w-6 text-primary" />,
                  title: "Smart Interview Prep",
                  description: "Simulate interviews with our AI. Get company-specific technical and behavioral questions based on the role you applied for."
                },
                {
                  icon: <FileText className="h-6 w-6 text-accent" />,
                  title: "Deep Analytics",
                  description: "Measure what matters. Track your application-to-interview conversion rates and discover which resume versions perform best."
                }
              ].map((feature, i) => (
                <div key={i} className="group relative bg-card rounded-3xl p-8 border border-border/50 hover:border-primary/50 transition-colors overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10">
                    <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/50 ring-1 ring-border/50">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-20 bg-muted/30 border-y border-border/50 relative overflow-hidden">
          <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
            <div className="mb-10 md:w-1/2">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Loved by top talent</h2>
              <p className="text-xl text-muted-foreground font-medium">
                Join thousands of professionals who accelerated their careers with ApplyGenie.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { quote: "I was spending hours tweaking my resume for every application. ApplyGenie automated that entirely. I landed a Senior React role at a FAANG in 3 weeks.", author: "Sarah J.", role: "Senior Frontend Engineer" },
                { quote: "The Kanban tracker combined with the AI interview prep is a game changer. It feels like having a personal career coach and an executive assistant.", author: "Michael T.", role: "Product Manager" },
                { quote: "The cover letters generated don't sound like generic AI. They actually pull deep insights from the job description and match my tone perfectly.", author: "Elena R.", role: "Marketing Director" }
              ].map((t, i) => (
                <div key={i} className="bg-background border border-border/50 p-8 rounded-3xl shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex gap-1 mb-6">
                      {[...Array(5)].map((_, j) => <Star key={j} className="h-5 w-5 fill-primary text-primary" />)}
                    </div>
                    <p className="text-lg mb-8 leading-relaxed font-medium text-foreground/90">"{t.quote}"</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-muted border border-border/50 flex items-center justify-center text-muted-foreground font-bold text-lg">
                      {t.author.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold">{t.author}</h4>
                      <p className="text-sm text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-20 relative">
          <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
            <div className="text-center mb-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Simple, transparent pricing</h2>
              <p className="text-xl text-muted-foreground font-medium">
                Invest in your career. Cancel anytime.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto">
              {/* Free Tier */}
              <div className="bg-card border border-border/50 rounded-3xl p-8 lg:p-10 flex flex-col shadow-sm">
                <h3 className="text-2xl font-bold mb-2">Starter</h3>
                <p className="text-muted-foreground mb-6">For casual job seekers</p>
                <div className="mb-8">
                  <span className="text-5xl font-extrabold">₹0</span>
                  <span className="text-muted-foreground font-medium"> / month</span>
                </div>
                <ul className="space-y-4 mb-10 flex-1">
                  {["1 Resume Version", "10 AI Cover Letters / month", "Basic Job Tracking", "Standard Support"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-muted-foreground font-medium">
                      <CheckCircle2 className="h-5 w-5 text-primary/70 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/sign-up" className="w-full">
                  <Button variant="outline" className="w-full h-12 rounded-full font-semibold border-border/50 bg-background/50 hover:bg-muted/50">Get Started</Button>
                </Link>
              </div>

              {/* Pro Tier */}
              <div className="relative bg-background border border-primary/30 rounded-3xl p-8 lg:p-10 flex flex-col shadow-2xl shadow-primary/10">
                <div className="absolute top-0 right-8 -translate-y-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <p className="text-muted-foreground mb-6">For the serious applicant</p>
                <div className="mb-8">
                  <span className="text-5xl font-extrabold">₹199</span>
                  <span className="text-muted-foreground font-medium"> / month</span>
                </div>
                <ul className="space-y-4 mb-10 flex-1">
                  {["Unlimited Resume Versions", "Unlimited Cover Letters", "Advanced AI Interview Prep", "Deep Analytics & Insights", "Priority Support"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 font-medium">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/sign-up" className="w-full">
                  <Button className="w-full h-12 rounded-full font-semibold bg-primary hover:bg-primary/90 text-primary-foreground">Upgrade to Pro</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-muted/30 border-t border-border/50">
          <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Frequently Asked Questions</h2>
            </div>

            <div className="mx-auto max-w-2xl">
              <Accordion>
                {[
                  { q: "How does the AI Resume Builder work?", a: "You simply upload your existing resume in PDF or DOCX format. Our engine parses the structure, extracts your skills and experience, and stores it. When you find a job you like, the AI cross-references the job description with your profile to generate an ATS-optimized resume emphasizing your most relevant qualifications." },
                  { q: "Can I edit the generated cover letters?", a: "Absolutely. We believe AI should be a co-pilot, not autopilot. You always have full control to edit, tweak, and perfect the generated content before you submit anything." },
                  { q: "Is my data private and secure?", a: "Yes. Your data is encrypted at rest and in transit. We never sell your personal information or use your resumes to train third-party models without your explicit consent." },
                  { q: "Can I cancel my subscription anytime?", a: "Yes, you can cancel your Pro subscription at any time right from your billing dashboard. You will retain access to Pro features until the end of your billing cycle." }
                ].map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="bg-background rounded-2xl border border-border/50 mb-4 px-6 overflow-hidden">
                    <AccordionTrigger className="text-lg font-bold hover:no-underline py-6">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed text-base pb-6">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5"></div>
          <div className="container relative mx-auto px-6 lg:px-8 max-w-4xl text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">Ready to transform your job search?</h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-medium">
              Join thousands of professionals landing better jobs, faster. Get started today for free.
            </p>
            <Link href="/sign-up">
              <Button size="lg" className="h-16 px-10 rounded-full text-lg font-bold shadow-2xl shadow-primary/30 hover:scale-105 transition-transform duration-300">
                Get Started For Free
              </Button>
            </Link>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border/50 py-16">
        <div className="container mx-auto px-6 lg:px-8 max-w-screen-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-16">
            <div className="col-span-2 lg:col-span-2">
              <Link href="/" className="flex items-center space-x-2 mb-6">
                <Bot className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl tracking-tight">ApplyGenie</span>
              </Link>
              <p className="text-muted-foreground max-w-sm font-medium leading-relaxed">
                Your AI Job Application Assistant. Building the future of career acceleration.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-foreground">Product</h4>
              <ul className="space-y-4 text-muted-foreground font-medium">
                <li><Link href="#features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
            </div>
            {/* <div>
              <h4 className="font-bold mb-6 text-foreground">Resources</h4>
              <ul className="space-y-4 text-muted-foreground font-medium">
                <li><Link href="#" className="hover:text-foreground transition-colors">Blog</Link></li>
                
                <li><Link href="#" className="hover:text-foreground transition-colors">Help Center</Link></li>
              </ul>
            </div> */}
            <div>
              <h4 className="font-bold mb-6 text-foreground">Legal</h4>
              <ul className="space-y-4 text-muted-foreground font-medium">
                <li><Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4 text-muted-foreground font-medium">
            <p>© 2026 ApplyGenie. All rights reserved.</p>
            <div className="flex gap-6">
              {/* <Link href="#" className="hover:text-foreground transition-colors">Twitter</Link>
              <Link href="#" className="hover:text-foreground transition-colors">LinkedIn</Link>
              <Link href="#" className="hover:text-foreground transition-colors">GitHub</Link> */}
              <p>Made for modern Job Seekers.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
