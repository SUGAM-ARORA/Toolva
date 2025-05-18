import React, { useState, useEffect } from 'react';
import { X, ChevronRight, Star, Users, DollarSign, Filter, Search, Code, Brain, Clock, Zap, Shield, Database } from 'lucide-react';
import { ToolCategory } from '../types';
import { motion } from 'framer-motion';
import { aiTools } from '../data/aiTools';

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
  // Dynamic filters based on actual data
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
  });

  // Extract unique values from tools
  const uniqueModelTypes = [...new Set(aiTools.map(tool => tool.modelType))];
  const uniqueTechStack = [...new Set(aiTools.flatMap(tool => tool.techStack || []))];

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Calculate tool counts for each filter
  const getFilterCount = (filterKey: string, value: any) => {
    return aiTools.filter(tool => {
      switch (filterKey) {
        case 'hasGithub':
          return !!tool.github;
        case 'hasAPI':
          return !!tool.apiEndpoint;
        case 'hasDocumentation':
          return !!tool.documentation;
        case 'modelTypes':
          return tool.modelType === value;
        case 'techStack':
          return tool.techStack?.includes(value);
        default:
          return true;
      }
    }).length;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -300 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="h-full overflow-y-auto bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-md bg-gray-900/50">
        <div className="p-4 flex justify-between items-center border-b border-gray-700">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Advanced Filters
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search filters..."
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
          />
        </div>

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
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {uniqueModelTypes.map((type) => (
              <label key={type} className="flex items-center">
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
                <span className="ml-auto text-xs text-gray-500">
                  ({getFilterCount('modelTypes', type)})
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div>
          <label className="block text-sm text-gray-400 mb-2 flex items-center">
            <Code className="h-4 w-4 mr-2 text-green-400" />
            Tech Stack
          </label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {uniqueTechStack.map((tech) => (
              <label key={tech} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.techStack.includes(tech)}
                  onChange={(e) => {
                    const newTech = e.target.checked
                      ? [...filters.techStack, tech]
                      : filters.techStack.filter(t => t !== tech);
                    handleFilterChange('techStack', newTech);
                  }}
                  className="form-checkbox h-4 w-4 text-blue-500 rounded border-gray-600 bg-gray-700"
                />
                <span className="ml-2 text-sm text-gray-300">{tech}</span>
                <span className="ml-auto text-xs text-gray-500">
                  ({getFilterCount('techStack', tech)})
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Features */}
        <div>
          <label className="block text-sm text-gray-400 mb-2 flex items-center">
            <Zap className="h-4 w-4 mr-2 text-yellow-400" />
            Features
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.hasGithub}
                onChange={(e) => handleFilterChange('hasGithub', e.target.checked)}
                className="form-checkbox h-4 w-4 text-blue-500 rounded border-gray-600 bg-gray-700"
              />
              <span className="ml-2 text-sm text-gray-300">GitHub Repository</span>
              <span className="ml-auto text-xs text-gray-500">
                ({getFilterCount('hasGithub', true)})
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.hasAPI}
                onChange={(e) => handleFilterChange('hasAPI', e.target.checked)}
                className="form-checkbox h-4 w-4 text-blue-500 rounded border-gray-600 bg-gray-700"
              />
              <span className="ml-2 text-sm text-gray-300">API Available</span>
              <span className="ml-auto text-xs text-gray-500">
                ({getFilterCount('hasAPI', true)})
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.hasDocumentation}
                onChange={(e) => handleFilterChange('hasDocumentation', e.target.checked)}
                className="form-checkbox h-4 w-4 text-blue-500 rounded border-gray-600 bg-gray-700"
              />
              <span className="ml-2 text-sm text-gray-300">Documentation</span>
              <span className="ml-auto text-xs text-gray-500">
                ({getFilterCount('hasDocumentation', true)})
              </span>
            </label>
          </div>
        </div>

        {/* Quality Metrics */}
        <div>
          <label className="block text-sm text-gray-400 mb-2 flex items-center">
            <Shield className="h-4 w-4 mr-2 text-blue-400" />
            Quality Metrics
          </label>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Ease of Use (min)</label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={filters.easeOfUse}
                onChange={(e) => handleFilterChange('easeOfUse', parseFloat(e.target.value))}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0</span>
                <span>{filters.easeOfUse}</span>
                <span>5</span>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400">Code Quality (min)</label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={filters.codeQuality}
                onChange={(e) => handleFilterChange('codeQuality', parseFloat(e.target.value))}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0</span>
                <span>{filters.codeQuality}</span>
                <span>5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div>
          <label className="block text-sm text-gray-400 mb-2 flex items-center">
            <Clock className="h-4 w-4 mr-2 text-orange-400" />
            Last Updated
          </label>
          <select
            value={filters.lastUpdated}
            onChange={(e) => handleFilterChange('lastUpdated', e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-sm text-white"
          >
            <option value="">Any time</option>
            <option value="day">Last 24 hours</option>
            <option value="week">Last week</option>
            <option value="month">Last month</option>
            <option value="year">Last year</option>
          </select>
        </div>

        {/* Categories */}
        <div>
          <label className="block text-sm text-gray-400 mb-2 flex items-center">
            <Database className="h-4 w-4 mr-2 text-indigo-400" />
            Categories
          </label>
          <div className="space-y-2">
            {categories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.name;
              
              return (
                <motion.button
                  key={category.name}
                  whileHover={{ scale: 1.02 }}
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
        <div className="pt-4 border-t border-gray-700">
          <button
            onClick={() => {
              setFilters({
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
              });
              onFilterChange({});
            }}
            className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium text-white transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;