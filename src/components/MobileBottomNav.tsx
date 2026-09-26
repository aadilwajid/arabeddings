'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Heart, User, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
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
  }, [pathname]);

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/shop', label: 'Shop', icon: Search },
    { href: '/cart', label: 'Cart', icon: ShoppingBag, badge: cartCount },
    { href: '/wishlist', label: 'Wishlist', icon: Heart, badge: wishlistCount },
    { href: '/account', label: 'Account', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden safe-area-bottom" style={{
      backgroundColor: 'var(--color-surface)',
      borderTop: 'var(--border)',
      boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
    }}>
      <div className="grid grid-cols-5 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center py-3 px-2 relative touchable"
              style={{
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)'
              }}
            >
              <div className="relative">
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                {item.badge && item.badge > 0 && (
                  <span 
                    className="absolute -top-2 -right-2 min-w-[18px] h-[18px] rounded-full text-xs flex items-center justify-center text-white font-bold px-1"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1 font-medium">{item.label}</span>
              {isActive && (
                <div 
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
