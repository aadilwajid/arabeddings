'use client';

import { Scissors, Palette, Ruler, Truck, Shield, Clock } from 'lucide-react';

export default function ServicesPage() {
  const services = [
    {
      icon: Scissors,
      title: 'Custom Stitching',
      description: 'Get your bedding custom-stitched to your exact measurements. Perfect fit guaranteed.',
      features: ['Custom sizes available', 'Choice of fabric', 'Personalized embroidery']
    },
    {
      icon: Palette,
      title: 'Custom Designs',
      description: 'Design your own bedding with our custom design service. Choose patterns, colors, and fabrics.',
      features: ['Unlimited color options', 'Custom patterns', 'Bulk orders welcome']
    },
    {
      icon: Ruler,
      title: 'Size Consultation',
      description: 'Not sure what size you need? Our experts will help you choose the perfect fit for your bed.',
      features: ['Free consultation', 'Video call support', 'Measurement guide']
    },
    {
      icon: Truck,
      title: 'Nationwide Delivery',
      description: 'We deliver across all of Pakistan with flat-rate shipping. Cash on delivery available.',
      features: ['Flat rate Rs 350', 'All cities covered', 'COD available']
    },
    {
      icon: Shield,
      title: 'Quality Guarantee',
      description: 'Every product comes with our quality guarantee. 7-day return policy for your peace of mind.',
      features: ['7-day returns', 'Quality checked', 'Satisfaction guaranteed']
    },
    {
      icon: Clock,
      title: 'Fast Processing',
      description: 'Orders processed within 24 hours. Most deliveries arrive within 3-5 business days.',
      features: ['24-hour processing', '3-5 day delivery', 'Tracking available']
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      {/* Hero */}
      <section className="relative h-[300px] bg-gradient-to-br from-[#F5EDE4] to-[#E8DFD5] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#C4A265] text-sm uppercase tracking-[0.3em] mb-4">What We Offer</p>
          <h1 className="text-5xl font-serif text-[#2D2A26] mb-4">Our Services</h1>
          <p className="text-lg text-[#5C4A32]">Premium services for the perfect bedding experience.</p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 border border-[#F0E8DE] hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#C4A265]/10 rounded-full flex items-center justify-center mb-6">
                <service.icon className="text-[#C4A265]" size={32} />
              </div>
              <h3 className="text-xl font-medium text-[#2D2A26] mb-3">{service.title}</h3>
              <p className="text-[#5C4A32] mb-4">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-[#5C4A32]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C4A265]" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#2D2A26] py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif text-white mb-4">Need a Custom Solution?</h2>
          <p className="text-[#D4C5B0] mb-8">Contact us for bulk orders, custom designs, or special requirements.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="/contact" className="bg-[#C4A265] text-white px-8 py-3 rounded-full font-medium hover:bg-[#D4B275] transition-colors">
              Contact Us
            </a>
            <a href="https://wa.me/923160143039" target="_blank" rel="noopener noreferrer" className="border border-white text-white px-8 py-3 rounded-full font-medium hover:bg-white hover:text-[#2D2A26] transition-colors">
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
