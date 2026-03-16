'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Play, Pause, RotateCcw, MessageCircle, Brain, Target, Zap, Clock, TrendingUp, Award, Settings } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const INTERVIEW_FEATURES = [
  {
    icon: Brain,
    title: 'AI Conversation',
    description: 'Natural language processing for realistic interview dialogue'
  },
  {
    icon: Target,
    title: 'Role-Specific Questions',
    description: 'Questions tailored to your target position and industry'
  },
  {
    icon: Zap,
    title: 'Real-time Feedback',
    description: 'Instant analysis of your responses and communication skills'
  },
  {
    icon: Award,
    title: 'Performance Scoring',
    description: 'Comprehensive evaluation across multiple interview criteria'
  }
];

const INTERVIEW_TYPES = [
  {
    title: 'Technical Interview',
    description: 'Coding challenges, system design, and technical problem-solving',
    duration: '45-60 min',
    difficulty: 'Advanced'
  },
  {
    title: 'Behavioral Interview',
    description: 'STAR method questions, cultural fit, and soft skills assessment',
    duration: '30-45 min',
    difficulty: 'Intermediate'
  },
  {
    title: 'Case Study Interview',
    description: 'Business problems, analytical thinking, and strategic solutions',
    duration: '60-90 min',
    difficulty: 'Expert'
  },
  {
    title: 'Phone Screening',
    description: 'Initial screening, basic qualifications, and interest assessment',
    duration: '15-30 min',
    difficulty: 'Basic'
  }
];

const PERFORMANCE_METRICS = [
  { label: 'Communication', score: 85, color: 'bg-blue-500' },
  { label: 'Technical Knowledge', score: 92, color: 'bg-emerald-500' },
  { label: 'Problem Solving', score: 78, color: 'bg-purple-500' },
  { label: 'Confidence', score: 88, color: 'bg-pink-500' }
];

