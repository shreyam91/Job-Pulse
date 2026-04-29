'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Shield, Users, AlertCircle, CheckCircle, Calendar, CreditCard } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const TERMS_SECTIONS = [
  {
    icon: FileText,
    title: 'Service Terms',
    description: 'Rules for using JobMatch AI'
  },
  {
    icon: Shield,
    title: 'User Responsibilities',
    description: 'What you agree to when using our service'
  },
  {
    icon: Users,
    title: 'Account Terms',
    description: 'Guidelines for account management'
  },
  {
    icon: CreditCard,
    title: 'Payment & Billing',
    description: 'Subscription and payment policies'
  }
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0b0f] text-white relative overflow-hidden">
      <Navbar />
      
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/5 blur-[150px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 blur-[150px] rounded-full" />

      <div className="max-w-4xl mx-auto relative z-10 pt-24 px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-medium text-indigo-300">Terms of Service</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6">
              Our <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Terms</span>
            </h1>
            <p className="text-white/40 max-w-2xl mx-auto text-lg leading-relaxed">
              By using JobMatch AI, you agree to these terms. Please read them carefully to understand your rights and responsibilities.
            </p>
          </motion.div>
        </div>

        {/* Last Updated */}
        <div className="mb-12 p-6 rounded-2xl bg-white/2 border border-white/5 flex items-center gap-4">
          <Calendar className="w-5 h-5 text-indigo-400" />
          <div>
            <p className="text-sm font-semibold text-white/80">Last Updated: March 14, 2026</p>
            <p className="text-xs text-white/40">These terms are subject to change. We will notify users of significant updates.</p>
          </div>
        </div>

        {/* Terms Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {TERMS_SECTIONS.map((section, index) => (
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

        {/* Service Terms */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Service Terms</h2>
          <div className="bg-white/2 border border-white/5 rounded-2xl p-8 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-indigo-400">Acceptance of Terms</h3>
              <p className="text-white/60 leading-relaxed text-sm mb-4">
                By accessing and using JobMatch AI, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3 text-indigo-400">Description of Service</h3>
              <p className="text-white/60 leading-relaxed text-sm mb-4">
                JobMatch AI provides AI-powered job matching and resume analysis services. 
                We use advanced machine learning algorithms to help job seekers find relevant opportunities and improve their chances of success.
              </p>
              <ul className="space-y-2 text-white/60 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>AI-powered job matching and recommendations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Resume analysis and optimization suggestions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />

                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Cold email generation and outreach tools</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-indigo-400">Service Availability</h3>
              <p className="text-white/60 leading-relaxed text-sm">
                We strive to maintain high service availability but cannot guarantee uninterrupted access. 
                Service may be temporarily unavailable for maintenance, updates, or other technical reasons.
              </p>
            </div>
          </div>
        </div>

        {/* User Responsibilities */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8">User Responsibilities</h2>
          <div className="bg-white/2 border border-white/5 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-emerald-400">Do's</h3>
                <ul className="space-y-3 text-white/60 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Provide accurate and truthful information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Use the service for legitimate job search purposes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Respect intellectual property rights</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Report bugs or issues responsibly</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 text-red-400">Don'ts</h3>
                <ul className="space-y-3 text-white/60 text-sm">
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <span>Share false or misleading information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <span>Use the service for spam or harassment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <span>Attempt to circumvent security measures</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <span>Resell or redistribute access to the service</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Account Terms */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Account Terms</h2>
          <div className="bg-white/2 border border-white/5 rounded-2xl p-8 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-indigo-400">Account Creation</h3>
              <p className="text-white/60 leading-relaxed text-sm">
                You must provide accurate, complete, and current information when creating an account. 
                You are responsible for maintaining the confidentiality of your account credentials.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3 text-indigo-400">Account Suspension</h3>
              <p className="text-white/60 leading-relaxed text-sm mb-4">
                We reserve the right to suspend or terminate accounts that violate these terms or engage in prohibited activities. 
                Reasons for suspension include but are not limited to:
              </p>
              <ul className="space-y-2 text-white/60 text-sm">
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span>Violation of user responsibilities</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span>Fraudulent or illegal activities</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span>Unauthorized access to other accounts</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span>Repeated violation of community guidelines</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Payment Terms */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Payment & Billing</h2>
          <div className="bg-white/2 border border-white/5 rounded-2xl p-8 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-indigo-400">Subscription Plans</h3>
              <p className="text-white/60 leading-relaxed text-sm mb-4">
                We offer both free and paid subscription plans. Paid plans are billed monthly or annually 
                and provide access to premium features and enhanced capabilities.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3 text-indigo-400">Payment Methods</h3>
              <p className="text-white/60 leading-relaxed text-sm">
                We accept major credit cards, debit cards, and other electronic payment methods. 
                All payment processing is handled securely through third-party payment processors.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-indigo-400">Refunds</h3>
              <p className="text-white/60 leading-relaxed text-sm">
                Refunds are available within 30 days of purchase for annual subscriptions and 7 days for monthly subscriptions. 
                Refund requests are evaluated on a case-by-case basis.
              </p>
            </div>
          </div>
        </div>

        {/* Intellectual Property */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Intellectual Property</h2>
          <div className="bg-white/2 border border-white/5 rounded-2xl p-8">
            <p className="text-white/60 leading-relaxed text-sm mb-4">
              All content, features, and functionality of JobMatch AI are owned by JobMatch AI and are protected by 
              copyright, trademark, and other intellectual property laws.
            </p>
            <p className="text-white/60 leading-relaxed text-sm mb-4">
              You retain ownership of your resume and personal information. By using our service, you grant us 
              a limited license to process and analyze your data to provide our services.
            </p>
            <p className="text-white/60 leading-relaxed text-sm">
              You may not copy, modify, distribute, or create derivative works based on our service without explicit permission.
            </p>
          </div>
        </div>

        {/* Limitation of Liability */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Limitation of Liability</h2>
          <div className="bg-white/2 border border-white/5 rounded-2xl p-8">
            <p className="text-white/60 leading-relaxed text-sm mb-4">
              JobMatch AI is provided "as is" without warranties of any kind. We do not guarantee that our service 
              will meet your requirements or that job matches will result in employment.
            </p>
            <p className="text-white/60 leading-relaxed text-sm mb-4">
              In no event shall JobMatch AI be liable for any indirect, incidental, special, or consequential damages 
              arising out of or in connection with your use of our service.
            </p>
            <p className="text-white/60 leading-relaxed text-sm">
              Our total liability for any claims related to the service shall not exceed the amount you paid for the service in the preceding 12 months.
            </p>
          </div>
        </div>

        {/* Contact */}
        {/* <div className="p-12 rounded-[40px] bg-gradient-to-br from-[#13151c] to-[#0a0b0f] border border-white/5 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-30" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <AlertCircle className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">Questions About Our Terms?</h3>
            <p className="text-white/40 text-sm mb-8 leading-relaxed">
              If you have questions about these terms or need clarification, our legal team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-semibold transition-all">
                Contact Legal Team
              </button>
              <button className="px-8 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm font-semibold text-white/60 hover:text-white">
                legal@jobmatch.ai
              </button>
            </div>
          </div>
        </div> */}
      </div>
      <Footer />
    </div>
  );
}
