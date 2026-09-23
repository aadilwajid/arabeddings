'use client';

import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { CartItem } from '@/types';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onCheckout: () => void;
}

export default function Cart({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem, onCheckout }: CartProps) {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 200 ? 0 : 15;
  const total = subtotal + shipping;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-[#2D2A26]/50 backdrop-blur-sm z-50" onClick={onClose} />
      )}

      {/* Cart Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-[#FDF8F3] z-50 transform transition-transform duration-300 ease-in-out shadow-2xl ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-[#E8DFD5]">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-[#C4A265]" />
              <h2 className="text-lg font-serif text-[#2D2A26]">Your Cart</h2>
              <span className="text-sm text-[#A09080]">({items.length} items)</span>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-[#F0E8DE] rounded-full transition-colors">
              <X size={20} className="text-[#5C4A32]" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-5">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag size={48} className="text-[#E8DFD5] mb-4" />
                <p className="text-[#5C4A32] font-medium mb-2">Your cart is empty</p>
                <p className="text-sm text-[#A09080]">Add some luxurious items to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4 bg-white rounded-xl p-3 border border-[#F0E8DE]">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-[#2D2A26] truncate">{item.product.name}</h4>
                      <p className="text-xs text-[#A09080] mb-2">{item.product.category}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-[#E8DFD5] rounded-full">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1.5 hover:text-[#C4A265] transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-7 text-center text-xs font-medium">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1.5 hover:text-[#C4A265] transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <span className="text-sm font-semibold text-[#2D2A26]">
                          ${item.product.price * item.quantity}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="self-start p-1 text-[#A09080] hover:text-[#D4534B] transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-[#E8DFD5] p-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#5C4A32]">Subtotal</span>
                <span className="font-medium text-[#2D2A26]">${subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#5C4A32]">Shipping</span>
                <span className="font-medium text-[#2D2A26]">
                  {shipping === 0 ? <span className="text-green-600">Free</span> : `$${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-[#A09080]">Free shipping on orders over $200</p>
              )}
              <div className="flex justify-between pt-2 border-t border-[#E8DFD5]">
                <span className="font-medium text-[#2D2A26]">Total</span>
                <span className="text-lg font-semibold text-[#2D2A26]">${total}</span>
              </div>
              <button
                onClick={onCheckout}
                className="w-full bg-[#2D2A26] text-white py-3.5 rounded-full font-medium hover:bg-[#C4A265] transition-colors flex items-center justify-center gap-2 mt-3"
              >
                Proceed to Checkout
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
