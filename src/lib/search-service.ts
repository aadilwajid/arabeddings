// Advanced Search Service
import { getProducts } from './store';

export interface SearchFilters {
  query?: string;
  categories?: string[];
  sizes?: string[];
  priceRange?: { min: number; max: number };
  inStock?: boolean;
  featured?: boolean;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'popular';
  page?: number;
  limit?: number;
}

export interface SearchResult {
  products: any[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  filters: SearchFilters;
  suggestions: string[];
}

// Simple text search with scoring
function calculateRelevanceScore(product: any, query: string): number {
  const lowerQuery = query.toLowerCase();
  const words = lowerQuery.split(/\s+/);
  let score = 0;
  
  // Exact name match (highest priority)
  if (product.name.toLowerCase() === lowerQuery) {
    score += 100;
  }
  
  // Name contains query
  if (product.name.toLowerCase().includes(lowerQuery)) {
    score += 50;
  }
  
  // Description contains query
  if (product.description.toLowerCase().includes(lowerQuery)) {
    score += 20;
  }
  
  // Category match
  if (product.category.toLowerCase().includes(lowerQuery)) {
    score += 30;
  }
  
  // Badge match
  if (product.badge && product.badge.toLowerCase().includes(lowerQuery)) {
    score += 15;
  }
  
  // Word-by-word matching
  words.forEach(word => {
    if (word.length < 2) return;
    
    if (product.name.toLowerCase().includes(word)) {
      score += 10;
    }
    if (product.description.toLowerCase().includes(word)) {
      score += 5;
    }
    if (product.category.toLowerCase().includes(word)) {
      score += 8;
    }
  });
  
  // Boost featured products
  if (product.featured) {
    score += 10;
  }
  
  // Boost new products
  if (product.isNew) {
    score += 5;
  }
  
  return score;
}

// Fuzzy matching for typos
function fuzzyMatch(text: string, query: string): boolean {
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  
  // Exact match
  if (lowerText.includes(lowerQuery)) {
    return true;
  }
  
  // Levenshtein distance for typo tolerance
  const distance = levenshteinDistance(lowerText, lowerQuery);
  const threshold = Math.max(lowerQuery.length * 0.3, 2);
  
  return distance <= threshold;
}

// Levenshtein distance calculation
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
  
  for (let i = 0; i <= m; i++) {
    dp[i][0] = i;
  }
  
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,      // deletion
          dp[i][j - 1] + 1,      // insertion
          dp[i - 1][j - 1] + 1   // substitution
        );
      }
    }
  }
  
  return dp[m][n];
}

// Generate search suggestions
function generateSuggestions(query: string, products: any[]): string[] {
  if (!query || query.length < 2) return [];
  
  const suggestions = new Set<string>();
  const lowerQuery = query.toLowerCase();
  
  products.forEach(product => {
    // Suggest product names
    if (product.name.toLowerCase().includes(lowerQuery)) {
      suggestions.add(product.name);
    }
    
    // Suggest categories
    if (product.category.toLowerCase().includes(lowerQuery)) {
      suggestions.add(product.category);
    }
    
    // Suggest from description (first 50 chars)
    const descWords = product.description.split(' ').slice(0, 10).join(' ');
    if (descWords.toLowerCase().includes(lowerQuery)) {
      suggestions.add(descWords);
    }
  });
  
  return Array.from(suggestions).slice(0, 5);
}

// Main search function
export function searchProducts(filters: SearchFilters): SearchResult {
  let products = getProducts();
  const {
    query,
    categories,
    sizes,
    priceRange,
    inStock,
    featured,
    sortBy = 'relevance',
    page = 1,
    limit = 20,
  } = filters;
  
  // Text search with relevance scoring
  if (query && query.trim()) {
    const searchTerms = query.trim().toLowerCase();
    
    products = products
      .map(product => ({
        product,
        score: calculateRelevanceScore(product, searchTerms),
      }))
      .filter(({ product, score }) => {
        // Include if score > 0 or fuzzy match
        return score > 0 || 
               fuzzyMatch(product.name, searchTerms) ||
               fuzzyMatch(product.description, searchTerms) ||
               fuzzyMatch(product.category, searchTerms);
      })
      .sort((a, b) => b.score - a.score)
      .map(({ product }) => product);
  }
  
  // Apply filters
  if (categories && categories.length > 0) {
    products = products.filter(p => categories.includes(p.category));
  }
  
  if (sizes && sizes.length > 0) {
    products = products.filter(p => 
      p.variants.some((v: any) => sizes.includes(v.size))
    );
  }
  
  if (priceRange) {
    products = products.filter(p => 
      p.priceFrom >= priceRange.min && p.priceFrom <= priceRange.max
    );
  }
  
  if (inStock !== undefined) {
    if (inStock) {
      products = products.filter(p => p.stock > 0);
    } else {
      products = products.filter(p => p.stock === 0);
    }
  }
  
  if (featured !== undefined) {
    products = products.filter(p => p.featured === featured);
  }
  
  // Apply sorting
  switch (sortBy) {
    case 'price_asc':
      products.sort((a, b) => a.priceFrom - b.priceFrom);
      break;
    case 'price_desc':
      products.sort((a, b) => b.priceFrom - a.priceFrom);
      break;
    case 'newest':
      products.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    case 'popular':
      // Sort by featured first, then by stock (proxy for popularity)
      products.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return b.stock - a.stock;
      });
      break;
    case 'relevance':
    default:
      // Already sorted by relevance if query exists
      if (!query) {
        products.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
      }
      break;
  }
  
  // Pagination
  const total = products.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const paginatedProducts = products.slice(startIndex, startIndex + limit);
  
  // Generate suggestions
  const suggestions = query ? generateSuggestions(query, getProducts()) : [];
  
  return {
    products: paginatedProducts,
    total,
    page,
    limit,
    totalPages,
    filters,
    suggestions,
  };
}

