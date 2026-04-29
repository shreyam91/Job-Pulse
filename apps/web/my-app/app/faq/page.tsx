'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Sparkles, MessageCircle, Zap, Shield, Users } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const FAQ_CATEGORIES = [
  {
    icon: HelpCircle,
    title: 'Getting Started',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20'
  },
  {
    icon: Sparkles,
    title: 'AI Features',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20'
  },
  {
    icon: Zap,
    title: 'Pricing & Plans',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20'
  },
  {
    icon: Shield,
    title: 'Privacy & Security',
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/20'
  },
  {
    icon: Users,
    title: 'Account & Support',
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/20'
  }
];

const FAQ_ITEMS = [
  {
    category: 'Getting Started',
    question: 'What is JobMatch AI and how does it work?',
    answer: 'JobMatch AI is an intelligent career platform that uses Google Gemini AI to analyze your resume and match you with the most relevant job opportunities. We scan millions of job listings, analyze requirements, and provide personalized match scores to help you find your perfect job faster.'
  },
  {
    category: 'Getting Started',
    question: 'How do I get started with JobMatch AI?',
    answer: 'Getting started is easy! Simply create an account, upload your resume, and our AI will automatically analyze your skills and experience. Within minutes, you\'ll receive personalized job matches with detailed analysis of why each position is a good fit for you.'
  },
  {
    category: 'Getting Started',
    question: 'What file formats are supported for resume upload?',
    answer: 'We support PDF, DOC, and DOCX file formats for resume uploads. Our AI parser can extract text, skills, experience, and education information from any standard resume format.'
  },
  {
    category: 'AI Features',
    question: 'How accurate is the AI job matching?',
    answer: 'Our AI matching system achieves 95% accuracy in identifying relevant job positions. We use advanced natural language processing to understand job requirements and compare them with your profile, considering skills, experience level, and even career trajectory.'
  },
  {
    category: 'AI Features',
    question: 'What is the AI Mock Interview feature?',
    answer: 'The AI service provides job matching, resume analysis, and career insights to help you land your dream job.'
  },
  {
    category: 'AI Features',
    question: 'Can JobMatch AI help me write cold emails?',
    answer: 'Yes! Our Pro plan includes AI-powered cold email generation. The AI crafts personalized outreach emails to recruiters and hiring managers based on the job description and your profile, increasing your chances of getting noticed.'
  },
  {
    category: 'Pricing & Plans',
    question: 'Is there a free trial available?',
    answer: 'Yes! We offer a free plan with 10 job matches per day and basic AI analysis. This allows you to experience the platform before upgrading to a paid plan.'
  },
  {
    category: 'Pricing & Plans',
    question: 'What\'s included in the Pro plan?',
    answer: 'The Pro plan includes unlimited job matches, advanced Gemini AI analysis, unlimited mock interviews, cold email generation, ATS score optimization, and priority support. It\'s designed for serious job seekers who want maximum value.'
  },
  {
    category: 'Pricing & Plans',
    question: 'Can I cancel my subscription anytime?',
    answer: 'Absolutely! You can cancel your subscription at any time with no penalties. Your access will continue until the end of your billing period, and you can reactivate whenever you\'re ready.'
  },
  {
    category: 'Privacy & Security',
    question: 'How is my personal data protected?',
    answer: 'We use industry-standard encryption and security measures to protect your data. Your resume and personal information are encrypted in transit and at rest. We never share your data with third parties without your explicit consent.'
  },
  {
    category: 'Privacy & Security',
    question: 'Who can see my resume and profile?',
    answer: 'Only you and our AI systems can access your full resume and profile. When you apply for jobs through our platform, we share only the necessary information with the specific employer you\'re applying to.'
  },
  {
    category: 'Account & Support',
    question: 'How do I reset my password?',
    answer: 'Click the "Forgot Password" link on the login page, enter your email address, and we\'ll send you a secure link to reset your password. The link expires after 24 hours for security.'
  },
  {
    category: 'Account & Support',
    question: 'What kind of support do you offer?',
    answer: 'Free plan users get community support, while Pro plan users receive priority email support. Enterprise customers get a dedicated success manager and 24/7 phone support.'
  },
  {
    category: 'Account & Support',
    question: 'Can I delete my account and data?',
    answer: 'Yes, you can delete your account at any time from your account settings. This permanently removes all your data from our servers within 30 days, in compliance with data protection regulations.'
  }
];

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState('Getting Started');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (question: string) => {
    setExpandedItems(prev => 
      prev.includes(question) 
        ? prev.filter(item => item !== question)
        : [...prev, question]
    );
  };

  const filteredFAQs = FAQ_ITEMS.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#0a0b0f] text-white relative overflow-hidden">
      <Navbar />
      
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/5 blur-[150px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 blur-[150px] rounded-full" />

      <div className="max-w-6xl mx-auto relative z-10 pt-24 px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
              <MessageCircle className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-medium text-indigo-300">Frequently Asked Questions</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6">
              Everything You Need to <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Know</span>
            </h1>
            <p className="text-white/40 max-w-2xl mx-auto text-lg leading-relaxed">
              Find answers to common questions about JobMatch AI, from getting started to advanced features and support.
            </p>
          </motion.div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {FAQ_CATEGORIES.map((category) => (
            <button
              key={category.title}
              onClick={() => setSelectedCategory(category.title)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-200
                ${selectedCategory === category.title
                  ? `${category.bgColor} ${category.borderColor} ${category.color} border-current`
                  : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white/60'
                }
              `}
            >
              <category.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{category.title}</span>
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredFAQs.map((item, index) => (
            <motion.div
              key={item.question}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/2 border border-white/5 rounded-2xl overflow-hidden hover:bg-white/3 transition-all duration-200"
            >
              <button
                onClick={() => toggleExpanded(item.question)}
                className="w-full px-6 py-5 text-left flex items-center justify-between gap-4"
              >
                <h3 className="text-base font-semibold text-white/90 pr-4">{item.question}</h3>
                <motion.div
                  animate={{ rotate: expandedItems.includes(item.question) ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5 text-white/40 flex-shrink-0" />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {expandedItems.includes(item.question) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5">
                      <p className="text-white/60 leading-relaxed text-sm">{item.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Still Need Help */}
        {/* <div className="mt-20 p-12 rounded-[40px] bg-gradient-to-br from-[#13151c] to-[#0a0b0f] border border-white/5 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-30" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
            <p className="text-white/40 text-sm mb-8 leading-relaxed">
              Can\'t find what you\'re looking for? Our support team is here to help you get the most out of JobMatch AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-semibold transition-all">
                Contact Support
              </button>
              <button className="px-8 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm font-semibold text-white/60 hover:text-white">
                Visit Help Center
              </button>
            </div>
          </div>
        </div> */}
      </div>
      <Footer />
    </div>
  );
}
