/**
 * ARA BEDDINGS - API Service Layer
 * This service layer abstracts all backend operations
 * Can be easily replaced with real API calls to Express/PostgreSQL
 */

import { useStore } from '../store';
import { logger } from './logger';
import { cache } from './cache';
import { analytics } from './analytics';

// Simulate network delay for realistic behavior
const simulateDelay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// API Response types
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ============================================
// PRODUCTS API
// ============================================
export const productsApi = {
  async getAll(filters?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    size?: string;
    color?: string;
    inStock?: boolean;
    sortBy?: string;
  }): Promise<ApiResponse<any[]>> {
    try {
      logger.info('Fetching products', { filters });
      await simulateDelay();
      
      const cacheKey = `products_${JSON.stringify(filters)}`;
      const cached = cache.get<any[]>(cacheKey);
      if (cached) {
        logger.debug('Products loaded from cache');
        return { success: true, data: cached };
      }

      const { products } = useStore.getState();
      let filtered = [...products];

      // Apply filters
      if (filters?.category) {
        filtered = filtered.filter(p => p.categoryId === filters.category);
      }
      if (filters?.search) {
        const search = filters.search.toLowerCase();
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search)
        );
      }
      if (filters?.minPrice !== undefined) {
        filtered = filtered.filter(p => p.basePrice >= filters.minPrice!);
      }
      if (filters?.maxPrice !== undefined) {
        filtered = filtered.filter(p => p.basePrice <= filters.maxPrice!);
      }
      if (filters?.inStock) {
        filtered = filtered.filter(p => p.variants.some(v => v.stock > 0));
      }

      // Sort
      if (filters?.sortBy === 'price-low') {
        filtered.sort((a, b) => a.basePrice - b.basePrice);
      } else if (filters?.sortBy === 'price-high') {
        filtered.sort((a, b) => b.basePrice - a.basePrice);
      } else if (filters?.sortBy === 'newest') {
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }

      cache.set(cacheKey, filtered, 60000); // Cache for 1 minute
      analytics.track('products_viewed', { count: filtered.length, filters });
      
      return { success: true, data: filtered };
    } catch (error) {
      logger.error('Failed to fetch products', error);
      return { success: false, error: 'Failed to fetch products' };
    }
  },

  async getBySlug(slug: string): Promise<ApiResponse<any>> {
    try {
      logger.info('Fetching product', { slug });
      await simulateDelay(200);
      
      const { getProduct } = useStore.getState();
      const product = getProduct(slug);
      
      if (!product) {
        return { success: false, error: 'Product not found' };
      }

      analytics.track('product_viewed', { productId: product.id, slug });
      return { success: true, data: product };
    } catch (error) {
      logger.error('Failed to fetch product', error);
      return { success: false, error: 'Failed to fetch product' };
    }
  },

  async getFeatured(): Promise<ApiResponse<any[]>> {
    try {
      logger.info('Fetching featured products');
      await simulateDelay(200);
      
      const { products } = useStore.getState();
      const featured = products.filter(p => p.isFeatured);
      
      return { success: true, data: featured };
    } catch (error) {
      logger.error('Failed to fetch featured products', error);
      return { success: false, error: 'Failed to fetch featured products' };
    }
  }
};

// ============================================
// CART API
// ============================================
export const cartApi = {
  async getCart(): Promise<ApiResponse<any>> {
    try {
      logger.info('Fetching cart');
      await simulateDelay(100);
      
      const { cart, cartTotal, cartCount } = useStore.getState();
      
      return {
        success: true,
        data: {
          items: cart,
          total: cartTotal(),
          count: cartCount()
        }
      };
    } catch (error) {
      logger.error('Failed to fetch cart', error);
      return { success: false, error: 'Failed to fetch cart' };
    }
  },

  async addToCart(productId: string, variantId: string, quantity: number = 1): Promise<ApiResponse<any>> {
    try {
      logger.info('Adding to cart', { productId, variantId, quantity });
      await simulateDelay(200);
      
      const { addToCart, products } = useStore.getState();
      const product = products.find(p => p.id === productId);
      const variant = product?.variants.find(v => v.id === variantId);

      if (!variant) {
        return { success: false, error: 'Variant not found' };
      }

      if (variant.stock < quantity) {
        return { success: false, error: 'Insufficient stock' };
      }

      addToCart(productId, variantId, quantity);
      analytics.track('product_added_to_cart', { productId, variantId, quantity });
      
      return { success: true, message: 'Item added to cart' };
    } catch (error) {
      logger.error('Failed to add to cart', error);
      return { success: false, error: 'Failed to add to cart' };
    }
  },

  async updateQuantity(itemId: string, quantity: number): Promise<ApiResponse<any>> {
    try {
      logger.info('Updating cart quantity', { itemId, quantity });
      await simulateDelay(100);
      
      const { updateCartQuantity } = useStore.getState();
      updateCartQuantity(itemId, quantity);
      
      return { success: true, message: 'Cart updated' };
    } catch (error) {
      logger.error('Failed to update cart', error);
      return { success: false, error: 'Failed to update cart' };
    }
  },

  async removeFromCart(itemId: string): Promise<ApiResponse<any>> {
    try {
      logger.info('Removing from cart', { itemId });
      await simulateDelay(100);
      
      const { removeFromCart } = useStore.getState();
      removeFromCart(itemId);
      
      return { success: true, message: 'Item removed from cart' };
    } catch (error) {
      logger.error('Failed to remove from cart', error);
      return { success: false, error: 'Failed to remove from cart' };
    }
  },

  async clearCart(): Promise<ApiResponse<any>> {
    try {
      logger.info('Clearing cart');
      await simulateDelay(100);
      
      const { clearCart } = useStore.getState();
      clearCart();
      
      return { success: true, message: 'Cart cleared' };
    } catch (error) {
      logger.error('Failed to clear cart', error);
      return { success: false, error: 'Failed to clear cart' };
    }
  }
};

