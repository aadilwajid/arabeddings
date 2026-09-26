'use client';

import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Download, RefreshCw, Filter } from 'lucide-react';

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [days, setDays] = useState(30);

  useEffect(() => {
    fetchLogs();
  }, [filter, days]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('type', filter);
      params.append('days', days.toString());
      
      const res = await fetch(`/api/audit?${params}`);
      const data = await res.json();
      setLogs(data);
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const res = await fetch(`/api/audit?type=export&days=${days}`);
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${Date.now()}.json`;
      a.click();
    } catch (error) {
      alert('Failed to export logs');
    }
  };

  const handleClean = async () => {
    if (!confirm('Clean logs older than 90 days?')) return;
    
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clean' }),
      });
      
      if (res.ok) {
        alert('Old logs cleaned successfully');
        fetchLogs();
      }
    } catch (error) {
      alert('Failed to clean logs');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-serif text-[#2D2A26]">Audit Logs</h2>
        <div className="animate-pulse space-y-4">
          <div className="h-64 bg-[#F5EDE4] rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-serif text-[#2D2A26]">Audit Logs</h2>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-[#C4A265] text-white rounded-lg hover:bg-[#D4B275] flex items-center gap-2"
          >
            <Download size={18} />
            Export
          </button>
          <button
            onClick={handleClean}
            className="px-4 py-2 border border-[#E8DFD5] rounded-lg hover:bg-[#F5EDE4]"
          >
            Clean Old Logs
          </button>
          <button
            onClick={fetchLogs}
            className="px-4 py-2 border border-[#E8DFD5] rounded-lg hover:bg-[#F5EDE4] flex items-center gap-2"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
        <div className="flex items-center gap-4">
          <Filter size={20} className="text-[#A09080]" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]"
          >
            <option value="all">All Logs</option>
            <option value="failed">Failed Actions</option>
            <option value="suspicious">Suspicious Activities</option>
          </select>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <span className="text-sm text-[#A09080]">{logs.length} logs</span>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-[#F0E8DE] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F5EDE4]">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-[#5C4A32]">Timestamp</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-[#5C4A32]">User</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-[#5C4A32]">Action</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-[#5C4A32]">Resource</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-[#5C4A32]">Status</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-[#5C4A32]">IP</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-t border-[#F0E8DE] hover:bg-[#FDF8F3]">
                  <td className="px-6 py-4 text-sm text-[#5C4A32]">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#5C4A32]">
                    {log.userEmail || 'System'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-[#F5EDE4] rounded text-xs font-medium text-[#5C4A32]">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#5C4A32]">
                    {log.resource}
                    {log.resourceId && <span className="text-xs text-[#A09080] ml-1">({log.resourceId})</span>}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      log.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#A09080] font-mono text-xs">
                    {log.ipAddress || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {logs.length === 0 && (
          <div className="p-12 text-center text-[#A09080]">
            <Shield size={48} className="mx-auto mb-3 opacity-50" />
            <p>No audit logs found</p>
          </div>
        )}
      </div>
    </div>
  );
}
