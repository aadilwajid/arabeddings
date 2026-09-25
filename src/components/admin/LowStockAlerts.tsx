'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Package, TrendingDown } from 'lucide-react';
import { Product } from '@/types';

interface LowStockAlert {
  product: Product;
  variant: any;
  stockLevel: number;
  severity: 'critical' | 'warning' | 'low';
}

export default function LowStockAlerts() {
  const [alerts, setAlerts] = useState<LowStockAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const products: Product[] = await res.json();
      
      const lowStockItems: LowStockAlert[] = [];
      
      products.forEach(product => {
        product.variants.forEach(variant => {
          if (variant.stock <= 10) {
            let severity: 'critical' | 'warning' | 'low' = 'low';
            if (variant.stock <= 3) severity = 'critical';
            else if (variant.stock <= 5) severity = 'warning';
            
            lowStockItems.push({
              product,
              variant,
              stockLevel: variant.stock,
              severity
            });
          }
        });
      });
      
      // Sort by severity
      lowStockItems.sort((a, b) => {
        const severityOrder = { critical: 0, warning: 1, low: 2 };
        return severityOrder[a.severity] - severityOrder[b.severity];
      });
      
      setAlerts(lowStockItems);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const criticalCount = alerts.filter(a => a.severity === 'critical').length;
  const warningCount = alerts.filter(a => a.severity === 'warning').length;

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-[#F0E8DE] p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-[#F5EDE4] rounded w-1/3" />
          <div className="h-20 bg-[#F5EDE4] rounded" />
        </div>
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#F0E8DE] p-6">
        <div className="flex items-center gap-2 mb-4">
          <Package size={20} className="text-green-500" />
          <h3 className="text-lg font-medium text-[#2D2A26]">Stock Status</h3>
        </div>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Package size={32} className="text-green-500" />
          </div>
          <p className="text-[#5C4A32] font-medium">All products are well-stocked!</p>
          <p className="text-sm text-[#A09080] mt-1">No low stock alerts at the moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#F0E8DE] p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle size={20} className="text-orange-500" />
          <h3 className="text-lg font-medium text-[#2D2A26]">Low Stock Alerts</h3>
        </div>
        <div className="flex items-center gap-2">
          {criticalCount > 0 && (
            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
              {criticalCount} Critical
            </span>
          )}
          {warningCount > 0 && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
              {warningCount} Warning
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {alerts.map((alert, index) => (
          <div
            key={`${alert.product.id}-${alert.variant.id}-${index}`}
            className={`p-3 rounded-lg border-l-4 ${
              alert.severity === 'critical'
                ? 'bg-red-50 border-red-500'
                : alert.severity === 'warning'
                ? 'bg-yellow-50 border-yellow-500'
                : 'bg-orange-50 border-orange-500'
            }`}
          >
            <div className="flex items-start gap-3">
              <img
                src={alert.product.mainImage}
                alt={alert.product.name}
                className="w-12 h-12 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#2D2A26] truncate">
                  {alert.product.name}
                </p>
                <p className="text-xs text-[#A09080]">
                  {alert.variant.size} - {alert.variant.type}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <TrendingDown size={14} className={
                    alert.severity === 'critical' ? 'text-red-500' :
                    alert.severity === 'warning' ? 'text-yellow-500' : 'text-orange-500'
                  } />
                  <span className={`text-sm font-semibold ${
                    alert.severity === 'critical' ? 'text-red-700' :
                    alert.severity === 'warning' ? 'text-yellow-700' : 'text-orange-700'
                  }`}>
                    {alert.stockLevel} units left
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-[#E8DFD5]">
        <p className="text-xs text-[#A09080] text-center">
          Showing {alerts.length} low stock items • Threshold: 10 units
        </p>
      </div>
    </div>
  );
}
