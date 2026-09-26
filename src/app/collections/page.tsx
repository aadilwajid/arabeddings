'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

const collections = [
  {
    id: 'luxury-collection',
    name: 'Luxury Collection',
    description: 'Premium Egyptian cotton and silk bedding for the ultimate sleep experience',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
    productCount: 12
  },
  {
    id: 'winter-warmth',
    name: 'Winter Warmth',
    description: 'Cozy comforters and quilts to keep you warm during cold nights',
    image: 'https://images.unsplash.com/photo-1616627561839-074385245ff6?w=800',
    productCount: 8
  },
  {
    id: 'summer-breeze',
    name: 'Summer Breeze',
    description: 'Light, breathable bedding perfect for hot summer nights',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800',
    productCount: 10
  },
  {
    id: 'kids-paradise',
    name: 'Kids Paradise',
    description: 'Fun and colorful bedding designed specifically for children',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800',
    productCount: 15
  },
  {
    id: 'eco-friendly',
    name: 'Eco-Friendly',
    description: 'Sustainable and organic bedding options for environmentally conscious customers',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
    productCount: 6
  },
  {
    id: 'wedding-essentials',
    name: 'Wedding Essentials',
    description: 'Elegant bedding sets perfect for newlyweds and wedding gifts',
    image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800',
    productCount: 9
  }
];

export default function CollectionsPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <Header />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-serif mb-4" style={{ color: 'var(--color-text)' }}>
              Our Collections
            </h1>
            <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
              Discover curated collections designed for every lifestyle and preference
            </p>
          </div>

          {/* Collections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map(collection => (
              <Link
                key={collection.id}
                href={`/shop?collection=${collection.id}`}
                className="group rounded-2xl overflow-hidden transition-all hover:scale-105"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: 'var(--border)',
                  borderRadius: 'var(--border-radius)',
                  boxShadow: 'var(--shadow)'
                }}
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
                    {collection.name}
                  </h3>
                  <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                    {collection.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
                      {collection.productCount} products
                    </span>
                    <span
                      className="text-sm font-medium group-hover:translate-x-1 transition-transform"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      View Collection →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
