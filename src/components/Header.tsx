'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Search, ShoppingBag, Heart, User } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { DarkModeToggle, CurrencySelector } from './UIComponents';
import VoiceSearch from './VoiceSearch';

const LOGO_KEY = 'ara_logo';

export function getLogo(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(LOGO_KEY);
}

export function setLogo(logo: string | null): void {
  if (logo) {
    localStorage.setItem(LOGO_KEY, logo);
  } else {
    localStorage.removeItem(LOGO_KEY);
  }
}

export default function Header() {
  const { theme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [logo, setLogoState] = useState<string | null>(null);

  useEffect(() => {
    setLogoState(getLogo());
    
    // Load cart and wishlist counts
    const cart = localStorage.getItem('ara_cart');
    const wishlist = localStorage.getItem('wishlist');
    
    if (cart) {
      const items = JSON.parse(cart);
      setCartCount(items.reduce((sum: number, item: any) => sum + item.quantity, 0));
    }
    
    if (wishlist) {
      const items = JSON.parse(wishlist);
      setWishlistCount(items.length);
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/collections', label: 'Collections' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-2' : 'py-4'
      }`}
      style={{
        backgroundColor: theme.id === 'glassmorphism' ? 'rgba(255, 255, 255, 0.1)' : 'var(--color-surface)',
        backdropFilter: theme.id === 'glassmorphism' ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: theme.id === 'glassmorphism' ? 'blur(20px)' : 'none',
        borderBottom: isScrolled ? 'var(--border)' : 'none',
        boxShadow: isScrolled ? 'var(--shadow)' : 'none'
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            {logo ? (
              <img src={logo} alt="ARA Beddings" className="h-12 w-auto" />
            ) : (
              <div className="flex items-center gap-2">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    borderRadius: 'var(--border-radius)'
                  }}
                >
                  A
                </div>
                <div>
                  <h1 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
                    ARA Beddings
                  </h1>
                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    Luxury Home Linen
                  </p>
                </div>
              </div>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors hover:opacity-70"
                style={{ color: 'var(--color-text)' }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Dark Mode Toggle */}
            <DarkModeToggle />
            
            {/* Currency Selector */}
            <CurrencySelector />
            
            {/* Voice Search */}
            <VoiceSearch />
            
            <Link
              href="/search"
              className="p-2 rounded-full transition-all hover:scale-110"
              style={{
                backgroundColor: 'transparent',
                color: 'var(--color-text)'
              }}
            >
              <Search className="w-5 h-5" />
            </Link>

            <Link
              href="/wishlist"
              className="p-2 rounded-full transition-all hover:scale-110 relative"
              style={{
                backgroundColor: 'transparent',
                color: 'var(--color-text)'
              }}
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="p-2 rounded-full transition-all hover:scale-110 relative"
              style={{
                backgroundColor: 'transparent',
                color: 'var(--color-text)'
              }}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              href="/account"
              className="p-2 rounded-full transition-all hover:scale-110"
              style={{
                backgroundColor: 'transparent',
                color: 'var(--color-text)'
              }}
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-full"
              style={{
                backgroundColor: 'transparent',
                color: 'var(--color-text)'
              }}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            className="md:hidden mt-4 p-6 rounded-2xl"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--border-radius)',
              boxShadow: 'var(--shadow)',
              border: 'var(--border)'
            }}
          >
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-base font-medium py-2 border-b transition-colors hover:opacity-70"
                  style={{
                    color: 'var(--color-text)',
                    borderColor: 'var(--color-border)'
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
