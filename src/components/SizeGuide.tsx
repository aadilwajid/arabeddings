import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';

const sizeData = [
  {
    category: 'Bed Sheets',
    sizes: [
      { name: 'Single', dimensions: '92 x 190 cm', mattress: '3\' x 6\'3"' },
      { name: 'Double', dimensions: '137 x 190 cm', mattress: '4\'6" x 6\'3"' },
      { name: 'Queen', dimensions: '152 x 203 cm', mattress: '5\' x 6\'8"' },
      { name: 'King', dimensions: '183 x 203 cm', mattress: '6\' x 6\'8"' },
    ],
  },
  {
    category: 'Duvet Covers',
    sizes: [
      { name: 'Single', dimensions: '140 x 200 cm', mattress: '3\' x 6\'3"' },
      { name: 'Double', dimensions: '200 x 200 cm', mattress: '4\'6" x 6\'3"' },
      { name: 'Queen', dimensions: '225 x 220 cm', mattress: '5\' x 6\'8"' },
      { name: 'King', dimensions: '260 x 220 cm', mattress: '6\' x 6\'8"' },
    ],
  },
  {
    category: 'Comforters',
    sizes: [
      { name: 'Single', dimensions: '150 x 200 cm', mattress: '3\' x 6\'3"' },
      { name: 'Double', dimensions: '200 x 200 cm', mattress: '4\'6" x 6\'3"' },
      { name: 'Queen', dimensions: '225 x 225 cm', mattress: '5\' x 6\'8"' },
      { name: 'King', dimensions: '260 x 230 cm', mattress: '6\' x 6\'8"' },
    ],
  },
  {
    category: 'Pillows',
    sizes: [
      { name: 'Standard', dimensions: '50 x 75 cm', mattress: '20" x 30"' },
      { name: 'Queen', dimensions: '50 x 80 cm', mattress: '20" x 32"' },
      { name: 'King', dimensions: '50 x 90 cm', mattress: '20" x 36"' },
    ],
  },
];

export default function SizeGuideModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [activeCategory, setActiveCategory] = useState('Bed Sheets');

  if (!isOpen) return null;

  const currentCategory = sizeData.find(c => c.category === activeCategory);

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
              <Ruler className="text-amber-600 dark:text-amber-400" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Size Guide</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Find the perfect fit for your bed</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {sizeData.map(cat => (
              <button
                key={cat.category}
                onClick={() => setActiveCategory(cat.category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === cat.category
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {cat.category}
              </button>
            ))}
          </div>

          {/* Size Table */}
          {currentCategory && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Size</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Dimensions (cm)</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Mattress Size</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCategory.sizes.map((size, i) => (
                    <tr key={size.name} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{size.name}</td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{size.dimensions}</td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{size.mattress}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tips */}
          <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <h3 className="font-semibold text-amber-900 dark:text-amber-300 mb-2">💡 Measuring Tips</h3>
            <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-1">
              <li>• Measure your mattress length, width, and depth</li>
              <li>• For fitted sheets, add 5-10 cm to mattress depth for pocket size</li>
              <li>• Duvet covers should be slightly larger than your duvet</li>
              <li>• When in doubt, choose the larger size</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
