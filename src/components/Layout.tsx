import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Heart, User, Menu, X, Search, Moon, Sun, Phone, Mail, MapPin } from 'lucide-react';
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
    <>
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2">
                <Phone size={14} />
                <span>+92 321 1234567</span>
              </div>
              <div className="hidden md:flex items-center space-x-2">
                <Mail size={14} />
                <span>hello@arabeddings.com</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="hidden sm:inline">Free delivery on orders over Rs. 5,000</span>
              {user && (
                <span className="text-xs bg-white/20 px-2 py-1 rounded">
                  {user.role === 'ADMIN' ? 'Admin' : 'Customer'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              {useStore.getState().settings.logo ? (
                <img src={useStore.getState().settings.logo} alt="ARA BEDDINGS" className="h-12 object-contain" />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">A</span>
                </div>
              )}
              <div>
                <div className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">ARA</div>
                <div className="text-xs font-medium text-amber-600 dark:text-amber-400 -mt-1">BEDDINGS</div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 font-medium transition-colors">Home</Link>
              <Link to="/products" className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 font-medium transition-colors">Shop All</Link>
              <Link to="/bundles" className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Deals</Link>
              <Link to="/gift-cards" className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Gift Cards</Link>
              <Link to="/track-order" className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Track Order</Link>
              <Link to="/drug-order" className="text-amber-600 dark:text-amber-400 hover:text-amber-700 font-semibold transition-colors">Custom Order</Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => toggleDarkMode()} 
                className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" 
                title="Toggle dark mode"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button 
                onClick={() => setSearchOpen(!searchOpen)} 
                className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Search size={20} />
              </button>
              <Link 
                to="/wishlist" 
                className="relative p-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Heart size={20} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">{wishlist.length}</span>
                )}
              </Link>
              <Link 
                to="/cart" 
                className="relative p-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <ShoppingCart size={20} />
                {cartCount() > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">{cartCount()}</span>
                )}
              </Link>
              {user ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <User size={20} />
                    <span className="hidden md:inline text-sm font-medium">{user.name?.split(' ')[0]}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="p-3 border-b dark:border-gray-700">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                    <Link to="/account" className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">My Account</Link>
                    <Link to="/account/orders" className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">My Orders</Link>
                    <Link to="/account/loyalty" className="block px-4 py-3 text-sm text-amber-600 dark:text-amber-400 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium">
                      <i className="bi bi-gift me-2"></i>Loyalty Rewards
                    </Link>
                    {isAdmin && <Link to="/admin" className="block px-4 py-3 text-sm text-amber-600 dark:text-amber-400 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium">Admin Dashboard</Link>}
                    <button onClick={logout} className="block w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 border-t dark:border-gray-700">Sign Out</button>
                  </div>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="hidden md:inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-sm font-medium rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all"
                >
                  Sign In
                </Link>
              )}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className="lg:hidden p-2.5 text-gray-600 dark:text-gray-300"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {searchOpen && (
            <div className="pb-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search products, materials, brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && searchQuery) { window.location.href = `/products?search=${searchQuery}`; } }}
                  className="w-full pl-12 pr-4 py-3 border dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
              <Link to="/" className="block py-3 text-gray-700 dark:text-gray-200 font-medium border-b dark:border-gray-800">Home</Link>
              <Link to="/products" className="block py-3 text-gray-700 dark:text-gray-200 font-medium border-b dark:border-gray-800">Shop All</Link>
              <Link to="/products?category=bed-sheets" className="block py-3 text-gray-600 dark:text-gray-300">Bed Sheets</Link>
              <Link to="/products?category=duvet-covers" className="block py-3 text-gray-600 dark:text-gray-300">Duvet Covers</Link>
              <Link to="/products?category=comforters" className="block py-3 text-gray-600 dark:text-gray-300">Comforters</Link>
              <Link to="/products?category=blankets" className="block py-3 text-gray-600 dark:text-gray-300">Blankets</Link>
              <Link to="/products?category=pillowcases" className="block py-3 text-gray-600 dark:text-gray-300">Pillowcases</Link>
              <Link to="/products?category=pillows" className="block py-3 text-gray-600 dark:text-gray-300">Pillows</Link>
              <div className="border-t dark:border-gray-800 my-2" />
              <Link to="/track-order" className="block py-3 text-gray-700 dark:text-gray-200 font-medium">Track Order</Link>
              <Link to="/drug-order" className="block py-3 text-amber-600 dark:text-amber-400 font-semibold">Custom Order</Link>
              <Link to="/about" className="block py-3 text-gray-600 dark:text-gray-300">About Us</Link>
              <Link to="/contact" className="block py-3 text-gray-600 dark:text-gray-300">Contact</Link>
              {!user && <Link to="/login" className="block py-3 text-gray-700 dark:text-gray-200 font-medium">Sign In</Link>}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

export function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              {useStore.getState().settings.logo ? (
                <img src={useStore.getState().settings.logo} alt="ARA BEDDINGS" className="h-12 object-contain" />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">A</span>
                </div>
              )}
              <div>
                <div className="text-xl font-bold text-white tracking-tight">ARA</div>
                <div className="text-xs font-medium text-amber-400 -mt-1">BEDDINGS</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Premium bedding crafted for the perfect night's sleep. From Egyptian cotton to organic bamboo — every thread tells a story of comfort and quality.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-amber-600 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-amber-600 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-amber-600 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Shop</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/products" className="hover:text-amber-400 transition-colors">All Products</Link></li>
              <li><Link to="/bundles" className="hover:text-amber-400 transition-colors">Bundle Deals</Link></li>
              <li><Link to="/gift-cards" className="hover:text-amber-400 transition-colors">Gift Cards</Link></li>
              <li><Link to="/products?category=bed-sheets" className="hover:text-amber-400 transition-colors">Bed Sheets</Link></li>
              <li><Link to="/products?category=duvet-covers" className="hover:text-amber-400 transition-colors">Duvet Covers</Link></li>
              <li><Link to="/products?category=comforters" className="hover:text-amber-400 transition-colors">Comforters</Link></li>
              <li><Link to="/products?category=blankets" className="hover:text-amber-400 transition-colors">Blankets</Link></li>
              <li><Link to="/products?category=pillowcases" className="hover:text-amber-400 transition-colors">Pillowcases</Link></li>
              <li><Link to="/products?category=pillows" className="hover:text-amber-400 transition-colors">Pillows</Link></li>
            </ul>
          </div>

          {/* Customer */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Customer</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/account" className="hover:text-amber-400 transition-colors">My Account</Link></li>
              <li><Link to="/account/loyalty" className="hover:text-amber-400 transition-colors">Loyalty Rewards</Link></li>
              <li><Link to="/track-order" className="hover:text-amber-400 transition-colors">Track Order</Link></li>
              <li><Link to="/drug-order" className="hover:text-amber-400 transition-colors">Custom Orders</Link></li>
              <li><Link to="/wishlist" className="hover:text-amber-400 transition-colors">Wishlist</Link></li>
              <li><Link to="/compare" className="hover:text-amber-400 transition-colors">Compare Products</Link></li>
              <li><Link to="/cart" className="hover:text-amber-400 transition-colors">Shopping Cart</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Help</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="hover:text-amber-400 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-amber-400 transition-colors">Contact Us</Link></li>
              <li><Link to="/shipping" className="hover:text-amber-400 transition-colors">Shipping Info</Link></li>
              <li><Link to="/returns" className="hover:text-amber-400 transition-colors">Returns & Refunds</Link></li>
              <li><Link to="/faq" className="hover:text-amber-400 transition-colors">FAQ</Link></li>
              <li><Link to="/terms" className="hover:text-amber-400 transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-amber-400 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <Mail size={18} className="text-amber-400 mt-0.5 flex-shrink-0" />
                <span>hello@arabeddings.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <Phone size={18} className="text-amber-400 mt-0.5 flex-shrink-0" />
                <span>+92 321 1234567</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-amber-400 mt-0.5 flex-shrink-0" />
                <span>Karachi, Pakistan</span>
              </li>
            </ul>
            <div className="mt-4 p-4 bg-gray-800 rounded-xl">
              <p className="text-xs text-gray-400 mb-1">Free shipping on orders over</p>
              <p className="text-lg font-bold text-amber-400">Rs. 5,000</p>
              <p className="text-xs text-gray-400 mt-2">30-day risk-free returns</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-500 mb-4 md:mb-0">© 2024 ARA BEDDINGS. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <Link to="/privacy" className="hover:text-amber-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-amber-400 transition-colors">Terms of Service</Link>
            <Link to="/shipping" className="hover:text-amber-400 transition-colors">Shipping Info</Link>
            <Link to="/returns" className="hover:text-amber-400 transition-colors">Returns</Link>
            <Link to="/faq" className="hover:text-amber-400 transition-colors">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
