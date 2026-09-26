// SEO Optimization Service
import { getProducts, getOrders } from './store';

export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  schema?: any;
}

// Generate SEO data for homepage
export function getHomepageSEO(): SEOData {
  return {
    title: 'ARA Beddings - Premium Luxury Bedding in Pakistan',
    description: 'Discover premium quality bedding, comforters, quilts, and home linen. Free shipping across Pakistan. Cash on Delivery available. Shop now!',
    keywords: [
      'bedding Pakistan',
      'luxury bedding',
      'bed sheets',
      'comforters',
      'quilt covers',
      'home linen',
      'Egyptian cotton',
      'premium bedding',
      'online bedding store Pakistan',
      'cash on delivery bedding',
    ],
    canonical: 'https://arabeddings.com',
    ogImage: 'https://arabeddings.com/og-image.jpg',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Store',
      name: 'ARA Beddings',
      description: 'Premium luxury bedding and home linen',
      url: 'https://arabeddings.com',
      logo: 'https://arabeddings.com/logo.png',
      priceRange: 'Rs 2000 - Rs 50000',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'PK',
        addressLocality: 'Lahore',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        reviewCount: '500',
      },
    },
  };
}

// Generate SEO data for product page
export function getProductSEO(product: any): SEOData {
  const title = `${product.name} - ARA Beddings`;
  const description = `${product.description.substring(0, 150)}... Starting from Rs ${product.priceFrom.toLocaleString()}. Free shipping across Pakistan.`;
  
  const keywords = [
    product.name.toLowerCase(),
    product.category.toLowerCase(),
    'buy ' + product.name.toLowerCase(),
    product.name.toLowerCase() + ' Pakistan',
    product.category.toLowerCase() + ' Pakistan',
    ...product.name.toLowerCase().split(' '),
  ];
  
  return {
    title,
    description,
    keywords,
    canonical: `https://arabeddings.com/product/${product.slug}`,
    ogImage: product.mainImage,
    ogType: 'product',
    twitterCard: 'summary_large_image',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: product.mainImage,
      sku: product.variants[0]?.sku,
      brand: {
        '@type': 'Brand',
        name: 'ARA Beddings',
      },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'PKR',
        price: product.priceFrom,
        availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        seller: {
          '@type': 'Organization',
          name: 'ARA Beddings',
        },
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.5',
        reviewCount: '50',
      },
    },
  };
}

// Generate SEO data for category page
export function getCategorySEO(category: string): SEOData {
  const title = `${category} - Premium ${category} | ARA Beddings`;
  const description = `Shop premium ${category.toLowerCase()} at ARA Beddings. High quality, affordable prices. Free shipping across Pakistan. Cash on Delivery available.`;
  
  return {
    title,
    description,
    keywords: [
      category.toLowerCase(),
      `buy ${category.toLowerCase()}`,
      `${category.toLowerCase()} Pakistan`,
      `premium ${category.toLowerCase()}`,
      `online ${category.toLowerCase()} store`,
    ],
    canonical: `https://arabeddings.com/category/${category.toLowerCase().replace(/\s+/g, '-')}`,
    ogType: 'website',
    twitterCard: 'summary',
  };
}

// Generate SEO data for shop page
export function getShopSEO(): SEOData {
  return {
    title: 'Shop All Products - ARA Beddings',
    description: 'Browse our complete collection of premium bedding, comforters, quilts, and home linen. Free shipping across Pakistan. Shop now!',
    keywords: [
      'shop bedding',
      'buy bedding online',
      'bedding store Pakistan',
      'all products',
      'bedding collection',
    ],
    canonical: 'https://arabeddings.com/shop',
    ogType: 'website',
    twitterCard: 'summary',
  };
}

