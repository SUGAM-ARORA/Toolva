import React, { useState } from 'react';
import { Search, Sliders, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Select from 'react-select';

interface Filters {
  categories: Array<{ value: string; label: string }>;
  minRating: number;
  pricing: Array<{ value: string; label: string }>;
  features: Array<{ value: string; label: string }>;
  modelTypes: Array<{ value: string; label: string }>;
}

interface AdvancedSearchProps {
  onSearch: (query: string, filters: Filters) => void;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    categories: [],
    minRating: 0,
    pricing: [],
    features: [],
    modelTypes: []
  });

  const handleSearch = () => {
    onSearch(query, filters);
  };

  return (
    <div className="relative max-w-4xl mx-auto mb-8">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search AI tools by name, description, or features..."
          className="w-full pl-12 pr-20 py-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          <Sliders className="text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute z-20 w-full mt-2 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Advanced Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Categories
                </label>
                <Select
                  isMulti
                  placeholder="Select categories..."
                  onChange={(selected) => setFilters({ ...filters, categories: selected })}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  options={[
                    { value: 'chatbots', label: 'Chatbots' },
                    { value: 'image', label: 'Image Generation' },
                    { value: 'code', label: 'Code' },
                    // Add more categories
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Pricing
                </label>
                <Select
                  isMulti
                  placeholder="Select pricing options..."
                  onChange={(selected) => setFilters({ ...filters, pricing: selected })}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  options={[
                    { value: 'free', label: 'Free' },
                    { value: 'freemium', label: 'Freemium' },
                    { value: 'paid', label: 'Paid' },
                    { value: 'enterprise', label: 'Enterprise' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Features
                </label>
                <Select
                  isMulti
                  placeholder="Select features..."
                  onChange={(selected) => setFilters({ ...filters, features: selected })}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  options={[
                    { value: 'api', label: 'API Access' },
                    { value: 'integration', label: 'Third-party Integrations' },
                    { value: 'customization', label: 'Customization' },
                    // Add more features
                  ]}
                />
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-4">
              <button
                onClick={() => setFilters({
                  categories: [],
                  minRating: 0,
                  pricing: [],
                  features: [],
                  modelTypes: []
                })}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                Reset
              </button>
              <button
                onClick={handleSearch}
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