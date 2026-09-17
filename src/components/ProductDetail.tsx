import { X, Star, ShoppingBag, Minus, Plus, Heart, Truck, Shield, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { Product } from '../types';

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export default function ProductDetail({ product, onClose, onAddToCart }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#2D2A26]/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-[#FDF8F3] rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full hover:bg-white transition-colors shadow-sm"
        >
          <X size={20} className="text-[#5C4A32]" />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative aspect-square md:aspect-auto md:h-full bg-[#F5EDE4] rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-[#C4A265] text-white text-sm font-medium px-4 py-1.5 rounded-full">
                {product.badge}
              </span>
            )}
          </div>

          {/* Details */}
          <div className="p-6 md:p-8 flex flex-col">
            <p className="text-sm text-[#C4A265] uppercase tracking-wider mb-2">{product.category}</p>
            <h2 className="text-2xl md:text-3xl font-serif text-[#2D2A26] mb-3">{product.name}</h2>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < Math.floor(product.rating) ? 'text-[#C4A265] fill-[#C4A265]' : 'text-[#E8DFD5]'}
                  />
                ))}
              </div>
              <span className="text-sm text-[#5C4A32]">{product.rating}</span>
              <span className="text-sm text-[#A09080]">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-5">
              <span className="text-3xl font-semibold text-[#2D2A26]">${product.price}</span>
              {product.originalPrice && (
                <span className="text-lg text-[#A09080] line-through">${product.originalPrice}</span>
              )}
            </div>

            {/* Description */}
            <p className="text-[#5C4A32] leading-relaxed mb-5">{product.description}</p>

            {/* Details list */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-[#2D2A26] uppercase tracking-wider mb-2">Details</h4>
              <ul className="space-y-1.5">
                {product.details.map((detail, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#5C4A32]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C4A265] mt-1.5 shrink-0" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-5">
              <span className="text-sm font-medium text-[#2D2A26]">Quantity:</span>
              <div className="flex items-center border border-[#E8DFD5] rounded-full">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:text-[#C4A265] transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="w-10 text-center text-sm font-medium text-[#2D2A26]">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:text-[#C4A265] transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-[#2D2A26] text-white py-3 px-6 rounded-full font-medium hover:bg-[#C4A265] transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag size={18} />
                Add to Cart
              </button>
              <button className="p-3 border border-[#E8DFD5] rounded-full hover:border-[#C4A265] hover:text-[#C4A265] transition-colors">
                <Heart size={18} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-5 border-t border-[#E8DFD5]">
              <div className="flex flex-col items-center text-center">
                <Truck size={18} className="text-[#C4A265] mb-1" />
                <span className="text-xs text-[#5C4A32]">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Shield size={18} className="text-[#C4A265] mb-1" />
                <span className="text-xs text-[#5C4A32]">2-Year Warranty</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <RotateCcw size={18} className="text-[#C4A265] mb-1" />
                <span className="text-xs text-[#5C4A32]">30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
