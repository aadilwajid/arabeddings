// Feature Toggle System
// Allows enabling/disabling features dynamically

export interface FeatureConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: 'storefront' | 'admin' | 'marketing' | 'technical' | 'checkout' | 'customer' | 'notifications';
  icon?: string;
}

const FEATURES_KEY = 'ara_feature_flags';

const DEFAULT_FEATURES: FeatureConfig[] = [
  // Storefront Features
  {
    id: 'recently_viewed',
    name: 'Recently Viewed Products',
    description: 'Show recently viewed products carousel on homepage',
    enabled: true,
    category: 'storefront'
  },
  {
    id: 'product_comparison',
    name: 'Product Comparison',
    description: 'Allow customers to compare products side-by-side',
    enabled: true,
    category: 'storefront'
  },
  {
    id: 'bundle_builder',
    name: 'Bundle Builder',
    description: 'Allow customers to create custom bundles with discount',
    enabled: true,
    category: 'storefront'
  },
  {
    id: 'photo_reviews',
    name: 'Photo Reviews',
    description: 'Allow customers to upload photos with reviews',
    enabled: true,
    category: 'storefront'
  },
  {
    id: 'size_guide',
    name: 'Size Guide Modal',
    description: 'Show size guide in product detail modal',
    enabled: true,
    category: 'storefront'
  },
  
  // Marketing Features
  {
    id: 'loyalty_program',
    name: 'Loyalty Points Program',
    description: 'Reward customers with points for purchases',
    enabled: true,
    category: 'marketing'
  },
  {
    id: 'referral_program',
    name: 'Referral Program',
    description: 'Give Rs 500, Get Rs 500 referral system',
    enabled: true,
    category: 'marketing'
  },
  {
    id: 'discount_codes',
    name: 'Discount Codes',
    description: 'Allow customers to use discount codes at checkout',
    enabled: true,
    category: 'marketing'
  },
  {
    id: 'abandoned_cart',
    name: 'Abandoned Cart Recovery',
    description: 'Notify customers about abandoned carts',
    enabled: true,
    category: 'marketing'
  },
  
  // Technical Features
  {
    id: 'city_delivery_estimate',
    name: 'City Delivery Estimates',
    description: 'Show delivery time estimates based on city',
    enabled: true,
    category: 'technical'
  },
  {
    id: 'lazy_loading',
    name: 'Lazy Loading Images',
    description: 'Load images only when they enter viewport',
    enabled: true,
    category: 'technical'
  },
  {
    id: 'pwa_support',
    name: 'PWA Support',
    description: 'Progressive Web App for mobile installation',
    enabled: true,
    category: 'technical'
  },
  {
    id: 'dark_mode',
    name: 'Dark Mode',
    description: 'Allow users to switch between light and dark themes',
    enabled: true,
    category: 'technical'
  },
  {
    id: 'multi_currency',
    name: 'Multi-Currency Support',
    description: 'Allow customers to view prices in different currencies',
    enabled: true,
    category: 'technical'
  },
  {
    id: 'voice_search',
    name: 'Voice Search',
    description: 'Enable voice-based product search',
    enabled: true,
    category: 'technical'
  },
  
  // Checkout Features
  {
    id: 'gift_wrapping',
    name: 'Gift Wrapping',
    description: 'Allow customers to add gift wrapping to orders',
    enabled: true,
    category: 'checkout'
  },
  {
    id: 'address_book',
    name: 'Address Book',
    description: 'Allow customers to save multiple shipping addresses',
    enabled: true,
    category: 'checkout'
  },
  {
    id: 'order_notes',
    name: 'Order Notes',
    description: 'Allow customers to add notes to their orders',
    enabled: true,
    category: 'checkout'
  },
  {
    id: 'multiple_payment_methods',
    name: 'Multiple Payment Methods',
    description: 'Enable COD, JazzCash, and Easypaisa payment options',
    enabled: true,
    category: 'checkout'
  },
  
  // Customer Features
  {
    id: 'customer_accounts',
    name: 'Customer Accounts',
    description: 'Allow customers to create accounts and view order history',
    enabled: true,
    category: 'customer'
  },
  {
    id: 'order_history',
    name: 'Order History',
    description: 'Show customers their past orders',
    enabled: true,
    category: 'customer'
  },
  {
    id: 'wishlist',
    name: 'Wishlist',
    description: 'Allow customers to save products for later',
    enabled: true,
    category: 'customer'
  },
  {
    id: 'wishlist_share',
    name: 'Wishlist Sharing',
    description: 'Allow customers to share their wishlist',
    enabled: true,
    category: 'customer'
  },
  {
    id: 'order_tracking',
    name: 'Order Tracking',
    description: 'Allow customers to track their orders',
    enabled: true,
    category: 'customer'
  },
  
  // Notification Features
  {
    id: 'email_notifications',
    name: 'Email Notifications',
    description: 'Send email notifications for orders and updates',
    enabled: true,
    category: 'notifications'
  },
  {
    id: 'sms_notifications',
    name: 'SMS Notifications',
    description: 'Send SMS notifications for orders and updates',
    enabled: true,
    category: 'notifications'
  },
  {
    id: 'low_stock_alerts',
    name: 'Low Stock Alerts',
    description: 'Send alerts when products are low in stock',
    enabled: true,
    category: 'notifications'
  },
  {
    id: 'back_in_stock',
    name: 'Back in Stock Notifications',
    description: 'Notify customers when out-of-stock items are available',
    enabled: true,
    category: 'notifications'
  },
  
  // Admin Features
  {
    id: 'advanced_analytics',
    name: 'Advanced Analytics',
    description: 'Enable detailed sales and customer analytics',
    enabled: true,
    category: 'admin'
  },
  {
    id: 'bulk_import_export',
    name: 'Bulk Import/Export',
    description: 'Import and export products and orders in bulk',
    enabled: true,
    category: 'admin'
  },
  {
    id: 'customer_segmentation',
    name: 'Customer Segmentation',
    description: 'Segment customers for targeted marketing',
    enabled: true,
    category: 'admin'
  },
  {
    id: 'activity_log',
    name: 'Activity Log',
    description: 'Track all admin activities',
    enabled: true,
    category: 'admin'
  },
  {
    id: 'courier_integration',
    name: 'Courier Integration',
    description: 'Integrate with courier services for shipping',
    enabled: true,
    category: 'admin'
  },
  {
    id: 'automated_invoices',
    name: 'Automated Invoices',
    description: 'Generate and send invoices automatically',
    enabled: true,
    category: 'admin'
  },
  {
    id: 'webhooks',
    name: 'Webhooks',
    description: 'Enable webhook integrations with external services',
    enabled: true,
    category: 'admin'
  },
  
  // Storefront Features (Additional)
  {
    id: 'product_recommendations',
    name: 'Product Recommendations',
    description: 'Show "You might also like" product suggestions',
    enabled: true,
    category: 'storefront'
  },
  {
    id: 'social_proof',
    name: 'Social Proof',
    description: 'Show "X people viewing" and "X sold recently"',
    enabled: true,
    category: 'storefront'
  },
  {
    id: 'countdown_timer',
    name: 'Countdown Timer',
    description: 'Show countdown timers for flash sales',
    enabled: true,
    category: 'storefront'
  },
  {
    id: 'breadcrumbs',
    name: 'Breadcrumb Navigation',
    description: 'Show breadcrumb navigation on all pages',
    enabled: true,
    category: 'storefront'
  },
  {
    id: 'quick_view',
    name: 'Quick View Modal',
    description: 'Allow quick product preview without leaving page',
    enabled: true,
    category: 'storefront'
  },
  {
    id: 'advanced_filters',
    name: 'Advanced Filters',
    description: 'Enable advanced product filtering options',
    enabled: true,
    category: 'storefront'
  },
  {
    id: 'mobile_bottom_nav',
    name: 'Mobile Bottom Navigation',
    description: 'Show bottom navigation on mobile devices',
    enabled: true,
    category: 'storefront'
  },
  {
    id: 'theme_switcher',
    name: 'Theme Switcher',
    description: 'Allow users to switch between different themes',
    enabled: true,
    category: 'storefront'
  },
  
  // Admin Features
  {
    id: 'low_stock_alerts',
    name: 'Low Stock Alerts',
    description: 'Show alerts when products are low on stock',
    enabled: true,
    category: 'admin'
  },
  {
    id: 'bulk_import_export',
    name: 'Bulk Import/Export',
    description: 'Import and export products via CSV',
    enabled: true,
    category: 'admin'
  },
  {
    id: 'customer_segmentation',
    name: 'Customer Segmentation',
    description: 'Automatically segment customers by behavior',
    enabled: true,
    category: 'admin'
  },
  {
    id: 'activity_log',
    name: 'Activity Log',
    description: 'Track all admin actions',
    enabled: true,
    category: 'admin'
  },
  {
    id: 'courier_integration',
    name: 'Courier Integration',
    description: 'Integrate with courier services for tracking',
    enabled: true,
    category: 'admin'
  },
  {
    id: 'automated_invoices',
    name: 'Automated Invoices',
    description: 'Generate and send invoices automatically',
    enabled: true,
    category: 'admin'
  }
];

