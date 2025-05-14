import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { AITool } from '../types';

interface ToolFinderProps {
  tools: AITool[];
}

const ToolFinder: React.FC<ToolFinderProps> = ({ tools }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minRating: 0,
    maxPrice: '',
    minUsers: '',
    features: [] as string[],
    modelTypes: [] as string[],
  });

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    
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

    const matchesModelTypes = filters.modelTypes.length === 0 ||
      (tool.modelType && filters.modelTypes.includes(tool.modelType));

    return matchesSearch && matchesRating && matchesPrice && matchesUsers && matchesModelTypes;
  });

  const uniqueModelTypes = Array.from(new Set(tools.map(tool => tool.modelType).filter(Boolean)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Bar */}
      <div className="relative max-w-2xl mx-auto mb-8">
            <input
              type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for AI tools by name, description, or features..."
          className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
        />
        <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
        >
          <Filter className="h-5 w-5" />
        </button>
          </div>

      {/* Filters */}
      {showFilters && (
        <div className="max-w-2xl mx-auto mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
          <button
              onClick={() => setShowFilters(false)}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
              <X className="h-5 w-5" />
          </button>
        </div>

          <div className="space-y-6">
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
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>0</span>
                <span>{filters.minRating}</span>
                <span>5</span>
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price
              </label>
              <select
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All</option>
                <option value="free">Free Only</option>
                <option value="paid">Paid Only</option>
              </select>
            </div>

            {/* Users Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Minimum Daily Users
              </label>
              <select
                value={filters.minUsers}
                onChange={(e) => setFilters({ ...filters, minUsers: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All</option>
                <option value="1000">1K+</option>
                <option value="10000">10K+</option>
                <option value="100000">100K+</option>
                <option value="1000000">1M+</option>
              </select>
            </div>

            {/* Model Types Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Model Types
              </label>
              <div className="space-y-2">
                {uniqueModelTypes.map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.modelTypes.includes(type)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters({
                            ...filters,
                            modelTypes: [...filters.modelTypes, type]
                          });
                        } else {
                          setFilters({
                            ...filters,
                            modelTypes: filters.modelTypes.filter(t => t !== type)
                          });
                        }
                      }}
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">{type}</span>
                  </label>
                ))}
              </div>
                      </div>
                    </div>
                  </div>
      )}

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map(tool => (
          <div
            key={tool.name}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {tool.name}
              </h3>
              {tool.rating && (
                <div className="flex items-center bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    {tool.rating}
                  </span>
                  <svg className="w-4 h-4 text-blue-700 dark:text-blue-300 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              )}
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
              {tool.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Category</span>
                <p className="font-medium text-gray-900 dark:text-white">{tool.category}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Pricing</span>
                <p className="font-medium text-gray-900 dark:text-white">{tool.pricing}</p>
              </div>
              {tool.dailyUsers && (
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Daily Users</span>
                  <p className="font-medium text-gray-900 dark:text-white">{tool.dailyUsers}</p>
                </div>
              )}
              {tool.modelType && (
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Model Type</span>
                  <p className="font-medium text-gray-900 dark:text-white">{tool.modelType}</p>
                </div>
              )}
            </div>

            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Try Now
            </a>
          </div>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            No tools found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
};

export default ToolFinder;