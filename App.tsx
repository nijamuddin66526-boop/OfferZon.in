
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
import { AlertTriangle, X } from 'lucide-react';

const App: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS);
  const [user, setUser] = useState<any>(null);
  const [isAdminView, setIsAdminView] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>(Category.ALL);
  const [selectedStore, setSelectedStore] = useState<Store | 'All'>('All');
  const [sortOption, setSortOption] = useState<SortOption>('relevance');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEnvWarning, setShowEnvWarning] = useState(false);

  // Check for environment variables
  useEffect(() => {
    const isMissingConfig = !process.env.API_KEY || !process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (isMissingConfig) {
      console.warn("Missing environment variables. Check your Vercel Dashboard.");
      setShowEnvWarning(true);
    }
  }, []);

  // Authentication Listener
  useEffect(() => {
    if (!auth) return;
    try {
      const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
      return unsubscribe;
    } catch (e) {
      console.warn("Auth unavailable");
    }
  }, []);

  // Hash Routing
  useEffect(() => {
    const handleHash = () => setIsAdminView(window.location.hash === '#admin');
    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Firestore Sync
  useEffect(() => {
    if (!db) return;
    try {
      const q = query(collection(db, "deals"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const dealList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Deal));
          setDeals(dealList);
        }
      });
      return unsubscribe;
    } catch (e) {
      console.warn("Database sync unavailable");
    }
  }, []);

  const filteredAndSortedDeals = useMemo(() => {
    let result = [...deals];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(d => d.title.toLowerCase().includes(q) || d.store.toLowerCase().includes(q));
    }
    if (activeCategory !== Category.ALL) result = result.filter(d => d.category === activeCategory);
    if (selectedStore !== 'All') result = result.filter(d => d.store === selectedStore);
    
    result.sort((a, b) => {
      if (sortOption === 'priceLowToHigh') return a.dealPrice - b.dealPrice;
      if (sortOption === 'priceHighToLow') return b.dealPrice - a.dealPrice;
      if (sortOption === 'discount') return b.discountPercentage - a.discountPercentage;
      return b.createdAt - a.createdAt;
    });
    return result;
  }, [deals, searchQuery, activeCategory, selectedStore, sortOption]);

  const featuredLoot = useMemo(() => deals.find(d => d.isLoot) || deals[0], [deals]);

  if (isAdminView) {
    if (!user) return <AdminLogin />;
    return <AdminDashboard />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Environment Variable Warning Banner */}
      {showEnvWarning && (
        <div className="bg-orange-600 text-white px-4 py-2 flex items-center justify-between text-xs font-bold z-[100]">
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} />
            <span>Developer Mode: Some environment variables are missing (Gemini/Firebase). Using local fallback data.</span>
          </div>
          <button onClick={() => setShowEnvWarning(false)}><X size={14} /></button>
        </div>
      )}

      <Header 
        onCategoryChange={setActiveCategory} 
        activeCategory={activeCategory}
        onSearch={setSearchQuery}
      />
      
      <main className="flex-1">
        {activeCategory === Category.ALL && !searchQuery && <Hero featuredDeal={featuredLoot} />}
        <Filters 
          selectedStore={selectedStore}
          setSelectedStore={setSelectedStore}
          sortOption={sortOption}
          setSortOption={setSortOption}
          resultCount={filteredAndSortedDeals.length}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredAndSortedDeals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        </div>
      </main>

      <SmartAssistant availableDeals={deals} />
      <Footer />
    </div>
  );
};

export default App;
