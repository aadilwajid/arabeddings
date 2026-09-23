'use client';

import { useState, useEffect } from 'react';
import { Product, Size, VariantType, Category } from '@/types';
import { Plus, Edit, Trash2, X, Save } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    await fetch('/api/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    fetchProducts();
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleSave = async (product: Product) => {
    const method = editingProduct ? 'PUT' : 'POST';
    await fetch('/api/products', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    setShowForm(false);
    setEditingProduct(null);
    fetchProducts();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-serif text-[#2D2A26]">Products</h2>
        <button onClick={() => { setEditingProduct(null); setShowForm(true); }} className="bg-[#C4A265] text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-[#D4B275]">
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#F0E8DE] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#F5EDE4]">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-medium text-[#5C4A32]">Product</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-[#5C4A32]">Category</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-[#5C4A32]">Price From</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-[#5C4A32]">Stock</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-[#5C4A32]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="border-t border-[#F0E8DE] hover:bg-[#FDF8F3]">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={product.mainImage} alt={product.name} className="w-12 h-12 object-cover rounded-lg" />
                    <div>
                      <span className="font-medium text-[#2D2A26] block">{product.name}</span>
                      {product.badge && <span className="text-xs text-[#C4A265]">{product.badge}</span>}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-[#5C4A32]">{product.category}</td>
                <td className="px-6 py-4 text-sm text-[#5C4A32]">Rs {product.priceFrom.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-[#5C4A32]">{product.stock}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(product)} className="p-2 hover:bg-[#F5EDE4] rounded-lg text-[#5C4A32]">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <ProductForm
          product={editingProduct}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditingProduct(null); }}
        />
      )}
    </div>
  );
}

function ProductForm({ product, onSave, onClose }: { product: Product | null; onSave: (product: Product) => void; onClose: () => void }) {
  const [formData, setFormData] = useState<Product>(product || {
    id: uuidv4(),
    name: '',
    slug: '',
    category: 'Bed Sheets',
    description: '',
    mainImage: '',
    galleryImages: [],
    priceFrom: 0,
    compareAt: 0,
    stock: 0,
    badge: '',
    featured: false,
    isNew: false,
    customizable: true,
    variants: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const categories: Category[] = ['Bed Sheets', 'Comforters', 'Quilt Covers', 'Kids', 'Accessories', 'Quilts'];
  const sizes: Size[] = ['Single', 'Double', 'Queen', 'King'];
  const types: VariantType[] = ['Bed Sheet Set', 'Comforter Set', 'Quilt Cover Set', 'Fitted Sheet Only'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, {
        id: uuidv4(),
        size: 'Single',
        type: 'Bed Sheet Set',
        price: formData.priceFrom,
        stock: 10,
        sku: ''
      }]
    });
  };

  const updateVariant = (index: number, field: string, value: any) => {
    const newVariants = [...formData.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setFormData({ ...formData, variants: newVariants });
  };

  const removeVariant = (index: number) => {
    setFormData({ ...formData, variants: formData.variants.filter((_, i) => i !== index) });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-[#E8DFD5] px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-serif text-[#2D2A26]">{product ? 'Edit' : 'Add'} Product</h3>
          <button onClick={onClose} className="p-2 hover:bg-[#F5EDE4] rounded-lg">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#5C4A32] mb-2">Product Name</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} required className="w-full px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5C4A32] mb-2">Category</label>
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })} className="w-full px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]">
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5C4A32] mb-2">Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]" />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5C4A32] mb-2">Main Image URL</label>
            <input type="url" value={formData.mainImage} onChange={(e) => setFormData({ ...formData, mainImage: e.target.value })} required className="w-full px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#5C4A32] mb-2">Price From (Rs)</label>
              <input type="number" value={formData.priceFrom} onChange={(e) => setFormData({ ...formData, priceFrom: Number(e.target.value) })} required className="w-full px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5C4A32] mb-2">Compare At (Rs)</label>
              <input type="number" value={formData.compareAt || ''} onChange={(e) => setFormData({ ...formData, compareAt: Number(e.target.value) || undefined })} className="w-full px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5C4A32] mb-2">Stock</label>
              <input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })} required className="w-full px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#5C4A32] mb-2">Badge</label>
              <input type="text" value={formData.badge || ''} onChange={(e) => setFormData({ ...formData, badge: e.target.value })} placeholder="e.g., Best Seller, New" className="w-full px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]" />
            </div>
            <div className="flex items-center gap-6 pt-6">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} className="rounded" />
                <span className="text-sm text-[#5C4A32]">Featured</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={formData.isNew} onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })} className="rounded" />
                <span className="text-sm text-[#5C4A32]">New</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={formData.customizable} onChange={(e) => setFormData({ ...formData, customizable: e.target.checked })} className="rounded" />
                <span className="text-sm text-[#5C4A32]">Customizable</span>
              </label>
            </div>
          </div>

          {formData.customizable && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-[#5C4A32]">Variants</label>
                <button type="button" onClick={addVariant} className="text-sm text-[#C4A265] hover:underline flex items-center gap-1">
                  <Plus size={16} /> Add Variant
                </button>
              </div>
              <div className="space-y-3">
                {formData.variants.map((variant, index) => (
                  <div key={variant.id} className="flex items-center gap-3 p-3 bg-[#FDF8F3] rounded-lg">
                    <select value={variant.size} onChange={(e) => updateVariant(index, 'size', e.target.value)} className="px-3 py-2 border border-[#E8DFD5] rounded-lg text-sm">
                      {sizes.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select value={variant.type} onChange={(e) => updateVariant(index, 'type', e.target.value)} className="px-3 py-2 border border-[#E8DFD5] rounded-lg text-sm">
                      {types.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <input type="number" value={variant.price} onChange={(e) => updateVariant(index, 'price', Number(e.target.value))} placeholder="Price" className="px-3 py-2 border border-[#E8DFD5] rounded-lg text-sm w-24" />
                    <input type="number" value={variant.stock} onChange={(e) => updateVariant(index, 'stock', Number(e.target.value))} placeholder="Stock" className="px-3 py-2 border border-[#E8DFD5] rounded-lg text-sm w-20" />
                    <input type="text" value={variant.sku} onChange={(e) => updateVariant(index, 'sku', e.target.value)} placeholder="SKU" className="px-3 py-2 border border-[#E8DFD5] rounded-lg text-sm flex-1" />
                    <button type="button" onClick={() => removeVariant(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#E8DFD5]">
            <button type="button" onClick={onClose} className="px-6 py-2 border border-[#E8DFD5] rounded-lg text-[#5C4A32] hover:bg-[#F5EDE4]">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 bg-[#C4A265] text-white rounded-lg hover:bg-[#D4B275] flex items-center gap-2">
              <Save size={18} /> Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
