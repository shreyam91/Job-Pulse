'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, CheckCircle, AlertTriangle, Key, FileCheck } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const PRIVACY_SECTIONS = [
  {
    icon: Eye,
    title: 'Data Collection',
    description: 'What information we collect and why'
  },
  {
    icon: Database,
    title: 'Data Usage',
    description: 'How we use your information'
  },
  {
    icon: Lock,
    title: 'Data Protection',
    description: 'How we keep your data safe'
  },
  {
    icon: FileCheck,
    title: 'Your Rights',
    description: 'Control over your personal data'
  }
];

const SECURITY_FEATURES = [
  {
    icon: Shield,
    title: 'End-to-End Encryption',
    description: 'All data is encrypted using AES-256 encryption both in transit and at rest.'
  },
  {
    icon: Key,
    title: 'Secure Authentication',
    description: 'Multi-factor authentication and secure password policies protect your account.'
  },
  {
    icon: Database,
    title: 'Regular Security Audits',
    description: 'Third-party security audits and penetration testing ensure ongoing protection.'
  },
  {
    icon: CheckCircle,
    title: 'Compliance Standards',
    description: 'GDPR, CCPA, and SOC 2 Type II compliant data handling practices.'
  }
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0b0f] text-white relative overflow-hidden">
      <Navbar />
      
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/5 blur-[150px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-600/5 blur-[150px] rounded-full" />

      <div className="max-w-4xl mx-auto relative z-10 pt-24 px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
              <Shield className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-medium text-indigo-300">Privacy & Security</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6">
              Your Privacy is <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">Our Priority</span>
            </h1>
            <p className="text-white/40 max-w-2xl mx-auto text-lg leading-relaxed">
              We believe in transparency and giving you complete control over your data. Learn how we protect your information and respect your privacy.
            </p>
          </motion.div>
        </div>

        {/* Privacy Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {PRIVACY_SECTIONS.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-white/2 border border-white/5 hover:bg-white/3 transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4">
                <section.icon className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
              <p className="text-sm text-white/40">{section.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Data Collection */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Information We Collect</h2>
          <div className="bg-white/2 border border-white/5 rounded-2xl p-8 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-indigo-400">Personal Information</h3>
              <ul className="space-y-2 text-white/60 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Name, email address, and contact information</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Professional details and work experience</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Education and skills information from your resume</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3 text-indigo-400">Usage Data</h3>
              <ul className="space-y-2 text-white/60 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Job search preferences and filter settings</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Interaction with job recommendations and AI features</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Platform usage patterns and performance metrics</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Security Measures</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SECURITY_FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-transparent border border-indigo-500/20"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-indigo-500/10">
                    <feature.icon className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-white/60 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Your Rights */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Your Data Rights</h2>
          <div className="bg-white/2 border border-white/5 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-emerald-400">Access & Control</h3>
                <ul className="space-y-3 text-white/60 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Request a copy of your personal data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Correct inaccurate or incomplete information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Delete your account and associated data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Download your data in a portable format</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 text-emerald-400">Privacy Preferences</h3>
                <ul className="space-y-3 text-white/60 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Opt-out of marketing communications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Control cookie and tracking preferences</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Manage data sharing with third parties</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Restrict processing of sensitive data</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Data Retention */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Data Retention</h2>
          <div className="bg-white/2 border border-white/5 rounded-2xl p-8">
            <p className="text-white/60 leading-relaxed mb-6">
              We retain your personal data only as long as necessary to provide our services and comply with legal obligations. 
              When you delete your account, we immediately remove your data from active use and permanently delete it within 30 days.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-xl bg-white/5">
                <div className="text-2xl font-bold text-indigo-400 mb-2">7 Days</div>
                <div className="text-xs text-white/40">Account deletion</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5">
                <div className="text-2xl font-bold text-emerald-400 mb-2">1 Years</div>
                <div className="text-xs text-white/40">Inactive accounts</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5">
                <div className="text-2xl font-bold text-purple-400 mb-2">2 Years</div>
                <div className="text-xs text-white/40">Legal compliance</div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact for Privacy */}
        {/* <div className="p-12 rounded-[40px] bg-gradient-to-br from-[#13151c] to-[#0a0b0f] border border-white/5 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-30" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <AlertTriangle className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">Questions About Your Privacy?</h3>
            <p className="text-white/40 text-sm mb-8 leading-relaxed">
              If you have concerns about your data or want to exercise your privacy rights, our dedicated privacy team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-semibold transition-all">
                Contact Privacy Team
              </button>
              <button className="px-8 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm font-semibold text-white/60 hover:text-white">
                privacy@jobmatch.ai
              </button>
            </div>
          </div>
        </div> */}
      </div>
      <Footer />
    </div>
  );
}
