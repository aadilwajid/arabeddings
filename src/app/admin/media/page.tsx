'use client';

import { useState, useEffect } from 'react';
import { Media } from '@/types';
import { Upload, Trash2, Search, X, Tag } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function AdminMedia() {
  const [media, setMedia] = useState<Media[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    const res = await fetch('/api/media');
    const data = await res.json();
    setMedia(data);
  };

  const handleUpload = async (url: string, filename: string, tags: string[]) => {
    await fetch('/api/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, filename, tags })
    });
    setShowUpload(false);
    fetchMedia();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this media?')) return;
    await fetch('/api/media', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    fetchMedia();
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedItems.length} items?`)) return;
    for (const id of selectedItems) {
      await fetch('/api/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
    }
    setSelectedItems([]);
    fetchMedia();
  };

  const toggleSelect = (id: string) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const filteredMedia = media.filter(m => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return m.filename.toLowerCase().includes(q) || m.tags.some(t => t.toLowerCase().includes(q));
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-serif text-[#2D2A26]">Media Library</h2>
        <div className="flex items-center gap-3">
          {selectedItems.length > 0 && (
            <button onClick={handleBulkDelete} className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600">
              <Trash2 size={16} /> Delete ({selectedItems.length})
            </button>
          )}
          <button onClick={() => setShowUpload(true)} className="bg-[#C4A265] text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-[#D4B275]">
            <Upload size={18} /> Upload
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A09080]" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by filename or tag..." className="w-full pl-10 pr-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredMedia.map(item => (
          <div key={item.id} className={`relative group bg-white rounded-xl border-2 overflow-hidden ${selectedItems.includes(item.id) ? 'border-[#C4A265]' : 'border-[#F0E8DE]'}`}>
            <div className="aspect-square">
              <img src={item.url} alt={item.filename} className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <button onClick={() => toggleSelect(item.id)} className="p-2 bg-white rounded-full hover:bg-[#C4A265] hover:text-white">
                {selectedItems.includes(item.id) ? '✓' : '○'}
              </button>
              <button onClick={() => handleDelete(item.id)} className="p-2 bg-white rounded-full hover:bg-red-500 hover:text-white">
                <Trash2 size={16} />
              </button>
            </div>
            <div className="p-2">
              <p className="text-xs text-[#5C4A32] truncate">{item.filename}</p>
              {item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-xs bg-[#F5EDE4] px-1.5 py-0.5 rounded">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredMedia.length === 0 && (
        <div className="text-center py-16 text-[#A09080]">
          <Upload size={48} className="mx-auto mb-4 opacity-50" />
          <p>No media files yet. Upload some to get started!</p>
        </div>
      )}

      {showUpload && (
        <UploadModal onUpload={handleUpload} onClose={() => setShowUpload(false)} />
      )}
    </div>
  );
}

function UploadModal({ onUpload, onClose }: { onUpload: (url: string, filename: string, tags: string[]) => void; onClose: () => void }) {
  const [url, setUrl] = useState('');
  const [filename, setFilename] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpload(url, filename || url.split('/').pop() || 'image', tags.split(',').map(t => t.trim()).filter(Boolean));
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="border-b border-[#E8DFD5] px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-serif text-[#2D2A26]">Upload Media</h3>
          <button onClick={onClose} className="p-2 hover:bg-[#F5EDE4] rounded-lg"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#5C4A32] mb-2">Image URL</label>
            <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} required className="w-full px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]" placeholder="https://..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5C4A32] mb-2">Filename</label>
            <input type="text" value={filename} onChange={(e) => setFilename(e.target.value)} className="w-full px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]" placeholder="my-image.jpg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5C4A32] mb-2">Tags (comma separated)</label>
            <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className="w-full px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]" placeholder="bedsheet, cotton, white" />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 border border-[#E8DFD5] rounded-lg">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-[#C4A265] text-white rounded-lg hover:bg-[#D4B275]">Upload</button>
          </div>
        </form>
      </div>
    </div>
  );
}