export function getFeatureFlags(): FeatureConfig[] {
  if (typeof window === 'undefined') return DEFAULT_FEATURES;
  
  const saved = localStorage.getItem(FEATURES_KEY);
  if (!saved) {
    localStorage.setItem(FEATURES_KEY, JSON.stringify(DEFAULT_FEATURES));
    return DEFAULT_FEATURES;
  }
  
  return JSON.parse(saved);
}

export function isFeatureEnabled(featureId: string): boolean {
  const features = getFeatureFlags();
  const feature = features.find(f => f.id === featureId);
  return feature?.enabled ?? true;
}

export function toggleFeature(featureId: string): FeatureConfig[] {
  const features = getFeatureFlags();
  const updated = features.map(f => 
    f.id === featureId ? { ...f, enabled: !f.enabled } : f
  );
  localStorage.setItem(FEATURES_KEY, JSON.stringify(updated));
  return updated;
}

export function updateFeature(featureId: string, updates: Partial<FeatureConfig>): FeatureConfig[] {
  const features = getFeatureFlags();
  const updated = features.map(f => 
    f.id === featureId ? { ...f, ...updates } : f
  );
  localStorage.setItem(FEATURES_KEY, JSON.stringify(updated));
  return updated;
}

export function resetFeatureFlags(): FeatureConfig[] {
  localStorage.setItem(FEATURES_KEY, JSON.stringify(DEFAULT_FEATURES));
  return DEFAULT_FEATURES;
}
