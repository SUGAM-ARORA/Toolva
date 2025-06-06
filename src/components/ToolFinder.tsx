import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, X, Sparkles, Brain, Zap, Target, TrendingUp, Star, Users, Clock, ArrowRight, Lightbulb, Cpu, Globe, Code, Image, Music, Video, PenTool, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AITool } from '../types';
import ToolCard from './ToolCard';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface ToolFinderProps {
  tools: AITool[];
}

interface SmartSuggestion {
  query: string;
  category: string;
  confidence: number;
  tools: AITool[];
}

const ToolFinder: React.FC<ToolFinderProps> = ({ tools }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [smartSuggestions, setSmartSuggestions] = useState<SmartSuggestion[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    minRating: 0,
    maxPrice: '',
    minUsers: '',
    features: [] as string[],
    modelTypes: [] as string[],
    categories: [] as string[],
    pricing: [] as string[],
    complexity: [] as string[],
    useCase: [] as string[]
  });

  const categories = [
    { name: 'Chatbots', icon: Brain, color: 'from-blue-500 to-indigo-600' },
    { name: 'Image Generation', icon: Image, color: 'from-purple-500 to-pink-600' },
    { name: 'Code', icon: Code, color: 'from-green-500 to-emerald-600' },
    { name: 'Music', icon: Music, color: 'from-orange-500 to-red-600' },
    { name: 'Video', icon: Video, color: 'from-cyan-500 to-blue-600' },
    { name: 'Writing', icon: PenTool, color: 'from-violet-500 to-purple-600' },
    { name: 'Business', icon: Briefcase, color: 'from-pink-500 to-rose-600' }
  ];

  const smartQueries = [
    "I need to create marketing content",
    "Help me with code debugging",
    "Generate images for my blog",
    "Automate my business processes",
    "Create music for my video",
    "Write better emails",
    "Analyze data trends",
    "Design a logo"
  ];

  const useCases = [
    'Content Creation', 'Data Analysis', 'Automation', 'Design', 
    'Development', 'Marketing', 'Education', 'Research'
  ];

  const complexityLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const pricingOptions = ['Free', 'Freemium', 'Paid', 'Enterprise'];

  // Smart AI-powered search suggestions
  const generateSmartSuggestions = useMemo(() => {
    if (!searchQuery || searchQuery.length < 3) return [];

    const suggestions: SmartSuggestion[] = [];
    const queryLower = searchQuery.toLowerCase();

    // Analyze query intent
    const intents = [
      { keywords: ['create', 'generate', 'make', 'build'], category: 'Creation', weight: 1.0 },
      { keywords: ['analyze', 'data', 'insights', 'metrics'], category: 'Analytics', weight: 0.9 },
      { keywords: ['automate', 'workflow', 'process'], category: 'Automation', weight: 0.8 },
      { keywords: ['design', 'visual', 'ui', 'ux'], category: 'Design', weight: 0.7 },
      { keywords: ['code', 'programming', 'development'], category: 'Development', weight: 0.9 },
      { keywords: ['write', 'content', 'copy', 'text'], category: 'Writing', weight: 0.8 }
    ];

    intents.forEach(intent => {
      const matches = intent.keywords.filter(keyword => queryLower.includes(keyword));
      if (matches.length > 0) {
        const confidence = (matches.length / intent.keywords.length) * intent.weight;
        const relevantTools = tools.filter(tool => 
          tool.category.toLowerCase().includes(intent.category.toLowerCase()) ||
          tool.description.toLowerCase().includes(queryLower) ||
          matches.some(match => tool.name.toLowerCase().includes(match))
        ).slice(0, 6);

        if (relevantTools.length > 0) {
          suggestions.push({
            query: `${intent.category} tools for "${searchQuery}"`,
            category: intent.category,
            confidence,
            tools: relevantTools
          });
        }
      }
    });

    return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 3);
  }, [searchQuery, tools]);

  useEffect(() => {
    setSmartSuggestions(generateSmartSuggestions);
  }, [generateSmartSuggestions]);

  const filteredTools = useMemo(() => {
    let filtered = tools.filter(tool => {
      const matchesSearch = !searchQuery || 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRating = !filters.minRating || (tool.rating || 0) >= filters.minRating;
      
      const matchesPrice = !filters.maxPrice || (
        filters.maxPrice === 'free' ? tool.pricing.toLowerCase().includes('free') :
        filters.maxPrice === 'paid' ? !tool.pricing.toLowerCase().includes('free') :
        true
      );

      const matchesUsers = !filters.minUsers || (
        tool.dailyUsers ? parseInt(tool.dailyUsers.replace(/[^0-9]/g, '')) >= parseInt(filters.minUsers) :
        false
      );

      const matchesCategories = filters.categories.length === 0 || 
        filters.categories.includes(tool.category);

      const matchesTags = selectedTags.length === 0 || 
        selectedTags.some(tag => 
          tool.name.toLowerCase().includes(tag.toLowerCase()) ||
          tool.description.toLowerCase().includes(tag.toLowerCase())
        );

      return matchesSearch && matchesRating && matchesPrice && matchesUsers && matchesCategories && matchesTags;
    });

    // Sort results
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'users':
        filtered.sort((a, b) => {
          const aUsers = parseInt(a.dailyUsers?.replace(/[^0-9]/g, '') || '0');
          const bUsers = parseInt(b.dailyUsers?.replace(/[^0-9]/g, '') || '0');
          return bUsers - aUsers;
        });
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.lastUpdated || '').getTime() - new Date(a.lastUpdated || '').getTime());
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Relevance-based sorting
        if (searchQuery) {
          filtered.sort((a, b) => {
            const aScore = (a.name.toLowerCase().includes(searchQuery.toLowerCase()) ? 2 : 0) +
                          (a.description.toLowerCase().includes(searchQuery.toLowerCase()) ? 1 : 0);
            const bScore = (b.name.toLowerCase().includes(searchQuery.toLowerCase()) ? 2 : 0) +
                          (b.description.toLowerCase().includes(searchQuery.toLowerCase()) ? 1 : 0);
            return bScore - aScore;
          });
        }
    }

    return filtered;
  }, [tools, searchQuery, filters, selectedTags, sortBy]);

  const handleSmartQuery = (query: string) => {
    setSearchQuery(query);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const clearAllFilters = () => {
    setFilters({
      minRating: 0,
      maxPrice: '',
      minUsers: '',
      features: [],
      modelTypes: [],
      categories: [],
      pricing: [],
      complexity: [],
      useCase: []
    });
    setSelectedTags([]);
    setSearchQuery('');
    toast.success('All filters cleared');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full mb-6"
        >
          <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
          <span className="text-blue-600 dark:text-blue-400 font-medium">AI-Powered Tool Discovery</span>
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
        >
          Find Your Perfect AI Tool
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
        >
          Describe what you need, and our AI will find the best tools for your specific use case
        </motion.p>
      </div>

      {/* Smart Search Bar */}
      <div className="relative max-w-4xl mx-auto mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur" />
        <div className="relative">
          <div className="flex items-center bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
            <Search className="w-6 h-6 text-gray-400 ml-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Describe what you want to build or accomplish..."
              className="flex-1 px-4 py-4 bg-transparent text-lg focus:outline-none text-gray-900 dark:text-white placeholder-gray-500"
            />
            <div className="flex items-center space-x-2 mr-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg transition-colors ${
                  showFilters ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
              >
                <Filter className="w-5 h-5" />
              </button>
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as 'grid' | 'list')}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm"
              >
                <option value="grid">Grid</option>
                <option value="list">List</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Query Suggestions */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {smartQueries.map((query, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSmartQuery(query)}
              className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all"
            >
              <Lightbulb className="w-4 h-4 inline mr-2" />
              {query}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-3 mb-8 justify-center">
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = filters.categories.includes(category.name);
          return (
            <motion.button
              key={category.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const newCategories = isSelected
                  ? filters.categories.filter(c => c !== category.name)
                  : [...filters.categories, category.name];
                setFilters({ ...filters, categories: newCategories });
              }}
              className={`flex items-center px-4 py-2 rounded-full transition-all ${
                isSelected
                  ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {category.name}
            </motion.button>
          );
        })}
      </div>

      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div className="max-w-4xl mx-auto mb-6">
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="ml-2 text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.span>
            ))}
            <button
              onClick={() => setSelectedTags([])}
              className="px-3 py-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm"
            >
              Clear all
            </button>
          </div>
        </div>
      )}

      {/* Advanced Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="max-w-4xl mx-auto mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Advanced Filters</h3>
              <div className="flex space-x-2">
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Minimum Rating
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={filters.minRating}
                  onChange={(e) => setFilters({ ...filters, minRating: parseFloat(e.target.value) })}
                  className="w-full accent-blue-500"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>0</span>
                  <span className="font-medium">{filters.minRating}</span>
                  <span>5</span>
                </div>
              </div>

              {/* Use Case Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Use Case
                </label>
                <select
                  value={filters.useCase[0] || ''}
                  onChange={(e) => setFilters({ 
                    ...filters, 
                    useCase: e.target.value ? [e.target.value] : [] 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Use Cases</option>
                  {useCases.map(useCase => (
                    <option key={useCase} value={useCase}>{useCase}</option>
                  ))}
                </select>
              </div>

              {/* Complexity Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Complexity Level
                </label>
                <select
                  value={filters.complexity[0] || ''}
                  onChange={(e) => setFilters({ 
                    ...filters, 
                    complexity: e.target.value ? [e.target.value] : [] 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Levels</option>
                  {complexityLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              {/* Pricing Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Pricing Model
                </label>
                <select
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Pricing</option>
                  {pricingOptions.map(option => (
                    <option key={option} value={option.toLowerCase()}>{option}</option>
                  ))}
                </select>
              </div>

              {/* Users Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Minimum Users
                </label>
                <select
                  value={filters.minUsers}
                  onChange={(e) => setFilters({ ...filters, minUsers: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Any</option>
                  <option value="1000">1K+</option>
                  <option value="10000">10K+</option>
                  <option value="100000">100K+</option>
                  <option value="1000000">1M+</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="relevance">Relevance</option>
                  <option value="rating">Highest Rated</option>
                  <option value="users">Most Popular</option>
                  <option value="newest">Recently Updated</option>
                  <option value="name">Name (A-Z)</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Smart Suggestions */}
      {smartSuggestions.length > 0 && searchQuery && (
        <div className="max-w-4xl mx-auto mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Brain className="w-5 h-5 mr-2 text-blue-500" />
            Smart Suggestions
          </h3>
          <div className="space-y-4">
            {smartSuggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-xl p-4 border border-blue-200 dark:border-blue-800"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {suggestion.query}
                  </h4>
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-xs">
                    {Math.round(suggestion.confidence * 100)}% match
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {suggestion.tools.slice(0, 3).map((tool, toolIndex) => (
                    <div
                      key={toolIndex}
                      className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
                    >
                      <img
                        src={tool.image}
                        alt={tool.name}
                        className="w-10 h-10 rounded-lg object-cover mr-3"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {tool.name}
                        </p>
                        <div className="flex items-center">
                          <Star className="w-3 h-3 text-yellow-400 mr-1" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {tool.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {filteredTools.length} tools found
          </h3>
          {searchQuery && (
            <span className="text-gray-500 dark:text-gray-400">
              for "{searchQuery}"
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Sorted by {sortBy}
          </span>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : filteredTools.length > 0 ? (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : "space-y-4"
        }>
          {filteredTools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="h-full"
            >
              <ToolCard
                tool={tool}
                onFavorite={() => {}}
                isFavorited={false}
                onBookmark={() => {}}
                isBookmarked={false}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No tools found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
          <button
            onClick={clearAllFilters}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ToolFinder;