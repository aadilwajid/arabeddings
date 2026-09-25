'use client';

import { useState, useEffect } from 'react';
import { Users, TrendingUp, MapPin, ShoppingBag, DollarSign } from 'lucide-react';
import { Order } from '@/types';

interface CustomerSegment {
  email: string;
  name: string;
  totalOrders: number;
  totalSpent: number;
  avgOrderValue: number;
  lastOrderDate: string;
  city: string;
  segment: 'VIP' | 'Regular' | 'New' | 'At Risk' | 'Inactive';
}

export default function CustomerSegmentation() {
  const [segments, setSegments] = useState<CustomerSegment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSegment, setSelectedSegment] = useState<string>('all');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/orders');
      const orders: Order[] = await res.json();

      // Group by customer email
      const customerMap = new Map<string, CustomerSegment>();

      orders.forEach(order => {
        const email = order.customer.email;
        const existing = customerMap.get(email);

        if (existing) {
          existing.totalOrders += 1;
          existing.totalSpent += order.total;
          existing.avgOrderValue = Math.round(existing.totalSpent / existing.totalOrders);
          if (new Date(order.createdAt) > new Date(existing.lastOrderDate)) {
            existing.lastOrderDate = order.createdAt;
          }
        } else {
          customerMap.set(email, {
            email,
            name: order.customer.name,
            totalOrders: 1,
            totalSpent: order.total,
            avgOrderValue: order.total,
            lastOrderDate: order.createdAt,
            city: order.customer.city,
            segment: 'New'
          });
        }
      });

      // Assign segments
      const now = new Date();
      const customers = Array.from(customerMap.values()).map(customer => {
        const daysSinceLastOrder = Math.floor(
          (now.getTime() - new Date(customer.lastOrderDate).getTime()) / (1000 * 60 * 60 * 24)
        );

        let segment: CustomerSegment['segment'] = 'Regular';
        
        if (customer.totalOrders === 1 && daysSinceLastOrder <= 30) {
          segment = 'New';
        } else if (customer.totalSpent >= 50000 || customer.totalOrders >= 10) {
          segment = 'VIP';
        } else if (daysSinceLastOrder > 90) {
          segment = 'Inactive';
        } else if (daysSinceLastOrder > 60) {
          segment = 'At Risk';
        }

        return { ...customer, segment };
      });

      setSegments(customers);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const segmentCounts = {
    all: segments.length,
    VIP: segments.filter(s => s.segment === 'VIP').length,
    Regular: segments.filter(s => s.segment === 'Regular').length,
    New: segments.filter(s => s.segment === 'New').length,
    'At Risk': segments.filter(s => s.segment === 'At Risk').length,
    Inactive: segments.filter(s => s.segment === 'Inactive').length,
  };

  const filteredSegments = selectedSegment === 'all' 
    ? segments 
    : segments.filter(s => s.segment === selectedSegment);

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'VIP': return 'bg-purple-100 text-purple-700 border-purple-500';
      case 'Regular': return 'bg-blue-100 text-blue-700 border-blue-500';
      case 'New': return 'bg-green-100 text-green-700 border-green-500';
      case 'At Risk': return 'bg-yellow-100 text-yellow-700 border-yellow-500';
      case 'Inactive': return 'bg-gray-100 text-gray-700 border-gray-500';
      default: return 'bg-gray-100 text-gray-700 border-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-[#F0E8DE] p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-[#F5EDE4] rounded w-1/3" />
          <div className="h-40 bg-[#F5EDE4] rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#F0E8DE] p-6">
      <div className="flex items-center gap-2 mb-6">
        <Users size={20} className="text-[#C4A265]" />
        <h3 className="text-lg font-medium text-[#2D2A26]">Customer Segmentation</h3>
      </div>

      {/* Segment Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(segmentCounts).map(([segment, count]) => (
          <button
            key={segment}
            onClick={() => setSelectedSegment(segment)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedSegment === segment
                ? 'bg-[#C4A265] text-white'
                : 'bg-[#F5EDE4] text-[#5C4A32] hover:bg-[#E8DFD5]'
            }`}
          >
            {segment === 'all' ? 'All' : segment} ({count})
          </button>
        ))}
      </div>

      {/* Customer List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredSegments.map((customer, index) => (
          <div
            key={customer.email}
            className="p-3 rounded-lg border border-[#E8DFD5] hover:border-[#C4A265] transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm font-medium text-[#2D2A26]">{customer.name}</p>
                <p className="text-xs text-[#A09080]">{customer.email}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSegmentColor(customer.segment)}`}>
                {customer.segment}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
              <div className="flex items-center gap-1">
                <ShoppingBag size={14} className="text-[#A09080]" />
                <span className="text-xs text-[#5C4A32]">{customer.totalOrders} orders</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign size={14} className="text-[#A09080]" />
                <span className="text-xs text-[#5C4A32]">Rs {customer.totalSpent.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp size={14} className="text-[#A09080]" />
                <span className="text-xs text-[#5C4A32]">Avg: Rs {customer.avgOrderValue.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin size={14} className="text-[#A09080]" />
                <span className="text-xs text-[#5C4A32]">{customer.city}</span>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-[#F0E8DE]">
              <p className="text-xs text-[#A09080]">
                Last order: {new Date(customer.lastOrderDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {filteredSegments.length === 0 && (
        <div className="text-center py-8">
          <Users size={48} className="text-[#E8DFD5] mx-auto mb-3" />
          <p className="text-[#5C4A32]">No customers in this segment</p>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-[#E8DFD5]">
        <p className="text-xs text-[#A09080] text-center">
          Total customers: {segments.length} • Segments based on order history and activity
        </p>
      </div>
    </div>
  );
}
