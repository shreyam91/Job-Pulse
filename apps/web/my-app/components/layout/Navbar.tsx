'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavbarProps {
  onGetStarted?: () => void;
  className?: string;
}

export default function Navbar({ onGetStarted, className }: NavbarProps) {
  return (
    <nav className={cn("relative z-20 flex items-center justify-between px-6 md:px-12 lg:px-20 py-6", className)}>
      <Link href="/" className="flex items-center gap-2.5 transition-transform hover:scale-105">
        <div className="w-9 h-9 rounded-xl bg-linear-to-br from-indigo-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-indigo-600/20">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-white/90 tracking-tight leading-none">JobMatch</span>
          <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-1">AI Agent</span>
        </div>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        {[
          { label: 'Home', href: '/' },
          { label: 'About', href: '/about' },
          { label: 'Pricing', href: '/pricing' },
          // { label: 'Job Agent', href: '/job-agent' },
          // { label: 'Interview Agent', href: '/interview-agent' },
          // { label: 'Careers', href: '/careers' },
          { label: 'Contact', href: '/contact' },
        ].map((link) => (
          <Link 
            key={link.label} 
            href={link.href}
            className="text-sm font-medium text-white/40 hover:text-white transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <Link 
          href="/auth" 
          className="hidden sm:block text-sm font-semibold text-white/60 hover:text-white transition-colors px-4"
        >
          Sign In
        </Link>
        {onGetStarted ? (
          <button
            onClick={onGetStarted}
            className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black text-sm font-bold hover:bg-white/90 transition-all duration-200"
          >
            Start Free <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        ) : (
          <Link
            href="/auth"
            className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black text-sm font-bold hover:bg-white/90 transition-all duration-200"
          >
            Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
        <button className="md:hidden p-2 text-white/60">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
}