// ============================================
// ORDERS API
// ============================================
export const ordersApi = {
  async createOrder(orderData: any): Promise<ApiResponse<any>> {
    try {
      logger.info('Creating order', orderData);
      await simulateDelay(500);
      
      const { addOrder, clearCart, user } = useStore.getState();
      
      const orderNumber = `ARA-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`;
      
      const order = {
        id: `ord-${Date.now()}`,
        orderNumber,
        userId: user?.id,
        status: 'PENDING',
        ...orderData,
        createdAt: new Date().toISOString(),
        statusHistory: [{
          id: `sh-${Date.now()}`,
          status: 'PENDING',
          createdAt: new Date().toISOString()
        }]
      };

      addOrder(order);
      clearCart();
      
      analytics.track('order_created', { orderId: order.id, total: order.total });
      logger.success('Order created successfully', { orderNumber });
      
      return { success: true, data: order, message: 'Order created successfully' };
    } catch (error) {
      logger.error('Failed to create order', error);
      return { success: false, error: 'Failed to create order' };
    }
  },

  async getOrders(): Promise<ApiResponse<any[]>> {
    try {
      logger.info('Fetching orders');
      await simulateDelay(200);
      
      const { orders, user } = useStore.getState();
      const userOrders = orders.filter(o => o.userId === user?.id);
      
      return { success: true, data: userOrders };
    } catch (error) {
      logger.error('Failed to fetch orders', error);
      return { success: false, error: 'Failed to fetch orders' };
    }
  },

  async getOrderById(orderId: string): Promise<ApiResponse<any>> {
    try {
      logger.info('Fetching order', { orderId });
      await simulateDelay(200);
      
      const { orders } = useStore.getState();
      const order = orders.find(o => o.id === orderId);
      
      if (!order) {
        return { success: false, error: 'Order not found' };
      }
      
      return { success: true, data: order };
    } catch (error) {
      logger.error('Failed to fetch order', error);
      return { success: false, error: 'Failed to fetch order' };
    }
  },

  async trackOrderByNumber(orderNumber: string): Promise<ApiResponse<any>> {
    try {
      logger.info('Tracking order', { orderNumber });
      await simulateDelay(200);
      
      const { orders } = useStore.getState();
      const order = orders.find(o => o.orderNumber === orderNumber);
      
      if (!order) {
        return { success: false, error: 'Order not found' };
      }
      
      analytics.track('order_tracked', { orderNumber });
      return { success: true, data: order };
    } catch (error) {
      logger.error('Failed to track order', error);
      return { success: false, error: 'Failed to track order' };
    }
  }
};

// ============================================
// WISHLIST API
// ============================================
export const wishlistApi = {
  async getWishlist(): Promise<ApiResponse<any[]>> {
    try {
      logger.info('Fetching wishlist');
      await simulateDelay(100);
      
      const { wishlist } = useStore.getState();
      return { success: true, data: wishlist };
    } catch (error) {
      logger.error('Failed to fetch wishlist', error);
      return { success: false, error: 'Failed to fetch wishlist' };
    }
  },

  async toggleWishlist(productId: string): Promise<ApiResponse<{ action: string }>> {
    try {
      logger.info('Toggling wishlist', { productId });
      await simulateDelay(100);
      
      const { toggleWishlist, isInWishlist } = useStore.getState();
      const wasInWishlist = isInWishlist(productId);
      toggleWishlist(productId);
      
      const action = wasInWishlist ? 'removed' : 'added';
      analytics.track(`wishlist_${action}`, { productId });
      
      return { success: true, data: { action } };
    } catch (error) {
      logger.error('Failed to toggle wishlist', error);
      return { success: false, error: 'Failed to toggle wishlist' };
    }
  }
};

