'use client';

import { useState } from 'react';
import { Truck, MapPin, DollarSign, Clock, Save } from 'lucide-react';

interface ShippingZone {
  id: string;
  name: string;
  cities: string[];
  flatRate: number;
  estimatedDays: string;
  enabled: boolean;
}

export default function AdminShipping() {
  const [zones, setZones] = useState<ShippingZone[]>([
    {
      id: 'metro',
      name: 'Metro Cities',
      cities: ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi'],
      flatRate: 250,
      estimatedDays: '2-3',
      enabled: true,
    },
    {
      id: 'major',
      name: 'Major Cities',
      cities: ['Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala'],
      flatRate: 350,
      estimatedDays: '3-5',
      enabled: true,
    },
    {
      id: 'other',
      name: 'Other Areas',
      cities: ['All other cities'],
      flatRate: 450,
      estimatedDays: '5-7',
      enabled: true,
    },
  ]);

  const [freeShippingThreshold, setFreeShippingThreshold] = useState(10000);
  const [couriers, setCouriers] = useState([
    { id: 'tcs', name: 'TCS', enabled: true, trackingUrl: 'https://www.tcsexpress.com/trackResult.php?cn=' },
    { id: 'leopard', name: 'Leopard Courier', enabled: true, trackingUrl: 'https://www.leopardscod.com/track/' },
    { id: 'pakistan-post', name: 'Pakistan Post', enabled: false, trackingUrl: 'https://www.pakpost.gov.pk/track.php?track=' },
    { id: 'callcourier', name: 'Call Courier', enabled: false, trackingUrl: 'https://callcourier.com.pk/track/' },
  ]);

  const handleZoneUpdate = (zoneId: string, field: keyof ShippingZone, value: any) => {
    setZones(zones.map(zone => 
      zone.id === zoneId ? { ...zone, [field]: value } : zone
    ));
  };

  const handleCourierToggle = (courierId: string) => {
    setCouriers(couriers.map(courier =>
      courier.id === courierId ? { ...courier, enabled: !courier.enabled } : courier
    ));
  };

  const handleSave = () => {
    // In production, this would save to backend
    alert('Shipping settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-serif text-[#2D2A26]">Shipping Management</h2>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2 bg-[#C4A265] text-white rounded-lg hover:bg-[#D4B275]"
        >
          <Save size={18} />
          Save Changes
        </button>
      </div>

      {/* Free Shipping Threshold */}
      <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
        <h3 className="text-xl font-medium text-[#2D2A26] mb-4 flex items-center gap-2">
          <DollarSign size={24} className="text-[#C4A265]" />
          Free Shipping Threshold
        </h3>
        <div className="flex items-center gap-4">
          <label className="text-sm text-[#5C4A32]">Orders above Rs</label>
          <input
            type="number"
            value={freeShippingThreshold}
            onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
            className="px-4 py-2 border border-[#E8DFD5] rounded-lg w-32 focus:outline-none focus:border-[#C4A265]"
          />
          <span className="text-sm text-[#5C4A32]">get free shipping</span>
        </div>
        <p className="text-xs text-[#A09080] mt-2">
          Set to 0 to disable free shipping
        </p>
      </div>

      {/* Shipping Zones */}
      <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
        <h3 className="text-xl font-medium text-[#2D2A26] mb-4 flex items-center gap-2">
          <MapPin size={24} className="text-[#C4A265]" />
          Shipping Zones
        </h3>
        <div className="space-y-4">
          {zones.map((zone) => (
            <div key={zone.id} className="border border-[#E8DFD5] rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <input
                  type="text"
                  value={zone.name}
                  onChange={(e) => handleZoneUpdate(zone.id, 'name', e.target.value)}
                  className="text-lg font-medium bg-transparent border-none focus:outline-none"
                  style={{ color: 'var(--color-text)' }}
                />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={zone.enabled}
                    onChange={(e) => handleZoneUpdate(zone.id, 'enabled', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-[#5C4A32]">Enabled</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#5C4A32] mb-1">Cities</label>
                  <textarea
                    value={zone.cities.join(', ')}
                    onChange={(e) => handleZoneUpdate(zone.id, 'cities', e.target.value.split(',').map(s => s.trim()))}
                    className="w-full px-3 py-2 border border-[#E8DFD5] rounded-lg text-sm focus:outline-none focus:border-[#C4A265]"
                    rows={2}
                    placeholder="City1, City2, City3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#5C4A32] mb-1">Flat Rate (Rs)</label>
                  <input
                    type="number"
                    value={zone.flatRate}
                    onChange={(e) => handleZoneUpdate(zone.id, 'flatRate', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#E8DFD5] rounded-lg text-sm focus:outline-none focus:border-[#C4A265]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#5C4A32] mb-1">Estimated Days</label>
                  <input
                    type="text"
                    value={zone.estimatedDays}
                    onChange={(e) => handleZoneUpdate(zone.id, 'estimatedDays', e.target.value)}
                    className="w-full px-3 py-2 border border-[#E8DFD5] rounded-lg text-sm focus:outline-none focus:border-[#C4A265]"
                    placeholder="e.g., 2-3"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Courier Integration */}
      <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
        <h3 className="text-xl font-medium text-[#2D2A26] mb-4 flex items-center gap-2">
          <Truck size={24} className="text-[#C4A265]" />
          Courier Integration
        </h3>
        <div className="space-y-3">
          {couriers.map((courier) => (
            <div key={courier.id} className="flex items-center justify-between p-4 border border-[#E8DFD5] rounded-lg">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={courier.enabled}
                  onChange={() => handleCourierToggle(courier.id)}
                  className="w-4 h-4"
                />
                <div>
                  <p className="font-medium text-[#2D2A26]">{courier.name}</p>
                  <p className="text-xs text-[#A09080]">{courier.trackingUrl}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                courier.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {courier.enabled ? 'Active' : 'Inactive'}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-[#A09080] mt-4">
          Enable couriers to automatically generate tracking numbers and update order status
        </p>
      </div>

      {/* Delivery Time Estimates */}
      <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
        <h3 className="text-xl font-medium text-[#2D2A26] mb-4 flex items-center gap-2">
          <Clock size={24} className="text-[#C4A265]" />
          Delivery Time Estimates
        </h3>
        <div className="space-y-2">
          {zones.filter(z => z.enabled).map((zone) => (
            <div key={zone.id} className="flex items-center justify-between p-3 bg-[#FDF8F3] rounded-lg">
              <span className="font-medium text-[#2D2A26]">{zone.name}</span>
              <span className="text-sm text-[#5C4A32]">{zone.estimatedDays} business days</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
