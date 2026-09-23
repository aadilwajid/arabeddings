'use client';

import { useState, useEffect, useMemo } from 'react';
import { Product, CartItem, Size, VariantType, Order, Customer } from '@/types';
import { Search, ShoppingBag, Menu, X, Star, Minus, Plus, Heart, Trash2, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';

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
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data));
    
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
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
      if (existing) {
        return prev.map(item => item.variantId === variantId ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, {
        productId: product.id,
        productName: product.name,
        variantId: variant.id,
        size: variant.size,
        type: variant.type,
        price: variant.price,
        quantity,
        image: product.mainImage
      }];
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
              <a href="/contact" className="text-sm text-[#5C4A32] hover:text-[#C4A265]">Contact</a>
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
              <a href="/contact" className="text-sm text-[#5C4A32]">Contact</a>
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
                  <ProductCard key={product.id} product={product} onAddToCart={addToCart} onViewDetails={setSelectedProduct} onToggleWishlist={toggleWishlist} isWishlisted={wishlist.includes(product.id)} formatPrice={formatPrice} />
                ))}
              </div>
              <div className="text-center mt-8">
                <button onClick={() => setView('shop')} className="bg-[#2D2A26] text-white px-8 py-3 rounded-full font-medium hover:bg-[#C4A265] transition-colors">
                  View All Products
                </button>
              </div>
            </section>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} onViewDetails={setSelectedProduct} onToggleWishlist={toggleWishlist} isWishlisted={wishlist.includes(product.id)} formatPrice={formatPrice} />
            ))}
          </div>
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

      {/* Footer */}
      <footer className="bg-[#F5EDE4] border-t border-[#E8DFD5] py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-[#A09080]">© 2026 ARA Beddings. All rights reserved.</p>
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
          </div>
        </div>
      </div>
    </div>
  );
}

// Checkout View
function CheckoutView({ cart, cartTotal, shipping, orderTotal, onBack, onCheckout }: any) {
  const [customer, setCustomer] = useState<Customer>({ name: '', email: '', phone: '', address: '', city: '', postalCode: '' });
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'jazzcash' | 'easypaisa'>('cod');
  const [paymentProof, setPaymentProof] = useState<string>('');

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
