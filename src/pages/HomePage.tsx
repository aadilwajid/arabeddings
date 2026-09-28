import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, RotateCcw, Award, Leaf, ChevronRight } from 'lucide-react';
import { useStore } from '../store';
import { ProductGrid } from '../components/ProductCard';
import { formatPKR } from '../data/pakistan';

export default function HomePage() {
  const { products, categories } = useStore();
  const featured = products.filter(p => p.isFeatured);
  const newArrivals = products.slice(0, 4);

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-medium px-4 py-2 rounded-full">
                <Award size={16} className="mr-2" />
                Premium Quality Bedding
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Transform Your Sleep with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400">
                  Luxury Bedding
                </span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg">
                Discover ARA BEDDINGS premium collection crafted from the finest Egyptian cotton, bamboo, and organic materials. Experience comfort like never before.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/products" 
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all shadow-lg shadow-amber-600/20 transform hover:scale-105"
                >
                  Shop Collection
                  <ArrowRight className="ml-2" size={20} />
                </Link>
                <Link 
                  to="/drug-order" 
                  className="inline-flex items-center px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-lg hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 transition-all"
                >
                  Custom Orders
                </Link>
              </div>
              <div className="flex items-center space-x-6 pt-4">
                <div className="flex items-center space-x-2">
                  <Leaf size={20} className="text-green-600 dark:text-green-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Eco-Friendly</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield size={20} className="text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">5-Year Warranty</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck size={20} className="text-purple-600 dark:text-purple-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Free Delivery</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <img
                  src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80"
                  alt="Luxury ARA BEDDINGS"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-5 border dark:border-gray-700 transform -rotate-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-3 rounded-xl">
                    <Award className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-lg">Premium Quality</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Crafted with care</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 border dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">Starting from</p>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{formatPKR(2800)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-8 bg-gradient-to-r from-amber-600 to-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3 text-white">
              <Truck size={28} />
              <div>
                <h3 className="font-semibold text-sm">Free Delivery</h3>
                <p className="text-xs opacity-90">Orders over Rs. 5,000</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-white">
              <RotateCcw size={28} />
              <div>
                <h3 className="font-semibold text-sm">Easy Returns</h3>
                <p className="text-xs opacity-90">30-day return policy</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-white">
              <Shield size={28} />
              <div>
                <h3 className="font-semibold text-sm">Quality Guarantee</h3>
                <p className="text-xs opacity-90">5-year warranty</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-white">
              <Leaf size={28} />
              <div>
                <h3 className="font-semibold text-sm">Eco-Certified</h3>
                <p className="text-xs opacity-90">Sustainable materials</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">Shop by Category</h2>
            <p className="text-gray-600 dark:text-gray-400">Find the perfect bedding for every room</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(cat => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                className="group bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-700 transform hover:-translate-y-1"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-3xl">
                    {cat.slug === 'bed-sheets' && '🛏️'}
                    {cat.slug === 'duvet-covers' && '🧵'}
                    {cat.slug === 'pillowcases' && '💤'}
                    {cat.slug === 'comforters' && '☁️'}
                    {cat.slug === 'blankets' && '🧶'}
                    {cat.slug === 'pillows' && '🪶'}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {cat.name}
                </h3>
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
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Featured Products</h2>
              <p className="text-gray-600 dark:text-gray-400">Our most loved ARA bedding essentials</p>
            </div>
            <Link 
              to="/products" 
              className="hidden md:inline-flex items-center text-amber-600 dark:text-amber-400 hover:text-amber-700 font-semibold group"
            >
              View All 
              <ChevronRight className="ml-1 group-hover:translate-x-1 transition-transform" size={18} />
            </Link>
          </div>
          <ProductGrid products={featured} />
        </div>
      </section>

      {/* Why Choose ARA Section */}
      <section className="py-16 bg-gradient-to-br from-gray-900 to-gray-800 dark:from-black dark:to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Why Choose ARA BEDDINGS?</h2>
            <p className="text-gray-300">Crafted with passion, delivered with care</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center transform hover:rotate-6 transition-transform">
                <Award size={36} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Premium Materials</h3>
              <p className="text-gray-300">Only the finest Egyptian cotton, French linen, and sustainable bamboo make it into ARA products.</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center transform hover:rotate-6 transition-transform">
                <Shield size={36} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Quality Guarantee</h3>
              <p className="text-gray-300">Every product comes with our 5-year warranty. We stand behind the quality of our bedding.</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center transform hover:rotate-6 transition-transform">
                <Leaf size={36} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Sustainable Practices</h3>
              <p className="text-gray-300">OEKO-TEX® and GOTS certified. Closed-loop processes. Responsible sourcing you can trust.</p>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">New Arrivals</h2>
            <p className="text-gray-600 dark:text-gray-400">Fresh additions to the ARA collection</p>
          </div>
          <ProductGrid products={newArrivals} />
        </div>
      </section>

      {/* Custom Order CTA */}
      <section className="py-20 bg-gradient-to-r from-amber-600 to-orange-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Need Something Custom?</h2>
          <p className="text-amber-50 text-lg mb-8 max-w-2xl mx-auto">
            From hotel bulk orders to made-to-measure bedding, ARA BEDDINGS brings your vision to life. Custom sizes, specialty fabrics, and wholesale pricing available.
          </p>
          <Link
            to="/drug-order"
            className="inline-flex items-center px-10 py-5 bg-white text-amber-600 font-bold rounded-lg hover:bg-gray-50 transition-all shadow-2xl transform hover:scale-105"
          >
            Request a Custom Order
            <ArrowRight className="ml-2" size={20} />
          </Link>
          <p className="mt-6 text-sm text-amber-100">Hotels, resorts, and bulk orders welcome</p>
        </div>
      </section>
    </div>
  );
}
