
import React from 'react';
import { ExternalLink, Zap, Heart } from 'lucide-react';
import { Deal } from '../types';

interface DealCardProps {
  deal: Deal;
}

const DealCard: React.FC<DealCardProps> = ({ deal }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full group">
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-t-2xl aspect-square bg-gray-50">
        <img 
          src={deal.imageUrl} 
          alt={deal.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <div className="bg-red-600 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-lg">
            {deal.discountPercentage}% OFF
          </div>
          {deal.isLoot && (
            <div className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-md">
              <Zap size={10} className="fill-white" />
              LOOT
            </div>
          )}
        </div>

        <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur shadow-sm rounded-full text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
          <Heart size={18} />
        </button>

        <div className="absolute bottom-3 left-3">
          <span className="bg-white/90 backdrop-blur px-2.5 py-1 rounded-md text-[10px] font-bold text-gray-700 shadow-sm uppercase tracking-wider">
            {deal.store}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug group-hover:text-orange-600 transition-colors">
          {deal.title}
        </h3>
        
        <div className="mt-auto space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-gray-900">{formatPrice(deal.dealPrice)}</span>
            <span className="text-xs text-gray-400 line-through font-medium">{formatPrice(deal.originalPrice)}</span>
          </div>

          <a 
            href={deal.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-orange-100"
          >
            Grab Deal
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default DealCard;
