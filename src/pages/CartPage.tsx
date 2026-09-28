import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '../store';
import { formatPKR } from '../data/pakistan';
import { CouponInput, calculateDiscount } from '../components/CouponInput';

export default function CartPage() {
  const { cart, updateCartQuantity, removeFromCart, cartTotal, settings, appliedCoupon } = useStore();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <ShoppingBag className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={64} />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Cart is Empty</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Looks like you haven't added anything yet.</p>
        <Link to="/products" className="mt-6 inline-flex items-center px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700">
          Start Shopping <ArrowRight className="ml-2" size={18} />
        </Link>
      </div>
    );
  }

  const subtotal = cartTotal();
  const discount = calculateDiscount(subtotal, appliedCoupon);
  const shipping = (subtotal - discount) >= settings.freeShippingThreshold ? 0 : 250;
  const total = subtotal - discount + shipping;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => {
            const product = item.product || useStore.getState().products.find(p => p.id === item.productId);
            const variant = item.variant || product?.variants.find(v => v.id === item.variantId);
            const variantName = variant?.optionValues.map(ov => ov.value).join(' / ') || '';

            return (
              <div key={item.id} className="flex gap-4 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4">
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                  <img src={product?.images[0]?.url || ''} alt={product?.name || ''} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${product?.slug}`} className="font-semibold text-gray-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 line-clamp-1">{product?.name}</Link>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{variantName}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">SKU: {variant?.sku}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border dark:border-gray-600 rounded-lg">
                      <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="px-2 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"><Minus size={14} /></button>
                      <span className="px-3 py-1 text-sm font-medium text-gray-900 dark:text-white">{item.quantity}</span>
                      <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="px-2 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"><Plus size={14} /></button>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="font-bold text-gray-900 dark:text-white">{formatPKR((variant?.price || 0) * item.quantity)}</span>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600"><Trash2 size={18} /></button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6 h-fit sticky top-24">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
              <span className="font-medium text-gray-900 dark:text-white">{formatPKR(subtotal)}</span>
            </div>
            
            {/* Coupon Input */}
            <div className="py-2">
              <CouponInput />
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-green-600 dark:text-green-400">
                <span>Discount</span>
                <span className="font-medium">-{formatPKR(discount)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Shipping</span>
              <span className="font-medium text-gray-900 dark:text-white">{shipping === 0 ? <span className="text-green-600 dark:text-green-400">FREE</span> : formatPKR(shipping)}</span>
            </div>
            {(subtotal - discount) < settings.freeShippingThreshold && (
              <p className="text-xs text-amber-600 dark:text-amber-400">Add {formatPKR(settings.freeShippingThreshold - (subtotal - discount))} more for free shipping!</p>
            )}
            <div className="border-t dark:border-gray-700 pt-3 flex justify-between">
              <span className="font-semibold text-gray-900 dark:text-white">Total</span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">{formatPKR(total)}</span>
            </div>
          </div>
          <Link
            to="/checkout"
            className="mt-6 w-full flex items-center justify-center px-6 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors"
          >
            Proceed to Checkout <ArrowRight className="ml-2" size={18} />
          </Link>
          <Link to="/products" className="mt-3 w-full flex items-center justify-center px-6 py-3 border dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
