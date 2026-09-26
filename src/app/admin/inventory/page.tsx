'use client';

import { useState, useEffect } from 'react';
import { Package, AlertTriangle, TrendingDown, RefreshCw, Download } from 'lucide-react';

interface InventoryItem {
  product: any;
  variant: any;
  stock: number;
}

export default function AdminInventory() {
  const [summary, setSummary] = useState<any>(null);
  const [lowStock, setLowStock] = useState<InventoryItem[]>([]);
  const [outOfStock, setOutOfStock] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [restockModal, setRestockModal] = useState<{ product: any; variant: any } | null>(null);
  const [restockQuantity, setRestockQuantity] = useState('');
  const [restockReason, setRestockReason] = useState('');

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await fetch('/api/inventory');
      const data = await res.json();
      setSummary(data.summary);
      setLowStock(data.lowStock);
      setOutOfStock(data.outOfStock);
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestock = async () => {
    if (!restockModal || !restockQuantity) return;

    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'restock',
          productId: restockModal.product.id,
          variantId: restockModal.variant.id,
          quantity: parseInt(restockQuantity),
          reason: restockReason || 'Manual restock',
        }),
      });

      if (res.ok) {
        alert('Stock updated successfully!');
        setRestockModal(null);
        setRestockQuantity('');
        setRestockReason('');
        fetchInventory();
      }
    } catch (error) {
      alert('Failed to update stock');
    }
  };

  const handleExportReport = async () => {
    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'report' }),
      });

      const data = await res.json();
      const blob = new Blob([data.report], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inventory-report-${Date.now()}.txt`;
      a.click();
    } catch (error) {
      alert('Failed to export report');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-serif text-[#2D2A26]">Inventory Management</h2>
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-[#F5EDE4] rounded"></div>
          <div className="h-64 bg-[#F5EDE4] rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-serif text-[#2D2A26]">Inventory Management</h2>
        <div className="flex gap-2">
          <button
            onClick={handleExportReport}
            className="px-4 py-2 bg-[#C4A265] text-white rounded-lg hover:bg-[#D4B275] flex items-center gap-2"
          >
            <Download size={18} />
            Export Report
          </button>
          <button
            onClick={fetchInventory}
            className="px-4 py-2 border border-[#E8DFD5] rounded-lg hover:bg-[#F5EDE4] flex items-center gap-2"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
          <div className="flex items-center justify-between mb-2">
            <Package className="text-[#C4A265]" size={24} />
          </div>
          <p className="text-3xl font-bold text-[#2D2A26]">{summary.totalProducts}</p>
          <p className="text-sm text-[#5C4A32]">Total Products</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
          <div className="flex items-center justify-between mb-2">
            <Package className="text-blue-500" size={24} />
          </div>
          <p className="text-3xl font-bold text-[#2D2A26]">{summary.totalStock}</p>
          <p className="text-sm text-[#5C4A32]">Total Stock</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
          <div className="flex items-center justify-between mb-2">
            <TrendingDown className="text-green-500" size={24} />
          </div>
          <p className="text-3xl font-bold text-[#2D2A26]">Rs {summary.totalValue.toLocaleString()}</p>
          <p className="text-sm text-[#5C4A32]">Stock Value</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="text-yellow-500" size={24} />
          </div>
          <p className="text-3xl font-bold text-[#2D2A26]">{summary.lowStockItems}</p>
          <p className="text-sm text-[#5C4A32]">Low Stock</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="text-red-500" size={24} />
          </div>
          <p className="text-3xl font-bold text-[#2D2A26]">{summary.outOfStockItems}</p>
          <p className="text-sm text-[#5C4A32]">Out of Stock</p>
        </div>
      </div>

      {/* Out of Stock Items */}
      {outOfStock.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#F0E8DE] overflow-hidden">
          <div className="p-6 border-b border-[#F0E8DE] bg-red-50">
            <h3 className="text-xl font-medium text-red-800 flex items-center gap-2">
              <AlertTriangle size={20} />
              Out of Stock Items ({outOfStock.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F5EDE4]">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-[#5C4A32]">Product</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-[#5C4A32]">Variant</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-[#5C4A32]">SKU</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-[#5C4A32]">Price</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-[#5C4A32]">Action</th>
                </tr>
              </thead>
              <tbody>
                {outOfStock.map((item, index) => (
                  <tr key={index} className="border-t border-[#F0E8DE]">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={item.product.mainImage} alt={item.product.name} className="w-12 h-12 object-cover rounded" />
                        <span className="font-medium text-[#2D2A26]">{item.product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#5C4A32]">
                      {item.variant.size} - {item.variant.type}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#5C4A32] font-mono">
                      {item.variant.sku}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#5C4A32]">
                      Rs {item.variant.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setRestockModal(item)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                      >
                        Restock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Low Stock Items */}
      {lowStock.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#F0E8DE] overflow-hidden">
          <div className="p-6 border-b border-[#F0E8DE] bg-yellow-50">
            <h3 className="text-xl font-medium text-yellow-800 flex items-center gap-2">
              <AlertTriangle size={20} />
              Low Stock Items ({lowStock.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F5EDE4]">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-[#5C4A32]">Product</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-[#5C4A32]">Variant</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-[#5C4A32]">Stock</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-[#5C4A32]">SKU</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-[#5C4A32]">Action</th>
                </tr>
              </thead>
              <tbody>
                {lowStock.map((item, index) => (
                  <tr key={index} className="border-t border-[#F0E8DE]">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={item.product.mainImage} alt={item.product.name} className="w-12 h-12 object-cover rounded" />
                        <span className="font-medium text-[#2D2A26]">{item.product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#5C4A32]">
                      {item.variant.size} - {item.variant.type}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        item.stock === 0 ? 'bg-red-100 text-red-700' :
                        item.stock <= 5 ? 'bg-orange-100 text-orange-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {item.stock} units
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#5C4A32] font-mono">
                      {item.variant.sku}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setRestockModal(item)}
                        className="px-3 py-1 bg-[#C4A265] text-white rounded hover:bg-[#D4B275] text-sm"
                      >
                        Restock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Restock Modal */}
      {restockModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-serif text-[#2D2A26] mb-4">Restock Product</h3>
            
            <div className="mb-4 p-4 bg-[#FDF8F3] rounded-lg">
              <p className="font-medium text-[#2D2A26]">{restockModal.product.name}</p>
              <p className="text-sm text-[#5C4A32]">
                {restockModal.variant.size} - {restockModal.variant.type}
              </p>
              <p className="text-sm text-[#A09080]">Current stock: {restockModal.variant.stock} units</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#5C4A32] mb-2">
                  Quantity to Add *
                </label>
                <input
                  type="number"
                  value={restockQuantity}
                  onChange={(e) => setRestockQuantity(e.target.value)}
                  min="1"
                  className="w-full px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]"
                  placeholder="Enter quantity"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5C4A32] mb-2">
                  Reason (Optional)
                </label>
                <input
                  type="text"
                  value={restockReason}
                  onChange={(e) => setRestockReason(e.target.value)}
                  className="w-full px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]"
                  placeholder="e.g., Supplier delivery, Manual count"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setRestockModal(null);
                  setRestockQuantity('');
                  setRestockReason('');
                }}
                className="flex-1 px-4 py-2 border border-[#E8DFD5] rounded-lg hover:bg-[#F5EDE4]"
              >
                Cancel
              </button>
              <button
                onClick={handleRestock}
                disabled={!restockQuantity}
                className="flex-1 px-4 py-2 bg-[#C4A265] text-white rounded-lg hover:bg-[#D4B275] disabled:opacity-50"
              >
                Restock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
