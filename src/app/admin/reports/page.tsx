'use client';

import { useState, useEffect } from 'react';
import { FileText, Download, Calendar, TrendingUp, DollarSign, ShoppingBag, Users } from 'lucide-react';

export default function AdminReports() {
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  const [reportType, setReportType] = useState<'sales' | 'products' | 'customers' | 'inventory'>('sales');

  const reports = {
    sales: {
      title: 'Sales Report',
      metrics: [
        { label: 'Total Revenue', value: 'Rs 245,000', change: '+12%' },
        { label: 'Total Orders', value: '48', change: '+8%' },
        { label: 'Average Order Value', value: 'Rs 5,104', change: '+4%' },
        { label: 'Conversion Rate', value: '3.2%', change: '+0.5%' },
      ],
    },
    products: {
      title: 'Product Performance Report',
      metrics: [
        { label: 'Total Products', value: '156', change: '+5' },
        { label: 'Best Seller', value: 'Egyptian Cotton Sheets', change: '' },
        { label: 'Low Stock Items', value: '12', change: '-3' },
        { label: 'Out of Stock', value: '3', change: '-1' },
      ],
    },
    customers: {
      title: 'Customer Report',
      metrics: [
        { label: 'Total Customers', value: '342', change: '+28' },
        { label: 'New Customers', value: '28', change: '+12%' },
        { label: 'Repeat Customers', value: '156', change: '+8%' },
        { label: 'Customer Lifetime Value', value: 'Rs 12,450', change: '+15%' },
      ],
    },
    inventory: {
      title: 'Inventory Report',
      metrics: [
        { label: 'Total Stock Value', value: 'Rs 1,245,000', change: '' },
        { label: 'Items to Reorder', value: '24', change: '' },
        { label: 'Stock Turnover Rate', value: '4.2x', change: '+0.3x' },
        { label: 'Days of Inventory', value: '45', change: '-5' },
      ],
    },
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    alert(`Exporting ${reportType} report as ${format.toUpperCase()}...`);
  };

  const currentReport = reports[reportType];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-serif text-[#2D2A26]">Reports</h2>
        <div className="flex gap-2">
          <button
            onClick={() => handleExport('csv')}
            className="flex items-center gap-2 px-4 py-2 border border-[#E8DFD5] rounded-lg hover:bg-[#F5EDE4]"
          >
            <Download size={18} />
            Export CSV
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="flex items-center gap-2 px-4 py-2 bg-[#C4A265] text-white rounded-lg hover:bg-[#D4B275]"
          >
            <FileText size={18} />
            Export PDF
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'sales', label: 'Sales Report', icon: DollarSign },
            { id: 'products', label: 'Product Report', icon: ShoppingBag },
            { id: 'customers', label: 'Customer Report', icon: Users },
            { id: 'inventory', label: 'Inventory Report', icon: TrendingUp },
          ].map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setReportType(type.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  reportType === type.id
                    ? 'bg-[#C4A265] text-white'
                    : 'bg-[#F5EDE4] text-[#5C4A32] hover:bg-[#E8DFD5]'
                }`}
              >
                <Icon size={18} />
                {type.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Date Range */}
      <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
        <div className="flex items-center gap-4">
          <Calendar size={20} className="text-[#C4A265]" />
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="px-3 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]"
            />
            <span className="text-[#5C4A32]">to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="px-3 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]"
            />
          </div>
        </div>
      </div>

      {/* Report Metrics */}
      <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
        <h3 className="text-xl font-medium text-[#2D2A26] mb-4">{currentReport.title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {currentReport.metrics.map((metric, idx) => (
            <div key={idx} className="bg-[#FDF8F3] rounded-lg p-4">
              <p className="text-sm text-[#A09080] mb-1">{metric.label}</p>
              <p className="text-2xl font-bold text-[#2D2A26]">{metric.value}</p>
              {metric.change && (
                <p className={`text-sm mt-1 ${
                  metric.change.startsWith('+') ? 'text-green-600' : 
                  metric.change.startsWith('-') ? 'text-red-600' : 
                  'text-[#A09080]'
                }`}>
                  {metric.change}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Report Details */}
      <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
        <h3 className="text-xl font-medium text-[#2D2A26] mb-4">Detailed Breakdown</h3>
        
        {reportType === 'sales' && (
          <div className="space-y-3">
            {[
              { date: '2026-01-15', orders: 8, revenue: 42500 },
              { date: '2026-01-14', orders: 6, revenue: 31200 },
              { date: '2026-01-13', orders: 10, revenue: 58900 },
              { date: '2026-01-12', orders: 7, revenue: 38400 },
              { date: '2026-01-11', orders: 9, revenue: 47200 },
            ].map((day, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-[#FDF8F3] rounded-lg">
                <span className="text-sm font-medium text-[#2D2A26]">{day.date}</span>
                <div className="flex items-center gap-6">
                  <span className="text-sm text-[#5C4A32]">{day.orders} orders</span>
                  <span className="text-sm font-semibold text-[#C4A265]">Rs {day.revenue.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {reportType === 'products' && (
          <div className="space-y-3">
            {[
              { name: 'Egyptian Cotton Sheet Set', sold: 45, revenue: 382500 },
              { name: 'Luxury Comforter Set', sold: 32, revenue: 448000 },
              { name: 'Silk Pillowcase Set', sold: 28, revenue: 78400 },
              { name: 'Winter Quilt', sold: 24, revenue: 216000 },
              { name: 'Kids Bed Sheet Set', sold: 19, revenue: 85500 },
            ].map((product, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-[#FDF8F3] rounded-lg">
                <span className="text-sm font-medium text-[#2D2A26]">{product.name}</span>
                <div className="flex items-center gap-6">
                  <span className="text-sm text-[#5C4A32]">{product.sold} sold</span>
                  <span className="text-sm font-semibold text-[#C4A265]">Rs {product.revenue.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {reportType === 'customers' && (
          <div className="space-y-3">
            {[
              { segment: 'VIP', count: 28, revenue: 420000 },
              { segment: 'Regular', count: 156, revenue: 780000 },
              { segment: 'New', count: 28, revenue: 140000 },
              { segment: 'At Risk', count: 45, revenue: 225000 },
              { segment: 'Inactive', count: 85, revenue: 425000 },
            ].map((segment, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-[#FDF8F3] rounded-lg">
                <span className="text-sm font-medium text-[#2D2A26]">{segment.segment} Customers</span>
                <div className="flex items-center gap-6">
                  <span className="text-sm text-[#5C4A32]">{segment.count} customers</span>
                  <span className="text-sm font-semibold text-[#C4A265]">Rs {segment.revenue.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {reportType === 'inventory' && (
          <div className="space-y-3">
            {[
              { category: 'Bed Sheets', items: 45, value: 382500 },
              { category: 'Comforters', items: 32, value: 448000 },
              { category: 'Pillows', items: 78, value: 234000 },
              { category: 'Quilts', items: 24, value: 216000 },
              { category: 'Accessories', items: 156, value: 164500 },
            ].map((category, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-[#FDF8F3] rounded-lg">
                <span className="text-sm font-medium text-[#2D2A26]">{category.category}</span>
                <div className="flex items-center gap-6">
                  <span className="text-sm text-[#5C4A32]">{category.items} items</span>
                  <span className="text-sm font-semibold text-[#C4A265]">Rs {category.value.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
