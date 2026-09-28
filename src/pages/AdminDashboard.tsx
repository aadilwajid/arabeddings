import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart3, Package, ShoppingCart, CreditCard, Truck, Users, Settings, ClipboardList, ChevronDown, Check, X, Eye, TrendingUp, DollarSign } from 'lucide-react';
import { useStore } from '../store';
import { OrderStatus, DrugOrderStatus, PaymentStatus } from '../types';

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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'drug-orders', label: 'Custom Orders', icon: ClipboardList },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-lg font-bold text-gray-900">🛏️ LuxeBedding</Link>
              <span className="text-sm text-gray-500">/ Admin</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user.email}</span>
              <Link to="/" className="text-sm text-indigo-600 hover:underline">View Store</Link>
            </div>
          </div>
          {/* Tabs */}
          <div className="flex overflow-x-auto space-x-1 -mb-px">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
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
        {activeTab === 'overview' && <OverviewTab totalRevenue={totalRevenue} pendingOrders={pendingOrders} pendingPayments={pendingPayments} />}
        {activeTab === 'orders' && <OrdersTab />}
        {activeTab === 'products' && <ProductsTab />}
        {activeTab === 'payments' && <PaymentsTab />}
        {activeTab === 'drug-orders' && <DrugOrdersTab />}
        {activeTab === 'shipping' && <ShippingTab />}
        {activeTab === 'customers' && <CustomersTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>
    </div>
  );
}