// ============================================
// AUTH API
// ============================================
export const authApi = {
  async login(email: string, password: string): Promise<ApiResponse<any>> {
    try {
      logger.info('Login attempt', { email });
      await simulateDelay(300);
      
      const { login } = useStore.getState();
      const success = login(email, password);
      
      if (!success) {
        analytics.track('login_failed', { email });
        return { success: false, error: 'Invalid credentials' };
      }

      const { user } = useStore.getState();
      analytics.track('login_success', { userId: user?.id, role: user?.role });
      logger.success('Login successful', { email });
      
      return { success: true, data: user, message: 'Login successful' };
    } catch (error) {
      logger.error('Login failed', error);
      return { success: false, error: 'Login failed' };
    }
  },

  async logout(): Promise<ApiResponse<any>> {
    try {
      logger.info('Logout');
      await simulateDelay(100);
      
      const { logout, user } = useStore.getState();
      analytics.track('logout', { userId: user?.id });
      logout();
      
      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      logger.error('Logout failed', error);
      return { success: false, error: 'Logout failed' };
    }
  },

  async getCurrentUser(): Promise<ApiResponse<any>> {
    try {
      const { user } = useStore.getState();
      
      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }
      
      return { success: true, data: user };
    } catch (error) {
      logger.error('Failed to get current user', error);
      return { success: false, error: 'Failed to get current user' };
    }
  }
};

// ============================================
// CUSTOM ORDERS API
// ============================================
export const customOrdersApi = {
  async createCustomOrder(orderData: any): Promise<ApiResponse<any>> {
    try {
      logger.info('Creating custom order', orderData);
      await simulateDelay(500);
      
      const { addDrugOrder, user } = useStore.getState();
      
      const reference = `ARA-CUSTOM-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`;
      
      const customOrder = {
        id: `do-${Date.now()}`,
        reference,
        userId: user?.id,
        status: 'SUBMITTED',
        ...orderData,
        createdAt: new Date().toISOString()
      };

      addDrugOrder(customOrder);
      analytics.track('custom_order_created', { reference });
      logger.success('Custom order created', { reference });
      
      return { success: true, data: customOrder, message: 'Custom order submitted successfully' };
    } catch (error) {
      logger.error('Failed to create custom order', error);
      return { success: false, error: 'Failed to create custom order' };
    }
  },

  async getCustomOrders(): Promise<ApiResponse<any[]>> {
    try {
      logger.info('Fetching custom orders');
      await simulateDelay(200);
      
      const { drugOrders, user } = useStore.getState();
      const userOrders = drugOrders.filter(o => o.userId === user?.id);
      
      return { success: true, data: userOrders };
    } catch (error) {
      logger.error('Failed to fetch custom orders', error);
      return { success: false, error: 'Failed to fetch custom orders' };
    }
  },

  async trackCustomOrder(reference: string): Promise<ApiResponse<any>> {
    try {
      logger.info('Tracking custom order', { reference });
      await simulateDelay(200);
      
      const { drugOrders } = useStore.getState();
      const order = drugOrders.find(o => o.reference === reference);
      
      if (!order) {
        return { success: false, error: 'Custom order not found' };
      }
      
      return { success: true, data: order };
    } catch (error) {
      logger.error('Failed to track custom order', error);
      return { success: false, error: 'Failed to track custom order' };
    }
  }
};

// ============================================
// ADMIN API
// ============================================
export const adminApi = {
  async getStats(): Promise<ApiResponse<any>> {
    try {
      logger.info('Fetching admin stats');
      await simulateDelay(200);
      
      const { orders, products, drugOrders } = useStore.getState();
      
      const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
      const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
      const pendingPayments = orders.filter(o => o.payment.status === 'AWAITING_VERIFICATION').length;
      
      return {
        success: true,
        data: {
          totalRevenue,
          totalOrders: orders.length,
          pendingOrders,
          pendingPayments,
          totalProducts: products.length,
          totalCustomOrders: drugOrders.length
        }
      };
    } catch (error) {
      logger.error('Failed to fetch admin stats', error);
      return { success: false, error: 'Failed to fetch admin stats' };
    }
  },

  async updateOrderStatus(orderId: string, status: string, note?: string): Promise<ApiResponse<any>> {
    try {
      logger.info('Updating order status', { orderId, status });
      await simulateDelay(300);
      
      const { updateOrderStatus } = useStore.getState();
      updateOrderStatus(orderId, status as any, note);
      
      analytics.track('order_status_updated', { orderId, status });
      logger.success('Order status updated', { orderId, status });
      
      return { success: true, message: 'Order status updated' };
    } catch (error) {
      logger.error('Failed to update order status', error);
      return { success: false, error: 'Failed to update order status' };
    }
  },

  async verifyPayment(orderId: string): Promise<ApiResponse<any>> {
    try {
      logger.info('Verifying payment', { orderId });
      await simulateDelay(300);
      
      const { verifyPayment } = useStore.getState();
      verifyPayment(orderId);
      
      analytics.track('payment_verified', { orderId });
      logger.success('Payment verified', { orderId });
      
      return { success: true, message: 'Payment verified successfully' };
    } catch (error) {
      logger.error('Failed to verify payment', error);
      return { success: false, error: 'Failed to verify payment' };
    }
  }
};

// ============================================
// EXPORT ALL APIs
// ============================================
export const api = {
  products: productsApi,
  cart: cartApi,
  orders: ordersApi,
  wishlist: wishlistApi,
  auth: authApi,
  customOrders: customOrdersApi,
  admin: adminApi
};
