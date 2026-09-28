import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, Grid3X3, LayoutGrid, Search, Filter, ChevronDown } from 'lucide-react';
import { useStore } from '../store';
import { ProductGrid } from '../components/ProductCard';
import { formatPKR } from '../data/pakistan';

export default function ProductsPage() {
  const { products, categories } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [gridCols, setGridCols] = useState(3);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categorySlug = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';
  const [selectedCategory, setSelectedCategory] = useState(categorySlug);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Sync with URL params
  useEffect(() => {
    setSelectedCategory(categorySlug);
  }, [categorySlug]);

  // Get all available sizes and colors from products
  const allSizes = useMemo(() => {
    const sizes = new Set<string>();
    products.forEach(p => {
      p.options.forEach(opt => {
        if (opt.name.toLowerCase() === 'size') {
          opt.values.forEach(v => sizes.add(v.value));
        }
      });
    });
    return Array.from(sizes);
  }, [products]);

  const allColors = useMemo(() => {
    const colors = new Set<string>();
    products.forEach(p => {
      p.options.forEach(opt => {
        if (opt.name.toLowerCase() === 'color') {
          opt.values.forEach(v => colors.add(v.value));
        }
      });
    });
    return Array.from(colors);
  }, [products]);

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
        p.material?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q)
      );
    }

    // Size filter
    if (selectedSize) {
      result = result.filter(p =>
        p.variants.some(v => v.optionValues.some(ov => ov.value === selectedSize))
      );
    }

    // Color filter
    if (selectedColor) {
      result = result.filter(p =>
        p.variants.some(v => v.optionValues.some(ov => ov.value === selectedColor))
      );
    }

    // Price filter
    result = result.filter(p => {
      const prices = p.variants.filter(v => v.isActive).map(v => v.price);
      if (prices.length === 0) return false;
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      return minPrice <= priceRange[1] && maxPrice >= priceRange[0];
    });

    // In stock filter
    if (inStockOnly) {
      result = result.filter(p => p.variants.some(v => v.isActive && v.stock > 0));
    }

    // Sort
    switch (sortBy) {
      case 'price-low': result.sort((a, b) => a.basePrice - b.basePrice); break;
      case 'price-high': result.sort((a, b) => b.basePrice - a.basePrice); break;
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'newest': result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      default: result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)); break;
    }

    return result;
  }, [products, selectedCategory, searchQuery, selectedSize, selectedColor, priceRange, inStockOnly, sortBy, categories]);

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedSize('');
    setSelectedColor('');
    setPriceRange([0, 50000]);
    setInStockOnly(false);
    setSearchParams({});
  };

  const hasActiveFilters = selectedCategory || selectedSize || selectedColor || priceRange[1] < 50000 || inStockOnly;
  const activeCategory = categories.find(c => c.slug === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <nav className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          <span className="hover:text-amber-600 cursor-pointer">Home</span> / <span className="text-gray-900 dark:text-white">{activeCategory ? activeCategory.name : searchQuery ? 'Search Results' : 'All Products'}</span>
        </nav>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {activeCategory ? activeCategory.name : searchQuery ? `Search: "${searchQuery}"` : 'All Products'}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{filteredProducts.length} products found</p>
        
        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mt-4">
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-sm">
                Category: {activeCategory?.name}
                <button onClick={() => { setSelectedCategory(''); setSearchParams({}); }} className="ml-1 hover:text-amber-900">
                  <X size={14} />
                </button>
              </span>
            )}
            {selectedSize && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-sm">
                Size: {selectedSize}
                <button onClick={() => setSelectedSize('')} className="ml-1 hover:text-amber-900">
                  <X size={14} />
                </button>
              </span>
            )}
            {selectedColor && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-sm">
                Color: {selectedColor}
                <button onClick={() => setSelectedColor('')} className="ml-1 hover:text-amber-900">
                  <X size={14} />
                </button>
              </span>
            )}
            <button onClick={clearFilters} className="text-sm text-amber-600 dark:text-amber-400 hover:underline font-medium">
              Clear all
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <aside className={`${showFilters ? 'fixed inset-0 z-50 bg-white dark:bg-gray-900 p-6 overflow-y-auto' : 'hidden'} lg:block lg:relative lg:w-64 flex-shrink-0`}>
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
            <button onClick={() => setShowFilters(false)} className="text-gray-500"><X size={24} /></button>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wide">Category</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => { setSelectedCategory(''); setSearchParams({}); }}
                  className={`text-sm block w-full text-left py-1 ${!selectedCategory ? 'text-amber-600 dark:text-amber-400 font-medium' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                >
                  All Products
                </button>
              </li>
              {categories.map(cat => (
                <li key={cat.id}>
                  <button
                    onClick={() => { setSelectedCategory(cat.slug); setSearchParams({ category: cat.slug }); }}
                    className={`text-sm block w-full text-left py-1 ${selectedCategory === cat.slug ? 'text-amber-600 dark:text-amber-400 font-medium' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Size Filter */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wide">Size</h3>
            <div className="flex flex-wrap gap-2">
              {allSizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                  className={`px-3 py-1 text-xs rounded-full border ${
                    selectedSize === size
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                      : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Filter */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wide">Color</h3>
            <div className="flex flex-wrap gap-2">
              {allColors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(selectedColor === color ? '' : color)}
                  className={`px-3 py-1 text-xs rounded-full border ${
                    selectedColor === color
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                      : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wide">Price Range</h3>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="50000"
                step="1000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full accent-amber-600"
              />
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Rs. 0</span>
                <span>Rs. {priceRange[1].toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* In Stock */}
          <div className="mb-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="accent-amber-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">In Stock Only</span>
            </label>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-sm text-amber-600 dark:text-amber-400 hover:underline font-medium">
              Clear all filters
            </button>
          )}
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-3">
            <button
              onClick={() => setShowFilters(true)}
              className="lg:hidden flex items-center space-x-2 text-gray-600 dark:text-gray-300 border dark:border-gray-600 px-3 py-2 rounded-lg"
            >
              <Filter size={16} />
              <span>Filters</span>
            </button>
            <div className="flex items-center space-x-4 ml-auto">
              {/* View Mode Toggle */}
              <div className="hidden md:flex items-center border dark:border-gray-600 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400'}`}
                >
                  <Grid3X3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400'}`}
                >
                  <LayoutGrid size={18} />
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex items-center gap-2 border dark:border-gray-600 dark:bg-gray-700 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-200"
                >
                  Sort by: {sortBy === 'featured' ? 'Featured' : sortBy === 'newest' ? 'Newest' : sortBy === 'price-low' ? 'Price: Low-High' : sortBy === 'price-high' ? 'Price: High-Low' : 'Name'}
                  <ChevronDown size={16} />
                </button>
                {showSortDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-10">
                    {[
                      { value: 'featured', label: 'Featured' },
                      { value: 'newest', label: 'Newest' },
                      { value: 'price-low', label: 'Price: Low to High' },
                      { value: 'price-high', label: 'Price: High to Low' },
                      { value: 'name', label: 'Name A-Z' },
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => { setSortBy(option.value); setShowSortDropdown(false); }}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 ${
                          sortBy === option.value ? 'text-amber-600 dark:text-amber-400 font-medium' : 'text-gray-700 dark:text-gray-200'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <ProductGrid products={filteredProducts} />
        </div>
      </div>
    </div>
  );
}
