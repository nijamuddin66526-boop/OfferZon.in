
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
import { db, auth } from './lib/firebase';
import { collection, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const App: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isAdminView, setIsAdminView] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>(Category.ALL);
  const [selectedStore, setSelectedStore] = useState<Store | 'All'>('All');
  const [sortOption, setSortOption] = useState<SortOption>('relevance');
  const [searchQuery, setSearchQuery] = useState('');

  // Authentication Listener
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
  }, []);

  // Simple Hash Routing for /admin
  useEffect(() => {
    const handleHash = () => {
      setIsAdminView(window.location.hash === '#admin');
    };
    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Firestore Real-time Listener
  useEffect(() => {
    try {
      const q = query(collection(db, "deals"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const dealList = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        } as Deal));
        setDeals(dealList);
      }, (error) => {
        console.error("Firestore sync error:", error);
      });
      return unsubscribe;
    } catch (e) {
      console.warn("Firestore not initialized. Check your environment variables.");
    }
  }, []);

  // Get the latest Loot deal to feature in the Hero
  const featuredDeal = useMemo(() => {
    const loot = deals.find(d => d.isLoot);
    return loot || deals[0];
  }, [deals]);

  const filteredDeals = useMemo(() => {
    let result = [...deals];

    if (activeCategory !== Category.ALL) {
      result = result.filter(deal => deal.category === activeCategory);
    }

    if (selectedStore !== 'All') {
      result = result.filter(deal => deal.store === selectedStore);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(deal => 
        deal.title.toLowerCase().includes(q) || 
        deal.store.toLowerCase().includes(q) ||
        deal.category.toLowerCase().includes(q)
      );
    }

    switch (sortOption) {
      case 'priceLowToHigh':
        result.sort((a, b) => a.dealPrice - b.dealPrice);
        break;
      case 'priceHighToLow':
        result.sort((a, b) => b.dealPrice - a.dealPrice);
        break;
      case 'discount':
        result.sort((a, b) => b.discountPercentage - a.discountPercentage);
        break;
      default:
        result.sort((a, b) => {
          if (a.isLoot && !b.isLoot) return -1;
          if (!a.isLoot && b.isLoot) return 1;
          return 0;
        });
    }

    return result;
  }, [deals, activeCategory, selectedStore, sortOption, searchQuery]);

  if (isAdminView) {
    if (!user) return <AdminLogin />;
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen flex flex-col selection:bg-orange-100 selection:text-orange-900">
      <Header 
        activeCategory={activeCategory} 
        onCategoryChange={setActiveCategory}
        onSearch={setSearchQuery}
      />
      
      <main className="flex-1">
        <Hero featuredDeal={featuredDeal} />
        
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
              <div className="bg-gray-100 p-8 rounded-full mb-6">
                <img src="https://img.icons8.com/isometric/100/null/empty-box.png" className="w-24 grayscale opacity-30" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">No active loot found!</h3>
              <p className="text-gray-500 max-w-sm mb-8">
                Try searching for something else or check back later. Our bots are hunting for new price drops 24/7!
              </p>
              <button 
                onClick={() => {
                    setActiveCategory(Category.ALL);
                    setSelectedStore('All');
                    setSearchQuery('');
                }}
                className="bg-orange-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-orange-200 transition-all hover:-translate-y-1 active:scale-95"
              >
                Show All Deals
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <SmartAssistant availableDeals={deals} />
    </div>
  );
};

export default App;
