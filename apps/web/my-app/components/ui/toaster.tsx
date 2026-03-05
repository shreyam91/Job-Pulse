'use client';

import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: '#13151c',
          border: '1px solid rgba(255,255,255,0.08)',
          color: 'rgba(255,255,255,0.8)',
          fontSize: '13px',
          fontFamily: 'Inter, system-ui, sans-serif',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          borderRadius: '12px',
          padding: '14px 16px',
        },
        className: 'sonner-toast',
      }}
      richColors
      closeButton
    />
  );
}
