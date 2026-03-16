"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Upload,
  Target,
  Mail,
  BarChart3,
  Zap,
  ArrowRight,
  Sparkles,
  Shield,
  Globe2,
  ChevronRight,
  Mic2,
  Briefcase,
  Brain,
  Check,
  Twitter,
  Linkedin,
  Github as GithubIcon,
  Mail as MailIcon,
  Heart,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Navbar from "../layout/Navbar"; // Assuming Navbar is in '../layout/Navbar'
import Link from "next/link";

interface LandingPageProps {
  onGetStarted: () => void;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

function GlowOrb({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "absolute rounded-full blur-3xl opacity-20 pointer-events-none",
        className,
      )}
    />
  );
}

const FEATURES = [
  {
    icon: Mic2,
    title: "AI Interview Agent",
    description:
      "Practice with real-time AI mock interviews tailored to your resume and target jobs.",
    gradient: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-400",
    borderColor: "border-emerald-500/20",
  },
  {
    icon: Brain,
    title: "AI-Powered Matching",
    description:
      "Gemini AI analyzes every job against your profile with transparent scoring.",
    gradient: "from-indigo-500/20 to-purple-500/20",
    iconColor: "text-indigo-400",
    borderColor: "border-indigo-500/20",
  },
  {
    icon: Target,
    title: "Smart Rankings",
    description:
      "Jobs grouped into Top Matches, Good Matches, and Stretch Opportunities.",
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-cyan-400",
    borderColor: "border-cyan-500/20",
  },
  {
    icon: Mail,
    title: "Cold Email Generator",
    description:
      "Generate personalized outreach emails tailored to each job posting.",
    gradient: "from-orange-500/20 to-amber-500/20",
    iconColor: "text-amber-400",
    borderColor: "border-amber-500/20",
  },
  {
    icon: BarChart3,
    title: "Market Analytics",
    description:
      "See trending skills, remote job ratios, and market demand in real-time.",
    gradient: "from-pink-500/20 to-rose-500/20",
    iconColor: "text-rose-400",
    borderColor: "border-rose-500/20",
  },
  {
    icon: Shield,
    title: "ATS Score Analysis",
    description:
      "Know how well your resume passes ATS filters before you apply.",
    gradient: "from-teal-500/20 to-green-500/20",
    iconColor: "text-teal-400",
    borderColor: "border-teal-500/20",
  },
];

const STATS = [
  { value: "50+", label: "Job Sources Scraped" },
  { value: "95%", label: "Matching Accuracy" },
  { value: "<3s", label: "Analysis Speed" },
  { value: "100%", label: "Free to Use" },
];

const STEPS = [
  {
    step: "01",
    title: "Upload Resume",
    desc: "Drop your PDF resume — we parse it instantly",
  },
  {
    step: "02",
    title: "AI Job Match",
    desc: "Gemini AI ranks the best jobs from across the web",
  },
  {
    step: "03",
    title: "AI Analyzes",
    desc: "Gemini AI scores each job against your profile",
  },
  {
    step: "04",
    title: "Get Matches",
    desc: "See ranked jobs with detailed match breakdowns",
  },
  {
    step: "05",
    title: "Apply Smart",
    desc: "Use cold emails, ATS tips, and track applications",
  },
  {
    step: "06",
    title: "Mock Interview",
    desc: "Practice with Nova, our AI agent, for your target role",
  },
  {
    step: "07",
    title: "Land the Offer",
    desc: "Master the real interview with our feedback and data",
  },
];

