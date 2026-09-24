'use client';

import { useState, useEffect } from 'react';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import { Product } from '@/types';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('wishlist');
    if (saved) setWishlist(JSON.parse(saved));
    
    fetch('/api/products').then(res => res.json()).then(setProducts);
  }, []);

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  const removeFromWishlist = (productId: string) => {
    const newWishlist = wishlist.filter(id => id !== productId);
    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
  };

  const clearWishlist = () => {
    if (confirm('Clear entire wishlist?')) {
      setWishlist([]);
      localStorage.setItem('wishlist', JSON.stringify([]));
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      {/* Hero */}
      <section className="relative h-[250px] bg-gradient-to-br from-[#F5EDE4] to-[#E8DFD5] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#C4A265] text-sm uppercase tracking-[0.3em] mb-4">Saved Items</p>
          <h1 className="text-5xl font-serif text-[#2D2A26] mb-4">My Wishlist</h1>
          <p className="text-lg text-[#5C4A32]">{wishlistProducts.length} items saved</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {wishlistProducts.length > 0 ? (
          <>
            <div className="flex justify-end mb-6">
              <button onClick={clearWishlist} className="text-sm text-red-500 hover:underline">
                Clear All
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistProducts.map(product => (
                <div key={product.id} className="bg-white rounded-2xl overflow-hidden border border-[#F0E8DE]">
                  <div className="aspect-square bg-[#F5EDE4]">
                    <img src={product.mainImage} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-[#C4A265] uppercase tracking-wider mb-1">{product.category}</p>
                    <h3 className="font-medium text-[#2D2A26] mb-2">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-[#2D2A26]">Rs {product.priceFrom.toLocaleString()}</span>
                      <div className="flex gap-2">
                        <button onClick={() => removeFromWishlist(product.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg">
                          <Trash2 size={16} />
                        </button>
                        <a href={`/shop?product=${product.id}`} className="p-2 hover:bg-[#F5EDE4] text-[#5C4A32] rounded-lg">
                          <ShoppingBag size={16} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <Heart size={64} className="text-[#E8DFD5] mx-auto mb-4" />
            <h2 className="text-2xl font-serif text-[#2D2A26] mb-2">Your Wishlist is Empty</h2>
            <p className="text-[#5C4A32] mb-6">Save your favorite items to buy later</p>
            <a href="/" className="bg-[#2D2A26] text-white px-8 py-3 rounded-full font-medium hover:bg-[#C4A265] transition-colors inline-block">
              Start Shopping
            </a>
          </div>
        )}
      </section>
    </div>
  );
}
