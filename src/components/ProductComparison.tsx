'use client';

import { useState, useEffect } from 'react';
import { GitCompare, X, Star, Check } from 'lucide-react';
import { Product } from '@/types';

const COMPARE_KEY = 'ara_compare';
const MAX_COMPARE = 3;

export function getCompareList(): string[] {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(COMPARE_KEY);
  return saved ? JSON.parse(saved) : [];
}

export function addToCompare(productId: string): string[] {
  const list = getCompareList();
  if (list.includes(productId)) return list;
  if (list.length >= MAX_COMPARE) return list;
  const newList = [...list, productId];
  localStorage.setItem(COMPARE_KEY, JSON.stringify(newList));
  return newList;
}

export function removeFromCompare(productId: string): string[] {
  const list = getCompareList().filter(id => id !== productId);
  localStorage.setItem(COMPARE_KEY, JSON.stringify(list));
  return list;
}

export function clearCompare(): void {
  localStorage.removeItem(COMPARE_KEY);
}

export function CompareButton({ productId }: { productId: string }) {
  const [compareList, setCompareList] = useState<string[]>(getCompareList());
  const isInCompare = compareList.includes(productId);

  const handleToggle = () => {
    if (isInCompare) {
      setCompareList(removeFromCompare(productId));
    } else {
      if (compareList.length >= MAX_COMPARE) {
        alert(`You can compare up to ${MAX_COMPARE} products only`);
        return;
      }
      setCompareList(addToCompare(productId));
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`p-2 rounded-full transition-all ${
        isInCompare 
          ? 'bg-[#C4A265] text-white' 
          : 'bg-white/80 text-[#5C4A32] hover:bg-white'
      } shadow-md`}
      title={isInCompare ? 'Remove from compare' : 'Add to compare'}
    >
      {isInCompare ? <Check size={16} /> : <GitCompare size={16} />}
    </button>
  );
}

