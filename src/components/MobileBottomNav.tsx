'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Heart, User, Search } from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/shop', label: 'Shop', icon: Search },
    { href: '/wishlist', label: 'Wishlist', icon: Heart },
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
              <Icon 
                size={24} 
                strokeWidth={isActive ? 2.5 : 2}
                className="transition-all"
              />
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
