'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CartItem, Order, Customer } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CityDeliveryEstimate from '@/components/CityDeliveryEstimate';
import DiscountCodeInput from '@/components/DiscountCodeInput';
import { GiftWrapping, AddressBook } from '@/components/UIComponents';
import { ArrowLeft, CreditCard } from 'lucide-react';

const CART_KEY = 'ara_cart';

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<Customer>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'jazzcash' | 'easypaisa'>('cod');
  const [paymentProof, setPaymentProof] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [giftWrapping, setGiftWrapping] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');

  useEffect(() => {
    const savedCart = localStorage.getItem(CART_KEY);
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    } else {
      router.push('/cart');
    }
  }, [router]);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 350;
  const giftWrappingCost = giftWrapping ? 200 : 0;
  const finalTotal = cartTotal + shipping - discountAmount + giftWrappingCost;

  const formatPrice = (price: number) => `Rs ${price.toLocaleString()}`;

  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setProcessing(true);

    // Validate form
    if (!customer.name || !customer.email || !customer.phone || !customer.address || !customer.city || !customer.postalCode) {
      setError('Please fill in all required fields');
      setProcessing(false);
      return;
    }

    const order: Order = {
      id: Date.now().toString(),
      orderNumber: `ARA-${Date.now().toString().slice(-6)}`,
      customer,
      items: cart,
      subtotal: cartTotal,
      shipping,
      total: finalTotal,
      status: 'new',
      paymentMethod,
      paymentProof: paymentMethod !== 'cod' ? paymentProof : undefined,
      statusHistory: [{ status: 'new', timestamp: new Date().toISOString() }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      console.log('Submitting order:', order);
      
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });

      console.log('Response status:', res.status);

      if (res.ok) {
        const data = await res.json();
        console.log('Order created successfully:', data);
        
        // Clear cart
        localStorage.removeItem(CART_KEY);
        
        // Show success message
        alert(`Order placed successfully! Your order number is ${order.orderNumber}`);
        
        // Redirect to track order page
        router.push(`/track-order?order=${order.orderNumber}`);
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Order creation failed:', errorData);
        setError(`Failed to place order: ${errorData.error || 'Please try again'}`);
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      setError(`Failed to place order: ${error instanceof Error ? error.message : 'Please try again'}`);
    } finally {
      setProcessing(false);
    }
  };

  const [loading, setLoading] = useState(true);

  if (cart.length === 0 && !loading) {
    router.push('/cart');
    return null;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <Header />
      
      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 mb-6 hover:opacity-70"
            style={{ color: 'var(--color-text)' }}
          >
            <ArrowLeft size={18} />
            Back to Cart
          </button>

          <h1 className="text-3xl font-serif mb-8" style={{ color: 'var(--color-text)' }}>
            Checkout
          </h1>

          <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <div
                className="p-6 rounded-xl"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: 'var(--border)',
                  borderRadius: 'var(--border-radius)'
                }}
              >
                <h2 className="text-lg font-medium mb-4" style={{ color: 'var(--color-text)' }}>
                  Contact Information
                </h2>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    placeholder="Full Name"
                    required
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      border: 'var(--border)',
                      color: 'var(--color-text)'
                    }}
                  />
                  <input
                    type="email"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    placeholder="Email"
                    required
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      border: 'var(--border)',
                      color: 'var(--color-text)'
                    }}
                  />
                  <input
                    type="tel"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    placeholder="Phone Number"
                    required
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      border: 'var(--border)',
                      color: 'var(--color-text)'
                    }}
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div
                className="p-6 rounded-xl"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: 'var(--border)',
                  borderRadius: 'var(--border-radius)'
                }}
              >
                <h2 className="text-lg font-medium mb-4" style={{ color: 'var(--color-text)' }}>
                  Shipping Address
                </h2>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    placeholder="Street Address"
                    required
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      border: 'var(--border)',
                      color: 'var(--color-text)'
                    }}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={customer.city}
                      onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                      placeholder="City"
                      required
                      className="px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                      style={{
                        backgroundColor: 'var(--color-background)',
                        border: 'var(--border)',
                        color: 'var(--color-text)'
                      }}
                    />
                    <input
                      type="text"
                      value={customer.postalCode}
                      onChange={(e) => setCustomer({ ...customer, postalCode: e.target.value })}
                      placeholder="Postal Code"
                      required
                      className="px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                      style={{
                        backgroundColor: 'var(--color-background)',
                        border: 'var(--border)',
                        color: 'var(--color-text)'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* City Delivery Estimate */}
              {customer.city && (
                <CityDeliveryEstimate city={customer.city} onCityChange={(city) => setCustomer({ ...customer, city })} />
              )}

              {/* Discount Code */}
              <DiscountCodeInput
                orderTotal={cartTotal}
                onApply={(discount, code) => {
                  setDiscountAmount(discount);
                  setDiscountCode(code);
                }}
                onRemove={() => {
                  setDiscountAmount(0);
                  setDiscountCode('');
                }}
                appliedCode={discountCode}
                appliedDiscount={discountAmount}
              />

              {/* Address Book */}
              <AddressBook />

              {/* Gift Wrapping */}
              <GiftWrapping onToggle={(enabled, message) => {
                setGiftWrapping(enabled);
                setGiftMessage(message);
              }} />

              {/* Payment Method */}
              <div
                className="p-6 rounded-xl"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: 'var(--border)',
                  borderRadius: 'var(--border-radius)'
                }}
              >
                <h2 className="text-lg font-medium mb-4" style={{ color: 'var(--color-text)' }}>
                  Payment Method
                </h2>
                <div className="space-y-3">
                  {[
                    { value: 'cod', label: 'Cash on Delivery (COD)' },
                    { value: 'jazzcash', label: 'JazzCash (03160143039)' },
                    { value: 'easypaisa', label: 'Easypaisa (03160143039)' }
                  ].map(method => (
                    <label
                      key={method.value}
                      className="flex items-center p-4 rounded-xl cursor-pointer transition-all"
                      style={{
                        border: paymentMethod === method.value ? '2px solid var(--color-primary)' : 'var(--border)',
                        backgroundColor: paymentMethod === method.value ? 'var(--color-background)' : 'transparent'
                      }}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.value}
                        checked={paymentMethod === method.value}
                        onChange={(e) => setPaymentMethod(e.target.value as any)}
                        className="mr-3"
                      />
                      <CreditCard size={20} className="mr-3" style={{ color: 'var(--color-primary)' }} />
                      <span style={{ color: 'var(--color-text)' }}>{method.label}</span>
                    </label>
                  ))}
                </div>

                {paymentMethod !== 'cod' && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                      Payment Proof (Optional)
                    </label>
                    <input
                      type="text"
                      value={paymentProof}
                      onChange={(e) => setPaymentProof(e.target.value)}
                      placeholder="Transaction ID or screenshot URL"
                      className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                      style={{
                        backgroundColor: 'var(--color-background)',
                        border: 'var(--border)',
                        color: 'var(--color-text)'
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Error Display */}
              {error && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={processing}
                className="w-full py-4 rounded-lg font-medium text-lg transition-colors disabled:opacity-50"
                style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
              >
                {processing ? 'Processing...' : `Place Order - ${formatPrice(finalTotal)}`}
              </button>
            </div>

            {/* Right Column - Order Summary */}
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
                <h2 className="text-lg font-medium mb-4" style={{ color: 'var(--color-text)' }}>
                  Order Summary
                </h2>
                <div className="space-y-3 mb-4">
                  {cart.map(item => (
                    <div key={item.variantId} className="flex gap-3">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                          {item.productName}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                          {item.size} - {item.type} x{item.quantity}
                        </p>
                      </div>
                      <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 space-y-2" style={{ borderColor: 'var(--color-border)' }}>
                  <div className="flex justify-between text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    <span>Subtotal</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    <span>Shipping</span>
                    <span>{formatPrice(shipping)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-semibold pt-2 border-t" style={{ color: 'var(--color-text)', borderColor: 'var(--color-border)' }}>
                    <span>Total</span>
                    <span>{formatPrice(finalTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
