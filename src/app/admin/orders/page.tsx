'use client';

import { useState, useEffect } from 'react';
import { Order, OrderStatus } from '@/types';
import { Eye, MessageCircle, FileText, Copy, X, AlertCircle } from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/orders');
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    await fetch('/api/orders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: orderId, status })
    });
    fetchOrders();
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status });
    }
  };

  const filteredOrders = orders.filter(order => {
    if (statusFilter !== 'all' && order.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return order.orderNumber.toLowerCase().includes(q) || order.customer.name.toLowerCase().includes(q);
    }
    return true;
  });

  const getStatusColor = (status: OrderStatus) => {
    const colors: Record<OrderStatus, string> = {
      new: 'bg-blue-100 text-blue-700',
      confirmed: 'bg-purple-100 text-purple-700',
      processing: 'bg-yellow-100 text-yellow-700',
      shipped: 'bg-indigo-100 text-indigo-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return colors[status];
  };

  const sendWhatsApp = (order: Order) => {
    const message = `Hi ${order.customer.name}! Your order #${order.orderNumber} is ${order.status}. Total: Rs ${order.total.toLocaleString()}. Thank you for shopping with ARA Beddings!`;
    const phone = order.customer.phone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/92${phone.slice(-10)}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const copyInvoiceText = (order: Order) => {
    const text = `
ARA BEDDINGS - INVOICE
=====================
Order #: ${order.orderNumber}
Date: ${new Date(order.createdAt).toLocaleDateString()}

Customer: ${order.customer.name}
Email: ${order.customer.email}
Phone: ${order.customer.phone}
Address: ${order.customer.address}, ${order.customer.city} ${order.customer.postalCode}

ITEMS:
${order.items.map(item => `- ${item.productName} (${item.size}, ${item.type}) x${item.quantity} = Rs ${(item.price * item.quantity).toLocaleString()}`).join('\n')}

Subtotal: Rs ${order.subtotal.toLocaleString()}
Shipping: Rs ${order.shipping.toLocaleString()}
TOTAL: Rs ${order.total.toLocaleString()}

Payment Method: ${order.paymentMethod.toUpperCase()}
Status: ${order.status}
    `.trim();
    navigator.clipboard.writeText(text);
    alert('Invoice text copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-serif text-[#2D2A26]">Orders</h2>
        <div className="bg-white rounded-2xl border border-[#F0E8DE] p-8">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-[#F5EDE4] rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="text-red-500" size={24} />
          <div>
            <h3 className="font-medium text-red-800">Error Loading Orders</h3>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
        <button 
          onClick={fetchOrders}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-serif text-[#2D2A26]">Orders</h2>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search orders..." className="px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]" />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]">
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-[#F0E8DE] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#F5EDE4]">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-medium text-[#5C4A32]">Order #</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-[#5C4A32]">Customer</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-[#5C4A32]">Total</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-[#5C4A32]">Status</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-[#5C4A32]">Date</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-[#5C4A32]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id} className="border-t border-[#F0E8DE] hover:bg-[#FDF8F3]">
                <td className="px-6 py-4 text-sm font-medium text-[#2D2A26]">{order.orderNumber}</td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-[#2D2A26]">{order.customer.name}</p>
                    <p className="text-xs text-[#A09080]">{order.customer.phone}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-[#5C4A32]">Rs {order.total.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-[#5C4A32]">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setSelectedOrder(order)} className="p-2 hover:bg-[#F5EDE4] rounded-lg" title="View">
                      <Eye size={16} />
                    </button>
                    <button onClick={() => sendWhatsApp(order)} className="p-2 hover:bg-green-50 text-green-600 rounded-lg" title="WhatsApp">
                      <MessageCircle size={16} />
                    </button>
                    <button onClick={() => copyInvoiceText(order)} className="p-2 hover:bg-[#F5EDE4] rounded-lg" title="Copy Invoice">
                      <Copy size={16} />
                    </button>
                    <a href={`/invoice/${order.id}`} target="_blank" className="p-2 hover:bg-[#F5EDE4] rounded-lg" title="Invoice">
                      <FileText size={16} />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-[#A09080]">No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onUpdateStatus={updateStatus} />
      )}
    </div>
  );
}

function OrderDetailModal({ order, onClose, onUpdateStatus }: { order: Order; onClose: () => void; onUpdateStatus: (id: string, status: OrderStatus) => void }) {
  const statuses: OrderStatus[] = ['new', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-[#E8DFD5] px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-serif text-[#2D2A26]">Order #{order.orderNumber}</h3>
          <button onClick={onClose} className="p-2 hover:bg-[#F5EDE4] rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer Info */}
          <div>
            <h4 className="text-sm font-medium text-[#5C4A32] mb-3">Customer Information</h4>
            <div className="bg-[#FDF8F3] rounded-lg p-4 space-y-2">
              <p className="text-sm"><span className="font-medium">Name:</span> {order.customer.name}</p>
              <p className="text-sm"><span className="font-medium">Email:</span> {order.customer.email}</p>
              <p className="text-sm"><span className="font-medium">Phone:</span> {order.customer.phone}</p>
              <p className="text-sm"><span className="font-medium">Address:</span> {order.customer.address}, {order.customer.city} {order.customer.postalCode}</p>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h4 className="text-sm font-medium text-[#5C4A32] mb-3">Order Items</h4>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-3 bg-[#FDF8F3] rounded-lg p-3">
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

          {/* Totals */}
          <div className="bg-[#FDF8F3] rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>Rs {order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>Rs {order.shipping.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg pt-2 border-t border-[#E8DFD5]">
              <span>Total</span>
              <span>Rs {order.total.toLocaleString()}</span>
            </div>
          </div>

          {/* Payment Info */}
          <div>
            <h4 className="text-sm font-medium text-[#5C4A32] mb-3">Payment Information</h4>
            <div className="bg-[#FDF8F3] rounded-lg p-4 space-y-2">
              <p className="text-sm"><span className="font-medium">Method:</span> {order.paymentMethod.toUpperCase()}</p>
              {order.paymentProof && <p className="text-sm"><span className="font-medium">Payment Proof:</span> {order.paymentProof}</p>}
            </div>
          </div>

          {/* Status Update */}
          <div>
            <h4 className="text-sm font-medium text-[#5C4A32] mb-3">Update Status</h4>
            <div className="flex flex-wrap gap-2">
              {statuses.map(status => (
                <button
                  key={status}
                  onClick={() => onUpdateStatus(order.id, status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    order.status === status ? 'bg-[#C4A265] text-white' : 'bg-[#F5EDE4] text-[#5C4A32] hover:bg-[#E8DFD5]'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Status History */}
          <div>
            <h4 className="text-sm font-medium text-[#5C4A32] mb-3">Status History</h4>
            <div className="space-y-2">
              {order.statusHistory.map((update, index) => (
                <div key={index} className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-[#C4A265]" />
                  <span className="font-medium">{update.status}</span>
                  <span className="text-[#A09080]">{new Date(update.timestamp).toLocaleString()}</span>
                  {update.note && <span className="text-[#5C4A32]">- {update.note}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
