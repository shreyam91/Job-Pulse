'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Brain, Heart, Target, Sparkles, Mail, Phone, Globe, ArrowRight, Briefcase, Award, TrendingUp } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const BENEFITS = [
  {
    icon: Target,
    title: 'Meaningful Work',
    description: 'Help thousands of professionals find their dream jobs using cutting-edge AI technology'
  },
  {
    icon: Brain,
    title: 'Innovation Culture',
    description: 'Work with the latest AI technologies and push the boundaries of what\'s possible'
  },
  {
    icon: TrendingUp,
    title: 'Career Growth',
    description: 'Fast-paced environment with clear paths for advancement and skill development'
  },
  {
    icon: Heart,
    title: 'Work-Life Balance',
    description: 'Flexible remote work with competitive compensation and benefits'
  }
];

const OPEN_POSITIONS = [
  {
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    location: 'San Francisco, CA / Remote',
    type: 'Full-time',
    experience: 'Senior',
    description: 'Build beautiful, responsive interfaces for our AI-powered job matching platform. Experience with React, TypeScript, and modern web technologies required.',
    requirements: [
      '5+ years of React/TypeScript experience',
      'Strong understanding of modern CSS and responsive design',
      'Experience with AI/ML interfaces is a plus',
      'Passion for creating exceptional user experiences'
    ]
  },
  {
    title: 'AI/ML Engineer',
    department: 'AI/ML',
    location: 'San Francisco, CA / Remote',
    type: 'Full-time',
    experience: 'Senior',
    description: 'Develop and optimize our AI matching algorithms using large language models and machine learning techniques.',
    requirements: [
      'Strong background in NLP and deep learning',
      'Experience with transformer models and LLMs',
      'Proficiency in Python and ML frameworks',
      'Understanding of recommendation systems'
    ]
  },
  {
    title: 'Product Designer',
    department: 'Design',
    location: 'San Francisco, CA / Remote',
    type: 'Full-time',
    experience: 'Mid-Senior',
    description: 'Create beautiful, user-centered designs for our platform. Experience with design systems, user research, and prototyping tools required.',
    requirements: [
      '3+ years of product design experience',
      'Strong portfolio demonstrating user-centered design',
      'Proficiency in Figma, Sketch, or similar tools',
      'Experience with design systems and component libraries'
    ]
  },
  {
    title: 'Backend Engineer',
    department: 'Engineering',
    location: 'San Francisco, CA / Remote',
    type: 'Full-time',
    experience: 'Mid',
    description: 'Build scalable backend services and APIs to power our AI job matching platform.',
    requirements: [
      '3+ years of backend development experience',
      'Strong knowledge of Node.js, Python, or Go',
      'Experience with cloud platforms (AWS, GCP, Azure)',
      'Understanding of microservices architecture'
    ]
  },
  {
    title: 'Customer Success Manager',
    department: 'Success',
    location: 'Remote',
    type: 'Full-time',
    experience: 'Mid',
    description: 'Help job seekers get the most value from our platform. Experience in customer success, SaaS products, and career coaching preferred.',
    requirements: [
      '2+ years in customer success or account management',
      'Experience with SaaS or B2B products',
      'Strong communication and problem-solving skills',
      'Passion for helping people advance their careers'
    ]
  },
  {
    title: 'Marketing Manager',
    department: 'Marketing',
    location: 'San Francisco, CA / Remote',
    type: 'Full-time',
    experience: 'Mid-Senior',
    description: 'Lead our marketing efforts to reach job seekers worldwide. Experience with B2C marketing and growth strategies required.',
    requirements: [
      '3+ years of marketing experience',
      'Experience with digital marketing channels',
      'Strong analytical and creative skills',
      'Understanding of the job market and recruiting industry'
    ]
  }
];

