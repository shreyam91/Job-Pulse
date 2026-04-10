'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Shield, Star, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const PLANS = [
  {
    name: 'Free',
    price: '₹ 0',
    description: 'Perfect for exploring the platform',
    features: [
      '10 job matches per day',
      'Basic AI Analysis',
      'Standard resume parsing',
      '1 AI Mock Interview session',
      'Community support'
    ],
    cta: 'Get Started',
    popular: false,
    gradient: 'from-blue-500/10 to-cyan-500/10',
    borderColor: 'border-white/10'
  },
  {
    name: 'Pro',
    price: 'TBD',
    period: '/mo',
    description: 'For casual job seekers',
    features: [
      'Unlimited job matches',
      'Advanced Gemini AI Analysis',
      'Priority resume parsing',
      '10 AI Mock Interviews',
      'Cold email generation',
      'ATS score optimization',
      'Priority support'
    ],
    cta: 'Go Pro',
    popular: false,
    gradient: 'from-indigo-500/20 to-purple-500/20',
    borderColor: 'border-indigo-500/30'
  },
  {
    name: 'Pro Plus',
    price: 'TBD',
    period: '/mo',
    description: 'For serious job seekers',
    features: [
      'Unlimited job matches',
      'Advanced Gemini AI Analysis',
      'Priority resume parsing',
      '50 AI Mock Interviews',
      'Cold email generation',
      'ATS score optimization',
      'Priority support'
    ],
    cta: 'Go Pro Plus',
    popular: true,
    gradient: 'from-emerald-500/10 to-teal-500/10',
    borderColor: 'border-white/10'
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0a0b0f] text-white relative overflow-hidden">
      <Navbar />
      
      {/* Ambient background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 pt-24 px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-emerald-400 text-xs font-bold uppercase tracking-[0.2em] mb-4">Pricing Plans</h2>
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
              Invest in your <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">Future</span>
            </h1>
            <p className="text-white/40 max-w-2xl mx-auto text-lg leading-relaxed">
              Choose the plan that fits your career goals. Whether you&apos;re just starting out or looking for your next executive role.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className={cn(
                "relative group rounded-3xl p-8 border backdrop-blur-sm transition-all duration-500 hover:scale-[1.02]",
                plan.borderColor,
                plan.popular ? "bg-white/[0.03] shadow-2xl shadow-indigo-500/10" : "bg-white/[0.01]"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-xs font-bold flex items-center gap-1.5 shadow-lg">
                  <Star className="w-3 h-3 fill-white" /> Popular Choice
                </div>
              )}

              <div className={cn("inline-flex p-3 rounded-2xl bg-gradient-to-br mb-6", plan.gradient)}>
                {plan.name === 'Free' ? <Zap className="w-6 h-6 text-blue-400" /> : 
                 plan.name === 'Pro' ? <Sparkles className="w-6 h-6 text-indigo-400" /> : 
                 <Shield className="w-6 h-6 text-emerald-400" />}
              </div>

              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-white/40 text-sm mb-6 h-10">{plan.description}</p>

              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-5xl font-black tracking-tighter">{plan.price}</span>
                {plan.period && <span className="text-white/30 text-lg">{plan.period}</span>}
              </div>

              <div className="space-y-4 mb-10">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3 text-sm">
                    <div className="mt-1 rounded-full bg-emerald-500/20 p-0.5">
                      <Check className="w-3 h-3 text-emerald-500" />
                    </div>
                    <span className="text-white/60">{feature}</span>
                  </div>
                ))}
              </div>

              <button className={cn(
                "w-full py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 group",
                plan.popular 
                  ? "bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white shadow-xl shadow-indigo-600/20" 
                  : "bg-white/[0.05] hover:bg-white/10 text-white/80 border border-white/10"
              )}>
                {plan.cta} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* <div className="mt-20 p-12 rounded-[40px] bg-gradient-to-br from-[#13151c] to-[#0a0b0f] border border-white/[0.05] text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-30" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
            <p className="text-white/40 text-sm mb-8 leading-relaxed">
              We're here to help you find the right path. Our team of career experts and developers are constantly working to improve your experience.
            </p>
            <button className="px-8 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm font-semibold text-white/60 hover:text-white">
              View FAQ
            </button>
          </div>
        </div> */}

      </div>
      <Footer />
    </div>
  );
}
