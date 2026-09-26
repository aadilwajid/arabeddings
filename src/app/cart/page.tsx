'use client';

import { useState, useEffect } from 'react';
import { CartItem } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ShoppingBag, Minus, Plus, Trash2, ArrowLeft } from 'lucide-react';

const CART_KEY = 'ara_cart';

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedCart = localStorage.getItem(CART_KEY);
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    setLoading(false);
  }, []);

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem(CART_KEY, JSON.stringify(newCart));
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(variantId);
      return;
    }
    const newCart = cart.map(item => 
      item.variantId === variantId ? { ...item, quantity } : item
    );
    updateCart(newCart);
  };

  const removeFromCart = (variantId: string) => {
    const newCart = cart.filter(item => item.variantId !== variantId);
    updateCart(newCart);
  };

  const clearCart = () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      updateCart([]);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 350;
  const orderTotal = cartTotal + shipping;

  const formatPrice = (price: number) => `Rs ${price.toLocaleString()}`;

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
        <Header />
        <div className="pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 rounded-xl" style={{ backgroundColor: 'var(--color-surface)' }} />
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <Header />
      
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-serif" style={{ color: 'var(--color-text)' }}>Shopping Cart</h1>
              <p style={{ color: 'var(--color-text-secondary)' }}>{cart.length} {cart.length === 1 ? 'item' : 'items'}</p>
            </div>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-sm hover:underline"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Clear Cart
              </button>
            )}
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag size={64} className="mx-auto mb-4" style={{ color: 'var(--color-text-secondary)' }} />
              <h2 className="text-2xl font-serif mb-2" style={{ color: 'var(--color-text)' }}>Your cart is empty</h2>
              <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>Add some products to get started</p>
              <Link
                href="/shop"
                className="inline-block px-8 py-3 rounded-lg font-medium transition-colors"
                style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.map(item => (
                  <div
                    key={item.variantId}
                    className="flex gap-4 p-4 rounded-xl"
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      border: 'var(--border)',
                      borderRadius: 'var(--border-radius)'
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium mb-1" style={{ color: 'var(--color-text)' }}>
                        {item.productName}
                      </h3>
                      <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                        {item.size} - {item.type}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="p-1 rounded hover:bg-gray-100"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-8 text-center" style={{ color: 'var(--color-text)' }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="p-1 rounded hover:bg-gray-100"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-semibold" style={{ color: 'var(--color-text)' }}>
                            {formatPrice(item.price * item.quantity)}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.variantId)}
                            className="p-2 rounded hover:bg-red-50 text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div>
                <div
                  className="p-6 rounded-xl sticky top-24"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    border: 'var(--border)',
                    borderRadius: 'var(--border-radius)',
                    boxShadow: 'var(--shadow)'
                  }}
                >
                  <h2 className="text-xl font-serif mb-4" style={{ color: 'var(--color-text)' }}>
                    Order Summary
                  </h2>
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between" style={{ color: 'var(--color-text-secondary)' }}>
                      <span>Subtotal</span>
                      <span>{formatPrice(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between" style={{ color: 'var(--color-text-secondary)' }}>
                      <span>Shipping</span>
                      <span>{formatPrice(shipping)}</span>
                    </div>
                    <div className="border-t pt-3" style={{ borderColor: 'var(--color-border)' }}>
                      <div className="flex justify-between text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
                        <span>Total</span>
                        <span>{formatPrice(orderTotal)}</span>
                      </div>
                    </div>
                  </div>
                  <Link
                    href="/checkout"
                    className="block w-full text-center py-3 rounded-lg font-medium transition-colors"
                    style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                  >
                    Proceed to Checkout
                  </Link>
                  <Link
                    href="/shop"
                    className="block w-full text-center py-3 mt-2 rounded-lg font-medium transition-colors"
                    style={{
                      backgroundColor: 'transparent',
                      color: 'var(--color-text)',
                      border: 'var(--border)'
                    }}
                  >
                    <ArrowLeft size={16} className="inline mr-2" />
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
