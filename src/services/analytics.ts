/**
 * ARA BEDDINGS - Analytics Service
 * Track user behavior and business metrics
 */

interface AnalyticsEvent {
  id: string;
  event: string;
  data?: any;
  timestamp: string;
  userId?: string;
  sessionId: string;
}

class AnalyticsService {
  private events: AnalyticsEvent[] = [];
  private sessionId: string;
  private storageKey = 'ara_analytics';
  private maxEvents = 5000;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.loadFromStorage();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadFromStorage() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        this.events = JSON.parse(saved);
      }
    } catch (e) {
      this.events = [];
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.events.slice(-this.maxEvents)));
    } catch (e) {
      console.error('Failed to save analytics');
    }
  }

  track(event: string, data?: any): void {
    let userId: string | undefined;
    try {
      const store = (window as any).__STORE__;
      if (store) {
        userId = store.getState().user?.id;
      }
    } catch (e) {
      // Ignore if store not available
    }
    
    const analyticsEvent: AnalyticsEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      event,
      data,
      timestamp: new Date().toISOString(),
      userId,
      sessionId: this.sessionId
    };

    this.events.push(analyticsEvent);

    // Remove oldest events if too many
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    this.saveToStorage();

    // Console log in development
    console.log(`📊 [Analytics] ${event}`, data || '');
  }

  // E-commerce specific tracking methods
  trackPageView(page: string, data?: any) {
    this.track('page_view', { page, ...data });
  }

  trackProductView(productId: string, data?: any) {
    this.track('product_view', { productId, ...data });
  }

  trackAddToCart(productId: string, variantId: string, quantity: number) {
    this.track('add_to_cart', { productId, variantId, quantity });
  }

  trackCheckoutStart() {
    this.track('checkout_start');
  }

  trackPurchase(orderId: string, total: number, items: number) {
    this.track('purchase', { orderId, total, items });
  }

  trackSearch(query: string, results: number) {
    this.track('search', { query, results });
  }

  trackFilter(filterType: string, filterValue: string) {
    this.track('filter_applied', { filterType, filterValue });
  }

  trackLogin(method: string, success: boolean) {
    this.track('login', { method, success });
  }

  trackSignup(method: string) {
    this.track('signup', { method });
  }

  trackError(error: string, context?: string) {
    this.track('error', { error, context });
  }

  // Get analytics data
  getEvents(event?: string): AnalyticsEvent[] {
    if (event) {
      return this.events.filter(e => e.event === event);
    }
    return [...this.events];
  }

  getEventsByUser(userId: string): AnalyticsEvent[] {
    return this.events.filter(e => e.userId === userId);
  }

  getRecentEvents(count: number = 50): AnalyticsEvent[] {
    return this.events.slice(-count);
  }

  // Get analytics summary
  getSummary(days: number = 7) {
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
    const recentEvents = this.events.filter(e => new Date(e.timestamp).getTime() > cutoff);

    return {
      totalEvents: recentEvents.length,
      pageViews: recentEvents.filter(e => e.event === 'page_view').length,
      productViews: recentEvents.filter(e => e.event === 'product_view').length,
      addToCart: recentEvents.filter(e => e.event === 'add_to_cart').length,
      purchases: recentEvents.filter(e => e.event === 'purchase').length,
      searches: recentEvents.filter(e => e.event === 'search').length,
      uniqueUsers: new Set(recentEvents.map(e => e.userId).filter(Boolean)).size,
      byEvent: recentEvents.reduce((acc, e) => {
        acc[e.event] = (acc[e.event] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }

  // Export analytics data
  export(): string {
    return JSON.stringify(this.events, null, 2);
  }

  // Clear analytics data
  clear(): void {
    this.events = [];
    localStorage.removeItem(this.storageKey);
    console.log('🗑️ Analytics cleared');
  }

  // Get session info
  getSessionInfo() {
    return {
      sessionId: this.sessionId,
      eventCount: this.events.length,
      startTime: this.events[0]?.timestamp
    };
  }
}

export const analytics = new AnalyticsService();

// Make analytics available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).analytics = analytics;
}
