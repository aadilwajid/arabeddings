import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Heart, User, Menu, X, Search, Moon, Sun } from 'lucide-react';
import { useStore } from '../store';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const { cart, wishlist, user, isAdmin, cartCount, logout, darkMode, toggleDarkMode } = useStore();
  const location = useLocation();

  React.useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">A</span>
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">ARA</span>
              <span className="text-lg font-light text-amber-600 dark:text-amber-400 ml-1">BEDDINGS</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link to="/products" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors">Shop All</Link>
            <Link to="/products?category=bed-sheets" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Sheets</Link>
            <Link to="/products?category=duvet-covers" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Duvets</Link>
            <Link to="/products?category=comforters" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Comforters</Link>
            <Link to="/products?category=blankets" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Blankets</Link>
            <Link to="/drug-order" className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-semibold transition-colors">Custom Order</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <button onClick={() => toggleDarkMode()} className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title="Toggle dark mode">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Search size={18} />
            </button>
            <Link to="/wishlist" className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Heart size={18} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">{wishlist.length}</span>
              )}
            </Link>
            <Link to="/cart" className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <ShoppingCart size={18} />
              {cartCount() > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-amber-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">{cartCount()}</span>
              )}
            </Link>
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-1 p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <User size={18} />
                  <span className="hidden md:inline text-sm font-medium">{user.name?.split(' ')[0]}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link to="/account" className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg">My Account</Link>
                  <Link to="/account/orders" className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">My Orders</Link>
                  {isAdmin && <Link to="/admin" className="block px-4 py-2.5 text-sm text-amber-600 dark:text-amber-400 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium">Admin Dashboard</Link>}
                  <button onClick={logout} className="block w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-b-lg">Sign Out</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <User size={18} />
              </Link>
            )}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-gray-600 dark:text-gray-300">
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="pb-4 animate-in slide-in-from-top">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search products, materials, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && searchQuery) { window.location.href = `/products?search=${searchQuery}`; } }}
                className="w-full pl-10 pr-4 py-2.5 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-800">
          <nav className="px-4 py-4 space-y-1">
            <Link to="/products" className="block py-2.5 text-gray-700 dark:text-gray-200 font-medium">Shop All</Link>
            <Link to="/products?category=bed-sheets" className="block py-2.5 text-gray-600 dark:text-gray-300">Bed Sheets</Link>
            <Link to="/products?category=duvet-covers" className="block py-2.5 text-gray-600 dark:text-gray-300">Duvet Covers</Link>
            <Link to="/products?category=comforters" className="block py-2.5 text-gray-600 dark:text-gray-300">Comforters</Link>
            <Link to="/products?category=blankets" className="block py-2.5 text-gray-600 dark:text-gray-300">Blankets</Link>
            <Link to="/products?category=pillowcases" className="block py-2.5 text-gray-600 dark:text-gray-300">Pillowcases</Link>
            <Link to="/products?category=pillow-inserts" className="block py-2.5 text-gray-600 dark:text-gray-300">Pillow Inserts</Link>
            <div className="border-t dark:border-gray-800 my-2" />
            <Link to="/drug-order" className="block py-2.5 text-amber-600 dark:text-amber-400 font-semibold">Custom Order</Link>
            {!user && <Link to="/login" className="block py-2.5 text-gray-700 dark:text-gray-200">Sign In</Link>}
          </nav>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">A</span>
              </div>
              <div>
                <span className="text-lg font-bold text-white tracking-tight">ARA</span>
                <span className="text-lg font-light text-amber-400 ml-1">BEDDINGS</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">Premium bedding crafted for the perfect night's sleep. From Egyptian cotton to organic bamboo — every thread tells a story of comfort and quality.</p>
            <div className="flex space-x-3 mt-4">
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors">
                <span className="text-xs">IG</span>
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors">
                <span className="text-xs">FB</span>
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors">
                <span className="text-xs">TW</span>
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Shop</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/products" className="hover:text-amber-400 transition-colors">All Products</Link></li>
              <li><Link to="/products?category=bed-sheets" className="hover:text-amber-400 transition-colors">Bed Sheets</Link></li>
              <li><Link to="/products?category=duvet-covers" className="hover:text-amber-400 transition-colors">Duvet Covers</Link></li>
              <li><Link to="/products?category=comforters" className="hover:text-amber-400 transition-colors">Comforters</Link></li>
              <li><Link to="/products?category=blankets" className="hover:text-amber-400 transition-colors">Blankets</Link></li>
              <li><Link to="/products?category=pillowcases" className="hover:text-amber-400 transition-colors">Pillowcases</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Customer</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/account" className="hover:text-amber-400 transition-colors">My Account</Link></li>
              <li><Link to="/account/orders" className="hover:text-amber-400 transition-colors">Order Tracking</Link></li>
              <li><Link to="/drug-order" className="hover:text-amber-400 transition-colors">Custom Orders</Link></li>
              <li><Link to="/wishlist" className="hover:text-amber-400 transition-colors">Wishlist</Link></li>
              <li><Link to="/cart" className="hover:text-amber-400 transition-colors">Shopping Cart</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center space-x-2"><span>📧</span><span>hello@arabeddings.com</span></li>
              <li className="flex items-center space-x-2"><span>📞</span><span>+1 (555) 987-6543</span></li>
              <li className="flex items-center space-x-2"><span>📍</span><span>New York, NY</span></li>
            </ul>
            <div className="mt-4 p-3 bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-400">Free shipping on orders over $150</p>
              <p className="text-xs text-gray-400 mt-1">30-day risk-free returns</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-500">© 2024 ARA BEDDINGS. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-gray-500">
            <a href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Shipping Info</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