const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "Senior Frontend Developer",
    company: "TechCorp",
    avatar: "SC",
    content:
      "JobMatch AI helped me find my dream job in just 2 weeks. The AI matching was incredibly accurate, and the interview prep was a game-changer.",
    rating: 5,
  },
  {
    name: "Michael Rodriguez",
    role: "Full Stack Engineer",
    company: "StartupXYZ",
    avatar: "MR",
    content:
      "The cold email generator alone saved me hours of work. I got 3x more responses and landed multiple interviews thanks to personalized outreach.",
    rating: 5,
  },
  {
    name: "Emily Johnson",
    role: "Product Manager",
    company: "Enterprise Inc",
    avatar: "EJ",
    content:
      "From resume analysis to mock interviews, JobMatch AI provided everything I needed to level up my career. Worth every penny!",
    rating: 5,
  },
  {
    name: "David Kim",
    role: "Data Scientist",
    company: "CloudBase",
    avatar: "DK",
    content:
      "The ATS score optimization helped my resume pass through automated filters. I went from 0 callbacks to 5 interviews in one week.",
    rating: 4,
  },
];

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#0a0b0f] text-white overflow-hidden">
      {/* Ambient glow effects */}
      <GlowOrb className="w-[600px] h-[600px] bg-indigo-600 -top-40 -left-40" />
      <GlowOrb className="w-[500px] h-[400px] bg-purple-800 top-70 left-230" />
      <GlowOrb className="w-[400px] h-[400px] bg-cyan-600 bottom-20 left-1/4" />

      {/* Navigation */}
      <Navbar onGetStarted={onGetStarted} />

      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="relative z-10 flex flex-col items-center text-center px-6 pt-16 md:pt-14 pb-14"
      >
        {/* Badge */}
        <motion.div variants={fadeInUp} custom={0}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-600/10 border border-indigo-500/20 mb-8">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs font-medium text-indigo-300">
              Powered by Gemini AI
            </span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeInUp}
          custom={1}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight max-w-4xl"
        >
          <span className="text-white">Your AI Powered</span>
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Career Co-Pilot
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeInUp}
          custom={2}
          className="mt-6 text-base sm:text-lg text-white/40 max-w-2xl leading-relaxed"
        >
          Find the perfect job matches and practice for interviews with
          real-time AI feedback. Everything you need to go from job application
          to final offer.
        </motion.p>

        {/* CTA */}
        <motion.div
          variants={fadeInUp}
          custom={3}
          className="flex flex-col sm:flex-row items-center gap-3 mt-10"
        >
          <button
            onClick={onGetStarted}
            className="group flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-semibold text-base shadow-xl shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all duration-300 hover:scale-[1.02]"
          >
            <Upload className="w-5 h-5" />
            Upload Resume & Start
            <ArrowRight className="w-5 h-5 translate-x-0 group-hover:translate-x-1 transition-transform" />
          </button>
          {/* <span className="text-xs text-white/25">
            No signup required · 100% free
          </span> */}
        </motion.div>

        {/* Stats bar */}
        <motion.div
          variants={fadeInUp}
          custom={4}
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-10 mt-16 md:mt-20"
        >
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                {value}
              </div>
              <div className="text-xs text-white/30 mt-1">{label}</div>
            </div>
          ))}
        </motion.div>
      </motion.section>

      {/* Dashboard Preview */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto max-w-5xl px-6 mb-24"
      >
        <div className="relative rounded-2xl border border-white/[0.08] bg-[#13151c]/80 backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/40">
          {/* Fake window chrome */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-[#0f1117]/60">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="px-4 py-1 rounded-lg bg-white/[0.04] text-xs text-white/30 font-mono">
                localhost:3000
              </div>
            </div>
          </div>
          {/* Screenshot placeholder - show a stylized preview */}
          <div className="bg-[#0f1117]/40 px-6 py-4 border-b border-white/[0.04] flex justify-center">
            <div className="flex items-center gap-1 bg-white/[0.04] rounded-lg p-1 w-fit">
              <div className="px-3 py-1.5 rounded-md bg-indigo-500/20 text-indigo-400 text-[10px] font-bold flex items-center gap-1.5">
                <Briefcase className="w-3 h-3" /> Job Agent
              </div>
              <div className="px-3 py-1.5 rounded-md text-white/20 text-[10px] font-bold flex items-center gap-1.5 opacity-50">
                <Mic2 className="w-3 h-3" /> Interview Agent
              </div>
            </div>
          </div>
          <div className="p-6 grid grid-cols-12 gap-4 min-h-[340px]">
            {/* Sidebar skeleton */}
            <div className="col-span-3 hidden md:block space-y-3">
              <div className="h-6 w-20 rounded bg-white/[0.05]" />
              <div className="h-20 rounded-xl bg-white/[0.03] border border-white/[0.06]" />
              <div className="space-y-2">
                {[8, 6, 10, 7].map((w, i) => (
                  <div
                    key={i}
                    className="h-4 rounded bg-white/[0.03]"
                    style={{ width: `${w * 10}%` }}
                  />
                ))}
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {["React", "Node", "TS", "AWS"].map((t) => (
                  <span
                    key={t}
                    className="px-2 py-1 rounded-md bg-indigo-600/15 text-indigo-400 text-[10px] font-mono"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            {/* Job list skeleton */}
            <div className="col-span-12 md:col-span-5 space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="px-2 py-1 rounded-lg bg-green-500/10 text-green-400 text-[10px] font-semibold flex items-center gap-1">
                  <Target className="w-3 h-3" /> Top Matches
                </div>
                <span className="text-[10px] text-white/20">80-100%</span>
              </div>
              {[
                {
                  title: "Senior Frontend Engineer",
                  score: 92,
                  company: "TechCorp",
                },
                {
                  title: "Full Stack Developer",
                  score: 87,
                  company: "StartupAI",
                },
                { title: "React Lead", score: 84, company: "CloudBase" },
              ].map((job, i) => (
                <div
                  key={i}
                  className={cn(
                    "rounded-xl border p-3 transition-all",
                    i === 0
                      ? "border-indigo-500/40 bg-indigo-600/10"
                      : "border-white/[0.06] bg-white/[0.02]",
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-500/15 text-green-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      {job.score}%
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-white/80">
                    {job.title}
                  </div>
                  <div className="text-[10px] text-white/40">{job.company}</div>
                </div>
              ))}
            </div>
            {/* Detail skeleton */}
            <div className="col-span-4 hidden md:block space-y-3">
              <div className="text-sm font-bold text-white/70">
                Senior Frontend Engineer
              </div>
              <div className="text-xs text-indigo-400">TechCorp</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-[#13151c] border border-white/[0.06] p-3 text-center">
                  <div className="text-xl font-bold text-green-400">92%</div>
                  <div className="text-[9px] text-white/30">Match</div>
                </div>
                <div className="rounded-lg bg-[#13151c] border border-white/[0.06] p-3 text-center">
                  <div className="text-xl font-bold text-indigo-400">88%</div>
                  <div className="text-[9px] text-white/30">ATS</div>
                </div>
              </div>
              <div className="space-y-1.5">
                {["Skills", "Experience", "Tech Stack", "Role"].map(
                  (label, i) => (
                    <div key={label} className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-white/40">{label}</span>
                        <span className="text-indigo-400 font-semibold">
                          {92 - i * 5}%
                        </span>
                      </div>
                      <div className="h-1 rounded-full bg-white/[0.06]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-indigo-400"
                          style={{ width: `${92 - i * 5}%` }}
                        />
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Glow behind preview */}
        <div className="absolute -inset-10 bg-indigo-600/5 blur-3xl rounded-full pointer-events-none -z-10" />
      </motion.section>

      {/* AI Interview Spotlight */}
      <section className="relative z-10 md:px-10 lg:px-14 py-4 bg-gradient-to-b from-transparent via-emerald-500/[0.03] to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Interactive Mockup */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative lg:order-2"
            >
              <div className="absolute -inset-4 bg-emerald-500/10 blur-3xl rounded-full opacity-50" />
              <div className="relative space-y-4">
                {/* Character & Question */}
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border border-emerald-500/30 shadow-2xl shadow-emerald-500/20 bg-[#0f1117]">
                    <img
                      src="/images/ai-character.png"
                      alt="AI Interviwer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 bg-[#1a1c23] border border-white/10 rounded-2xl rounded-tl-none p-4 md:p-6 shadow-xl relative mt-4">
                    <div className="absolute -left-2 top-0 w-4 h-4 bg-[#1a1c23] rotate-45 border-l border-t border-white/10" />
                    <h4 className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Mic2 className="w-3 h-3" /> Shree (AI Interviwer)
                    </h4>
                    <p className="text-xs text-white/30 leading-relaxed">
                      &quot;Walk me through a complex architectural challenge
                      you&#39;ve faced. How did you optimize for
                      scalability?&quot;
                    </p>
                  </div>
                </div>

                {/* Candidate Answer */}
                <div className="flex flex-row-reverse items-start gap-4 pr-0 md:pr-12">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-[10px] font-bold text-indigo-400 shadow-lg shadow-indigo-500/10">
                    YOU
                  </div>
                  <div className="flex-1 bg-white/[0.03] border border-white/[0.05] rounded-2xl rounded-tr-none p-4 shadow-lg text-white/70 text-xs md:text-sm leading-relaxed italic">
                    &quot;I recently refactored a legacy monolithic backend into
                    microservices using Node.js and Redis. By implementing a
                    pub/sub pattern, we reduced latency by 40%...&quot;
                  </div>
                </div>

                {/* AI Feedback Analysis */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="bg-[#0f1117]/80 backdrop-blur-md border border-emerald-500/20 rounded-2xl p-5 shadow-2xl relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 p-3">
                    <div className="text-right">
                      <div className="text-[9px] text-white/30 font-bold uppercase tracking-widest">
                        Analysis Score
                      </div>
                      <div className="text-2xl font-black text-emerald-400">
                        92<span className="text-xs text-white/20">/100</span>
                      </div>
                    </div>
                  </div>

                  <h5 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    Nova&#39;s Insight
                  </h5>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] uppercase font-bold text-white/40">
                          <span>Technical</span>
                          <span className="text-emerald-400">95%</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 w-[95%]" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] uppercase font-bold text-white/40">
                          <span>Clarity</span>
                          <span className="text-indigo-400">88%</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 w-[88%]" />
                        </div>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-start gap-3">
                      <div className="mt-0.5 w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-2.5 h-2.5 text-emerald-400" />
                      </div>
                      <p className="text-[10px] text-white/50 leading-normal">
                        &quot;Strong mention of Redis pub/sub. To hit 100%,
                        consider briefly touching upon how you handled data
                        consistency during the migration.&quot;
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right: Copy Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:order-1"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6 font-mono text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                New: AI Interview Coach
              </div>
              <h2 className="text-3xl md:text-5xl font-bold">
                Don&#39;t Just Apply.
                <br />
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Be Interview Ready.
                </span>
              </h2>
              <p className="text-base text-white/40 leading-relaxed mb-8 max-w-lg">
                Upload your resume once, and our AI Interview Agent generates
                mock sessions specifically for your target roles. Answer using
                your voice or text, and get instant performance analytics.
              </p>

              <ul className="space-y-4 mb-10">
                {[
                  {
                    icon: Brain,
                    title: "Contextual Questions",
                    desc: "Questions tailored to *your* unique experience and the job description.",
                  },
                  {
                    icon: Mic2,
                    title: "Live Simulation",
                    desc: "Simulate high-pressure interviews with a friendly, intelligent AI avatar.",
                  },
                  {
                    icon: Sparkles,
                    title: "Granular Feedback",
                    desc: "Detailed scoring on technical accuracy, clarity, and communication.",
                  },
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-emerald-400">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white/80">
                        {item.title}
                      </h4>
                      <p className="text-xs text-white/30">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <button
                onClick={onGetStarted}
                className="group flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all hover:scale-[1.02] shadow-xl shadow-emerald-900/20"
              >
                Try Free Mock Interview
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 md:px-12 lg:px-20 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            The Road to{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Getting Hired
            </span>
          </h2>
          <p className="text-sm text-white/30 mt-3 max-w-md mx-auto">
            From resume upload to the final handshake, we&#39;ve got you
            covered.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {STEPS.map(({ step, title, desc }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative group"
            >
              <div className="rounded-2xl border border-white/[0.06] bg-[#13151c]/50 backdrop-blur-sm p-6 hover:border-indigo-500/30 hover:bg-indigo-600/5 transition-all duration-300">
                <div className="text-3xl font-extrabold bg-gradient-to-b from-white/15 to-transparent bg-clip-text text-transparent mb-3">
                  {step}
                </div>
                <h3 className="text-sm font-bold text-white/80 mb-1.5">
                  {title}
                </h3>
                <p className="text-xs text-white/35 leading-relaxed">{desc}</p>
              </div>
              {i < STEPS.length - 1 && (
                <ChevronRight className="hidden lg:block absolute -right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-white/10" />
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 px-6 md:px-12 lg:px-20 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Land Your Dream Job
            </span>
          </h2>
          <p className="text-sm text-white/30 mt-3 max-w-lg mx-auto">
            Powerful AI tools that give you an unfair advantage in your job
            search.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {FEATURES.map(
            (
              {
                icon: Icon,
                title,
                description,
                gradient,
                iconColor,
                borderColor,
              },
              i,
            ) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className={cn(
                  "group rounded-2xl border bg-[#13151c]/50 backdrop-blur-sm p-6 hover:scale-[1.02] transition-all duration-300",
                  borderColor,
                  "hover:border-white/15",
                )}
              >
                <div
                  className={cn(
                    "w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4",
                    gradient,
                  )}
                >
                  <Icon className={cn("w-5 h-5", iconColor)} />
                </div>
                <h3 className="text-sm font-bold text-white/80 mb-2">
                  {title}
                </h3>
                <p className="text-xs text-white/35 leading-relaxed">
                  {description}
                </p>
              </motion.div>
            ),
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 px-6 md:px-12 lg:px-20 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            What Our{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
              Users Say
            </span>
          </h2>
          <p className="text-sm text-white/30 mt-3 max-w-md mx-auto">
            Join thousands of professionals who&#39;ve transformed their career
            with JobMatch AI
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white/2 border border-white/5 rounded-2xl p-8 hover:bg-white/3 transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {testimonial.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-lg font-semibold text-white/90">
                      {testimonial.name}
                    </h4>
                    <div className="flex items-center gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-white/20"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/40">
                    <span className="font-medium text-white/60">
                      {testimonial.role}
                    </span>
                    <span>•</span>
                    <span>{testimonial.company}</span>
                  </div>
                </div>
              </div>

              <blockquote className="text-white/70 leading-relaxed italic">
                &ldquo;{testimonial.content}&rdquo;
              </blockquote>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      {/* <section className="relative z-10 px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="rounded-3xl border border-white/[0.06] bg-gradient-to-b from-indigo-600/10 to-transparent p-12 md:p-16 relative overflow-hidden">
            <GlowOrb className="w-[300px] h-[300px] bg-indigo-600 top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            <h2 className="text-3xl md:text-4xl font-bold relative z-10 mb-4">
              Ready to Find Your
              <br />
              <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                Perfect Match?
              </span>
            </h2>
            <p className="text-sm text-white/35 mb-8 relative z-10">
              Upload your resume and let AI do the heavy lifting.
            </p>
            <button
              onClick={onGetStarted}
              className="group relative z-10 inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-semibold shadow-xl shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all duration-300 hover:scale-[1.02]"
            >
              <Sparkles className="w-5 h-5" />
              Get Started Free
              <ArrowRight className="w-5 h-5 translate-x-0 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </section> */}

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.04] py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-8">
            <div className="col-span-2 lg:col-span-2 space-y-6">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight">
                  JobMatch AI
                </span>
              </Link>
              <p className="text-white/30 text-sm max-w-xs leading-relaxed">
                Empowering the modern workforce with Gemini-driven career
                intelligence. Find matches, master interviews, land offers.
              </p>
              <div className="flex gap-4">
                {[Twitter, Linkedin, GithubIcon].map((Icon, i) => (
                  <button
                    key={i}
                    className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-white/40 hover:text-white"
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-sm font-bold uppercase tracking-widest text-white/20">
                Product
              </h4>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/job-agent"
                    className="text-sm text-white/40 hover:text-white transition-colors"
                  >
                    Job Agent
                  </Link>
                </li>
                <li>
                  <Link
                    href="/interview-agent"
                    className="text-sm text-white/40 hover:text-white transition-colors"
                  >
                    Interview Agent
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-sm text-white/40 hover:text-white transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                {/* <li><Link href="/about" className="text-sm text-white/40 hover:text-white transition-colors">Release Notes</Link></li>   */}
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-sm font-bold uppercase tracking-widest text-white/20">
                Company
              </h4>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/about"
                    className="text-sm text-white/40 hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-sm text-white/40 hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="text-sm text-white/40 hover:text-white transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                {/* <li><Link href="/contact" className="text-sm text-white/40 hover:text-white transition-colors">Support</Link></li> */}
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-sm font-bold uppercase tracking-widest text-white/20">
                Legal
              </h4>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/privacy"
                    className="text-sm text-white/40 hover:text-white transition-colors"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-sm text-white/40 hover:text-white transition-colors"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="text-sm text-white/40 hover:text-white transition-colors"
                  >
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between pt-2 border-t border-white/[0.04] gap-4">
            <p className="text-xs text-white/20">
              © 2026 JobMatch AI. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-xs text-white/15">
              <span>Built with</span>
              <Heart className="w-3 h-3 text-red-500/50" />
              <span>for the future of work.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
