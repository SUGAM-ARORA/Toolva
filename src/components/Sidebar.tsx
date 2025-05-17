import React, { useState } from 'react';
import { X, ChevronRight, Star, Users, DollarSign, Filter } from 'lucide-react';
import { ToolCategory } from '../types';
import { motion } from 'framer-motion';

interface SidebarProps {
  categories: ToolCategory[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onClose: () => void;
  onFilterChange: (filters: any) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  onClose,
  onFilterChange
}) => {
  const [filters, setFilters] = useState({
    minRating: 0,
    maxPrice: '',
    minUsers: '',
    modelTypes: [] as string[],
    features: [] as string[],
  });

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -300 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="h-full overflow-y-auto bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl"
    >
      <div className="sticky top-0 z-10 backdrop-blur-md bg-gray-900/50">
        <div className="p-4 flex justify-between items-center border-b border-gray-700">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Discover
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-sm font-semibold text-gray-400 mb-4 flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </h3>

        {/* Rating Filter */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2 flex items-center">
            <Star className="h-4 w-4 mr-2 text-yellow-400" />
            Minimum Rating
          </label>
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={filters.minRating}
            onChange={(e) => handleFilterChange('minRating', parseFloat(e.target.value))}
            className="w-full accent-blue-500"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>0</span>
            <span>{filters.minRating}</span>
            <span>5</span>
          </div>
        </div>

        {/* Price Filter */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2 flex items-center">
            <DollarSign className="h-4 w-4 mr-2 text-green-400" />
            Price Range
          </label>
          <select
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-sm"
          >
            <option value="">All Prices</option>
            <option value="free">Free Only</option>
            <option value="paid">Paid Only</option>
            <option value="freemium">Freemium</option>
          </select>
        </div>

        {/* Users Filter */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2 flex items-center">
            <Users className="h-4 w-4 mr-2 text-purple-400" />
            Minimum Daily Users
          </label>
          <select
            value={filters.minUsers}
            onChange={(e) => handleFilterChange('minUsers', e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-sm"
          >
            <option value="">Any</option>
            <option value="1000">1K+</option>
            <option value="10000">10K+</option>
            <option value="100000">100K+</option>
            <option value="1000000">1M+</option>
          </select>
        </div>
      </div>

      {/* Categories Section */}
      <div className="p-4 space-y-2">
        <h3 className="text-sm font-semibold text-gray-400 mb-4">Categories</h3>
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.name;
          
          return (
            <motion.button
              key={category.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onCategoryChange(category.name);
              }}
              className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${
                isSelected
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'hover:bg-gray-700/50 text-gray-300'
              }`}
            >
              <Icon className={`h-5 w-5 mr-3 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
              <span className="flex-1 text-left font-medium">{category.name}</span>
              <div className="flex items-center">
                <span className={`text-sm ${isSelected ? 'text-white' : 'text-gray-500'}`}>
                  {category.count}
                </span>
                <ChevronRight className={`h-4 w-4 ml-2 ${isSelected ? 'text-white' : 'text-gray-500'}`} />
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="mt-4 p-4 bg-gray-800/50">
        <h3 className="text-sm font-semibold text-gray-400 mb-4">Quick Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-400">{categories.length}</div>
            <div className="text-sm text-gray-400">Categories</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg p-3">
            <div className="text-2xl font-bold text-purple-400">
              {categories.reduce((acc, cat) => acc + cat.count, 0)}
            </div>
            <div className="text-sm text-gray-400">Total Tools</div>
          </div>
        </div>
      </div>

      {/* Trending Categories */}
      <div className="mt-4 p-4">
        <h3 className="text-sm font-semibold text-gray-400 mb-4">Trending Categories</h3>
        <div className="space-y-2">
          {categories
            .filter(cat => cat.count > 50)
            .slice(0, 3)
            .map(category => (
              <motion.div
                key={category.name}
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-r from-gray-700/30 to-gray-600/30 rounded-lg p-3 cursor-pointer"
                onClick={() => onCategoryChange(category.name)}
              >
                <div className="flex items-center">
                  <category.icon className="h-4 w-4 text-blue-400 mr-2" />
                  <span className="text-sm font-medium text-gray-300">{category.name}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">{category.description}</div>
                <div className="mt-2 flex items-center">
                  <Users className="h-3 w-3 text-gray-500 mr-1" />
                  <span className="text-xs text-gray-500">{category.count} tools</span>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;