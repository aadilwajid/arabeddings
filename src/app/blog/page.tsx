'use client';

import { useState } from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const blogPosts = [
  {
    id: 1,
    title: 'How to Choose the Perfect Bed Sheet for Your Sleep Style',
    excerpt: 'Discover the key factors to consider when selecting bed sheets that match your sleep preferences and lifestyle.',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
    author: 'Sara Khan',
    date: '2026-01-15',
    category: 'Guides'
  },
  {
    id: 2,
    title: 'The Benefits of Egyptian Cotton: Why It\'s Worth the Investment',
    excerpt: 'Learn why Egyptian cotton is considered the gold standard in bedding and how it can transform your sleep quality.',
    image: 'https://images.unsplash.com/photo-1616627561839-074385245ff6?w=800',
    author: 'Ahmed Raza',
    date: '2026-01-10',
    category: 'Education'
  },
  {
    id: 3,
    title: '5 Ways to Style Your Bedroom for a Hotel-Like Feel',
    excerpt: 'Transform your bedroom into a luxurious retreat with these simple styling tips from our design experts.',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800',
    author: 'Fatima Ali',
    date: '2026-01-05',
    category: 'Inspiration'
  },
  {
    id: 4,
    title: 'Caring for Your Linen: A Complete Guide',
    excerpt: 'Keep your bedding looking and feeling fresh with our comprehensive care guide for all fabric types.',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
    author: 'Sara Khan',
    date: '2025-12-28',
    category: 'Guides'
  },
  {
    id: 5,
    title: 'Understanding Thread Count: What Really Matters',
    excerpt: 'Thread count isn\'t everything. Learn what truly determines the quality and feel of your bedding.',
    image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800',
    author: 'Ahmed Raza',
    date: '2025-12-20',
    category: 'Education'
  },
  {
    id: 6,
    title: 'Winter Bedding: Staying Warm Without Overheating',
    excerpt: 'Find the perfect balance of warmth and breathability for comfortable winter nights.',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800',
    author: 'Fatima Ali',
    date: '2025-12-15',
    category: 'Inspiration'
  }
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'Guides', 'Education', 'Inspiration'];

  const filteredPosts = selectedCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      <Header />
      
      {/* Hero */}
      <section className="relative h-[300px] bg-gradient-to-br from-[#F5EDE4] to-[#E8DFD5] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#C4A265] text-sm uppercase tracking-[0.3em] mb-4">Journal</p>
          <h1 className="text-5xl font-serif text-[#2D2A26] mb-4">Blog & Guides</h1>
          <p className="text-lg text-[#5C4A32]">Tips, guides, and inspiration for better sleep.</p>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-[#2D2A26] text-white'
                  : 'bg-white text-[#5C4A32] border border-[#E8DFD5] hover:border-[#C4A265]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Post */}
      {filteredPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="bg-white rounded-2xl overflow-hidden border border-[#F0E8DE] grid md:grid-cols-2">
            <img src={filteredPosts[0].image} alt={filteredPosts[0].title} className="w-full h-64 md:h-full object-cover" />
            <div className="p-8 flex flex-col justify-center">
              <span className="text-xs text-[#C4A265] uppercase tracking-wider mb-2">{filteredPosts[0].category}</span>
              <h2 className="text-2xl font-serif text-[#2D2A26] mb-4">{filteredPosts[0].title}</h2>
              <p className="text-[#5C4A32] mb-6">{filteredPosts[0].excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-[#A09080] mb-6">
                <span className="flex items-center gap-1"><User size={14} /> {filteredPosts[0].author}</span>
                <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(filteredPosts[0].date).toLocaleDateString()}</span>
              </div>
              <button className="text-[#C4A265] hover:underline font-medium flex items-center gap-2">
                Read More <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Posts Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.slice(1).map(post => (
            <article key={post.id} className="bg-white rounded-2xl overflow-hidden border border-[#F0E8DE] hover:shadow-lg transition-shadow">
              <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <span className="text-xs text-[#C4A265] uppercase tracking-wider">{post.category}</span>
                <h3 className="text-lg font-medium text-[#2D2A26] mt-2 mb-3 line-clamp-2">{post.title}</h3>
                <p className="text-sm text-[#5C4A32] mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-[#A09080]">
                  <span>{post.author}</span>
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
