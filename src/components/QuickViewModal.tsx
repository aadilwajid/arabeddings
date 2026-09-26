'use client';

import { useState } from 'react';
import { X, Heart, ShoppingCart, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/types';
import { useApp } from '@/contexts/AppContext';

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, variantId: string, quantity: number) => void;
}

export default function QuickViewModal({ product, onClose, onAddToCart }: QuickViewModalProps) {
  const { formatPrice, toggleWishlist, isInWishlist } = useApp();
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const allImages = [product.mainImage, ...product.galleryImages];
  const isWishlisted = isInWishlist(product.id);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const handleAddToCart = () => {
    if (selectedVariant) {
      onAddToCart(product, selectedVariant.id, quantity);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div 
        className="bg-white dark:bg-[#2d2d2d] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        style={{ border: 'var(--border)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <h2 className="text-xl font-serif" style={{ color: 'var(--color-text)' }}>
            Quick View
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#F5EDE4] dark:hover:bg-[#404040]"
          >
            <X size={20} style={{ color: 'var(--color-text)' }} />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 p-6 overflow-y-auto">
          {/* Image Gallery with Zoom */}
          <div>
            <div 
              className="relative aspect-square rounded-xl overflow-hidden cursor-zoom-in mb-4"
              style={{ backgroundColor: 'var(--color-background)' }}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <img
                src={allImages[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300"
                style={{
                  transform: isZoomed ? 'scale(2)' : 'scale(1)',
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                }}
              />
              
              {/* Zoom Indicator */}
              <div className="absolute top-3 right-3 bg-black/50 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
                <ZoomIn size={14} />
                Hover to zoom
              </div>

              {/* Navigation Arrows */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex((currentImageIndex - 1 + allImages.length) % allImages.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((currentImageIndex + 1) % allImages.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImageIndex(i)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      i === currentImageIndex ? 'border-[#C4A265]' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            {/* Badge */}
            {product.badge && (
              <span 
                className="inline-block self-start px-3 py-1 rounded-full text-xs font-medium mb-3"
                style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
              >
                {product.badge}
              </span>
            )}

            {/* Title */}
            <h3 className="text-2xl font-serif mb-2" style={{ color: 'var(--color-text)' }}>
              {product.name}
            </h3>

            {/* Category */}
            <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
              {product.category}
            </p>

            {/* Price */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
                {formatPrice(product.priceFrom)}
              </span>
              {product.compareAt && (
                <span className="text-lg line-through" style={{ color: 'var(--color-text-secondary)' }}>
                  {formatPrice(product.compareAt)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              {product.description}
            </p>

            {/* Variant Selection */}
            {product.customizable && product.variants.length > 1 && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3" style={{ color: 'var(--color-text)' }}>
                  Select Size & Type
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {product.variants.map(variant => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                        selectedVariant?.id === variant.id
                          ? 'border-[#C4A265] bg-[#C4A265]/10'
                          : 'hover:border-[#C4A265]'
                      }`}
                      style={{ borderColor: selectedVariant?.id === variant.id ? '#C4A265' : 'var(--color-border)' }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>
                            {variant.size} - {variant.type}
                          </p>
                          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                            {variant.stock > 0 ? `${variant.stock} in stock` : 'Out of stock'}
                          </p>
                        </div>
                        <p className="font-semibold" style={{ color: 'var(--color-text)' }}>
                          {formatPrice(variant.price)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border flex items-center justify-center hover:bg-[#F5EDE4] dark:hover:bg-[#404040]"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  -
                </button>
                <span className="w-12 text-center font-medium" style={{ color: 'var(--color-text)' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border flex items-center justify-center hover:bg-[#F5EDE4] dark:hover:bg-[#404040]"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-auto">
              <button
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.stock === 0}
                className="flex-1 bg-[#C4A265] text-white py-3 rounded-lg font-medium hover:bg-[#D4B275] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShoppingCart size={18} />
                Add to Cart
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  isWishlisted
                    ? 'bg-red-50 border-red-500 text-red-500'
                    : 'hover:border-[#C4A265]'
                }`}
                style={{ borderColor: isWishlisted ? '#ef4444' : 'var(--color-border)' }}
              >
                <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Stock Status */}
            <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                {selectedVariant?.stock && selectedVariant.stock > 0 ? (
                  <span className="text-green-600">✓ In Stock ({selectedVariant.stock} available)</span>
                ) : (
                  <span className="text-red-600">✗ Out of Stock</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
