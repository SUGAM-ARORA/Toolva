import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AITool } from '../types';
import { 
  Search, 
  Star, 
  Bookmark, 
  Home as HomeIcon, 
  Compass, 
  Trophy, 
  Users, 
  Plus, 
  Settings, 
  HelpCircle, 
  Mail, 
  Activity,
  Crown,
  SlidersHorizontal,
  ArrowRight,
  Sparkles,
  Gift,
  Flame,
  CheckCircle2,
  BookOpen,
  Filter,
  Brain,
  Workflow,
  GraduationCap,
  Book,
  Zap,
  Info,
  X,
  LayoutGrid,
  List,
  Table as TableIcon,
  ExternalLink,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ModelBreakdownModal from './ModelBreakdownModal';

import { categories } from '../data/categories';
import { getUserExpertise, recordToolOpen, ExpertiseProgress, getCurrentUser, isUserSuperAdmin } from '../lib/auth';

export interface ToolvaHomeProps {
  tools: AITool[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onToolSelect: (tool: AITool) => void;
  onToggleFavorite: (toolId: string) => void;
  favorites: string[];
  onOpenSubmit: () => void;
  onViewChange?: (view: string) => void;
  isAuthenticated?: boolean;
  onOpenAuth?: () => void;
  navItems?: { label: string; icon: any; view: string }[];
  currentView?: string;
}

type TabType = 'home' | 'justLaunched' | 'forYou' | 'topRated' | 'free';
type SortOption = 'alphabetical' | 'popular' | 'rating' | 'bookmarked' | 'clicks' | 'recent';
type ViewLayoutMode = 'grid' | 'list' | 'table';

export const ToolvaHome: React.FC<ToolvaHomeProps> = ({
  tools,
  selectedCategory,
  onCategorySelect,
  searchQuery,
  onSearchChange,
  onToolSelect,
  onToggleFavorite,
  favorites,
  onOpenSubmit,
  onViewChange,
  isAuthenticated = false,
  onOpenAuth,
  navItems = [],
  currentView = 'grid'
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [showClaudeBreakdown, setShowClaudeBreakdown] = useState(false);
  const [showCategoriesTray, setShowCategoriesTray] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('alphabetical');
  const [viewLayout, setViewLayout] = useState<ViewLayoutMode>('grid');
  const [expertise, setExpertise] = useState<ExpertiseProgress>(() => getUserExpertise());

  // Listen to live expertise updates when tools are opened
  React.useEffect(() => {
    const handleExpertiseChange = () => setExpertise(getUserExpertise());
    window.addEventListener('expertise-change', handleExpertiseChange);
    return () => window.removeEventListener('expertise-change', handleExpertiseChange);
  }, []);

  // Dynamic statistics calculated directly from the real tools array
  const totalToolsCount = tools.length;
  const categoriesCount = useMemo(() => new Set(tools.map(t => t.category)).size, [tools]);
  const tasksCount = useMemo(() => new Set(tools.map(t => t.modelType || t.category)).size, [tools]);

  const topRatedCount = useMemo(() => tools.filter(t => (t.rating || 0) >= 4.6).length, [tools]);
  const freeToolsCount = useMemo(() => tools.filter(t => t.pricing?.toLowerCase().includes('free')).length, [tools]);

  // Filter & Sort tools dynamically based on search, category, activeTab, and sortBy
  const filteredTools = useMemo(() => {
    const query = (localSearch || '').toLowerCase();
    const cat = (selectedCategory || 'All').toLowerCase();

    const list = (tools || []).filter(tool => {
      if (!tool) return false;
      const toolName = (tool.name || '').toLowerCase();
      const toolDesc = (tool.description || '').toLowerCase();
      const toolCat = (tool.category || '').toLowerCase();

      const matchesSearch = !query || 
        toolName.includes(query) ||
        toolDesc.includes(query) ||
        toolCat.includes(query);
      
      const matchesCategory = cat === 'all' || toolCat === cat;

      if (!matchesSearch || !matchesCategory) return false;

      if (activeTab === 'justLaunched') {
        return tool.featured || (tool.rating || 0) >= 4.5;
      }
      if (activeTab === 'forYou') {
        // Personalized recommendation feed based on top rated & user activity
        return (tool.rating || 0) >= 4.5 || tool.featured;
      }
      if (activeTab === 'topRated') {
        return (tool.rating || 0) >= 4.6;
      }
      if (activeTab === 'free') {
        const pricingStr = (tool.pricing || '').toLowerCase();
        return pricingStr.includes('free') || pricingStr.includes('no pricing');
      }

      return true;
    });

    return list.sort((a, b) => {
      const nameA = a.name || '';
      const nameB = b.name || '';

      if (sortBy === 'alphabetical') {
        return nameA.localeCompare(nameB, undefined, { sensitivity: 'base', numeric: true });
      }
      if (sortBy === 'popular') {
        const usersA = parseInt((a.dailyUsers || '0').replace(/[^0-9]/g, '')) || 0;
        const usersB = parseInt((b.dailyUsers || '0').replace(/[^0-9]/g, '')) || 0;
        return usersB - usersA || nameA.localeCompare(nameB);
      }
      if (sortBy === 'rating') {
        return (b.rating || 0) - (a.rating || 0) || nameA.localeCompare(nameB);
      }
      if (sortBy === 'bookmarked') {
        const isFavA = favorites.includes(a.id) ? 1 : 0;
        const isFavB = favorites.includes(b.id) ? 1 : 0;
        return isFavB - isFavA || (b.rating || 0) - (a.rating || 0) || nameA.localeCompare(nameB);
      }
      if (sortBy === 'clicks') {
        const easeA = a.easeOfUse || 0;
        const easeB = b.easeOfUse || 0;
        return easeB - easeA || nameA.localeCompare(nameB);
      }
      if (sortBy === 'recent') {
        return (b.lastUpdated || '').localeCompare(a.lastUpdated || '') || nameA.localeCompare(nameB);
      }
      return nameA.localeCompare(nameB, undefined, { sensitivity: 'base', numeric: true });
    });
  }, [tools, localSearch, selectedCategory, activeTab, sortBy, favorites]);

  const isClaudeSearch = (localSearch || '').toLowerCase().includes('claude') || (selectedCategory || '').toLowerCase().includes('claude');

  const spotlightTool = tools && tools.length > 0 ? tools[0] : null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(localSearch);
  };

  const handleSelectTool = (tool: AITool) => {
    recordToolOpen(tool.id);
    if (tool.name.toLowerCase().includes('claude')) {
      setShowClaudeBreakdown(true);
    } else {
      onToolSelect(tool);
    }
  };

  const displayedTools = !isAuthenticated ? filteredTools.slice(0, 8) : filteredTools;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#090d16] text-gray-900 dark:text-white flex flex-col relative selection:bg-cyan-500 selection:text-white font-sans">
      
      {/* Main Content Area - Full width without sidebar drawer */}
      <main className="flex-1 w-full pt-16 pb-24 overflow-x-hidden">
        <div className="space-y-8 pb-16">
          {/* Hero Section - ToolVa Cyan Aesthetic matching Screenshot 2 */}
          <div className="relative pt-8 pb-6 sm:pt-14 sm:pb-10 text-center px-4 overflow-hidden">
            {/* Animated Background Crystalline Cyan & Sky Orbs */}
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
            <div className="absolute top-10 right-1/4 w-64 h-64 bg-sky-500/15 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />
            <div className="absolute -bottom-10 left-1/2 w-96 h-40 bg-blue-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />

            {/* Main Heading & Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative z-10"
            >
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-widest mb-4">
                <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
                <span>ToolVa Griha (गृह) • Autonomous AI Intelligence & Ecosystem</span>
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none mb-3">
                <span className="bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600 bg-clip-text text-transparent">Toolva.ai</span>
                <span className="block text-gray-900 dark:text-white text-3xl sm:text-4xl lg:text-5xl mt-1 font-bold">AI Directory</span>
              </h1>
              <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-medium">
                Discover, Compare, and Scale with Top AI Tools
              </p>

              {/* Action Buttons as shown in Screenshot 2 */}
              <div className="flex items-center justify-center gap-3 mt-4 mb-2">
                <button
                  onClick={() => {
                    const el = document.getElementById('tools-directory-grid');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  Discover
                </button>
                <button
                  onClick={() => onViewChange && onViewChange('planner')}
                  className="px-6 py-2.5 rounded-xl bg-white/90 dark:bg-[#141721] hover:bg-gray-100 dark:hover:bg-[#1c2235] text-gray-800 dark:text-gray-200 text-xs sm:text-sm font-bold border border-gray-200 dark:border-gray-800 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  For Scale
                </button>
              </div>
            </motion.div>

            {/* Animated Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap items-center justify-center gap-3 mt-5 mb-5 relative z-10"
            >
              {[
                { label: `${totalToolsCount} AI Tools`, icon: '🔥', color: 'from-cyan-500/10 to-blue-500/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-400' },
                { label: `${topRatedCount} Top Rated`, icon: '⭐', color: 'from-yellow-500/10 to-amber-500/10 border-yellow-500/30 text-yellow-600 dark:text-yellow-400' },
                { label: `${freeToolsCount} Free Tools`, icon: '🆓', color: 'from-green-500/10 to-emerald-500/10 border-green-500/30 text-green-600 dark:text-green-400' },
                { label: `${categoriesCount} Categories`, icon: '📦', color: 'from-blue-500/10 to-indigo-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400' },
              ].map((stat) => (
                <motion.span
                  key={stat.label}
                  whileHover={{ scale: 1.05 }}
                  className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${stat.color} border text-xs font-bold backdrop-blur-sm`}
                >
                  <span>{stat.icon}</span>
                  <span>{stat.label}</span>
                </motion.span>
              ))}
            </motion.div>

            {/* Spotlight Tool Chip */}
            {spotlightTool && (
              <div className="mt-1 mb-4 flex items-center justify-center relative z-10">
                <button
                  onClick={() => handleSelectTool(spotlightTool)}
                  className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white dark:bg-[#141721] border border-gray-200 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-300 hover:border-cyan-500/50 shadow-sm transition-all"
                >
                  <span className="text-gray-400">Spotlight:</span>
                  <span className="font-bold text-cyan-500">{spotlightTool.name}</span>
                  <span className="text-gray-500">({spotlightTool.category})</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-500" />
                </button>
              </div>
            )}

            {/* Global Hero Search Bar with Instant Clear Cross Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="max-w-2xl mx-auto mt-2 relative z-10"
            >
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="relative flex items-center">
                  <Search className="w-5 h-5 absolute left-4 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    value={localSearch}
                    onChange={(e) => {
                      setLocalSearch(e.target.value);
                      onSearchChange(e.target.value);
                    }}
                    placeholder="Search AI tools by name, description, capability..."
                    className="w-full pl-12 pr-28 py-3.5 sm:py-4 bg-white dark:bg-[#141721] text-gray-900 dark:text-white rounded-2xl border border-gray-200 dark:border-gray-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-sm sm:text-base shadow-xl transition-all"
                  />
                  {localSearch && (
                    <button
                      type="button"
                      onClick={() => {
                        setLocalSearch('');
                        onSearchChange('');
                      }}
                      className="absolute right-24 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      title="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="absolute right-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Search
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Anthropic Claude Breakdown Alert Card */}
            {isClaudeSearch && (
              <div className="max-w-4xl mx-auto px-4 mt-6 relative z-10">
                <div className="bg-gradient-to-r from-cyan-500/10 via-sky-500/10 to-blue-500/10 p-4 rounded-2xl border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white flex items-center justify-center font-bold">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm">Anthropic Claude AI Model Suite</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Compare Why, When, How, Where & Which model is best for your task.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowClaudeBreakdown(true)}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <Info className="w-4 h-4" />
                    <span>View Model Breakdown</span>
                  </button>
                </div>
              </div>
            )}

            {/* Quick Launch Ecosystem Modules Dock */}
            {onViewChange && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="max-w-5xl mx-auto mt-6 px-4 flex items-center justify-center flex-wrap gap-2 relative z-10"
              >
                {[
                  { label: 'Local AI Engine', icon: Cpu, view: 'local-ai', color: 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20' },
                  { label: 'Benchmarks', icon: Zap, view: 'benchmarks', color: 'text-amber-500 border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20' },
                  { label: 'AI Stack Planner', icon: Workflow, view: 'planner', color: 'text-blue-500 border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20' },
                  { label: 'Cost Estimator', icon: Trophy, view: 'estimator', color: 'text-green-500 border-green-500/30 bg-green-500/10 hover:bg-green-500/20' },
                  { label: 'Momentum Index', icon: Flame, view: 'momentum', color: 'text-rose-500 border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20' },
                  { label: 'AI Finder', icon: Search, view: 'finder', color: 'text-purple-500 border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20' },
                  { label: 'Tool Compare', icon: Filter, view: 'compare', color: 'text-indigo-500 border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20' },
                  { label: 'Prompt Studio', icon: Brain, view: 'prompts', color: 'text-cyan-500 border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20' },
                  { label: 'Learning Hub', icon: GraduationCap, view: 'learning', color: 'text-pink-500 border-pink-500/30 bg-pink-500/10 hover:bg-pink-500/20' },
                  { label: 'Submit Tool', icon: Plus, view: 'submit', color: 'text-cyan-500 border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20' },
                ].map((mod) => {
                  const Icon = mod.icon;
                  return (
                    <button
                      key={mod.view}
                      onClick={() => onViewChange(mod.view)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm hover:scale-105 active:scale-95 ${mod.color}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{mod.label}</span>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </div>

          {/* Clean Filter Navigation Tabs */}
          <div className="max-w-4xl mx-auto px-4 my-4 flex items-center justify-center flex-wrap gap-2 sm:gap-3 border-b border-gray-200 dark:border-gray-800/80 pb-6">
            <button
              onClick={() => { setActiveTab('home'); onCategorySelect('All'); }}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === 'home' && selectedCategory === 'All'
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 shadow-lg scale-105 font-bold'
                  : 'bg-gray-100 dark:bg-[#1c202f] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-700/60'
              }`}
            >
              <span>All AI Tools ({totalToolsCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('justLaunched')}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === 'justLaunched'
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 shadow-lg scale-105 font-bold'
                  : 'bg-gray-100 dark:bg-[#1c202f] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-700/60'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span>Just Launched</span>
            </button>

            <button
              onClick={() => setActiveTab('forYou')}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === 'forYou'
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 shadow-lg scale-105 font-bold'
                  : 'bg-gray-100 dark:bg-[#1c202f] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-700/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>For You</span>
              {!expertise.unlockedForYou && (
                <span className="bg-purple-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  🔒 Practitioner
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('topRated')}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === 'topRated'
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 shadow-lg scale-105 font-bold'
                  : 'bg-gray-100 dark:bg-[#1c202f] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-700/60'
              }`}
            >
              <Star className="w-3.5 h-3.5 text-yellow-400" />
              <span>Top Rated ({topRatedCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('free')}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === 'free'
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 shadow-lg scale-105 font-bold'
                  : 'bg-gray-100 dark:bg-[#1c202f] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-700/60'
              }`}
            >
              <Gift className="w-3.5 h-3.5 text-green-400" />
              <span>Free Tools ({freeToolsCount})</span>
            </button>

            <button
              onClick={() => setShowCategoriesTray(!showCategoriesTray)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center space-x-1.5 ${
                showCategoriesTray || selectedCategory !== 'All'
                  ? 'bg-blue-600 text-white shadow-md font-bold'
                  : 'bg-blue-600/20 text-blue-500 dark:text-blue-400 border border-blue-500/30 hover:bg-blue-600/30'
              }`}
              title="Toggle Category Filter"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{selectedCategory !== 'All' ? selectedCategory : `Categories (${categoriesCount})`}</span>
              <span className="text-[10px] ml-0.5">{showCategoriesTray ? '▲' : '▼'}</span>
            </button>
          </div>

          {/* Expandable Categories Tray */}
          {showCategoriesTray && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-5xl mx-auto px-4 -mt-2 mb-6"
            >
              <div className="p-4 sm:p-5 bg-white dark:bg-[#111625] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-500" />
                    <span>Filter By AI Tool Category</span>
                  </span>
                  <div className="flex items-center space-x-3">
                    {selectedCategory !== 'All' && (
                      <button
                        onClick={() => { onCategorySelect('All'); }}
                        className="text-xs text-cyan-500 hover:underline font-semibold cursor-pointer"
                      >
                        Reset to All
                      </button>
                    )}
                    <button
                      onClick={() => setShowCategoriesTray(false)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-white p-1 rounded-lg cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {categories.map((cat) => {
                    const isCatSelected = selectedCategory === cat.name;
                    return (
                      <button
                        key={cat.name}
                        onClick={() => {
                          onCategorySelect(cat.name);
                          setShowCategoriesTray(false);
                        }}
                        className={`p-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                          isCatSelected
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md font-bold'
                            : 'bg-gray-50 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-500 border border-gray-200/80 dark:border-gray-700/60'
                        }`}
                      >
                        <span className="truncate">{cat.name}</span>
                        {cat.count > 0 && (
                          <span className={`text-[10px] ml-1 px-1.5 py-0.2 rounded-full ${isCatSelected ? 'bg-white/20 text-white' : 'text-gray-400'}`}>
                            {cat.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Locked Practitioner Feed Warning Banner */}
          {activeTab === 'forYou' && !expertise.unlockedForYou && (
            <div className="max-w-2xl mx-auto px-4 my-6">
              <div className="p-8 rounded-3xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-blue-500/10 border border-purple-500/30 text-center space-y-4 shadow-lg backdrop-blur-md">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-500 text-white flex items-center justify-center font-bold text-2xl shadow-md">
                  🎯
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                  Unlock Your Customized "For You" Feed
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  The <strong>For You</strong> feed tailors AI tools specifically to your usage patterns. Open <strong>21 AI tools</strong> to achieve <strong>Practitioner</strong> rank and unlock this feed!
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-800 h-3 rounded-full overflow-hidden max-w-xs mx-auto">
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full transition-all" style={{ width: `${expertise.progressPercent}%` }} />
                </div>
                <p className="text-xs font-bold text-purple-600 dark:text-purple-400">
                  Current Rank: {expertise.role} ({expertise.toolsOpenedCount}/21 tools opened)
                </p>
              </div>
            </div>
          )}

          {/* Selected Category / Search Banner */}
          {(selectedCategory !== 'All' || localSearch) && (
            <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-6 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                <span className="text-gray-600 dark:text-gray-500">Showing results for:</span>
                {selectedCategory !== 'All' && (
                  <span className="bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 px-3 py-1 rounded-full font-bold border border-cyan-500/30">
                    {selectedCategory}
                  </span>
                )}
                {localSearch && (
                  <span className="bg-blue-500/20 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full font-bold border border-blue-500/30">
                    "{localSearch}"
                  </span>
                )}
              </div>
              <button
                onClick={() => { onCategorySelect('All'); setLocalSearch(''); onSearchChange(''); }}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 underline cursor-pointer"
              >
                Clear filters ({filteredTools.length} found)
              </button>
            </div>
          )}

          {/* Single Unified Directory Grid with View Layout Controls */}
          <div id="tools-directory-grid" className="max-w-7xl mx-auto px-4 sm:px-8">
            {filteredTools.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-[#111625] rounded-2xl border border-gray-200 dark:border-gray-800">
                <Compass className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3 animate-spin" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-300">No AI tools matched your search</h3>
                <p className="text-sm text-gray-500 mt-1">Try searching a different keyword or category.</p>
                <button
                  onClick={() => { onCategorySelect('All'); setLocalSearch(''); onSearchChange(''); }}
                  className="mt-4 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-sm font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-left">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-200 dark:border-gray-800/80 pb-3 gap-3">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-cyan-500" />
                    <span>
                      {localSearch
                        ? `Search Results`
                        : selectedCategory !== 'All'
                        ? `${selectedCategory} AI Tools`
                        : activeTab === 'forYou'
                        ? `For You Recommendations`
                        : activeTab === 'justLaunched'
                        ? `Just Launched AI Tools`
                        : `AI Tools Directory`}
                    </span>
                  </h2>

                  <div className="flex items-center flex-wrap gap-3">
                    <span className="text-xs text-gray-500 font-mono font-bold">{filteredTools.length} tools listed</span>

                    {/* Windows Explorer Style View Toggle Buttons (Grid / List / Table) */}
                    <div className="flex items-center p-1 bg-gray-100 dark:bg-[#181b28] border border-gray-300 dark:border-gray-700/80 rounded-xl space-x-1">
                      <button
                        onClick={() => setViewLayout('grid')}
                        className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                          viewLayout === 'grid' 
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-md' 
                            : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                        }`}
                        title="Large Card Grid View"
                      >
                        <LayoutGrid className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setViewLayout('list')}
                        className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                          viewLayout === 'list' 
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-md' 
                            : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                        }`}
                        title="Detailed Row List View"
                      >
                        <List className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setViewLayout('table')}
                        className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                          viewLayout === 'table' 
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-md' 
                            : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                        }`}
                        title="Compact Explorer Table View"
                      >
                        <TableIcon className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Interactive Sort Dropdown Selector */}
                    <div className="flex items-center space-x-1.5 bg-white dark:bg-[#181b28] border border-gray-300 dark:border-gray-700/80 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 shadow-sm">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-500" />
                      <span className="text-gray-400 hidden sm:inline">Sort:</span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="bg-transparent text-gray-900 dark:text-white font-bold focus:outline-none cursor-pointer"
                      >
                        <option value="alphabetical" className="bg-white dark:bg-[#181b28]">Alphabetical (A to Z)</option>
                        <option value="popular" className="bg-white dark:bg-[#181b28]">Most Used / Popular</option>
                        <option value="rating" className="bg-white dark:bg-[#181b28]">Highest Ranked ⭐</option>
                        <option value="bookmarked" className="bg-white dark:bg-[#181b28]">Most Bookmarked 🔖</option>
                        <option value="clicks" className="bg-white dark:bg-[#181b28]">Most Visited / Clicked 👁️</option>
                        <option value="recent" className="bg-white dark:bg-[#181b28]">Recently Added ⚡</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Grid Layout View */}
                {viewLayout === 'grid' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {displayedTools.map((tool, idx) => (
                      <ToolvaCard
                        key={tool.id || `tool-${idx}`}
                        tool={tool}
                        badge={tool.featured ? "Featured" : "Verified"}
                        badgeColor={tool.featured ? "bg-cyan-500" : "bg-blue-600"}
                        isFavorite={favorites.includes(tool.id)}
                        onSelect={() => handleSelectTool(tool)}
                        onToggleFavorite={() => onToggleFavorite(tool.id)}
                      />
                    ))}
                  </div>
                )}

                {/* List Layout View */}
                {viewLayout === 'list' && (
                  <div className="space-y-3">
                    {displayedTools.map((tool, idx) => (
                      <div
                        key={tool.id || `tool-list-${idx}`}
                        onClick={() => handleSelectTool(tool)}
                        className="p-4 rounded-2xl bg-white dark:bg-[#111625] border border-gray-200 dark:border-gray-800 hover:border-cyan-500/50 shadow-sm hover:shadow-xl hover:shadow-cyan-500/10 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center font-bold text-gray-900 dark:text-white overflow-hidden shrink-0 shadow-sm">
                            {tool.image ? (
                              <img src={tool.image} alt={tool.name} className="w-full h-full object-cover" />
                            ) : (
                              <span>{tool.name.substring(0, 2).toUpperCase()}</span>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-bold text-base text-gray-900 dark:text-white group-hover:text-cyan-500 transition-colors">
                                {tool.name}
                              </h3>
                              <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 text-[10px] font-mono">
                                {tool.category}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2 max-w-2xl">
                              {tool.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 shrink-0 justify-end border-t md:border-t-0 pt-3 md:pt-0 border-gray-100 dark:border-gray-800">
                          <span className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-mono text-xs font-bold">
                            {tool.pricing || 'Free'}
                          </span>
                          <span className="flex items-center text-amber-500 font-bold text-xs">
                            <Star className="w-4 h-4 fill-current mr-1" />
                            {tool.rating ? tool.rating.toFixed(1) : '4.5'}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleFavorite(tool.id);
                            }}
                            className={`p-2 rounded-xl transition-colors cursor-pointer ${
                              favorites.includes(tool.id)
                                ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                                : 'text-gray-400 hover:text-white hover:bg-gray-800'
                            }`}
                          >
                            <Bookmark className={`w-4 h-4 ${favorites.includes(tool.id) ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Table Layout View (Windows File Explorer Style) */}
                {viewLayout === 'table' && (
                  <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111625] shadow-xl">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#181b28] text-gray-500 uppercase font-mono font-bold">
                          <th className="py-3 px-4">Tool Name</th>
                          <th className="py-3 px-4">Category</th>
                          <th className="py-3 px-4">Pricing</th>
                          <th className="py-3 px-4">Rating</th>
                          <th className="py-3 px-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                        {displayedTools.map((tool, idx) => (
                          <tr
                            key={tool.id || `tool-table-${idx}`}
                            onClick={() => handleSelectTool(tool)}
                            className="hover:bg-cyan-500/5 transition-colors cursor-pointer group"
                          >
                            <td className="py-3 px-4 flex items-center space-x-3">
                              <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-gray-900 dark:text-white overflow-hidden shrink-0">
                                {tool.image ? (
                                  <img src={tool.image} alt={tool.name} className="w-full h-full object-cover" />
                                ) : (
                                  <span>{tool.name.substring(0, 1)}</span>
                                )}
                              </div>
                              <span className="font-bold text-gray-900 dark:text-white group-hover:text-cyan-500 transition-colors">
                                {tool.name}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400 font-mono">
                              {tool.category}
                            </td>
                            <td className="py-3 px-4 font-mono font-semibold text-gray-700 dark:text-gray-300">
                              {tool.pricing || 'Free'}
                            </td>
                            <td className="py-3 px-4 font-mono font-bold text-amber-500 flex items-center">
                              <Star className="w-3.5 h-3.5 fill-current mr-1" />
                              {tool.rating ? tool.rating.toFixed(1) : '4.5'}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectTool(tool);
                                }}
                                className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-bold hover:from-cyan-600 hover:to-blue-700 transition-all inline-flex items-center space-x-1 cursor-pointer shadow-sm"
                              >
                                <span>Visit</span>
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {!isAuthenticated && (
                  <div className="mt-8 p-8 rounded-3xl bg-gradient-to-r from-cyan-500/10 via-sky-500/10 to-blue-500/10 border border-cyan-500/30 text-center space-y-4 shadow-lg backdrop-blur-md">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center font-bold text-2xl shadow-md">
                      🔒
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                      Unlock Full Catalog ({filteredTools.length}+ AI Tools & Workflows)
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                      You are currently viewing a guest preview. Sign in or create a free account to unlock the full catalog of AI tools.
                    </p>
                    <button
                      onClick={onOpenAuth}
                      className="px-8 py-3 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all cursor-pointer"
                    >
                      Sign In / Create Account to Unlock All Tools
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Claude AI Model Suite Breakdown Modal */}
        <AnimatePresence>
          {showClaudeBreakdown && (
            <ModelBreakdownModal onClose={() => setShowClaudeBreakdown(false)} />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

// Sub-Component: Canonical Toolva Directory Card
export interface ToolvaCardProps {
  tool: AITool;
  badge: string;
  badgeColor: string;
  isFavorite: boolean;
  onSelect: () => void;
  onToggleFavorite: () => void;
}

export const ToolvaCard: React.FC<ToolvaCardProps> = ({
  tool,
  isFavorite,
  onSelect,
  onToggleFavorite,
}) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-[#111625] border border-gray-200 dark:border-gray-800 hover:border-cyan-500/50 rounded-3xl p-5 sm:p-6 flex flex-col justify-between shadow-md hover:shadow-2xl hover:shadow-cyan-500/10 transition-all cursor-pointer group relative overflow-hidden"
      onClick={onSelect}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/15 transition-all pointer-events-none" />

      <div className="space-y-4">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center font-black text-gray-900 dark:text-white overflow-hidden shrink-0 shadow-md">
              {tool.image ? (
                <img src={tool.image} alt={tool.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-base">{tool.name.substring(0, 2).toUpperCase()}</span>
              )}
            </div>

            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="font-black text-gray-900 dark:text-white text-base group-hover:text-cyan-500 transition-colors line-clamp-1">
                  {tool.name}
                </h3>
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 text-[10px] font-mono">
                  {tool.category}
                </span>
                {tool.license && (
                  <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 text-[10px] font-semibold border border-purple-500/20">
                    {tool.license}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              isFavorite 
                ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' 
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            title="Bookmark Tool"
          >
            <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
          {tool.description}
        </p>

        {/* Hardware & Spec Micro-Tags */}
        <div className="flex items-center gap-2 pt-1 text-[11px] text-gray-400">
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-gray-100 dark:bg-[#1a1f2e] text-purple-300">
            <Cpu className="w-3 h-3 text-purple-400 mr-1" />
            <span>{tool.minVRAM || '8GB VRAM'}</span>
          </span>
          <span className="text-gray-500">•</span>
          <span>{tool.runsOnCPU ? 'Runs on CPU' : 'GPU Recommended'}</span>
        </div>

        {/* Pricing & Bayesian Rating Footer */}
        <div className="flex items-center justify-between text-xs pt-3 border-t border-gray-100 dark:border-gray-800/80">
          <span className="px-3 py-1 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-mono text-xs font-bold border border-cyan-500/20">
            {tool.pricing || 'Free'}
          </span>

          <div className="flex items-center space-x-3">
            <span className="flex items-center text-amber-500 font-bold text-xs" title="Bayesian Weighted Rating">
              <Star className="w-4 h-4 fill-current mr-1" />
              {tool.rating ? tool.rating.toFixed(1) : '4.5'}
            </span>

            <span className="text-cyan-500 font-bold group-hover:translate-x-1 transition-transform flex items-center">
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ToolvaHome;

