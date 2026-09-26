'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ProductGridSkeleton } from '@/components/SkeletonLoaders';
import AdvancedFilters from '@/components/AdvancedFilters';
import { Search, Filter, ChevronRight, Home } from 'lucide-react';

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  const categories = ['All', 'Bed Sheets', 'Comforters', 'Quilt Covers', 'Kids', 'Accessories', 'Quilts'];

  useEffect(() => {
    const timer = setTimeout(() => {
      fetch('/api/products')
        .then(res => res.json())
        .then(data => {
          setProducts(data);
          setLoading(false);
        });
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.priceFrom - b.priceFrom;
    if (sortBy === 'price-desc') return b.priceFrom - a.priceFrom;
    return 0;
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <Header />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            <Link href="/" className="flex items-center gap-1 hover:opacity-70">
              <Home size={16} />
              <span>Home</span>
            </Link>
            <ChevronRight size={16} />
            <span style={{ color: 'var(--color-text)' }}>Shop</span>
          </nav>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-serif mb-2" style={{ color: 'var(--color-text)' }}>Shop All Products</h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>{filteredProducts.length} products available</p>
          </div>

          {/* Advanced Filters */}
          <AdvancedFilters
            products={products}
            onFilterChange={(filters) => {
              setSelectedCategory(filters.categories[0] || 'All');
              setSortBy(filters.sortBy === 'price-asc' ? 'price-asc' : filters.sortBy === 'price-desc' ? 'price-desc' : 'default');
            }}
          />

          {/* Quick Filters */}
          <div className="mb-8 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2" size={20} style={{ color: 'var(--color-text-secondary)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: 'var(--border)',
                  color: 'var(--color-text)'
                }}
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                  style={{
                    backgroundColor: selectedCategory === cat ? 'var(--color-primary)' : 'var(--color-surface)',
                    color: selectedCategory === cat ? 'white' : 'var(--color-text)',
                    border: 'var(--border)'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <Filter size={20} style={{ color: 'var(--color-text-secondary)' }} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 rounded-lg focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: 'var(--border)',
                  color: 'var(--color-text)'
                }}
              >
                <option value="default">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <ProductGridSkeleton count={6} />
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
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
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
                          Rs {product.priceFrom.toLocaleString()}
                        </span>
                        {product.compareAt && (
                          <span className="text-sm line-through ml-2" style={{ color: 'var(--color-text-secondary)' }}>
                            Rs {product.compareAt.toLocaleString()}
                          </span>
                        )}
                      </div>
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
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl mb-2" style={{ color: 'var(--color-text)' }}>No products found</p>
              <p style={{ color: 'var(--color-text-secondary)' }}>Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