export default function CompareBar({ products, onAddToCart }: { products: Product[]; onAddToCart: (product: Product, variantId: string) => void }) {
  const [compareList, setCompareList] = useState<string[]>(getCompareList());
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setCompareList(getCompareList());
  }, []);

  const compareProducts = products.filter(p => compareList.includes(p.id));

  if (compareList.length === 0) return null;

  return (
    <>
      {/* Floating Compare Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#2D2A26] text-white px-6 py-3 rounded-full shadow-2xl z-40 flex items-center gap-4">
        <GitCompare size={20} className="text-[#C4A265]" />
        <span className="text-sm font-medium">{compareList.length} product(s) selected</span>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#C4A265] text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-[#D4B275]"
        >
          Compare Now
        </button>
        <button
          onClick={() => { clearCompare(); setCompareList([]); }}
          className="text-white/60 hover:text-white text-sm"
        >
          Clear
        </button>
      </div>

      {/* Compare Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-[#E8DFD5] flex items-center justify-between">
              <h3 className="text-2xl font-serif text-[#2D2A26]">Product Comparison</h3>
              <button onClick={() => setShowModal(false)} className="text-[#A09080] hover:text-[#2D2A26] text-2xl">×</button>
            </div>

            <div className="flex-1 overflow-auto p-6">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr>
                      <th className="text-left p-4 text-sm font-medium text-[#5C4A32] w-40">Feature</th>
                      {compareProducts.map(product => (
                        <th key={product.id} className="p-4 text-center min-w-[200px]">
                          <div className="relative">
                            <button
                              onClick={() => {
                                removeFromCompare(product.id);
                                setCompareList(getCompareList());
                              }}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 text-red-500 rounded-full flex items-center justify-center hover:bg-red-200"
                            >
                              <X size={14} />
                            </button>
                            <img src={product.mainImage} alt={product.name} className="w-full h-32 object-cover rounded-xl mb-3" />
                            <p className="font-medium text-[#2D2A26] text-sm">{product.name}</p>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Price */}
                    <tr className="border-t border-[#E8DFD5]">
                      <td className="p-4 text-sm font-medium text-[#5C4A32]">Price</td>
                      {compareProducts.map(product => (
                        <td key={product.id} className="p-4 text-center">
                          <span className="text-lg font-bold text-[#C4A265]">Rs {product.priceFrom.toLocaleString()}</span>
                          {product.compareAt && (
                            <span className="block text-xs text-[#A09080] line-through">Rs {product.compareAt.toLocaleString()}</span>
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* Category */}
                    <tr className="border-t border-[#E8DFD5]">
                      <td className="p-4 text-sm font-medium text-[#5C4A32]">Category</td>
                      {compareProducts.map(product => (
                        <td key={product.id} className="p-4 text-center text-sm text-[#5C4A32]">{product.category}</td>
                      ))}
                    </tr>

                    {/* Sizes Available */}
                    <tr className="border-t border-[#E8DFD5]">
                      <td className="p-4 text-sm font-medium text-[#5C4A32]">Sizes Available</td>
                      {compareProducts.map(product => (
                        <td key={product.id} className="p-4 text-center">
                          <div className="flex flex-wrap gap-1 justify-center">
                            {[...new Set(product.variants.map(v => v.size))].map(size => (
                              <span key={size} className="text-xs bg-[#F5EDE4] px-2 py-1 rounded">{size}</span>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Types Available */}
                    <tr className="border-t border-[#E8DFD5]">
                      <td className="p-4 text-sm font-medium text-[#5C4A32]">Types Available</td>
                      {compareProducts.map(product => (
                        <td key={product.id} className="p-4 text-center">
                          <div className="flex flex-wrap gap-1 justify-center">
                            {[...new Set(product.variants.map(v => v.type))].map(type => (
                              <span key={type} className="text-xs bg-[#F5EDE4] px-2 py-1 rounded">{type}</span>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Stock */}
                    <tr className="border-t border-[#E8DFD5]">
                      <td className="p-4 text-sm font-medium text-[#5C4A32]">In Stock</td>
                      {compareProducts.map(product => (
                        <td key={product.id} className="p-4 text-center">
                          <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {product.stock > 0 ? `${product.stock} units` : 'Out of stock'}
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Rating */}
                    <tr className="border-t border-[#E8DFD5]">
                      <td className="p-4 text-sm font-medium text-[#5C4A32]">Rating</td>
                      {compareProducts.map(product => (
                        <td key={product.id} className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Star size={14} className="text-[#C4A265] fill-[#C4A265]" />
                            <span className="text-sm font-medium">4.5</span>
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Customizable */}
                    <tr className="border-t border-[#E8DFD5]">
                      <td className="p-4 text-sm font-medium text-[#5C4A32]">Customizable</td>
                      {compareProducts.map(product => (
                        <td key={product.id} className="p-4 text-center">
                          {product.customizable ? (
                            <span className="text-green-600 text-sm">✓ Yes</span>
                          ) : (
                            <span className="text-[#A09080] text-sm">—</span>
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* Badge */}
                    <tr className="border-t border-[#E8DFD5]">
                      <td className="p-4 text-sm font-medium text-[#5C4A32]">Badge</td>
                      {compareProducts.map(product => (
                        <td key={product.id} className="p-4 text-center">
                          {product.badge ? (
                            <span className="text-xs bg-[#C4A265] text-white px-2 py-1 rounded-full">{product.badge}</span>
                          ) : (
                            <span className="text-[#A09080] text-sm">—</span>
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* Add to Cart */}
                    <tr className="border-t border-[#E8DFD5]">
                      <td className="p-4"></td>
                      {compareProducts.map(product => (
                        <td key={product.id} className="p-4 text-center">
                          <button
                            onClick={() => {
                              onAddToCart(product, product.variants[0]?.id || '');
                              setShowModal(false);
                            }}
                            disabled={product.stock === 0}
                            className="bg-[#2D2A26] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#C4A265] disabled:opacity-50"
                          >
                            Add to Cart
                          </button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
