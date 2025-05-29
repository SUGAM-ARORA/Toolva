import React, { useState, useEffect } from 'react';
import { X, ChevronRight, Star, Users, DollarSign, Filter, Search, Code, Brain, Clock, Zap, Shield, Database, Sparkles, Gauge, Trophy } from 'lucide-react';
import { ToolCategory } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { aiTools } from '../data/aiTools';
import toast from 'react-hot-toast';

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
    techStack: [] as string[],
    lastUpdated: '',
    hasGithub: false,
    hasAPI: false,
    hasDocumentation: false,
    easeOfUse: 0,
    codeQuality: 0,
    userExperience: 0,
    priceRange: [0, 1000],
    popularity: 'all',
    sortBy: 'relevance',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Extract unique values from tools
  const uniqueModelTypes = [...new Set(aiTools.map(tool => tool.modelType))];
  const uniqueTechStack = [...new Set(aiTools.flatMap(tool => tool.techStack || []))];

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      minRating: 0,
      maxPrice: '',
      minUsers: '',
      modelTypes: [],
      features: [],
      techStack: [],
      lastUpdated: '',
      hasGithub: false,
      hasAPI: false,
      hasDocumentation: false,
      easeOfUse: 0,
      codeQuality: 0,
      userExperience: 0,
      priceRange: [0, 1000],
      popularity: 'all',
      sortBy: 'relevance',
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
    toast.success('Filters reset successfully');
  };

  // Filter categories based on search
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, x: -300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -300 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="h-full overflow-y-auto bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl"
    >
      {/* Header with Search */}
      <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700">
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Discover Tools
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search filters..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Quick Filters */}
        <div className="grid grid-cols-2 gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleFilterChange('popularity', 'trending')}
            className={`p-3 rounded-lg ${
              filters.popularity === 'trending'
                ? 'bg-blue-600'
                : 'bg-gray-800 hover:bg-gray-700'
            } flex flex-col items-center justify-center`}
          >
            <Sparkles className="h-5 w-5 mb-1" />
            <span className="text-sm">Trending</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleFilterChange('sortBy', 'topRated')}
            className={`p-3 rounded-lg ${
              filters.sortBy === 'topRated'
                ? 'bg-blue-600'
                : 'bg-gray-800 hover:bg-gray-700'
            } flex flex-col items-center justify-center`}
          >
            <Trophy className="h-5 w-5 mb-1" />
            <span className="text-sm">Top Rated</span>
          </motion.button>
        </div>

        {/* Advanced Filters Toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700"
        >
          <span className="flex items-center">
            <Gauge className="h-5 w-5 mr-2" />
            Advanced Filters
          </span>
          <ChevronRight
            className={`h-5 w-5 transform transition-transform ${
              showAdvanced ? 'rotate-90' : ''
            }`}
          />
        </button>

        {/* Advanced Filters Content */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-6"
            >
              {/* Rating Filter */}
              <div>
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

              {/* Model Types */}
              <div>
                <label className="block text-sm text-gray-400 mb-2 flex items-center">
                  <Brain className="h-4 w-4 mr-2 text-purple-400" />
                  Model Types
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                  {uniqueModelTypes.map((type) => (
                    <motion.label
                      key={type}
                      className="flex items-center p-2 hover:bg-gray-700 rounded-lg cursor-pointer"
                      whileHover={{ x: 4 }}
                    >
                      <input
                        type="checkbox"
                        checked={filters.modelTypes.includes(type)}
                        onChange={(e) => {
                          const newTypes = e.target.checked
                            ? [...filters.modelTypes, type]
                            : filters.modelTypes.filter(t => t !== type);
                          handleFilterChange('modelTypes', newTypes);
                        }}
                        className="form-checkbox h-4 w-4 text-blue-500 rounded border-gray-600 bg-gray-700"
                      />
                      <span className="ml-2 text-sm text-gray-300">{type}</span>
                    </motion.label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm text-gray-400 mb-2 flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-green-400" />
                  Price Range
                </label>
                <select
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-sm text-white"
                >
                  <option value="">Any Price</option>
                  <option value="free">Free Only</option>
                  <option value="paid">Paid Only</option>
                  <option value="freemium">Freemium</option>
                </select>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm text-gray-400 mb-2 flex items-center">
                  <Zap className="h-4 w-4 mr-2 text-yellow-400" />
                  Features
                </label>
                <div className="space-y-2">
                  {['hasGithub', 'hasAPI', 'hasDocumentation'].map((feature) => (
                    <motion.label
                      key={feature}
                      className="flex items-center p-2 hover:bg-gray-700 rounded-lg cursor-pointer"
                      whileHover={{ x: 4 }}
                    >
                      <input
                        type="checkbox"
                        checked={filters[feature]}
                        onChange={(e) => handleFilterChange(feature, e.target.checked)}
                        className="form-checkbox h-4 w-4 text-blue-500 rounded border-gray-600 bg-gray-700"
                      />
                      <span className="ml-2 text-sm text-gray-300">
                        {feature === 'hasGithub' ? 'GitHub Repository' :
                         feature === 'hasAPI' ? 'API Available' :
                         'Documentation'}
                      </span>
                    </motion.label>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Categories */}
        <div>
          <label className="block text-sm text-gray-400 mb-2 flex items-center">
            <Database className="h-4 w-4 mr-2 text-indigo-400" />
            Categories
          </label>
          <div className="space-y-2">
            {filteredCategories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.name;
              
              return (
                <motion.button
                  key={category.name}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onCategoryChange(category.name)}
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
        </div>

        {/* Reset Filters */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={resetFilters}
          className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 rounded-lg text-sm font-medium text-white transition-colors flex items-center justify-center space-x-2"
        >
          <Filter className="h-4 w-4" />
          <span>Reset All Filters</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Sidebar;