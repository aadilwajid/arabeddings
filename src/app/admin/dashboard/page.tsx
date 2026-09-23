'use client';

import { useState, useEffect } from 'react';
import { Product, Order } from '@/types';
import { Package, ShoppingCart, Users, DollarSign, Plus, Edit, Trash2, Eye } from 'lucide-react';

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders'>('dashboard');

  useEffect(() => {
    fetch('/api/products').then(res => res.json()).then(setProducts);
    fetch('/api/orders').then(res => res.json()).then(setOrders);
  }, []);

  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
    pendingOrders: orders.filter(o => o.status === 'new' || o.status === 'confirmed').length
  };

  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-[#2D2A26] text-white p-6">
        <h1 className="text-xl font-serif mb-8">ARA Admin</h1>
        <nav className="space-y-2">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === 'dashboard' ? 'bg-[#C4A265]' : 'hover:bg-[#3D3A36]'}`}>Dashboard</button>
          <button onClick={() => setActiveTab('products')} className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === 'products' ? 'bg-[#C4A265]' : 'hover:bg-[#3D3A36]'}`}>Products</button>
          <button onClick={() => setActiveTab('orders')} className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === 'orders' ? 'bg-[#C4A265]' : 'hover:bg-[#3D3A36]'}`}>Orders</button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="text-3xl font-serif text-[#2D2A26] mb-8">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
                <div className="flex items-center justify-between mb-4">
                  <Package className="text-[#C4A265]" size={24} />
                  <span className="text-3xl font-bold text-[#2D2A26]">{stats.totalProducts}</span>
                </div>
                <p className="text-sm text-[#5C4A32]">Total Products</p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
                <div className="flex items-center justify-between mb-4">
                  <ShoppingCart className="text-[#C4A265]" size={24} />
                  <span className="text-3xl font-bold text-[#2D2A26]">{stats.totalOrders}</span>
                </div>
                <p className="text-sm text-[#5C4A32]">Total Orders</p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
                <div className="flex items-center justify-between mb-4">
                  <DollarSign className="text-[#C4A265]" size={24} />
                  <span className="text-3xl font-bold text-[#2D2A26]">Rs {stats.totalRevenue.toLocaleString()}</span>
                </div>
                <p className="text-sm text-[#5C4A32]">Total Revenue</p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
                <div className="flex items-center justify-between mb-4">
                  <Users className="text-[#C4A265]" size={24} />
                  <span className="text-3xl font-bold text-[#2D2A26]">{stats.pendingOrders}</span>
                </div>
                <p className="text-sm text-[#5C4A32]">Pending Orders</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-serif text-[#2D2A26]">Products</h2>
              <button className="bg-[#C4A265] text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-[#D4B275]">
                <Plus size={18} /> Add Product
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-[#F0E8DE] overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#F5EDE4]">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-medium text-[#5C4A32]">Product</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-[#5C4A32]">Category</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-[#5C4A32]">Price From</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-[#5C4A32]">Stock</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-[#5C4A32]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id} className="border-t border-[#F0E8DE]">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={product.mainImage} alt={product.name} className="w-12 h-12 object-cover rounded-lg" />
                          <span className="font-medium text-[#2D2A26]">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#5C4A32]">{product.category}</td>
                      <td className="px-6 py-4 text-sm text-[#5C4A32]">Rs {product.priceFrom.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-[#5C4A32]">{product.stock}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-[#F5EDE4] rounded-lg"><Eye size={16} /></button>
                          <button className="p-2 hover:bg-[#F5EDE4] rounded-lg"><Edit size={16} /></button>
                          <button className="p-2 hover:bg-red-50 text-red-500 rounded-lg"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <h2 className="text-3xl font-serif text-[#2D2A26] mb-8">Orders</h2>
            <div className="bg-white rounded-2xl border border-[#F0E8DE] overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#F5EDE4]">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-medium text-[#5C4A32]">Order #</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-[#5C4A32]">Customer</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-[#5C4A32]">Total</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-[#5C4A32]">Status</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-[#5C4A32]">Date</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-[#5C4A32]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className="border-t border-[#F0E8DE]">
                      <td className="px-6 py-4 text-sm font-medium text-[#2D2A26]">{order.orderNumber}</td>
                      <td className="px-6 py-4 text-sm text-[#5C4A32]">{order.customer.name}</td>
                      <td className="px-6 py-4 text-sm text-[#5C4A32]">Rs {order.total.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#5C4A32]">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <button className="p-2 hover:bg-[#F5EDE4] rounded-lg"><Eye size={16} /></button>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-[#A09080]">No orders yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
