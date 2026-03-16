'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Mail, Phone, MapPin, Twitter, Linkedin, Github } from 'lucide-react';

const FOOTER_LINKS = [
  {
    title: 'Product',
    links: [
      { label: 'Job Agent', href: '/job-agent' },
      { label: 'Interview Agent', href: '/interview-agent' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Features', href: '/#features' },
    ]
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/contact#careers' },
      { label: 'Blog', href: '/blog' },
      { label: 'Press', href: '/press' },
    ]
  },
  {
    title: 'Resources',
    links: [
      { label: 'FAQ', href: '/faq' },
      { label: 'Help Center', href: '/help' },
      { label: 'API Docs', href: '/docs' },
      { label: 'Status', href: '/status' },
    ]
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Security', href: '/privacy#security' },
    ]
  }
];

const SOCIAL_LINKS = [
  { icon: Twitter, href: 'https://twitter.com/jobmatchai', label: 'Twitter' },
  { icon: Linkedin, href: 'https://linkedin.com/company/jobmatchai', label: 'LinkedIn' },
  { icon: Github, href: 'https://github.com/jobmatchai', label: 'GitHub' },
];

export default function Footer() {
  return (
    <footer className="bg-[#0a0b0f] border-white/5">
      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 transition-transform hover:scale-105 inline-block mb-6">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white/90 tracking-tight leading-none">JobMatch</span>
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-1">AI Agent</span>
              </div>
            </Link>
            
            <p className="text-white/40 text-sm leading-relaxed mb-6 max-w-sm">
              Revolutionizing career discovery with AI-powered job matching and interview preparation.
            </p>
            
            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4 text-white/60" />
                </Link>
              ))}
            </div>
          </div>

          {FOOTER_LINKS.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-white/80 mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/40 hover:text-white/60 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div> */}

        {/* Contact Info */}
        <div className="mt-16 pt-8 border-white/5">
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-indigo-400" />
              <div>
                <p className="text-sm font-medium text-white/80">Email</p>
                <p className="text-sm text-white/40">hello@jobmatch.ai</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-indigo-400" />
              <div>
                <p className="text-sm font-medium text-white/80">Phone</p>
                <p className="text-sm text-white/40">+1 (555) 000-0000</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-indigo-400" />
              <div>
                <p className="text-sm font-medium text-white/80">Office</p>
                <p className="text-sm text-white/40">San Francisco, CA</p>
              </div>
            </div>
          </div> */}

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
            <p className="text-sm text-white/40">
              © 2026 JobMatch AI. All rights reserved.
            </p>
            
            {/* <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-sm text-white/40 hover:text-white/60 transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-white/40 hover:text-white/60 transition-colors">
                Terms
              </Link>
              <Link href="/cookies" className="text-sm text-white/40 hover:text-white/60 transition-colors">
                Cookies
              </Link>
            </div> */}
            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4 text-white/60" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
