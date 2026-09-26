'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
          <AlertCircle size={40} className="text-red-500" />
        </div>
        
        <h1 className="text-3xl font-serif mb-4" style={{ color: 'var(--color-text)' }}>
          Something Went Wrong
        </h1>
        
        <p className="mb-2" style={{ color: 'var(--color-text-secondary)' }}>
          We're sorry, but something unexpected happened.
        </p>
        
        {error.digest && (
          <p className="text-xs mb-6 font-mono" style={{ color: 'var(--color-text-secondary)' }}>
            Error ID: {error.digest}
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors"
            style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
          >
            <RefreshCw size={20} />
            Try Again
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors"
            style={{ 
              backgroundColor: 'var(--color-surface)', 
              color: 'var(--color-text)',
              border: 'var(--border)'
            }}
          >
            <Home size={20} />
            Go Home
          </Link>
        </div>

        <div className="pt-6" style={{ borderTop: 'var(--border)' }}>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            If the problem persists, please{' '}
            <Link href="/contact" className="underline hover:opacity-80">
              contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
