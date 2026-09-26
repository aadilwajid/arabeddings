'use client';

import { useState, useEffect } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { getLogo, setLogo } from '../Header';

export default function LogoUpload() {
  const [logo, setLogoState] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setLogoState(getLogo());
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size should be less than 2MB');
      return;
    }

    setUploading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setLogo(result);
      setLogoState(result);
      setUploading(false);
    };
    reader.onerror = () => {
      alert('Failed to upload image');
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setLogo(null);
    setLogoState(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#F0E8DE] p-6">
      <div className="flex items-center gap-2 mb-6">
        <ImageIcon size={20} className="text-[#C4A265]" />
        <h3 className="text-lg font-medium text-[#2D2A26]">Logo Management</h3>
      </div>

      <div className="space-y-4">
        {/* Current Logo */}
        {logo && (
          <div className="relative inline-block">
            <img
              src={logo}
              alt="Current Logo"
              className="h-20 w-auto border border-[#E8DFD5] rounded-lg p-2"
            />
            <button
              onClick={handleRemove}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Upload Button */}
        <div>
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={uploading}
            />
            <div className="flex items-center gap-3 px-6 py-3 bg-[#C4A265] text-white rounded-lg hover:bg-[#D4B275] transition-colors w-fit">
              <Upload size={20} />
              <span className="font-medium">
                {uploading ? 'Uploading...' : logo ? 'Change Logo' : 'Upload Logo'}
              </span>
            </div>
          </label>
        </div>

        {/* Help Text */}
        <div className="text-sm text-[#A09080] space-y-1">
          <p>• Recommended size: 200x200 pixels</p>
          <p>• Supported formats: PNG, JPG, SVG</p>
          <p>• Maximum file size: 2MB</p>
          <p>• Logo will appear in the header</p>
        </div>

        {/* Preview */}
        {logo && (
          <div className="mt-6 p-4 bg-[#FDF8F3] rounded-lg border border-[#E8DFD5]">
            <p className="text-sm font-medium text-[#5C4A32] mb-3">Header Preview:</p>
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-[#E8DFD5]">
              <img src={logo} alt="Logo Preview" className="h-12 w-auto" />
              <div>
                <h4 className="font-bold text-[#2D2A26]">ARA Beddings</h4>
                <p className="text-xs text-[#5C4A32]">Luxury Home Linen</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
