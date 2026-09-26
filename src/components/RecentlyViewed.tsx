'use client';

import { useState, useEffect } from 'react';
import { Clock, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/types';

const RECENTLY_VIEWED_KEY = 'ara_recently_viewed';
const MAX_RECENT = 10;

export function addToRecentlyViewed(productId: string): string[] {
  if (typeof window === 'undefined') return [];
  
  let list: string[] = [];
  try {
    const saved = localStorage.getItem(RECENTLY_VIEWED_KEY);
    list = saved ? JSON.parse(saved) : [];
  } catch {
    list = [];
  }
  
  // Remove if already exists
  list = list.filter(id => id !== productId);
  // Add to front
  list.unshift(productId);
  // Limit to max
  list = list.slice(0, MAX_RECENT);
  
  localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(list));
  return list;
}

export function getRecentlyViewed(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(RECENTLY_VIEWED_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function clearRecentlyViewed(): void {
  localStorage.removeItem(RECENTLY_VIEWED_KEY);
}

interface RecentlyViewedProps {
  products: Product[];
  onViewProduct: (product: Product) => void;
  formatPrice: (price: number) => string;
}

export default function RecentlyViewed({ products, onViewProduct, formatPrice }: RecentlyViewedProps) {
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [scrollIndex, setScrollIndex] = useState(0);

  useEffect(() => {
    setRecentIds(getRecentlyViewed());
  }, []);

  const recentProducts = products.filter(p => recentIds.includes(p.id));

  useEffect(() => {
    const handleStorage = () => setRecentIds(getRecentlyViewed());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  if (recentProducts.length === 0) return null;

  const visibleCount = typeof window !== 'undefined' && window.innerWidth < 768 ? 2 : 4;
  const maxScroll = Math.max(0, recentProducts.length - visibleCount);

  return (
    <section className="bg-white border-t border-b border-[#E8DFD5] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-[#C4A265]" />
            <h3 className="text-xl font-serif text-[#2D2A26]">Recently Viewed</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setScrollIndex(Math.max(0, scrollIndex - 1))}
              disabled={scrollIndex === 0}
              className="p-2 rounded-full border border-[#E8DFD5] hover:bg-[#F5EDE4] disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setScrollIndex(Math.min(maxScroll, scrollIndex + 1))}
              disabled={scrollIndex >= maxScroll}
              className="p-2 rounded-full border border-[#E8DFD5] hover:bg-[#F5EDE4] disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => { clearRecentlyViewed(); setRecentIds([]); }}
              className="ml-2 text-xs text-[#A09080] hover:text-red-500"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <div
            className="flex gap-4 transition-transform duration-300"
            style={{ transform: `translateX(-${scrollIndex * (100 / visibleCount)}%)` }}
          >
            {recentProducts.map(product => (
              <div
                key={product.id}
                onClick={() => onViewProduct(product)}
                className="flex-shrink-0 w-[calc(50%-8px)] md:w-[calc(25%-12px)] cursor-pointer group"
              >
                <div className="bg-[#FDF8F3] rounded-xl overflow-hidden border border-[#F0E8DE] hover:shadow-md transition-all">
                  <div className="aspect-square overflow-hidden bg-[#F5EDE4]">
                    <img
                      src={product.mainImage}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-[#C4A265] uppercase tracking-wider">{product.category}</p>
                    <h4 className="text-sm font-medium text-[#2D2A26] line-clamp-1 mt-1">{product.name}</h4>
                    <p className="text-sm font-semibold text-[#2D2A26] mt-1">{formatPrice(product.priceFrom)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
