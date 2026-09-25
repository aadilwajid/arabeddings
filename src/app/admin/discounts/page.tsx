'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Tag, Copy, Check } from 'lucide-react';

interface DiscountCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  expiresAt: string;
  active: boolean;
  createdAt: string;
}

export default function AdminDiscounts() {
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCode, setEditingCode] = useState<DiscountCode | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    fetchCodes();
  }, []);

  const fetchCodes = async () => {
    const res = await fetch('/api/discounts');
    const data = await res.json();
    setCodes(data);
  };

  const handleSave = async (code: Partial<DiscountCode>) => {
    const method = editingCode ? 'PUT' : 'POST';
    await fetch('/api/discounts', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(code)
    });
    setShowForm(false);
    setEditingCode(null);
    fetchCodes();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this discount code?')) return;
    await fetch('/api/discounts', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    fetchCodes();
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleToggleActive = async (code: DiscountCode) => {
    await fetch('/api/discounts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...code, active: !code.active })
    });
    fetchCodes();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-serif text-[#2D2A26]">Discount Codes</h2>
        <button
          onClick={() => { setEditingCode(null); setShowForm(true); }}
          className="bg-[#C4A265] text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-[#D4B275]"
        >
          <Plus size={18} /> Create Code
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#F0E8DE] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#F5EDE4]">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-medium text-[#5C4A32]">Code</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-[#5C4A32]">Discount</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-[#5C4A32]">Min Order</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-[#5C4A32]">Usage</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-[#5C4A32]">Expires</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-[#5C4A32]">Status</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-[#5C4A32]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {codes.map(code => (
              <tr key={code.id} className="border-t border-[#F0E8DE] hover:bg-[#FDF8F3]">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-sm font-bold text-[#C4A265]">{code.code}</code>
                    <button
                      onClick={() => handleCopy(code.code)}
                      className="p-1 hover:bg-[#F5EDE4] rounded"
                      title="Copy code"
                    >
                      {copiedCode === code.code ? <Check size={14} className="text-green-600" /> : <Copy size={14} className="text-[#A09080]" />}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-[#5C4A32]">
                  {code.type === 'percentage' ? `${code.value}%` : `Rs ${code.value.toLocaleString()}`}
                  {code.maxDiscount && <span className="text-xs text-[#A09080] block">Max: Rs {code.maxDiscount.toLocaleString()}</span>}
                </td>
                <td className="px-6 py-4 text-sm text-[#5C4A32]">Rs {code.minOrder.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-[#5C4A32]">
                  {code.usedCount} / {code.usageLimit}
                </td>
                <td className="px-6 py-4 text-sm text-[#5C4A32]">
                  {new Date(code.expiresAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleToggleActive(code)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      code.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {code.active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setEditingCode(code); setShowForm(true); }}
                      className="p-2 hover:bg-[#F5EDE4] rounded-lg"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(code.id)}
                      className="p-2 hover:bg-red-50 text-red-500 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <DiscountCodeForm
          code={editingCode}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditingCode(null); }}
        />
      )}
    </div>
  );
}

function DiscountCodeForm({ code, onSave, onClose }: { code: DiscountCode | null; onSave: (code: Partial<DiscountCode>) => void; onClose: () => void }) {
  const [formData, setFormData] = useState<Partial<DiscountCode>>(code || {
    code: '',
    type: 'percentage',
    value: 10,
    minOrder: 2000,
    usageLimit: 100,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    active: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="border-b border-[#E8DFD5] px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-serif text-[#2D2A26]">{code ? 'Edit' : 'Create'} Discount Code</h3>
          <button onClick={onClose} className="p-2 hover:bg-[#F5EDE4] rounded-lg"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#5C4A32] mb-2">Code</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              required
              placeholder="e.g., WELCOME10"
              className="w-full px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265] font-mono"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#5C4A32] mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'percentage' | 'fixed' })}
                className="w-full px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed (Rs)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5C4A32] mb-2">Value</label>
              <input
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                required
                className="w-full px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#5C4A32] mb-2">Min Order (Rs)</label>
              <input
                type="number"
                value={formData.minOrder}
                onChange={(e) => setFormData({ ...formData, minOrder: Number(e.target.value) })}
                required
                className="w-full px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5C4A32] mb-2">Usage Limit</label>
              <input
                type="number"
                value={formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                required
                className="w-full px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5C4A32] mb-2">Expiry Date</label>
            <input
              type="date"
              value={formData.expiresAt?.split('T')[0]}
              onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
              required
              className="w-full px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]"
            />
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm text-[#5C4A32]">Active</span>
          </label>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 border border-[#E8DFD5] rounded-lg">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-[#C4A265] text-white rounded-lg hover:bg-[#D4B275]">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
