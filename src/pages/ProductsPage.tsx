import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { useStore } from '../store';
import { ProductGrid } from '../components/ProductCard';

export default function ProductsPage() {
  const { products, categories } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const categorySlug = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';
  const [selectedCategory, setSelectedCategory] = useState(categorySlug);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [sortBy, setSortBy] = useState('featured');

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory) {
      const cat = categories.find(c => c.slug === selectedCategory);
      if (cat) result = result.filter(p => p.categoryId === cat.id);
    }

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.material?.toLowerCase().includes(q)
      );
    }

    // Price filter
    result = result.filter(p => {
      const minPrice = Math.min(...p.variants.filter(v => v.isActive).map(v => v.price));
      return minPrice >= priceRange[0] && minPrice <= priceRange[1];
    });

    // Sort
    switch (sortBy) {
      case 'price-low': result.sort((a, b) => a.basePrice - b.basePrice); break;
      case 'price-high': result.sort((a, b) => b.basePrice - a.basePrice); break;
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'newest': result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      default: result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)); break;
    }

    return result;
  }, [products, selectedCategory, searchQuery, priceRange, sortBy, categories]);

  const clearFilters = () => {
    setSelectedCategory('');
    setPriceRange([0, 500]);
    setSearchParams({});
  };

  const activeCategory = categories.find(c => c.slug === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {activeCategory ? activeCategory.name : searchQuery ? `Search: "${searchQuery}"` : 'All Products'}
        </h1>
        <p className="mt-2 text-gray-600">{filteredProducts.length} products found</p>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <aside className={`${showFilters ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : 'hidden'} lg:block lg:relative lg:w-64 flex-shrink-0`}>
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <h2 className="text-lg font-semibold">Filters</h2>
            <button onClick={() => setShowFilters(false)}><X size={24} /></button>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Category</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => { setSelectedCategory(''); setSearchParams({}); }}
                  className={`text-sm ${!selectedCategory ? 'text-indigo-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  All Products
                </button>
              </li>
              {categories.map(cat => (
                <li key={cat.id}>
                  <button
                    onClick={() => { setSelectedCategory(cat.slug); setSearchParams({ category: cat.slug }); }}
                    className={`text-sm ${selectedCategory === cat.slug ? 'text-indigo-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="500"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          {(selectedCategory || priceRange[1] < 500) && (
            <button onClick={clearFilters} className="text-sm text-indigo-600 hover:underline">
              Clear all filters
            </button>
          )}
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setShowFilters(true)}
              className="lg:hidden flex items-center space-x-2 text-gray-600 border px-3 py-2 rounded-lg"
            >
              <SlidersHorizontal size={16} />
              <span>Filters</span>
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>

          <ProductGrid products={filteredProducts} />
        </div>
      </div>
    </div>
  );
}
