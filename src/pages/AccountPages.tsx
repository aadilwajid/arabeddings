import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Heart, MapPin, Settings, LogOut, Clock } from 'lucide-react';
import { useStore } from '../store';

export default function AccountPage() {
  const { user, orders, drugOrders, wishlist, addresses, logout } = useStore();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const recentOrders = orders.filter(o => o.userId === user.id).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user.name}</p>
        </div>
        <button onClick={() => { logout(); navigate('/'); }} className="flex items-center space-x-2 text-red-600 hover:text-red-700">
          <LogOut size={18} /><span>Sign Out</span>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Link to="/account/orders" className="bg-white rounded-xl border p-4 hover:shadow-md transition-shadow">
          <Package className="text-indigo-600 mb-2" size={24} />
          <p className="text-2xl font-bold text-gray-900">{orders.filter(o => o.userId === user.id).length}</p>
          <p className="text-sm text-gray-500">Orders</p>
        </Link>
        <Link to="/account/drug-orders" className="bg-white rounded-xl border p-4 hover:shadow-md transition-shadow">
          <Clock className="text-purple-600 mb-2" size={24} />
          <p className="text-2xl font-bold text-gray-900">{drugOrders.filter(o => o.userId === user.id).length}</p>
          <p className="text-sm text-gray-500">Custom Orders</p>
        </Link>
        <Link to="/wishlist" className="bg-white rounded-xl border p-4 hover:shadow-md transition-shadow">
          <Heart className="text-red-500 mb-2" size={24} />
          <p className="text-2xl font-bold text-gray-900">{wishlist.length}</p>
          <p className="text-sm text-gray-500">Wishlist</p>
        </Link>
        <Link to="/account/addresses" className="bg-white rounded-xl border p-4 hover:shadow-md transition-shadow">
          <MapPin className="text-green-600 mb-2" size={24} />
          <p className="text-2xl font-bold text-gray-900">{addresses.length}</p>
          <p className="text-sm text-gray-500">Addresses</p>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <Link to="/account/orders" className="text-indigo-600 text-sm hover:underline">View All</Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-gray-500 text-sm">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{order.orderNumber}</p>
                    <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()} • {order.items.length} item(s)</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">${order.total.toFixed(2)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                      order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>{order.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Info</h2>
          <div className="space-y-3 text-sm">
            <div><span className="text-gray-500">Name:</span> <span className="font-medium text-gray-900">{user.name}</span></div>
            <div><span className="text-gray-500">Email:</span> <span className="font-medium text-gray-900">{user.email}</span></div>
            {user.phone && <div><span className="text-gray-500">Phone:</span> <span className="font-medium text-gray-900">{user.phone}</span></div>}
            <div><span className="text-gray-500">Member since:</span> <span className="font-medium text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</span></div>
          </div>
          <div className="mt-6 space-y-2">
            <Link to="/account/addresses" className="flex items-center space-x-2 text-sm text-gray-700 hover:text-indigo-600">
              <MapPin size={16} /> Manage Addresses
            </Link>
            <Link to="/account/drug-orders" className="flex items-center space-x-2 text-sm text-gray-700 hover:text-indigo-600">
              <Clock size={16} /> Custom Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AccountOrdersPage() {
  const { user, orders } = useStore();
  if (!user) return null;

  const userOrders = orders.filter(o => o.userId === user.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
      {userOrders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500">No orders yet.</p>
          <Link to="/products" className="mt-4 text-indigo-600 hover:underline">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {userOrders.map(order => (
            <div key={order.id} className="bg-white rounded-xl border p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-900">{order.orderNumber}</h3>
                  <p className="text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-gray-900">${order.total.toFixed(2)}</p>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                    order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                    order.status === 'CONFIRMED' ? 'bg-indigo-100 text-indigo-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>{order.status}</span>
                </div>
              </div>
              <div className="space-y-2">
                {order.items.map(item => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{item.productName} <span className="text-gray-400">({item.variantName})</span> × {item.quantity}</span>
                    <span className="font-medium">${item.total.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              {/* Status Timeline */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center space-x-2">
                  {order.statusHistory.map((h, i) => (
                    <React.Fragment key={h.id}>
                      <div className={`w-2.5 h-2.5 rounded-full ${i === order.statusHistory.length - 1 ? 'bg-indigo-600' : 'bg-green-400'}`} />
                      {i < order.statusHistory.length - 1 && <div className="flex-1 h-0.5 bg-green-300 max-w-[2rem]" />}
                    </React.Fragment>
                  ))}
                  <span className="text-xs text-gray-500 ml-2">{order.statusHistory[order.statusHistory.length - 1]?.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function AccountDrugOrdersPage() {
  const { user, drugOrders } = useStore();
  if (!user) return null;

  const userDrugOrders = drugOrders.filter(o => o.userId === user.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Custom Orders</h1>
        <Link to="/drug-order" className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">New Request</Link>
      </div>
      {userDrugOrders.length === 0 ? (
        <div className="text-center py-16">
          <Clock className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500">No custom orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {userDrugOrders.map(order => (
            <div key={order.id} className="bg-white rounded-xl border p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-900">{order.itemType}</h3>
                  <p className="text-sm text-gray-500">Ref: {order.reference} • {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  order.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-700' :
                  order.status === 'UNDER_REVIEW' ? 'bg-yellow-100 text-yellow-700' :
                  order.status === 'QUOTED' ? 'bg-purple-100 text-purple-700' :
                  order.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                  order.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>{order.status}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div><span className="text-gray-500">Qty:</span> <span className="font-medium">{order.quantity}</span></div>
                {order.size && <div><span className="text-gray-500">Size:</span> <span className="font-medium">{order.size}</span></div>}
                {order.fabric && <div><span className="text-gray-500">Fabric:</span> <span className="font-medium">{order.fabric}</span></div>}
                {order.quotedPrice && <div><span className="text-gray-500">Quote:</span> <span className="font-bold text-green-700">${order.quotedPrice.toFixed(2)}</span></div>}
              </div>
              {order.adminNotes && (
                <div className="mt-3 bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600"><strong>Admin Note:</strong> {order.adminNotes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function AccountAddressesPage() {
  const { addresses, addAddress, removeAddress, user } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ fullName: '', phone: '', line1: '', city: '', state: '', postalCode: '', country: 'US' });

  if (!user) return null;

  const handleAdd = () => {
    if (!form.fullName || !form.line1 || !form.city) return;
    addAddress({ id: `addr-${Date.now()}`, userId: user.id, ...form, isDefault: addresses.length === 0 });
    setShowForm(false);
    setForm({ fullName: '', phone: '', line1: '', city: '', state: '', postalCode: '', country: 'US' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Addresses</h1>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">
          {showForm ? 'Cancel' : '+ Add Address'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border p-6 mb-6">
          <h3 className="font-semibold mb-4">New Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Full Name *" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} className="border rounded-lg px-3 py-2" />
            <input type="tel" placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="border rounded-lg px-3 py-2" />
            <input type="text" placeholder="Address Line 1 *" value={form.line1} onChange={e => setForm({...form, line1: e.target.value})} className="md:col-span-2 border rounded-lg px-3 py-2" />
            <input type="text" placeholder="City *" value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="border rounded-lg px-3 py-2" />
            <input type="text" placeholder="State" value={form.state} onChange={e => setForm({...form, state: e.target.value})} className="border rounded-lg px-3 py-2" />
            <input type="text" placeholder="Postal Code" value={form.postalCode} onChange={e => setForm({...form, postalCode: e.target.value})} className="border rounded-lg px-3 py-2" />
            <select value={form.country} onChange={e => setForm({...form, country: e.target.value})} className="border rounded-lg px-3 py-2">
              <option value="US">United States</option>
              <option value="CA">Canada</option>
            </select>
          </div>
          <button onClick={handleAdd} className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Save Address</button>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {addresses.map(addr => (
          <div key={addr.id} className="bg-white rounded-xl border p-4">
            {addr.isDefault && <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">Default</span>}
            <p className="font-medium text-gray-900 mt-2">{addr.fullName}</p>
            <p className="text-sm text-gray-600">{addr.line1}{addr.line2 && `, ${addr.line2}`}</p>
            <p className="text-sm text-gray-600">{addr.city}, {addr.state} {addr.postalCode}</p>
            <p className="text-sm text-gray-500">{addr.phone}</p>
            <button onClick={() => removeAddress(addr.id)} className="mt-3 text-sm text-red-500 hover:underline">Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}
