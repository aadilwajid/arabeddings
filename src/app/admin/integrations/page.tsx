'use client';

import { useState } from 'react';
import { Link2, Zap, Save, CheckCircle, XCircle } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  category: 'payment' | 'shipping' | 'marketing' | 'analytics' | 'communication';
  enabled: boolean;
  connected: boolean;
  config: Record<string, string>;
}

export default function AdminIntegrations() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'jazzcash',
      name: 'JazzCash',
      description: 'Accept payments via JazzCash mobile wallet',
      category: 'payment',
      enabled: true,
      connected: true,
      config: { merchantId: '', merchantPassword: '' },
    },
    {
      id: 'easypaisa',
      name: 'Easypaisa',
      description: 'Accept payments via Easypaisa mobile wallet',
      category: 'payment',
      enabled: true,
      connected: true,
      config: { storeId: '', storePassword: '' },
    },
    {
      id: 'tcs',
      name: 'TCS Courier',
      description: 'Automated shipping and tracking with TCS',
      category: 'shipping',
      enabled: true,
      connected: false,
      config: { accountId: '', apiKey: '' },
    },
    {
      id: 'leopard',
      name: 'Leopard Courier',
      description: 'Shipping integration with Leopard Courier',
      category: 'shipping',
      enabled: true,
      connected: false,
      config: { username: '', password: '' },
    },
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      description: 'Track website traffic and user behavior',
      category: 'analytics',
      enabled: true,
      connected: false,
      config: { trackingId: '' },
    },
    {
      id: 'facebook-pixel',
      name: 'Facebook Pixel',
      description: 'Track conversions and run Facebook ads',
      category: 'analytics',
      enabled: false,
      connected: false,
      config: { pixelId: '' },
    },
    {
      id: 'mailchimp',
      name: 'Mailchimp',
      description: 'Email marketing and newsletter campaigns',
      category: 'marketing',
      enabled: false,
      connected: false,
      config: { apiKey: '', listId: '' },
    },
    {
      id: 'whatsapp-business',
      name: 'WhatsApp Business',
      description: 'Send order updates via WhatsApp',
      category: 'communication',
      enabled: true,
      connected: true,
      config: { phoneNumber: '03160143039' },
    },
  ]);

  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

  const handleToggle = (id: string) => {
    setIntegrations(integrations.map(integration =>
      integration.id === id
        ? { ...integration, enabled: !integration.enabled }
        : integration
    ));
  };

  const handleConnect = (id: string) => {
    setIntegrations(integrations.map(integration =>
      integration.id === id
        ? { ...integration, connected: true }
        : integration
    ));
    setSelectedIntegration(null);
  };

  const handleDisconnect = (id: string) => {
    setIntegrations(integrations.map(integration =>
      integration.id === id
        ? { ...integration, connected: false }
        : integration
    ));
  };

  const handleSaveConfig = () => {
    if (selectedIntegration) {
      setIntegrations(integrations.map(integration =>
        integration.id === selectedIntegration.id
          ? selectedIntegration
          : integration
      ));
      setSelectedIntegration(null);
      alert('Configuration saved successfully!');
    }
  };

  const categories = {
    payment: { label: 'Payment Gateways', icon: '💳' },
    shipping: { label: 'Shipping & Logistics', icon: '🚚' },
    analytics: { label: 'Analytics & Tracking', icon: '📊' },
    marketing: { label: 'Marketing & CRM', icon: '📧' },
    communication: { label: 'Communication', icon: '💬' },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-serif text-[#2D2A26]">Integrations</h2>
        <div className="flex items-center gap-2 text-sm text-[#A09080]">
          <Zap size={18} />
          {integrations.filter(i => i.connected).length} connected
        </div>
      </div>

      {/* Integration Categories */}
      {Object.entries(categories).map(([categoryKey, category]) => {
        const categoryIntegrations = integrations.filter(i => i.category === categoryKey);
        
        if (categoryIntegrations.length === 0) return null;

        return (
          <div key={categoryKey} className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
            <h3 className="text-xl font-medium text-[#2D2A26] mb-4 flex items-center gap-2">
              <span className="text-2xl">{category.icon}</span>
              {category.label}
            </h3>
            <div className="space-y-3">
              {categoryIntegrations.map((integration) => (
                <div
                  key={integration.id}
                  className="flex items-center justify-between p-4 border border-[#E8DFD5] rounded-lg hover:border-[#C4A265] transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-medium text-[#2D2A26]">{integration.name}</h4>
                      {integration.connected ? (
                        <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          <CheckCircle size={12} />
                          Connected
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-full">
                          <XCircle size={12} />
                          Not Connected
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#5C4A32]">{integration.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedIntegration(integration)}
                      className="px-4 py-2 border border-[#E8DFD5] rounded-lg text-sm hover:bg-[#F5EDE4]"
                    >
                      Configure
                    </button>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={integration.enabled}
                        onChange={() => handleToggle(integration.id)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-[#5C4A32]">Enabled</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Configuration Modal */}
      {selectedIntegration && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-serif text-[#2D2A26]">{selectedIntegration.name}</h3>
                <p className="text-sm text-[#5C4A32] mt-1">{selectedIntegration.description}</p>
              </div>
              <button
                onClick={() => setSelectedIntegration(null)}
                className="p-2 hover:bg-[#F5EDE4] rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {Object.entries(selectedIntegration.config).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-[#5C4A32] mb-1 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <input
                    type={key.toLowerCase().includes('password') ? 'password' : 'text'}
                    value={value}
                    onChange={(e) => {
                      setSelectedIntegration({
                        ...selectedIntegration,
                        config: { ...selectedIntegration.config, [key]: e.target.value }
                      });
                    }}
                    placeholder={`Enter ${key}`}
                    className="w-full px-3 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              {selectedIntegration.connected ? (
                <button
                  onClick={() => handleDisconnect(selectedIntegration.id)}
                  className="flex-1 px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50"
                >
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={() => handleConnect(selectedIntegration.id)}
                  className="flex-1 px-4 py-2 bg-[#C4A265] text-white rounded-lg hover:bg-[#D4B275]"
                >
                  Connect
                </button>
              )}
              <button
                onClick={handleSaveConfig}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#2D2A26] text-white rounded-lg hover:bg-[#3D3A36]"
              >
                <Save size={18} />
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
