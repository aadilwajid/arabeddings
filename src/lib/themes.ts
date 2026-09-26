// Theme System Configuration
// Supports multiple UI styles: Claymorphism, Glassmorphism, Neumorphism, Flat, Brutalist, Minimalist

export type ThemeName = 'claymorphism' | 'glassmorphism' | 'neumorphism' | 'flat' | 'brutalist' | 'minimalist';

export interface ThemeConfig {
  id: ThemeName;
  name: string;
  description: string;
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    accent: string;
  };
  effects: {
    borderRadius: string;
    shadow: string;
    backdropFilter?: string;
    border?: string;
  };
}

export const THEMES: Record<ThemeName, ThemeConfig> = {
  claymorphism: {
    id: 'claymorphism',
    name: 'Claymorphism',
    description: 'Soft, 3D clay-like design with inner shadows and rounded shapes',
    preview: '🎨',
    colors: {
      primary: '#C4A265',
      secondary: '#D4B275',
      background: '#FDF8F3',
      surface: '#FFFFFF',
      text: '#2D2A26',
      textSecondary: '#5C4A32',
      border: '#E8DFD5',
      accent: '#C4A265'
    },
    effects: {
      borderRadius: '24px',
      shadow: '8px 8px 16px rgba(196, 162, 101, 0.15), -8px -8px 16px rgba(255, 255, 255, 0.8), inset 2px 2px 4px rgba(255, 255, 255, 0.9), inset -2px -2px 4px rgba(196, 162, 101, 0.1)',
      border: '1px solid rgba(196, 162, 101, 0.2)'
    }
  },
  glassmorphism: {
    id: 'glassmorphism',
    name: 'Glassmorphism',
    description: 'Frosted glass effect with transparency and blur',
    preview: '🔮',
    colors: {
      primary: '#C4A265',
      secondary: '#D4B275',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      surface: 'rgba(255, 255, 255, 0.25)',
      text: '#FFFFFF',
      textSecondary: 'rgba(255, 255, 255, 0.8)',
      border: 'rgba(255, 255, 255, 0.3)',
      accent: '#FFD700'
    },
    effects: {
      borderRadius: '16px',
      shadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.3)'
    }
  },
  neumorphism: {
    id: 'neumorphism',
    name: 'Neumorphism',
    description: 'Soft UI with extruded shapes and subtle shadows',
    preview: '🌊',
    colors: {
      primary: '#C4A265',
      secondary: '#D4B275',
      background: '#E0E5EC',
      surface: '#E0E5EC',
      text: '#2D2A26',
      textSecondary: '#5C4A32',
      border: '#E0E5EC',
      accent: '#C4A265'
    },
    effects: {
      borderRadius: '20px',
      shadow: '9px 9px 16px rgba(163, 177, 198, 0.6), -9px -9px 16px rgba(255, 255, 255, 0.5)',
      border: 'none'
    }
  },
  flat: {
    id: 'flat',
    name: 'Flat Modern',
    description: 'Clean, flat design with bold colors and sharp edges',
    preview: '⚡',
    colors: {
      primary: '#C4A265',
      secondary: '#D4B275',
      background: '#FDF8F3',
      surface: '#FFFFFF',
      text: '#2D2A26',
      textSecondary: '#5C4A32',
      border: '#E8DFD5',
      accent: '#C4A265'
    },
    effects: {
      borderRadius: '8px',
      shadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      border: '2px solid #E8DFD5'
    }
  },
  brutalist: {
    id: 'brutalist',
    name: 'Brutalist',
    description: 'Bold, raw design with strong contrasts and geometric shapes',
    preview: '🔥',
    colors: {
      primary: '#000000',
      secondary: '#FFD700',
      background: '#FFFFFF',
      surface: '#F5F5F5',
      text: '#000000',
      textSecondary: '#333333',
      border: '#000000',
      accent: '#FF0000'
    },
    effects: {
      borderRadius: '0px',
      shadow: '4px 4px 0px #000000',
      border: '3px solid #000000'
    }
  },
  minimalist: {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Ultra-clean design with maximum whitespace and subtle details',
    preview: '✨',
    colors: {
      primary: '#2D2A26',
      secondary: '#5C4A32',
      background: '#FFFFFF',
      surface: '#FAFAFA',
      text: '#2D2A26',
      textSecondary: '#999999',
      border: '#EEEEEE',
      accent: '#C4A265'
    },
    effects: {
      borderRadius: '4px',
      shadow: 'none',
      border: '1px solid #EEEEEE'
    }
  }
};

const THEME_KEY = 'ara_theme';

export function getCurrentTheme(): ThemeConfig {
  if (typeof window === 'undefined') return THEMES.flat;
  
  const saved = localStorage.getItem(THEME_KEY);
  if (!saved) return THEMES.flat;
  
  return THEMES[saved as ThemeName] || THEMES.flat;
}

export function setTheme(themeName: ThemeName): void {
  localStorage.setItem(THEME_KEY, themeName);
  applyTheme(THEMES[themeName]);
}

export function applyTheme(theme: ThemeConfig): void {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  
  // Apply colors
  root.style.setProperty('--color-primary', theme.colors.primary);
  root.style.setProperty('--color-secondary', theme.colors.secondary);
  root.style.setProperty('--color-background', theme.colors.background);
  root.style.setProperty('--color-surface', theme.colors.surface);
  root.style.setProperty('--color-text', theme.colors.text);
  root.style.setProperty('--color-text-secondary', theme.colors.textSecondary);
  root.style.setProperty('--color-border', theme.colors.border);
  root.style.setProperty('--color-accent', theme.colors.accent);
  
  // Apply effects
  root.style.setProperty('--border-radius', theme.effects.borderRadius);
  root.style.setProperty('--shadow', theme.effects.shadow);
  root.style.setProperty('--border', theme.effects.border || 'none');
  
  if (theme.effects.backdropFilter) {
    root.style.setProperty('--backdrop-filter', theme.effects.backdropFilter);
  } else {
    root.style.setProperty('--backdrop-filter', 'none');
  }
  
  // Apply background
  if (theme.colors.background.includes('gradient')) {
    root.style.setProperty('--background', theme.colors.background);
  } else {
    root.style.setProperty('--background', theme.colors.background);
  }
}

export function getAllThemes(): ThemeConfig[] {
  return Object.values(THEMES);
}
