/**
 * ARA BEDDINGS - Cache Service
 * In-memory caching with localStorage persistence
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class CacheService {
  private memoryCache: Map<string, CacheEntry<any>> = new Map();
  private storageKey = 'ara_cache';
  private maxEntries = 100;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const entries = JSON.parse(saved);
        entries.forEach((entry: any) => {
          this.memoryCache.set(entry.key, entry.value);
        });
      }
    } catch (e) {
      console.error('Failed to load cache from storage');
    }
  }

  private saveToStorage() {
    try {
      const entries = Array.from(this.memoryCache.entries()).map(([key, value]) => ({
        key,
        value
      }));
      localStorage.setItem(this.storageKey, JSON.stringify(entries));
    } catch (e) {
      console.error('Failed to save cache to storage');
    }
  }

  set<T>(key: string, data: T, ttl: number = 300000): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl
    };

    this.memoryCache.set(key, entry);

    // Remove oldest entries if cache is full
    if (this.memoryCache.size > this.maxEntries) {
      const oldestKey = this.memoryCache.keys().next().value;
      if (oldestKey) {
        this.memoryCache.delete(oldestKey);
      }
    }

    this.saveToStorage();
  }

  get<T>(key: string): T | null {
    const entry = this.memoryCache.get(key) as CacheEntry<T> | undefined;
    
    if (!entry) {
      return null;
    }

    // Check if expired
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.memoryCache.delete(key);
      this.saveToStorage();
      return null;
    }

    return entry.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    this.memoryCache.delete(key);
    this.saveToStorage();
  }

  clear(): void {
    this.memoryCache.clear();
    localStorage.removeItem(this.storageKey);
    console.log('🗑️ Cache cleared');
  }

  getStats() {
    return {
      size: this.memoryCache.size,
      keys: Array.from(this.memoryCache.keys())
    };
  }

  // Helper methods for common cache patterns
  setProducts(data: any[], ttl: number = 60000) {
    this.set('products', data, ttl);
  }

  getProducts(): any[] | null {
    return this.get('products');
  }

  setProduct(slug: string, data: any, ttl: number = 300000) {
    this.set(`product_${slug}`, data, ttl);
  }

  getProduct(slug: string): any | null {
    return this.get(`product_${slug}`);
  }

  setUser(user: any, ttl: number = 3600000) {
    this.set('user', user, ttl);
  }

  getUser(): any | null {
    return this.get('user');
  }

  setCart(cart: any[], ttl: number = 300000) {
    this.set('cart', cart, ttl);
  }

  getCart(): any[] | null {
    return this.get('cart');
  }
}

export const cache = new CacheService();

// Make cache available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).cache = cache;
}
