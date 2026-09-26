'use client';

import { useState } from 'react';
import { Tag, X, Check } from 'lucide-react';

// Client-side discount validation (simplified version)
const KNOWN_CODES: Record<string, { type: 'percentage' | 'fixed'; value: number; minOrder: number }> = {
  'WELCOME10': { type: 'percentage', value: 10, minOrder: 2000 },
  'FLAT500': { type: 'fixed', value: 500, minOrder: 5000 },
  'EID20': { type: 'percentage', value: 20, minOrder: 10000 },
};

function validateDiscountCodeClient(code: string, orderTotal: number): { valid: boolean; discount: number; message: string } {
  const discountCode = KNOWN_CODES[code.toUpperCase()];
  
  if (!discountCode) {
    return { valid: false, discount: 0, message: 'Invalid discount code' };
  }
  
  if (orderTotal < discountCode.minOrder) {
    return { valid: false, discount: 0, message: `Minimum order of Rs ${discountCode.minOrder.toLocaleString()} required` };
  }
  
  let discount = 0;
  if (discountCode.type === 'percentage') {
    discount = Math.floor(orderTotal * discountCode.value / 100);
  } else {
    discount = discountCode.value;
  }
  
  return { valid: true, discount, message: `Rs ${discount.toLocaleString()} discount applied!` };
}

interface DiscountCodeInputProps {
  orderTotal: number;
  onApply: (discount: number, code: string) => void;
  onRemove: () => void;
  appliedCode?: string;
  appliedDiscount?: number;
}

export default function DiscountCodeInput({ orderTotal, onApply, onRemove, appliedCode, appliedDiscount }: DiscountCodeInputProps) {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isOpen, setIsOpen] = useState(!!appliedCode);

  const handleApply = () => {
    if (!code.trim()) return;
    
    const result = validateDiscountCodeClient(code, orderTotal);
    if (result.valid) {
      setMessage({ text: result.message, type: 'success' });
      onApply(result.discount, code.toUpperCase());
      setIsOpen(false);
    } else {
      setMessage({ text: result.message, type: 'error' });
    }
  };

  const handleRemove = () => {
    setCode('');
    setMessage(null);
    onRemove();
    setIsOpen(true);
  };

  if (appliedCode && appliedDiscount) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check size={18} className="text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-800">Code: {appliedCode}</p>
              <p className="text-xs text-green-600">Rs {appliedDiscount.toLocaleString()} discount applied</p>
            </div>
          </div>
          <button onClick={handleRemove} className="text-green-600 hover:text-green-800">
            <X size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-[#E8DFD5] rounded-xl p-4">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 text-[#C4A265] hover:text-[#D4B275] text-sm font-medium"
        >
          <Tag size={16} />
          Apply Discount Code
        </button>
      ) : (
        <div>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Enter code"
              className="flex-1 px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265] text-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleApply()}
            />
            <button
              onClick={handleApply}
              className="px-4 py-2 bg-[#C4A265] text-white rounded-lg text-sm font-medium hover:bg-[#D4B275]"
            >
              Apply
            </button>
          </div>
          {message && (
            <p className={`text-xs ${message.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
              {message.text}
            </p>
          )}
          <p className="text-xs text-[#A09080] mt-2">
            Try: WELCOME10, FLAT500, EID20
          </p>
        </div>
      )}
    </div>
  );
}
