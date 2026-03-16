'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send, MapPin, Phone, Globe, Sparkles } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0a0b0f] text-white relative overflow-hidden">
      <Navbar />
      
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-600/10 blur-[150px] rounded-full" />

      <div className="max-w-6xl mx-auto relative z-10 pt-24 px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-indigo-400 text-xs font-bold uppercase tracking-[0.2em] mb-4">Contact Us</h2>
            <h1 className="text-4xl md:text-6xl font-black mb-6">Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">Connect</span></h1>
            <p className="text-white/40 max-w-xl mx-auto">
              Have questions about JobMatch AI? Whether you're a job seeker or a partner, we're here to help you navigate the future.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-6">
              {[
                { icon: Mail, label: 'Email', value: 'hello@jobmatch.ai', color: 'text-blue-400' },
                { icon: Phone, label: 'Phone', value: '+1 (555) 000-0000', color: 'text-indigo-400' },
                { icon: MapPin, label: 'Office', value: 'San Francisco, CA', color: 'text-purple-400' },
                { icon: Globe, label: 'Twitter', value: '@JobMatchAI', color: 'text-cyan-400' },
              ].map((item) => (
                <motion.div 
                  key={item.label}
                  whileHover={{ x: 10 }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all"
                >
                  <div className={`p-3 rounded-xl bg-white/[0.03] ${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-white/20 tracking-wider font-mono">{item.label}</p>
                    <p className="text-sm font-semibold text-white/80">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20 relative overflow-hidden group">
              <Sparkles className="absolute -right-4 -top-4 w-24 h-24 text-indigo-500/5 group-hover:rotate-12 transition-transform duration-700" />
              <h4 className="text-sm font-bold mb-2">Technical Support</h4>
              <p className="text-xs text-white/40 leading-relaxed mb-4">
                Found a bug or need help with your AI interview session? Our tech team is online 24/7.
              </p>
              {/* <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-2">
                Open Support Ticket <Send className="w-3 h-3" />
              </button> */}
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/[0.02] border border-white/[0.05] rounded-[40px] p-8 md:p-12 shadow-2xl relative"
            >
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Full Name</label>
                  <input type="text" placeholder="John Doe" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-indigo-500 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Email Address</label>
                  <input type="email" placeholder="john@example.com" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-indigo-500 transition-all" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Subject</label>
                  <select className="w-full bg-[#0a0b0f] border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-indigo-500 appearance-none transition-all">
                    <option>General Inquiry</option>
                    <option>Technical Support</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Message</label>
                  <textarea rows={5} placeholder="How can we help you?" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-6 px-6 text-sm focus:outline-none focus:border-indigo-500 transition-all" />
                </div>
                <div className="md:col-span-2">
                  <button className="group w-full md:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-bold transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/20">
                    Send Message <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Careers Section */}
      {/* <div className="max-w-6xl mx-auto relative z-10 px-6 pb-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Join Our Team</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-emerald-500 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 space-y-8">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20">
              <h3 className="text-lg font-bold mb-4 text-indigo-400">Why Join JobMatch AI?</h3>
              <ul className="space-y-3 text-sm text-white/60">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 flex-shrink-0" />
                  <span>Work with cutting-edge AI technology</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 flex-shrink-0" />
                  <span>Make a real impact on job seekers' lives</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 flex-shrink-0" />
                  <span>Competitive salary and equity packages</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 flex-shrink-0" />
                  <span>Flexible remote work environment</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 flex-shrink-0" />
                  <span>Professional growth and development</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20">
              <h4 className="text-sm font-bold mb-2 text-emerald-400">Our Culture</h4>
              <p className="text-xs text-white/40 leading-relaxed">
                We're a diverse team of engineers, designers, and career experts passionate about using AI to transform the job search experience.
              </p>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-white/2 border border-white/5 rounded-[40px] p-8 md:p-12">
              <h3 className="text-2xl font-bold mb-8">Open Positions</h3>
              
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-indigo-400">Senior Frontend Engineer</h4>
                      <p className="text-sm text-white/60">San Francisco, CA / Remote</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-semibold">Full-time</span>
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold">Engineering</span>
                    </div>
                  </div>
                  <p className="text-sm text-white/60 mb-4">
                    Build responsive, intuitive interfaces for our AI-powered job matching platform. Experience with React, TypeScript, and modern web technologies required.
                  </p>
                  <button className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold transition-colors">
                    Learn More →
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-indigo-400">AI/ML Engineer</h4>
                      <p className="text-sm text-white/60">San Francisco, CA / Remote</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-semibold">Full-time</span>
                      <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-semibold">AI/ML</span>
                    </div>
                  </div>
                  <p className="text-sm text-white/60 mb-4">
                    Develop and optimize our AI matching algorithms using large language models and machine learning techniques. Strong background in NLP and deep learning required.
                  </p>
                  <button className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold transition-colors">
                    Learn More →
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-indigo-400">Product Designer</h4>
                      <p className="text-sm text-white/60">San Francisco, CA / Remote</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-semibold">Full-time</span>
                      <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-400 text-xs font-semibold">Design</span>
                    </div>
                  </div>
                  <p className="text-sm text-white/60 mb-4">
                    Create beautiful, user-centered designs for our platform. Experience with design systems, user research, and prototyping tools required.
                  </p>
                  <button className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold transition-colors">
                    Learn More →
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-indigo-400">Customer Success Manager</h4>
                      <p className="text-sm text-white/60">Remote</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-semibold">Full-time</span>
                      <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-semibold">Success</span>
                    </div>
                  </div>
                  <p className="text-sm text-white/60 mb-4">
                    Help job seekers get the most value from our platform. Experience in customer success, SaaS products, and career coaching preferred.
                  </p>
                  <button className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold transition-colors">
                    Learn More →
                  </button>
                </div>
              </div>

              <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-emerald-500/10 border border-indigo-500/20">
                <p className="text-center text-white/60 text-sm mb-4">
                  Don't see the perfect role? We're always looking for talented people.
                </p>
                <div className="text-center">
                  <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-semibold transition-all">
                    Send Resume
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <Footer />
    </div>
  );
}
