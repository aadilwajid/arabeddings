import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../store';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useStore();
  const inWishlist = isInWishlist(product.id);
  const minPrice = Math.min(...product.variants.filter(v => v.isActive).map(v => v.price));
  const maxPrice = Math.max(...product.variants.filter(v => v.isActive).map(v => v.price));
  const avgRating = product.reviews.length > 0
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
    : 0;

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <Link to={`/products/${product.slug}`}>
          <img
            src={product.images[0]?.url || 'https://via.placeholder.com/400x300?text=Product'}
            alt={product.images[0]?.alt || product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        <button
          onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
          className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-all ${inWishlist ? 'bg-red-50 text-red-500' : 'bg-white text-gray-400 hover:text-red-500'}`}
        >
          <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
        </button>
        {product.isFeatured && (
          <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-medium px-2 py-1 rounded-full">Featured</span>
        )}
        {product.variants.some(v => v.comparePrice && v.comparePrice > v.price) && (
          <span className="absolute bottom-3 left-3 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">Sale</span>
        )}
      </div>
      <div className="p-4">
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{product.name}</h3>
        </Link>
        <p className="text-sm text-gray-500 mt-1 line-clamp-1">{product.shortDesc}</p>
        {avgRating > 0 && (
          <div className="flex items-center mt-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} className={i < Math.round(avgRating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
            ))}
            <span className="text-xs text-gray-500 ml-1">({product.reviews.length})</span>
          </div>
        )}
        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-lg font-bold text-gray-900">${minPrice.toFixed(2)}</span>
            {minPrice !== maxPrice && <span className="text-sm text-gray-500"> - ${maxPrice.toFixed(2)}</span>}
          </div>
          <Link
            to={`/products/${product.slug}`}
            className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
          >
            <ShoppingCart size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">No products found.</p>
        <Link to="/products" className="text-indigo-600 hover:underline mt-2 inline-block">Browse all products</Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
