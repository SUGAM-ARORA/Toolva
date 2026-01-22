import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, X, Check, ChevronDown, DollarSign, Star, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToolCategory } from '../types';

interface GlobalSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categories: ToolCategory[];
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  selectedPricing: string[];
  onPricingChange: (pricing: string[]) => void;
  minRating: number | null;
  onRatingChange: (rating: number | null) => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({
  searchQuery,
  onSearchChange,
  categories,
  selectedCategories,
  onCategoryChange,
  selectedPricing,
  onPricingChange,
  minRating,
  onRatingChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange]);

  // Click outside to close filters
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowFilters(false);
        if (!localSearch && selectedCategories.length === 0 && selectedPricing.length === 0 && !minRating) {
          setIsExpanded(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [localSearch, selectedCategories, selectedPricing, minRating]);

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  const togglePricing = (price: string) => {
    if (selectedPricing.includes(price)) {
      onPricingChange(selectedPricing.filter(p => p !== price));
    } else {
      onPricingChange([...selectedPricing, price]);
    }
  };

  const activeFiltersCount = selectedCategories.length + selectedPricing.length + (minRating ? 1 : 0);

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
      <div className={`relative flex items-center transition-all duration-300 ${
        isExpanded ? 'bg-white dark:bg-gray-800 shadow-lg' : 'bg-gray-100 dark:bg-gray-700'
      } rounded-xl border border-transparent focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20`}>
        
        <div className="pl-4 text-gray-400">
          <Search className="h-5 w-5" />
        </div>

        <input
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          placeholder="Search AI tools..."
          className="w-full bg-transparent border-none py-3 px-4 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-0"
        />

        {localSearch && (
          <button
            onClick={() => setLocalSearch('')}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <div className="border-l border-gray-200 dark:border-gray-600 h-8 mx-2" />

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center px-4 py-2 m-1 rounded-lg transition-colors ${
            showFilters || activeFiltersCount > 0
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
              : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <Filter className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium hidden sm:inline">Filters</span>
          {activeFiltersCount > 0 && (
            <span className="ml-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 z-50"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Categories */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                  <Briefcase className="h-4 w-4 mr-2 text-blue-500" />
                  Categories
                </h3>
                <div className="max-h-48 overflow-y-auto space-y-1 pr-2 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
                  {categories.filter(c => c.name !== 'All').map((category) => (
                    <button
                      key={category.name}
                      onClick={() => toggleCategory(category.name)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategories.includes(category.name)
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <span className="flex items-center">
                        <category.icon className="h-4 w-4 mr-2 opacity-70" />
                        {category.name}
                      </span>
                      {selectedCategories.includes(category.name) && (
                        <Check className="h-4 w-4" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                {/* Pricing */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                    Pricing
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {['Free', 'Pyramium', 'Paid'].map((price) => (
                      <button
                        key={price}
                        onClick={() => togglePricing(price)}
                        className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                          selectedPricing.includes(price)
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
                            : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        {price}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                    <Star className="h-4 w-4 mr-2 text-yellow-500" />
                    Minimum Rating
                  </h3>
                  <div className="flex items-center gap-2">
                    {[4, 4.5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => onRatingChange(minRating === rating ? null : rating)}
                        className={`px-3 py-1.5 rounded-full text-sm border transition-all flex items-center ${
                          minRating === rating
                            ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300'
                            : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        {rating}+ <Star className="h-3 w-3 ml-1 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
              <button
                onClick={() => {
                  onCategoryChange([]);
                  onPricingChange([]);
                  onRatingChange(null);
                  setLocalSearch('');
                }}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Clear all
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                Show Results
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GlobalSearch;
