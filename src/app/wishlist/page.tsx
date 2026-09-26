'use client';

import { useState, useEffect } from 'react';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import { Product } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { WishlistShare } from '@/components/UIComponents';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('wishlist');
    if (saved) setWishlist(JSON.parse(saved));
    
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
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
      <Header />
      
      {/* Hero */}
      <section className="relative h-[200px] md:h-[250px] bg-gradient-to-br from-[#F5EDE4] to-[#E8DFD5] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#C4A265] text-xs md:text-sm uppercase tracking-[0.3em] mb-2 md:mb-4">Saved Items</p>
          <h1 className="text-3xl md:text-5xl font-serif text-[#2D2A26] mb-2 md:mb-4">My Wishlist</h1>
          <p className="text-sm md:text-lg text-[#5C4A32]">{wishlistProducts.length} items saved</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-[#F0E8DE] animate-pulse">
                <div className="aspect-square bg-[#F5EDE4]" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-[#F5EDE4] rounded w-1/4" />
                  <div className="h-4 bg-[#F5EDE4] rounded w-3/4" />
                  <div className="h-5 bg-[#F5EDE4] rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : wishlistProducts.length > 0 ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <WishlistShare wishlistCount={wishlistProducts.length} />
              <button onClick={clearWishlist} className="text-sm text-red-500 hover:underline">
                Clear All
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
              {wishlistProducts.map(product => (
                <div key={product.id} className="bg-white rounded-xl md:rounded-2xl overflow-hidden border border-[#F0E8DE]">
                  <div className="aspect-square bg-[#F5EDE4]">
                    <img src={product.mainImage} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3 md:p-4">
                    <p className="text-[10px] md:text-xs text-[#C4A265] uppercase tracking-wider mb-1">{product.category}</p>
                    <h3 className="font-medium text-[#2D2A26] mb-2 text-sm md:text-base line-clamp-2">{product.name}</h3>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm md:text-lg font-semibold text-[#2D2A26]">Rs {product.priceFrom.toLocaleString()}</span>
                      <div className="flex gap-1 md:gap-2">
                        <button onClick={() => removeFromWishlist(product.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg min-w-[32px] min-h-[32px] flex items-center justify-center">
                          <Trash2 size={16} />
                        </button>
                        <a href={`/product/${product.id}`} className="p-2 hover:bg-[#F5EDE4] text-[#5C4A32] rounded-lg min-w-[32px] min-h-[32px] flex items-center justify-center">
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

      <Footer />
    </div>
  );
}
