import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BarChart3, Package, ShoppingCart, CreditCard, Truck, Users, Settings, 
  ClipboardList, Check, X, Eye, TrendingUp, DollarSign, Image as ImageIcon, 
  Upload, Trash2, ArrowUpRight, ArrowDownRight, Activity, Calendar,
  Star, AlertCircle, CheckCircle, Clock, MoreVertical
} from 'lucide-react';
import { useStore } from '../store';
import { formatPKR } from '../data/pakistan';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';

export default function AdminDashboard() {
  const { user, orders, drugOrders, products, settings } = useStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user || user.role !== 'ADMIN') {
    navigate('/login');
    return null;
  }

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
  const pendingPayments = orders.filter(o => o.payment.status === 'AWAITING_VERIFICATION').length;

  // Generate sales data for chart
  const salesData = [
    { name: 'Jan', sales: 45000, orders: 12 },
    { name: 'Feb', sales: 52000, orders: 15 },
    { name: 'Mar', sales: 48000, orders: 13 },
    { name: 'Apr', sales: 61000, orders: 18 },
    { name: 'May', sales: 58000, orders: 16 },
    { name: 'Jun', sales: 72000, orders: 21 },
    { name: 'Jul', sales: 68000, orders: 19 },
  ];

  // Category distribution
  const categoryData = [
    { name: 'Bed Sheets', value: 35, color: '#f59e0b' },
    { name: 'Duvet Covers', value: 25, color: '#d97706' },
    { name: 'Comforters', value: 20, color: '#b45309' },
    { name: 'Pillows', value: 12, color: '#92400e' },
    { name: 'Others', value: 8, color: '#78350f' },
  ];

  // Top products
  const topProducts = products
    .map(p => ({
      ...p,
      sales: Math.floor(Math.random() * 50) + 10,
      revenue: Math.floor(Math.random() * 500000) + 100000
    }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'drug-orders', label: 'Custom Orders', icon: ClipboardList },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'media', label: 'Media', icon: ImageIcon },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Admin Header */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <Link to="/" className="text-lg font-bold text-gray-900 dark:text-white">
                  <span>ARA</span>
                  <span className="font-light text-amber-600 dark:text-amber-400 ml-1">BEDDINGS</span>
                </Link>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">Admin Panel</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">{user.email}</span>
              <Link to="/" className="text-sm text-amber-600 dark:text-amber-400 hover:underline">View Store</Link>
            </div>
          </div>
          {/* Tabs */}
          <div className="flex overflow-x-auto space-x-1 -mb-px">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === tab.id ? 'border-amber-600 text-amber-600 dark:text-amber-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && <OverviewTab totalRevenue={totalRevenue} pendingOrders={pendingOrders} pendingPayments={pendingPayments} salesData={salesData} categoryData={categoryData} topProducts={topProducts} />}
        {activeTab === 'orders' && <OrdersTab />}
        {activeTab === 'products' && <ProductsTab />}
        {activeTab === 'payments' && <PaymentsTab />}
        {activeTab === 'drug-orders' && <DrugOrdersTab />}
        {activeTab === 'shipping' && <ShippingTab />}
        {activeTab === 'customers' && <CustomersTab />}
        {activeTab === 'media' && <MediaManagerTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>
    </div>
  );
}

