'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Package, Users, DollarSign, MapPin, Clock, Download, RefreshCw } from 'lucide-react';

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    fetchAnalytics();
  }, [days]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/analytics?days=${days}`);
      const data = await res.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const res = await fetch('/api/exports?type=analytics&format=csv');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${Date.now()}.csv`;
      a.click();
    } catch (error) {
      alert('Failed to export analytics');
    }
  };

  if (loading || !analytics) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-serif text-[#2D2A26]">Analytics Dashboard</h2>
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-[#F5EDE4] rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-[#F5EDE4] rounded"></div>
        </div>
      </div>
    );
  }

  const maxRevenue = Math.max(...analytics.sales.map((s: any) => s.revenue));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-serif text-[#2D2A26]">Analytics Dashboard</h2>
        <div className="flex gap-2">
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-[#C4A265] text-white rounded-lg hover:bg-[#D4B275] flex items-center gap-2"
          >
            <Download size={18} />
            Export
          </button>
          <button
            onClick={fetchAnalytics}
            className="px-4 py-2 border border-[#E8DFD5] rounded-lg hover:bg-[#F5EDE4] flex items-center gap-2"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>
      </div>

      {/* Customer Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
          <Users className="text-[#C4A265] mb-2" size={24} />
          <p className="text-3xl font-bold text-[#2D2A26]">{analytics.customers.totalCustomers}</p>
          <p className="text-sm text-[#5C4A32]">Total Customers</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
          <Users className="text-green-500 mb-2" size={24} />
          <p className="text-3xl font-bold text-[#2D2A26]">{analytics.customers.newCustomers}</p>
          <p className="text-sm text-[#5C4A32]">New Customers</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
          <DollarSign className="text-blue-500 mb-2" size={24} />
          <p className="text-3xl font-bold text-[#2D2A26]">Rs {Math.round(analytics.customers.avgOrderValue).toLocaleString()}</p>
          <p className="text-sm text-[#5C4A32]">Avg Order Value</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
          <TrendingUp className="text-purple-500 mb-2" size={24} />
          <p className="text-3xl font-bold text-[#2D2A26]">Rs {Math.round(analytics.customers.lifetimeValue).toLocaleString()}</p>
          <p className="text-sm text-[#5C4A32]">Lifetime Value</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
          <TrendingUp className="text-orange-500 mb-2" size={24} />
          <p className="text-3xl font-bold text-[#2D2A26]">{analytics.conversion.conversionRate.toFixed(2)}%</p>
          <p className="text-sm text-[#5C4A32]">Conversion Rate</p>
        </div>
      </div>

      {/* Sales Chart */}
      <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
        <h3 className="text-xl font-medium text-[#2D2A26] mb-4">Sales Trend</h3>
        <div className="h-64 flex items-end gap-1">
          {analytics.sales.map((day: any, i: number) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full bg-gradient-to-t from-[#C4A265] to-[#D4B275] rounded-t transition-all hover:opacity-80"
                style={{ height: `${(day.revenue / maxRevenue) * 100}%`, minHeight: day.revenue > 0 ? '4px' : '0' }}
                title={`Rs ${day.revenue.toLocaleString()} on ${day.date}`}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-[#A09080]">
          <span>{analytics.sales[0]?.date}</span>
          <span>{analytics.sales[analytics.sales.length - 1]?.date}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
          <h3 className="text-xl font-medium text-[#2D2A26] mb-4">Top Products</h3>
          <div className="space-y-3">
            {analytics.products.slice(0, 10).map((product: any, i: number) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-8 h-8 bg-[#C4A265]/10 text-[#C4A265] rounded-full flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#2D2A26] truncate">{product.productName}</p>
                  <p className="text-xs text-[#A09080]">{product.totalSold} sold</p>
                </div>
                <span className="text-sm font-medium text-[#C4A265]">Rs {product.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
          <h3 className="text-xl font-medium text-[#2D2A26] mb-4">Category Performance</h3>
          <div className="space-y-3">
            {analytics.categories.map((cat: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[#5C4A32]">{cat.category}</span>
                  <span className="font-medium text-[#2D2A26]">Rs {cat.revenue.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-[#F0E8DE] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#C4A265] rounded-full"
                    style={{ width: `${(cat.revenue / analytics.categories[0].revenue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
          <h3 className="text-xl font-medium text-[#2D2A26] mb-4">Payment Methods</h3>
          <div className="space-y-3">
            {analytics.payments.map((method: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 bg-[#FDF8F3] rounded-lg">
                <div>
                  <p className="font-medium text-[#2D2A26] capitalize">{method.method}</p>
                  <p className="text-xs text-[#A09080]">{method.orders} orders</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-[#2D2A26]">{method.percentage.toFixed(1)}%</p>
                  <p className="text-xs text-[#A09080]">Rs {method.revenue.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Cities */}
        <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
          <h3 className="text-xl font-medium text-[#2D2A26] mb-4">Top Cities</h3>
          <div className="space-y-3">
            {analytics.cities.slice(0, 10).map((city: any, i: number) => (
              <div key={i} className="flex items-center gap-3">
                <MapPin size={16} className="text-[#C4A265]" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#2D2A26]">{city.city}</p>
                  <p className="text-xs text-[#A09080]">{city.orders} orders</p>
                </div>
                <span className="text-sm font-medium text-[#C4A265]">Rs {city.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Peak Times */}
      <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
        <h3 className="text-xl font-medium text-[#2D2A26] mb-4">Peak Order Times</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-[#5C4A32] mb-3 flex items-center gap-2">
              <Clock size={16} />
              By Hour
            </h4>
            <div className="space-y-2">
              {analytics.time.byHour
                .sort((a: any, b: any) => b.orders - a.orders)
                .slice(0, 5)
                .map((hour: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-[#5C4A32]">{hour.hour}:00</span>
                    <span className="font-medium text-[#2D2A26]">{hour.orders} orders</span>
                  </div>
                ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-[#5C4A32] mb-3 flex items-center gap-2">
              <Clock size={16} />
              By Day
            </h4>
            <div className="space-y-2">
              {analytics.time.byDay
                .sort((a: any, b: any) => b.orders - a.orders)
                .map((day: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-[#5C4A32]">{day.day}</span>
                    <span className="font-medium text-[#2D2A26]">{day.orders} orders</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
