'use client';

import { useState } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';
import { Product } from '@/types';

interface AdvancedFiltersProps {
  products: Product[];
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  priceRange: [number, number];
  sizes: string[];
  categories: string[];
  inStockOnly: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'newest';
}

export default function AdvancedFilters({ products, onFilterChange }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 50000],
    sizes: [],
    categories: [],
    inStockOnly: false,
    sortBy: 'featured',
  });

  const allSizes = ['Single', 'Double', 'Queen', 'King'];
  const allCategories = ['Bed Sheets', 'Comforters', 'Quilt Covers', 'Kids', 'Accessories', 'Quilts'];

  // Calculate price range from products
  const prices = products.map(p => p.priceFrom);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const handleSizeToggle = (size: string) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter(s => s !== size)
      : [...filters.sizes, size];
    const newFilters = { ...filters, sizes: newSizes };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    const newFilters = { ...filters, categories: newCategories };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = (index: 0 | 1, value: number) => {
    const newRange: [number, number] = [...filters.priceRange] as [number, number];
    newRange[index] = value;
    const newFilters = { ...filters, priceRange: newRange };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (sortBy: FilterState['sortBy']) => {
    const newFilters = { ...filters, sortBy };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleStockToggle = () => {
    const newFilters = { ...filters, inStockOnly: !filters.inStockOnly };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const cleared: FilterState = {
      priceRange: [minPrice, maxPrice],
      sizes: [],
      categories: [],
      inStockOnly: false,
      sortBy: 'featured',
    };
    setFilters(cleared);
    onFilterChange(cleared);
  };

  const activeFilterCount = 
    filters.sizes.length + 
    filters.categories.length + 
    (filters.inStockOnly ? 1 : 0) +
    (filters.priceRange[0] > minPrice || filters.priceRange[1] < maxPrice ? 1 : 0);

  return (
    <div className="mb-6">
      {/* Filter Toggle Button */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:border-[#C4A265] transition-colors"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
        >
          <Filter size={18} />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-[#C4A265] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
          <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Sort Dropdown */}
        <select
          value={filters.sortBy}
          onChange={(e) => handleSortChange(e.target.value as FilterState['sortBy'])}
          className="px-4 py-2 rounded-lg border focus:outline-none focus:border-[#C4A265]"
          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
        >
          <option value="featured">Sort: Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="newest">Newest First</option>
        </select>

        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-sm text-[#C4A265] hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {isOpen && (
        <div 
          className="bg-white dark:bg-[#2d2d2d] rounded-2xl p-6 mb-6"
          style={{ border: 'var(--border)' }}
        >
          <div className="grid md:grid-cols-3 gap-6">
            {/* Price Range */}
            <div>
              <h4 className="font-medium mb-3" style={{ color: 'var(--color-text)' }}>
                Price Range
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    Min: Rs {filters.priceRange[0].toLocaleString()}
                  </label>
                  <input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    value={filters.priceRange[0]}
                    onChange={(e) => handlePriceChange(0, Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    Max: Rs {filters.priceRange[1].toLocaleString()}
                  </label>
                  <input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    value={filters.priceRange[1]}
                    onChange={(e) => handlePriceChange(1, Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h4 className="font-medium mb-3" style={{ color: 'var(--color-text)' }}>
                Size
              </h4>
              <div className="space-y-2">
                {allSizes.map(size => (
                  <label key={size} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.sizes.includes(size)}
                      onChange={() => handleSizeToggle(size)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm" style={{ color: 'var(--color-text)' }}>{size}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-medium mb-3" style={{ color: 'var(--color-text)' }}>
                Category
              </h4>
              <div className="space-y-2">
                {allCategories.map(category => (
                  <label key={category} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm" style={{ color: 'var(--color-text)' }}>{category}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Stock Filter */}
          <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={handleStockToggle}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                In Stock Only
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