function OverviewTab({ totalRevenue, pendingOrders, pendingPayments, salesData, categoryData, topProducts }: any) {
  const { orders } = useStore();
  
  const stats = [
    { label: 'Total Revenue', value: formatPKR(totalRevenue), icon: DollarSign, color: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400', change: '+12.5%', up: true },
    { label: 'Total Orders', value: orders.length, icon: ShoppingCart, color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400', change: '+8.2%', up: true },
    { label: 'Pending Orders', value: pendingOrders, icon: Package, color: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400', change: '-3.1%', up: false },
    { label: 'Pending Payments', value: pendingPayments, icon: CreditCard, color: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400', change: '+2.4%', up: true },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard Overview</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center text-sm font-medium ${stat.up ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {stat.change}
                {stat.up ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sales Overview</h3>
            <select className="text-sm border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-1.5">
              <option>Last 7 months</option>
              <option>Last 30 days</option>
              <option>Last year</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Area type="monotone" dataKey="sales" stroke="#f59e0b" fillOpacity={1} fill="url(#colorSales)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Top Selling Products</h3>
          <div className="space-y-4">
            {topProducts.map((product: any, index: number) => (
              <div key={product.id} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold">
                  #{index + 1}
                </div>
                <img src={product.images[0]?.url} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">{product.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{product.sales} sales</p>
                </div>
                <p className="font-semibold text-gray-900 dark:text-white">{formatPKR(product.revenue)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  order.status === 'DELIVERED' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                  order.status === 'SHIPPED' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                  order.status === 'PENDING' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
                  'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {order.status === 'DELIVERED' ? <CheckCircle size={16} /> :
                   order.status === 'SHIPPED' ? <Truck size={16} /> :
                   order.status === 'PENDING' ? <Clock size={16} /> :
                   <Activity size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{order.orderNumber}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {order.shippingAddress.fullName} • {formatPKR(order.total)}
                  </p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Utility Components
function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    'PENDING': 'bg-yellow-100 text-yellow-700',
    'CONFIRMED': 'bg-amber-100 text-amber-700',
    'PROCESSING': 'bg-blue-100 text-blue-700',
    'SHIPPED': 'bg-cyan-100 text-cyan-700',
    'DELIVERED': 'bg-green-100 text-green-700',
    'CANCELLED': 'bg-red-100 text-red-700',
    'REFUNDED': 'bg-gray-100 text-gray-700',
  };
  return <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${colors[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>;
}

function PaymentBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    'PENDING': 'bg-yellow-100 text-yellow-700',
    'AWAITING_VERIFICATION': 'bg-orange-100 text-orange-700',
    'VERIFIED': 'bg-green-100 text-green-700',
    'FAILED': 'bg-red-100 text-red-700',
    'REFUNDED': 'bg-gray-100 text-gray-700',
  };
  return <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${colors[status] || 'bg-gray-100 text-gray-700'}`}>{status.replace('_', ' ')}</span>;
}

function OrdersTab() {
  const { orders, updateOrderStatus } = useStore();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const order = selectedOrder ? orders.find(o => o.id === selectedOrder) : null;
  const nextStatuses: Record<string, any[]> = {
    'PENDING': ['CONFIRMED', 'CANCELLED'],
    'CONFIRMED': ['PROCESSING', 'CANCELLED'],
    'PROCESSING': ['SHIPPED'],
    'SHIPPED': ['DELIVERED'],
    'DELIVERED': [],
    'CANCELLED': [],
    'REFUNDED': [],
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Manage Orders</h2>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700 text-left text-gray-500 dark:text-gray-400">
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Total</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id} className={`border-b dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${selectedOrder === o.id ? 'bg-amber-50 dark:bg-amber-900/20' : ''}`} onClick={() => setSelectedOrder(o.id)}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 dark:text-white">{o.orderNumber}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-white">{formatPKR(o.total)}</td>
                    <td className="px-4 py-3"><Eye size={16} className="text-gray-400" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {order && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">{order.orderNumber}</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Customer</p>
                <p className="font-medium text-gray-900 dark:text-white">{order.shippingAddress.fullName}</p>
                <p className="text-gray-600 dark:text-gray-300">{order.shippingAddress.line1}, {order.shippingAddress.city}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Items</p>
                {order.items.map(item => (
                  <p key={item.id} className="text-gray-700 dark:text-gray-300">{item.productName} ({item.variantName}) x {item.quantity} — {formatPKR(item.total)}</p>
                ))}
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Payment</p>
                <p className="font-medium text-gray-900 dark:text-white">{order.payment.method === 'COD' ? 'Cash on Delivery' : 'Bank Transfer'}</p>
                <PaymentBadge status={order.payment.status} />
                {order.payment.reference && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Ref: {order.payment.reference}</p>}
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {(nextStatuses[order.status] || []).map(status => (
                    <button
                      key={status}
                      onClick={() => updateOrderStatus(order.id, status)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg ${
                        status === 'CANCELLED' ? 'bg-red-100 text-red-700 hover:bg-red-200' :
                        'bg-amber-100 text-amber-700 hover:bg-amber-200'
                      }`}
                    >
                      → {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductsTab() {
  const { products } = useStore();

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Products ({products.length})</h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700 text-left text-gray-500 dark:text-gray-400">
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price Range</th>
              <th className="px-4 py-3 font-medium">Variants</th>
              <th className="px-4 py-3 font-medium">Total Stock</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => {
              const prices = p.variants.map(v => v.price);
              const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0);
              return (
                <tr key={p.id} className="border-b dark:border-gray-700">
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <img src={p.images[0]?.url} alt="" className="w-10 h-10 rounded object-cover" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{p.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{useStore.getState().categories.find(c => c.id === p.categoryId)?.name}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{formatPKR(Math.min(...prices))} - {formatPKR(Math.max(...prices))}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{p.variants.length}</td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${totalStock < 20 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>{totalStock}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PaymentsTab() {
  const { orders, verifyPayment } = useStore();
  const pendingBankTransfers = orders.filter(o => o.payment.method === 'BANK_TRANSFER' && o.payment.status === 'AWAITING_VERIFICATION');

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Payment Verification</h2>
      {pendingBankTransfers.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-8 text-center">
          <Check className="mx-auto text-green-500 mb-2" size={40} />
          <p className="text-gray-600 dark:text-gray-400">All payments verified. No pending bank transfers.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingBankTransfers.map(order => (
            <div key={order.id} className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{order.orderNumber}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Reference: <span className="font-mono font-medium">{order.payment.reference}</span></p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white mt-2">{formatPKR(order.total)}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => verifyPayment(order.id)}
                    className="flex items-center space-x-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Check size={16} /> Verify Payment
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DrugOrdersTab() {
  const { drugOrders, updateDrugOrderStatus } = useStore();
  const [quoteInput, setQuoteInput] = useState<Record<string, string>>({});
  const [notesInput, setNotesInput] = useState<Record<string, string>>({});

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Custom Orders</h2>
      {drugOrders.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No custom orders yet.</p>
      ) : (
        <div className="space-y-4">
          {drugOrders.map(order => (
            <div key={order.id} className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{order.itemType}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Ref: {order.reference} • {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{order.fullName} • {order.email} • {order.phone}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  order.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-700' :
                  order.status === 'UNDER_REVIEW' ? 'bg-yellow-100 text-yellow-700' :
                  order.status === 'QUOTED' ? 'bg-purple-100 text-purple-700' :
                  order.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                  order.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                  order.status === 'CONVERTED' ? 'bg-indigo-100 text-indigo-700' :
                  'bg-gray-100 text-gray-700'
                }`}>{order.status}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-4">
                <div><span className="text-gray-500 dark:text-gray-400">Qty:</span> <span className="font-medium text-gray-900 dark:text-white">{order.quantity}</span></div>
                {order.size && <div><span className="text-gray-500 dark:text-gray-400">Size:</span> <span className="font-medium text-gray-900 dark:text-white">{order.size}</span></div>}
                {order.fabric && <div><span className="text-gray-500 dark:text-gray-400">Fabric:</span> <span className="font-medium text-gray-900 dark:text-white">{order.fabric}</span></div>}
                {order.color && <div><span className="text-gray-500 dark:text-gray-400">Color:</span> <span className="font-medium text-gray-900 dark:text-white">{order.color}</span></div>}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2"><strong>Address:</strong> {order.deliveryAddress}</p>
              {order.notes && <p className="text-sm text-gray-600 dark:text-gray-300 mb-4"><strong>Notes:</strong> {order.notes}</p>}
              {order.quotedPrice && <p className="text-sm font-bold text-green-700 dark:text-green-400 mb-4">Quoted: {formatPKR(order.quotedPrice)}</p>}

              {/* Admin Actions */}
              <div className="border-t dark:border-gray-700 pt-4 mt-4">
                <div className="flex flex-wrap gap-2">
                  {order.status === 'SUBMITTED' && (
                    <button onClick={() => updateDrugOrderStatus(order.id, 'UNDER_REVIEW')} className="px-3 py-1.5 text-xs bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200">Start Review</button>
                  )}
                  {(order.status === 'UNDER_REVIEW' || order.status === 'SUBMITTED') && (
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        placeholder="Quote price"
                        value={quoteInput[order.id] || ''}
                        onChange={e => setQuoteInput({...quoteInput, [order.id]: e.target.value})}
                        className="border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-2 py-1 text-sm w-32"
                      />
                      <button
                        onClick={() => {
                          const price = parseFloat(quoteInput[order.id] || '0');
                          if (price > 0) {
                            updateDrugOrderStatus(order.id, 'QUOTED', price, notesInput[order.id]);
                          }
                        }}
                        className="px-3 py-1.5 text-xs bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
                      >Send Quote</button>
                    </div>
                  )}
                  {order.status === 'QUOTED' && (
                    <>
                      <button onClick={() => updateDrugOrderStatus(order.id, 'APPROVED')} className="px-3 py-1.5 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200">Approve</button>
                      <button onClick={() => updateDrugOrderStatus(order.id, 'REJECTED')} className="px-3 py-1.5 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200">Reject</button>
                    </>
                  )}
                  {order.status === 'APPROVED' && (
                    <button onClick={() => updateDrugOrderStatus(order.id, 'CONVERTED')} className="px-3 py-1.5 text-xs bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200">Convert to Order</button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Admin notes..."
                  value={notesInput[order.id] || ''}
                  onChange={e => setNotesInput({...notesInput, [order.id]: e.target.value})}
                  className="mt-2 w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-1.5 text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ShippingTab() {
  const { shippingZones, settings, updateSettings } = useStore();
  const [threshold, setThreshold] = useState(settings.freeShippingThreshold.toString());

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Shipping Configuration</h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6 mb-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Free Shipping Threshold</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-gray-600 dark:text-gray-400">Rs.</span>
            <input type="number" value={threshold} onChange={e => setThreshold(e.target.value)} className="border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 w-32" />
          </div>
          <button onClick={() => updateSettings({ freeShippingThreshold: parseFloat(threshold) || 0 })} className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm">Save</button>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Orders above this amount get free standard shipping.</p>
      </div>

      <div className="space-y-4">
        {shippingZones.map(zone => (
          <div key={zone.id} className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{zone.name}</h3>
            <div className="space-y-2">
              {zone.methods.map(method => (
                <div key={method.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{method.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{method.minDays}-{method.maxDays} days</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white">{formatPKR(method.rate)}</p>
                    {method.freeOverAmount && <p className="text-xs text-green-600 dark:text-green-400">Free over {formatPKR(method.freeOverAmount)}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CustomersTab() {
  const { orders } = useStore();

  const customers = orders.reduce((acc, order) => {
    const key = order.shippingAddress.fullName;
    if (!acc[key]) {
      acc[key] = { name: key, email: '', orders: 0, totalSpent: 0 };
    }
    acc[key].orders += 1;
    acc[key].totalSpent += order.total;
    return acc;
  }, {} as Record<string, { name: string; email: string; orders: number; totalSpent: number }>);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Customers</h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700 text-left text-gray-500 dark:text-gray-400">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Orders</th>
              <th className="px-4 py-3 font-medium text-right">Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(customers).map((customer, i) => (
              <tr key={i} className="border-b dark:border-gray-700">
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{customer.name}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{customer.orders}</td>
                <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-white">{formatPKR(customer.totalSpent)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MediaManagerTab() {
  const { media, addMedia, removeMedia } = useStore();
  const [uploading, setUploading] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        addMedia({
          id: `media-${Date.now()}-${Math.random()}`,
          url,
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' : 'document',
          size: file.size,
          uploadedAt: new Date().toISOString(),
        });
      };
      reader.readAsDataURL(file);
    });
    setTimeout(() => setUploading(false), 1000);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Media Library</h2>
        <label className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm cursor-pointer">
          <Upload size={16} className="inline mr-2" />
          Upload Files
          <input type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" />
        </label>
      </div>

      {uploading && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
          <p className="text-amber-800 dark:text-amber-200">Uploading files...</p>
        </div>
      )}

      {media.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-12 text-center">
          <ImageIcon className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
          <p className="text-gray-500 dark:text-gray-400">No media files yet. Upload images to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map(item => (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden group">
              <div className="aspect-square bg-gray-100 dark:bg-gray-700 relative">
                {item.type === 'image' ? (
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl">📄</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => removeMedia(item.id)}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{formatSize(item.size)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SettingsTab() {
  const { settings, updateSettings } = useStore();
  const [bankDetails, setBankDetails] = useState(settings.bankTransferDetails);
  const [storeName, setStoreName] = useState(settings.storeName);
  const [storeEmail, setStoreEmail] = useState(settings.storeEmail);
  const [storePhone, setStorePhone] = useState(settings.storePhone);
  const [logo, setLogo] = useState(settings.logo || '');

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      setLogo(url);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Store Settings</h2>
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">General</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Store Name</label>
              <input type="text" value={storeName} onChange={e => setStoreName(e.target.value)} className="border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 w-full max-w-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Store Email</label>
              <input type="email" value={storeEmail} onChange={e => setStoreEmail(e.target.value)} className="border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 w-full max-w-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Store Phone</label>
              <input type="tel" value={storePhone} onChange={e => setStorePhone(e.target.value)} className="border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 w-full max-w-md" />
            </div>
            <button onClick={() => updateSettings({ storeName, storeEmail, storePhone })} className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm">Save</button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Store Logo</h3>
          <div className="space-y-4">
            {logo && (
              <div className="mb-4">
                <img src={logo} alt="Store Logo" className="h-20 object-contain" />
              </div>
            )}
            <label className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm cursor-pointer">
              <Upload size={16} className="mr-2" />
              Upload Logo
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
            {logo && (
              <button onClick={() => { setLogo(''); updateSettings({ logo: '' }); }} className="ml-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm">Remove Logo</button>
            )}
            {logo && (
              <button onClick={() => updateSettings({ logo })} className="ml-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm">Save Logo</button>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Bank Transfer Details</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">These details are shown to customers who choose bank transfer at checkout.</p>
          <textarea value={bankDetails} onChange={e => setBankDetails(e.target.value)} rows={8} className="border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 w-full font-mono text-sm" />
          <button onClick={() => updateSettings({ bankTransferDetails: bankDetails })} className="mt-3 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm">Save</button>
        </div>
      </div>
    </div>
  );
}
