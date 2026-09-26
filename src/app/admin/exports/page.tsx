'use client';

import { useState, useEffect } from 'react';
import { Download, FileText, RefreshCw, Trash2 } from 'lucide-react';

export default function AdminExports() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/exports?type=history');
      const data = await res.json();
      setHistory(data);
    } catch (error) {
      console.error('Failed to fetch export history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type: string, format: 'csv' | 'json' = 'csv') => {
    try {
      setExporting(true);
      const res = await fetch(`/api/exports?type=${type}&format=${format}`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}-export-${Date.now()}.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      // Refresh history
      fetchHistory();
    } catch (error) {
      alert('Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  const handleClean = async () => {
    if (!confirm('Delete exports older than 30 days?')) return;

    try {
      const res = await fetch('/api/exports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clean' }),
      });

      if (res.ok) {
        const data = await res.json();
        alert(`Cleaned ${data.deletedCount} old exports`);
        fetchHistory();
      }
    } catch (error) {
      alert('Failed to clean exports');
    }
  };

  const exportTypes = [
    { type: 'products', label: 'Products', description: 'Export all products with variants' },
    { type: 'orders', label: 'Orders', description: 'Export all orders with customer details' },
    { type: 'order-items', label: 'Order Items', description: 'Export detailed order items' },
    { type: 'customers', label: 'Customers', description: 'Export customer data and statistics' },
    { type: 'inventory', label: 'Inventory', description: 'Export inventory levels and values' },
    { type: 'analytics', label: 'Analytics', description: 'Export sales and performance data' },
    { type: 'all', label: 'All Data', description: 'Export everything in one file' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-serif text-[#2D2A26]">Data Export</h2>
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-[#F5EDE4] rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-serif text-[#2D2A26]">Data Export</h2>
        <div className="flex gap-2">
          <button
            onClick={handleClean}
            className="px-4 py-2 border border-[#E8DFD5] rounded-lg hover:bg-[#F5EDE4] flex items-center gap-2"
          >
            <Trash2 size={18} />
            Clean Old Exports
          </button>
          <button
            onClick={fetchHistory}
            className="px-4 py-2 border border-[#E8DFD5] rounded-lg hover:bg-[#F5EDE4] flex items-center gap-2"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>
      </div>

      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exportTypes.map(({ type, label, description }) => (
          <div key={type} className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-medium text-[#2D2A26] mb-1">{label}</h3>
                <p className="text-sm text-[#5C4A32]">{description}</p>
              </div>
              <FileText size={24} className="text-[#C4A265]" />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleExport(type, 'csv')}
                disabled={exporting}
                className="flex-1 px-4 py-2 bg-[#C4A265] text-white rounded-lg hover:bg-[#D4B275] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Download size={16} />
                CSV
              </button>
              <button
                onClick={() => handleExport(type, 'json')}
                disabled={exporting}
                className="flex-1 px-4 py-2 border border-[#E8DFD5] rounded-lg hover:bg-[#F5EDE4] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Download size={16} />
                JSON
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Export History */}
      <div className="bg-white rounded-2xl border border-[#F0E8DE] overflow-hidden">
        <div className="p-6 border-b border-[#F0E8DE]">
          <h3 className="text-xl font-medium text-[#2D2A26]">Export History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F5EDE4]">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-[#5C4A32]">Filename</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-[#5C4A32]">Type</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-[#5C4A32]">Format</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-[#5C4A32]">Size</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-[#5C4A32]">Created</th>
              </tr>
            </thead>
            <tbody>
              {history.map((file, index) => (
                <tr key={index} className="border-t border-[#F0E8DE] hover:bg-[#FDF8F3]">
                  <td className="px-6 py-4 text-sm text-[#2D2A26] font-mono">
                    {file.filename}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#5C4A32] capitalize">
                    {file.type}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-[#F5EDE4] rounded text-xs font-medium text-[#5C4A32] uppercase">
                      {file.format}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#5C4A32]">
                    {(file.size / 1024).toFixed(2)} KB
                  </td>
                  <td className="px-6 py-4 text-sm text-[#A09080]">
                    {new Date(file.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {history.length === 0 && (
          <div className="p-12 text-center text-[#A09080]">
            <Download size={48} className="mx-auto mb-3 opacity-50" />
            <p>No exports yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
