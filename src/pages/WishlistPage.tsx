import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { useStore } from '../store';
import { formatPKR } from '../data/pakistan';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useStore();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <Heart className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={64} />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Wishlist is Empty</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Save your favorite items for later.</p>
        <Link to="/products" className="mt-6 inline-flex items-center px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Wishlist ({wishlist.length})</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlist.map(item => {
          const product = item.product || useStore.getState().products.find(p => p.id === item.productId);
          if (!product) return null;
          const minPrice = Math.min(...product.variants.filter(v => v.isActive).map(v => v.price));
          return (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 shadow-sm overflow-hidden">
              <Link to={`/products/${product.slug}`}>
                <div className="aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <img src={product.images[0]?.url || ''} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                </div>
              </Link>
              <div className="p-4">
                <Link to={`/products/${product.slug}`}>
                  <h3 className="font-semibold text-gray-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 line-clamp-1">{product.name}</h3>
                </Link>
                <p className="text-lg font-bold text-gray-900 dark:text-white mt-2">From {formatPKR(minPrice)}</p>
                <div className="flex items-center space-x-2 mt-3">
                  <Link to={`/products/${product.slug}`} className="flex-1 flex items-center justify-center px-3 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700">
                    <ShoppingCart size={14} className="mr-1" /> Select Options
                  </Link>
                  <button onClick={() => toggleWishlist(product.id)} className="p-2 text-red-400 hover:text-red-600 border dark:border-gray-600 rounded-lg">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
