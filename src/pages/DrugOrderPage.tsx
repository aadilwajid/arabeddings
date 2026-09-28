import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, CheckCircle } from 'lucide-react';
import { useStore } from '../store';
import { DrugOrder } from '../types';

export default function DrugOrderPage() {
  const navigate = useNavigate();
  const { addDrugOrder, drugOrders, user } = useStore();
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    itemType: '',
    size: '',
    quantity: 1,
    fabric: '',
    color: '',
    deliveryAddress: '',
    notes: '',
  });

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.fullName.trim()) errs.fullName = 'Required';
    if (!form.email.trim() || !form.email.includes('@')) errs.email = 'Valid email required';
    if (!form.phone.trim()) errs.phone = 'Required';
    if (!form.itemType) errs.itemType = 'Required';
    if (form.quantity < 1) errs.quantity = 'Min quantity is 1';
    if (!form.deliveryAddress.trim()) errs.deliveryAddress = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const reference = `ARA-DR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`;
    const drugOrder: DrugOrder = {
      id: `do-${Date.now()}`,
      reference,
      userId: user?.id,
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      itemType: form.itemType,
      size: form.size || undefined,
      quantity: form.quantity,
      fabric: form.fabric || undefined,
      color: form.color || undefined,
      deliveryAddress: form.deliveryAddress,
      notes: form.notes || undefined,
      status: 'SUBMITTED',
      createdAt: new Date().toISOString(),
    };

    addDrugOrder(drugOrder);
    setSubmitted(reference);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
        <h1 className="text-3xl font-bold text-gray-900">Request Submitted!</h1>
        <p className="mt-4 text-gray-600">Your custom order request has been received. Our team will review it and get back to you within 24-48 hours.</p>
        <p className="mt-4 text-lg font-mono font-bold text-indigo-600">Reference: {submitted}</p>
        <p className="mt-2 text-sm text-gray-500">Save this reference to track your request status.</p>
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <button onClick={() => navigate(`/drug-order/${submitted}`)} className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Track Status</button>
          <button onClick={() => { setSubmitted(null); setForm({ fullName: '', email: '', phone: '', itemType: '', size: '', quantity: 1, fabric: '', color: '', deliveryAddress: '', notes: '' }); }} className="px-6 py-3 border text-gray-700 rounded-lg hover:bg-gray-50">Submit Another</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Custom / Special Order</h1>
        <p className="mt-2 text-gray-600">Need custom sizes, bulk orders, or specialty bedding? Fill out the form below and our team will provide a personalized quote.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 space-y-6">
        {/* Contact Info */}
        <div>
          <h2 className="font-semibold text-gray-900 mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input type="text" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})}
                className={`w-full border rounded-lg px-3 py-2 ${errors.fullName ? 'border-red-300' : ''}`} />
              {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                className={`w-full border rounded-lg px-3 py-2 ${errors.email ? 'border-red-300' : ''}`} />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                className={`w-full border rounded-lg px-3 py-2 ${errors.phone ? 'border-red-300' : ''}`} />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div>
          <h2 className="font-semibold text-gray-900 mb-4">Order Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Item Type *</label>
              <select value={form.itemType} onChange={e => setForm({...form, itemType: e.target.value})}
                className={`w-full border rounded-lg px-3 py-2 ${errors.itemType ? 'border-red-300' : ''}`}>
                <option value="">Select type...</option>
                <option value="Custom Sheets">Custom Sheets</option>
                <option value="Custom Duvet Cover">Custom Duvet Cover</option>
                <option value="Bulk Hotel Order">Bulk Hotel Order</option>
                <option value="Made-to-Measure">Made-to-Measure</option>
                <option value="Specialty Fabric">Specialty Fabric Request</option>
                <option value="Other">Other</option>
              </select>
              {errors.itemType && <p className="text-xs text-red-500 mt-1">{errors.itemType}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Size (if custom)</label>
              <input type="text" value={form.size} onChange={e => setForm({...form, size: e.target.value})} placeholder="e.g., Olympic Queen, 60x84 inches" className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
              <input type="number" min="1" value={form.quantity} onChange={e => setForm({...form, quantity: parseInt(e.target.value) || 1})}
                className={`w-full border rounded-lg px-3 py-2 ${errors.quantity ? 'border-red-300' : ''}`} />
              {errors.quantity && <p className="text-xs text-red-500 mt-1">{errors.quantity}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fabric Preference</label>
              <input type="text" value={form.fabric} onChange={e => setForm({...form, fabric: e.target.value})} placeholder="e.g., Egyptian Cotton 800TC" className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color Preference</label>
              <input type="text" value={form.color} onChange={e => setForm({...form, color: e.target.value})} placeholder="e.g., White, Navy Blue" className="w-full border rounded-lg px-3 py-2" />
            </div>
          </div>
        </div>

        {/* Delivery */}
        <div>
          <h2 className="font-semibold text-gray-900 mb-4">Delivery</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address *</label>
            <textarea value={form.deliveryAddress} onChange={e => setForm({...form, deliveryAddress: e.target.value})} rows={3}
              className={`w-full border rounded-lg px-3 py-2 ${errors.deliveryAddress ? 'border-red-300' : ''}`} placeholder="Full delivery address" />
            {errors.deliveryAddress && <p className="text-xs text-red-500 mt-1">{errors.deliveryAddress}</p>}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
          <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={4} className="w-full border rounded-lg px-3 py-2" placeholder="Any special requirements, deadlines, or additional details..." />
        </div>

        <button type="submit" className="w-full flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700">
          <Send size={18} className="mr-2" /> Submit Custom Order Request
        </button>
      </form>

      {/* Previous Drug Orders */}
      {drugOrders.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Custom Orders</h2>
          <div className="space-y-3">
            {drugOrders.map(order => (
              <div key={order.id} className="bg-white rounded-lg border p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{order.itemType}</p>
                  <p className="text-sm text-gray-500">Ref: {order.reference} • Qty: {order.quantity}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    order.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'UNDER_REVIEW' ? 'bg-yellow-100 text-yellow-700' :
                    order.status === 'QUOTED' ? 'bg-purple-100 text-purple-700' :
                    order.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                    order.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>{order.status}</span>
                  <button onClick={() => navigate(`/drug-order/${order.reference}`)} className="text-indigo-600 text-sm hover:underline">View</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
