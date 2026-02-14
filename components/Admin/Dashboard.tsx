
import React, { useState, useEffect } from 'react';
import { db, auth } from '../../lib/firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { Category, Store, Deal } from '../../types';
import { PlusCircle, Trash2, LogOut, Package, Image as ImageIcon, Link as LinkIcon, Zap, CheckCircle2, TrendingUp, Search } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [inventorySearch, setInventorySearch] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [dealPrice, setDealPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [affiliateUrl, setAffiliateUrl] = useState('');
  const [store, setStore] = useState(Store.AMAZON);
  const [category, setCategory] = useState(Category.ELECTRONICS);
  const [isLoot, setIsLoot] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "deals"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dealList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Deal));
      setDeals(dealList);
    });
    return unsubscribe;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(dealPrice) >= Number(originalPrice)) {
      alert("Deal price must be less than original price.");
      return;
    }
    setLoading(true);
    try {
      const discount = Math.round(((Number(originalPrice) - Number(dealPrice)) / Number(originalPrice)) * 100);
      
      await addDoc(collection(db, "deals"), {
        title,
        originalPrice: Number(originalPrice),
        dealPrice: Number(dealPrice),
        discountPercentage: discount,
        imageUrl,
        affiliateUrl,
        store,
        category,
        isLoot,
        expiryDate: new Date(Date.now() + 86400000).toISOString(),
        createdAt: Date.now()
      });

      setTitle(''); setOriginalPrice(''); setDealPrice(''); setImageUrl(''); setAffiliateUrl('');
      setIsLoot(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Error adding deal");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure? This action cannot be undone.")) {
      await deleteDoc(doc(db, "deals", id));
    }
  };

  const filteredInventory = deals.filter(d => 
    d.title.toLowerCase().includes(inventorySearch.toLowerCase()) ||
    d.store.toLowerCase().includes(inventorySearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Admin Nav */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-orange-600 text-white p-2 rounded-xl shadow-lg shadow-orange-200">
            <Package size={20} />
          </div>
          <span className="font-black text-xl tracking-tight">OfferZon <span className="text-orange-600">Admin</span></span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Admin</span>
            <span className="text-sm font-bold text-slate-900">{auth.currentUser?.email}</span>
          </div>
          <button 
            onClick={() => signOut(auth)}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-red-600 px-4 py-2 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>

      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Form & Stats */}
        <div className="lg:col-span-5 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Total Deals</span>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-black text-slate-900">{deals.length}</span>
                <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                  <TrendingUp size={16} />
                </div>
              </div>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Loot Active</span>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-black text-orange-600">{deals.filter(d => d.isLoot).length}</span>
                <div className="bg-orange-50 p-2 rounded-lg text-orange-600">
                  <Zap size={16} fill="currentColor" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
            <h2 className="text-xl font-black mb-6 flex items-center gap-3">
              <PlusCircle className="text-orange-600" size={24} />
              Publish New Offer
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {success && (
                <div className="bg-green-50 text-green-700 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold border border-green-100 animate-in fade-in zoom-in">
                  <CheckCircle2 size={20} />
                  Offer Published Successfully!
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Title</label>
                <input 
                  type="text" required placeholder="e.g. Apple iPhone 16 Pro Max 256GB" 
                  className="w-full bg-slate-50 border-slate-200 rounded-2xl py-3 px-5 focus:ring-2 focus:ring-orange-500 outline-none transition-all placeholder:text-slate-300 font-medium"
                  value={title} onChange={e => setTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">MRP ₹</label>
                  <input 
                    type="number" required placeholder="79900" 
                    className="w-full bg-slate-50 border-slate-200 rounded-2xl py-3 px-5 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    value={originalPrice} onChange={e => setOriginalPrice(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Loot Price ₹</label>
                  <input 
                    type="number" required placeholder="64999" 
                    className="w-full bg-slate-50 border-slate-200 rounded-2xl py-3 px-5 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    value={dealPrice} onChange={e => setDealPrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Store</label>
                  <select 
                    className="w-full bg-slate-50 border-slate-200 rounded-2xl py-3 px-4 outline-none font-bold text-slate-700"
                    value={store} onChange={e => setStore(e.target.value as Store)}
                  >
                    {Object.values(Store).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                  <select 
                    className="w-full bg-slate-50 border-slate-200 rounded-2xl py-3 px-4 outline-none font-bold text-slate-700"
                    value={category} onChange={e => setCategory(e.target.value as Category)}
                  >
                    {Object.values(Category).filter(c => c !== Category.ALL).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Image URL</label>
                <div className="relative">
                  <ImageIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="url" required placeholder="Paste high-res image link..." 
                    className="w-full bg-slate-50 border-slate-200 rounded-2xl py-3 pl-12 pr-5 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    value={imageUrl} onChange={e => setImageUrl(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Affiliate Link</label>
                <div className="relative">
                  <LinkIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="url" required placeholder="Paste EarnKaro/Affiliate URL..." 
                    className="w-full bg-slate-50 border-slate-200 rounded-2xl py-3 pl-12 pr-5 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    value={affiliateUrl} onChange={e => setAffiliateUrl(e.target.value)}
                  />
                </div>
              </div>

              <label className="flex items-center gap-4 p-5 bg-orange-50 rounded-2xl cursor-pointer border border-orange-100 group transition-all hover:bg-orange-100/50">
                <input 
                  type="checkbox" 
                  className="w-6 h-6 accent-orange-600 rounded-lg cursor-pointer"
                  checked={isLoot}
                  onChange={e => setIsLoot(e.target.checked)}
                />
                <div className="flex flex-col">
                  <span className="flex items-center gap-2 font-black text-orange-700 uppercase tracking-wide text-xs">
                    <Zap size={16} fill="currentColor" />
                    Mark as Mega Loot
                  </span>
                  <span className="text-[10px] font-bold text-orange-600/60 uppercase tracking-widest">Adds exclusive badge & prioritizes</span>
                </div>
              </label>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-black text-white py-5 rounded-[1.5rem] font-black text-lg transition-all active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-slate-200"
              >
                {loading ? 'Publishing Loot...' : 'Post Deal Now'}
              </button>
            </form>
          </div>
        </div>

        {/* Right: List Section */}
        <div className="lg:col-span-7 space-y-4 flex flex-col min-h-0">
          <div className="flex items-center justify-between gap-4 px-2">
            <h2 className="text-2xl font-black tracking-tight">Active Inventory</h2>
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search deals..." 
                className="w-full bg-white border-slate-200 rounded-xl py-2 pl-10 pr-4 text-xs font-bold outline-none focus:ring-2 focus:ring-orange-500"
                value={inventorySearch}
                onChange={e => setInventorySearch(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3 overflow-y-auto pr-2 no-scrollbar flex-1 pb-10">
            {filteredInventory.length > 0 ? filteredInventory.map(deal => (
              <div key={deal.id} className="bg-white p-4 rounded-3xl flex items-center gap-5 shadow-sm border border-slate-100 group hover:border-orange-200 transition-all">
                <div className="w-20 h-20 rounded-2xl bg-slate-50 flex-shrink-0 overflow-hidden border border-slate-100">
                  <img src={deal.imageUrl} className="w-full h-full object-contain mix-blend-multiply" alt={deal.title} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{deal.store}</span>
                    {deal.isLoot && <span className="bg-orange-100 text-orange-600 text-[8px] font-black px-2 py-0.5 rounded uppercase flex items-center gap-0.5">
                      <Zap size={8} fill="currentColor" /> Loot
                    </span>}
                  </div>
                  <h4 className="font-bold text-slate-900 truncate pr-4">{deal.title}</h4>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-slate-900 font-black text-lg">₹{deal.dealPrice.toLocaleString('en-IN')}</span>
                    <span className="text-slate-400 text-sm font-bold line-through">₹{deal.originalPrice.toLocaleString('en-IN')}</span>
                    <span className="text-green-600 font-black text-xs bg-green-50 px-2 py-0.5 rounded-md">{deal.discountPercentage}% OFF</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(deal.id)}
                  className="p-3 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                  title="Delete Deal"
                >
                  <Trash2 size={22} />
                </button>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">
                <Package size={48} className="opacity-10 mb-4" />
                <p className="font-bold">No deals found matching your search</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
