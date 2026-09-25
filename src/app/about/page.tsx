'use client';

import { Award, Heart, Leaf, Users, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      <Header cartCount={0} wishlistCount={0} onCartClick={() => window.location.href = '/'} />
      {/* Hero */}
      <section className="relative h-[500px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1600" 
            alt="Luxury bedding" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FDF8F3]/95 via-[#FDF8F3]/80 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-[#C4A265] text-sm uppercase tracking-[0.3em] mb-4 font-medium">Our Story</p>
            <h1 className="text-5xl md:text-6xl font-serif text-[#2D2A26] mb-6">Crafting Comfort Since 2018</h1>
            <p className="text-lg text-[#5C4A32] mb-8">Premium bedding for Pakistani homes, delivered with care. From luxury Egyptian cotton to sustainable bamboo, we bring world-class quality to your bedroom.</p>
            <div className="flex gap-4">
              <a href="/shop" className="bg-[#2D2A26] text-white px-8 py-3 rounded-full font-medium hover:bg-[#C4A265] transition-colors">
                Shop Now
              </a>
              <a href="/contact" className="border border-[#2D2A26] text-[#2D2A26] px-8 py-3 rounded-full font-medium hover:bg-[#2D2A26] hover:text-white transition-colors">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-serif text-[#2D2A26] mb-6">Who We Are</h2>
            <p className="text-[#5C4A32] leading-relaxed mb-4">
              ARA Beddings was born from a simple belief: every Pakistani home deserves luxury bedding that doesn't break the bank. We started in 2018 with a small workshop in Lahore, and today we serve thousands of happy customers across Pakistan.
            </p>
            <p className="text-[#5C4A32] leading-relaxed mb-4">
              Our mission is to bring world-class quality to your bedroom. We source the finest materials—Egyptian cotton, mulberry silk, European linen—and craft them into bedding that transforms your sleep experience.
            </p>
            <p className="text-[#5C4A32] leading-relaxed">
              From Karachi to Peshawar, Islamabad to Quetta, we deliver comfort to every corner of Pakistan with flat-rate shipping and cash-on-delivery convenience.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE] text-center">
              <p className="text-4xl font-bold text-[#C4A265] mb-2">5000+</p>
              <p className="text-sm text-[#5C4A32]">Happy Customers</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE] text-center">
              <p className="text-4xl font-bold text-[#C4A265] mb-2">100+</p>
              <p className="text-sm text-[#5C4A32]">Products</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE] text-center">
              <p className="text-4xl font-bold text-[#C4A265] mb-2">8</p>
              <p className="text-sm text-[#5C4A32]">Years of Excellence</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE] text-center">
              <p className="text-4xl font-bold text-[#C4A265] mb-2">100%</p>
              <p className="text-sm text-[#5C4A32]">Quality Guaranteed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif text-[#2D2A26] mb-12 text-center">Our Craftsmanship</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="aspect-square rounded-2xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600" alt="Luxury bedding" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="aspect-square rounded-2xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1616627561839-074385245ff6?w=600" alt="Comforter set" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="aspect-square rounded-2xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600" alt="Quilt cover" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="aspect-square rounded-2xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600" alt="Bed sheets" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif text-[#2D2A26] mb-12 text-center">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#C4A265]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="text-[#C4A265]" size={32} />
              </div>
              <h3 className="text-xl font-medium text-[#2D2A26] mb-3">Quality First</h3>
              <p className="text-[#5C4A32]">We never compromise on materials or craftsmanship. Every product is tested for durability and comfort.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#C4A265]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-[#C4A265]" size={32} />
              </div>
              <h3 className="text-xl font-medium text-[#2D2A26] mb-3">Customer Love</h3>
              <p className="text-[#5C4A32]">Your satisfaction is our priority. 7-day returns, responsive support, and genuine care for every customer.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#C4A265]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="text-[#C4A265]" size={32} />
              </div>
              <h3 className="text-xl font-medium text-[#2D2A26] mb-3">Sustainability</h3>
              <p className="text-[#5C4A32]">We source responsibly and use eco-friendly packaging. Good for you, good for the planet.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-serif text-[#2D2A26] mb-12 text-center">Meet the Team</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { name: 'Ahmed Raza', role: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
            { name: 'Sara Khan', role: 'Design Director', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400' },
            { name: 'Ali Hassan', role: 'Operations Head', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400' },
            { name: 'Fatima Ali', role: 'Customer Success', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400' }
          ].map((member, i) => (
            <div key={i} className="text-center">
              <img src={member.image} alt={member.name} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
              <h3 className="font-medium text-[#2D2A26]">{member.name}</h3>
              <p className="text-sm text-[#A09080]">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#2D2A26] py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif text-white mb-4">Ready to Transform Your Sleep?</h2>
          <p className="text-[#D4C5B0] mb-8">Join thousands of happy customers across Pakistan.</p>
          <a href="/#shop" className="inline-block bg-[#C4A265] text-white px-8 py-3 rounded-full font-medium hover:bg-[#D4B275] transition-colors">
            Shop Now
          </a>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
