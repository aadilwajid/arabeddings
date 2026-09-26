'use client';

import { useState } from 'react';
import { Mail, MessageSquare, Bell, Save, TestTube } from 'lucide-react';

export default function AdminNotifications() {
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: '',
    smtpPass: '',
    fromEmail: 'noreply@arabeddings.com',
    fromName: 'ARA Beddings',
  });

  const [smsSettings, setSmsSettings] = useState({
    provider: 'jazz',
    jazzApiKey: '',
    jazzMask: 'ARA Beddings',
    twilioSid: '',
    twilioToken: '',
    twilioPhone: '',
  });

  const [notificationTemplates, setNotificationTemplates] = useState({
    orderConfirmation: {
      email: true,
      sms: true,
      subject: 'Order Confirmation - #{orderNumber}',
    },
    orderShipped: {
      email: true,
      sms: true,
      subject: 'Your Order #{orderNumber} Has Shipped',
    },
    orderDelivered: {
      email: true,
      sms: true,
      subject: 'Order #{orderNumber} Delivered',
    },
    lowStockAlert: {
      email: true,
      sms: false,
      subject: 'Low Stock Alert: {productName}',
    },
    backInStock: {
      email: true,
      sms: false,
      subject: '{productName} is Back in Stock!',
    },
  });

  const handleSave = () => {
    // In production, save to backend
    alert('Notification settings saved successfully!');
  };

  const handleTestEmail = () => {
    alert('Test email sent! Check your inbox.');
  };

  const handleTestSMS = () => {
    alert('Test SMS sent! Check your phone.');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-serif text-[#2D2A26]">Notification Settings</h2>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2 bg-[#C4A265] text-white rounded-lg hover:bg-[#D4B275]"
        >
          <Save size={18} />
          Save Changes
        </button>
      </div>

      {/* Email Settings */}
      <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
        <h3 className="text-xl font-medium text-[#2D2A26] mb-4 flex items-center gap-2">
          <Mail size={24} className="text-[#C4A265]" />
          Email Configuration (SMTP)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#5C4A32] mb-1">SMTP Host</label>
            <input
              type="text"
              value={emailSettings.smtpHost}
              onChange={(e) => setEmailSettings({ ...emailSettings, smtpHost: e.target.value })}
              className="w-full px-3 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5C4A32] mb-1">SMTP Port</label>
            <input
              type="number"
              value={emailSettings.smtpPort}
              onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5C4A32] mb-1">SMTP Username</label>
            <input
              type="text"
              value={emailSettings.smtpUser}
              onChange={(e) => setEmailSettings({ ...emailSettings, smtpUser: e.target.value })}
              placeholder="your-email@gmail.com"
              className="w-full px-3 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5C4A32] mb-1">SMTP Password</label>
            <input
              type="password"
              value={emailSettings.smtpPass}
              onChange={(e) => setEmailSettings({ ...emailSettings, smtpPass: e.target.value })}
              placeholder="App password"
              className="w-full px-3 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5C4A32] mb-1">From Email</label>
            <input
              type="email"
              value={emailSettings.fromEmail}
              onChange={(e) => setEmailSettings({ ...emailSettings, fromEmail: e.target.value })}
              className="w-full px-3 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5C4A32] mb-1">From Name</label>
            <input
              type="text"
              value={emailSettings.fromName}
              onChange={(e) => setEmailSettings({ ...emailSettings, fromName: e.target.value })}
              className="w-full px-3 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]"
            />
          </div>
        </div>
        <button
          onClick={handleTestEmail}
          className="mt-4 flex items-center gap-2 px-4 py-2 border border-[#E8DFD5] rounded-lg hover:bg-[#F5EDE4] text-sm"
        >
          <TestTube size={16} />
          Send Test Email
        </button>
      </div>

      {/* SMS Settings */}
      <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
        <h3 className="text-xl font-medium text-[#2D2A26] mb-4 flex items-center gap-2">
          <MessageSquare size={24} className="text-[#C4A265]" />
          SMS Configuration
        </h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#5C4A32] mb-1">SMS Provider</label>
          <select
            value={smsSettings.provider}
            onChange={(e) => setSmsSettings({ ...smsSettings, provider: e.target.value })}
            className="w-full px-3 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]"
          >
            <option value="jazz">Jazz SMS (Pakistan)</option>
            <option value="twilio">Twilio (International)</option>
          </select>
        </div>

        {smsSettings.provider === 'jazz' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#5C4A32] mb-1">Jazz API Key</label>
              <input
                type="text"
                value={smsSettings.jazzApiKey}
                onChange={(e) => setSmsSettings({ ...smsSettings, jazzApiKey: e.target.value })}
                placeholder="Your Jazz API key"
                className="w-full px-3 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5C4A32] mb-1">SMS Mask</label>
              <input
                type="text"
                value={smsSettings.jazzMask}
                onChange={(e) => setSmsSettings({ ...smsSettings, jazzMask: e.target.value })}
                className="w-full px-3 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]"
              />
            </div>
          </div>
        )}

        {smsSettings.provider === 'twilio' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#5C4A32] mb-1">Account SID</label>
              <input
                type="text"
                value={smsSettings.twilioSid}
                onChange={(e) => setSmsSettings({ ...smsSettings, twilioSid: e.target.value })}
                className="w-full px-3 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5C4A32] mb-1">Auth Token</label>
              <input
                type="password"
                value={smsSettings.twilioToken}
                onChange={(e) => setSmsSettings({ ...smsSettings, twilioToken: e.target.value })}
                className="w-full px-3 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5C4A32] mb-1">Phone Number</label>
              <input
                type="text"
                value={smsSettings.twilioPhone}
                onChange={(e) => setSmsSettings({ ...smsSettings, twilioPhone: e.target.value })}
                placeholder="+1234567890"
                className="w-full px-3 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]"
              />
            </div>
          </div>
        )}

        <button
          onClick={handleTestSMS}
          className="mt-4 flex items-center gap-2 px-4 py-2 border border-[#E8DFD5] rounded-lg hover:bg-[#F5EDE4] text-sm"
        >
          <TestTube size={16} />
          Send Test SMS
        </button>
      </div>

      {/* Notification Templates */}
      <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
        <h3 className="text-xl font-medium text-[#2D2A26] mb-4 flex items-center gap-2">
          <Bell size={24} className="text-[#C4A265]" />
          Notification Templates
        </h3>
        <div className="space-y-4">
          {Object.entries(notificationTemplates).map(([key, template]) => (
            <div key={key} className="border border-[#E8DFD5] rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-[#2D2A26] capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={template.email}
                      onChange={(e) => setNotificationTemplates({
                        ...notificationTemplates,
                        [key]: { ...template, email: e.target.checked }
                      })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-[#5C4A32]">Email</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={template.sms}
                      onChange={(e) => setNotificationTemplates({
                        ...notificationTemplates,
                        [key]: { ...template, sms: e.target.checked }
                      })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-[#5C4A32]">SMS</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#5C4A32] mb-1">Subject Line</label>
                <input
                  type="text"
                  value={template.subject}
                  onChange={(e) => setNotificationTemplates({
                    ...notificationTemplates,
                    [key]: { ...template, subject: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-[#E8DFD5] rounded-lg text-sm focus:outline-none focus:border-[#C4A265]"
                />
                <p className="text-xs text-[#A09080] mt-1">
                  Available variables: {'{orderNumber}'}, {'{productName}'}, {'{customerName}'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
