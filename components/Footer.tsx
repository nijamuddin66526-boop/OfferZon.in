
import React from 'react';
import { ShoppingBag, Facebook, Twitter, Instagram, Send } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-gray-800">
          
          <div className="col-span-1 md:col-span-1 space-y-6">
            <div className="flex items-center gap-2">
              <div className="bg-orange-600 text-white p-1.5 rounded-lg">
                <ShoppingBag size={20} />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Offer<span className="text-orange-600">Zon</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              India's fastest growing deals and coupons aggregator. We find the loot so you don't have to.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-orange-500 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-orange-500 transition-colors"><Twitter size={20} /></a>
              <a href="#" className="hover:text-orange-500 transition-colors"><Instagram size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Today's Deals</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Loot Alerts</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Coupons</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Stores</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Categories</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Electronics</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Fashion</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Home & Kitchen</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Beauty</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Loot Newsletter</h4>
            <p className="text-sm text-gray-400 mb-4">Get instant WhatsApp alerts for price drops!</p>
            <form className="flex flex-col gap-3">
              <input 
                type="text" 
                placeholder="Enter phone number" 
                className="bg-gray-800 border-none rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-orange-500 text-white"
              />
              <button className="bg-orange-600 text-white px-4 py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-orange-700 transition-colors">
                <Send size={16} />
                Join Community
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 space-y-6">
          <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
            <p className="text-xs text-center text-gray-400 leading-relaxed italic">
              <span className="text-orange-500 font-bold not-italic uppercase mr-2">Affiliate Disclosure:</span>
              As an affiliate, we earn from qualifying purchases made through links on this site. This helps us keep the loot finder running 24/7 without annoying ads. We only recommend products we believe offer genuine value.
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-gray-500">
            <p>© 2024 OfferZon.in - Made with ❤️ for Indian Shoppers</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-gray-300">Privacy Policy</a>
              <a href="#" className="hover:text-gray-300">Terms of Use</a>
              <a href="#" className="hover:text-gray-300">Contact Us</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
