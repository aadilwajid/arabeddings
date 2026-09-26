'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun, Globe, Heart, Share2, MapPin, Trash2, Star, Clock, Package, ChevronRight, Gift, Tag, TrendingUp, Users, Eye } from 'lucide-react';
import { useApp, CURRENCIES, Currency, Address } from '@/contexts/AppContext';
import { Product } from '@/types';
import Link from 'next/link';

// ============ DARK MODE TOGGLE ============
export function DarkModeToggle() {
  const { themeMode, toggleTheme } = useApp();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-[#F5EDE4] dark:hover:bg-[#404040] transition-colors touchable"
      title={themeMode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
    >
      {themeMode === 'light' ? (
        <Moon size={20} style={{ color: 'var(--color-text)' }} />
      ) : (
        <Sun size={20} style={{ color: 'var(--color-text)' }} />
      )}
    </button>
  );
}

// ============ CURRENCY SELECTOR ============
export function CurrencySelector() {
  const { currency, setCurrency } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 p-2 rounded-full hover:bg-[#F5EDE4] dark:hover:bg-[#404040] transition-colors touchable"
      >
        <Globe size={20} style={{ color: 'var(--color-text)' }} />
        <span className="text-sm font-medium hidden md:inline" style={{ color: 'var(--color-text)' }}>
          {currency.code}
        </span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div 
            className="absolute right-0 top-full mt-2 bg-white dark:bg-[#2d2d2d] rounded-xl shadow-xl border z-50 min-w-[200px]"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div className="p-2">
              {CURRENCIES.map(c => (
                <button
                  key={c.code}
                  onClick={() => {
                    setCurrency(c);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    currency.code === c.code 
                      ? 'bg-[#C4A265] text-white' 
                      : 'hover:bg-[#F5EDE4] dark:hover:bg-[#404040]'
                  }`}
                  style={currency.code !== c.code ? { color: 'var(--color-text)' } : {}}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{c.symbol} {c.code}</span>
                    <span className="text-xs opacity-70">{c.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ============ ADDRESS BOOK ============
export function AddressBook() {
  const { addresses, addAddress, removeAddress, setDefaultAddress, defaultAddress } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id'>>({
    name: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    isDefault: false,
  });

  const handleAdd = () => {
    if (newAddress.name && newAddress.phone && newAddress.address && newAddress.city) {
      addAddress(newAddress);
      setNewAddress({ name: '', phone: '', address: '', city: '', postalCode: '', isDefault: false });
      setShowForm(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#2d2d2d] rounded-2xl p-6" style={{ border: 'var(--border)' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
          <MapPin size={20} className="text-[#C4A265]" />
          Saved Addresses
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm text-[#C4A265] hover:underline"
        >
          {showForm ? 'Cancel' : '+ Add New'}
        </button>
      </div>

      {showForm && (
        <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-background)' }}>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Full Name"
              value={newAddress.name}
              onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
              className="col-span-2 px-3 py-2 rounded-lg border"
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
            />
            <input
              type="tel"
              placeholder="Phone"
              value={newAddress.phone}
              onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
              className="px-3 py-2 rounded-lg border"
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
            />
            <input
              type="text"
              placeholder="City"
              value={newAddress.city}
              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
              className="px-3 py-2 rounded-lg border"
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
            />
            <input
              type="text"
              placeholder="Address"
              value={newAddress.address}
              onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
              className="col-span-2 px-3 py-2 rounded-lg border"
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
            />
            <input
              type="text"
              placeholder="Postal Code"
              value={newAddress.postalCode}
              onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
              className="px-3 py-2 rounded-lg border"
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newAddress.isDefault}
                onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
              />
              <span className="text-sm" style={{ color: 'var(--color-text)' }}>Set as default</span>
            </label>
          </div>
          <button
            onClick={handleAdd}
            className="mt-3 w-full bg-[#C4A265] text-white py-2 rounded-lg font-medium hover:bg-[#D4B275]"
          >
            Save Address
          </button>
        </div>
      )}

      {addresses.length === 0 ? (
        <p className="text-sm text-center py-4" style={{ color: 'var(--color-text-secondary)' }}>
          No saved addresses yet
        </p>
      ) : (
        <div className="space-y-3">
          {addresses.map(addr => (
            <div
              key={addr.id}
              className={`p-3 rounded-lg border ${
                addr.isDefault ? 'border-[#C4A265] bg-[#C4A265]/5' : ''
              }`}
              style={{ borderColor: addr.isDefault ? '#C4A265' : 'var(--color-border)' }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>
                    {addr.name}
                    {addr.isDefault && <span className="ml-2 text-xs text-[#C4A265]">(Default)</span>}
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                    {addr.phone}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    {addr.address}, {addr.city} {addr.postalCode}
                  </p>
                </div>
                <div className="flex gap-1">
                  {!addr.isDefault && (
                    <button
                      onClick={() => setDefaultAddress(addr.id)}
                      className="p-1 text-xs text-[#C4A265] hover:underline"
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={() => removeAddress(addr.id)}
                    className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============ ORDER HISTORY ============
export function OrderHistory() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#2d2d2d] rounded-2xl p-6" style={{ border: 'var(--border)' }}>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 rounded-lg" style={{ backgroundColor: 'var(--color-background)' }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#2d2d2d] rounded-2xl p-6" style={{ border: 'var(--border)' }}>
      <h3 className="text-lg font-medium flex items-center gap-2 mb-4" style={{ color: 'var(--color-text)' }}>
        <Package size={20} className="text-[#C4A265]" />
        Order History
      </h3>

      {orders.length === 0 ? (
        <p className="text-sm text-center py-8" style={{ color: 'var(--color-text-secondary)' }}>
          No orders yet
        </p>
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <div
              key={order.id}
              className="p-4 rounded-lg border hover:border-[#C4A265] transition-colors"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>
                    Order #{order.orderNumber}
                  </p>
                  <p className="text-xs flex items-center gap-1 mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                    <Clock size={12} />
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                  order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {order.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                  Rs {order.total.toLocaleString()}
                </p>
                <Link
                  href={`/track-order?order=${order.orderNumber}`}
                  className="text-xs text-[#C4A265] hover:underline flex items-center gap-1"
                >
                  Track Order <ChevronRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============ WISHLIST SHARE ============
export function WishlistShare({ wishlistCount }: { wishlistCount: number }) {
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/wishlist`;
    const shareText = `Check out my wishlist on ARA Beddings!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My ARA Beddings Wishlist',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      alert('Wishlist link copied to clipboard!');
    }
  };

  if (wishlistCount === 0) return null;

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:border-[#C4A265] transition-colors"
      style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
    >
      <Share2 size={16} />
      Share Wishlist
    </button>
  );
}

// ============ GIFT WRAPPING ============
export function GiftWrapping({ onToggle }: { onToggle: (enabled: boolean, message: string) => void }) {
  const [enabled, setEnabled] = useState(false);
  const [message, setMessage] = useState('');

  const handleToggle = () => {
    const newState = !enabled;
    setEnabled(newState);
    onToggle(newState, message);
  };

  return (
    <div className="bg-white dark:bg-[#2d2d2d] rounded-2xl p-6" style={{ border: 'var(--border)' }}>
      <div className="flex items-start gap-3">
        <Gift size={24} className="text-[#C4A265] mt-1" />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium" style={{ color: 'var(--color-text)' }}>
              Gift Wrapping
            </h3>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={enabled}
                onChange={handleToggle}
                className="w-4 h-4"
              />
              <span className="text-sm" style={{ color: 'var(--color-text)' }}>+Rs 200</span>
            </label>
          </div>
          <p className="text-xs mb-3" style={{ color: 'var(--color-text-secondary)' }}>
            Beautiful gift wrapping with personalized message
          </p>
          {enabled && (
            <textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                onToggle(enabled, e.target.value);
              }}
              placeholder="Add a personal message (optional)"
              className="w-full px-3 py-2 rounded-lg border text-sm resize-none"
              rows={3}
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ============ BREADCRUMBS ============
export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="flex items-center gap-2 text-sm mb-6 overflow-x-auto">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2 whitespace-nowrap">
          {i > 0 && <ChevronRight size={14} style={{ color: 'var(--color-text-secondary)' }} />}
          {item.href ? (
            <Link href={item.href} className="hover:text-[#C4A265]" style={{ color: 'var(--color-text-secondary)' }}>
              {item.label}
            </Link>
          ) : (
            <span style={{ color: 'var(--color-text)' }}>{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}

// ============ COUNTDOWN TIMER ============
export function CountdownTimer({ endDate, title }: { endDate: string; title: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endDate).getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="bg-gradient-to-r from-[#C4A265] to-[#D4B275] text-white rounded-2xl p-6 text-center">
      <Tag size={32} className="mx-auto mb-2" />
      <h3 className="text-xl font-serif mb-2">{title}</h3>
      <div className="flex justify-center gap-4 mt-4">
        {Object.entries(timeLeft).map(([unit, value]) => (
          <div key={unit} className="text-center">
            <div className="text-3xl font-bold">{value}</div>
            <div className="text-xs uppercase opacity-80">{unit}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ SOCIAL PROOF ============
export function SocialProof({ viewers, sold }: { viewers?: number; sold?: number }) {
  return (
    <div className="flex items-center gap-4 text-sm">
      {viewers && (
        <div className="flex items-center gap-1" style={{ color: 'var(--color-text-secondary)' }}>
          <Eye size={14} className="text-[#C4A265]" />
          <span>{viewers} viewing now</span>
        </div>
      )}
      {sold && (
        <div className="flex items-center gap-1" style={{ color: 'var(--color-text-secondary)' }}>
          <TrendingUp size={14} className="text-green-600" />
          <span>{sold} sold recently</span>
        </div>
      )}
    </div>
  );
}

// ============ STOCK ALERT ============
export function StockAlert({ productId, productName }: { productId: string; productName: string }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email) {
      // In production, this would call an API
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  if (subscribed) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <p className="text-sm text-green-700 dark:text-green-400">
          ✓ We'll notify you when {productName} is back in stock!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#FDF8F3] dark:bg-[#2d2d2d] rounded-lg p-4" style={{ border: 'var(--border)' }}>
      <p className="text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
        Notify me when available
      </p>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          className="flex-1 px-3 py-2 rounded-lg border text-sm"
          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
        />
        <button
          onClick={handleSubscribe}
          className="px-4 py-2 bg-[#C4A265] text-white rounded-lg text-sm font-medium hover:bg-[#D4B275]"
        >
          Notify
        </button>
      </div>
    </div>
  );
}

// ============ PRODUCT RECOMMENDATIONS ============
export function ProductRecommendations({ products, currentProductId }: { products: Product[]; currentProductId?: string }) {
  const { formatPrice } = useApp();
  
  const recommendations = products
    .filter(p => p.id !== currentProductId)
    .slice(0, 4);

  if (recommendations.length === 0) return null;

  return (
    <div className="bg-white dark:bg-[#2d2d2d] rounded-2xl p-6" style={{ border: 'var(--border)' }}>
      <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--color-text)' }}>
        You Might Also Like
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {recommendations.map(product => (
          <Link
            key={product.id}
            href={`/shop?product=${product.id}`}
            className="group"
          >
            <div className="aspect-square rounded-lg overflow-hidden mb-2" style={{ backgroundColor: 'var(--color-background)' }}>
              <img
                src={product.mainImage}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <p className="text-sm font-medium line-clamp-2" style={{ color: 'var(--color-text)' }}>
              {product.name}
            </p>
            <p className="text-sm font-semibold mt-1" style={{ color: 'var(--color-primary)' }}>
              {formatPrice(product.priceFrom)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
