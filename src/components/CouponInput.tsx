import React, { useState } from 'react';
import { Tag, X, Check, AlertCircle } from 'lucide-react';
import { useStore } from '../store';
import { useToast } from './Toast';
import { formatPKR } from '../data/pakistan';

type Coupon = {
  code: string;
  discount: number; // percentage or fixed amount
  type: 'percentage' | 'fixed';
  minOrder: number;
  maxDiscount?: number;
  validUntil: string;
  description: string;
};

// Sample coupons
const availableCoupons: Coupon[] = [
  {
    code: 'WELCOME10',
    discount: 10,
    type: 'percentage',
    minOrder: 3000,
    maxDiscount: 1000,
    validUntil: '2025-12-31',
    description: '10% off on orders above Rs. 3,000',
  },
  {
    code: 'BED2024',
    discount: 500,
    type: 'fixed',
    minOrder: 5000,
    validUntil: '2025-06-30',
    description: 'Rs. 500 off on orders above Rs. 5,000',
  },
  {
    code: 'LUXURY15',
    discount: 15,
    type: 'percentage',
    minOrder: 10000,
    maxDiscount: 2500,
    validUntil: '2025-12-31',
    description: '15% off on luxury collection above Rs. 10,000',
  },
];

export function CouponInput() {
  const { cartTotal, appliedCoupon, applyCoupon, removeCoupon } = useStore();
  const { success, error } = useToast();
  const [code, setCode] = useState('');
  const [showAvailable, setShowAvailable] = useState(false);

  const handleApply = () => {
    if (!code.trim()) {
      error('Please enter a coupon code');
      return;
    }

    const coupon = availableCoupons.find(c => c.code === code.toUpperCase());
    
    if (!coupon) {
      error('Invalid coupon code', 'Please check the code and try again');
      return;
    }

    if (cartTotal() < coupon.minOrder) {
      error(
        'Minimum order not met',
        `This coupon requires a minimum order of ${formatPKR(coupon.minOrder)}`
      );
      return;
    }

    const expiryDate = new Date(coupon.validUntil);
    if (expiryDate < new Date()) {
      error('Coupon expired', 'This coupon is no longer valid');
      return;
    }

    applyCoupon(coupon);
    success('Coupon applied!', coupon.description);
    setCode('');
  };

  const handleRemove = () => {
    removeCoupon();
    success('Coupon removed');
  };

  if (appliedCoupon) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Check size={16} className="text-green-600 dark:text-green-400" />
            <div>
              <p className="text-sm font-medium text-green-900 dark:text-green-300">
                {appliedCoupon.code} applied
              </p>
              <p className="text-xs text-green-700 dark:text-green-400">
                {appliedCoupon.description}
              </p>
            </div>
          </div>
          <button
            onClick={handleRemove}
            className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex space-x-2">
        <div className="flex-1 relative">
          <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            placeholder="Enter coupon code"
            className="w-full pl-9 pr-3 py-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-amber-500"
            onKeyPress={e => e.key === 'Enter' && handleApply()}
          />
        </div>
        <button
          onClick={handleApply}
          className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors"
        >
          Apply
        </button>
      </div>
      
      <button
        onClick={() => setShowAvailable(!showAvailable)}
        className="text-xs text-amber-600 dark:text-amber-400 hover:underline"
      >
        {showAvailable ? 'Hide' : 'Show'} available coupons
      </button>

      {showAvailable && (
        <div className="space-y-2">
          {availableCoupons.map(coupon => (
            <div
              key={coupon.code}
              className="bg-gray-50 dark:bg-gray-700/50 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-3"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                  {coupon.code}
                </span>
                <button
                  onClick={() => {
                    setCode(coupon.code);
                    setShowAvailable(false);
                  }}
                  className="text-xs text-amber-600 dark:text-amber-400 hover:underline"
                >
                  Use this
                </button>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">{coupon.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function calculateDiscount(subtotal: number, coupon: Coupon | null): number {
  if (!coupon) return 0;

  if (subtotal < coupon.minOrder) return 0;

  let discount = 0;
  if (coupon.type === 'percentage') {
    discount = (subtotal * coupon.discount) / 100;
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else {
    discount = coupon.discount;
  }

  return discount;
}
