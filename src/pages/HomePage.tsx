import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, RotateCcw, Star } from 'lucide-react';
import { useStore } from '../store';
import { ProductGrid } from '../components/ProductCard';

export default function HomePage() {
  const { products, categories } = useStore();
  const featured = products.filter(p => p.isFeatured);
  const newArrivals = products.slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-indigo-50 via-white to-amber-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-indigo-100 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full mb-4">New Collection 2024</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Sleep in <span className="text-indigo-600">Pure Luxury</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 max-w-lg">
                Discover premium bedding crafted from the finest materials. From Egyptian cotton to organic bamboo — every thread tells a story of comfort.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/products" className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                  Shop Collection <ArrowRight className="ml-2" size={18} />
                </Link>
                <Link to="/drug-order" className="inline-flex items-center px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:border-indigo-300 hover:text-indigo-600 transition-colors">
                  Custom Orders
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80"
                  alt="Luxury bedding"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 flex items-center space-x-3">
                <div className="bg-amber-100 p-2 rounded-lg">
                  <Star className="text-amber-500 fill-amber-500" size={20} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">4.9/5</p>
                  <p className="text-xs text-gray-500">2,000+ Reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center space-x-4">
              <div className="bg-indigo-50 p-3 rounded-lg"><Truck className="text-indigo-600" size={24} /></div>
              <div>
                <h3 className="font-semibold text-gray-900">Free Shipping</h3>
                <p className="text-sm text-gray-500">On orders over $150</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-indigo-50 p-3 rounded-lg"><RotateCcw className="text-indigo-600" size={24} /></div>
              <div>
                <h3 className="font-semibold text-gray-900">30-Day Returns</h3>
                <p className="text-sm text-gray-500">Sleep on it, risk-free</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-indigo-50 p-3 rounded-lg"><Shield className="text-indigo-600" size={24} /></div>
              <div>
                <h3 className="font-semibold text-gray-900">Quality Guarantee</h3>
                <p className="text-sm text-gray-500">5-year warranty on all products</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
            <p className="mt-2 text-gray-600">Find the perfect bedding for every room</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(cat => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                className="group bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-all border border-gray-100"
              >
                <div className="text-3xl mb-3">
                  {cat.slug === 'bed-sheets' && '🛏️'}
                  {cat.slug === 'duvet-covers' && '🧵'}
                  {cat.slug === 'pillowcases' && '💤'}
                  {cat.slug === 'comforters' && '☁️'}
                  {cat.slug === 'blankets' && '🧶'}
                  {cat.slug === 'pillow-inserts' && '🪶'}
                </div>
                <h3 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors text-sm">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
              <p className="mt-2 text-gray-600">Our most loved bedding essentials</p>
            </div>
            <Link to="/products" className="hidden md:inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium">
              View All <ArrowRight className="ml-1" size={16} />
            </Link>
          </div>
          <ProductGrid products={featured} />
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">New Arrivals</h2>
              <p className="mt-2 text-gray-600">Fresh additions to our collection</p>
            </div>
          </div>
          <ProductGrid products={newArrivals} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-indigo-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white">Need Something Custom?</h2>
          <p className="mt-4 text-indigo-100 text-lg">
            From hotel bulk orders to made-to-measure bedding, we bring your vision to life.
          </p>
          <Link
            to="/drug-order"
            className="mt-8 inline-flex items-center px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-colors"
          >
            Request a Custom Order <ArrowRight className="ml-2" size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
