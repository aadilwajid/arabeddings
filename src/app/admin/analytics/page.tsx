'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, ShoppingBag, Users, Package, Calendar } from 'lucide-react';
import { Order, Product } from '@/types';

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  totalCustomers: number;
  topProducts: { name: string; quantity: number; revenue: number }[];
  ordersByStatus: Record<string, number>;
  revenueByDay: { date: string; revenue: number }[];
  recentOrders: Order[];
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [period, setPeriod] = useState<'7' | '30' | '90'>('30');

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    const [ordersRes, productsRes] = await Promise.all([
      fetch('/api/orders'),
      fetch('/api/products')
    ]);
    const orders: Order[] = await ordersRes.json();
    const products: Product[] = await productsRes.json();

    const now = new Date();
    const daysAgo = parseInt(period);
    const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    const filteredOrders = orders.filter(o => new Date(o.createdAt) >= startDate);

    // Calculate metrics
    const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = filteredOrders.length;
    const avgOrderValue = totalOrders > 0 ? Math.floor(totalRevenue / totalOrders) : 0;
    const uniqueCustomers = new Set(filteredOrders.map(o => o.customer.email)).size;

    // Top products
    const productSales: Record<string, { quantity: number; revenue: number }> = {};
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = { quantity: 0, revenue: 0 };
        }
        productSales[item.productId].quantity += item.quantity;
        productSales[item.productId].revenue += item.price * item.quantity;
      });
    });

    const topProducts = Object.entries(productSales)
      .map(([productId, data]) => {
        const product = products.find(p => p.id === productId);
        return {
          name: product?.name || 'Unknown',
          quantity: data.quantity,
          revenue: data.revenue
        };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Orders by status
    const ordersByStatus: Record<string, number> = {};
    filteredOrders.forEach(order => {
      ordersByStatus[order.status] = (ordersByStatus[order.status] || 0) + 1;
    });

    // Revenue by day
    const revenueByDay: { date: string; revenue: number }[] = [];
    for (let i = daysAgo - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const dayRevenue = filteredOrders
        .filter(o => o.createdAt.startsWith(dateStr))
        .reduce((sum, o) => sum + o.total, 0);
      revenueByDay.push({ date: dateStr, revenue: dayRevenue });
    }

    // Recent orders
    const recentOrders = orders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    setData({
      totalRevenue,
      totalOrders,
      avgOrderValue,
      totalCustomers: uniqueCustomers,
      topProducts,
      ordersByStatus,
      revenueByDay,
      recentOrders
    });
  };

  if (!data) {
    return <div className="text-center py-12">Loading analytics...</div>;
  }

  const maxRevenue = Math.max(...data.revenueByDay.map(d => d.revenue), 1);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-serif text-[#2D2A26]">Sales Analytics</h2>
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-[#A09080]" />
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as '7' | '30' | '90')}
            className="px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="text-green-600" size={24} />
            </div>
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">Revenue</span>
          </div>
          <p className="text-2xl font-bold text-[#2D2A26]">Rs {data.totalRevenue.toLocaleString()}</p>
          <p className="text-sm text-[#A09080]">Total revenue</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="text-blue-600" size={24} />
            </div>
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Orders</span>
          </div>
          <p className="text-2xl font-bold text-[#2D2A26]">{data.totalOrders}</p>
          <p className="text-sm text-[#A09080]">Total orders</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
            <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">Avg</span>
          </div>
          <p className="text-2xl font-bold text-[#2D2A26]">Rs {data.avgOrderValue.toLocaleString()}</p>
          <p className="text-sm text-[#A09080]">Avg order value</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <Users className="text-orange-600" size={24} />
            </div>
            <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">Customers</span>
          </div>
          <p className="text-2xl font-bold text-[#2D2A26]">{data.totalCustomers}</p>
          <p className="text-sm text-[#A09080]">Unique customers</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#F0E8DE]">
          <h3 className="text-lg font-medium text-[#2D2A26] mb-4">Revenue Trend</h3>
          <div className="h-64 flex items-end gap-1">
            {data.revenueByDay.map((day, i) => (
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
            <span>{data.revenueByDay[0]?.date}</span>
            <span>{data.revenueByDay[data.revenueByDay.length - 1]?.date}</span>
          </div>
        </div>

        {/* Orders by Status */}
        <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
          <h3 className="text-lg font-medium text-[#2D2A26] mb-4">Orders by Status</h3>
          <div className="space-y-3">
            {Object.entries(data.ordersByStatus).map(([status, count]) => (
              <div key={status}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize text-[#5C4A32]">{status}</span>
                  <span className="font-medium text-[#2D2A26]">{count}</span>
                </div>
                <div className="h-2 bg-[#F0E8DE] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#C4A265] rounded-full"
                    style={{ width: `${(count / data.totalOrders) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        {/* Top Products */}
        <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
          <h3 className="text-lg font-medium text-[#2D2A26] mb-4">Top Selling Products</h3>
          <div className="space-y-3">
            {data.topProducts.map((product, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-8 h-8 bg-[#C4A265]/10 text-[#C4A265] rounded-full flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#2D2A26] truncate">{product.name}</p>
                  <p className="text-xs text-[#A09080]">{product.quantity} sold</p>
                </div>
                <span className="text-sm font-medium text-[#C4A265]">Rs {product.revenue.toLocaleString()}</span>
              </div>
            ))}
            {data.topProducts.length === 0 && (
              <p className="text-sm text-[#A09080] text-center py-4">No sales data yet</p>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
          <h3 className="text-lg font-medium text-[#2D2A26] mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {data.recentOrders.map(order => (
              <div key={order.id} className="flex items-center gap-3 p-2 hover:bg-[#FDF8F3] rounded-lg">
                <div className="w-10 h-10 bg-[#F5EDE4] rounded-full flex items-center justify-center">
                  <Package size={18} className="text-[#C4A265]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#2D2A26]">{order.orderNumber}</p>
                  <p className="text-xs text-[#A09080]">{order.customer.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-[#2D2A26]">Rs {order.total.toLocaleString()}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            {data.recentOrders.length === 0 && (
              <p className="text-sm text-[#A09080] text-center py-4">No orders yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
