import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, RotateCcw, Star, Award, Leaf } from 'lucide-react';
import { useStore } from '../store';
import { ProductGrid } from '../components/ProductCard';

export default function HomePage() {
  const { products, categories } = useStore();
  const featured = products.filter(p => p.isFeatured);
  const newArrivals = products.slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-amber-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-medium px-3 py-1 rounded-full mb-4">
                <Award size={14} className="mr-1" /> New Collection 2024
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Sleep in <span className="text-amber-600 dark:text-amber-400">Pure Luxury</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-lg">
                ARA BEDDINGS brings you premium bedding crafted from the finest materials. From Egyptian cotton to organic bamboo — every thread tells a story of comfort.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/products" className="inline-flex items-center px-6 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors shadow-lg shadow-amber-600/20">
                  Shop Collection <ArrowRight className="ml-2" size={18} />
                </Link>
                <Link to="/drug-order" className="inline-flex items-center px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:border-amber-300 hover:text-amber-600 dark:hover:border-amber-500 dark:hover:text-amber-400 transition-colors">
                  Custom Orders
                </Link>
              </div>
              <div className="mt-8 flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center"><Leaf size={14} className="mr-1 text-green-500" /> OEKO-TEX®</span>
                <span className="flex items-center"><Award size={14} className="mr-1 text-amber-500" /> Premium Quality</span>
                <span className="flex items-center"><Truck size={14} className="mr-1 text-blue-500" /> Free Shipping $150+</span>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80"
                  alt="Luxury ARA BEDDINGS bedding"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 flex items-center space-x-3 border dark:border-gray-700">
                <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-lg">
                  <Star className="text-amber-500 fill-amber-500" size={20} />
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">4.9/5</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">2,000+ Reviews</p>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 border dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">Starting from</p>
                <p className="text-xl font-bold text-amber-600 dark:text-amber-400">$49.99</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-8 bg-white dark:bg-gray-900 border-b dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <div className="bg-amber-50 dark:bg-amber-900/20 p-2.5 rounded-lg"><Truck className="text-amber-600 dark:text-amber-400" size={20} /></div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Free Shipping</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">On orders over $150</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-amber-50 dark:bg-amber-900/20 p-2.5 rounded-lg"><RotateCcw className="text-amber-600 dark:text-amber-400" size={20} /></div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">30-Day Returns</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Sleep on it, risk-free</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-amber-50 dark:bg-amber-900/20 p-2.5 rounded-lg"><Shield className="text-amber-600 dark:text-amber-400" size={20} /></div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">5-Year Warranty</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Quality guaranteed</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-amber-50 dark:bg-amber-900/20 p-2.5 rounded-lg"><Leaf className="text-amber-600 dark:text-amber-400" size={20} /></div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Eco-Certified</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">OEKO-TEX® & GOTS</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Shop by Category</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Find the perfect bedding for every room</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(cat => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                className="group bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700 hover:border-amber-200 dark:hover:border-amber-700"
              >
                <div className="text-3xl mb-3">
                  {cat.slug === 'bed-sheets' && '🛏️'}
                  {cat.slug === 'duvet-covers' && '🧵'}
                  {cat.slug === 'pillowcases' && '💤'}
                  {cat.slug === 'comforters' && '☁️'}
                  {cat.slug === 'blankets' && '🧶'}
                  {cat.slug === 'pillow-inserts' && '🪶'}
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors text-sm">{cat.name}</h3>
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
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Products</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Our most loved ARA bedding essentials</p>
            </div>
            <Link to="/products" className="hidden md:inline-flex items-center text-amber-600 dark:text-amber-400 hover:text-amber-700 font-medium">
              View All <ArrowRight className="ml-1" size={16} />
            </Link>
          </div>
          <ProductGrid products={featured} />
        </div>
      </section>

      {/* Why ARA Section */}
      <section className="py-16 bg-gradient-to-r from-amber-600 to-amber-700 dark:from-amber-800 dark:to-amber-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Premium Materials</h3>
              <p className="text-amber-100 text-sm">Only the finest Egyptian cotton, French linen, and sustainable bamboo make it into ARA products.</p>
            </div>
            <div>
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✂️</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Custom Craftsmanship</h3>
              <p className="text-amber-100 text-sm">From hotel bulk orders to made-to-measure bedding, we bring your unique vision to life.</p>
            </div>
            <div>
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌿</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Sustainable Practices</h3>
              <p className="text-amber-100 text-sm">OEKO-TEX® and GOTS certified. Closed-loop processes. Responsible sourcing you can trust.</p>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">New Arrivals</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Fresh additions to the ARA collection</p>
            </div>
          </div>
          <ProductGrid products={newArrivals} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-900 dark:bg-black">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Need Something Custom?</h2>
          <p className="mt-4 text-gray-300 text-lg max-w-2xl mx-auto">
            From hotel bulk orders to made-to-measure bedding, ARA BEDDINGS brings your vision to life. Custom sizes, specialty fabrics, and wholesale pricing available.
          </p>
          <Link
            to="/drug-order"
            className="mt-8 inline-flex items-center px-8 py-4 bg-amber-500 text-gray-900 font-semibold rounded-lg hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
          >
            Request a Custom Order <ArrowRight className="ml-2" size={18} />
          </Link>
          <p className="mt-4 text-sm text-gray-500">Hotels, resorts, and bulk orders welcome</p>
        </div>
      </section>
    </div>
  );
}
