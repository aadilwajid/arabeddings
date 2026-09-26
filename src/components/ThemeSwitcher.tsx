'use client';

import { useState } from 'react';
import { useTheme } from './ThemeProvider';
import { Palette, Check, X } from 'lucide-react';

export default function ThemeSwitcher() {
  const { theme, setTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-40 bg-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all hover:scale-110"
        style={{
          boxShadow: 'var(--shadow)',
          borderRadius: 'var(--border-radius)'
        }}
        title="Change Theme"
      >
        <Palette className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div 
            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            style={{
              borderRadius: 'var(--border-radius)',
              boxShadow: 'var(--shadow)'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div>
                <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                  Choose Your Style
                </h2>
                <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                  Customize the look and feel of your store
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6" style={{ color: 'var(--color-text)' }} />
              </button>
            </div>

            {/* Theme Grid */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id);
                      setIsOpen(false);
                    }}
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
            </div>

            {/* Footer */}
            <div className="p-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <p className="text-sm text-center" style={{ color: 'var(--color-text-secondary)' }}>
                Your theme preference is saved automatically and will persist across sessions
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
