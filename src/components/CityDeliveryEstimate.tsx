'use client';

import { Truck, MapPin, Clock } from 'lucide-react';

interface CityInfo {
  name: string;
  estimatedDays: string;
  zone: 'metro' | 'major' | 'other';
}

const CITIES: CityInfo[] = [
  // Metro cities
  { name: 'Lahore', estimatedDays: '2-3', zone: 'metro' },
  { name: 'Karachi', estimatedDays: '2-3', zone: 'metro' },
  { name: 'Islamabad', estimatedDays: '2-3', zone: 'metro' },
  { name: 'Rawalpindi', estimatedDays: '2-3', zone: 'metro' },
  
  // Major cities
  { name: 'Faisalabad', estimatedDays: '3-4', zone: 'major' },
  { name: 'Multan', estimatedDays: '3-4', zone: 'major' },
  { name: 'Peshawar', estimatedDays: '3-5', zone: 'major' },
  { name: 'Quetta', estimatedDays: '4-5', zone: 'major' },
  { name: 'Sialkot', estimatedDays: '3-4', zone: 'major' },
  { name: 'Gujranwala', estimatedDays: '3-4', zone: 'major' },
  { name: 'Hyderabad', estimatedDays: '3-4', zone: 'major' },
  { name: 'Bahawalpur', estimatedDays: '3-5', zone: 'major' },
  { name: 'Sargodha', estimatedDays: '3-4', zone: 'major' },
  { name: 'Sukkur', estimatedDays: '4-5', zone: 'major' },
  { name: 'Mardan', estimatedDays: '4-5', zone: 'major' },
  { name: 'Mingora', estimatedDays: '4-5', zone: 'major' },
  { name: 'Sheikhupura', estimatedDays: '3-4', zone: 'major' },
  { name: 'Muzaffarabad', estimatedDays: '5-6', zone: 'major' },
];

export function getDeliveryEstimate(city: string): CityInfo | null {
  const normalizedCity = city.trim().toLowerCase();
  return CITIES.find(c => c.name.toLowerCase() === normalizedCity) || null;
}

export function getAllCities(): string[] {
  return CITIES.map(c => c.name);
}

interface CityDeliveryProps {
  city: string;
  onCityChange: (city: string) => void;
}

export default function CityDeliveryEstimate({ city, onCityChange }: CityDeliveryProps) {
  const estimate = getDeliveryEstimate(city);

  return (
    <div className="bg-[#FDF8F3] border border-[#E8DFD5] rounded-xl p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-[#C4A265]/10 rounded-full flex items-center justify-center shrink-0">
          <Truck size={20} className="text-[#C4A265]" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-[#2D2A26] mb-2">Delivery Estimate</h4>
          
          <div className="relative mb-3">
            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A09080]" />
            <input
              type="text"
              value={city}
              onChange={(e) => onCityChange(e.target.value)}
              placeholder="Enter your city"
              list="cities-list"
              className="w-full pl-10 pr-4 py-2 border border-[#E8DFD5] rounded-lg text-sm focus:outline-none focus:border-[#C4A265]"
            />
            <datalist id="cities-list">
              {CITIES.map(c => (
                <option key={c.name} value={c.name} />
              ))}
            </datalist>
          </div>

          {estimate ? (
            <div className="flex items-center gap-2 text-sm">
              <Clock size={16} className="text-green-600" />
              <span className="text-green-700 font-medium">
                Estimated delivery: {estimate.estimatedDays} business days
              </span>
            </div>
          ) : city ? (
            <p className="text-xs text-[#A09080]">
              Standard delivery: 5-7 business days
            </p>
          ) : (
            <p className="text-xs text-[#A09080]">
              Enter your city to see delivery estimate
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
