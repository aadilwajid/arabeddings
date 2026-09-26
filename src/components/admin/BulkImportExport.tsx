'use client';

import { useState } from 'react';
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';
import { Product } from '@/types';

export default function BulkImportExport() {
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [importData, setImportData] = useState('');

  // Export products to CSV
  const handleExport = async () => {
    setExporting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/products');
      const products: Product[] = await res.json();

      // Convert to CSV
      const headers = ['id', 'name', 'slug', 'category', 'description', 'priceFrom', 'compareAt', 'stock', 'badge', 'featured', 'isNew', 'customizable', 'mainImage', 'variants'];
      
      const rows = products.map(product => [
        product.id,
        product.name,
        product.slug,
        product.category,
        `"${product.description.replace(/"/g, '""')}"`,
        product.priceFrom,
        product.compareAt || '',
        product.stock,
        product.badge || '',
        product.featured,
        product.isNew,
        product.customizable,
        product.mainImage,
        `"${JSON.stringify(product.variants).replace(/"/g, '""')}"`
      ]);

      const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
      
      // Download
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ara-beddings-products-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      setMessage({ type: 'success', text: `Exported ${products.length} products successfully!` });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to export products. Please try again.' });
    } finally {
      setExporting(false);
    }
  };

  // Import products from CSV
  const handleImport = async () => {
    if (!importData.trim()) {
      setMessage({ type: 'error', text: 'Please paste CSV data to import.' });
      return;
    }

    setImporting(true);
    setMessage(null);

    try {
      const lines = importData.trim().split('\n');
      const headers = lines[0].split(',');
      
      let imported = 0;
      let errors = 0;

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length < headers.length) {
          errors++;
          continue;
        }

        try {
          const productData: any = {
            id: values[0],
            name: values[1],
            slug: values[2],
            category: values[3],
            description: values[4].replace(/^"|"$/g, ''),
            priceFrom: parseInt(values[5]),
            compareAt: values[6] ? parseInt(values[6]) : undefined,
            stock: parseInt(values[7]),
            badge: values[8] || undefined,
            featured: values[9] === 'true',
            isNew: values[10] === 'true',
            customizable: values[11] === 'true',
            mainImage: values[12],
            galleryImages: [],
            variants: JSON.parse(values[13].replace(/^"|"$/g, '')),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
          });

          imported++;
        } catch (err) {
          errors++;
        }
      }

      if (imported > 0) {
        setMessage({ 
          type: 'success', 
          text: `Successfully imported ${imported} products!${errors > 0 ? ` ${errors} rows had errors.` : ''}` 
        });
        setImportData('');
      } else {
        setMessage({ type: 'error', text: 'No products were imported. Please check your CSV format.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to import products. Please check your CSV format.' });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#F0E8DE] p-6">
      <div className="flex items-center gap-2 mb-6">
        <FileSpreadsheet size={20} className="text-[#C4A265]" />
        <h3 className="text-lg font-medium text-[#2D2A26]">Bulk Import / Export</h3>
      </div>

      {/* Export Section */}
      <div className="mb-6 p-4 bg-[#FDF8F3] rounded-xl">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-sm font-medium text-[#2D2A26] mb-1">Export Products</h4>
            <p className="text-xs text-[#A09080]">Download all products as CSV file</p>
          </div>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 bg-[#C4A265] text-white rounded-lg hover:bg-[#D4B275] disabled:opacity-50 text-sm font-medium"
          >
            <Download size={16} />
            {exporting ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>
      </div>

      {/* Import Section */}
      <div className="p-4 bg-[#FDF8F3] rounded-xl">
        <div className="mb-3">
          <h4 className="text-sm font-medium text-[#2D2A26] mb-1">Import Products</h4>
          <p className="text-xs text-[#A09080]">Paste CSV data to import products</p>
        </div>
        
        <textarea
          value={importData}
          onChange={(e) => setImportData(e.target.value)}
          placeholder="Paste CSV data here (with headers)..."
          className="w-full h-32 px-3 py-2 border border-[#E8DFD5] rounded-lg text-xs font-mono focus:outline-none focus:border-[#C4A265] resize-none"
        />

        <div className="flex items-center justify-between mt-3">
          <button
            onClick={() => setImportData('')}
            className="text-xs text-[#A09080] hover:text-[#5C4A32]"
          >
            Clear
          </button>
          <button
            onClick={handleImport}
            disabled={importing || !importData.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-[#2D2A26] text-white rounded-lg hover:bg-[#3D3A36] disabled:opacity-50 text-sm font-medium"
          >
            <Upload size={16} />
            {importing ? 'Importing...' : 'Import CSV'}
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`mt-4 p-3 rounded-lg flex items-start gap-2 ${
          message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <p className="text-sm">{message.text}</p>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-4 pt-4 border-t border-[#E8DFD5]">
        <p className="text-xs text-[#A09080]">
          <strong>CSV Format:</strong> Export first to see the correct format. Required fields: id, name, slug, category, priceFrom, stock, mainImage, variants (JSON)
        </p>
      </div>
    </div>
  );
}
