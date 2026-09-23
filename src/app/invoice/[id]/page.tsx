'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Order } from '@/types';
import { Printer } from 'lucide-react';

export default function InvoicePage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    const res = await fetch('/api/orders');
    const orders = await res.json();
    const found = orders.find((o: Order) => o.id === params.id);
    setOrder(found || null);
  };

  if (!order) return <div className="text-center py-12">Loading...</div>;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Print button - hidden when printing */}
      <div className="print:hidden fixed top-4 right-4">
        <button onClick={handlePrint} className="bg-[#C4A265] text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-[#D4B275]">
          <Printer size={18} /> Print Invoice
        </button>
      </div>

      {/* Invoice Content */}
      <div className="max-w-4xl mx-auto p-8 md:p-12">
        {/* Header */}
        <div className="flex items-start justify-between mb-12 pb-8 border-b-2 border-[#2D2A26]">
          <div>
            <h1 className="text-3xl font-serif text-[#2D2A26] mb-2">
              ARA <span className="text-[#C4A265]">BEDDINGS</span>
            </h1>
            <p className="text-sm text-[#5C4A32]">Luxury Home Linen & Bedding</p>
            <p className="text-sm text-[#5C4A32]">Pakistan</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-serif text-[#2D2A26] mb-2">INVOICE</h2>
            <p className="text-sm text-[#5C4A32]">Order #: <span className="font-medium">{order.orderNumber}</span></p>
            <p className="text-sm text-[#5C4A32]">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Customer Info */}
        <div className="grid grid-cols-2 gap-8 mb-12">
          <div>
            <h3 className="text-sm font-medium text-[#5C4A32] uppercase tracking-wider mb-3">Bill To</h3>
            <p className="text-[#2D2A26] font-medium">{order.customer.name}</p>
            <p className="text-sm text-[#5C4A32]">{order.customer.email}</p>
            <p className="text-sm text-[#5C4A32]">{order.customer.phone}</p>
            <p className="text-sm text-[#5C4A32] mt-2">{order.customer.address}</p>
            <p className="text-sm text-[#5C4A32]">{order.customer.city} {order.customer.postalCode}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-[#5C4A32] uppercase tracking-wider mb-3">Payment Info</h3>
            <p className="text-sm text-[#5C4A32]">Method: <span className="font-medium">{order.paymentMethod.toUpperCase()}</span></p>
            <p className="text-sm text-[#5C4A32]">Status: <span className="font-medium capitalize">{order.status}</span></p>
            {order.paymentProof && (
              <p className="text-sm text-[#5C4A32] mt-2">Payment Proof: {order.paymentProof}</p>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-12">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-[#E8DFD5]">
                <th className="text-left py-3 text-sm font-medium text-[#5C4A32]">Item</th>
                <th className="text-left py-3 text-sm font-medium text-[#5C4A32]">Details</th>
                <th className="text-center py-3 text-sm font-medium text-[#5C4A32]">Qty</th>
                <th className="text-right py-3 text-sm font-medium text-[#5C4A32]">Price</th>
                <th className="text-right py-3 text-sm font-medium text-[#5C4A32]">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index} className="border-b border-[#F0E8DE]">
                  <td className="py-4">
                    <p className="font-medium text-[#2D2A26]">{item.productName}</p>
                  </td>
                  <td className="py-4">
                    <p className="text-sm text-[#5C4A32]">{item.size} - {item.type}</p>
                  </td>
                  <td className="py-4 text-center text-sm text-[#5C4A32]">{item.quantity}</td>
                  <td className="py-4 text-right text-sm text-[#5C4A32]">Rs {item.price.toLocaleString()}</td>
                  <td className="py-4 text-right font-medium text-[#2D2A26]">Rs {(item.price * item.quantity).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-12">
          <div className="w-64 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[#5C4A32]">Subtotal</span>
              <span className="text-[#2D2A26]">Rs {order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#5C4A32]">Shipping</span>
              <span className="text-[#2D2A26]">Rs {order.shipping.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold pt-3 border-t-2 border-[#2D2A26]">
              <span className="text-[#2D2A26]">Total</span>
              <span className="text-[#2D2A26]">Rs {order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-8 border-t border-[#E8DFD5] text-center">
          <p className="text-sm text-[#5C4A32] mb-2">Thank you for shopping with ARA Beddings!</p>
          <p className="text-xs text-[#A09080]">For any queries, contact us at 03160143039</p>
        </div>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
