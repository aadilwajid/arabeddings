'use client';

import { useState, useEffect } from 'react';
import { MenuItem } from '@/types';
import { GripVertical, Plus, Trash2, Save, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function AdminMenu() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => { fetchMenu(); }, []);

  const fetchMenu = async () => {
    const res = await fetch('/api/menu');
    const data = await res.json();
    setMenu(data);
  };

  const handleSave = async () => {
    await fetch('/api/menu', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(menu)
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addItem = () => {
    setMenu([...menu, { id: uuidv4(), label: 'New Item', href: '/', order: menu.length + 1 }]);
  };

  const updateItem = (index: number, field: keyof MenuItem, value: string) => {
    const newMenu = [...menu];
    newMenu[index] = { ...newMenu[index], [field]: value };
    setMenu(newMenu);
  };

  const removeItem = (index: number) => {
    setMenu(menu.filter((_, i) => i !== index));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newMenu = [...menu];
    [newMenu[index - 1], newMenu[index]] = [newMenu[index], newMenu[index - 1]];
    setMenu(newMenu);
  };

  const moveDown = (index: number) => {
    if (index === menu.length - 1) return;
    const newMenu = [...menu];
    [newMenu[index], newMenu[index + 1]] = [newMenu[index + 1], newMenu[index]];
    setMenu(newMenu);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-serif text-[#2D2A26]">Menu Manager</h2>
        <div className="flex items-center gap-3">
          {saved && <span className="text-sm text-green-600">✓ Saved!</span>}
          <button onClick={addItem} className="bg-[#F5EDE4] text-[#5C4A32] px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#E8DFD5]">
            <Plus size={18} /> Add Item
          </button>
          <button onClick={handleSave} className="bg-[#C4A265] text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-[#D4B275]">
            <Save size={18} /> Save Menu
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#F0E8DE] p-6">
        <div className="space-y-3">
          {menu.map((item, index) => (
            <div key={item.id} className="flex items-center gap-3 p-3 bg-[#FDF8F3] rounded-lg border border-[#F0E8DE]">
              <div className="flex flex-col gap-1">
                <button onClick={() => moveUp(index)} className="text-[#A09080] hover:text-[#5C4A32] text-xs">▲</button>
                <GripVertical size={16} className="text-[#A09080]" />
                <button onClick={() => moveDown(index)} className="text-[#A09080] hover:text-[#5C4A32] text-xs">▼</button>
              </div>
              <input type="text" value={item.label} onChange={(e) => updateItem(index, 'label', e.target.value)} className="flex-1 px-3 py-2 border border-[#E8DFD5] rounded-lg text-sm focus:outline-none focus:border-[#C4A265]" placeholder="Label" />
              <input type="text" value={item.href} onChange={(e) => updateItem(index, 'href', e.target.value)} className="flex-1 px-3 py-2 border border-[#E8DFD5] rounded-lg text-sm focus:outline-none focus:border-[#C4A265]" placeholder="/path" />
              <button onClick={() => removeItem(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
        {menu.length === 0 && (
          <div className="text-center py-12 text-[#A09080]">No menu items. Click "Add Item" to start.</div>
        )}
      </div>
    </div>
  );
}