// Generate sitemap
export function generateSitemap(): string {
  const products = getProducts();
  const categories = Array.from(new Set(products.map(p => p.category)));
  
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Homepage
  sitemap += '  <url>\n';
  sitemap += '    <loc>https://arabeddings.com</loc>\n';
  sitemap += '    <changefreq>daily</changefreq>\n';
  sitemap += '    <priority>1.0</priority>\n';
  sitemap += '  </url>\n';
  
  // Shop page
  sitemap += '  <url>\n';
  sitemap += '    <loc>https://arabeddings.com/shop</loc>\n';
  sitemap += '    <changefreq>daily</changefreq>\n';
  sitemap += '    <priority>0.9</priority>\n';
  sitemap += '  </url>\n';
  
  // Category pages
  categories.forEach(category => {
    const slug = category.toLowerCase().replace(/\s+/g, '-');
    sitemap += '  <url>\n';
    sitemap += `    <loc>https://arabeddings.com/category/${slug}</loc>\n`;
    sitemap += '    <changefreq>weekly</changefreq>\n';
    sitemap += '    <priority>0.8</priority>\n';
    sitemap += '  </url>\n';
  });
  
  // Product pages
  products.forEach(product => {
    sitemap += '  <url>\n';
    sitemap += `    <loc>https://arabeddings.com/product/${product.slug}</loc>\n`;
    sitemap += `    <lastmod>${new Date(product.updatedAt).toISOString().split('T')[0]}</lastmod>\n`;
    sitemap += '    <changefreq>weekly</changefreq>\n';
    sitemap += '    <priority>0.7</priority>\n';
    sitemap += '  </url>\n';
  });
  
  // Static pages
  const staticPages = ['about', 'contact', 'services', 'blog', 'track-order', 'wishlist'];
  staticPages.forEach(page => {
    sitemap += '  <url>\n';
    sitemap += `    <loc>https://arabeddings.com/${page}</loc>\n`;
    sitemap += '    <changefreq>monthly</changefreq>\n';
    sitemap += '    <priority>0.5</priority>\n';
    sitemap += '  </url>\n';
  });
  
  sitemap += '</urlset>';
  
  return sitemap;
}

// Generate robots.txt
export function generateRobotsTxt(): string {
  return `User-agent: *
Allow: /

Sitemap: https://arabeddings.com/sitemap.xml

Disallow: /admin
Disallow: /api
Disallow: /checkout
Disallow: /account

# Crawl-delay
Crawl-delay: 1
`;
}

// Generate structured data for organization
export function getOrganizationSchema(): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ARA Beddings',
    url: 'https://arabeddings.com',
    logo: 'https://arabeddings.com/logo.png',
    description: 'Premium luxury bedding and home linen in Pakistan',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'PK',
      addressLocality: 'Lahore',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+92-316-0143039',
      contactType: 'customer service',
      availableLanguage: ['English', 'Urdu'],
    },
    sameAs: [
      'https://www.facebook.com/arabeddings',
      'https://www.instagram.com/arabeddings',
      'https://www.twitter.com/arabeddings',
    ],
  };
}

// Generate breadcrumb schema
export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Generate FAQ schema
export function getFAQSchema(faqs: Array<{ question: string; answer: string }>): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// Generate review schema
export function getReviewSchema(product: any, reviews: any[]): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    review: reviews.map(review => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.customerName,
      },
      datePublished: review.createdAt,
      reviewBody: review.comment,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1,
      },
    })),
  };
}

// SEO analysis for a page
export function analyzeSEO(content: {
  title: string;
  description: string;
  headings: string[];
  images: number;
  links: number;
  wordCount: number;
}): {
  score: number;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let score = 100;
  
  // Title analysis
  if (content.title.length < 30) {
    issues.push('Title is too short (should be 30-60 characters)');
    score -= 10;
  } else if (content.title.length > 60) {
    issues.push('Title is too long (should be 30-60 characters)');
    score -= 10;
  }
  
  // Description analysis
  if (content.description.length < 120) {
    issues.push('Meta description is too short (should be 120-160 characters)');
    score -= 10;
  } else if (content.description.length > 160) {
    issues.push('Meta description is too long (should be 120-160 characters)');
    score -= 10;
  }
  
  // Headings analysis
  if (content.headings.length === 0) {
    issues.push('No headings found');
    score -= 15;
  } else if (!content.headings[0].includes('h1')) {
    issues.push('Missing H1 heading');
    score -= 10;
  }
  
  // Images analysis
  if (content.images === 0) {
    issues.push('No images found');
    score -= 10;
  }
  
  // Content analysis
  if (content.wordCount < 300) {
    issues.push('Content is too short (should be at least 300 words)');
    score -= 15;
  }
  
  // Links analysis
  if (content.links === 0) {
    recommendations.push('Add internal links to improve navigation');
  }
  
  // Recommendations
  if (score >= 80) {
    recommendations.push('Great SEO! Consider adding more long-tail keywords');
  } else if (score >= 60) {
    recommendations.push('Good foundation. Address the issues above to improve');
  } else {
    recommendations.push('Significant improvements needed. Focus on the critical issues');
  }
  
  return {
    score: Math.max(0, score),
    issues,
    recommendations,
  };
}
