import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, RotateCcw, Award, Leaf, ChevronRight, Star, TrendingUp, Sparkles, Gift, Percent, MapPin } from 'lucide-react';
import { useStore } from '../store';
import { ProductGrid } from '../components/ProductCard';
import { formatPKR } from '../data/pakistan';

export default function HomePage() {
  const { products, categories, heroSlides } = useStore();
  const featured = products.filter(p => p.isFeatured);
  const newArrivals = products.slice(0, 4);
  const [currentSlide, setCurrentSlide] = useState(0);

  const activeSlides = heroSlides.filter(s => s.isActive).sort((a, b) => a.sortOrder - b.sortOrder);

  useEffect(() => {
    if (activeSlides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Hero Carousel Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-amber-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {activeSlides.length > 0 && (
                <>
                  <div className="inline-flex items-center bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-700 dark:text-amber-400 text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm">
                    <Sparkles size={16} className="mr-2" />
                    {activeSlides[currentSlide].subtitle}
                  </div>
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
                    {activeSlides[currentSlide].title.split(' ').slice(0, -2).join(' ')}{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 dark:from-amber-400 dark:via-orange-400 dark:to-amber-400">
                      {activeSlides[currentSlide].title.split(' ').slice(-2).join(' ')}
                    </span>
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-300 max-w-xl leading-relaxed">
                    Discover ARA BEDDINGS premium collection crafted from the finest Egyptian cotton, bamboo, and organic materials. Experience comfort like never before.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link 
                      to={activeSlides[currentSlide].ctaLink}
                      className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all shadow-xl shadow-amber-600/30 transform hover:scale-105 hover:shadow-2xl"
                    >
                      {activeSlides[currentSlide].cta}
                      <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                    </Link>
                    <Link 
                      to="/drug-order" 
                      className="inline-flex items-center px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-xl hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-600 dark:hover:text-amber-400 transition-all"
                    >
                      Custom Orders
                    </Link>
                  </div>
                  {/* Carousel Indicators */}
                  <div className="flex space-x-2 pt-6">
                    {activeSlides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-2.5 rounded-full transition-all ${
                          index === currentSlide ? 'w-12 bg-gradient-to-r from-amber-600 to-orange-600' : 'w-2.5 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                {activeSlides.length > 0 && (
                  <img
                    src={activeSlides[currentSlide].image}
                    alt="Luxury ARA BEDDINGS"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border dark:border-gray-700">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-4 rounded-xl shadow-lg">
                    <Award className="text-white" size={28} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-xl">Premium Quality</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Crafted with care</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-5 border dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Starting from</p>
                <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400">{formatPKR(2800)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Features Section */}
      <section className="py-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <Truck className="text-amber-600 dark:text-amber-400" size={28} />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">Free Delivery</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Orders over Rs. 5,000</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <RotateCcw className="text-green-600 dark:text-green-400" size={28} />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">Easy Returns</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">30-day return policy</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <Shield className="text-blue-600 dark:text-blue-400" size={28} />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">Quality Guarantee</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">5-year warranty</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <Leaf className="text-purple-600 dark:text-purple-400" size={28} />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">Eco-Certified</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sustainable materials</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-semibold px-4 py-2 rounded-full mb-4">
              <Sparkles size={16} className="mr-2" />
              Explore Our Collection
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">Shop by Category</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">Find the perfect bedding for every room</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map(cat => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                className="group bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-amber-400 dark:hover:border-amber-600 transform hover:-translate-y-2"
              >
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                  <span className="text-4xl">
                    {cat.slug === 'bed-sheets' && '🛏️'}
                    {cat.slug === 'duvet-covers' && '🧵'}
                    {cat.slug === 'pillowcases' && '💤'}
                    {cat.slug === 'comforters' && '☁️'}
                    {cat.slug === 'blankets' && '🧶'}
                    {cat.slug === 'pillows' && '🪶'}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors text-lg">
                  {cat.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="inline-flex items-center bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-semibold px-4 py-2 rounded-full mb-4">
                <TrendingUp size={16} className="mr-2" />
                Trending Now
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">Featured Products</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">Our most loved ARA bedding essentials</p>
            </div>
            <Link 
              to="/products" 
              className="hidden md:inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl group"
            >
              View All 
              <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
            </Link>
          </div>
          <ProductGrid products={featured} />
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-semibold px-4 py-2 rounded-full mb-4">
              <Star size={16} className="mr-2 fill-amber-500" />
              Customer Love
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">What Our Customers Say</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">Trusted by thousands across Pakistan</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Ayesha Siddiqui",
                location: "Lahore",
                rating: 5,
                review: "Best bedding I've ever purchased! The Egyptian cotton sheets are incredibly soft and the quality is outstanding. Highly recommend ARA BEDDINGS!",
                avatar: "AS"
              },
              {
                name: "Ahmed Khan",
                location: "Karachi",
                rating: 5,
                review: "Ordered custom bedding for our hotel and the quality exceeded our expectations. The team was professional and delivered on time. Will order again!",
                avatar: "AK"
              },
              {
                name: "Fatima Ali",
                location: "Islamabad",
                rating: 5,
                review: "The bamboo sheets are perfect for Pakistani summers. So cool and comfortable. The delivery was fast and the packaging was beautiful.",
                avatar: "FA"
              }
            ].map((review, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-700 transform hover:-translate-y-1">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={20} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 italic text-lg leading-relaxed">"{review.review}"</p>
                <div className="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {review.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-lg">{review.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <MapPin size={12} />
                      {review.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
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

      {/* Quick Links Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <Link to="/track-order" className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6 hover:shadow-lg transition-shadow group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Truck className="text-amber-600 dark:text-amber-400" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Track Your Order</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Real-time order status updates</p>
                </div>
              </div>
            </Link>
            <Link to="/shipping" className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6 hover:shadow-lg transition-shadow group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Shield className="text-amber-600 dark:text-amber-400" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Shipping Info</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Free delivery over Rs. 5,000</p>
                </div>
              </div>
            </Link>
            <Link to="/returns" className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6 hover:shadow-lg transition-shadow group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <RotateCcw className="text-amber-600 dark:text-amber-400" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Easy Returns</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">30-day hassle-free returns</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Bundle Deals Section */}
      <section className="py-16 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm font-medium px-4 py-2 rounded-full mb-4">
              <i className="bi bi-lightning-fill mr-2"></i>
              Limited Time Offers
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">Bundle Deals & Save Big!</h2>
            <p className="text-gray-600 dark:text-gray-400">Get more for less with our curated bedding bundles</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Complete Bedroom Set', discount: 20, price: 36000, original: 45000 },
              { name: 'Luxury Sleep Collection', discount: 15, price: 21250, original: 25000 },
              { name: 'Guest Room Essentials', discount: 18, price: 16400, original: 20000 },
              { name: 'Summer Cool Collection', discount: 22, price: 14040, original: 18000 }
            ].map((bundle, index) => (
              <Link key={index} to="/bundles" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all overflow-hidden border border-gray-100 dark:border-gray-700 group">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">Save {bundle.discount}%</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">{bundle.name}</h3>
                  <div className="mb-3">
                    <span className="text-gray-400 line-through text-sm">{formatPKR(bundle.original)}</span>
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">{formatPKR(bundle.price)}</div>
                  </div>
                  <button className="w-full bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition-colors font-medium">
                    View Bundle
                  </button>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/bundles" className="inline-flex items-center text-amber-600 dark:text-amber-400 hover:text-amber-700 font-semibold">
              View All Bundle Deals <ArrowRight className="ml-2" size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Gift Cards Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 md:p-12 text-white">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Give the Gift of Luxury Sleep</h2>
                <p className="text-purple-100 text-lg mb-6">
                  Digital gift cards delivered instantly. Perfect for any occasion.
                </p>
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="bg-white/20 px-4 py-2 rounded-full text-sm">No Expiry</span>
                  <span className="bg-white/20 px-4 py-2 rounded-full text-sm">Instant Delivery</span>
                  <span className="bg-white/20 px-4 py-2 rounded-full text-sm">Custom Amounts</span>
                </div>
                <Link
                  to="/gift-cards"
                  className="inline-flex items-center px-8 py-4 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition-all shadow-lg"
                >
                  Shop Gift Cards
                  <ArrowRight className="ml-2" size={20} />
                </Link>
              </div>
              <div className="hidden md:block">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
                  <i className="bi bi-gift-fill text-6xl mb-4"></i>
                  <div className="text-4xl font-bold mb-2">Rs. 5,000 - 100,000</div>
                  <div className="text-purple-200">Choose any amount</div>
                </div>
              </div>
            </div>
          </div>
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
