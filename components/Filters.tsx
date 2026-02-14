
import React from 'react';
import { Filter, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { Store, SortOption } from '../types';

interface FiltersProps {
  selectedStore: Store | 'All';
  setSelectedStore: (store: Store | 'All') => void;
  sortOption: SortOption;
  setSortOption: (sort: SortOption) => void;
  resultCount: number;
}

const Filters: React.FC<FiltersProps> = ({ 
  selectedStore, 
  setSelectedStore, 
  sortOption, 
  setSortOption,
  resultCount
}) => {
  const stores = ['All', ...Object.values(Store)];

  return (
    <div className="bg-white border-b border-gray-200 py-3 md:py-4 sticky top-[64px] md:top-[128px] z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-900 shrink-0">
            <Filter size={16} className="text-orange-600" />
            <span>Store:</span>
          </div>
          <div className="flex gap-2">
            {stores.map((store) => (
              <button
                key={store}
                onClick={() => setSelectedStore(store as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap ${
                  selectedStore === store
                  ? 'bg-orange-600 border-orange-600 text-white'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-orange-200 hover:bg-orange-50'
                }`}
              >
                {store}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-6 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0">
          <p className="text-xs text-gray-500 font-medium">
            Showing <span className="text-gray-900 font-bold">{resultCount}</span> hot deals
          </p>
          <div className="flex items-center gap-2 relative">
            <SlidersHorizontal size={16} className="text-gray-400" />
            <select
              className="appearance-none bg-transparent pr-8 pl-1 py-1 text-sm font-bold text-gray-900 outline-none cursor-pointer hover:text-orange-600 transition-colors"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
            >
              <option value="relevance">Sort: Recommended</option>
              <option value="priceLowToHigh">Price: Low to High</option>
              <option value="priceHighToLow">Price: High to Low</option>
              <option value="discount">Max Discount</option>
            </select>
            <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
