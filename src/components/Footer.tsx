import { MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#F5EDE4] border-t border-[#E8DFD5] py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-lg font-serif tracking-[0.15em] text-[#2D2A26] uppercase mb-4">
              ARA <span className="text-[#C4A265]">BEDDINGS</span>
            </h4>
            <p className="text-sm text-[#5C4A32] leading-relaxed mb-4">
              Crafting luxury home linen since 2018. Premium quality delivered across Pakistan.
            </p>
            <div className="flex gap-3">
              <a href="https://wa.me/923160143039" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-[#2D2A26] text-white rounded-full flex items-center justify-center hover:bg-[#C4A265] transition-colors">
                <MessageCircle size={16} />
              </a>
            </div>
          </div>
          <div>
            <h5 className="text-sm font-semibold text-[#2D2A26] uppercase tracking-wider mb-3">Shop</h5>
            <ul className="space-y-2 text-sm text-[#5C4A32]">
              <li><a href="/#shop" className="hover:text-[#C4A265]">Bed Sheets</a></li>
              <li><a href="/#shop" className="hover:text-[#C4A265]">Comforters</a></li>
              <li><a href="/#shop" className="hover:text-[#C4A265]">Quilt Covers</a></li>
              <li><a href="/#shop" className="hover:text-[#C4A265]">Kids</a></li>
              <li><a href="/#shop" className="hover:text-[#C4A265]">Accessories</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-sm font-semibold text-[#2D2A26] uppercase tracking-wider mb-3">Company</h5>
            <ul className="space-y-2 text-sm text-[#5C4A32]">
              <li><a href="/about" className="hover:text-[#C4A265]">About Us</a></li>
              <li><a href="/services" className="hover:text-[#C4A265]">Services</a></li>
              <li><a href="/blog" className="hover:text-[#C4A265]">Blog</a></li>
              <li><a href="/contact" className="hover:text-[#C4A265]">Contact</a></li>
              <li><a href="/custom-designs" className="hover:text-[#C4A265]">Custom Designs</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-sm font-semibold text-[#2D2A26] uppercase tracking-wider mb-3">Customer Care</h5>
            <ul className="space-y-2 text-sm text-[#5C4A32]">
              <li><a href="/track-order" className="hover:text-[#C4A265]">Track Order</a></li>
              <li><a href="/wishlist" className="hover:text-[#C4A265]">Wishlist</a></li>
              <li><a href="/account" className="hover:text-[#C4A265]">My Account</a></li>
              <li><a href="https://wa.me/923160143039" target="_blank" rel="noopener noreferrer" className="hover:text-[#C4A265]">WhatsApp Support</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-sm font-semibold text-[#2D2A26] uppercase tracking-wider mb-3">Payment & Shipping</h5>
            <ul className="space-y-2 text-sm text-[#5C4A32]">
              <li>Cash on Delivery</li>
              <li>JazzCash: 03160143039</li>
              <li>Easypaisa: 03160143039</li>
              <li className="pt-2 font-medium">Flat Shipping: Rs 350</li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-[#E8DFD5] text-center">
          <p className="text-sm text-[#A09080]">© 2026 ARA Beddings. All rights reserved. | Premium Home Linen & Bedding</p>
        </div>
      </div>
    </footer>
  );
}
