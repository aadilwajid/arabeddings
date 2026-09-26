import Link from 'next/link';
import { Home, Search, ShoppingCart } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold mb-4" style={{ color: 'var(--color-primary)' }}>
          404
        </div>
        <h1 className="text-3xl font-serif mb-4" style={{ color: 'var(--color-text)' }}>
          Page Not Found
        </h1>
        <p className="mb-8" style={{ color: 'var(--color-text-secondary)' }}>
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors"
            style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
          >
            <Home size={20} />
            Go Home
          </Link>
          <Link
            href="/shop"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors"
            style={{ 
              backgroundColor: 'var(--color-surface)', 
              color: 'var(--color-text)',
              border: 'var(--border)'
            }}
          >
            <ShoppingCart size={20} />
            Shop Now
          </Link>
          <Link
            href="/search"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors"
            style={{ 
              backgroundColor: 'var(--color-surface)', 
              color: 'var(--color-text)',
              border: 'var(--border)'
            }}
          >
            <Search size={20} />
            Search
          </Link>
        </div>

        <div className="mt-12 pt-8" style={{ borderTop: 'var(--border)' }}>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Need help? <Link href="/contact" className="underline hover:opacity-80">Contact us</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
