'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Upload, Brain, Target, Mail, BarChart3, Zap,
  ArrowRight, Sparkles, Shield, Globe2, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LandingPageProps {
  onGetStarted: () => void;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

function GlowOrb({ className }: { className?: string }) {
  return (
    <div className={cn('absolute rounded-full blur-3xl opacity-20 pointer-events-none', className)} />
  );
}

const FEATURES = [
  {
    icon: Upload,
    title: 'Upload Your Resume',
    description: 'Drop your PDF and our parser extracts skills, experience, and roles instantly.',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-cyan-400',
    borderColor: 'border-cyan-500/20',
  },
  {
    icon: Brain,
    title: 'AI-Powered Matching',
    description: 'Gemini AI analyzes every job against your profile with transparent scoring.',
    gradient: 'from-purple-500/20 to-indigo-500/20',
    iconColor: 'text-indigo-400',
    borderColor: 'border-indigo-500/20',
  },
  {
    icon: Target,
    title: 'Smart Rankings',
    description: 'Jobs grouped into Top Matches, Good Matches, and Stretch Opportunities.',
    gradient: 'from-green-500/20 to-emerald-500/20',
    iconColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/20',
  },
  {
    icon: Mail,
    title: 'Cold Email Generator',
    description: 'Generate personalized outreach emails tailored to each job posting.',
    gradient: 'from-orange-500/20 to-amber-500/20',
    iconColor: 'text-amber-400',
    borderColor: 'border-amber-500/20',
  },
  {
    icon: BarChart3,
    title: 'Market Analytics',
    description: 'See trending skills, remote job ratios, and market demand in real-time.',
    gradient: 'from-pink-500/20 to-rose-500/20',
    iconColor: 'text-rose-400',
    borderColor: 'border-rose-500/20',
  },
  {
    icon: Shield,
    title: 'ATS Score Analysis',
    description: 'Know how well your resume passes ATS filters before you apply.',
    gradient: 'from-teal-500/20 to-green-500/20',
    iconColor: 'text-teal-400',
    borderColor: 'border-teal-500/20',
  },
];

const STATS = [
  { value: '50+', label: 'Job Sources Scraped' },
  { value: '95%', label: 'Matching Accuracy' },
  { value: '<3s', label: 'Analysis Speed' },
  { value: '100%', label: 'Free to Use' },
];

const STEPS = [
  { step: '01', title: 'Upload Resume', desc: 'Drop your PDF resume — we parse it instantly' },
  { step: '02', title: 'AI Analyzes', desc: 'Gemini AI scores each job against your profile' },
  { step: '03', title: 'Get Matches', desc: 'See ranked jobs with detailed match breakdowns' },
  { step: '04', title: 'Apply Smart', desc: 'Use cold emails, ATS tips, and track applications' },
];

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#0a0b0f] text-white overflow-hidden">
      {/* Ambient glow effects */}
      <GlowOrb className="w-[600px] h-[600px] bg-indigo-600 -top-40 -left-40" />
      <GlowOrb className="w-[500px] h-[500px] bg-purple-600 top-1/3 -right-40" />
      <GlowOrb className="w-[400px] h-[400px] bg-cyan-600 bottom-20 left-1/4" />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 lg:px-20 py-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white/90 tracking-tight">JobMatch</span>
          <span className="px-2 py-0.5 rounded-md text-[10px] bg-indigo-600/20 text-indigo-400 font-semibold uppercase tracking-wider">AI</span>
        </div>
        <button
          onClick={onGetStarted}
          className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-sm font-medium text-white/70 hover:text-white transition-all duration-200"
        >
          Get Started <ArrowRight className="w-4 h-4" />
        </button>
      </nav>

      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="relative z-10 flex flex-col items-center text-center px-6 pt-16 md:pt-24 pb-16"
      >
        {/* Badge */}
        <motion.div variants={fadeInUp} custom={0}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-600/10 border border-indigo-500/20 mb-8">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs font-medium text-indigo-300">Powered by Gemini AI</span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1 variants={fadeInUp} custom={1} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight max-w-4xl">
          <span className="text-white">Find Jobs That</span>
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Actually Match You
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p variants={fadeInUp} custom={2} className="mt-6 text-base sm:text-lg text-white/40 max-w-2xl leading-relaxed">
          Upload your resume and let AI rank the best-matching jobs for you.
          Transparent scoring, ATS analysis, and cold email generation — all in one place.
        </motion.p>

        {/* CTA */}
        <motion.div variants={fadeInUp} custom={3} className="flex flex-col sm:flex-row items-center gap-3 mt-10">
          <button
            onClick={onGetStarted}
            className="group flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-semibold text-base shadow-xl shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all duration-300 hover:scale-[1.02]"
          >
            <Upload className="w-5 h-5" />
            Upload Resume & Start
            <ArrowRight className="w-5 h-5 translate-x-0 group-hover:translate-x-1 transition-transform" />
          </button>
          <span className="text-xs text-white/25">No signup required · 100% free</span>
        </motion.div>

        {/* Stats bar */}
        <motion.div variants={fadeInUp} custom={4} className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-10 mt-16 md:mt-20">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">{value}</div>
              <div className="text-xs text-white/30 mt-1">{label}</div>
            </div>
          ))}
        </motion.div>
      </motion.section>

      {/* Dashboard Preview */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
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
              <div className="px-4 py-1 rounded-lg bg-white/[0.04] text-xs text-white/30 font-mono">localhost:3000</div>
            </div>
          </div>
          {/* Screenshot placeholder - show a stylized preview */}
          <div className="p-6 grid grid-cols-12 gap-4 min-h-[340px]">
            {/* Sidebar skeleton */}
            <div className="col-span-3 hidden md:block space-y-3">
              <div className="h-8 rounded-lg bg-gradient-to-r from-indigo-500/20 to-emerald-500/20 animate-pulse" />
              <div className="h-20 rounded-xl bg-white/[0.03] border border-white/[0.06]" />
              <div className="space-y-2">
                {[8, 6, 10, 7].map((w, i) => (
                  <div key={i} className="h-6 rounded-lg bg-white/[0.03]" style={{ width: `${w * 10}%` }} />
                ))}
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {['React', 'Node', 'TS', 'AWS'].map((t) => (
                  <span key={t} className="px-2 py-1 rounded-md bg-indigo-600/15 text-indigo-400 text-[10px] font-mono">{t}</span>
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
                { title: 'Senior Frontend Engineer', score: 92, company: 'TechCorp' },
                { title: 'Full Stack Developer', score: 87, company: 'StartupAI' },
                { title: 'React Lead', score: 84, company: 'CloudBase' },
              ].map((job, i) => (
                <div key={i} className={cn(
                  'rounded-xl border p-3 transition-all',
                  i === 0 ? 'border-indigo-500/40 bg-indigo-600/10' : 'border-white/[0.06] bg-white/[0.02]'
                )}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-500/15 text-green-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />{job.score}%
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-white/80">{job.title}</div>
                  <div className="text-[10px] text-white/40">{job.company}</div>
                </div>
              ))}
            </div>
            {/* Detail skeleton */}
            <div className="col-span-4 hidden md:block space-y-3">
              <div className="text-sm font-bold text-white/70">Senior Frontend Engineer</div>
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
                {['Skills', 'Experience', 'Tech Stack', 'Role'].map((label, i) => (
                  <div key={label} className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-white/40">{label}</span>
                      <span className="text-indigo-400 font-semibold">{92 - i * 5}%</span>
                    </div>
                    <div className="h-1 rounded-full bg-white/[0.06]">
                      <div className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-indigo-400" style={{ width: `${92 - i * 5}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Glow behind preview */}
        <div className="absolute -inset-10 bg-indigo-600/5 blur-3xl rounded-full pointer-events-none -z-10" />
      </motion.section>

      {/* How It Works */}
      <section className="relative z-10 px-6 md:px-12 lg:px-20 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            How It <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="text-sm text-white/30 mt-3 max-w-md mx-auto">From resume upload to your next offer, in four simple steps.</p>
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
                <div className="text-3xl font-extrabold bg-gradient-to-b from-white/15 to-transparent bg-clip-text text-transparent mb-3">{step}</div>
                <h3 className="text-sm font-bold text-white/80 mb-1.5">{title}</h3>
                <p className="text-xs text-white/35 leading-relaxed">{desc}</p>
              </div>
              {i < STEPS.length - 1 && (
                <ChevronRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/10" />
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
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Land Your Dream Job</span>
          </h2>
          <p className="text-sm text-white/30 mt-3 max-w-lg mx-auto">Powerful AI tools that give you an unfair advantage in your job search.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {FEATURES.map(({ icon: Icon, title, description, gradient, iconColor, borderColor }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className={cn(
                'group rounded-2xl border bg-[#13151c]/50 backdrop-blur-sm p-6 hover:scale-[1.02] transition-all duration-300',
                borderColor, 'hover:border-white/15'
              )}
            >
              <div className={cn('w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4', gradient)}>
                <Icon className={cn('w-5 h-5', iconColor)} />
              </div>
              <h3 className="text-sm font-bold text-white/80 mb-2">{title}</h3>
              <p className="text-xs text-white/35 leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative z-10 px-6 py-24">
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
              <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Perfect Match?</span>
            </h2>
            <p className="text-sm text-white/35 mb-8 relative z-10">Upload your resume and let AI do the heavy lifting.</p>
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
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.04] py-8 px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between max-w-5xl mx-auto gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-semibold text-white/50">JobMatch AI</span>
          </div>
          <p className="text-xs text-white/20">AI-powered job matching — built with Next.js, Express, and Gemini</p>
        </div>
      </footer>
    </div>
  );
}
