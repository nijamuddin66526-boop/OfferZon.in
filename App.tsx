
import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Filters from './components/Filters';
import DealCard from './components/DealCard';
import Footer from './components/Footer';
import SmartAssistant from './components/SmartAssistant';
import { Category, Store, SortOption, Deal } from './types';
import { MOCK_DEALS } from './constants';

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category>(Category.ALL);
  const [selectedStore, setSelectedStore] = useState<Store | 'All'>('All');
  const [sortOption, setSortOption] = useState<SortOption>('relevance');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDeals = useMemo(() => {
    let deals = [...MOCK_DEALS];

    // Category Filter
    if (activeCategory !== Category.ALL) {
      deals = deals.filter(deal => deal.category === activeCategory);
    }

    // Store Filter
    if (selectedStore !== 'All') {
      deals = deals.filter(deal => deal.store === selectedStore);
    }

    // Search Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      deals = deals.filter(deal => 
        deal.title.toLowerCase().includes(q) || 
        deal.store.toLowerCase().includes(q) ||
        deal.category.toLowerCase().includes(q)
      );
    }

    // Sorting
    switch (sortOption) {
      case 'priceLowToHigh':
        deals.sort((a, b) => a.dealPrice - b.dealPrice);
        break;
      case 'priceHighToLow':
        deals.sort((a, b) => b.dealPrice - a.dealPrice);
        break;
      case 'discount':
        deals.sort((a, b) => b.discountPercentage - a.discountPercentage);
        break;
      default:
        // Relevance - Loot first, then by date
        deals.sort((a, b) => {
          if (a.isLoot && !b.isLoot) return -1;
          if (!a.isLoot && b.isLoot) return 1;
          return 0;
        });
    }

    return deals;
  }, [activeCategory, selectedStore, sortOption, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        activeCategory={activeCategory} 
        onCategoryChange={setActiveCategory}
        onSearch={setSearchQuery}
      />
      
      <main className="flex-1">
        <Hero />
        
        <Filters 
          selectedStore={selectedStore}
          setSelectedStore={setSelectedStore}
          sortOption={sortOption}
          setSortOption={setSortOption}
          resultCount={filteredDeals.length}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {filteredDeals.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {filteredDeals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="bg-gray-100 p-6 rounded-full mb-6">
                <img src="https://img.icons8.com/isometric/100/null/empty-box.png" className="w-20 opacity-40" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No loot deals found!</h3>
              <p className="text-gray-500 max-w-sm">
                We couldn't find any deals matching your current filters. Try changing your search or category.
              </p>
              <button 
                onClick={() => {
                    setActiveCategory(Category.ALL);
                    setSelectedStore('All');
                    setSearchQuery('');
                }}
                className="mt-6 text-orange-600 font-bold hover:underline"
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <SmartAssistant availableDeals={MOCK_DEALS} />
    </div>
  );
};

export default App;
