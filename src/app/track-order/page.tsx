'use client';

import { useState, useEffect } from 'react';
import { Order, OrderStatus } from '@/types';
import { Search, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('wishlist');
    if (saved) setWishlistCount(JSON.parse(saved).length);
  }, []);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setOrder(null);
    setLoading(true);

    try {
      const res = await fetch('/api/orders');
      const orders = await res.json();
      const found = orders.find((o: Order) => o.orderNumber.toLowerCase() === orderNumber.toLowerCase());
      
      if (found) {
        setOrder(found);
      } else {
        setError('Order not found. Please check your order number.');
      }
    } catch (err) {
      setError('Error tracking order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    const icons: Record<OrderStatus, any> = {
      new: Package,
      confirmed: Package,
      processing: Package,
      shipped: Truck,
      delivered: CheckCircle,
      cancelled: XCircle
    };
    return icons[status];
  };

  const getStatusColor = (status: OrderStatus) => {
    const colors: Record<OrderStatus, string> = {
      new: 'bg-blue-500',
      confirmed: 'bg-purple-500',
      processing: 'bg-yellow-500',
      shipped: 'bg-indigo-500',
      delivered: 'bg-green-500',
      cancelled: 'bg-red-500'
    };
    return colors[status];
  };

  const statusOrder: OrderStatus[] = ['new', 'confirmed', 'processing', 'shipped', 'delivered'];

  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      <Header />
      
      <div className="py-16">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-serif text-[#2D2A26] mb-4">Track Your Order</h1>
            <p className="text-[#5C4A32]">Enter your order number to check the status</p>
          </div>

        {/* Search Form */}
        <form onSubmit={handleTrack} className="bg-white rounded-2xl border border-[#F0E8DE] p-6 mb-8">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A09080]" />
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="Enter order number (e.g., ARA-123456)"
                className="w-full pl-12 pr-4 py-3 border border-[#E8DFD5] rounded-xl focus:outline-none focus:border-[#C4A265]"
                required
              />
            </div>
            <button type="submit" disabled={loading} className="bg-[#2D2A26] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#C4A265] transition-colors disabled:opacity-50">
              {loading ? 'Searching...' : 'Track'}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        </form>

        {/* Order Details */}
        {order && (
          <div className="bg-white rounded-2xl border border-[#F0E8DE] p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-serif text-[#2D2A26] mb-2">Order #{order.orderNumber}</h2>
              <p className="text-sm text-[#A09080]">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>

            {/* Status Timeline */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-[#5C4A32] uppercase tracking-wider mb-4">Order Status</h3>
              <div className="relative">
                {order.status === 'cancelled' ? (
                  <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
                    <XCircle size={24} className="text-red-500" />
                    <div>
                      <p className="font-medium text-red-700">Order Cancelled</p>
                      <p className="text-sm text-red-600">This order has been cancelled</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {statusOrder.map((status, index) => {
                      const Icon = getStatusIcon(status);
                      const isActive = statusOrder.indexOf(order.status) >= index;
                      const isCurrent = order.status === status;

                      return (
                        <div key={status} className="flex items-start gap-4">
                          <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive ? getStatusColor(status) : 'bg-gray-200'}`}>
                              <Icon size={20} className="text-white" />
                            </div>
                            {index < statusOrder.length - 1 && (
                              <div className={`w-0.5 h-12 ${isActive ? 'bg-[#C4A265]' : 'bg-gray-200'}`} />
                            )}
                          </div>
                          <div className="flex-1 pt-2">
                            <p className={`font-medium capitalize ${isActive ? 'text-[#2D2A26]' : 'text-[#A09080]'}`}>
                              {status}
                              {isCurrent && <span className="ml-2 text-xs bg-[#C4A265] text-white px-2 py-0.5 rounded-full">Current</span>}
                            </p>
                            {isActive && (
                              <p className="text-xs text-[#A09080] mt-1">
                                {order.statusHistory.find(h => h.status === status)?.timestamp && 
                                  new Date(order.statusHistory.find(h => h.status === status)!.timestamp).toLocaleString()
                                }
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="text-sm font-medium text-[#5C4A32] uppercase tracking-wider mb-4">Order Items</h3>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-[#FDF8F3] rounded-lg">
                    <img src={item.image} alt={item.productName} className="w-16 h-16 object-cover rounded-lg" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#2D2A26]">{item.productName}</p>
                      <p className="text-xs text-[#A09080]">{item.size} - {item.type} x{item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-[#2D2A26]">Rs {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="mt-6 pt-6 border-t border-[#E8DFD5]">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-[#C4A265]">Rs {order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-[#5C4A32] mb-2">Need help with your order?</p>
          <a href="https://wa.me/923160143039" target="_blank" rel="noopener noreferrer" className="text-[#C4A265] hover:underline font-medium">
            Contact us on WhatsApp
          </a>
        </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
