import React from 'react';
import { Award, Heart, Leaf, Users, Target, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
          <Sparkles size={16} />
          Premium Bedding Since 2020
        </div>
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          About ARA BEDDINGS
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Crafting premium bedding experiences for Pakistani homes. We believe everyone deserves 
          the comfort of luxury sleep.
        </p>
      </div>

      {/* Our Story */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 p-8 mb-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Story</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              ARA BEDDINGS was born from a simple idea: every Pakistani home deserves access to 
              world-class bedding without the international price tag.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Founded in 2020, we started with a small collection of Egyptian cotton sheets. 
              Today, we offer a complete range of premium bedding products, from luxurious duvet 
              covers to handwoven blankets.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Our mission remains unchanged: to bring the comfort of luxury sleep to every 
              Pakistani home, one thread at a time.
            </p>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-8 text-white">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-4xl font-bold mb-1">50K+</p>
                <p className="text-amber-100 text-sm">Happy Customers</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-1">100+</p>
                <p className="text-amber-100 text-sm">Products</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-1">4.9★</p>
                <p className="text-amber-100 text-sm">Average Rating</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-1">100%</p>
                <p className="text-amber-100 text-sm">Quality Assured</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
          Our Values
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6 text-center">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="text-amber-600 dark:text-amber-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Quality First</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              We source only the finest materials - Egyptian cotton, French linen, and premium 
              bamboo. Every product undergoes rigorous quality checks.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6 text-center">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="text-amber-600 dark:text-amber-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Sustainability</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Committed to eco-friendly practices. Our bamboo is sustainably harvested, and we 
              use minimal, recyclable packaging.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6 text-center">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="text-amber-600 dark:text-amber-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Customer Love</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Your satisfaction is our priority. 30-day returns, responsive support, and a 
              commitment to making things right.
            </p>
          </div>
        </div>
      </div>

      {/* What We Offer */}
      <div className="bg-gradient-to-br from-gray-50 to-amber-50 dark:from-gray-800 dark:to-amber-900/20 rounded-2xl p-8 mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
          What We Offer
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-2xl">🛏️</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Premium Bed Sheets</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Egyptian cotton, bamboo lyocell, and percale cotton in all sizes
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-2xl">🧵</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Luxury Duvet Covers</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sateen and percale duvet covers with matching shams
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-2xl">☁️</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">All-Season Comforters</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Premium fill comforters for every climate
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-2xl">🛋️</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Handwoven Blankets</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Artisan-crafted organic cotton throws
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-2xl">💤</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Pillows & Pillowcases</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Hypoallergenic pillows and French linen pillowcases
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-2xl">✨</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Custom Orders</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Bulk orders for hotels and custom bedding solutions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
          Why Choose ARA BEDDINGS?
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Users className="text-green-600 dark:text-green-400" size={20} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Pakistan's Trusted Brand</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Serving 50,000+ customers across Pakistan with 4.9-star average rating
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Target className="text-blue-600 dark:text-blue-400" size={20} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Perfect Fit Guarantee</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Detailed size guides and expert support to ensure perfect fit
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Award className="text-purple-600 dark:text-purple-400" size={20} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">5-Year Warranty</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              We stand behind our quality with comprehensive warranty coverage
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                <Heart className="text-amber-600 dark:text-amber-400" size={20} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">30-Day Returns</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Not satisfied? Return within 30 days for a full refund, no questions asked
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-8 text-center text-white">
        <h2 className="text-3xl font-bold mb-3">Ready to Experience Luxury Sleep?</h2>
        <p className="text-amber-100 mb-6 max-w-2xl mx-auto">
          Join thousands of happy customers who've transformed their sleep with ARA BEDDINGS
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="/products"
            className="px-8 py-3 bg-white text-amber-600 rounded-lg hover:bg-amber-50 transition-colors font-semibold"
          >
            Shop Now
          </a>
          <a
            href="/contact"
            className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-semibold"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
