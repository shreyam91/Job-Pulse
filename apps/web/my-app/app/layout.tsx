import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'JobMatch AI — AI-Powered Job Prioritization',
  description:
    'Upload your resume and let AI rank the best-matching jobs for you. Transparent AI explanations, ATS scores, and cold email generation — all in one place.',
  keywords: ['job matching', 'AI resume', 'job search', 'career', 'ATS score'],
  openGraph: {
    title: 'JobMatch AI',
    description: 'Find jobs that match your skills with AI-powered analysis',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
