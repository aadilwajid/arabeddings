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
    <nav 
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden safe-area-bottom"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        boxShadow: '0 -4px 12px rgba(0,0,0,0.08)'
      }}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center flex-1 py-2 px-1 relative touchable min-h-[56px]"
              style={{
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)'
              }}
            >
              <div className="relative">
                <Icon 
                  size={24} 
                  strokeWidth={isActive ? 2.5 : 2}
                  className="transition-all"
                />
                {item.badge && item.badge > 0 && (
                  <span 
                    className="absolute -top-2 -right-3 min-w-[20px] h-[20px] rounded-full text-[10px] flex items-center justify-center text-white font-bold px-1"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 font-medium leading-tight text-center">
                {item.label}
              </span>
              {isActive && (
                <div 
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full transition-all"
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
