import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, CreditCard, Truck } from 'lucide-react';
import { useStore } from '../store';
import { formatPKR } from '../data/pakistan';

export default function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders, settings } = useStore();
  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Order not found</h1>
        <Link to="/" className="mt-4 text-indigo-600 hover:underline">← Go home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
          <CheckCircle className="text-green-600 dark:text-green-400" size={32} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Order Placed Successfully!</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Thank you for your order. We've received your order and will process it shortly.</p>
        <p className="mt-1 text-lg font-mono font-bold text-amber-600 dark:text-amber-400">{order.orderNumber}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Order Details</h2>
        <div className="space-y-3">
          {order.items.map(item => (
            <div key={item.id} className="flex justify-between text-sm">
              <div>
                <span className="font-medium">{item.productName}</span>
                <span className="text-gray-500 ml-2">({item.variantName})</span>
                <span className="text-gray-400 ml-2">× {item.quantity}</span>
              </div>
              <span className="font-medium">{formatPKR(item.total)}</span>
            </div>
          ))}
        </div>
        <div className="border-t dark:border-gray-700 mt-4 pt-4 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Subtotal</span><span className="text-gray-900 dark:text-white">{formatPKR(order.subtotal)}</span></div>
          <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Shipping</span><span className="text-gray-900 dark:text-white">{order.shippingFee === 0 ? 'FREE' : formatPKR(order.shippingFee)}</span></div>
          <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Tax</span><span className="text-gray-900 dark:text-white">{formatPKR(order.taxAmount)}</span></div>
          <div className="border-t dark:border-gray-700 pt-2 flex justify-between"><span className="font-bold text-gray-900 dark:text-white">Total</span><span className="text-xl font-bold text-gray-900 dark:text-white">{formatPKR(order.total)}</span></div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Package size={18} className="text-amber-600 dark:text-amber-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Shipping Address</h3>
          </div>
          <p className="text-sm text-gray-600">
            {order.shippingAddress.fullName}<br />
            {order.shippingAddress.line1}<br />
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <CreditCard size={18} className="text-amber-600 dark:text-amber-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Payment</h3>
          </div>
          <p className="text-sm text-gray-600">
            {order.payment.method === 'COD' ? '💵 Cash on Delivery' : '🏦 Bank Transfer'}
            {order.payment.reference && <><br />Reference: {order.payment.reference}</>}
          </p>
          {order.payment.method === 'BANK_TRANSFER' && order.payment.status === 'AWAITING_VERIFICATION' && (
            <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-800">⏳ Awaiting payment verification. Please complete the bank transfer with the reference above.</p>
              <details className="mt-2">
                <summary className="text-sm font-medium text-amber-900 cursor-pointer">View Bank Details</summary>
                <pre className="mt-2 text-xs text-amber-900 whitespace-pre-wrap">{settings.bankTransferDetails}</pre>
              </details>
            </div>
          )}
        </div>
      </div>

      {/* Order Status Timeline */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6 mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Truck size={18} className="text-amber-600 dark:text-amber-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Order Status</h3>
        </div>
        <div className="space-y-3">
          {order.statusHistory.map((h, i) => (
            <div key={h.id} className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${i === order.statusHistory.length - 1 ? 'bg-amber-500' : 'bg-green-400'}`} />
              <div>
                <span className="text-sm font-medium text-gray-900">{h.status}</span>
                <span className="text-xs text-gray-500 ml-2">{new Date(h.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        <Link to="/account/orders" className="px-6 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700">View My Orders</Link>
        <Link to="/products" className="px-6 py-3 border dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">Continue Shopping</Link>
      </div>
    </div>
  );
}
