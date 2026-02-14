
import React, { useState } from 'react';
import { Search, ShoppingBag, Menu, X, Bell, User } from 'lucide-react';
import { Category } from '../types';

interface HeaderProps {
  onCategoryChange: (category: Category) => void;
  activeCategory: Category;
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onCategoryChange, activeCategory, onSearch }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = Object.values(Category);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => onCategoryChange(Category.ALL)}>
            <div className="bg-orange-600 text-white p-2 rounded-lg">
              <ShoppingBag size={24} />
            </div>
            <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Offer<span className="text-orange-600">Zon</span><span className="text-sm font-medium text-gray-400">.in</span>
            </span>
          </div>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-lg relative">
            <input
              type="text"
              placeholder="Search for loot deals, products or stores..."
              className="w-full bg-gray-100 border-none rounded-full py-2.5 pl-12 pr-4 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all text-sm outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </form>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-500 hover:text-orange-600 rounded-full hover:bg-orange-50 transition-colors hidden sm:block">
              <Bell size={22} />
            </button>
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
              <User size={20} />
              <span>Sign In</span>
            </button>
            <button 
              className="md:hidden p-2 text-gray-500 rounded-lg hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Categories - Desktop */}
        <nav className="hidden md:flex items-center gap-8 py-3 border-t border-gray-100 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`text-sm font-semibold whitespace-nowrap transition-colors pb-1 border-b-2 ${
                activeCategory === cat 
                ? 'text-orange-600 border-orange-600' 
                : 'text-gray-500 border-transparent hover:text-gray-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search deals..."
              className="w-full bg-gray-100 border-none rounded-lg py-3 pl-12 pr-4 focus:ring-2 focus:ring-orange-500 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </form>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  onCategoryChange(cat);
                  setIsMobileMenuOpen(false);
                }}
                className={`py-3 px-4 rounded-lg text-sm font-medium text-center ${
                  activeCategory === cat 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