const CULTURE_VALUES = [
  {
    title: 'Innovation First',
    description: 'We\'re not afraid to experiment and push boundaries. Every team member is encouraged to bring new ideas to the table.'
  },
  {
    title: 'User Obsessed',
    description: 'Our users are at the center of everything we do. We make decisions based on their needs and feedback.'
  },
  {
    title: 'Collaborative Spirit',
    description: 'We believe the best ideas come from diverse perspectives. We work together to solve complex problems.'
  },
  {
    title: 'Continuous Learning',
    description: 'The tech world moves fast, and so do we. We invest in our team\'s growth and development.'
  }
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-[#0a0b0f] text-white">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-600/10 blur-[150px] rounded-full" />

      <Navbar />

      {/* Hero Section */}
      <section className="relative z-10 px-6 md:px-12 lg:px-20 pt-24 pb-16">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-600/10 border border-indigo-500/20 mb-8">
              <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-xs font-medium text-indigo-300">Join Our Team</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6">
              Build the Future of
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Career Intelligence
              </span>
            </h1>
            
            <p className="text-lg text-white/40 max-w-3xl mx-auto leading-relaxed mb-10">
              Help thousands of professionals find their dream jobs using cutting-edge AI technology. 
              Join a team that&apos;s revolutionizing how people advance their careers.
            </p>

            {/* <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <div className="flex items-center gap-6 text-sm text-white/60">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>India & Remote</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>5+ Team Members</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span>Top Benefits</span>
                </div>
              </div>
            </div> */}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative z-10 px-6 md:px-12 lg:px-20 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Work at
              <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent"> JobMatch AI?</span>
            </h2>
            <p className="text-sm text-white/30 max-w-md mx-auto">
              We offer more than just a job - we offer a chance to make a real impact
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {BENEFITS.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white/2 border border-white/5 rounded-2xl p-6 hover:bg-white/3 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white/90 mb-2">{benefit.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="relative z-10 px-6 md:px-12 lg:px-20 py-20 bg-gradient-to-b from-transparent via-indigo-500/[0.02] to-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Open
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"> Positions</span>
            </h2>
            <p className="text-sm text-white/30 mx-auto">
              Find your perfect role and help us shape the future of career intelligence
            </p>
          </motion.div>

          <p className="text-lg text-white/30 max-w-md mx-auto">
             We dont have any open positions at the moment, but we are always looking for talented individuals to join our team. If you are passionate about building innovative AI products and want to make a real impact on people&apos;s careers, we encourage you to send us your resume and a brief introduction about yourself. We will keep your information on file and reach out when we have opportunities that match your skills and experience.
            </p>

          {/* <div className="space-y-6">
            {OPEN_POSITIONS.map((position, index) => (
              <motion.div
                key={position.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white/2 border border-white/5 rounded-2xl p-8 hover:bg-white/3 transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white/90 mb-2">{position.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-white/40">
                      <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400">{position.department}</span>
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400">{position.type}</span>
                      <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400">{position.experience}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/40">
                    <MapPin className="w-4 h-4" />
                    <span>{position.location}</span>
                  </div>
                </div>

                <p className="text-white/60 mb-6 leading-relaxed">{position.description}</p>

                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-white/80 mb-3">Requirements:</h4>
                  <ul className="space-y-2">
                    {position.requirements.map((req, reqIndex) => (
                      <li key={reqIndex} className="flex items-start gap-3 text-sm text-white/40">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-semibold transition-all">
                  Apply Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            ))}
          </div> */}

          <div className="mt-12 text-center">
            <p className="text-white/40 text-sm mb-6">
              Don&apos;t see the perfect role? We&apos;re always looking for talented people.
            </p>
            <button className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-semibold transition-all">
              Send Resume
            </button>
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="relative z-10 px-6 md:px-12 lg:px-20 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our
              <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent"> Culture</span>
            </h2>
            <p className="text-sm text-white/30 max-w-md mx-auto">
              We&apos;re building a team that&apos;s diverse, innovative, and user-obsessed
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {CULTURE_VALUES.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white/2 border border-white/5 rounded-2xl p-8"
              >
                <h3 className="text-xl font-semibold text-white/90 mb-4">{value.title}</h3>
                <p className="text-white/40 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      {/* <section className="relative z-10 px-6 md:px-12 lg:px-20 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-indigo-600/10 to-emerald-600/10 border border-indigo-500/20 rounded-3xl p-12 text-center"
          >
            <Sparkles className="w-12 h-12 text-indigo-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white/90 mb-4">Ready to Join Us?</h2>
            <p className="text-white/40 mb-8 max-w-md mx-auto">
              Have questions about working at JobMatch AI? We&apos;d love to hear from you.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-indigo-400" />
                <div className="text-left">
                  <p className="text-xs text-white/40">Email</p>
                  <p className="text-sm text-white/60">careers@jobmatch.ai</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-indigo-400" />
                <div className="text-left">
                  <p className="text-xs text-white/40">Phone</p>
                  <p className="text-sm text-white/60">+1 (555) 000-0000</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-indigo-400" />
                <div className="text-left">
                  <p className="text-xs text-white/40">Office</p>
                  <p className="text-sm text-white/60">San Francisco, CA</p>
                </div>
              </div>
            </div>

            <button className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-semibold transition-all">
              Get in Touch
            </button>
          </motion.div>
        </div>
      </section> */}

      <Footer />
    </div>
  );
}
