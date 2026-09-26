'use client';

import { useState, useEffect } from 'react';
import { Product, Order } from '@/types';
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [productsRes, ordersRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/orders')
      ]);

      if (!productsRes.ok || !ordersRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const productsData = await productsRes.json();
      const ordersData = await ordersRes.json();
      
      setProducts(productsData);
      setOrders(ordersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
    pendingOrders: orders.filter(o => o.status === 'new' || o.status === 'confirmed').length,
    recentOrders: orders.slice(0, 5)
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-serif text-[#2D2A26]">Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-[#F0E8DE] animate-pulse">
              <div className="h-8 bg-[#F5EDE4] rounded mb-4"></div>
              <div className="h-4 bg-[#F5EDE4] rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="text-red-500" size={24} />
          <div>
            <h3 className="font-medium text-red-800">Error Loading Dashboard</h3>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
        <button 
          onClick={fetchData}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-serif text-[#2D2A26]">Dashboard</h2>
        <button 
          onClick={fetchData}
          className="px-4 py-2 bg-[#C4A265] text-white rounded-lg hover:bg-[#D4B275] flex items-center gap-2"
        >
          <TrendingUp size={18} />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE] hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Package className="text-blue-600" size={24} />
            </div>
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Products</span>
          </div>
          <p className="text-3xl font-bold text-[#2D2A26]">{stats.totalProducts}</p>
          <p className="text-sm text-[#5C4A32] mt-1">Total Products</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE] hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <ShoppingCart className="text-green-600" size={24} />
            </div>
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">Orders</span>
          </div>
          <p className="text-3xl font-bold text-[#2D2A26]">{stats.totalOrders}</p>
          <p className="text-sm text-[#5C4A32] mt-1">Total Orders</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE] hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <DollarSign className="text-purple-600" size={24} />
            </div>
            <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">Revenue</span>
          </div>
          <p className="text-3xl font-bold text-[#2D2A26]">Rs {stats.totalRevenue.toLocaleString()}</p>
          <p className="text-sm text-[#5C4A32] mt-1">Total Revenue</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE] hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <Users className="text-orange-600" size={24} />
            </div>
            <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">Pending</span>
          </div>
          <p className="text-3xl font-bold text-[#2D2A26]">{stats.pendingOrders}</p>
          <p className="text-sm text-[#5C4A32] mt-1">Pending Orders</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-[#F0E8DE] overflow-hidden">
        <div className="p-6 border-b border-[#F0E8DE]">
          <h3 className="text-xl font-medium text-[#2D2A26]">Recent Orders</h3>
        </div>
        {stats.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F5EDE4]">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-[#5C4A32]">Order #</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-[#5C4A32]">Customer</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-[#5C4A32]">Total</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-[#5C4A32]">Status</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-[#5C4A32]">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map(order => (
                  <tr key={order.id} className="border-t border-[#F0E8DE] hover:bg-[#FDF8F3]">
                    <td className="px-6 py-4 text-sm font-medium text-[#2D2A26]">{order.orderNumber}</td>
                    <td className="px-6 py-4 text-sm text-[#5C4A32]">{order.customer.name}</td>
                    <td className="px-6 py-4 text-sm text-[#5C4A32]">Rs {order.total.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#5C4A32]">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-[#A09080]">
            <ShoppingCart size={48} className="mx-auto mb-3 opacity-50" />
            <p>No orders yet</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a href="/admin/products" className="bg-white rounded-2xl p-6 border border-[#F0E8DE] hover:shadow-lg transition-all hover:border-[#C4A265]">
          <Package className="text-[#C4A265] mb-3" size={32} />
          <h3 className="font-medium text-[#2D2A26] mb-1">Manage Products</h3>
          <p className="text-sm text-[#5C4A32]">Add, edit, or remove products</p>
        </a>
        <a href="/admin/orders" className="bg-white rounded-2xl p-6 border border-[#F0E8DE] hover:shadow-lg transition-all hover:border-[#C4A265]">
          <ShoppingCart className="text-[#C4A265] mb-3" size={32} />
          <h3 className="font-medium text-[#2D2A26] mb-1">View Orders</h3>
          <p className="text-sm text-[#5C4A32]">Process and manage orders</p>
        </a>
        <a href="/admin/analytics" className="bg-white rounded-2xl p-6 border border-[#F0E8DE] hover:shadow-lg transition-all hover:border-[#C4A265]">
          <TrendingUp className="text-[#C4A265] mb-3" size={32} />
          <h3 className="font-medium text-[#2D2A26] mb-1">View Analytics</h3>
          <p className="text-sm text-[#5C4A32]">See sales and performance data</p>
        </a>
      </div>
    </div>
  );
}
