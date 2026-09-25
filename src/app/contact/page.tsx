'use client';

import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    setTimeout(() => {
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      <Header cartCount={0} wishlistCount={0} onCartClick={() => window.location.href = '/'} />
      {/* Hero */}
      <section className="relative h-[400px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1616627561839-074385245ff6?w=1600" 
            alt="Contact us" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FDF8F3]/95 via-[#FDF8F3]/80 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#C4A265] text-sm uppercase tracking-[0.3em] mb-4 font-medium">Get in Touch</p>
          <h1 className="text-5xl md:text-6xl font-serif text-[#2D2A26] mb-4">Contact Us</h1>
          <p className="text-lg text-[#5C4A32] mb-8">We're here to help. Reach out anytime for questions, custom orders, or support.</p>
          <div className="flex gap-4">
            <a href="https://wa.me/923160143039" target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white px-8 py-3 rounded-full font-medium hover:bg-green-600 transition-colors flex items-center gap-2">
              <MessageCircle size={20} /> WhatsApp Us
            </a>
            <a href="tel:03160143039" className="bg-[#2D2A26] text-white px-8 py-3 rounded-full font-medium hover:bg-[#C4A265] transition-colors flex items-center gap-2">
              <Phone size={20} /> Call Now
            </a>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#C4A265]/10 rounded-full flex items-center justify-center shrink-0">
                  <Phone className="text-[#C4A265]" size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-[#2D2A26] mb-1">Phone / WhatsApp</h3>
                  <p className="text-sm text-[#5C4A32]">03160143039</p>
                  <a href="https://wa.me/923160143039" target="_blank" rel="noopener noreferrer" className="text-sm text-[#C4A265] hover:underline mt-1 inline-block">
                    Chat on WhatsApp →
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#C4A265]/10 rounded-full flex items-center justify-center shrink-0">
                  <Mail className="text-[#C4A265]" size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-[#2D2A26] mb-1">Email</h3>
                  <p className="text-sm text-[#5C4A32]">support@arabeddings.com</p>
                  <p className="text-sm text-[#5C4A32]">orders@arabeddings.com</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#C4A265]/10 rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="text-[#C4A265]" size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-[#2D2A26] mb-1">Address</h3>
                  <p className="text-sm text-[#5C4A32]">123 Bedding Street, Gulberg III</p>
                  <p className="text-sm text-[#5C4A32]">Lahore, Punjab, Pakistan</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#C4A265]/10 rounded-full flex items-center justify-center shrink-0">
                  <Clock className="text-[#C4A265]" size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-[#2D2A26] mb-1">Business Hours</h3>
                  <p className="text-sm text-[#5C4A32]">Mon - Sat: 9:00 AM - 8:00 PM</p>
                  <p className="text-sm text-[#5C4A32]">Sunday: 10:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#C4A265]/10 rounded-full flex items-center justify-center shrink-0">
                  <MessageCircle className="text-[#C4A265]" size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-[#2D2A26] mb-1">Payment Methods</h3>
                  <p className="text-sm text-[#5C4A32]">JazzCash: 03160143039</p>
                  <p className="text-sm text-[#5C4A32]">Easypaisa: 03160143039</p>
                  <p className="text-sm text-[#5C4A32]">Cash on Delivery</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            {/* Visual Banner */}
            <div className="mb-6 rounded-2xl overflow-hidden h-48">
              <img 
                src="https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=1200" 
                alt="Contact us" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="bg-white rounded-2xl p-8 border border-[#F0E8DE]">
              <h2 className="text-2xl font-serif text-[#2D2A26] mb-6">Send us a Message</h2>
              
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="text-green-600" size={32} />
                  </div>
                  <h3 className="text-xl font-medium text-[#2D2A26] mb-2">Message Sent!</h3>
                  <p className="text-[#5C4A32] mb-6">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                  <button onClick={() => setSubmitted(false)} className="text-[#C4A265] hover:underline font-medium">
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#5C4A32] mb-2">Name *</label>
                      <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full px-4 py-3 border border-[#E8DFD5] rounded-xl focus:outline-none focus:border-[#C4A265]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#5C4A32] mb-2">Email *</label>
                      <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="w-full px-4 py-3 border border-[#E8DFD5] rounded-xl focus:outline-none focus:border-[#C4A265]" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#5C4A32] mb-2">Phone</label>
                      <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 border border-[#E8DFD5] rounded-xl focus:outline-none focus:border-[#C4A265]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#5C4A32] mb-2">Subject *</label>
                      <select value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required className="w-full px-4 py-3 border border-[#E8DFD5] rounded-xl focus:outline-none focus:border-[#C4A265]">
                        <option value="">Select subject</option>
                        <option value="order">Order Inquiry</option>
                        <option value="product">Product Question</option>
                        <option value="return">Return/Exchange</option>
                        <option value="custom">Custom Design Request</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#5C4A32] mb-2">Message *</label>
                    <textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required rows={6} className="w-full px-4 py-3 border border-[#E8DFD5] rounded-xl focus:outline-none focus:border-[#C4A265] resize-none" />
                  </div>
                  <button type="submit" className="w-full bg-[#2D2A26] text-white py-3 rounded-xl font-medium hover:bg-[#C4A265] transition-colors">
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
