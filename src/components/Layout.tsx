import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, User, Menu, X, Search } from 'lucide-react';
import { useStore } from '../store';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const { cart, wishlist, user, isAdmin, cartCount, logout } = useStore();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🛏️</span>
            <span className="text-xl font-bold text-gray-900">LuxeBedding</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/products" className="text-gray-600 hover:text-gray-900 font-medium">Shop All</Link>
            <Link to="/products?category=bed-sheets" className="text-gray-600 hover:text-gray-900">Sheets</Link>
            <Link to="/products?category=duvet-covers" className="text-gray-600 hover:text-gray-900">Duvets</Link>
            <Link to="/products?category=comforters" className="text-gray-600 hover:text-gray-900">Comforters</Link>
            <Link to="/drug-order" className="text-amber-600 hover:text-amber-700 font-medium">Custom Order</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button onClick={() => setSearchOpen(!searchOpen)} className="text-gray-600 hover:text-gray-900">
              <Search size={20} />
            </button>
            <Link to="/wishlist" className="relative text-gray-600 hover:text-gray-900">
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{wishlist.length}</span>
              )}
            </Link>
            <Link to="/cart" className="relative text-gray-600 hover:text-gray-900">
              <ShoppingCart size={20} />
              {cartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{cartCount()}</span>
              )}
            </Link>
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-900">
                  <User size={20} />
                  <span className="hidden md:inline text-sm">{user.name?.split(' ')[0]}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link to="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Account</Link>
                  <Link to="/account/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Orders</Link>
                  {isAdmin && <Link to="/admin" className="block px-4 py-2 text-sm text-indigo-600 hover:bg-gray-50">Admin Dashboard</Link>}
                  <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">Sign Out</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="text-gray-600 hover:text-gray-900">
                <User size={20} />
              </Link>
            )}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-gray-600">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && searchQuery) { window.location.href = `/products?search=${searchQuery}`; } }}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <nav className="px-4 py-4 space-y-3">
            <Link to="/products" className="block text-gray-700 font-medium" onClick={() => setMobileMenuOpen(false)}>Shop All</Link>
            <Link to="/products?category=bed-sheets" className="block text-gray-600" onClick={() => setMobileMenuOpen(false)}>Sheets</Link>
            <Link to="/products?category=duvet-covers" className="block text-gray-600" onClick={() => setMobileMenuOpen(false)}>Duvets</Link>
            <Link to="/products?category=comforters" className="block text-gray-600" onClick={() => setMobileMenuOpen(false)}>Comforters</Link>
            <Link to="/drug-order" className="block text-amber-600 font-medium" onClick={() => setMobileMenuOpen(false)}>Custom Order</Link>
            {!user && <Link to="/login" className="block text-gray-700" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>}
          </nav>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🛏️</span>
              <span className="text-xl font-bold text-white">LuxeBedding</span>
            </div>
            <p className="text-sm">Premium bedding for the perfect night's sleep. Crafted with care, delivered with love.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products" className="hover:text-white">All Products</Link></li>
              <li><Link to="/products?category=bed-sheets" className="hover:text-white">Bed Sheets</Link></li>
              <li><Link to="/products?category=duvet-covers" className="hover:text-white">Duvet Covers</Link></li>
              <li><Link to="/products?category=comforters" className="hover:text-white">Comforters</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Customer</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/account" className="hover:text-white">My Account</Link></li>
              <li><Link to="/account/orders" className="hover:text-white">Order Tracking</Link></li>
              <li><Link to="/drug-order" className="hover:text-white">Custom Orders</Link></li>
              <li><Link to="/wishlist" className="hover:text-white">Wishlist</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>📧 hello@luxebedding.com</li>
              <li>📞 +1 (555) 987-6543</li>
              <li>📍 New York, NY</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>© 2024 LuxeBedding. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
