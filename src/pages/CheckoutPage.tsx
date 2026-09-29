import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, Banknote, Check, Lock, Truck, MapPin, Package } from 'lucide-react';
import { useStore } from '../store';
import { Order, PaymentMethod } from '../types';
import { pakistanProvinces, getCitiesByProvince, formatPKR } from '../data/pakistan';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart, addOrder, user, settings, shippingZones } = useStore();

  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [bankReference, setBankReference] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('PUNJAB');
  const [availableCities, setAvailableCities] = useState(getCitiesByProvince('PUNJAB'));
  const [address, setAddress] = useState({
    fullName: user?.name || '', phone: user?.phone || '', line1: '', line2: '', city: '', state: 'Punjab', postalCode: '', country: 'PK'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = cartTotal();
  const shipping = subtotal >= settings.freeShippingThreshold ? 0 : 250;
  const total = subtotal + shipping;

  const handleProvinceChange = (code: string) => {
    setSelectedProvince(code);
    const province = pakistanProvinces.find(p => p.code === code);
    setAvailableCities(getCitiesByProvince(code));
    setAddress({ ...address, state: province?.name || '', city: '' });
  };

  const validateAddress = () => {
    const errs: Record<string, string> = {};
    if (!address.fullName.trim()) errs.fullName = 'Name is required';
    if (!address.phone.trim()) errs.phone = 'Phone is required';
    if (!address.line1.trim()) errs.line1 = 'Address is required';
    if (!address.city.trim()) errs.city = 'City is required';
    if (!address.state.trim()) errs.state = 'Province is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === 'BANK_TRANSFER' && !bankReference.trim()) {
      setErrors({ bankReference: 'Payment reference is required for bank transfer' });
      return;
    }

    const orderId = `ord-${Date.now()}`;
    const orderNumber = `ARA-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`;

    const order: Order = {
      id: orderId,
      orderNumber,
      userId: user?.id,
      status: 'PENDING',
      subtotal, shippingFee: shipping, taxAmount: 0, discountAmount: 0, total,
      currency: 'PKR',
      notes: orderNotes,
      items: cart.map(item => ({
        id: `oi-${Date.now()}-${item.id}`,
        productId: item.productId,
        variantId: item.variantId,
        productName: item.product?.name || 'Product',
        variantName: item.variant?.optionValues.map(ov => ov.value).join(' / ') || '',
        sku: item.variant?.sku || '',
        unitPrice: item.variant?.price || 0,
        quantity: item.quantity,
        total: (item.variant?.price || 0) * item.quantity,
      })),
      payment: {
        id: `pay-${Date.now()}`,
        orderId,
        method: paymentMethod,
        status: paymentMethod === 'BANK_TRANSFER' ? 'AWAITING_VERIFICATION' : 'PENDING',
        amount: total,
        reference: paymentMethod === 'BANK_TRANSFER' ? bankReference : undefined,
      },
      shippingAddress: {
        id: `addr-${Date.now()}`,
        userId: user?.id || '',
        fullName: address.fullName,
        phone: address.phone,
        line1: address.line1,
        line2: address.line2,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: 'PK',
        isDefault: true,
      },
      shippingMethod: shippingZones[0]?.methods[0] || { id: 'sm-1', zoneId: 'zone-1', name: 'Standard Delivery', rate: 250, isActive: true },
      statusHistory: [{ id: `sh-${Date.now()}`, status: 'PENDING', createdAt: new Date().toISOString() }],
      createdAt: new Date().toISOString(),
    };

    addOrder(order);
    clearCart();
    navigate(`/checkout/confirmation/${orderId}`);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your cart is empty</h1>
        <Link to="/products" className="mt-4 text-amber-600 dark:text-amber-400 hover:underline">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Checkout</h1>

      {/* Steps */}
      <div className="flex items-center mb-8">
        {['Shipping', 'Payment', 'Review'].map((label, i) => (
          <React.Fragment key={label}>
            <div className={`flex items-center ${step > i + 1 ? 'text-green-600' : step === i + 1 ? 'text-amber-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step > i + 1 ? 'bg-green-100 dark:bg-green-900/30' : step === i + 1 ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-gray-100 dark:bg-gray-700'
              }`}>
                {step > i + 1 ? <Check size={16} /> : i + 1}
              </div>
              <span className="ml-2 text-sm font-medium hidden sm:inline">{label}</span>
            </div>
            {i < 2 && <div className={`flex-1 h-0.5 mx-4 ${step > i + 1 ? 'bg-green-300' : 'bg-gray-200 dark:bg-gray-700'}`} />}
          </React.Fragment>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Step 1: Shipping */}
          {step === 1 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                  <Truck className="text-amber-600 dark:text-amber-400" size={20} />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Shipping Address</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
                  <input type="text" value={address.fullName} onChange={e => setAddress({...address, fullName: e.target.value})}
                    className={`w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 ${errors.fullName ? 'border-red-300' : ''}`} />
                  {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone *</label>
                  <input type="tel" value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} placeholder="+92 3XX XXXXXXX"
                    className={`w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 ${errors.phone ? 'border-red-300' : ''}`} />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <input type="email" value={user?.email || ''} disabled className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-700" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address Line 1 *</label>
                  <input type="text" value={address.line1} onChange={e => setAddress({...address, line1: e.target.value})} placeholder="House/Plot #, Street #"
                    className={`w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 ${errors.line1 ? 'border-red-300' : ''}`} />
                  {errors.line1 && <p className="text-xs text-red-500 mt-1">{errors.line1}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address Line 2</label>
                  <input type="text" value={address.line2} onChange={e => setAddress({...address, line2: e.target.value})} placeholder="Area, Society, Sector"
                    className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Province *</label>
                  <select value={selectedProvince} onChange={e => handleProvinceChange(e.target.value)}
                    className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2">
                    {pakistanProvinces.map(p => (
                      <option key={p.code} value={p.code}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City *</label>
                  <select value={address.city} onChange={e => setAddress({...address, city: e.target.value})}
                    className={`w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 ${errors.city ? 'border-red-300' : ''}`}>
                    <option value="">Select city...</option>
                    {availableCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Order Notes (optional)</label>
                <textarea value={orderNotes} onChange={e => setOrderNotes(e.target.value)} rows={3} className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2" placeholder="Delivery instructions, landmark, etc." />
              </div>
              <button
                onClick={() => { if (validateAddress()) setStep(2); }}
                className="mt-6 px-6 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Method</h2>
              <div className="space-y-4">
                <label className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'}`}>
                  <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="mt-1 accent-amber-600" />
                  <div className="ml-3">
                    <div className="flex items-center"><Banknote size={20} className="text-gray-700 dark:text-gray-300 mr-2" /><span className="font-semibold text-gray-900 dark:text-white">Cash on Delivery (COD)</span></div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Pay when you receive your order. No additional fees.</p>
                  </div>
                </label>
                <label className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'BANK_TRANSFER' ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'}`}>
                  <input type="radio" name="payment" value="BANK_TRANSFER" checked={paymentMethod === 'BANK_TRANSFER'} onChange={() => setPaymentMethod('BANK_TRANSFER')} className="mt-1 accent-amber-600" />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center"><CreditCard size={20} className="text-gray-700 dark:text-gray-300 mr-2" /><span className="font-semibold text-gray-900 dark:text-white">Bank Transfer</span></div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Transfer directly to our bank account. Order will be processed after verification.</p>
                  </div>
                </label>
              </div>

              {paymentMethod === 'BANK_TRANSFER' && (
                <div className="mt-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">Bank Details</h3>
                  <pre className="text-sm text-amber-900 dark:text-amber-200 whitespace-pre-wrap">{settings.bankTransferDetails}</pre>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Reference / Transaction ID *</label>
                    <input
                      type="text"
                      value={bankReference}
                      onChange={e => setBankReference(e.target.value)}
                      placeholder="Enter your transfer reference number"
                      className={`w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 ${errors.bankReference ? 'border-red-300' : ''}`}
                    />
                    {errors.bankReference && <p className="text-xs text-red-500 mt-1">{errors.bankReference}</p>}
                  </div>
                </div>
              )}

              <div className="mt-6 flex space-x-3">
                <button onClick={() => setStep(1)} className="px-6 py-3 border dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Back</button>
                <button onClick={() => setStep(3)} className="px-6 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700">Review Order</button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Review Your Order</h2>

              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Shipping Address</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{address.fullName}<br />{address.line1}{address.line2 && `, ${address.line2}`}<br />{address.city}, {address.state}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Payment</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{paymentMethod === 'COD' ? 'Cash on Delivery' : `Bank Transfer (Ref: ${bankReference})`}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Items ({cart.length})</h3>
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between text-sm py-1">
                      <span className="text-gray-600 dark:text-gray-300">{item.product?.name} x {item.quantity}</span>
                      <span className="font-medium text-gray-900 dark:text-white">{formatPKR((item.variant?.price || 0) * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <button onClick={() => setStep(2)} className="px-6 py-3 border dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Back</button>
                <button onClick={handlePlaceOrder} className="flex-1 px-6 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 flex items-center justify-center">
                  <Lock size={16} className="mr-2" /> Place Order — {formatPKR(total)}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6 h-fit sticky top-24">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400 truncate mr-2">{item.product?.name} x {item.quantity}</span>
                <span className="font-medium text-gray-900 dark:text-white flex-shrink-0">{formatPKR((item.variant?.price || 0) * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t dark:border-gray-700 mt-4 pt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Subtotal</span><span className="text-gray-900 dark:text-white">{formatPKR(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Shipping</span><span className="text-gray-900 dark:text-white">{shipping === 0 ? 'FREE' : formatPKR(shipping)}</span></div>
            <div className="border-t dark:border-gray-700 pt-2 flex justify-between"><span className="font-bold text-gray-900 dark:text-white">Total</span><span className="text-xl font-bold text-gray-900 dark:text-white">{formatPKR(total)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
