// Product Types
export interface Product {
  id: string;
  name: string;
  slug: string;
  category: Category;
  description: string;
  mainImage: string;
  galleryImages: string[];
  priceFrom: number;
  compareAt?: number;
  stock: number;
  badge?: string;
  featured: boolean;
  isNew: boolean;
  customizable: boolean;
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  size: Size;
  type: VariantType;
  price: number;
  stock: number;
  sku: string;
}

export type Size = 'Single' | 'Double' | 'Queen' | 'King';
export type VariantType = 'Bed Sheet Set' | 'Comforter Set' | 'Quilt Cover Set' | 'Fitted Sheet Only';
export type Category = 'Bed Sheets' | 'Comforters' | 'Quilt Covers' | 'Kids' | 'Accessories' | 'Quilts';

// Order Types
export interface Order {
  id: string;
  orderNumber: string;
  customer: Customer;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentProof?: string;
  notes?: string;
  courier?: string;
  trackingNumber?: string;
  statusHistory: StatusUpdate[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  variantId: string;
  size: Size;
  type: VariantType;
  price: number;
  quantity: number;
  image: string;
}

export interface Customer {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

export type OrderStatus = 'new' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cod' | 'jazzcash' | 'easypaisa';

export interface StatusUpdate {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  password: string; // hashed
  name: string;
  role: UserRole;
  createdAt: string;
}

export type UserRole = 'superadmin' | 'admin' | 'manager' | 'support';

// Review Types
export interface Review {
  id: string;
  productId: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: string;
}

// Media Types
export interface Media {
  id: string;
  url: string;
  filename: string;
  tags: string[];
  usageCount: number;
  uploadedAt: string;
}

// Cart Item (used in UI state)
export interface CartItem {
  productId: string;
  productName: string;
  variantId: string;
  size: Size;
  type: VariantType;
  price: number;
  quantity: number;
  image: string;
}

// Wishlist
export interface Wishlist {
  productId: string;
  addedAt: string;
}

// Settings
export interface SiteSettings {
  siteName: string;
  logo: string;
  favicon: string;
  whatsapp: string;
  jazzcash: string;
  easypaisa: string;
  shippingFee: number;
  freeShippingThreshold?: number;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
}

// Menu
export interface MenuItem {
  id: string;
  label: string;
  href: string;
  order: number;
  children?: MenuItem[];
}
