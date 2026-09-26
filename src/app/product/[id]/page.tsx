'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ProductRecommendations, SocialProof, StockAlert, Breadcrumbs } from '@/components/UIComponents';
import { Heart, ShoppingCart, Share2, Star, Minus, Plus } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const productId = params.id;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  
  const { formatPrice, toggleWishlist, isInWishlist } = useApp();

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setAllProducts(data);
        const found = data.find((p: Product) => p.id === productId);
        setProduct(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    
    const variant = product.variants[selectedVariant];
    const cart = JSON.parse(localStorage.getItem('ara_cart') || '[]');
    
    const existingItem = cart.find((item: any) => item.variantId === variant.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        productId: product.id,
        productName: product.name,
        variantId: variant.id,
        size: variant.size,
        type: variant.type,
        price: variant.price,
        quantity,
        image: product.mainImage,
      });
    }
    
    localStorage.setItem('ara_cart', JSON.stringify(cart));
    alert('Added to cart!');
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
        <Header />
        <div className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse grid md:grid-cols-2 gap-8">
              <div className="aspect-square bg-[#F5EDE4] rounded-xl" />
              <div className="space-y-4">
                <div className="h-8 bg-[#F5EDE4] rounded w-3/4" />
                <div className="h-6 bg-[#F5EDE4] rounded w-1/2" />
                <div className="h-20 bg-[#F5EDE4] rounded" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
        <Header />
        <div className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-3xl font-serif mb-4" style={{ color: 'var(--color-text)' }}>
              Product Not Found
            </h1>
            <Link href="/shop" className="text-[var(--color-primary)] hover:underline">
              ← Back to Shop
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const variant = product.variants[selectedVariant];
  const allImages = [product.mainImage, ...product.galleryImages];
  const isWishlisted = isInWishlist(product.id);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <Header />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <Breadcrumbs items={[
            { label: 'Home', href: '/' },
            { label: 'Shop', href: '/shop' },
            { label: product.category, href: `/shop?category=${product.category}` },
            { label: product.name }
          ]} />

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div 
                className="aspect-square rounded-xl overflow-hidden cursor-zoom-in relative"
                style={{ backgroundColor: 'var(--color-background)' }}
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
              >
                <img
                  src={allImages[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300"
                  style={{
                    transform: isZoomed ? 'scale(1.5)' : 'scale(1)',
                  }}
                />
                {product.badge && (
                  <span 
                    className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                  >
                    {product.badge}
                  </span>
                )}
              </div>
              
              {allImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImageIndex(i)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        i === currentImageIndex ? 'border-[var(--color-primary)]' : 'border-transparent'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}

            {/* Product Info */}
            <div className="space-y-4 md:space-y-6">
              <div>
                <p className="text-xs md:text-sm mb-2" style={{ color: 'var(--color-primary)' }}>
                  {product.category}
                </p>
                <h1 className="text-2xl md:text-3xl font-serif mb-3 md:mb-4" style={{ color: 'var(--color-text)' }}>
                  {product.name}
                </h1>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      size={18}
                      className={star <= 4 ? 'fill-[var(--color-primary)] text-[var(--color-primary)]' : 'text-[var(--color-border)]'}
                    />
                  ))}
                </div>
                <span className="text-xs md:text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  (4.0) • 128 reviews
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                <span className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
                  {formatPrice(variant.price)}
                </span>
                {product.compareAt && (
                  <>
                    <span className="text-lg md:text-xl line-through" style={{ color: 'var(--color-text-secondary)' }}>
                      {formatPrice(product.compareAt)}
                    </span>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700">
                      Save {Math.round(((product.compareAt - variant.price) / product.compareAt) * 100)}%
                    </span>
                  </>
                )}
              </div>

              {/* Social Proof */}
              <SocialProof viewers={Math.floor(Math.random() * 20) + 5} sold={Math.floor(Math.random() * 50) + 20} />

              {/* Description */}
              <p className="mb-6 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                {product.description}
              </p>

              {/* Variant Selection */}
              {product.customizable && product.variants.length > 1 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-3" style={{ color: 'var(--color-text)' }}>
                    Select Size & Type
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {product.variants.map((v, i) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(i)}
                        className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                          selectedVariant === i
                            ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10'
                            : 'hover:border-[var(--color-primary)]'
                        }`}
                        style={{ borderColor: selectedVariant === i ? 'var(--color-primary)' : 'var(--color-border)' }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>
                              {v.size} - {v.type}
                            </p>
                            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                              {v.stock > 0 ? `${v.stock} in stock` : 'Out of stock'}
                            </p>
                          </div>
                          <p className="font-semibold" style={{ color: 'var(--color-text)' }}>
                            {formatPrice(v.price)}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock Alert */}
              {variant.stock <= 10 && variant.stock > 0 && (
                <StockAlert productId={product.id} productName={product.name} />
              )}

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border flex items-center justify-center hover:bg-[var(--color-background)]"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-medium" style={{ color: 'var(--color-text)' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg border flex items-center justify-center hover:bg-[var(--color-background)]"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 md:gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={variant.stock === 0}
                  className="flex-1 py-3 md:py-4 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm md:text-base"
                  style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                >
                  <ShoppingCart size={20} />
                  <span>{variant.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                </button>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3 md:p-4 rounded-lg border-2 transition-all ${
                    isWishlisted
                      ? 'bg-red-50 border-red-500 text-red-500'
                      : 'hover:border-[var(--color-primary)]'
                  }`}
                  style={{ borderColor: isWishlisted ? '#ef4444' : 'var(--color-border)' }}
                >
                  <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
                </button>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: product.name,
                        text: product.description,
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                    }
                  }}
                  className="p-3 md:p-4 rounded-lg border-2 hover:border-[var(--color-primary)] transition-all"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  <Share2 size={20} />
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-2 md:gap-4 pt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <div className="text-center">
                  <p className="text-[10px] md:text-xs font-medium mb-1" style={{ color: 'var(--color-text)' }}>
                    Free Shipping
                  </p>
                  <p className="text-[9px] md:text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    On orders over Rs 10,000
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] md:text-xs font-medium mb-1" style={{ color: 'var(--color-text)' }}>
                    7-Day Returns
                  </p>
                  <p className="text-[9px] md:text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    Easy return policy
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] md:text-xs font-medium mb-1" style={{ color: 'var(--color-text)' }}>
                    Secure Payment
                  </p>
                  <p className="text-[9px] md:text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    100% protected
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Recommendations */}
          <ProductRecommendations products={allProducts} currentProductId={product.id} />
        </div>
      </div>

      <Footer />
    </div>
  );
}
