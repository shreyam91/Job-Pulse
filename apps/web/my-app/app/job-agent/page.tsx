'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Zap, Target, Search, Filter, Bell, Settings, Play, Pause, RotateCcw, Sparkles, Brain, TrendingUp } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const JOB_AGENT_FEATURES = [
  {
    icon: Search,
    title: 'Smart Job Discovery',
    description: 'AI-powered continuous scanning of job boards across multiple platforms'
  },
  {
    icon: Target,
    title: 'Precision Matching',
    description: 'Advanced algorithms match jobs based on skills, experience, and career goals'
  },
  {
    icon: Filter,
    title: 'Intelligent Filtering',
    description: 'Automatic filtering based on your preferences and qualifications'
  },
  {
    icon: Bell,
    title: 'Real-time Notifications',
    description: 'Instant alerts when perfect matches are found'
  }
];

const AGENT_SETTINGS = [
  {
    title: 'Search Frequency',
    options: ['Every Hour', 'Every 6 Hours', 'Daily', 'Weekly'],
    default: 'Daily'
  },
  {
    title: 'Match Threshold',
    options: ['80%+', '70%+', '60%+', '50%+'],
    default: '70%+'
  },
  {
    title: 'Job Sources',
    options: ['All Platforms', 'LinkedIn Only', 'Indeed Only', 'Custom'],
    default: 'All Platforms'
  },
  {
    title: 'Notification Method',
    options: ['Email', 'SMS', 'Push', 'All'],
    default: 'Email'
  }
];

const RECENT_MATCHES = [
  {
    company: 'TechCorp',
    position: 'Senior Frontend Developer',
    match: 94,
    location: 'San Francisco, CA',
    posted: '2 hours ago',
    salary: '$120k - $160k'
  },
  {
    company: 'StartupXYZ',
    position: 'Full Stack Engineer',
    match: 89,
    location: 'Remote',
    posted: '5 hours ago',
    salary: '$100k - $140k'
  },
  {
    company: 'Enterprise Inc',
    position: 'React Developer',
    match: 87,
    location: 'New York, NY',
    posted: '1 day ago',
    salary: '$110k - $150k'
  }
];

export default function JobAgentPage() {
  const [isAgentActive, setIsAgentActive] = useState(false);
  const [selectedSettings, setSelectedSettings] = useState<{ [key: string]: string }>({});

  const handleSettingChange = (title: string, value: string) => {
    setSelectedSettings(prev => ({ ...prev, [title]: value }));
  };

  return (
    <div className="min-h-screen bg-[#0a0b0f] text-white relative overflow-hidden">
      <Navbar />
      
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/5 blur-[150px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-600/5 blur-[150px] rounded-full" />

      <div className="max-w-6xl mx-auto relative z-10 pt-24 px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
              <Bot className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-medium text-indigo-300">AI Job Agent</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6">
              Your Personal <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">Job Hunter</span>
            </h1>
            <p className="text-white/40 max-w-2xl mx-auto text-lg leading-relaxed">
              Let our AI agent work 24/7 to find the perfect opportunities for you. Get notified instantly when your dream job appears.
            </p>
          </motion.div>
        </div>

        {/* Agent Status Card */}
        <div className="mb-16">
          <div className="bg-gradient-to-br from-indigo-500/10 to-emerald-500/10 border border-indigo-500/20 rounded-[40px] p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className={`p-4 rounded-2xl ${isAgentActive ? 'bg-emerald-500/20' : 'bg-white/5'} transition-all duration-300`}>
                    <Brain className={`w-8 h-8 ${isAgentActive ? 'text-emerald-400' : 'text-white/40'} transition-all duration-300`} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Job Agent Status</h2>
                    <p className="text-white/60 text-sm">
                      {isAgentActive ? 'Your agent is actively searching for jobs' : 'Agent is paused. Start hunting for opportunities!'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsAgentActive(!isAgentActive)}
                    className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      isAgentActive 
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30' 
                        : 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white'
                    }`}
                  >
                    {isAgentActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    {isAgentActive ? 'Pause Agent' : 'Start Agent'}
                  </button>
                  
                  <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                    <RotateCcw className="w-5 h-5 text-white/60" />
                  </button>
                </div>
              </div>
              
              {/* Stats */}
              {isAgentActive && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-400">247</div>
                    <div className="text-xs text-white/40">Jobs Scanned Today</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-400">12</div>
                    <div className="text-xs text-white/40">New Matches</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">89%</div>
                    <div className="text-xs text-white/40">Avg Match Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-400">3</div>
                    <div className="text-xs text-white/40">Applications Sent</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Agent Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {JOB_AGENT_FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-white/2 border border-white/5 hover:bg-white/3 transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-white/40">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Agent Settings */}
        {/* <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Agent Settings</h2>
            <button className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
              <Settings className="w-4 h-4" />
              Advanced Settings
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {AGENT_SETTINGS.map((setting) => (
              <div key={setting.title} className="bg-white/2 border border-white/5 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">{setting.title}</h3>
                <div className="space-y-2">
                  {setting.options.map((option) => (
                    <label key={option} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name={setting.title}
                        value={option}
                        checked={selectedSettings[setting.title] === option || (!selectedSettings[setting.title] && option === setting.default)}
                        onChange={() => handleSettingChange(setting.title, option)}
                        className="w-4 h-4 text-indigo-500 bg-white/10 border-white/20 focus:ring-indigo-500/20"
                      />
                      <span className="text-sm text-white/60">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div> */}

        {/* Recent Matches */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Recent Matches</h2>
            <div className="flex items-center gap-2 text-sm text-white/40">
              <TrendingUp className="w-4 h-4" />
              <span>Last 7 days</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {RECENT_MATCHES.map((match, index) => (
              <motion.div
                key={match.company}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/2 border border-white/5 rounded-2xl p-6 hover:bg-white/3 transition-all duration-200"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold">{match.position}</h3>
                        <p className="text-indigo-400 text-sm">{match.company}</p>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-semibold">
                        {match.match}% Match
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-white/40">
                      <span className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        {match.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        {match.posted}
                      </span>
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        {match.salary}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 rounded-xl bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition-all text-sm font-semibold">
                      View Details
                    </button>
                    <button className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm font-semibold text-white/60">
                      Apply Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        {/* <div className="p-12 rounded-[40px] bg-gradient-to-br from-[#13151c] to-[#0a0b0f] border border-white/5 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-30" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <Bot className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
            <h3 className="text-3xl font-bold mb-4">Never Miss an Opportunity</h3>
            <p className="text-white/40 text-sm mb-8 leading-relaxed">
              Your AI job agent works around the clock so you don't have to. Focus on preparing for interviews while we find the perfect matches.
            </p>
            <button 
              onClick={() => setIsAgentActive(true)}
              className="px-10 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-bold transition-all shadow-xl shadow-indigo-600/20"
            >
              Activate Your Agent
            </button>
          </div>
        </div> */}
      </div>
      <Footer />
    </div>
  );
}
