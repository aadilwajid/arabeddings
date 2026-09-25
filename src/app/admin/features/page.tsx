'use client';

import { useState, useEffect } from 'react';
import { FeatureConfig, getFeatureFlags, toggleFeature, resetFeatureFlags } from '@/lib/feature-flags';
import { ToggleLeft, ToggleRight, RotateCcw, Filter } from 'lucide-react';

export default function FeatureManagement() {
  const [features, setFeatures] = useState<FeatureConfig[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setFeatures(getFeatureFlags());
  }, []);

  const handleToggle = (featureId: string) => {
    const updated = toggleFeature(featureId);
    setFeatures(updated);
  };

  const handleReset = () => {
    if (confirm('Reset all features to default?')) {
      const reset = resetFeatureFlags();
      setFeatures(reset);
    }
  };

  const categories = ['all', 'storefront', 'marketing', 'technical', 'admin'];
  
  const filteredFeatures = features.filter(f => {
    if (filter !== 'all' && f.category !== filter) return false;
    if (searchQuery && !f.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const enabledCount = features.filter(f => f.enabled).length;
  const totalCount = features.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-serif text-[#2D2A26]">Feature Management</h2>
          <p className="text-[#5C4A32] mt-1">Enable or disable features based on your requirements</p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 border border-[#E8DFD5] rounded-lg hover:bg-[#F5EDE4] text-[#5C4A32]"
        >
          <RotateCcw size={16} />
          Reset to Default
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
          <p className="text-sm text-[#A09080] mb-2">Total Features</p>
          <p className="text-3xl font-bold text-[#2D2A26]">{totalCount}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
          <p className="text-sm text-[#A09080] mb-2">Enabled</p>
          <p className="text-3xl font-bold text-green-600">{enabledCount}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
          <p className="text-sm text-[#A09080] mb-2">Disabled</p>
          <p className="text-3xl font-bold text-red-600">{totalCount - enabledCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-[#F0E8DE] p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search features..."
              className="w-full px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-[#A09080]" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Features List */}
      <div className="space-y-4">
        {filteredFeatures.map(feature => (
          <div
            key={feature.id}
            className={`bg-white rounded-2xl border-2 p-6 transition-all ${
              feature.enabled ? 'border-green-200' : 'border-[#F0E8DE]'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-medium text-[#2D2A26]">{feature.name}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    feature.category === 'storefront' ? 'bg-blue-100 text-blue-700' :
                    feature.category === 'marketing' ? 'bg-purple-100 text-purple-700' :
                    feature.category === 'technical' ? 'bg-orange-100 text-orange-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {feature.category}
                  </span>
                </div>
                <p className="text-sm text-[#5C4A32]">{feature.description}</p>
              </div>
              <button
                onClick={() => handleToggle(feature.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  feature.enabled
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-[#F5EDE4] text-[#5C4A32] hover:bg-[#E8DFD5]'
                }`}
              >
                {feature.enabled ? (
                  <>
                    <ToggleRight size={20} />
                    Enabled
                  </>
                ) : (
                  <>
                    <ToggleLeft size={20} />
                    Disabled
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredFeatures.length === 0 && (
        <div className="bg-white rounded-2xl border border-[#F0E8DE] p-12 text-center">
          <p className="text-[#A09080]">No features found</p>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-2">💡 How Feature Toggles Work</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Features are stored in browser localStorage</li>
          <li>• Changes take effect immediately without page reload</li>
          <li>• Disabled features are hidden from the storefront</li>
          <li>• Use "Reset to Default" to restore all features</li>
          <li>• Feature states persist across browser sessions</li>
        </ul>
      </div>
    </div>
  );
}
