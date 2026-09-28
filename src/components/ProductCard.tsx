import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingCart, Eye } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../store';
import { formatPKR } from '../data/pakistan';

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
  const hasDiscount = product.variants.some(v => v.comparePrice && v.comparePrice > v.price);
  const totalStock = product.variants.reduce((sum, v) => sum + (v.isActive ? v.stock : 0), 0);

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-700 transform hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-700">
        <Link to={`/products/${product.slug}`}>
          <img
            src={product.images[0]?.url || 'https://via.placeholder.com/400x300?text=Product'}
            alt={product.images[0]?.alt || product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isFeatured && (
            <span className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              Featured
            </span>
          )}
          {hasDiscount && (
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              Sale
            </span>
          )}
          {totalStock < 10 && totalStock > 0 && (
            <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              Only {totalStock} left
            </span>
          )}
          {totalStock === 0 && (
            <span className="bg-gray-800 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              Out of Stock
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
            className={`p-2.5 rounded-full shadow-lg transition-all ${
              inWishlist 
                ? 'bg-red-500 text-white' 
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-red-500'
            }`}
          >
            <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
          </button>
          <Link
            to={`/products/${product.slug}`}
            className="p-2.5 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full shadow-lg hover:text-amber-600 transition-colors"
          >
            <Eye size={18} />
          </Link>
        </div>

        {/* Quick Add Button */}
        <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <Link
            to={`/products/${product.slug}`}
            className="w-full flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-sm font-semibold rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all shadow-lg"
          >
            <ShoppingCart size={16} className="mr-2" />
            View Options
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Brand */}
        {product.brand && (
          <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-1">
            {product.brand}
          </p>
        )}
        
        {/* Name */}
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        {/* Short Description */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{product.shortDesc}</p>

        {/* Rating */}
        {avgRating > 0 && (
          <div className="flex items-center mt-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className={i < Math.round(avgRating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 dark:text-gray-600'} />
              ))}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1.5">({product.reviews.length})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t dark:border-gray-700">
          <div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">{formatPKR(minPrice)}</span>
            {minPrice !== maxPrice && (
              <span className="text-sm text-gray-500 dark:text-gray-400"> - {formatPKR(maxPrice)}</span>
            )}
          </div>
          <Link
            to={`/products/${product.slug}`}
            className="p-2 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
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
      <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700">
        <div className="text-6xl mb-4">🔍</div>
        <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">No products found</p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mb-4">Try adjusting your filters or search terms</p>
        <Link to="/products" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all">
          Browse all products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
