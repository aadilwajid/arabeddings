'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ProductGridSkeleton } from '@/components/SkeletonLoaders';
import { Search } from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get('q') || '';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const filtered = products.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [searchQuery, products]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <Header />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2" size={24} style={{ color: 'var(--color-text-secondary)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                autoFocus
                className="w-full pl-14 pr-4 py-4 text-lg rounded-xl focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: 'var(--border)',
                  color: 'var(--color-text)'
                }}
              />
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <ProductGridSkeleton count={6} />
          ) : searchQuery ? (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-serif" style={{ color: 'var(--color-text)' }}>
                  {results.length} {results.length === 1 ? 'result' : 'results'} for "{searchQuery}"
                </h2>
              </div>

              {results.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map(product => (
                    <div
                      key={product.id}
                      className="group rounded-2xl overflow-hidden transition-all hover:scale-105"
                      style={{
                        backgroundColor: 'var(--color-surface)',
                        border: 'var(--border)',
                        borderRadius: 'var(--border-radius)',
                        boxShadow: 'var(--shadow)'
                      }}
                    >
                      <div className="aspect-square overflow-hidden bg-[#F5EDE4]">
                        <img
                          src={product.mainImage}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4">
                        <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--color-primary)' }}>
                          {product.category}
                        </p>
                        <h3 className="font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                          {product.name}
                        </h3>
                        <p className="text-sm mb-3 line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
                            Rs {product.priceFrom.toLocaleString()}
                          </span>
                          <button
                            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            style={{
                              backgroundColor: 'var(--color-primary)',
                              color: 'white'
                            }}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Search size={64} className="mx-auto mb-4" style={{ color: 'var(--color-text-secondary)' }} />
                  <p className="text-xl mb-2" style={{ color: 'var(--color-text)' }}>No results found</p>
                  <p style={{ color: 'var(--color-text-secondary)' }}>Try searching with different keywords</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <Search size={64} className="mx-auto mb-4" style={{ color: 'var(--color-text-secondary)' }} />
              <p className="text-xl mb-2" style={{ color: 'var(--color-text)' }}>Start typing to search</p>
              <p style={{ color: 'var(--color-text-secondary)' }}>Search for products by name, description, or category</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
