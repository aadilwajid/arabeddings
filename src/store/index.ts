import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, WishlistItem, Order, DrugOrder, User, Address, OrderStatus, DrugOrderStatus, PaymentStatus } from '../types';
import { products as initialProducts, currentUser, sampleOrders, sampleDrugOrders, shippingZones, siteSettings, categories } from '../data/mock';
import type { Product, Category, ShippingZone, SiteSettings } from '../types';

interface AppState {
  // Auth
  user: User | null;
  isAdmin: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;

  // Products
  products: Product[];
  categories: Category[];
  getProduct: (slug: string) => Product | undefined;
  getProductsByCategory: (categoryId: string) => Product[];
  searchProducts: (query: string) => Product[];

  // Cart
  cart: CartItem[];
  addToCart: (productId: string, variantId: string, quantity?: number) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartTotal: () => number;
  cartCount: () => number;

  // Wishlist
  wishlist: WishlistItem[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  verifyPayment: (orderId: string) => void;

  // Drug Orders
  drugOrders: DrugOrder[];
  addDrugOrder: (order: DrugOrder) => void;
  updateDrugOrderStatus: (orderId: string, status: DrugOrderStatus, quotedPrice?: number, adminNotes?: string) => void;

  // Addresses
  addresses: Address[];
  addAddress: (address: Address) => void;
  removeAddress: (id: string) => void;

  // Shipping
  shippingZones: ShippingZone[];
  updateShippingZone: (zone: ShippingZone) => void;

  // Settings
  settings: SiteSettings;
  updateSettings: (settings: Partial<SiteSettings>) => void;

  // Dark Mode
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      isAdmin: false,
      login: (email: string, _password: string) => {
        if (email === 'admin@arabeddings.com') {
          set({ user: { id: 'admin-1', name: 'Admin', email: 'admin@arabeddings.com', role: 'ADMIN', createdAt: '2024-01-01T00:00:00Z' }, isAdmin: true });
          return true;
        }
        if (email === 'demo@arabeddings.com') {
          set({ user: currentUser, isAdmin: false });
          return true;
        }
        return false;
      },
      logout: () => set({ user: null, isAdmin: false }),

      // Products
      products: initialProducts,
      categories: categories,
      getProduct: (slug: string) => get().products.find(p => p.slug === slug),
      getProductsByCategory: (categoryId: string) => get().products.filter(p => p.categoryId === categoryId),
      searchProducts: (query: string) => {
        const q = query.toLowerCase();
        return get().products.filter(p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.material?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q)
        );
      },

      // Cart
      cart: [],
      addToCart: (productId: string, variantId: string, quantity = 1) => {
        const cart = get().cart;
        const existing = cart.find(i => i.variantId === variantId);
        if (existing) {
          set({ cart: cart.map(i => i.variantId === variantId ? { ...i, quantity: i.quantity + quantity } : i) });
        } else {
          const product = get().products.find(p => p.id === productId);
          const variant = product?.variants.find(v => v.id === variantId);
          set({ cart: [...cart, { id: `ci-${Date.now()}`, productId, variantId, quantity, product, variant }] });
        }
      },
      updateCartQuantity: (cartItemId: string, quantity: number) => {
        if (quantity <= 0) {
          set({ cart: get().cart.filter(i => i.id !== cartItemId) });
        } else {
          set({ cart: get().cart.map(i => i.id === cartItemId ? { ...i, quantity } : i) });
        }
      },
      removeFromCart: (cartItemId: string) => set({ cart: get().cart.filter(i => i.id !== cartItemId) }),
      clearCart: () => set({ cart: [] }),
      cartTotal: () => get().cart.reduce((sum, i) => sum + (i.variant?.price || 0) * i.quantity, 0),
      cartCount: () => get().cart.reduce((sum, i) => sum + i.quantity, 0),

      // Wishlist
      wishlist: [],
      toggleWishlist: (productId: string) => {
        const wishlist = get().wishlist;
        const exists = wishlist.find(w => w.productId === productId);
        if (exists) {
          set({ wishlist: wishlist.filter(w => w.productId !== productId) });
        } else {
          const product = get().products.find(p => p.id === productId);
          set({ wishlist: [...wishlist, { id: `wi-${Date.now()}`, productId, product }] });
        }
      },
      isInWishlist: (productId: string) => get().wishlist.some(w => w.productId === productId),

      // Orders
      orders: sampleOrders,
      addOrder: (order: Order) => set({ orders: [order, ...get().orders] }),
      updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => {
        set({
          orders: get().orders.map(o => o.id === orderId ? {
            ...o, status,
            statusHistory: [...o.statusHistory, { id: `sh-${Date.now()}`, status, note, createdAt: new Date().toISOString() }]
          } : o)
        });
      },
      verifyPayment: (orderId: string) => {
        set({
          orders: get().orders.map(o => o.id === orderId ? {
            ...o, payment: { ...o.payment, status: 'VERIFIED' as PaymentStatus, verifiedAt: new Date().toISOString() }
          } : o)
        });
      },

      // Drug Orders
      drugOrders: sampleDrugOrders,
      addDrugOrder: (order: DrugOrder) => set({ drugOrders: [order, ...get().drugOrders] }),
      updateDrugOrderStatus: (orderId: string, status: DrugOrderStatus, quotedPrice?: number, adminNotes?: string) => {
        set({
          drugOrders: get().drugOrders.map(o => o.id === orderId ? {
            ...o, status,
            ...(quotedPrice !== undefined && { quotedPrice }),
            ...(adminNotes !== undefined && { adminNotes }),
          } : o)
        });
      },

      // Addresses
      addresses: [
        { id: 'addr-1', userId: 'u-1', fullName: 'Demo Customer', phone: '+1 (555) 123-4567', line1: '123 Main St', city: 'New York', state: 'NY', postalCode: '10001', country: 'US', isDefault: true },
      ],
      addAddress: (address: Address) => set({ addresses: [...get().addresses, address] }),
      removeAddress: (id: string) => set({ addresses: get().addresses.filter(a => a.id !== id) }),

      // Shipping
      shippingZones: shippingZones,
      updateShippingZone: (zone: ShippingZone) => {
        set({ shippingZones: get().shippingZones.map(z => z.id === zone.id ? zone : z) });
      },

      // Settings
      settings: siteSettings,
      updateSettings: (newSettings: Partial<SiteSettings>) => set({ settings: { ...get().settings, ...newSettings } }),

      // Dark Mode
      darkMode: false,
      toggleDarkMode: () => {
        const newMode = !get().darkMode;
        set({ darkMode: newMode });
        if (newMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
    }),
    {
      name: 'bedding-store',
      partialize: (state) => ({
        user: state.user,
        isAdmin: state.isAdmin,
        cart: state.cart,
        wishlist: state.wishlist,
        orders: state.orders,
        drugOrders: state.drugOrders,
        addresses: state.addresses,
      }),
    }
  )
);
