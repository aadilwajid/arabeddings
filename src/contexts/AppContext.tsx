'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

// ============ CURRENCY ============
export interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number; // rate relative to PKR
  locale: string;
}

export const CURRENCIES: Currency[] = [
  { code: 'PKR', symbol: 'Rs', name: 'Pakistani Rupee', rate: 1, locale: 'en-PK' },
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 0.0036, locale: 'en-US' },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.0033, locale: 'de-DE' },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.0028, locale: 'en-GB' },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', rate: 0.0134, locale: 'ar-SA' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', rate: 0.0131, locale: 'ar-AE' },
];

// ============ DARK MODE ============
export type ThemeMode = 'light' | 'dark';

// ============ CONTEXT ============
interface AppContextType {
  // Currency
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (priceInPKR: number) => string;
  
  // Dark Mode
  themeMode: ThemeMode;
  toggleTheme: () => void;
  
  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  
  // Recently Viewed
  recentlyViewed: string[];
  addToRecentlyViewed: (productId: string) => void;
  
  // Address Book
  addresses: Address[];
  addAddress: (address: Omit<Address, 'id'>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  defaultAddress: Address | null;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Currency state
  const [currency, setCurrencyState] = useState<Currency>(CURRENCIES[0]);
  
  // Theme state
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  
  // Wishlist state
  const [wishlist, setWishlist] = useState<string[]>([]);
  
  // Recently viewed
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  
  // Address book
  const [addresses, setAddresses] = useState<Address[]>([]);

  // Initialize from localStorage
  useEffect(() => {
    const savedCurrency = localStorage.getItem('app_currency');
    if (savedCurrency) {
      const found = CURRENCIES.find(c => c.code === savedCurrency);
      if (found) setCurrencyState(found);
    }
    
    const savedTheme = localStorage.getItem('app_theme_mode') as ThemeMode;
    if (savedTheme) {
      setThemeMode(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setThemeMode('dark');
    }
    
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try { setWishlist(JSON.parse(savedWishlist)); } catch {}
    }
    
    const savedRecent = localStorage.getItem('ara_recently_viewed');
    if (savedRecent) {
      try { setRecentlyViewed(JSON.parse(savedRecent)); } catch {}
    }
    
    const savedAddresses = localStorage.getItem('app_addresses');
    if (savedAddresses) {
      try { setAddresses(JSON.parse(savedAddresses)); } catch {}
    }
  }, []);

  // Apply dark mode to document
  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === 'dark') {
      root.classList.add('dark');
      root.style.setProperty('--color-background', '#1a1a1a');
      root.style.setProperty('--color-surface', '#2d2d2d');
      root.style.setProperty('--color-text', '#f5f5f5');
      root.style.setProperty('--color-text-secondary', '#b0b0b0');
      root.style.setProperty('--color-border', '#404040');
    } else {
      root.classList.remove('dark');
      root.style.setProperty('--color-background', '#FDF8F3');
      root.style.setProperty('--color-surface', '#FFFFFF');
      root.style.setProperty('--color-text', '#2D2A26');
      root.style.setProperty('--color-text-secondary', '#5C4A32');
      root.style.setProperty('--color-border', '#E8DFD5');
    }
    localStorage.setItem('app_theme_mode', themeMode);
  }, [themeMode]);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem('app_currency', c.code);
  }, []);

  const formatPrice = useCallback((priceInPKR: number) => {
    const converted = priceInPKR * currency.rate;
    if (currency.code === 'PKR') {
      return `Rs ${Math.round(converted).toLocaleString()}`;
    }
    return new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: currency.code === 'JPY' ? 0 : 2,
    }).format(converted);
  }, [currency]);

  const toggleTheme = useCallback(() => {
    setThemeMode(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist(prev => {
      const newWishlist = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
      return newWishlist;
    });
  }, []);

  const isInWishlist = useCallback((productId: string) => {
    return wishlist.includes(productId);
  }, [wishlist]);

  const addToRecentlyViewed = useCallback((productId: string) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== productId);
      const newRecent = [productId, ...filtered].slice(0, 10);
      localStorage.setItem('ara_recently_viewed', JSON.stringify(newRecent));
      return newRecent;
    });
  }, []);

  const addAddress = useCallback((address: Omit<Address, 'id'>) => {
    const newAddress: Address = { ...address, id: `addr-${Date.now()}` };
    setAddresses(prev => {
      const updated = address.isDefault 
        ? prev.map(a => ({ ...a, isDefault: false }))
        : prev;
      const final = [...updated, newAddress];
      localStorage.setItem('app_addresses', JSON.stringify(final));
      return final;
    });
  }, []);

  const removeAddress = useCallback((id: string) => {
    setAddresses(prev => {
      const final = prev.filter(a => a.id !== id);
      localStorage.setItem('app_addresses', JSON.stringify(final));
      return final;
    });
  }, []);

  const setDefaultAddress = useCallback((id: string) => {
    setAddresses(prev => {
      const final = prev.map(a => ({ ...a, isDefault: a.id === id }));
      localStorage.setItem('app_addresses', JSON.stringify(final));
      return final;
    });
  }, []);

  const defaultAddress = addresses.find(a => a.isDefault) || null;

  return (
    <AppContext.Provider value={{
      currency, setCurrency, formatPrice,
      themeMode, toggleTheme,
      wishlist, toggleWishlist, isInWishlist,
      recentlyViewed, addToRecentlyViewed,
      addresses, addAddress, removeAddress, setDefaultAddress, defaultAddress,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
