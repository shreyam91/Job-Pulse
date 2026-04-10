'use client';

import { useRouter } from 'next/navigation';
import Dashboard from '@/components/layout/Dashboard';

export default function DashboardPage() {
  const router = useRouter();

  const handleBackToLanding = () => {
    router.push('/');
  };

  return <Dashboard onBackToLanding={handleBackToLanding} />;
}
