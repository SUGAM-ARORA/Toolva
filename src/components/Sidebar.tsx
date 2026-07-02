import React, { useState, useMemo } from 'react';
import { X, ChevronRight, Star, Users, DollarSign, Filter, Search, Code, Brain, Clock, Zap, Shield, Database, Sparkles, Gauge, Trophy } from 'lucide-react';
import { AITool, ToolCategory } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface NavItem {
  label: string;
  icon: any;
  view: string;
}

interface SidebarProps {
  categories: ToolCategory[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onClose: () => void;
  onFilterChange: (filters: any) => void;
  toolsCount: number;
  tools?: AITool[];
}

const Sidebar: React.FC<SidebarProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  onClose,
  onFilterChange,
  toolsCount,
  tools = []
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

  // Calculate category counts from the tools prop (works without Supabase)
  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {};
    if (tools && Array.isArray(tools)) {
      tools.forEach(tool => {
        const cat = (tool.category || 'Productivity').trim().toLowerCase();
        stats[cat] = (stats[cat] || 0) + 1;
      });
    }
    return stats;
  }, [tools]);

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

  return (
    <motion.div 
      initial={{ opacity: 0, x: -300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -300 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="h-full overflow-y-auto bg-[#141721] text-white shadow-2xl border-r border-gray-800"
    >
      {/* ─── Top Brand & Close Header ─── */}
      <div className="sticky top-0 z-20 bg-[#141721]/95 backdrop-blur-md border-b border-gray-800 p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 to-red-500 flex items-center justify-center font-black text-white shadow-lg shadow-orange-500/20">
              T
            </span>
            <span className="text-lg font-black tracking-wider text-white font-mono uppercase">
              TOOLVA<span className="text-orange-500">.AI</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-gray-800/80 hover:bg-gray-700 text-gray-400 hover:text-white transition-all shadow-sm"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ─── Quick Actions & User Bar (From old header) ─── */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-800/60">
          {user ? (
            <div className="flex items-center space-x-2 text-xs text-gray-300 truncate">
              <img 
                src={user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email || 'U')}&background=f97316&color=fff`} 
                alt="User" 
                className="w-6 h-6 rounded-full border border-orange-500 shrink-0"
              />
              <span className="truncate max-w-[120px] font-medium">{user.email?.split('@')[0]}</span>
            </div>
          ) : (
            <button
              onClick={onSignIn}
              className="flex-1 py-1.5 px-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center space-x-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          <div className="flex items-center space-x-1.5 shrink-0">
            {onSync && (
              <button
                onClick={onSync}
                disabled={isSyncing}
                className="p-1.5 rounded-xl bg-[#1c202f] hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-700/60 disabled:opacity-50 transition-all"
                title="Sync with GitHub repo"
              >
                <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin text-orange-400' : ''}`} />
              </button>
            )}
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className="p-1.5 rounded-xl bg-[#1c202f] hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-700/60 transition-all"
                title="Toggle Theme"
              >
                {isDark ? <Sun className="h-4 w-4 text-yellow-400" /> : <Moon className="h-4 w-4 text-blue-400" />}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* ─── App Navigation Section (From old header board) ─── */}
        {navItems && navItems.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold tracking-widest text-gray-400 uppercase font-mono px-1">
              <span>EXPLORE & WORKFLOWS</span>
              <span className="text-orange-500">{navItems.length} VIEWS</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = currentView === item.view;
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      if (onViewChange) onViewChange(item.view);
                      onClose();
                    }}
                    className={`flex items-center space-x-2 p-2.5 rounded-xl text-left transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-orange-500/20 to-red-500/10 border border-orange-500/40 text-white font-bold shadow-md'
                        : 'bg-[#1c202f] hover:bg-gray-800/80 border border-gray-800 text-gray-300 hover:text-white'
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-orange-400' : 'text-gray-400'}`} />
                    <span className="text-xs truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── Search Filters Input ─── */}
        <div className="space-y-2 pt-2 border-t border-gray-800/80">
          <div className="text-[11px] font-bold tracking-widest text-gray-400 uppercase font-mono px-1">
            <span>FILTER DIRECTORY</span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search categories or filters..."
              className="w-full pl-10 pr-4 py-2 bg-[#1c202f] border border-gray-700/80 rounded-xl focus:ring-2 focus:ring-orange-500 text-white text-xs placeholder-gray-500 focus:outline-none"
            />
          </div>
        </div>

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
            {categories.filter(cat => cat.name.toLowerCase().includes(searchTerm.toLowerCase())).map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.name;
              const count = category.name === 'All' ? (tools && tools.length > 0 ? tools.length : toolsCount) : (categoryStats[category.name.trim().toLowerCase()] || category.count || 0);
              
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
                      {count}
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