'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Users, Lightbulb, Rocket, Shield, Target, Sparkles, Heart, MessageCircle, Mail } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const VALUES = [
  { icon: Target, title: 'Precision', desc: 'We leverage Gemini AI to find the needle in the haystack of Job listings.' },
  { icon: Heart, title: 'Empowerment', desc: 'Our mission is to give every candidate an unfair advantage in the market.' },
  { icon: Shield, title: 'Transparency', desc: 'No black-box algorithms. We show you exactly why we think a job matches you.' },
  { icon: Rocket, title: 'Speed', desc: 'Analysis that takes recruiters weeks, we deliver in milliseconds.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0b0f] text-white relative overflow-hidden">
      <Navbar />
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10 pt-24 px-6">
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-emerald-400 text-xs font-bold uppercase tracking-[0.2em] mb-4">Our Mission</h2>
            <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
              Revolutionizing Career <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Discovery</span>
            </h1>
            <p className="text-white/50 text-lg leading-relaxed mb-6">
              JobMatch AI was born from a simple realization: the job search process is broken. While companies have advanced ATS to filter candidates, candidates didn't have the tools to filter companies based on their true potential.
            </p>
            <p className="text-white/40 leading-relaxed mb-8">
              We've built a "Two-Way Intelligence" platform that not only finds jobs but prepares you to land them. By combining large language models with real-time market data, we're creating the first truly candidate-first career ecosystem.
            </p>
            <div className="flex gap-4">
              <div className="text-center p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex-1">
                <div className="text-2xl font-black text-indigo-400">500k+</div>
                <div className="text-[10px] text-white/20 uppercase tracking-widest font-bold">Jobs Scanned</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex-1">
                <div className="text-2xl font-black text-emerald-400">95%</div>
                <div className="text-[10px] text-white/20 uppercase tracking-widest font-bold">Accuracy</div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="absolute -inset-10 bg-indigo-500/10 blur-[100px] rounded-full" />
            <div className="relative rounded-[40px] border border-white/10 overflow-hidden shadow-2xl bg-[#13151c]">
                <div className="p-12 flex flex-col items-center justify-center space-y-8 min-h-[400px]">
                   <div className="relative">
                      <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full" />
                      <Brain className="w-32 h-32 text-indigo-400 relative z-10" />
                   </div>
                   <div className="text-center">
                      <h4 className="text-xl font-bold mb-2">Google Gemini Powered</h4>
                      <p className="text-white/30 text-xs max-w-xs mx-auto">
                        Our intelligence engine uses the latest in multimodal AI to understand context, tone, and deep technical compatibility.
                      </p>
                   </div>
                </div>
            </div>
          </motion.div>
        </div>

        {/* Values Grid */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Values that Drive Us</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-emerald-500 mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <v.icon className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-lg font-bold mb-3">{v.title}</h3>
                <p className="text-sm text-white/30 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team CTA */}
        {/* <div className="p-12 rounded-[40px] bg-[#1a1c23] border border-white/5 relative overflow-hidden text-center mb-32">
          <Sparkles className="absolute left-10 bottom-10 w-20 h-24 text-white/5 rotate-12" />
          <h2 className="text-3xl font-bold mb-4">We're just getting started.</h2>
          <p className="text-white/40 max-w-xl mx-auto mb-8">
            Join thousands of others who are already upgrading their career journey with AI.
          </p>
          <button className="px-10 py-4 rounded-2xl bg-white text-black font-black hover:bg-white/90 transition-all">
            Join the Revolution
          </button>
        </div> */}

        {/* Release Notes */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Latest Updates</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-emerald-500 mx-auto rounded-full" />
          </div>
          
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-white/2 border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-emerald-400">Version 2.4.0</h3>
                  <p className="text-xs text-white/40">Released March 14, 2026</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold">Latest</span>
              </div>
              <ul className="space-y-2 text-sm text-white/60">
                <li>• Enhanced AI matching algorithm with 15% improved accuracy</li>
                <li>• New Interview Agent with real-time feedback</li>
                <li>• Advanced job filtering options and custom alerts</li>
                <li>• Performance improvements and bug fixes</li>
              </ul>
            </div>
            
            <div className="bg-white/2 border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Version 2.3.0</h3>
                  <p className="text-xs text-white/40">Released February 28, 2026</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-white/60">
                <li>• Added support for LinkedIn job imports</li>
                <li>• Improved resume parsing for technical roles</li>
                <li>• New dashboard analytics and insights</li>
                <li>• Enhanced mobile experience</li>
              </ul>
            </div>
            
            <div className="bg-white/2 border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Version 2.2.0</h3>
                  <p className="text-xs text-white/40">Released February 14, 2026</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-white/60">
                <li>• Launched cold email generation feature</li>
                <li>• ATS score optimization tools</li>
                <li>• Integration with major job boards</li>
                <li>• Improved user onboarding flow</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Support Section */}
        {/* <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Support & Resources</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-emerald-500 mx-auto rounded-full" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white/2 border border-white/5 hover:bg-white/3 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-lg font-bold mb-3">Help Center</h3>
              <p className="text-sm text-white/30 leading-relaxed mb-6">
                Browse our comprehensive documentation and tutorials to get the most out of JobMatch AI.
              </p>
              <button className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold transition-colors">
                Visit Help Center →
              </button>
            </div>
            
            <div className="p-8 rounded-3xl bg-white/2 border border-white/5 hover:bg-white/3 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold mb-3">Community</h3>
              <p className="text-sm text-white/30 leading-relaxed mb-6">
                Join our community of job seekers and career professionals. Share tips, get advice, and connect.
              </p>
              <button className="text-emerald-400 hover:text-emerald-300 text-sm font-semibold transition-colors">
                Join Community →
              </button>
            </div>
            
            <div className="p-8 rounded-3xl bg-white/2 border border-white/5 hover:bg-white/3 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold mb-3">Contact Support</h3>
              <p className="text-sm text-white/30 leading-relaxed mb-6">
                Our support team is here to help. Get personalized assistance for your specific needs.
              </p>
              <button className="text-purple-400 hover:text-purple-300 text-sm font-semibold transition-colors">
                Get Support →
              </button>
            </div>
          </div>
        </div> */}
        
      </div>
      <Footer />
    </div>
  );
}
