'use client';

import { useState, useEffect } from 'react';
import { Users, Search, Mail, Phone, MapPin, ShoppingBag, DollarSign, TrendingUp, Filter } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: Array<{
    address: string;
    city: string;
    postalCode: string;
  }>;
  totalOrders: number;
  totalSpent: number;
  avgOrderValue: number;
  lastOrderDate: string;
  segment: 'VIP' | 'Regular' | 'New' | 'At Risk' | 'Inactive';
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSegment, setSelectedSegment] = useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/orders');
      const orders = await res.json();

      // Group orders by customer email
      const customerMap = new Map<string, any>();

      orders.forEach((order: any) => {
        const email = order.customer.email;
        if (!customerMap.has(email)) {
          customerMap.set(email, {
            id: `cust-${email}`,
            name: order.customer.name,
            email: order.customer.email,
            phone: order.customer.phone,
            addresses: [{
              address: order.customer.address,
              city: order.customer.city,
              postalCode: order.customer.postalCode,
            }],
            totalOrders: 0,
            totalSpent: 0,
            lastOrderDate: order.createdAt,
          });
        }

        const customer = customerMap.get(email);
        customer.totalOrders += 1;
        customer.totalSpent += order.total;

        // Add new addresses
        const addressExists = customer.addresses.some(
          (addr: any) => addr.address === order.customer.address
        );
        if (!addressExists) {
          customer.addresses.push({
            address: order.customer.address,
            city: order.customer.city,
            postalCode: order.customer.postalCode,
          });
        }

        // Update last order date
        if (new Date(order.createdAt) > new Date(customer.lastOrderDate)) {
          customer.lastOrderDate = order.createdAt;
        }
      });

      // Calculate metrics and segments
      const customersList = Array.from(customerMap.values()).map((customer) => {
        const avgOrderValue = customer.totalOrders > 0 
          ? Math.round(customer.totalSpent / customer.totalOrders)
          : 0;

        const daysSinceLastOrder = Math.floor(
          (Date.now() - new Date(customer.lastOrderDate).getTime()) / (1000 * 60 * 60 * 24)
        );

        let segment: Customer['segment'] = 'Regular';
        if (customer.totalOrders === 1 && daysSinceLastOrder <= 30) {
          segment = 'New';
        } else if (customer.totalSpent >= 50000 || customer.totalOrders >= 10) {
          segment = 'VIP';
        } else if (daysSinceLastOrder > 90) {
          segment = 'Inactive';
        } else if (daysSinceLastOrder > 60) {
          segment = 'At Risk';
        }

        return {
          ...customer,
          avgOrderValue,
          segment,
        };
      });

      setCustomers(customersList);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = !searchQuery || 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery);
    
    const matchesSegment = selectedSegment === 'all' || customer.segment === selectedSegment;
    
    return matchesSearch && matchesSegment;
  });

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

  const segmentCounts = {
    all: customers.length,
    VIP: customers.filter(c => c.segment === 'VIP').length,
    Regular: customers.filter(c => c.segment === 'Regular').length,
    New: customers.filter(c => c.segment === 'New').length,
    'At Risk': customers.filter(c => c.segment === 'At Risk').length,
    Inactive: customers.filter(c => c.segment === 'Inactive').length,
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-serif text-[#2D2A26]">Customer Management</h2>
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-[#F5EDE4] rounded"></div>
          <div className="h-64 bg-[#F5EDE4] rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-serif text-[#2D2A26]">Customer Management</h2>
        <div className="flex items-center gap-2 text-sm text-[#A09080]">
          <Users size={18} />
          {customers.length} total customers
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
          <div className="flex items-center justify-between mb-2">
            <Users className="text-purple-500" size={24} />
            <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">VIP</span>
          </div>
          <p className="text-3xl font-bold text-[#2D2A26]">{segmentCounts.VIP}</p>
          <p className="text-sm text-[#5C4A32]">VIP Customers</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="text-green-500" size={24} />
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">Revenue</span>
          </div>
          <p className="text-3xl font-bold text-[#2D2A26]">
            Rs {customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}
          </p>
          <p className="text-sm text-[#5C4A32]">Total Revenue</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
          <div className="flex items-center justify-between mb-2">
            <ShoppingBag className="text-blue-500" size={24} />
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Orders</span>
          </div>
          <p className="text-3xl font-bold text-[#2D2A26]">
            {customers.reduce((sum, c) => sum + c.totalOrders, 0)}
          </p>
          <p className="text-sm text-[#5C4A32]">Total Orders</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="text-orange-500" size={24} />
            <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">Avg</span>
          </div>
          <p className="text-3xl font-bold text-[#2D2A26]">
            Rs {customers.length > 0 
              ? Math.round(customers.reduce((sum, c) => sum + c.avgOrderValue, 0) / customers.length).toLocaleString()
              : 0}
          </p>
          <p className="text-sm text-[#5C4A32]">Avg Order Value</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A09080]" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or phone..."
              className="w-full pl-10 pr-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-[#A09080]" />
            <select
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
              className="px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]"
            >
              <option value="all">All Segments ({segmentCounts.all})</option>
              <option value="VIP">VIP ({segmentCounts.VIP})</option>
              <option value="Regular">Regular ({segmentCounts.Regular})</option>
              <option value="New">New ({segmentCounts.New})</option>
              <option value="At Risk">At Risk ({segmentCounts['At Risk']})</option>
              <option value="Inactive">Inactive ({segmentCounts.Inactive})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customer List */}
      <div className="bg-white rounded-2xl border border-[#F0E8DE] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F5EDE4]">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-[#5C4A32]">Customer</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-[#5C4A32]">Contact</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-[#5C4A32]">Orders</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-[#5C4A32]">Total Spent</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-[#5C4A32]">Avg Order</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-[#5C4A32]">Segment</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-[#5C4A32]">Last Order</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-[#5C4A32]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="border-t border-[#F0E8DE] hover:bg-[#FDF8F3]">
                  <td className="px-6 py-4">
                    <p className="font-medium text-[#2D2A26]">{customer.name}</p>
                    <p className="text-xs text-[#A09080]">{customer.addresses.length} address(es)</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-sm text-[#5C4A32] flex items-center gap-1">
                        <Mail size={14} />
                        {customer.email}
                      </p>
                      <p className="text-sm text-[#5C4A32] flex items-center gap-1">
                        <Phone size={14} />
                        {customer.phone}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#5C4A32]">
                    {customer.totalOrders}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-[#2D2A26]">
                    Rs {customer.totalSpent.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#5C4A32]">
                    Rs {customer.avgOrderValue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSegmentColor(customer.segment)}`}>
                      {customer.segment}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#5C4A32]">
                    {new Date(customer.lastOrderDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedCustomer(customer)}
                      className="px-3 py-1 bg-[#C4A265] text-white rounded-lg text-sm hover:bg-[#D4B275]"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="p-12 text-center text-[#A09080]">
            <Users size={48} className="mx-auto mb-3 opacity-50" />
            <p>No customers found</p>
          </div>
        )}
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-serif text-[#2D2A26]">Customer Details</h3>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-2 hover:bg-[#F5EDE4] rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h4 className="font-medium text-[#2D2A26] mb-3">Basic Information</h4>
                <div className="bg-[#FDF8F3] rounded-lg p-4 space-y-2">
                  <p className="text-sm"><strong>Name:</strong> {selectedCustomer.name}</p>
                  <p className="text-sm"><strong>Email:</strong> {selectedCustomer.email}</p>
                  <p className="text-sm"><strong>Phone:</strong> {selectedCustomer.phone}</p>
                  <p className="text-sm">
                    <strong>Segment:</strong>{' '}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSegmentColor(selectedCustomer.segment)}`}>
                      {selectedCustomer.segment}
                    </span>
                  </p>
                </div>
              </div>

              {/* Addresses */}
              <div>
                <h4 className="font-medium text-[#2D2A26] mb-3">Saved Addresses</h4>
                <div className="space-y-2">
                  {selectedCustomer.addresses.map((addr, idx) => (
                    <div key={idx} className="bg-[#FDF8F3] rounded-lg p-3 flex items-start gap-2">
                      <MapPin size={16} className="text-[#C4A265] mt-0.5" />
                      <div className="text-sm">
                        <p>{addr.address}</p>
                        <p className="text-[#A09080]">{addr.city} {addr.postalCode}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Stats */}
              <div>
                <h4 className="font-medium text-[#2D2A26] mb-3">Order Statistics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#FDF8F3] rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-[#C4A265]">{selectedCustomer.totalOrders}</p>
                    <p className="text-sm text-[#5C4A32]">Total Orders</p>
                  </div>
                  <div className="bg-[#FDF8F3] rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-[#C4A265]">Rs {selectedCustomer.totalSpent.toLocaleString()}</p>
                    <p className="text-sm text-[#5C4A32]">Total Spent</p>
                  </div>
                  <div className="bg-[#FDF8F3] rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-[#C4A265]">Rs {selectedCustomer.avgOrderValue.toLocaleString()}</p>
                    <p className="text-sm text-[#5C4A32]">Avg Order Value</p>
                  </div>
                  <div className="bg-[#FDF8F3] rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-[#C4A265]">
                      {new Date(selectedCustomer.lastOrderDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-[#5C4A32]">Last Order</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
