'use client';

import { useState, useEffect } from 'react';
import { Palette, Check } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import LogoUpload from '@/components/admin/LogoUpload';

export default function AdminAppearance() {
  const { theme, setTheme, themes } = useTheme();
  const [saved, setSaved] = useState(false);

  const handleThemeChange = (themeId: string) => {
    setTheme(themeId as any);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-serif text-[#2D2A26] mb-2">Appearance Settings</h2>
        <p className="text-[#5C4A32]">Customize the look and feel of your store</p>
      </div>

      {/* Theme Selection */}
      <div className="bg-white rounded-2xl border border-[#F0E8DE] p-6">
        <div className="flex items-center gap-2 mb-6">
          <Palette size={20} className="text-[#C4A265]" />
          <h3 className="text-lg font-medium text-[#2D2A26]">Theme Selection</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => handleThemeChange(t.id)}
              className={`relative p-6 rounded-2xl border-2 transition-all hover:scale-105 ${
                theme.id === t.id ? 'ring-4 ring-offset-2' : ''
              }`}
              style={{
                backgroundColor: t.colors.background.includes('gradient') ? '#fff' : t.colors.background,
                borderColor: theme.id === t.id ? t.colors.primary : t.colors.border,
                borderRadius: t.effects.borderRadius,
                boxShadow: t.effects.shadow
              }}
            >
              {/* Active Indicator */}
              {theme.id === t.id && (
                <div 
                  className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: t.colors.primary }}
                >
                  <Check className="w-5 h-5 text-white" />
                </div>
              )}

              {/* Preview Icon */}
              <div className="text-5xl mb-4">{t.preview}</div>

              {/* Theme Info */}
              <h3 className="text-lg font-bold mb-2" style={{ color: t.colors.text }}>
                {t.name}
              </h3>
              <p className="text-sm mb-4" style={{ color: t.colors.textSecondary }}>
                {t.description}
              </p>

              {/* Color Palette Preview */}
              <div className="flex gap-2 mb-3">
                {Object.entries(t.colors).slice(0, 5).map(([key, color]) => (
                  !color.includes('gradient') && (
                    <div
                      key={key}
                      className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: color }}
                      title={key}
                    />
                  )
                ))}
              </div>

              {/* Style Preview */}
              <div className="mt-4 p-3 rounded-lg" style={{ 
                backgroundColor: t.colors.surface,
                borderRadius: t.effects.borderRadius,
                border: t.effects.border
              }}>
                <div className="flex gap-2">
                  <div 
                    className="w-12 h-12 rounded-lg"
                    style={{
                      backgroundColor: t.colors.primary,
                      borderRadius: t.effects.borderRadius,
                      boxShadow: t.effects.shadow
                    }}
                  />
                  <div className="flex-1 space-y-1">
                    <div 
                      className="h-2 rounded"
                      style={{ backgroundColor: t.colors.text, opacity: 0.3 }}
                    />
                    <div 
                      className="h-2 rounded w-3/4"
                      style={{ backgroundColor: t.colors.text, opacity: 0.2 }}
                    />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {saved && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 font-medium">✓ Theme updated successfully!</p>
          </div>
        )}
      </div>

      {/* Logo Upload */}
      <LogoUpload />

      {/* Additional Settings */}
      <div className="bg-white rounded-2xl border border-[#F0E8DE] p-6">
        <h3 className="text-lg font-medium text-[#2D2A26] mb-6">Additional Settings</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#5C4A32] mb-2">
              Store Name
            </label>
            <input
              type="text"
              defaultValue="ARA Beddings"
              className="w-full px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5C4A32] mb-2">
              Tagline
            </label>
            <input
              type="text"
              defaultValue="Luxury Home Linen"
              className="w-full px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5C4A32] mb-2">
              Primary Color
            </label>
            <div className="flex gap-3">
              <input
                type="color"
                defaultValue="#C4A265"
                className="w-16 h-12 rounded-lg border border-[#E8DFD5] cursor-pointer"
              />
              <input
                type="text"
                defaultValue="#C4A265"
                className="flex-1 px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]"
              />
            </div>
          </div>

          <button className="w-full px-6 py-3 bg-[#C4A265] text-white rounded-lg hover:bg-[#D4B275] transition-colors font-medium">
            Save All Settings
          </button>
        </div>
      </div>
    </div>
  );
}
