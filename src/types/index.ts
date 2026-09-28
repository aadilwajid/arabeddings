// ─── ENUMS ─────────────────────────────────────────────
export type Role = 'CUSTOMER' | 'ADMIN' | 'STAFF';
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
export type PaymentMethod = 'COD' | 'BANK_TRANSFER';
export type PaymentStatus = 'PENDING' | 'AWAITING_VERIFICATION' | 'VERIFIED' | 'FAILED' | 'REFUNDED';
export type DrugOrderStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'QUOTED' | 'APPROVED' | 'REJECTED' | 'CONVERTED' | 'CANCELLED';

// ─── USER & AUTH ───────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  image?: string;
  createdAt: string;
}

export interface Address {
  id: string;
  userId: string;
  label?: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

// ─── CATALOG ───────────────────────────────────────────
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  sortOrder: number;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  sortOrder: number;
}

export interface Option {
  id: string;
  name: string;
  values: OptionValue[];
}

export interface OptionValue {
  id: string;
  optionId: string;
  value: string;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  price: number;
  comparePrice?: number;
  stock: number;
  weightGrams?: number;
  image?: string;
  isActive: boolean;
  optionValues: { optionId: string; optionName: string; value: string }[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc?: string;
  categoryId: string;
  brand?: string;
  material?: string;
  basePrice: number;
  isActive: boolean;
  isFeatured: boolean;
  images: ProductImage[];
  options: Option[];
  variants: ProductVariant[];
  reviews: Review[];
  createdAt: string;
}

// ─── CART & WISHLIST ───────────────────────────────────
export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  quantity: number;
  product?: Product;
  variant?: ProductVariant;
}

export interface WishlistItem {
  id: string;
  productId: string;
  product?: Product;
}

// ─── SHIPPING ──────────────────────────────────────────
export interface ShippingZone {
  id: string;
  name: string;
  countries: string[];
  isActive: boolean;
  methods: ShippingMethod[];
}

export interface ShippingMethod {
  id: string;
  zoneId: string;
  name: string;
  rate: number;
  freeOverAmount?: number;
  minDays?: number;
  maxDays?: number;
  isActive: boolean;
}

// ─── ORDERS ────────────────────────────────────────────
export interface OrderItem {
  id: string;
  productId: string;
  variantId: string;
  productName: string;
  variantName: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  status: OrderStatus;
  subtotal: number;
  shippingFee: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  currency: string;
  notes?: string;
  items: OrderItem[];
  payment: Payment;
  shippingAddress: Address;
  shippingMethod: ShippingMethod;
  statusHistory: OrderStatusHistory[];
  createdAt: string;
}

export interface OrderStatusHistory {
  id: string;
  status: OrderStatus;
  note?: string;
  changedBy?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  orderId: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  reference?: string;
  receiptUrl?: string;
  verifiedAt?: string;
  notes?: string;
}

// ─── DRUG ORDER ────────────────────────────────────────
export interface DrugOrder {
  id: string;
  reference: string;
  userId?: string;
  fullName: string;
  email: string;
  phone: string;
  itemType: string;
  size?: string;
  quantity: number;
  fabric?: string;
  color?: string;
  deliveryAddress: string;
  notes?: string;
  status: DrugOrderStatus;
  quotedPrice?: number;
  adminNotes?: string;
  createdAt: string;
}

// ─── REVIEWS ───────────────────────────────────────────
export interface Review {
  id: string;
  userId: string;
  userName: string;
  productId: string;
  rating: number;
  title?: string;
  body?: string;
  isApproved: boolean;
  createdAt: string;
}

// ─── SETTINGS ──────────────────────────────────────────
export interface SiteSettings {
  bankTransferDetails: string;
  freeShippingThreshold: number;
  storeName: string;
  storeEmail: string;
  storePhone: string;
  logo?: string;
}

// ─── MEDIA ─────────────────────────────────────────────
export interface MediaItem {
  id: string;
  url: string;
  name: string;
  type: 'image' | 'document' | 'other';
  size: number;
  uploadedAt: string;
  alt?: string;
}
