import { useState } from 'react';
import { ArrowLeft, CreditCard, Lock, CheckCircle2 } from 'lucide-react';
import { CartItem } from '../types';

interface CheckoutProps {
  items: CartItem[];
  onBack: () => void;
  onComplete: () => void;
}

export default function Checkout({ items, onBack, onComplete }: CheckoutProps) {
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 200 ? 0 : 15;
  const total = subtotal + shipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    // Simulate processing
    setTimeout(() => {
      setStep('success');
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (step === 'success') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-green-600" />
          </div>
          <h2 className="text-3xl font-serif text-[#2D2A26] mb-3">Order Confirmed!</h2>
          <p className="text-[#5C4A32] mb-2">Thank you for your purchase.</p>
          <p className="text-sm text-[#A09080] mb-8">
            Order #ARA-{Math.random().toString(36).substring(2, 8).toUpperCase()} has been placed successfully.
            A confirmation email will be sent shortly.
          </p>
          <button
            onClick={onComplete}
            className="bg-[#2D2A26] text-white px-8 py-3 rounded-full font-medium hover:bg-[#C4A265] transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (step === 'processing') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#E8DFD5] border-t-[#C4A265] rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-xl font-serif text-[#2D2A26] mb-2">Processing your order...</h2>
          <p className="text-sm text-[#A09080]">Please wait while we confirm your payment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#5C4A32] hover:text-[#C4A265] transition-colors mb-6"
      >
        <ArrowLeft size={18} />
        <span className="text-sm">Back to Cart</span>
      </button>

      <h1 className="text-3xl font-serif text-[#2D2A26] mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
          {/* Contact */}
          <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
            <h3 className="text-lg font-medium text-[#2D2A26] mb-4">Contact Information</h3>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
              required
              className="w-full px-4 py-3 bg-[#FDF8F3] border border-[#E8DFD5] rounded-xl focus:outline-none focus:border-[#C4A265] text-sm text-[#2D2A26] placeholder:text-[#A09080]"
            />
          </div>

          {/* Shipping */}
          <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
            <h3 className="text-lg font-medium text-[#2D2A26] mb-4">Shipping Address</h3>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
                required
                className="px-4 py-3 bg-[#FDF8F3] border border-[#E8DFD5] rounded-xl focus:outline-none focus:border-[#C4A265] text-sm text-[#2D2A26] placeholder:text-[#A09080]"
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last name"
                required
                className="px-4 py-3 bg-[#FDF8F3] border border-[#E8DFD5] rounded-xl focus:outline-none focus:border-[#C4A265] text-sm text-[#2D2A26] placeholder:text-[#A09080]"
              />
            </div>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Street address"
              required
              className="w-full mt-3 px-4 py-3 bg-[#FDF8F3] border border-[#E8DFD5] rounded-xl focus:outline-none focus:border-[#C4A265] text-sm text-[#2D2A26] placeholder:text-[#A09080]"
            />
            <div className="grid grid-cols-2 gap-3 mt-3">
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                required
                className="px-4 py-3 bg-[#FDF8F3] border border-[#E8DFD5] rounded-xl focus:outline-none focus:border-[#C4A265] text-sm text-[#2D2A26] placeholder:text-[#A09080]"
              />
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                placeholder="ZIP code"
                required
                className="px-4 py-3 bg-[#FDF8F3] border border-[#E8DFD5] rounded-xl focus:outline-none focus:border-[#C4A265] text-sm text-[#2D2A26] placeholder:text-[#A09080]"
              />
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard size={18} className="text-[#C4A265]" />
              <h3 className="text-lg font-medium text-[#2D2A26]">Payment Details</h3>
            </div>
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              placeholder="Card number"
              required
              className="w-full px-4 py-3 bg-[#FDF8F3] border border-[#E8DFD5] rounded-xl focus:outline-none focus:border-[#C4A265] text-sm text-[#2D2A26] placeholder:text-[#A09080]"
            />
            <div className="grid grid-cols-2 gap-3 mt-3">
              <input
                type="text"
                name="expiry"
                value={formData.expiry}
                onChange={handleChange}
                placeholder="MM/YY"
                required
                className="px-4 py-3 bg-[#FDF8F3] border border-[#E8DFD5] rounded-xl focus:outline-none focus:border-[#C4A265] text-sm text-[#2D2A26] placeholder:text-[#A09080]"
              />
              <input
                type="text"
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                placeholder="CVV"
                required
                className="px-4 py-3 bg-[#FDF8F3] border border-[#E8DFD5] rounded-xl focus:outline-none focus:border-[#C4A265] text-sm text-[#2D2A26] placeholder:text-[#A09080]"
              />
            </div>
            <div className="flex items-center gap-2 mt-4 text-xs text-[#A09080]">
              <Lock size={12} />
              <span>Your payment information is encrypted and secure</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#2D2A26] text-white py-4 rounded-full font-medium hover:bg-[#C4A265] transition-colors text-lg"
          >
            Place Order — ${total}
          </button>
        </form>

        {/* Order Summary */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE] sticky top-24">
            <h3 className="text-lg font-medium text-[#2D2A26] mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-14 h-14 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#2D2A26] truncate">{item.product.name}</p>
                    <p className="text-xs text-[#A09080]">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-medium text-[#2D2A26]">
                    ${item.product.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-[#E8DFD5] pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#5C4A32]">Subtotal</span>
                <span className="text-[#2D2A26]">${subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#5C4A32]">Shipping</span>
                <span className="text-[#2D2A26]">
                  {shipping === 0 ? <span className="text-green-600">Free</span> : `$${shipping}`}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#E8DFD5]">
                <span className="font-medium text-[#2D2A26]">Total</span>
                <span className="text-lg font-semibold text-[#2D2A26]">${total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