export default function InterviewAgentPage() {
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedType, setSelectedType] = useState('Technical Interview');
  const [currentQuestion, setCurrentQuestion] = useState(
    "Tell me about a time when you had to solve a complex technical problem. What was your approach and what was the outcome?"
  );

  const startInterview = () => {
    setIsInterviewActive(true);
    setIsRecording(true);
  };

  const stopInterview = () => {
    setIsInterviewActive(false);
    setIsRecording(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0b0f] text-white relative overflow-hidden">
      <Navbar />
      
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-600/5 blur-[150px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/5 blur-[150px] rounded-full" />

      <div className="max-w-6xl mx-auto relative z-10 pt-24 px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-300">AI Interview Agent</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6">
              Master Your <span className="bg-gradient-to-r from-emerald-400 to-purple-400 bg-clip-text text-transparent">Interviews</span>
            </h1>
            <p className="text-white/40 max-w-2xl mx-auto text-lg leading-relaxed">
              Practice with our AI interview agent and receive personalized feedback to ace your next job interview.
            </p>
          </motion.div>
        </div>

        {/* Interview Interface */}
        <div className="mb-16">
          <div className="bg-gradient-to-br from-emerald-500/10 to-purple-500/10 border border-emerald-500/20 rounded-[40px] p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              {/* Interview Status */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
                <div className="flex items-center gap-6">
                  <div className={`p-4 rounded-2xl ${isInterviewActive ? 'bg-emerald-500/20' : 'bg-white/5'} transition-all duration-300`}>
                    <Brain className={`w-8 h-8 ${isInterviewActive ? 'text-emerald-400' : 'text-white/40'} transition-all duration-300`} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">
                      {isInterviewActive ? 'Interview in Progress' : 'Ready to Practice'}
                    </h2>
                    <p className="text-white/60 text-sm">
                      {isInterviewActive ? 'Answering: ' + selectedType : 'Select interview type to begin'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <button
                    onClick={isInterviewActive ? stopInterview : startInterview}
                    className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      isInterviewActive 
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30' 
                        : 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white'
                    }`}
                  >
                    {isInterviewActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    {isInterviewActive ? 'End Interview' : 'Start Interview'}
                  </button>
                  
                  <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                    <Settings className="w-5 h-5 text-white/60" />
                  </button>
                </div>
              </div>

              {/* Interview Content */}
              {isInterviewActive && (
                <div className="space-y-8">
                  {/* Current Question */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <MessageCircle className="w-5 h-5 text-emerald-400" />
                      <h3 className="text-lg font-semibold">Interview Question</h3>
                    </div>
                    <p className="text-white/80 leading-relaxed">{currentQuestion}</p>
                  </div>

                  {/* Recording Interface */}
                  <div className="flex flex-col items-center gap-6">
                    <button
                      onClick={() => setIsRecording(!isRecording)}
                      className={`p-8 rounded-full transition-all duration-300 ${
                        isRecording 
                          ? 'bg-red-500/20 hover:bg-red-500/30 border-2 border-red-500/50' 
                          : 'bg-emerald-500/20 hover:bg-emerald-500/30 border-2 border-emerald-500/50'
                      }`}
                    >
                      {isRecording ? (
                        <MicOff className="w-8 h-8 text-red-400" />
                      ) : (
                        <Mic className="w-8 h-8 text-emerald-400" />
                      )}
                    </button>
                    <div className="text-center">
                      <p className="text-white/60 text-sm">
                        {isRecording ? 'Recording your response...' : 'Click to start recording'}
                      </p>
                      {isRecording && (
                        <div className="flex items-center gap-2 mt-2">
                          <Clock className="w-4 h-4 text-white/40" />
                          <span className="text-white/40 text-sm">00:45</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Performance Metrics */}
              {!isInterviewActive && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Previous Performance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {PERFORMANCE_METRICS.map((metric) => (
                      <div key={metric.label} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm text-white/60">{metric.label}</span>
                          <span className="text-lg font-bold">{metric.score}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div 
                            className={`${metric.color} h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${metric.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Interview Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {INTERVIEW_FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-white/2 border border-white/5 hover:bg-white/3 transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-white/40">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Interview Types */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Interview Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {INTERVIEW_TYPES.map((type) => (
              <div
                key={type.title}
                onClick={() => setSelectedType(type.title)}
                className={`p-6 rounded-2xl border cursor-pointer transition-all duration-200 ${
                  selectedType === type.title
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-white/2 border-white/5 hover:bg-white/3'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{type.title}</h3>
                    <p className="text-sm text-white/60">{type.description}</p>
                  </div>
                  {selectedType === type.title && (
                    <div className="p-2 rounded-full bg-emerald-500/20">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-white/40" />
                    <span className="text-white/40">{type.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="w-3 h-3 text-white/40" />
                    <span className="text-white/40">{type.difficulty}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Interview Tips</h2>
          <div className="bg-white/2 border border-white/5 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-emerald-400">Before the Interview</h3>
                <ul className="space-y-3 text-white/60 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                    <span>Research the company and role thoroughly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                    <span>Prepare examples of your achievements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                    <span>Practice with our AI interview agent</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                    <span>Test your technology and environment</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 text-emerald-400">During the Interview</h3>
                <ul className="space-y-3 text-white/60 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                    <span>Listen carefully to each question</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                    <span>Use the STAR method for behavioral questions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                    <span>Be honest and authentic</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                    <span>Ask thoughtful questions at the end</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        {/* <div className="p-12 rounded-[40px] bg-gradient-to-br from-[#13151c] to-[#0a0b0f] border border-white/5 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-30" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <MessageCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-3xl font-bold mb-4">Practice Makes Perfect</h3>
            <p className="text-white/40 text-sm mb-8 leading-relaxed">
              The more you practice with our AI interview agent, the more confident and prepared you'll be for your real interviews.
            </p>
            <button 
              onClick={startInterview}
              className="px-10 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold transition-all shadow-xl shadow-emerald-600/20"
            >
              Start Practice Session
            </button>
          </div>
        </div> */}
      </div>
      <Footer />
    </div>
  );
}
