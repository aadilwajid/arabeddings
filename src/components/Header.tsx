'use client';

import { useState, useEffect } from 'react';
import { Search, ShoppingBag, Menu, X, Heart } from 'lucide-react';
import LoyaltyWidget from './LoyaltyWidget';
import ReferralProgram from './ReferralProgram';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  onCartClick: () => void;
  onSearchClick?: () => void;
}

export default function Header({ cartCount, wishlistCount, onCartClick, onSearchClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#FDF8F3]/95 backdrop-blur-md border-b border-[#E8DFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <a href="/" className="text-xl md:text-2xl font-serif tracking-[0.2em] text-[#2D2A26] uppercase">
            ARA <span className="text-[#C4A265]">BEDDINGS</span>
          </a>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-sm text-[#5C4A32] hover:text-[#C4A265]">Home</a>
            <a href="/#shop" className="text-sm text-[#5C4A32] hover:text-[#C4A265]">Shop</a>
            <a href="/about" className="text-sm text-[#5C4A32] hover:text-[#C4A265]">About</a>
            <a href="/services" className="text-sm text-[#5C4A32] hover:text-[#C4A265]">Services</a>
            <a href="/blog" className="text-sm text-[#5C4A32] hover:text-[#C4A265]">Blog</a>
            <a href="/contact" className="text-sm text-[#5C4A32] hover:text-[#C4A265]">Contact</a>
            <a href="/wishlist" className="text-sm text-[#5C4A32] hover:text-[#C4A265] relative">
              Wishlist
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-4 bg-[#C4A265] text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </a>
            <a href="/track-order" className="text-sm text-[#5C4A32] hover:text-[#C4A265]">Track Order</a>
          </nav>

          <div className="flex items-center space-x-2 md:space-x-3">
            {onSearchClick && (
              <button onClick={onSearchClick} className="p-2 text-[#5C4A32] hover:text-[#C4A265]">
                <Search size={20} />
              </button>
            )}
            <div className="hidden md:flex items-center gap-2">
              <LoyaltyWidget />
              <ReferralProgram />
            </div>
            <a href="/wishlist" className="relative p-2 text-[#5C4A32] hover:text-[#C4A265] md:hidden">
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#C4A265] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </a>
            <button onClick={onCartClick} className="relative p-2 text-[#5C4A32] hover:text-[#C4A265]">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#C4A265] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FDF8F3] border-t border-[#E8DFD5] py-4 px-6">
          <nav className="flex flex-col space-y-4">
            <a href="/" onClick={() => setMobileMenuOpen(false)} className="text-sm text-[#5C4A32]">Home</a>
            <a href="/#shop" onClick={() => setMobileMenuOpen(false)} className="text-sm text-[#5C4A32]">Shop</a>
            <a href="/about" onClick={() => setMobileMenuOpen(false)} className="text-sm text-[#5C4A32]">About</a>
            <a href="/services" onClick={() => setMobileMenuOpen(false)} className="text-sm text-[#5C4A32]">Services</a>
            <a href="/blog" onClick={() => setMobileMenuOpen(false)} className="text-sm text-[#5C4A32]">Blog</a>
            <a href="/contact" onClick={() => setMobileMenuOpen(false)} className="text-sm text-[#5C4A32]">Contact</a>
            <a href="/wishlist" onClick={() => setMobileMenuOpen(false)} className="text-sm text-[#5C4A32]">Wishlist</a>
            <a href="/track-order" onClick={() => setMobileMenuOpen(false)} className="text-sm text-[#5C4A32]">Track Order</a>
          </nav>
        </div>
      )}
    </header>
  );
}
