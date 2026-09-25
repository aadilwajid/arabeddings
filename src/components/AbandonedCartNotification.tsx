'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, X, Clock } from 'lucide-react';
import { CartItem } from '@/types';

interface AbandonedCartData {
  items: CartItem[];
  savedAt: number;
  notified: boolean;
}

const ABANDONED_CART_KEY = 'ara_abandoned_cart';
const ABANDONMENT_THRESHOLD = 24 * 60 * 60 * 1000; // 24 hours

export function saveCartForRecovery(items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  if (items.length === 0) {
    localStorage.removeItem(ABANDONED_CART_KEY);
    return;
  }
  const data: AbandonedCartData = {
    items,
    savedAt: Date.now(),
    notified: false
  };
  localStorage.setItem(ABANDONED_CART_KEY, JSON.stringify(data));
}

export function getAbandonedCart(): AbandonedCartData | null {
  if (typeof window === 'undefined') return null;
  const saved = localStorage.getItem(ABANDONED_CART_KEY);
  if (!saved) return null;
  
  const data: AbandonedCartData = JSON.parse(saved);
  const timeSinceSaved = Date.now() - data.savedAt;
  
  // Only show if cart was abandoned more than threshold ago and not yet notified
  if (timeSinceSaved >= ABANDONMENT_THRESHOLD && !data.notified) {
    return data;
  }
  return null;
}

export function markCartAsNotified(): void {
  if (typeof window === 'undefined') return;
  const saved = localStorage.getItem(ABANDONED_CART_KEY);
  if (saved) {
    const data: AbandonedCartData = JSON.parse(saved);
    data.notified = true;
    localStorage.setItem(ABANDONED_CART_KEY, JSON.stringify(data));
  }
}

export function clearAbandonedCart(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ABANDONED_CART_KEY);
}

export default function AbandonedCartNotification({ onRestore }: { onRestore: (items: CartItem[]) => void }) {
  const [abandonedCart, setAbandonedCart] = useState<AbandonedCartData | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const cart = getAbandonedCart();
    if (cart) {
      setAbandonedCart(cart);
      // Show notification after a short delay
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleRestore = () => {
    if (abandonedCart) {
      onRestore(abandonedCart.items);
      clearAbandonedCart();
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    markCartAsNotified();
    setIsVisible(false);
  };

  if (!abandonedCart || !isVisible) return null;

  const total = abandonedCart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 bg-white rounded-2xl shadow-2xl border border-[#E8DFD5] z-40 animate-fade-in">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#C4A265]/10 rounded-full flex items-center justify-center">
              <ShoppingBag size={20} className="text-[#C4A265]" />
            </div>
            <div>
              <h4 className="font-medium text-[#2D2A26] text-sm">You left items in your cart!</h4>
              <p className="text-xs text-[#A09080] flex items-center gap-1">
                <Clock size={12} />
                {abandonedCart.items.length} items • Rs {total.toLocaleString()}
              </p>
            </div>
          </div>
          <button onClick={handleDismiss} className="text-[#A09080] hover:text-[#2D2A26]">
            <X size={18} />
          </button>
        </div>

        {/* Preview items */}
        <div className="flex gap-2 mb-4 overflow-hidden">
          {abandonedCart.items.slice(0, 3).map((item, i) => (
            <img
              key={i}
              src={item.image}
              alt={item.productName}
              className="w-16 h-16 object-cover rounded-lg border border-[#E8DFD5]"
            />
          ))}
          {abandonedCart.items.length > 3 && (
            <div className="w-16 h-16 bg-[#F5EDE4] rounded-lg flex items-center justify-center text-sm text-[#5C4A32]">
              +{abandonedCart.items.length - 3}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleRestore}
            className="flex-1 bg-[#C4A265] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#D4B275]"
          >
            Restore Cart
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 py-2 border border-[#E8DFD5] rounded-lg text-sm text-[#5C4A32] hover:bg-[#F5EDE4]"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
