'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import ProductDetail from '@/components/ProductDetail';
import Cart from '@/components/Cart';
import Checkout from '@/components/Checkout';
import { products, categories } from '@/data/products';
import { Product, CartItem, Category } from '@/types';
import { SlidersHorizontal } from 'lucide-react';

type View = 'shop' | 'checkout';

export default function HomePage() {
  const [view, setView] = useState<View>('shop');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating'>('default');

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = products;

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
    }

    return result;
  }, [searchQuery, selectedCategory, sortBy]);

  // Cart functions
  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setCartOpen(true);
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    setCartOpen(false);
    setView('checkout');
  };

  const handleCheckoutComplete = () => {
    setCartItems([]);
    setView('shop');
  };

  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      <Header
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {view === 'shop' ? (
        <main>
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-gradient-to-br from-[#F5EDE4] via-[#FDF8F3] to-[#F0E8DE]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
              <div className="max-w-2xl">
                <p className="text-[#C4A265] text-sm uppercase tracking-[0.3em] mb-4 font-medium">Luxury Home Linen</p>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#2D2A26] leading-tight mb-6">
                  Sleep in <span className="text-[#C4A265]">Pure</span> Luxury
                </h2>
                <p className="text-[#5C4A32] text-lg leading-relaxed mb-8 max-w-lg">
                  Discover our curated collection of premium bedding and home linen, crafted from the world's finest natural fibers.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="#products"
                    className="bg-[#2D2A26] text-white px-8 py-3.5 rounded-full font-medium hover:bg-[#C4A265] transition-colors"
                  >
                    Shop Collection
                  </a>
                  <a
                    href="#products"
                    className="border border-[#2D2A26] text-[#2D2A26] px-8 py-3.5 rounded-full font-medium hover:bg-[#2D2A26] hover:text-white transition-colors"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
              <div className="w-full h-full bg-gradient-to-l from-[#C4A265] to-transparent rounded-l-full" />
            </div>
          </section>

          {/* Features Bar */}
          <section className="border-b border-[#E8DFD5] bg-white/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-sm font-medium text-[#2D2A26]">Free Shipping</p>
                  <p className="text-xs text-[#A09080]">On orders over $200</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#2D2A26]">Premium Quality</p>
                  <p className="text-xs text-[#A09080]">Ethically sourced</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#2D2A26]">30-Day Returns</p>
                  <p className="text-xs text-[#A09080]">Hassle-free policy</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#2D2A26]">Secure Payment</p>
                  <p className="text-xs text-[#A09080]">100% protected</p>
                </div>
              </div>
            </div>
          </section>

          {/* Products Section */}
          <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8">
              <div>
                <h3 className="text-2xl md:text-3xl font-serif text-[#2D2A26] mb-2">Our Collection</h3>
                <p className="text-[#5C4A32]">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                </p>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2 mt-4 md:mt-0">
                <SlidersHorizontal size={16} className="text-[#A09080]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="text-sm text-[#5C4A32] bg-transparent border border-[#E8DFD5] rounded-lg px-3 py-2 focus:outline-none focus:border-[#C4A265]"
                >
                  <option value="default">Sort by: Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category as Category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-[#2D2A26] text-white shadow-md'
                      : 'bg-white text-[#5C4A32] border border-[#E8DFD5] hover:border-[#C4A265] hover:text-[#C4A265]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                    onViewDetails={setSelectedProduct}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-xl text-[#5C4A32] mb-2">No products found</p>
                <p className="text-[#A09080]">Try adjusting your search or filters</p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                  className="mt-4 text-[#C4A265] hover:underline font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </section>

          {/* Newsletter Section */}
          <section className="bg-[#2D2A26] py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h3 className="text-2xl md:text-3xl font-serif text-white mb-3">Join the ARA Family</h3>
              <p className="text-[#D4C5B0] mb-6 max-w-md mx-auto">
                Subscribe for exclusive offers, new arrivals, and styling inspiration.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-[#C4A265]"
                />
                <button className="bg-[#C4A265] text-white px-6 py-3 rounded-full font-medium hover:bg-[#D4B275] transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-[#F5EDE4] border-t border-[#E8DFD5] py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="col-span-2 md:col-span-1">
                  <h4 className="text-lg font-serif tracking-[0.15em] text-[#2D2A26] uppercase mb-4">
                    ARA <span className="text-[#C4A265]">BEDDINGS</span>
                  </h4>
                  <p className="text-sm text-[#5C4A32] leading-relaxed">
                    Crafting luxury home linen since 2018. Every piece tells a story of quality and comfort.
                  </p>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-[#2D2A26] uppercase tracking-wider mb-3">Shop</h5>
                  <ul className="space-y-2 text-sm text-[#5C4A32]">
                    <li><a href="#" className="hover:text-[#C4A265] transition-colors">Sheets</a></li>
                    <li><a href="#" className="hover:text-[#C4A265] transition-colors">Pillows</a></li>
                    <li><a href="#" className="hover:text-[#C4A265] transition-colors">Blankets</a></li>
                    <li><a href="#" className="hover:text-[#C4A265] transition-colors">Duvets</a></li>
                  </ul>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-[#2D2A26] uppercase tracking-wider mb-3">Company</h5>
                  <ul className="space-y-2 text-sm text-[#5C4A32]">
                    <li><a href="#" className="hover:text-[#C4A265] transition-colors">About Us</a></li>
                    <li><a href="#" className="hover:text-[#C4A265] transition-colors">Sustainability</a></li>
                    <li><a href="#" className="hover:text-[#C4A265] transition-colors">Careers</a></li>
                    <li><a href="#" className="hover:text-[#C4A265] transition-colors">Press</a></li>
                  </ul>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-[#2D2A26] uppercase tracking-wider mb-3">Support</h5>
                  <ul className="space-y-2 text-sm text-[#5C4A32]">
                    <li><a href="#" className="hover:text-[#C4A265] transition-colors">Contact Us</a></li>
                    <li><a href="#" className="hover:text-[#C4A265] transition-colors">Shipping Info</a></li>
                    <li><a href="#" className="hover:text-[#C4A265] transition-colors">Returns</a></li>
                    <li><a href="#" className="hover:text-[#C4A265] transition-colors">FAQ</a></li>
                  </ul>
                </div>
              </div>
              <div className="mt-10 pt-6 border-t border-[#E8DFD5] text-center">
                <p className="text-xs text-[#A09080]">
                  © 2026 ARA BEDDINGS. All rights reserved. Crafted with care.
                </p>
              </div>
            </div>
          </footer>
        </main>
      ) : (
        <Checkout
          items={cartItems}
          onBack={() => { setView('shop'); setCartOpen(true); }}
          onComplete={handleCheckoutComplete}
        />
      )}

      {/* Cart Drawer */}
      <Cart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onCheckout={handleCheckout}
      />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      )}
    </div>
  );
}
