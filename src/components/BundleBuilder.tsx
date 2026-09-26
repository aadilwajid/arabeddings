'use client';

import { useState } from 'react';
import { Package, Plus, Minus, ShoppingBag, Sparkles } from 'lucide-react';
import { Product } from '@/types';

interface BundleItem {
  product: Product;
  quantity: number;
}

interface BundleBuilderProps {
  products: Product[];
  onAddBundleToCart: (items: { product: Product; quantity: number; variantId: string }[]) => void;
}

const BUNDLE_DISCOUNT = 15; // 15% off for bundles

export default function BundleBuilder({ products, onAddBundleToCart }: BundleBuilderProps) {
  const [selectedItems, setSelectedItems] = useState<BundleItem[]>([]);
  const [showModal, setShowModal] = useState(false);

  const categories = ['Bed Sheets', 'Comforters', 'Quilt Covers', 'Accessories'];

  const addItem = (product: Product) => {
    const existing = selectedItems.find(item => item.product.id === product.id);
    if (existing) {
      setSelectedItems(selectedItems.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setSelectedItems([...selectedItems, { product, quantity: 1 }]);
    }
  };

  const removeItem = (productId: string) => {
    const existing = selectedItems.find(item => item.product.id === productId);
    if (existing && existing.quantity > 1) {
      setSelectedItems(selectedItems.map(item => 
        item.product.id === productId 
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ));
    } else {
      setSelectedItems(selectedItems.filter(item => item.product.id !== productId));
    }
  };

  const subtotal = selectedItems.reduce((sum, item) => sum + item.product.priceFrom * item.quantity, 0);
  const discount = Math.floor(subtotal * BUNDLE_DISCOUNT / 100);
  const total = subtotal - discount;
  const bundleReady = selectedItems.length >= 2;

  const handleAddBundle = () => {
    const items = selectedItems.map(item => ({
      product: item.product,
      quantity: item.quantity,
      variantId: item.product.variants[0]?.id || ''
    }));
    onAddBundleToCart(items);
    setSelectedItems([]);
    setShowModal(false);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-gradient-to-r from-[#C4A265] to-[#D4B275] text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all flex items-center gap-2"
      >
        <Package size={18} />
        Build a Bundle (Save {BUNDLE_DISCOUNT}%)
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="p-6 border-b border-[#E8DFD5] flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-serif text-[#2D2A26] flex items-center gap-2">
                  <Sparkles className="text-[#C4A265]" size={24} />
                  Bundle Builder
                </h3>
                <p className="text-sm text-[#5C4A32]">Select 2 or more items and save {BUNDLE_DISCOUNT}%</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-[#A09080] hover:text-[#2D2A26] text-2xl">×</button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Product Selection */}
                <div className="md:col-span-2">
                  {categories.map(category => {
                    const categoryProducts = products.filter(p => p.category === category);
                    if (categoryProducts.length === 0) return null;
                    
                    return (
                      <div key={category} className="mb-6">
                        <h4 className="text-sm font-medium text-[#2D2A26] uppercase tracking-wider mb-3">{category}</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {categoryProducts.map(product => {
                            const selectedItem = selectedItems.find(item => item.product.id === product.id);
                            return (
                              <div
                                key={product.id}
                                className={`border-2 rounded-xl p-3 cursor-pointer transition-all ${
                                  selectedItem ? 'border-[#C4A265] bg-[#C4A265]/5' : 'border-[#E8DFD5] hover:border-[#C4A265]'
                                }`}
                                onClick={() => addItem(product)}
                              >
                                <img src={product.mainImage} alt={product.name} className="w-full h-24 object-cover rounded-lg mb-2" />
                                <p className="text-xs font-medium text-[#2D2A26] line-clamp-1">{product.name}</p>
                                <p className="text-xs text-[#C4A265] font-semibold">Rs {product.priceFrom.toLocaleString()}</p>
                                {selectedItem && (
                                  <div className="mt-2 flex items-center justify-between">
                                    <button
                                      onClick={(e) => { e.stopPropagation(); removeItem(product.id); }}
                                      className="w-6 h-6 bg-[#F5EDE4] rounded-full flex items-center justify-center hover:bg-[#E8DFD5]"
                                    >
                                      <Minus size={12} />
                                    </button>
                                    <span className="text-sm font-medium">{selectedItem.quantity}</span>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); addItem(product); }}
                                      className="w-6 h-6 bg-[#C4A265] text-white rounded-full flex items-center justify-center hover:bg-[#D4B275]"
                                    >
                                      <Plus size={12} />
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bundle Summary */}
                <div className="md:sticky md:top-0">
                  <div className="bg-[#FDF8F3] border border-[#E8DFD5] rounded-xl p-4">
                    <h4 className="font-medium text-[#2D2A26] mb-3 flex items-center gap-2">
                      <Package size={18} className="text-[#C4A265]" />
                      Your Bundle
                    </h4>
                    
                    {selectedItems.length === 0 ? (
                      <p className="text-sm text-[#A09080] text-center py-4">
                        Select items to build your bundle
                      </p>
                    ) : (
                      <>
                        <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                          {selectedItems.map(item => (
                            <div key={item.product.id} className="flex items-center gap-2 text-sm">
                              <img src={item.product.mainImage} alt={item.product.name} className="w-10 h-10 object-cover rounded" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-[#2D2A26] line-clamp-1">{item.product.name}</p>
                                <p className="text-xs text-[#A09080]">x{item.quantity}</p>
                              </div>
                              <p className="text-xs font-medium">Rs {(item.product.priceFrom * item.quantity).toLocaleString()}</p>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-[#E8DFD5] pt-3 space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-[#5C4A32]">Subtotal</span>
                            <span>Rs {subtotal.toLocaleString()}</span>
                          </div>
                          {bundleReady && (
                            <div className="flex justify-between text-sm text-green-600">
                              <span>Bundle Discount ({BUNDLE_DISCOUNT}%)</span>
                              <span>-Rs {discount.toLocaleString()}</span>
                            </div>
                          )}
                          <div className="flex justify-between font-bold text-lg pt-2 border-t border-[#E8DFD5]">
                            <span>Total</span>
                            <span className="text-[#C4A265]">Rs {bundleReady ? total.toLocaleString() : subtotal.toLocaleString()}</span>
                          </div>
                        </div>

                        {!bundleReady && (
                          <p className="text-xs text-[#A09080] mt-2 text-center">
                            Add {2 - selectedItems.length} more item(s) to get bundle discount
                          </p>
                        )}

                        <button
                          onClick={handleAddBundle}
                          disabled={!bundleReady}
                          className="w-full mt-4 bg-[#2D2A26] text-white py-3 rounded-xl font-medium hover:bg-[#C4A265] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <ShoppingBag size={18} />
                          Add Bundle to Cart
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
