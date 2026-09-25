'use client';

import { useState, useEffect } from 'react';
import { Activity, User, Clock, Filter } from 'lucide-react';

interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  timestamp: string;
}

const ACTIVITY_LOG_KEY = 'ara_activity_log';

export function logActivity(userId: string, userName: string, action: string, entityType: string, entityId: string, details: string): void {
  if (typeof window === 'undefined') return;

  const log: ActivityLog = {
    id: `log-${Date.now()}`,
    userId,
    userName,
    action,
    entityType,
    entityId,
    details,
    timestamp: new Date().toISOString()
  };

  const existing = JSON.parse(localStorage.getItem(ACTIVITY_LOG_KEY) || '[]');
  existing.unshift(log);
  
  // Keep only last 1000 logs
  const trimmed = existing.slice(0, 1000);
  localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(trimmed));
}

export default function ActivityLogViewer() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [userFilter, setUserFilter] = useState<string>('all');

  useEffect(() => {
    const saved = localStorage.getItem(ACTIVITY_LOG_KEY);
    if (saved) {
      setLogs(JSON.parse(saved));
    }
  }, []);

  const uniqueUsers = Array.from(new Set(logs.map(log => log.userName)));
  const uniqueActions = Array.from(new Set(logs.map(log => log.action)));

  const filteredLogs = logs.filter(log => {
    if (filter !== 'all' && log.action !== filter) return false;
    if (userFilter !== 'all' && log.userName !== userFilter) return false;
    return true;
  });

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create': return 'bg-green-100 text-green-700';
      case 'update': return 'bg-blue-100 text-blue-700';
      case 'delete': return 'bg-red-100 text-red-700';
      case 'login': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#F0E8DE] p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Activity size={20} className="text-[#C4A265]" />
          <h3 className="text-lg font-medium text-[#2D2A26]">Activity Log</h3>
        </div>
        <span className="text-xs text-[#A09080]">{filteredLogs.length} activities</span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-[#A09080]" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1.5 border border-[#E8DFD5] rounded-lg text-sm focus:outline-none focus:border-[#C4A265]"
          >
            <option value="all">All Actions</option>
            {uniqueActions.map(action => (
              <option key={action} value={action}>{action}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <User size={16} className="text-[#A09080]" />
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="px-3 py-1.5 border border-[#E8DFD5] rounded-lg text-sm focus:outline-none focus:border-[#C4A265]"
          >
            <option value="all">All Users</option>
            {uniqueUsers.map(user => (
              <option key={user} value={user}>{user}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Activity List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredLogs.map((log) => (
          <div key={log.id} className="p-3 rounded-lg border border-[#E8DFD5] hover:border-[#C4A265] transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getActionColor(log.action)}`}>
                  {log.action}
                </span>
                <span className="text-xs text-[#A09080]">{log.entityType}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-[#A09080]">
                <Clock size={12} />
                {new Date(log.timestamp).toLocaleString()}
              </div>
            </div>
            <p className="text-sm text-[#2D2A26]">{log.details}</p>
            <p className="text-xs text-[#A09080] mt-1">by {log.userName}</p>
          </div>
        ))}
      </div>

      {filteredLogs.length === 0 && (
        <div className="text-center py-8">
          <Activity size={48} className="text-[#E8DFD5] mx-auto mb-3" />
          <p className="text-[#5C4A32]">No activity logs found</p>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-[#E8DFD5] flex items-center justify-between">
        <p className="text-xs text-[#A09080]">
          Showing {filteredLogs.length} of {logs.length} activities
        </p>
        <button
          onClick={() => {
            if (confirm('Clear all activity logs?')) {
              localStorage.removeItem(ACTIVITY_LOG_KEY);
              setLogs([]);
            }
          }}
          className="text-xs text-red-500 hover:text-red-700"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}
