'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeConfig, ThemeName, getCurrentTheme, setTheme, applyTheme, THEMES } from '@/lib/themes';

interface ThemeContextType {
  theme: ThemeConfig;
  setTheme: (themeName: ThemeName) => void;
  themes: ThemeConfig[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setCurrentTheme] = useState<ThemeConfig>(THEMES.flat);

  useEffect(() => {
    const currentTheme = getCurrentTheme();
    setCurrentTheme(currentTheme);
    applyTheme(currentTheme);
  }, []);

  const handleSetTheme = (themeName: ThemeName) => {
    setTheme(themeName);
    const newTheme = THEMES[themeName];
    setCurrentTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, themes: Object.values(THEMES) }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
