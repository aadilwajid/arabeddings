// Feature Toggle System
// Allows enabling/disabling features dynamically

export interface FeatureConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: 'storefront' | 'admin' | 'marketing' | 'technical';
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
