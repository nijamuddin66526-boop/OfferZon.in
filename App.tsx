
import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Filters from './components/Filters';
import DealCard from './components/DealCard';
import Footer from './components/Footer';
import SmartAssistant from './components/SmartAssistant';
import AdminLogin from './components/Admin/Login';
import AdminDashboard from './components/Admin/Dashboard';
import { Category, Store, SortOption, Deal } from './types';
import { MOCK_DEALS } from './constants';
import { db, auth } from './lib/firebase';
import { collection, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const App: React.FC = () => {
  // Initialize with MOCK_DEALS as fallback to prevent empty screen on first load/failure
  const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS);
  const [user, setUser] = useState<any>(null);
  const [isAdminView, setIsAdminView] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>(Category.ALL);
  const [selectedStore, setSelectedStore] = useState<Store | 'All'>('All');
  const [sortOption, setSortOption] = useState<SortOption>('relevance');
  const [searchQuery, setSearchQuery] = useState('');

  // Authentication Listener
  useEffect(() => {
    if (!auth) return;
    
    try {
      const unsubscribe = onAuthStateChanged(auth, (u) => {
        setUser(u);
      });
      return unsubscribe;
    } catch (e) {
      console.warn("Auth listener could not be established:", e);
    }
  }, []);

  // Simple Hash Routing for /admin
  useEffect(() => {
    const handleHash = () => {
      setIsAdminView(window.location.hash === '#admin');
    };
    
    window.addEventListener('hashchange', handleHash);
    handleHash(); // Initial check
    
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Firestore Real-time Listener
  useEffect(() => {
    if (!db) return;

    try {
      const q = query(collection(db, "deals"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const dealList = snapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data() 
          } as Deal));
          setDeals(dealList);
        }
      }, (err) => {
        console.error("Firestore sync error:", err);
      });
      return unsubscribe;
    } catch (e) {
      console.warn("Failed to connect to Firestore:", e);
    }
  }, []);

  // Filter and Sort Logic
  const filteredAndSortedDeals = useMemo(() => {
    let result = [...deals];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(deal => 
        deal.title.toLowerCase().includes(query) || 
        deal.store.toLowerCase().includes(query) ||
        deal.category.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (activeCategory !== Category.ALL) {
      result = result.filter(deal => deal.category === activeCategory);
    }

    // Store filter
    if (selectedStore !== 'All') {
      result = result.filter(deal => deal.store === selectedStore);
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortOption) {
        case 'priceLowToHigh':
          return a.dealPrice - b.dealPrice;
        case 'priceHighToLow':
          return b.dealPrice - a.dealPrice;
        case 'discount':
          return b.discountPercentage - a.discountPercentage;
        case 'relevance':
        default:
          // Loot deals first, then by creation date
          if (a.isLoot && !b.isLoot) return -1;
          if (!a.isLoot && b.isLoot) return 1;
          return b.createdAt - a.createdAt;
      }
    });

    return result;
  }, [deals, searchQuery, activeCategory, selectedStore, sortOption]);

  const featuredLoot = useMemo(() => {
    return deals.find(d => d.isLoot) || deals[0];
  }, [deals]);

  // Admin View Logic
  if (isAdminView) {
    if (!user) return <AdminLogin />;
    return <AdminDashboard />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        onCategoryChange={setActiveCategory} 
        activeCategory={activeCategory}
        onSearch={setSearchQuery}
      />
      
      <main className="flex-1">
        {/* Only show Hero on the main page/all categories and when not searching */}
        {activeCategory === Category.ALL && !searchQuery && (
          <Hero featuredDeal={featuredLoot} />
        )}

        <Filters 
          selectedStore={selectedStore}
          setSelectedStore={setSelectedStore}
          sortOption={sortOption}
          setSortOption={setSortOption}
          resultCount={filteredAndSortedDeals.length}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {filteredAndSortedDeals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {filteredAndSortedDeals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="bg-gray-100 p-6 rounded-full mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">No deals found</h3>
              <p className="text-gray-500 mt-2 max-w-xs mx-auto">
                We couldn't find any deals matching your current filters. Try adjusting your search or store selection.
              </p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory(Category.ALL);
                  setSelectedStore('All');
                }}
                className="mt-6 text-orange-600 font-bold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </main>

      <SmartAssistant availableDeals={deals} />
      <Footer />
    </div>
  );
};

export default App;
