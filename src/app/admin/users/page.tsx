'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, X } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'admin' });

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    const res = await fetch('/api/users');
    const data = await res.json();
    setUsers(data);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    setShowForm(false);
    setFormData({ name: '', email: '', password: '', role: 'admin' });
    fetchUsers();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user?')) return;
    await fetch('/api/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    fetchUsers();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-serif text-[#2D2A26]">Users</h2>
        <button onClick={() => setShowForm(true)} className="bg-[#C4A265] text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-[#D4B275]">
          <Plus size={18} /> Add User
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#F0E8DE] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#F5EDE4]">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-medium text-[#5C4A32]">Name</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-[#5C4A32]">Email</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-[#5C4A32]">Role</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-[#5C4A32]">Created</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-[#5C4A32]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-t border-[#F0E8DE] hover:bg-[#FDF8F3]">
                <td className="px-6 py-4 text-sm font-medium text-[#2D2A26]">{user.name}</td>
                <td className="px-6 py-4 text-sm text-[#5C4A32]">{user.email}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#C4A265]/10 text-[#C4A265] capitalize">{user.role}</span>
                </td>
                <td className="px-6 py-4 text-sm text-[#5C4A32]">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <button onClick={() => handleDelete(user.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="border-b border-[#E8DFD5] px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-serif text-[#2D2A26]">Add User</h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-[#F5EDE4] rounded-lg"><X size={20} /></button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#5C4A32] mb-2">Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#5C4A32] mb-2">Email</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="w-full px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#5C4A32] mb-2">Password</label>
                <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required className="w-full px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#5C4A32] mb-2">Role</label>
                <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]">
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="support">Support</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 border border-[#E8DFD5] rounded-lg">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-[#C4A265] text-white rounded-lg hover:bg-[#D4B275]">Create User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
