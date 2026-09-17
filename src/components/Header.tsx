import { Search, ShoppingBag, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Header({ cartCount, onCartClick, searchQuery, onSearchChange }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#FDF8F3]/95 backdrop-blur-md border-b border-[#E8DFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-[#5C4A32] hover:text-[#C4A265] transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-xl md:text-2xl font-serif tracking-[0.2em] text-[#2D2A26] uppercase">
              ARA <span className="text-[#C4A265]">BEDDINGS</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-sm tracking-wide text-[#5C4A32] hover:text-[#C4A265] transition-colors">Shop</a>
            <a href="#" className="text-sm tracking-wide text-[#5C4A32] hover:text-[#C4A265] transition-colors">Collections</a>
            <a href="#" className="text-sm tracking-wide text-[#5C4A32] hover:text-[#C4A265] transition-colors">About</a>
            <a href="#" className="text-sm tracking-wide text-[#5C4A32] hover:text-[#C4A265] transition-colors">Contact</a>
          </nav>

          {/* Search & Cart */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="relative">
              {searchOpen ? (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search products..."
                    className="w-48 md:w-64 px-4 py-2 pr-10 text-sm bg-white border border-[#E8DFD5] rounded-full focus:outline-none focus:border-[#C4A265] text-[#2D2A26] placeholder:text-[#A09080]"
                    autoFocus
                  />
                  <button
                    onClick={() => { setSearchOpen(false); onSearchChange(''); }}
                    className="absolute right-3 text-[#A09080] hover:text-[#5C4A32]"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-[#5C4A32] hover:text-[#C4A265] transition-colors"
                >
                  <Search size={20} />
                </button>
              )}
            </div>

            {/* Cart */}
            <button
              onClick={onCartClick}
              className="relative p-2 text-[#5C4A32] hover:text-[#C4A265] transition-colors"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#C4A265] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FDF8F3] border-t border-[#E8DFD5] py-4 px-6">
          <nav className="flex flex-col space-y-4">
            <a href="#" className="text-sm tracking-wide text-[#5C4A32] hover:text-[#C4A265] transition-colors">Shop</a>
            <a href="#" className="text-sm tracking-wide text-[#5C4A32] hover:text-[#C4A265] transition-colors">Collections</a>
            <a href="#" className="text-sm tracking-wide text-[#5C4A32] hover:text-[#C4A265] transition-colors">About</a>
            <a href="#" className="text-sm tracking-wide text-[#5C4A32] hover:text-[#C4A265] transition-colors">Contact</a>
          </nav>
          {/* Mobile search */}
          <div className="mt-4 pt-4 border-t border-[#E8DFD5]">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A09080]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-[#E8DFD5] rounded-full focus:outline-none focus:border-[#C4A265] text-[#2D2A26] placeholder:text-[#A09080]"
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
