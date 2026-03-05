'use client';

import { useState, useEffect } from 'react';
import LandingPage from '@/components/landing/LandingPage';
import Dashboard from '@/components/layout/Dashboard';

export default function Home() {
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem('aijob-visited');
    if (hasVisited === 'true') {
      setShowDashboard(true);
    }
  }, []);

  const handleGetStarted = () => {
    localStorage.setItem('aijob-visited', 'true');
    setShowDashboard(true);
  };

  if (showDashboard) {
    return <Dashboard onBackToLanding={() => { localStorage.removeItem('aijob-visited'); setShowDashboard(false); }} />;
  }

  return <LandingPage onGetStarted={handleGetStarted} />;
}