// Autocomplete suggestions
export function getAutocompleteSuggestions(query: string, limit: number = 5): string[] {
  if (!query || query.length < 2) return [];
  
  const products = getProducts();
  const suggestions = new Set<string>();
  const lowerQuery = query.toLowerCase();
  
  // Product names
  products.forEach(product => {
    if (product.name.toLowerCase().includes(lowerQuery)) {
      suggestions.add(product.name);
    }
  });
  
  // Categories
  const categories = Array.from(new Set(products.map(p => p.category)));
  categories.forEach(category => {
    if (category.toLowerCase().includes(lowerQuery)) {
      suggestions.add(category);
    }
  });
  
  // Common search terms
  const commonTerms = [
    'bed sheet',
    'comforter',
    'quilt cover',
    'kids bedding',
    'cotton',
    'silk',
    'king size',
    'queen size',
  ];
  
  commonTerms.forEach(term => {
    if (term.includes(lowerQuery)) {
      suggestions.add(term);
    }
  });
  
  return Array.from(suggestions).slice(0, limit);
}

// Get popular searches (from search history)
export function getPopularSearches(limit: number = 10): Array<{ query: string; count: number }> {
  const fs = require('fs');
  const path = require('path');
  const filepath = path.join(process.cwd(), 'data', 'search-history.json');
  
  if (!fs.existsSync(filepath)) {
    return [];
  }
  
  const history: Array<{ query: string; timestamp: string }> = JSON.parse(
    fs.readFileSync(filepath, 'utf-8')
  );
  
  // Count occurrences
  const counts = new Map<string, number>();
  history.forEach(item => {
    counts.set(item.query, (counts.get(item.query) || 0) + 1);
  });
  
  // Sort by count and return top N
  return Array.from(counts.entries())
    .map(([query, count]) => ({ query, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

// Log search query
export function logSearchQuery(query: string): void {
  const fs = require('fs');
  const path = require('path');
  const filepath = path.join(process.cwd(), 'data', 'search-history.json');
  
  let history: Array<{ query: string; timestamp: string }> = [];
  
  if (fs.existsSync(filepath)) {
    history = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
  }
  
  history.push({
    query: query.toLowerCase().trim(),
    timestamp: new Date().toISOString(),
  });
  
  // Keep only last 10000 searches
  history = history.slice(-10000);
  
  fs.writeFileSync(filepath, JSON.stringify(history, null, 2));
}

// Get search analytics
export function getSearchAnalytics(): {
  totalSearches: number;
  uniqueQueries: number;
  topQueries: Array<{ query: string; count: number }>;
  noResultQueries: Array<{ query: string; count: number }>;
} {
  const fs = require('fs');
  const path = require('path');
  const filepath = path.join(process.cwd(), 'data', 'search-history.json');
  
  if (!fs.existsSync(filepath)) {
    return {
      totalSearches: 0,
      uniqueQueries: 0,
      topQueries: [],
      noResultQueries: [],
    };
  }
  
  const history: Array<{ query: string; timestamp: string }> = JSON.parse(
    fs.readFileSync(filepath, 'utf-8')
  );
  
  const counts = new Map<string, number>();
  history.forEach(item => {
    counts.set(item.query, (counts.get(item.query) || 0) + 1);
  });
  
  const topQueries = Array.from(counts.entries())
    .map(([query, count]) => ({ query, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);
  
  // Find queries with no results
  const noResultQueries = topQueries.filter(({ query }) => {
    const result = searchProducts({ query, limit: 1 });
    return result.total === 0;
  });
  
  return {
    totalSearches: history.length,
    uniqueQueries: counts.size,
    topQueries,
    noResultQueries,
  };
}
