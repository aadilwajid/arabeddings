import { Star, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart, onViewDetails }: ProductCardProps) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-[#F0E8DE]">
      {/* Image */}
      <div
        className="relative aspect-square overflow-hidden cursor-pointer bg-[#F5EDE4]"
        onClick={() => onViewDetails(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-[#C4A265] text-white text-xs font-medium px-3 py-1 rounded-full">
            {product.badge}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute top-3 right-3 bg-[#D4534B] text-white text-xs font-medium px-2 py-1 rounded-full">
            -{discount}%
          </span>
        )}
        {/* Quick add overlay */}
        <div className="absolute inset-0 bg-[#2D2A26]/0 group-hover:bg-[#2D2A26]/20 transition-all duration-300 flex items-center justify-center">
          <button
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
            className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white text-[#2D2A26] px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[#C4A265] hover:text-white shadow-lg flex items-center gap-2"
          >
            <ShoppingBag size={16} />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="p-4 md:p-5">
        <p className="text-xs text-[#C4A265] uppercase tracking-wider mb-1">{product.category}</p>
        <h3
          className="font-medium text-[#2D2A26] mb-2 cursor-pointer hover:text-[#C4A265] transition-colors line-clamp-1"
          onClick={() => onViewDetails(product)}
        >
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < Math.floor(product.rating) ? 'text-[#C4A265] fill-[#C4A265]' : 'text-[#E8DFD5]'}
              />
            ))}
          </div>
          <span className="text-xs text-[#A09080]">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-[#2D2A26]">${product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-[#A09080] line-through">${product.originalPrice}</span>
          )}
        </div>
      </div>
    </div>
  );
}
