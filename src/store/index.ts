import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, WishlistItem, Order, DrugOrder, User, Address, OrderStatus, DrugOrderStatus, PaymentStatus, MediaItem, HeroSlide } from '../types';
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

  // Media
  media: MediaItem[];
  addMedia: (item: MediaItem) => void;
  removeMedia: (id: string) => void;
  updateMedia: (id: string, updates: Partial<MediaItem>) => void;

  // Coupons
  appliedCoupon: Coupon | null;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;

  // Hero Slides
  heroSlides: HeroSlide[];
  addHeroSlide: (slide: HeroSlide) => void;
  updateHeroSlide: (id: string, updates: Partial<HeroSlide>) => void;
  removeHeroSlide: (id: string) => void;
  reorderHeroSlides: (slides: HeroSlide[]) => void;
}

interface Coupon {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  minOrder: number;
  maxDiscount?: number;
  validUntil: string;
  description: string;
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
          orders: get().orders.map(o => {
            if (o.id !== orderId) return o;
            const now = new Date().toISOString();
            const updates: Partial<Order> = {
              payment: { ...o.payment, status: 'VERIFIED' as PaymentStatus, verifiedAt: now }
            };
            // Auto-confirm order if still pending
            if (o.status === 'PENDING') {
              updates.status = 'CONFIRMED';
              updates.statusHistory = [...o.statusHistory, { id: `sh-${Date.now()}`, status: 'CONFIRMED', note: 'Payment verified', createdAt: now }];
            }
            return { ...o, ...updates };
          })
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
        { id: 'addr-1', userId: 'u-1', fullName: 'Ahmed Khan', phone: '+92 321 1234567', line1: 'House 45, Street 12', line2: 'DHA Phase 5', city: 'Lahore', state: 'Punjab', postalCode: '54000', country: 'PK', isDefault: true },
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

      // Media
      media: [],
      addMedia: (item: MediaItem) => set({ media: [item, ...get().media] }),
      removeMedia: (id: string) => set({ media: get().media.filter(m => m.id !== id) }),
      updateMedia: (id: string, updates: Partial<MediaItem>) => {
        set({
          media: get().media.map(m => m.id === id ? { ...m, ...updates } : m)
        });
      },

      // Coupons
      appliedCoupon: null,
      applyCoupon: (coupon: Coupon) => set({ appliedCoupon: coupon }),
      removeCoupon: () => set({ appliedCoupon: null }),

      // Hero Slides
      heroSlides: [
        {
          id: 'slide-1',
          title: 'Transform Your Sleep with Luxury Bedding',
          subtitle: 'Premium Egyptian Cotton Collection',
          image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80',
          cta: 'Shop Now',
          ctaLink: '/products',
          isActive: true,
          sortOrder: 0
        },
        {
          id: 'slide-2',
          title: 'Cool & Comfortable Bamboo Bedding',
          subtitle: 'Perfect for Pakistani Summers',
          image: 'https://images.unsplash.com/photo-1616627561839-074385245ff6?w=1200&q=80',
          cta: 'Explore Collection',
          ctaLink: '/products?category=bed-sheets',
          isActive: true,
          sortOrder: 1
        },
        {
          id: 'slide-3',
          title: 'Handcrafted Artisan Blankets',
          subtitle: 'Organic Cotton, Timeless Design',
          image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80',
          cta: 'View Collection',
          ctaLink: '/products?category=blankets',
          isActive: true,
          sortOrder: 2
        }
      ],
      addHeroSlide: (slide: HeroSlide) => set({ heroSlides: [...get().heroSlides, slide] }),
      updateHeroSlide: (id: string, updates: Partial<HeroSlide>) => {
        set({
          heroSlides: get().heroSlides.map(s => s.id === id ? { ...s, ...updates } : s)
        });
      },
      removeHeroSlide: (id: string) => {
        set({ heroSlides: get().heroSlides.filter(s => s.id !== id) });
      },
      reorderHeroSlides: (slides: HeroSlide[]) => {
        set({ heroSlides: slides });
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
        darkMode: state.darkMode,
        settings: state.settings,
        media: state.media,
        heroSlides: state.heroSlides,
      }),
    }
  )
);
