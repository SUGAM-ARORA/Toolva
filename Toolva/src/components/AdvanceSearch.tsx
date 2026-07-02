import React, { useState, useEffect } from 'react';
import { Search, Sliders, X, Filter, Brain, Code, Star, Clock, Shield, Database, GitBranch, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Select from 'react-select';
import { aiTools } from '../data/aiTools';

interface AdvancedSearchProps {
  onSearch: (query: string, filters: any) => void;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    categories: [],
    minRating: 0,
    pricing: [],
    features: [],
    modelTypes: [],
    techStack: [],
    integrations: [],
    lastUpdated: '',
    hasGithub: false,
    hasAPI: false,
    hasDocumentation: false,
    minEaseOfUse: 0,
    minCodeQuality: 0,
    minUserExperience: 0,
    dailyUsers: '',
    sortBy: 'relevance'
  });

  // Extract unique values from tools
  const uniqueCategories = [...new Set(aiTools.map(tool => tool.category))];
  const uniqueModelTypes = [...new Set(aiTools.map(tool => tool.modelType))];
  const uniqueTechStack = [...new Set(aiTools.flatMap(tool => tool.techStack || []))];
  const uniqueIntegrations = [...new Set(aiTools.flatMap(tool => tool.integrations || []))];

  const handleSearch = () => {
    onSearch(query, filters);
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [query, filters]);

  return (
    <div className="relative max-w-4xl mx-auto mb-8">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur" />
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe what you're looking for..."
            className="w-full pl-12 pr-20 py-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg text-lg"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-400"
          >
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute z-20 w-full mt-2 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Advanced Search</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Categories */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Categories
                </label>
                <Select
                  isMulti
                  placeholder="Select categories..."
                  value={filters.categories}
                  onChange={(selected) => setFilters({ ...filters, categories: selected || [] })}
                  options={uniqueCategories.map(cat => ({ value: cat, label: cat }))}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>

              {/* Model Types */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Model Types
                </label>
                <Select
                  isMulti
                  placeholder="Select model types..."
                  value={filters.modelTypes}
                  onChange={(selected) => setFilters({ ...filters, modelTypes: selected || [] })}
                  options={uniqueModelTypes.map(type => ({ value: type, label: type }))}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>

              {/* Tech Stack */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tech Stack
                </label>
                <Select
                  isMulti
                  placeholder="Select technologies..."
                  value={filters.techStack}
                  onChange={(selected) => setFilters({ ...filters, techStack: selected || [] })}
                  options={uniqueTechStack.map(tech => ({ value: tech, label: tech }))}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>

              {/* Integrations */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Integrations
                </label>
                <Select
                  isMulti
                  placeholder="Select integrations..."
                  value={filters.integrations}
                  onChange={(selected) => setFilters({ ...filters, integrations: selected || [] })}
                  options={uniqueIntegrations.map(int => ({ value: int, label: int }))}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>

              {/* Quality Metrics */}
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
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>0</span>
                  <span>{filters.minRating}</span>
                  <span>5</span>
                </div>
              </div>

              {/* Daily Users */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Minimum Daily Users
                </label>
                <select
                  value={filters.dailyUsers}
                  onChange={(e) => setFilters({ ...filters, dailyUsers: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                >
                  <option value="">Any</option>
                  <option value="1000">1K+</option>
                  <option value="10000">10K+</option>
                  <option value="100000">100K+</option>
                  <option value="1000000">1M+</option>
                </select>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Features
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.hasGithub}
                      onChange={(e) => setFilters({ ...filters, hasGithub: e.target.checked })}
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      GitHub Repository
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.hasAPI}
                      onChange={(e) => setFilters({ ...filters, hasAPI: e.target.checked })}
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      API Available
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.hasDocumentation}
                      onChange={(e) => setFilters({ ...filters, hasDocumentation: e.target.checked })}
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Documentation
                    </span>
                  </label>
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                >
                  <option value="relevance">Relevance</option>
                  <option value="rating">Rating</option>
                  <option value="users">Daily Users</option>
                  <option value="newest">Newest</option>
                  <option value="updated">Recently Updated</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-4">
              <button
                onClick={() => setFilters({
                  categories: [],
                  minRating: 0,
                  pricing: [],
                  features: [],
                  modelTypes: [],
                  techStack: [],
                  integrations: [],
                  lastUpdated: '',
                  hasGithub: false,
                  hasAPI: false,
                  hasDocumentation: false,
                  minEaseOfUse: 0,
                  minCodeQuality: 0,
                  minUserExperience: 0,
                  dailyUsers: '',
                  sortBy: 'relevance'
                })}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                Reset
              </button>
              <button
                onClick={() => {
                  handleSearch();
                  setShowFilters(false);
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedSearch;