'use client';

import { useState, useEffect } from 'react';
import { SiteSettings } from '@/types';
import { Save } from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    const res = await fetch('/api/settings');
    const data = await res.json();
    setSettings(data);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!settings) return <div className="text-center py-12">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-serif text-[#2D2A26]">Site Settings</h2>
        <button onClick={handleSave} className="bg-[#C4A265] text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-[#D4B275]">
          <Save size={18} /> {saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* General */}
        <div className="bg-white rounded-2xl border border-[#F0E8DE] p-6">
          <h3 className="text-lg font-medium text-[#2D2A26] mb-4">General</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#5C4A32] mb-2">Site Name</label>
              <input type="text" value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} className="w-full px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5C4A32] mb-2">Logo URL</label>
              <input type="url" value={settings.logo} onChange={(e) => setSettings({ ...settings, logo: e.target.value })} className="w-full px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5C4A32] mb-2">Favicon URL</label>
              <input type="url" value={settings.favicon} onChange={(e) => setSettings({ ...settings, favicon: e.target.value })} className="w-full px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]" />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-2xl border border-[#F0E8DE] p-6">
          <h3 className="text-lg font-medium text-[#2D2A26] mb-4">Contact & Payment</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#5C4A32] mb-2">WhatsApp Number</label>
              <input type="text" value={settings.whatsapp} onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })} className="w-full px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5C4A32] mb-2">JazzCash Number</label>
              <input type="text" value={settings.jazzcash} onChange={(e) => setSettings({ ...settings, jazzcash: e.target.value })} className="w-full px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5C4A32] mb-2">Easypaisa Number</label>
              <input type="text" value={settings.easypaisa} onChange={(e) => setSettings({ ...settings, easypaisa: e.target.value })} className="w-full px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]" />
            </div>
          </div>
        </div>

        {/* Shipping */}
        <div className="bg-white rounded-2xl border border-[#F0E8DE] p-6">
          <h3 className="text-lg font-medium text-[#2D2A26] mb-4">Shipping</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#5C4A32] mb-2">Flat Shipping Fee (Rs)</label>
              <input type="number" value={settings.shippingFee} onChange={(e) => setSettings({ ...settings, shippingFee: Number(e.target.value) })} className="w-full px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5C4A32] mb-2">Free Shipping Threshold (Rs)</label>
              <input type="number" value={settings.freeShippingThreshold || ''} onChange={(e) => setSettings({ ...settings, freeShippingThreshold: e.target.value ? Number(e.target.value) : undefined })} className="w-full px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]" placeholder="Leave empty for no free shipping" />
            </div>
          </div>
        </div>

        {/* Hero */}
        <div className="bg-white rounded-2xl border border-[#F0E8DE] p-6">
          <h3 className="text-lg font-medium text-[#2D2A26] mb-4">Homepage Hero</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#5C4A32] mb-2">Hero Title</label>
              <input type="text" value={settings.heroTitle} onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })} className="w-full px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5C4A32] mb-2">Hero Subtitle</label>
              <input type="text" value={settings.heroSubtitle} onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })} className="w-full px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5C4A32] mb-2">Hero Image URL</label>
              <input type="url" value={settings.heroImage} onChange={(e) => setSettings({ ...settings, heroImage: e.target.value })} className="w-full px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]" />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
