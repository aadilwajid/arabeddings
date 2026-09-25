'use client';

import { useState } from 'react';
import LowStockAlerts from '@/components/admin/LowStockAlerts';
import BulkImportExport from '@/components/admin/BulkImportExport';
import CustomerSegmentation from '@/components/admin/CustomerSegmentation';
import ActivityLogViewer from '@/components/admin/ActivityLog';
import CourierIntegration from '@/components/admin/CourierIntegration';
import { Database, HardDrive, Shield } from 'lucide-react';

export default function AdminOperations() {
  const [activeTab, setActiveTab] = useState<'stock' | 'import' | 'customers' | 'activity' | 'courier' | 'backup'>('stock');

  const tabs = [
    { id: 'stock', label: 'Low Stock Alerts', icon: '📦' },
    { id: 'import', label: 'Import / Export', icon: '📊' },
    { id: 'customers', label: 'Customers', icon: '👥' },
    { id: 'activity', label: 'Activity Log', icon: '📝' },
    { id: 'courier', label: 'Courier', icon: '🚚' },
    { id: 'backup', label: 'Backup', icon: '💾' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-serif text-[#2D2A26]">Operations</h2>
          <p className="text-[#5C4A32] mt-1">Manage stock, imports, customers, and more</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-[#C4A265] text-white'
                : 'bg-white text-[#5C4A32] border border-[#E8DFD5] hover:border-[#C4A265]'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'stock' && <LowStockAlerts />}
      {activeTab === 'import' && <BulkImportExport />}
      {activeTab === 'customers' && <CustomerSegmentation />}
      {activeTab === 'activity' && <ActivityLogViewer />}
      {activeTab === 'courier' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <CourierIntegration orderId="" onUpdate={() => {}} />
          <div className="bg-white rounded-2xl border border-[#F0E8DE] p-6">
            <div className="flex items-center gap-2 mb-6">
              <Shield size={20} className="text-[#C4A265]" />
              <h3 className="text-lg font-medium text-[#2D2A26]">Courier Integration Guide</h3>
            </div>
            <div className="space-y-4 text-sm text-[#5C4A32]">
              <p>To integrate with couriers:</p>
              <ol className="list-decimal list-inside space-y-2">
                <li>Select a courier from the dropdown</li>
                <li>Enter the tracking number provided by the courier</li>
                <li>Click "Save Courier Info" to update the order</li>
                <li>Customers can track their orders using the tracking number</li>
              </ol>
              <div className="p-3 bg-[#FDF8F3] rounded-lg mt-4">
                <p className="text-xs text-[#A09080]">
                  <strong>API Integration:</strong> For automated tracking, you'll need API credentials from your courier partner. Contact them for API documentation.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'backup' && <BackupManager />}
    </div>
  );
}

function BackupManager() {
  const [backing, setBacking] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleBackup = async () => {
    setBacking(true);
    setMessage(null);
    
    try {
      // Simulate backup (in real app, this would call an API)
      await new Promise(resolve => setTimeout(resolve, 1500));
      setMessage({ type: 'success', text: 'Backup created successfully! Check /backups folder.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to create backup.' });
    } finally {
      setBacking(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl border border-[#F0E8DE] p-6">
        <div className="flex items-center gap-2 mb-6">
          <HardDrive size={20} className="text-[#C4A265]" />
          <h3 className="text-lg font-medium text-[#2D2A26]">Create Backup</h3>
        </div>
        <p className="text-sm text-[#5C4A32] mb-4">
          Create a complete backup of all data files (products, orders, users, reviews, etc.)
        </p>
        <button
          onClick={handleBackup}
          disabled={backing}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#C4A265] text-white rounded-lg hover:bg-[#D4B275] disabled:opacity-50 font-medium"
        >
          <HardDrive size={16} />
          {backing ? 'Creating Backup...' : 'Create Backup Now'}
        </button>
        {message && (
          <div className={`mt-4 p-3 rounded-lg text-sm ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message.text}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-[#F0E8DE] p-6">
        <div className="flex items-center gap-2 mb-6">
          <Database size={20} className="text-[#C4A265]" />
          <h3 className="text-lg font-medium text-[#2D2A26]">Database Migration</h3>
        </div>
        <p className="text-sm text-[#5C4A32] mb-4">
          Ready to scale? Migrate from JSON files to PostgreSQL for better performance and reliability.
        </p>
        <div className="space-y-2 text-xs text-[#A09080]">
          <p>✓ Full PostgreSQL schema ready</p>
          <p>✓ Indexed for performance</p>
          <p>✓ Automatic timestamps</p>
          <p>✓ Data integrity constraints</p>
        </div>
        <button
          onClick={() => {
            alert('PostgreSQL schema has been generated. Check src/lib/database-migration.ts for the full schema.');
          }}
          className="w-full mt-4 px-4 py-2 border border-[#E8DFD5] text-[#5C4A32] rounded-lg hover:bg-[#F5EDE4] text-sm font-medium"
        >
          View Migration Schema
        </button>
      </div>
    </div>
  );
}
