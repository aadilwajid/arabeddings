'use client';

import { useState, useEffect } from 'react';
import { Webhook, Plus, Trash2, Edit, RefreshCw, AlertCircle } from 'lucide-react';

export default function AdminWebhooks() {
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [events, setEvents] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<any>(null);
  const [formData, setFormData] = useState({ url: '', events: [] as string[], secret: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [webhooksRes, eventsRes] = await Promise.all([
        fetch('/api/webhooks'),
        fetch('/api/webhooks?type=events'),
      ]);
      
      const webhooksData = await webhooksRes.json();
      const eventsData = await eventsRes.json();
      
      setWebhooks(webhooksData);
      setEvents(eventsData);
    } catch (error) {
      console.error('Failed to fetch webhooks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const res = await fetch('/api/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          url: formData.url,
          events: formData.events,
          secret: formData.secret || undefined,
        }),
      });

      if (res.ok) {
        alert('Webhook created successfully!');
        setShowForm(false);
        setFormData({ url: '', events: [], secret: '' });
        fetchData();
      }
    } catch (error) {
      alert('Failed to create webhook');
    }
  };

  const handleUpdate = async () => {
    if (!editingWebhook) return;

    try {
      const res = await fetch('/api/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          id: editingWebhook.id,
          url: formData.url,
          events: formData.events,
          secret: formData.secret || undefined,
        }),
      });

      if (res.ok) {
        alert('Webhook updated successfully!');
        setShowForm(false);
        setEditingWebhook(null);
        setFormData({ url: '', events: [], secret: '' });
        fetchData();
      }
    } catch (error) {
      alert('Failed to update webhook');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this webhook?')) return;

    try {
      const res = await fetch('/api/webhooks', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        alert('Webhook deleted successfully!');
        fetchData();
      }
    } catch (error) {
      alert('Failed to delete webhook');
    }
  };

  const handleEdit = (webhook: any) => {
    setEditingWebhook(webhook);
    setFormData({
      url: webhook.url,
      events: webhook.events,
      secret: webhook.secret,
    });
    setShowForm(true);
  };

  const toggleEvent = (event: string) => {
    setFormData(prev => ({
      ...prev,
      events: prev.events.includes(event)
        ? prev.events.filter(e => e !== event)
        : [...prev.events, event],
    }));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-serif text-[#2D2A26]">Webhooks</h2>
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-[#F5EDE4] rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-serif text-[#2D2A26]">Webhooks</h2>
        <button
          onClick={() => {
            setEditingWebhook(null);
            setFormData({ url: '', events: [], secret: '' });
            setShowForm(true);
          }}
          className="px-4 py-2 bg-[#C4A265] text-white rounded-lg hover:bg-[#D4B275] flex items-center gap-2"
        >
          <Plus size={18} />
          Add Webhook
        </button>
      </div>

      {/* Webhooks List */}
      <div className="space-y-4">
        {webhooks.map(webhook => (
          <div key={webhook.id} className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Webhook size={20} className={webhook.active ? 'text-green-500' : 'text-red-500'} />
                  <h3 className="font-medium text-[#2D2A26]">{webhook.url}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    webhook.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {webhook.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-sm text-[#A09080]">
                  Created: {new Date(webhook.createdAt).toLocaleDateString()}
                  {webhook.lastTriggered && ` | Last triggered: ${new Date(webhook.lastTriggered).toLocaleDateString()}`}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(webhook)}
                  className="p-2 hover:bg-[#F5EDE4] rounded-lg"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(webhook.id)}
                  className="p-2 hover:bg-red-50 text-red-500 rounded-lg"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {webhook.events.map((event: string) => (
                <span key={event} className="px-2 py-1 bg-[#F5EDE4] rounded text-xs text-[#5C4A32]">
                  {event}
                </span>
              ))}
            </div>

            {webhook.failureCount > 0 && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <AlertCircle size={16} className="text-red-500" />
                <span className="text-sm text-red-700">
                  {webhook.failureCount} failed deliveries
                </span>
              </div>
            )}
          </div>
        ))}

        {webhooks.length === 0 && (
          <div className="bg-white rounded-2xl p-12 border border-[#F0E8DE] text-center">
            <Webhook size={48} className="mx-auto mb-3 text-[#E8DFD5]" />
            <p className="text-[#A09080]">No webhooks configured</p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-xl font-serif text-[#2D2A26] mb-4">
              {editingWebhook ? 'Edit Webhook' : 'Create Webhook'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#5C4A32] mb-2">
                  Webhook URL *
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]"
                  placeholder="https://example.com/webhook"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5C4A32] mb-2">
                  Secret (Optional)
                </label>
                <input
                  type="text"
                  value={formData.secret}
                  onChange={(e) => setFormData({ ...formData, secret: e.target.value })}
                  className="w-full px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]"
                  placeholder="Leave empty to auto-generate"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5C4A32] mb-2">
                  Events *
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto border border-[#E8DFD5] rounded-lg p-3">
                  {Object.entries(events).map(([key, value]) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.events.includes(value as string)}
                        onChange={() => toggleEvent(value as string)}
                        className="rounded"
                      />
                      <span className="text-sm text-[#5C4A32]">{key}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingWebhook(null);
                  setFormData({ url: '', events: [], secret: '' });
                }}
                className="flex-1 px-4 py-2 border border-[#E8DFD5] rounded-lg hover:bg-[#F5EDE4]"
              >
                Cancel
              </button>
              <button
                onClick={editingWebhook ? handleUpdate : handleCreate}
                disabled={!formData.url || formData.events.length === 0}
                className="flex-1 px-4 py-2 bg-[#C4A265] text-white rounded-lg hover:bg-[#D4B275] disabled:opacity-50"
              >
                {editingWebhook ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
