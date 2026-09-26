'use client';

import { useState } from 'react';
import { Upload, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CustomDesignsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', productType: '', size: '', quantity: '', 
    fabric: '', color: '', design: '', deadline: '', notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#FDF8F3] flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600" size={40} />
          </div>
          <h2 className="text-3xl font-serif text-[#2D2A26] mb-3">Request Submitted!</h2>
          <p className="text-[#5C4A32] mb-6">Our design team will review your request and get back to you within 24 hours.</p>
          <button onClick={() => setSubmitted(false)} className="text-[#C4A265] hover:underline font-medium">
            Submit another request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      <Header />
      
      {/* Hero */}
      <section className="relative h-[300px] bg-gradient-to-br from-[#F5EDE4] to-[#E8DFD5] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#C4A265] text-sm uppercase tracking-[0.3em] mb-4">Custom Orders</p>
          <h1 className="text-5xl font-serif text-[#2D2A26] mb-4">Design Your Dream Bedding</h1>
          <p className="text-lg text-[#5C4A32]">Create custom bedding tailored to your exact specifications.</p>
        </div>
      </section>

      {/* Process */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-serif text-[#2D2A26] mb-12 text-center">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {[
            { step: '01', title: 'Submit Request', desc: 'Fill out the form with your specifications' },
            { step: '02', title: 'Design Consultation', desc: 'Our team reviews and contacts you' },
            { step: '03', title: 'Sample & Approval', desc: 'We create a sample for your approval' },
            { step: '04', title: 'Production & Delivery', desc: 'Custom bedding made and delivered' }
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="w-16 h-16 bg-[#C4A265] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                {item.step}
              </div>
              <h3 className="font-medium text-[#2D2A26] mb-2">{item.title}</h3>
              <p className="text-sm text-[#5C4A32]">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 border border-[#F0E8DE]">
          <h2 className="text-2xl font-serif text-[#2D2A26] mb-6">Custom Design Request</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#5C4A32] mb-2">Full Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full px-4 py-3 border border-[#E8DFD5] rounded-xl focus:outline-none focus:border-[#C4A265]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#5C4A32] mb-2">Email *</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="w-full px-4 py-3 border border-[#E8DFD5] rounded-xl focus:outline-none focus:border-[#C4A265]" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5C4A32] mb-2">Phone *</label>
              <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required className="w-full px-4 py-3 border border-[#E8DFD5] rounded-xl focus:outline-none focus:border-[#C4A265]" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#5C4A32] mb-2">Product Type *</label>
                <select value={formData.productType} onChange={(e) => setFormData({ ...formData, productType: e.target.value })} required className="w-full px-4 py-3 border border-[#E8DFD5] rounded-xl focus:outline-none focus:border-[#C4A265]">
                  <option value="">Select product</option>
                  <option>Bed Sheet Set</option>
                  <option>Comforter Set</option>
                  <option>Quilt Cover Set</option>
                  <option>Custom Item</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#5C4A32] mb-2">Size *</label>
                <select value={formData.size} onChange={(e) => setFormData({ ...formData, size: e.target.value })} required className="w-full px-4 py-3 border border-[#E8DFD5] rounded-xl focus:outline-none focus:border-[#C4A265]">
                  <option value="">Select size</option>
                  <option>Single</option>
                  <option>Double</option>
                  <option>Queen</option>
                  <option>King</option>
                  <option>Custom Size</option>
                </select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#5C4A32] mb-2">Quantity</label>
                <input type="number" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} min="1" className="w-full px-4 py-3 border border-[#E8DFD5] rounded-xl focus:outline-none focus:border-[#C4A265]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#5C4A32] mb-2">Preferred Fabric</label>
                <input type="text" value={formData.fabric} onChange={(e) => setFormData({ ...formData, fabric: e.target.value })} placeholder="e.g., Egyptian Cotton" className="w-full px-4 py-3 border border-[#E8DFD5] rounded-xl focus:outline-none focus:border-[#C4A265]" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5C4A32] mb-2">Color Preference</label>
              <input type="text" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} placeholder="e.g., Ivory, Sage Green" className="w-full px-4 py-3 border border-[#E8DFD5] rounded-xl focus:outline-none focus:border-[#C4A265]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5C4A32] mb-2">Design Details / Pattern</label>
              <textarea value={formData.design} onChange={(e) => setFormData({ ...formData, design: e.target.value })} rows={3} placeholder="Describe your desired pattern, embroidery, or design elements" className="w-full px-4 py-3 border border-[#E8DFD5] rounded-xl focus:outline-none focus:border-[#C4A265] resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5C4A32] mb-2">Deadline (if any)</label>
              <input type="date" value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} className="w-full px-4 py-3 border border-[#E8DFD5] rounded-xl focus:outline-none focus:border-[#C4A265]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5C4A32] mb-2">Additional Notes</label>
              <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} className="w-full px-4 py-3 border border-[#E8DFD5] rounded-xl focus:outline-none focus:border-[#C4A265] resize-none" />
            </div>
            <button type="submit" className="w-full bg-[#2D2A26] text-white py-3 rounded-xl font-medium hover:bg-[#C4A265] transition-colors flex items-center justify-center gap-2">
              <Upload size={18} /> Submit Request
            </button>
          </form>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
