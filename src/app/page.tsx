'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ProductGridSkeleton } from '@/components/SkeletonLoaders';
import { ChevronLeft, ChevronRight, ShoppingBag, Heart, Eye } from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const heroSlides = [
    { title: 'Luxury Bedding for Every Home', subtitle: 'Premium quality delivered across Pakistan', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1600', cta: 'Shop Now' },
    { title: 'New Collection 2026', subtitle: 'Discover our latest designs', image: 'https://images.unsplash.com/photo-1616627561839-074385245ff6?w=1600', cta: 'Explore' },
    { title: 'Free Shipping on Orders Over Rs 10,000', subtitle: 'Shop now and save', image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=1600', cta: 'Shop Now' }
  ];

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }
    if (touchStart - touchEnd < -75) {
      setHeroIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    }
  };

  const featuredProducts = products.filter(p => p.featured).slice(0, 6);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <Header />

      {/* Hero Slider with Touch Support */}
      <section 
        className="relative h-[500px] md:h-[600px] overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {heroSlides.map((slide, i) => (
          <div 
            key={i} 
            className={`absolute inset-0 transition-opacity duration-1000 ${i === heroIndex ? 'opacity-100' : 'opacity-0'}`}
          >
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/30 flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-2xl text-white">
                  <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif mb-4">{slide.title}</h2>
                  <p className="text-base sm:text-lg md:text-xl mb-8">{slide.subtitle}</p>
                  <Link 
                    href="/shop"
                    className="inline-block bg-[#C4A265] text-white px-6 sm:px-8 py-3 rounded-full font-medium hover:bg-[#D4B275] transition-colors touchable"
                  >
                    {slide.cta}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Navigation Arrows - Hidden on mobile */}
        <button 
          onClick={() => setHeroIndex((heroIndex - 1 + heroSlides.length) % heroSlides.length)} 
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 md:p-3 rounded-full hover:bg-white hidden md:block touchable"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={() => setHeroIndex((heroIndex + 1) % heroSlides.length)} 
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 md:p-3 rounded-full hover:bg-white hidden md:block touchable"
        >
          <ChevronRight size={24} />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroIndex(i)}
              className={`w-2 h-2 rounded-full transition-all touchable ${
                i === heroIndex ? 'bg-white w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl md:text-3xl font-serif" style={{ color: 'var(--color-text)' }}>
            Featured Products
          </h3>
          <Link href="/shop" className="text-sm font-medium touchable" style={{ color: 'var(--color-primary)' }}>
            View All →
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={6} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {featuredProducts.map(product => (
              <Link 
                key={product.id} 
                href={`/shop?product=${product.id}`}
                className="group rounded-2xl overflow-hidden transition-all hover:scale-105 touchable"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: 'var(--border)',
                  borderRadius: 'var(--border-radius)',
                  boxShadow: 'var(--shadow)'
                }}
              >
                <div className="aspect-square overflow-hidden bg-[#F5EDE4] relative">
                  <img
                    src={product.mainImage}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {product.badge && (
                    <span 
                      className="absolute top-2 left-2 text-xs font-medium px-2 py-1 rounded-full"
                      style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                    >
                      {product.badge}
                    </span>
                  )}
                </div>
                <div className="p-3 md:p-4">
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--color-primary)' }}>
                    {product.category}
                  </p>
                  <h4 className="font-medium text-sm md:text-base mb-2 line-clamp-2" style={{ color: 'var(--color-text)' }}>
                    {product.name}
                  </h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm md:text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
                        Rs {product.priceFrom.toLocaleString()}
                      </span>
                      {product.compareAt && (
                        <span className="text-xs line-through ml-2" style={{ color: 'var(--color-text-secondary)' }}>
                          Rs {product.compareAt.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="py-12 md:py-16" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl md:text-3xl font-serif text-center mb-8" style={{ color: 'var(--color-text)' }}>
            Shop by Category
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {['Bed Sheets', 'Comforters', 'Quilt Covers', 'Kids', 'Accessories', 'Quilts'].map(cat => (
              <Link
                key={cat}
                href={`/shop?category=${cat}`}
                className="p-4 md:p-6 rounded-xl text-center transition-all hover:scale-105 touchable"
                style={{
                  backgroundColor: 'var(--color-background)',
                  border: 'var(--border)'
                }}
              >
                <p className="text-sm md:text-base font-medium" style={{ color: 'var(--color-text)' }}>{cat}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-12" style={{ backgroundColor: 'var(--color-text)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            <div>
              <p className="font-medium mb-1 text-sm md:text-base">Cash on Delivery</p>
              <p className="text-xs md:text-sm opacity-70">Pay when you receive</p>
            </div>
            <div>
              <p className="font-medium mb-1 text-sm md:text-base">Flat Shipping Rs 350</p>
              <p className="text-xs md:text-sm opacity-70">All across Pakistan</p>
            </div>
            <div>
              <p className="font-medium mb-1 text-sm md:text-base">Quality Guarantee</p>
              <p className="text-xs md:text-sm opacity-70">Premium materials</p>
            </div>
            <div>
              <p className="font-medium mb-1 text-sm md:text-base">Easy Returns</p>
              <p className="text-xs md:text-sm opacity-70">7-day return policy</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif mb-4" style={{ color: 'var(--color-text)' }}>
            Ready to Transform Your Sleep?
          </h2>
          <p className="text-base md:text-lg mb-8" style={{ color: 'var(--color-text-secondary)' }}>
            Join thousands of happy customers across Pakistan
          </p>
          <Link
            href="/shop"
            className="inline-block px-8 py-3 rounded-full font-medium transition-colors touchable"
            style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
          >
            Shop Now
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
