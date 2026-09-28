import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { useStore } from '../store';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useStore();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <Heart className="mx-auto text-gray-300 mb-4" size={64} />
        <h1 className="text-2xl font-bold text-gray-900">Your Wishlist is Empty</h1>
        <p className="mt-2 text-gray-600">Save your favorite items for later.</p>
        <Link to="/products" className="mt-6 inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist ({wishlist.length})</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlist.map(item => {
          const product = item.product || useStore.getState().products.find(p => p.id === item.productId);
          if (!product) return null;
          const minPrice = Math.min(...product.variants.filter(v => v.isActive).map(v => v.price));
          return (
            <div key={item.id} className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <Link to={`/products/${product.slug}`}>
                <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                  <img src={product.images[0]?.url || ''} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                </div>
              </Link>
              <div className="p-4">
                <Link to={`/products/${product.slug}`}>
                  <h3 className="font-semibold text-gray-900 hover:text-indigo-600 line-clamp-1">{product.name}</h3>
                </Link>
                <p className="text-lg font-bold text-gray-900 mt-2">From ${minPrice.toFixed(2)}</p>
                <div className="flex items-center space-x-2 mt-3">
                  <Link to={`/products/${product.slug}`} className="flex-1 flex items-center justify-center px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">
                    <ShoppingCart size={14} className="mr-1" /> Select Options
                  </Link>
                  <button onClick={() => toggleWishlist(product.id)} className="p-2 text-red-400 hover:text-red-600 border rounded-lg">
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
