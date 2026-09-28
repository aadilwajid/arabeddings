import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Package, Truck, CheckCircle, Clock, MapPin, Phone, Mail, XCircle } from 'lucide-react';
import { useStore } from '../store';
import { formatPKR } from '../data/pakistan';

export default function TrackOrderPage() {
  const navigate = useNavigate();
  const { orders } = useStore();
  const [orderNumber, setOrderNumber] = useState('');
  const [foundOrder, setFoundOrder] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setNotFound(false);
    setFoundOrder(null);

    const order = orders.find(o => o.orderNumber.toLowerCase() === orderNumber.toLowerCase().trim());
    
    if (order) {
      setFoundOrder(order);
    } else {
      setNotFound(true);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock size={20} className="text-yellow-600" />;
      case 'CONFIRMED': return <CheckCircle size={20} className="text-blue-600" />;
      case 'PROCESSING': return <Package size={20} className="text-purple-600" />;
      case 'SHIPPED': return <Truck size={20} className="text-cyan-600" />;
      case 'DELIVERED': return <CheckCircle size={20} className="text-green-600" />;
      case 'CANCELLED': return <XCircle size={20} className="text-red-600" />;
      default: return <Clock size={20} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PROCESSING': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'SHIPPED': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'DELIVERED': return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Track Your Order</h1>
        <p className="text-gray-600 dark:text-gray-400">Enter your order number to see the latest status</p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleTrack} className="max-w-xl mx-auto mb-8">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Enter order number (e.g., ARA-2024-001)"
              className="w-full pl-10 pr-4 py-3 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
          >
            Track
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          You can find your order number in the confirmation email
        </p>
      </form>

      {/* Not Found */}
      {notFound && (
        <div className="max-w-xl mx-auto bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <Package className="mx-auto text-red-500 mb-3" size={48} />
          <h3 className="text-lg font-semibold text-red-900 dark:text-red-300 mb-2">Order Not Found</h3>
          <p className="text-sm text-red-700 dark:text-red-400 mb-4">
            We couldn't find an order with that number. Please check and try again.
          </p>
          <p className="text-xs text-red-600 dark:text-red-400">
            Tip: Order numbers look like ARA-2024-001
          </p>
        </div>
      )}

      {/* Order Details */}
      {foundOrder && (
        <div className="space-y-6">
          {/* Order Header */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {foundOrder.orderNumber}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Placed on {new Date(foundOrder.createdAt).toLocaleDateString('en-PK', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className={`px-4 py-2 rounded-lg border ${getStatusColor(foundOrder.status)} flex items-center gap-2`}>
                {getStatusIcon(foundOrder.status)}
                <span className="font-semibold">{foundOrder.status}</span>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Order Progress</h3>
              <div className="relative">
                {['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map((status, index) => {
                  const isActive = foundOrder.statusHistory.some((h: any) => h.status === status);
                  const isCurrent = foundOrder.status === status;
                  
                  return (
                    <div key={status} className="flex items-start gap-4 mb-4 last:mb-0">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isActive 
                            ? isCurrent 
                              ? 'bg-amber-600 text-white' 
                              : 'bg-green-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                        }`}>
                          {isActive ? <CheckCircle size={16} /> : <Clock size={16} />}
                        </div>
                        {index < 4 && (
                          <div className={`w-0.5 h-8 ${isActive ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                        )}
                      </div>
                      <div className="flex-1 pt-1">
                        <p className={`font-medium ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>
                          {status}
                        </p>
                        {isActive && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {new Date(foundOrder.statusHistory.find((h: any) => h.status === status)?.createdAt || '').toLocaleString('en-PK')}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Items</h3>
            <div className="space-y-3">
              {foundOrder.items.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4 pb-3 border-b dark:border-gray-700 last:border-0 last:pb-0">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <Package className="text-gray-400" size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{item.productName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.variantName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">{formatPKR(item.total)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-6 pt-4 border-t dark:border-gray-700 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="text-gray-900 dark:text-white">{formatPKR(foundOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                <span className="text-gray-900 dark:text-white">
                  {foundOrder.shippingFee === 0 ? 'FREE' : formatPKR(foundOrder.shippingFee)}
                </span>
              </div>
              {foundOrder.discountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Discount</span>
                  <span className="text-green-600 dark:text-green-400">-{formatPKR(foundOrder.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-semibold pt-2 border-t dark:border-gray-700">
                <span className="text-gray-900 dark:text-white">Total</span>
                <span className="text-amber-600 dark:text-amber-400">{formatPKR(foundOrder.total)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Shipping Address</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{foundOrder.shippingAddress.fullName}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {foundOrder.shippingAddress.line1}
                    {foundOrder.shippingAddress.line2 && `, ${foundOrder.shippingAddress.line2}`}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {foundOrder.shippingAddress.city}, {foundOrder.shippingAddress.state} {foundOrder.shippingAddress.postalCode}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400">{foundOrder.shippingAddress.phone}</p>
              </div>
              {foundOrder.shippingAddress.email && (
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-gray-400" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">{foundOrder.shippingAddress.email}</p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Payment Method</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {foundOrder.payment.method === 'COD' ? 'Cash on Delivery' : 'Bank Transfer'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Payment Status</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  foundOrder.payment.status === 'VERIFIED' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : foundOrder.payment.status === 'PENDING'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                }`}>
                  {foundOrder.payment.status}
                </span>
              </div>
            </div>
          </div>

          {/* Need Help */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-300 mb-2">Need Help?</h3>
            <p className="text-sm text-amber-800 dark:text-amber-400 mb-4">
              If you have any questions about your order, our customer service team is here to help.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => navigate('/contact')}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
              >
                Contact Support
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 border border-amber-600 text-amber-600 dark:text-amber-400 dark:border-amber-400 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors text-sm font-medium"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
