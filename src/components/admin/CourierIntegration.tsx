'use client';

import { useState, useEffect } from 'react';
import { Truck, Package, MapPin, Phone, CheckCircle } from 'lucide-react';
import { Order } from '@/types';

interface Courier {
  id: string;
  name: string;
  trackingUrl: string;
  apiEndpoint?: string;
}

const COURIERS: Courier[] = [
  { id: 'tcs', name: 'TCS', trackingUrl: 'https://www.tcsexpress.com/trackResult.php?cn=' },
  { id: 'leopard', name: 'Leopard Courier', trackingUrl: 'https://www.leopardscod.com/track/your-tracking-id/' },
  { id: 'pakistan-post', name: 'Pakistan Post', trackingUrl: 'https://www.pakpost.gov.pk/track.php?track=' },
  { id: 'callcourier', name: 'Call Courier', trackingUrl: 'https://callcourier.com.pk/track/' },
];

interface CourierIntegrationProps {
  orderId: string;
  onUpdate: (courier: string, trackingNumber: string) => void;
}

export default function CourierIntegration({ orderId, onUpdate }: CourierIntegrationProps) {
  const [selectedCourier, setSelectedCourier] = useState<string>('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!selectedCourier || !trackingNumber) return;

    setSaving(true);
    try {
      onUpdate(selectedCourier, trackingNumber);
      alert('Courier information saved successfully!');
      setSelectedCourier('');
      setTrackingNumber('');
    } catch (error) {
      alert('Failed to save courier information');
    } finally {
      setSaving(false);
    }
  };

  const generateTrackingLink = (courierId: string, trackingNum: string) => {
    const courier = COURIERS.find(c => c.id === courierId);
    if (!courier) return '#';
    return `${courier.trackingUrl}${trackingNum}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-[#F0E8DE] p-6">
      <div className="flex items-center gap-2 mb-6">
        <Truck size={20} className="text-[#C4A265]" />
        <h3 className="text-lg font-medium text-[#2D2A26]">Courier Integration</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#5C4A32] mb-2">Select Courier</label>
          <select
            value={selectedCourier}
            onChange={(e) => setSelectedCourier(e.target.value)}
            className="w-full px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]"
          >
            <option value="">Choose a courier...</option>
            {COURIERS.map(courier => (
              <option key={courier.id} value={courier.id}>{courier.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#5C4A32] mb-2">Tracking Number</label>
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="Enter tracking number"
            className="w-full px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving || !selectedCourier || !trackingNumber}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#C4A265] text-white rounded-lg hover:bg-[#D4B275] disabled:opacity-50 font-medium"
        >
          <CheckCircle size={16} />
          {saving ? 'Saving...' : 'Save Courier Info'}
        </button>

        {selectedCourier && trackingNumber && (
          <div className="p-3 bg-[#FDF8F3] rounded-lg">
            <p className="text-xs text-[#A09080] mb-2">Tracking Link Preview:</p>
            <a
              href={generateTrackingLink(selectedCourier, trackingNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#C4A265] hover:underline break-all"
            >
              {generateTrackingLink(selectedCourier, trackingNumber)}
            </a>
          </div>
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-[#E8DFD5]">
        <p className="text-xs text-[#A09080] mb-3">Supported Couriers:</p>
        <div className="grid grid-cols-2 gap-2">
          {COURIERS.map(courier => (
            <div key={courier.id} className="flex items-center gap-2 text-xs text-[#5C4A32]">
              <Package size={14} className="text-[#C4A265]" />
              {courier.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
