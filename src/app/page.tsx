'use client';

import { useState, useEffect, useMemo } from 'react';
import { Product, CartItem, Size, VariantType, Order, Customer } from '@/types';
import { Search, ShoppingBag, Menu, X, Star, Minus, Plus, Heart, Trash2, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import BundleBuilder from '@/components/BundleBuilder';
import CompareBar, { CompareButton } from '@/components/ProductComparison';
import AbandonedCartNotification, { saveCartForRecovery } from '@/components/AbandonedCartNotification';
import CityDeliveryEstimate from '@/components/CityDeliveryEstimate';
import DiscountCodeInput from '@/components/DiscountCodeInput';
import RecentlyViewed, { addToRecentlyViewed } from '@/components/RecentlyViewed';
import { isFeatureEnabled } from '@/lib/feature-flags';
import { ProductGridSkeleton } from '@/components/SkeletonLoaders';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [view, setView] = useState<'home' | 'shop' | 'checkout' | 'confirmation'>('home');
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Bed Sheets', 'Comforters', 'Quilt Covers', 'Kids', 'Accessories', 'Quilts'];
  const sizes: Size[] = ['Single', 'Double', 'Queen', 'King'];
  const types: VariantType[] = ['Bed Sheet Set', 'Comforter Set', 'Quilt Cover Set', 'Fitted Sheet Only'];

  const heroSlides = [
    { title: 'Luxury Bedding for Every Home', subtitle: 'Premium quality delivered across Pakistan', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1600' },
    { title: 'New Collection 2026', subtitle: 'Discover our latest designs', image: 'https://images.unsplash.com/photo-1616627561839-074385245ff6?w=1600' },
    { title: 'Free Shipping on Orders Over Rs 10,000', subtitle: 'Shop now and save', image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=1600' }
  ];

  // Load data
  useEffect(() => {
    // Simulate loading delay for skeleton demo
    const timer = setTimeout(() => {
      fetch('/api/products')
        .then(res => res.json())
        .then(data => {
          setProducts(data);
          setLoading(false);
        });
    }, 800);
    
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    
    return () => clearTimeout(timer);
  }, []);

  // Auto-rotate hero
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Filter and sort
  const filteredProducts = useMemo(() => {
    let result = products;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }
    if (sortBy === 'price-asc') result = [...result].sort((a, b) => a.priceFrom - b.priceFrom);
    if (sortBy === 'price-desc') result = [...result].sort((a, b) => b.priceFrom - a.priceFrom);
    return result;
  }, [products, searchQuery, selectedCategory, sortBy]);

  const featuredProducts = products.filter(p => p.featured);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 350;
  const orderTotal = cartTotal + shipping;

  // Cart functions
  const addToCart = (product: Product, variantId: string, quantity: number = 1) => {
    const variant = product.variants.find(v => v.id === variantId);
    if (!variant) return;

    setCart(prev => {
      const existing = prev.find(item => item.variantId === variantId);
      const newCart = existing
        ? prev.map(item => item.variantId === variantId ? { ...item, quantity: item.quantity + quantity } : item)
        : [...prev, {
            productId: product.id,
            productName: product.name,
            variantId: variant.id,
            size: variant.size,
            type: variant.type,
            price: variant.price,
            quantity,
            image: product.mainImage
          }];
      
      // Save for abandoned cart recovery
      saveCartForRecovery(newCart);
      return newCart;
    });
    setCartOpen(true);
  };

  const updateCartQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(variantId);
      return;
    }
    setCart(prev => prev.map(item => item.variantId === variantId ? { ...item, quantity } : item));
  };

  const removeFromCart = (variantId: string) => {
    setCart(prev => prev.filter(item => item.variantId !== variantId));
  };

  const toggleWishlist = (productId: string) => {
    const newWishlist = wishlist.includes(productId)
      ? wishlist.filter(id => id !== productId)
      : [...wishlist, productId];
    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
  };

  // Track product view for Recently Viewed
  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    addToRecentlyViewed(product.id);
  };

  // Checkout
  const handleCheckout = async (customer: Customer, paymentMethod: 'cod' | 'jazzcash' | 'easypaisa', paymentProof?: string) => {
    const order: Order = {
      id: Date.now().toString(),
      orderNumber: `ARA-${Date.now().toString().slice(-6)}`,
      customer,
      items: cart,
      subtotal: cartTotal,
      shipping,
      total: orderTotal,
      status: 'new',
      paymentMethod,
      paymentProof,
      statusHistory: [{ status: 'new', timestamp: new Date().toISOString() }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });

    if (res.ok) {
      setCurrentOrder(order);
      setCart([]);
      setView('confirmation');
    }
  };

  const formatPrice = (price: number) => `Rs ${price.toLocaleString()}`;

  // Render based on view
  if (view === 'checkout') {
    return <CheckoutView cart={cart} cartTotal={cartTotal} shipping={shipping} orderTotal={orderTotal} onBack={() => setView('shop')} onCheckout={handleCheckout} />;
  }

  if (view === 'confirmation' && currentOrder) {
    return <ConfirmationView order={currentOrder} onContinue={() => setView('home')} />;
  }

  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#FDF8F3]/95 backdrop-blur-md border-b border-[#E8DFD5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <h1 className="text-xl md:text-2xl font-serif tracking-[0.2em] text-[#2D2A26] uppercase">
              ARA <span className="text-[#C4A265]">BEDDINGS</span>
            </h1>

            <nav className="hidden md:flex items-center space-x-8">
              <button onClick={() => setView('home')} className="text-sm text-[#5C4A32] hover:text-[#C4A265]">Home</button>
              <button onClick={() => setView('shop')} className="text-sm text-[#5C4A32] hover:text-[#C4A265]">Shop</button>
              <a href="/about" className="text-sm text-[#5C4A32] hover:text-[#C4A265]">About</a>
              <a href="/services" className="text-sm text-[#5C4A32] hover:text-[#C4A265]">Services</a>
              <a href="/blog" className="text-sm text-[#5C4A32] hover:text-[#C4A265]">Blog</a>
              <a href="/contact" className="text-sm text-[#5C4A32] hover:text-[#C4A265]">Contact</a>
              <a href="/wishlist" className="text-sm text-[#5C4A32] hover:text-[#C4A265]">Wishlist</a>
              <a href="/track-order" className="text-sm text-[#5C4A32] hover:text-[#C4A265]">Track Order</a>
            </nav>

            <div className="flex items-center space-x-3">
              <button onClick={() => setView('shop')} className="p-2 text-[#5C4A32] hover:text-[#C4A265]">
                <Search size={20} />
              </button>
              <button onClick={() => setCartOpen(true)} className="relative p-2 text-[#5C4A32] hover:text-[#C4A265]">
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#C4A265] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FDF8F3] border-t border-[#E8DFD5] py-4 px-6">
            <nav className="flex flex-col space-y-4">
              <button onClick={() => { setView('home'); setMobileMenuOpen(false); }} className="text-left text-sm text-[#5C4A32]">Home</button>
              <button onClick={() => { setView('shop'); setMobileMenuOpen(false); }} className="text-left text-sm text-[#5C4A32]">Shop</button>
              <a href="/about" className="text-sm text-[#5C4A32]">About</a>
              <a href="/services" className="text-sm text-[#5C4A32]">Services</a>
              <a href="/blog" className="text-sm text-[#5C4A32]">Blog</a>
              <a href="/contact" className="text-sm text-[#5C4A32]">Contact</a>
              <a href="/wishlist" className="text-sm text-[#5C4A32]">Wishlist</a>
              <a href="/track-order" className="text-sm text-[#5C4A32]">Track Order</a>
            </nav>
          </div>
        )}
      </header>

      {view === 'home' && (
        <>
          {/* Hero Slider */}
          <section className="relative h-[500px] md:h-[600px] overflow-hidden">
            {heroSlides.map((slide, i) => (
              <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === heroIndex ? 'opacity-100' : 'opacity-0'}`}>
                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 flex items-center">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl text-white">
                      <h2 className="text-4xl md:text-6xl font-serif mb-4">{slide.title}</h2>
                      <p className="text-lg md:text-xl mb-8">{slide.subtitle}</p>
                      <button onClick={() => setView('shop')} className="bg-[#C4A265] text-white px-8 py-3 rounded-full font-medium hover:bg-[#D4B275] transition-colors">
                        Shop Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={() => setHeroIndex((heroIndex - 1 + heroSlides.length) % heroSlides.length)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white">
              <ChevronLeft size={24} />
            </button>
            <button onClick={() => setHeroIndex((heroIndex + 1) % heroSlides.length)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white">
              <ChevronRight size={24} />
            </button>
          </section>

          {/* Featured Products */}
          {featuredProducts.length > 0 && (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <h3 className="text-3xl font-serif text-[#2D2A26] mb-8 text-center">Featured Products</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProducts.slice(0, 3).map(product => (
                  <ProductCard key={product.id} product={product} onAddToCart={addToCart} onViewDetails={handleViewProduct} onToggleWishlist={toggleWishlist} isWishlisted={wishlist.includes(product.id)} formatPrice={formatPrice} />
                ))}
              </div>
              <div className="text-center mt-8 flex flex-wrap gap-4 justify-center">
                <button onClick={() => setView('shop')} className="bg-[#2D2A26] text-white px-8 py-3 rounded-full font-medium hover:bg-[#C4A265] transition-colors">
                  View All Products
                </button>
                {isFeatureEnabled('bundle_builder') && (
                  <BundleBuilder products={products} onAddBundleToCart={(items) => {
                    items.forEach(item => addToCart(item.product, item.variantId, item.quantity));
                  }} />
                )}
              </div>
            </section>
          )}

          {/* Compare Bar */}
          {isFeatureEnabled('product_comparison') && (
            <CompareBar products={products} onAddToCart={(product, variantId) => addToCart(product, variantId)} />
          )}

          {/* Categories */}
          <section className="bg-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h3 className="text-3xl font-serif text-[#2D2A26] mb-8 text-center">Shop by Category</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {categories.slice(1).map(cat => (
                  <button key={cat} onClick={() => { setSelectedCategory(cat); setView('shop'); }} className="bg-[#F5EDE4] hover:bg-[#E8DFD5] p-6 rounded-xl text-center transition-colors">
                    <p className="font-medium text-[#2D2A26]">{cat}</p>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Trust Bar */}
          <section className="bg-[#2D2A26] text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <p className="font-medium mb-1">Cash on Delivery</p>
                  <p className="text-sm text-[#D4C5B0]">Pay when you receive</p>
                </div>
                <div>
                  <p className="font-medium mb-1">Flat Shipping Rs 350</p>
                  <p className="text-sm text-[#D4C5B0]">All across Pakistan</p>
                </div>
                <div>
                  <p className="font-medium mb-1">Quality Guarantee</p>
                  <p className="text-sm text-[#D4C5B0]">Premium materials</p>
                </div>
                <div>
                  <p className="font-medium mb-1">Easy Returns</p>
                  <p className="text-sm text-[#D4C5B0]">7-day return policy</p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {view === 'shop' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8">
            <div>
              <h3 className="text-3xl font-serif text-[#2D2A26] mb-2">Shop All Products</h3>
              <p className="text-[#5C4A32]">{filteredProducts.length} products</p>
            </div>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]" />
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]">
                <option value="default">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat ? 'bg-[#2D2A26] text-white' : 'bg-white text-[#5C4A32] border border-[#E8DFD5] hover:border-[#C4A265]'}`}>
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <ProductGridSkeleton count={6} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} onAddToCart={addToCart} onViewDetails={handleViewProduct} onToggleWishlist={toggleWishlist} isWishlisted={wishlist.includes(product.id)} formatPrice={formatPrice} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} onUpdateQuantity={updateCartQuantity} onRemove={removeFromCart} onCheckout={() => { setCartOpen(false); setView('checkout'); }} cartTotal={cartTotal} shipping={shipping} orderTotal={orderTotal} formatPrice={formatPrice} />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={addToCart} sizes={sizes} types={types} formatPrice={formatPrice} />
      )}

      {/* WhatsApp Button */}
      <a href="https://wa.me/923160143039" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors z-40">
        <MessageCircle size={24} />
      </a>

      {/* Abandoned Cart Recovery */}
      {isFeatureEnabled('abandoned_cart') && (
        <AbandonedCartNotification onRestore={(items) => setCart(items)} />
      )}

      {/* Recently Viewed */}
      {isFeatureEnabled('recently_viewed') && (
        <RecentlyViewed products={products} onViewProduct={setSelectedProduct} formatPrice={formatPrice} />
      )}

      {/* Footer */}
      <footer className="bg-[#F5EDE4] border-t border-[#E8DFD5] py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <h4 className="text-lg font-serif tracking-[0.15em] text-[#2D2A26] uppercase mb-4">
                ARA <span className="text-[#C4A265]">BEDDINGS</span>
              </h4>
              <p className="text-sm text-[#5C4A32] leading-relaxed mb-4">
                Crafting luxury home linen since 2018. Premium quality delivered across Pakistan.
              </p>
              <div className="flex gap-3">
                <a href="https://wa.me/923160143039" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-[#2D2A26] text-white rounded-full flex items-center justify-center hover:bg-[#C4A265] transition-colors">
                  <MessageCircle size={16} />
                </a>
              </div>
            </div>
            <div>
              <h5 className="text-sm font-semibold text-[#2D2A26] uppercase tracking-wider mb-3">Shop</h5>
              <ul className="space-y-2 text-sm text-[#5C4A32]">
                <li><button onClick={() => { setSelectedCategory('Bed Sheets'); setView('shop'); }} className="hover:text-[#C4A265]">Bed Sheets</button></li>
                <li><button onClick={() => { setSelectedCategory('Comforters'); setView('shop'); }} className="hover:text-[#C4A265]">Comforters</button></li>
                <li><button onClick={() => { setSelectedCategory('Quilt Covers'); setView('shop'); }} className="hover:text-[#C4A265]">Quilt Covers</button></li>
                <li><button onClick={() => { setSelectedCategory('Kids'); setView('shop'); }} className="hover:text-[#C4A265]">Kids</button></li>
                <li><button onClick={() => { setSelectedCategory('Accessories'); setView('shop'); }} className="hover:text-[#C4A265]">Accessories</button></li>
              </ul>
            </div>
            <div>
              <h5 className="text-sm font-semibold text-[#2D2A26] uppercase tracking-wider mb-3">Company</h5>
              <ul className="space-y-2 text-sm text-[#5C4A32]">
                <li><a href="/about" className="hover:text-[#C4A265]">About Us</a></li>
                <li><a href="/services" className="hover:text-[#C4A265]">Services</a></li>
                <li><a href="/blog" className="hover:text-[#C4A265]">Blog</a></li>
                <li><a href="/contact" className="hover:text-[#C4A265]">Contact</a></li>
                <li><a href="/custom-designs" className="hover:text-[#C4A265]">Custom Designs</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-sm font-semibold text-[#2D2A26] uppercase tracking-wider mb-3">Customer Care</h5>
              <ul className="space-y-2 text-sm text-[#5C4A32]">
                <li><a href="/track-order" className="hover:text-[#C4A265]">Track Order</a></li>
                <li><a href="/wishlist" className="hover:text-[#C4A265]">Wishlist</a></li>
                <li><a href="/account" className="hover:text-[#C4A265]">My Account</a></li>
                <li><a href="https://wa.me/923160143039" target="_blank" rel="noopener noreferrer" className="hover:text-[#C4A265]">WhatsApp Support</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-sm font-semibold text-[#2D2A26] uppercase tracking-wider mb-3">Payment & Shipping</h5>
              <ul className="space-y-2 text-sm text-[#5C4A32]">
                <li>Cash on Delivery</li>
                <li>JazzCash: 03160143039</li>
                <li>Easypaisa: 03160143039</li>
                <li className="pt-2 font-medium">Flat Shipping: Rs 350</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-[#E8DFD5] text-center">
            <p className="text-sm text-[#A09080]">© 2026 ARA Beddings. All rights reserved. | Premium Home Linen & Bedding</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Product Card Component
function ProductCard({ product, onAddToCart, onViewDetails, onToggleWishlist, isWishlisted, formatPrice }: any) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-[#F0E8DE]">
      <div className="relative aspect-square overflow-hidden cursor-pointer bg-[#F5EDE4]" onClick={() => onViewDetails(product)}>
        <img src={product.mainImage} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {product.badge && <span className="absolute top-3 left-3 bg-[#C4A265] text-white text-xs font-medium px-3 py-1 rounded-full">{product.badge}</span>}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {isFeatureEnabled('product_comparison') && (
            <CompareButton productId={product.id} />
          )}
        </div>
        <button onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }} className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-[#FDF8F3]">
          <Heart size={18} className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-[#5C4A32]'} />
        </button>
      </div>
      <div className="p-4">
        <p className="text-xs text-[#C4A265] uppercase tracking-wider mb-1">{product.category}</p>
        <h3 className="font-medium text-[#2D2A26] mb-2 cursor-pointer hover:text-[#C4A265]" onClick={() => onViewDetails(product)}>{product.name}</h3>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-semibold text-[#2D2A26]">{formatPrice(product.priceFrom)}</span>
            {product.compareAt && <span className="text-sm text-[#A09080] line-through ml-2">{formatPrice(product.compareAt)}</span>}
          </div>
          <button onClick={() => onViewDetails(product)} className="text-sm text-[#C4A265] hover:underline font-medium">View Details</button>
        </div>
      </div>
    </div>
  );
}

// Cart Drawer Component
function CartDrawer({ open, onClose, cart, onUpdateQuantity, onRemove, onCheckout, cartTotal, shipping, orderTotal, formatPrice }: any) {
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-[#FDF8F3] z-50 transform transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-5 border-b border-[#E8DFD5]">
            <h2 className="text-lg font-serif text-[#2D2A26]">Your Cart ({cart.length})</h2>
            <button onClick={onClose} className="p-2 hover:bg-[#F0E8DE] rounded-full"><X size={20} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-5">
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag size={48} className="text-[#E8DFD5] mx-auto mb-4" />
                <p className="text-[#5C4A32]">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item: CartItem) => (
                  <div key={item.variantId} className="flex gap-4 bg-white rounded-xl p-3 border border-[#F0E8DE]">
                    <img src={item.image} alt={item.productName} className="w-20 h-20 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-[#2D2A26]">{item.productName}</h4>
                      <p className="text-xs text-[#A09080]">{item.size} - {item.type}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-[#E8DFD5] rounded-full">
                          <button onClick={() => onUpdateQuantity(item.variantId, item.quantity - 1)} className="p-1.5"><Minus size={12} /></button>
                          <span className="w-7 text-center text-xs">{item.quantity}</span>
                          <button onClick={() => onUpdateQuantity(item.variantId, item.quantity + 1)} className="p-1.5"><Plus size={12} /></button>
                        </div>
                        <span className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                    <button onClick={() => onRemove(item.variantId)} className="self-start p-1 text-[#A09080] hover:text-red-500"><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {cart.length > 0 && (
            <div className="border-t border-[#E8DFD5] p-5">
              <div className="flex justify-between text-sm mb-2"><span>Subtotal</span><span>{formatPrice(cartTotal)}</span></div>
              <div className="flex justify-between text-sm mb-3"><span>Shipping</span><span>{formatPrice(shipping)}</span></div>
              <div className="flex justify-between font-semibold text-lg mb-4"><span>Total</span><span>{formatPrice(orderTotal)}</span></div>
              <button onClick={onCheckout} className="w-full bg-[#2D2A26] text-white py-3 rounded-full font-medium hover:bg-[#C4A265]">Proceed to Checkout</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Product Detail Modal
function ProductDetailModal({ product, onClose, onAddToCart, sizes, types, formatPrice }: any) {
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [selectedType, setSelectedType] = useState<VariantType | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const availableTypes = selectedSize ? product.variants.filter((v: any) => v.size === selectedSize).map((v: any) => v.type) : types;
  const selectedVariant = selectedSize && selectedType ? product.variants.find((v: any) => v.size === selectedSize && v.type === selectedType) : null;

  const handleAddToCart = () => {
    if (selectedVariant) {
      onAddToCart(product, selectedVariant.id, quantity);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-[#FDF8F3] rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full"><X size={20} /></button>
        <div className="grid md:grid-cols-2">
          <div className="aspect-square bg-[#F5EDE4]">
            <img src={product.mainImage} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="p-6 md:p-8">
            <p className="text-sm text-[#C4A265] uppercase tracking-wider mb-2">{product.category}</p>
            <h2 className="text-2xl font-serif text-[#2D2A26] mb-3">{product.name}</h2>
            <p className="text-[#5C4A32] mb-6">{product.description}</p>

            {!product.customizable ? (
              <div className="mb-6">
                <p className="text-2xl font-semibold text-[#2D2A26] mb-4">{formatPrice(product.priceFrom)}</p>
                <button onClick={handleAddToCart} className="w-full bg-[#2D2A26] text-white py-3 rounded-full font-medium hover:bg-[#C4A265]">Add to Cart</button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-sm font-medium text-[#2D2A26] mb-3">Step 1: Select Size</p>
                  <div className="grid grid-cols-2 gap-2">
                    {sizes.map((size: Size) => (
                      <button key={size} onClick={() => { setSelectedSize(size); setSelectedType(null); }} className={`p-3 rounded-lg border-2 transition-all ${selectedSize === size ? 'border-[#C4A265] bg-[#C4A265]/10' : 'border-[#E8DFD5] hover:border-[#C4A265]'}`}>
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedSize && (
                  <div className="mb-6">
                    <p className="text-sm font-medium text-[#2D2A26] mb-3">Step 2: Select Type</p>
                    <div className="space-y-2">
                      {availableTypes.map((type: VariantType) => (
                        <button key={type} onClick={() => setSelectedType(type)} className={`w-full p-3 rounded-lg border-2 text-left transition-all ${selectedType === type ? 'border-[#C4A265] bg-[#C4A265]/10' : 'border-[#E8DFD5] hover:border-[#C4A265]'}`}>
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedVariant && (
                  <div className="mb-6">
                    <p className="text-2xl font-semibold text-[#2D2A26] mb-4">{formatPrice(selectedVariant.price)}</p>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-sm font-medium">Quantity:</span>
                      <div className="flex items-center border border-[#E8DFD5] rounded-full">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2"><Minus size={16} /></button>
                        <span className="w-10 text-center">{quantity}</span>
                        <button onClick={() => setQuantity(quantity + 1)} className="p-2"><Plus size={16} /></button>
                      </div>
                    </div>
                    <button onClick={handleAddToCart} className="w-full bg-[#2D2A26] text-white py-3 rounded-full font-medium hover:bg-[#C4A265]">Add to Cart</button>
                  </div>
                )}
              </>
            )}

            {/* Size Guide Button */}
            {product.customizable && (
              <button onClick={() => setShowSizeGuide(true)} className="text-sm text-[#C4A265] hover:underline mb-6">
                📏 Size Guide
              </button>
            )}

            {/* Reviews Section */}
            <div className="border-t border-[#E8DFD5] pt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-[#2D2A26]">Customer Reviews</h4>
                <button onClick={() => setShowReviewForm(true)} className="text-sm text-[#C4A265] hover:underline">
                  Write a Review
                </button>
              </div>
              <div className="space-y-3">
                <div className="bg-[#FDF8F3] rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < 5 ? 'text-[#C4A265] fill-[#C4A265]' : 'text-[#E8DFD5]'} />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-[#2D2A26]">Fatima Ahmed</span>
                  </div>
                  <p className="text-sm text-[#5C4A32]">Absolutely love this product! So soft and comfortable. The quality is amazing for the price.</p>
                </div>
                <div className="bg-[#FDF8F3] rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < 4 ? 'text-[#C4A265] fill-[#C4A265]' : 'text-[#E8DFD5]'} />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-[#2D2A26]">Ali Hassan</span>
                  </div>
                  <p className="text-sm text-[#5C4A32]">Great quality. Very comfortable and the fit is perfect. Shipping was fast too.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4" onClick={() => setShowSizeGuide(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-[#E8DFD5] px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-serif text-[#2D2A26]">Size Guide</h3>
              <button onClick={() => setShowSizeGuide(false)} className="p-2 hover:bg-[#F5EDE4] rounded-lg"><X size={20} /></button>
            </div>
            <div className="p-6">
              <h4 className="font-medium text-[#2D2A26] mb-4">Bed Sheet & Quilt Cover Sizes</h4>
              <table className="w-full text-sm">
                <thead className="bg-[#F5EDE4]">
                  <tr>
                    <th className="text-left px-4 py-2">Size</th>
                    <th className="text-left px-4 py-2">Dimensions (inches)</th>
                    <th className="text-left px-4 py-2">Fits Mattress</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#E8DFD5]">
                    <td className="px-4 py-3 font-medium">Single</td>
                    <td className="px-4 py-3">72" x 100"</td>
                    <td className="px-4 py-3">3' x 6.5' bed</td>
                  </tr>
                  <tr className="border-b border-[#E8DFD5]">
                    <td className="px-4 py-3 font-medium">Double</td>
                    <td className="px-4 py-3">90" x 100"</td>
                    <td className="px-4 py-3">4' x 6.5' bed</td>
                  </tr>
                  <tr className="border-b border-[#E8DFD5]">
                    <td className="px-4 py-3 font-medium">Queen</td>
                    <td className="px-4 py-3">108" x 108"</td>
                    <td className="px-4 py-3">5' x 6.5' bed</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">King</td>
                    <td className="px-4 py-3">120" x 108"</td>
                    <td className="px-4 py-3">6' x 6.5' bed</td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-6 p-4 bg-[#FDF8F3] rounded-lg">
                <p className="text-sm text-[#5C4A32]"><strong>Tip:</strong> Measure your mattress length, width, and depth before ordering. Our fitted sheets accommodate mattresses up to 12" deep.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Form Modal */}
      {showReviewForm && (
        <ReviewFormModal productId={product.id} onClose={() => setShowReviewForm(false)} />
      )}
    </div>
  );
}

// Review Form Modal
function ReviewFormModal({ productId, onClose }: { productId: string; onClose: () => void }) {
  const [formData, setFormData] = useState({ name: '', email: '', rating: 5, comment: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: Date.now().toString(),
        productId,
        customerName: formData.name,
        customerEmail: formData.email,
        rating: formData.rating,
        comment: formData.comment,
        approved: false,
        createdAt: new Date().toISOString()
      })
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center" onClick={(e) => e.stopPropagation()}>
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h3 className="text-xl font-medium text-[#2D2A26] mb-2">Thank You!</h3>
          <p className="text-[#5C4A32] mb-6">Your review has been submitted and will appear after approval.</p>
          <button onClick={onClose} className="bg-[#C4A265] text-white px-6 py-2 rounded-lg hover:bg-[#D4B275]">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="border-b border-[#E8DFD5] px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-serif text-[#2D2A26]">Write a Review</h3>
          <button onClick={onClose} className="p-2 hover:bg-[#F5EDE4] rounded-lg"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#5C4A32] mb-2">Name *</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5C4A32] mb-2">Email *</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="w-full px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5C4A32] mb-2">Rating *</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => setFormData({ ...formData, rating: star })}>
                  <Star size={24} className={star <= formData.rating ? 'text-[#C4A265] fill-[#C4A265]' : 'text-[#E8DFD5]'} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5C4A32] mb-2">Your Review *</label>
            <textarea value={formData.comment} onChange={(e) => setFormData({ ...formData, comment: e.target.value })} required rows={4} className="w-full px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265] resize-none" />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 border border-[#E8DFD5] rounded-lg">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-[#C4A265] text-white rounded-lg hover:bg-[#D4B275]">Submit Review</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Checkout View
function CheckoutView({ cart, cartTotal, shipping, orderTotal, onBack, onCheckout }: any) {
  const [customer, setCustomer] = useState<Customer>({ name: '', email: '', phone: '', address: '', city: '', postalCode: '' });
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'jazzcash' | 'easypaisa'>('cod');
  const [paymentProof, setPaymentProof] = useState<string>('');
  const [discountCode, setDiscountCode] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCheckout(customer, paymentMethod, paymentProof);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button onClick={onBack} className="flex items-center gap-2 text-[#5C4A32] hover:text-[#C4A265] mb-6">
        <ChevronLeft size={18} /> Back to Cart
      </button>
      <h1 className="text-3xl font-serif text-[#2D2A26] mb-8">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
            <h3 className="text-lg font-medium mb-4">Contact Information</h3>
            <input type="text" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} placeholder="Full Name" required className="w-full px-4 py-3 bg-[#FDF8F3] border border-[#E8DFD5] rounded-xl mb-3" />
            <input type="email" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} placeholder="Email" required className="w-full px-4 py-3 bg-[#FDF8F3] border border-[#E8DFD5] rounded-xl mb-3" />
            <input type="tel" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} placeholder="Phone Number" required className="w-full px-4 py-3 bg-[#FDF8F3] border border-[#E8DFD5] rounded-xl" />
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
            <h3 className="text-lg font-medium mb-4">Shipping Address</h3>
            <input type="text" value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} placeholder="Street Address" required className="w-full px-4 py-3 bg-[#FDF8F3] border border-[#E8DFD5] rounded-xl mb-3" />
            <div className="grid grid-cols-2 gap-3">
              <input type="text" value={customer.city} onChange={(e) => setCustomer({ ...customer, city: e.target.value })} placeholder="City" required className="px-4 py-3 bg-[#FDF8F3] border border-[#E8DFD5] rounded-xl" />
              <input type="text" value={customer.postalCode} onChange={(e) => setCustomer({ ...customer, postalCode: e.target.value })} placeholder="Postal Code" required className="px-4 py-3 bg-[#FDF8F3] border border-[#E8DFD5] rounded-xl" />
            </div>
          </div>
          {customer.city && (
            <CityDeliveryEstimate city={customer.city} onCityChange={(city) => setCustomer({ ...customer, city })} />
          )}
          <DiscountCodeInput
            orderTotal={cartTotal}
            onApply={(discount, code) => { setDiscountAmount(discount); setDiscountCode(code); }}
            onRemove={() => { setDiscountAmount(0); setDiscountCode(''); }}
            appliedCode={discountCode}
            appliedDiscount={discountAmount}
          />
          <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
            <h3 className="text-lg font-medium mb-4">Payment Method</h3>
            <div className="space-y-3">
              <label className="flex items-center p-4 border-2 rounded-xl cursor-pointer hover:border-[#C4A265]">
                <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value as any)} className="mr-3" />
                <span>Cash on Delivery (COD)</span>
              </label>
              <label className="flex items-center p-4 border-2 rounded-xl cursor-pointer hover:border-[#C4A265]">
                <input type="radio" name="payment" value="jazzcash" checked={paymentMethod === 'jazzcash'} onChange={(e) => setPaymentMethod(e.target.value as any)} className="mr-3" />
                <span>JazzCash (03160143039)</span>
              </label>
              <label className="flex items-center p-4 border-2 rounded-xl cursor-pointer hover:border-[#C4A265]">
                <input type="radio" name="payment" value="easypaisa" checked={paymentMethod === 'easypaisa'} onChange={(e) => setPaymentMethod(e.target.value as any)} className="mr-3" />
                <span>Easypaisa (03160143039)</span>
              </label>
            </div>
            {paymentMethod !== 'cod' && (
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Payment Proof (Optional)</label>
                <input type="text" value={paymentProof} onChange={(e) => setPaymentProof(e.target.value)} placeholder="Transaction ID or screenshot URL" className="w-full px-4 py-3 bg-[#FDF8F3] border border-[#E8DFD5] rounded-xl" />
              </div>
            )}
          </div>
          <button type="submit" className="w-full bg-[#2D2A26] text-white py-4 rounded-full font-medium hover:bg-[#C4A265] text-lg">Place Order</button>
        </div>
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE] sticky top-24">
            <h3 className="text-lg font-medium mb-4">Order Summary</h3>
            {cart.map((item: CartItem) => (
              <div key={item.variantId} className="flex gap-3 mb-3">
                <img src={item.image} alt={item.productName} className="w-14 h-14 object-cover rounded-lg" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.productName}</p>
                  <p className="text-xs text-[#A09080]">{item.size} - {item.type} x{item.quantity}</p>
                </div>
                <span className="text-sm font-medium">Rs {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="border-t border-[#E8DFD5] pt-4 mt-4 space-y-2">
              <div className="flex justify-between text-sm"><span>Subtotal</span><span>Rs {cartTotal.toLocaleString()}</span></div>
              <div className="flex justify-between text-sm"><span>Shipping</span><span>Rs {shipping.toLocaleString()}</span></div>
              <div className="flex justify-between font-semibold text-lg pt-2 border-t border-[#E8DFD5]"><span>Total</span><span>Rs {orderTotal.toLocaleString()}</span></div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

// Confirmation View
function ConfirmationView({ order, onContinue }: any) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
      </div>
      <h2 className="text-3xl font-serif text-[#2D2A26] mb-3">Order Confirmed!</h2>
      <p className="text-[#5C4A32] mb-2">Thank you for your order.</p>
      <p className="text-sm text-[#A09080] mb-8">Order #{order.orderNumber}</p>
      <button onClick={onContinue} className="bg-[#2D2A26] text-white px-8 py-3 rounded-full font-medium hover:bg-[#C4A265]">Continue Shopping</button>
    </div>
  );
}