function OverviewTab({ totalRevenue, pendingOrders, pendingPayments }: { totalRevenue: number; pendingOrders: number; pendingPayments: number }) {
  const { orders, products, drugOrders } = useStore();

  const stats = [
    { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'bg-green-50 text-green-600' },
    { label: 'Total Orders', value: orders.length, icon: ShoppingCart, color: 'bg-blue-50 text-blue-600' },
    { label: 'Pending Orders', value: pendingOrders, icon: Package, color: 'bg-yellow-50 text-yellow-600' },
    { label: 'Pending Payments', value: pendingPayments, icon: CreditCard, color: 'bg-red-50 text-red-600' },
    { label: 'Products', value: products.length, icon: Package, color: 'bg-purple-50 text-purple-600' },
    { label: 'Custom Orders', value: drugOrders.length, icon: ClipboardList, color: 'bg-indigo-50 text-indigo-600' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border p-4">
            <div className={`inline-flex p-2 rounded-lg ${stat.color} mb-2`}><stat.icon size={20} /></div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="pb-3 font-medium">Order</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Payment</th>
                <th className="pb-3 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map(order => (
                <tr key={order.id} className="border-b last:border-0">
                  <td className="py-3 font-medium text-gray-900">{order.orderNumber}</td>
                  <td className="py-3 text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="py-3"><StatusBadge status={order.status} /></td>
                  <td className="py-3"><PaymentBadge status={order.payment.status} /></td>
                  <td className="py-3 text-right font-medium">${order.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function OrdersTab() {
  const { orders, updateOrderStatus } = useStore();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const order = selectedOrder ? orders.find(o => o.id === selectedOrder) : null;
  const nextStatuses: Record<string, OrderStatus[]> = {
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
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Orders</h2>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-500">
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Total</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id} className={`border-b cursor-pointer hover:bg-gray-50 ${selectedOrder === o.id ? 'bg-indigo-50' : ''}`} onClick={() => setSelectedOrder(o.id)}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{o.orderNumber}</p>
                      <p className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                    <td className="px-4 py-3 text-right font-medium">${o.total.toFixed(2)}</td>
                    <td className="px-4 py-3"><Eye size={16} className="text-gray-400" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {order && (
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-bold text-lg text-gray-900 mb-4">{order.orderNumber}</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-gray-500">Customer</p>
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p className="text-gray-600">{order.shippingAddress.line1}, {order.shippingAddress.city}</p>
              </div>
              <div>
                <p className="text-gray-500">Items</p>
                {order.items.map(item => (
                  <p key={item.id} className="text-gray-700">{item.productName} ({item.variantName}) × {item.quantity} — ${item.total.toFixed(2)}</p>
                ))}
              </div>
              <div>
                <p className="text-gray-500">Payment</p>
                <p className="font-medium">{order.payment.method === 'COD' ? 'Cash on Delivery' : 'Bank Transfer'}</p>
                <PaymentBadge status={order.payment.status} />
                {order.payment.reference && <p className="text-xs text-gray-500 mt-1">Ref: {order.payment.reference}</p>}
              </div>
              <div>
                <p className="text-gray-500 mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {(nextStatuses[order.status] || []).map(status => (
                    <button
                      key={status}
                      onClick={() => updateOrderStatus(order.id, status)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg ${
                        status === 'CANCELLED' ? 'bg-red-100 text-red-700 hover:bg-red-200' :
                        'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
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
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Products ({products.length})</h2>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-gray-500">
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
                <tr key={p.id} className="border-b">
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <img src={p.images[0]?.url} alt="" className="w-10 h-10 rounded object-cover" />
                      <div>
                        <p className="font-medium text-gray-900">{p.name}</p>
                        <p className="text-xs text-gray-500">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{useStore.getState().categories.find(c => c.id === p.categoryId)?.name}</td>
                  <td className="px-4 py-3 text-gray-600">${Math.min(...prices).toFixed(2)} - ${Math.max(...prices).toFixed(2)}</td>
                  <td className="px-4 py-3 text-gray-600">{p.variants.length}</td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${totalStock < 20 ? 'text-red-600' : 'text-green-600'}`}>{totalStock}</span>
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
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Verification</h2>
      {pendingBankTransfers.length === 0 ? (
        <div className="bg-white rounded-xl border p-8 text-center">
          <Check className="mx-auto text-green-500 mb-2" size={40} />
          <p className="text-gray-600">All payments verified. No pending bank transfers.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingBankTransfers.map(order => (
            <div key={order.id} className="bg-white rounded-xl border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">{order.orderNumber}</h3>
                  <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600 mt-1">Reference: <span className="font-mono font-medium">{order.payment.reference}</span></p>
                  <p className="text-lg font-bold text-gray-900 mt-2">${order.total.toFixed(2)}</p>
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
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Custom / Drug Orders</h2>
      {drugOrders.length === 0 ? (
        <p className="text-gray-500">No custom orders yet.</p>
      ) : (
        <div className="space-y-4">
          {drugOrders.map(order => (
            <div key={order.id} className="bg-white rounded-xl border p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-900">{order.itemType}</h3>
                  <p className="text-sm text-gray-500">Ref: {order.reference} • {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600 mt-1">{order.fullName} • {order.email} • {order.phone}</p>
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
                <div><span className="text-gray-500">Qty:</span> <span className="font-medium">{order.quantity}</span></div>
                {order.size && <div><span className="text-gray-500">Size:</span> <span className="font-medium">{order.size}</span></div>}
                {order.fabric && <div><span className="text-gray-500">Fabric:</span> <span className="font-medium">{order.fabric}</span></div>}
                {order.color && <div><span className="text-gray-500">Color:</span> <span className="font-medium">{order.color}</span></div>}
              </div>
              <p className="text-sm text-gray-600 mb-2"><strong>Address:</strong> {order.deliveryAddress}</p>
              {order.notes && <p className="text-sm text-gray-600 mb-4"><strong>Notes:</strong> {order.notes}</p>}
              {order.quotedPrice && <p className="text-sm font-bold text-green-700 mb-4">Quoted: ${order.quotedPrice.toFixed(2)}</p>}

              {/* Admin Actions */}
              <div className="border-t pt-4 mt-4">
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
                        className="border rounded px-2 py-1 text-sm w-32"
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
                    <button onClick={() => updateDrugOrderStatus(order.id, 'CONVERTED')} className="px-3 py-1.5 text-xs bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200">Convert to Order</button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Admin notes..."
                  value={notesInput[order.id] || ''}
                  onChange={e => setNotesInput({...notesInput, [order.id]: e.target.value})}
                  className="mt-2 w-full border rounded px-3 py-1.5 text-sm"
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
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Configuration</h2>
      <div className="bg-white rounded-xl border p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Free Shipping Threshold</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">$</span>
            <input type="number" value={threshold} onChange={e => setThreshold(e.target.value)} className="border rounded-lg px-3 py-2 w-32" />
          </div>
          <button onClick={() => updateSettings({ freeShippingThreshold: parseFloat(threshold) || 0 })} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">Save</button>
        </div>
        <p className="text-sm text-gray-500 mt-2">Orders above this amount get free standard shipping.</p>
      </div>

      <div className="space-y-4">
        {shippingZones.map(zone => (
          <div key={zone.id} className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold text-gray-900 mb-3">{zone.name}</h3>
            <div className="space-y-2">
              {zone.methods.map(method => (
                <div key={method.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{method.name}</p>
                    <p className="text-sm text-gray-500">{method.minDays}-{method.maxDays} days</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">${method.rate.toFixed(2)}</p>
                    {method.freeOverAmount && <p className="text-xs text-green-600">Free over ${method.freeOverAmount}</p>}
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

  // Group orders by customer
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
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Customers</h2>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-gray-500">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Orders</th>
              <th className="px-4 py-3 font-medium text-right">Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(customers).map((customer, i) => (
              <tr key={i} className="border-b">
                <td className="px-4 py-3 font-medium text-gray-900">{customer.name}</td>
                <td className="px-4 py-3 text-gray-600">{customer.orders}</td>
                <td className="px-4 py-3 text-right font-medium">${customer.totalSpent.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SettingsTab() {
  const { settings, updateSettings } = useStore();
  const [bankDetails, setBankDetails] = useState(settings.bankTransferDetails);
  const [storeName, setStoreName] = useState(settings.storeName);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Store Settings</h2>
      <div className="space-y-6">
        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-semibold text-gray-900 mb-4">General</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
              <input type="text" value={storeName} onChange={e => setStoreName(e.target.value)} className="border rounded-lg px-3 py-2 w-full max-w-md" />
            </div>
            <button onClick={() => updateSettings({ storeName })} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">Save</button>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Bank Transfer Details</h3>
          <p className="text-sm text-gray-500 mb-3">These details are shown to customers who choose bank transfer at checkout.</p>
          <textarea value={bankDetails} onChange={e => setBankDetails(e.target.value)} rows={8} className="border rounded-lg px-3 py-2 w-full font-mono text-sm" />
          <button onClick={() => updateSettings({ bankTransferDetails: bankDetails })} className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">Save</button>
        </div>
      </div>
    </div>
  );
}

// Utility Components
function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    'PENDING': 'bg-yellow-100 text-yellow-700',
    'CONFIRMED': 'bg-indigo-100 text-indigo-700',
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
