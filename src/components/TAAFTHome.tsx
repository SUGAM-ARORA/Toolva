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
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ModelBreakdownModal from './ModelBreakdownModal';

import { getUserExpertise, recordToolOpen, ExpertiseProgress, getCurrentUser, isUserSuperAdmin } from '../lib/auth';

interface TAAFTHomeProps {
  tools: AITool[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onToolSelect: (tool: AITool) => void;
  onToggleFavorite: (toolId: string) => void;
  favorites: string[];
  onOpenSidebar: () => void;
  onOpenSubmit: () => void;
  onViewChange?: (view: string) => void;
  isAuthenticated?: boolean;
  onOpenAuth?: () => void;
}

type TabType = 'home' | 'justLaunched' | 'forYou' | 'topRated' | 'free';
type SortOption = 'alphabetical' | 'popular' | 'rating' | 'bookmarked' | 'clicks' | 'recent';
type ViewLayoutMode = 'grid' | 'list' | 'table';

const TAAFTHome: React.FC<TAAFTHomeProps> = ({
  tools,
  selectedCategory,
  onCategorySelect,
  searchQuery,
  onSearchChange,
  onToolSelect,
  onToggleFavorite,
  favorites,
  onOpenSidebar,
  onOpenSubmit,
  onViewChange,
  isAuthenticated = false,
  onOpenAuth
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [showClaudeBreakdown, setShowClaudeBreakdown] = useState(false);
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
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] text-gray-900 dark:text-white flex flex-col md:flex-row relative selection:bg-orange-500 selection:text-white font-sans">
      
      {/* Left Vertical Navigation Mini-Bar (Desktop) */}
      <aside className="hidden md:flex flex-col items-center justify-between w-14 bg-white dark:bg-[#141721] border-r border-gray-200 dark:border-gray-800/80 py-6 fixed left-0 top-0 bottom-0 z-30 shadow-2xl">
        <div className="flex flex-col items-center space-y-6">
          <button 
            onClick={() => { setActiveTab('home'); onCategorySelect('All'); }}
            className="p-2.5 rounded-xl bg-white text-gray-950 shadow-md hover:scale-110 transition-all"
            title="Home"
          >
            <HomeIcon className="w-5 h-5" />
          </button>
          
          <button 
            onClick={onOpenSidebar}
            className="p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-all"
            title="Browse Categories & Filters"
          >
            <Compass className="w-5 h-5" />
          </button>

          <button 
            onClick={() => setActiveTab('topRated')}
            className="p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-all"
            title="Top Rated Tools"
          >
            <Trophy className="w-5 h-5" />
          </button>

          <button 
            onClick={() => setActiveTab('forYou')}
            className="p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-all relative"
            title="For You"
          >
            <Users className="w-5 h-5" />
          </button>

          <button 
            onClick={onOpenSubmit}
            className="p-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/20 hover:scale-110 transition-all"
            title="Submit an AI Tool"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col items-center space-y-3">
          {isUserSuperAdmin(getCurrentUser()) && (
            <>
              <Link 
                to="/users" 
                className="p-2 text-purple-400 hover:text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 rounded-xl border border-purple-500/30 transition-all hover:scale-110 shadow-md" 
                title="User Management (SuperAdmin)"
              >
                <Users className="w-5 h-5 text-purple-400" />
              </Link>

              <Link 
                to="/activity" 
                className="p-2 text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-xl border border-emerald-500/30 transition-all hover:scale-110 shadow-md" 
                title="Activity Logs Tracker (SuperAdmin)"
              >
                <Activity className="w-5 h-5 text-emerald-400" />
              </Link>

              <button 
                onClick={() => onViewChange('admin')} 
                className="p-2 text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 rounded-xl border border-amber-500/30 transition-all hover:scale-110 shadow-md" 
                title="Admin Control Panel (SuperAdmin)"
              >
                <Crown className="w-5 h-5 text-amber-400" />
              </button>
            </>
          )}

          <Link to="/help" className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 transition-colors" title="Help & FAQ">
            <HelpCircle className="w-5 h-5" />
          </Link>
          <Link to="/contact" className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 transition-colors" title="Contact Us">
            <Mail className="w-5 h-5" />
          </Link>
          <Link to="/settings" className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 transition-colors" title="Settings">
            <Settings className="w-5 h-5" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:pl-14 pt-4 pb-24 overflow-x-hidden">
        <div className="space-y-8 pb-16">
          {/* Hero Section */}
          <div className="relative pt-6 pb-4 sm:pt-10 sm:pb-8 text-center px-4 overflow-hidden">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 dark:text-white max-w-4xl mx-auto leading-tight sm:leading-none">
              THERE'S AN AI FOR THAT<span className="text-orange-500 font-normal text-2xl sm:text-4xl align-super">®</span>
            </h1>

            <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              <span className="font-bold text-orange-500">{totalToolsCount} AIs</span> across <span className="font-bold text-blue-500">{categoriesCount} categories</span>.
            </p>

            {spotlightTool && (
              <div className="mt-3 flex items-center justify-center">
                <button
                  onClick={() => handleSelectTool(spotlightTool)}
                  className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white dark:bg-[#141721] border border-gray-200 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-300 hover:border-orange-500/50 shadow-sm transition-all"
                >
                  <span className="text-gray-400">Spotlight:</span>
                  <span className="font-bold text-orange-500">{spotlightTool.name}</span>
                  <span className="text-gray-500">({spotlightTool.category})</span>
                  <ArrowRight className="w-3.5 h-3.5 text-orange-500" />
                </button>
              </div>
            )}

            {/* Global Hero Search Bar with Instant Clear Cross Button */}
            <div className="max-w-2xl mx-auto mt-6">
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
                    className="w-full pl-12 pr-28 py-3.5 sm:py-4 bg-white dark:bg-[#141721] text-gray-900 dark:text-white rounded-2xl border border-gray-200 dark:border-gray-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm sm:text-base shadow-xl transition-all"
                  />
                  
                  {/* Clear button (X) when search query is present */}
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
                    className="absolute right-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>

            {/* Anthropic Claude Breakdown Alert Card */}
            {isClaudeSearch && (
              <div className="max-w-4xl mx-auto px-4 mt-6">
                <div className="bg-gradient-to-r from-orange-500/10 via-purple-500/10 to-blue-500/10 p-4 rounded-2xl border border-orange-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                        Anthropic Claude AI Model Suite
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Compare Why, When, How, Where & Which model is best for your task.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowClaudeBreakdown(true)}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0"
                  >
                    <Info className="w-4 h-4" />
                    <span>View Model Breakdown</span>
                  </button>
                </div>
              </div>
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
              onClick={onOpenSidebar}
              className="px-4 py-2 rounded-full text-xs sm:text-sm font-semibold bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 transition-all flex items-center space-x-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>All Categories ({categoriesCount})</span>
            </button>
          </div>

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
                  <span className="bg-orange-500/20 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-full font-bold border border-orange-500/30">
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
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white underline"
              >
                Clear filters ({filteredTools.length} found)
              </button>
            </div>
          )}

          {/* Single Unified Directory Grid with View Layout Controls */}
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            {filteredTools.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-[#141721] rounded-2xl border border-gray-200 dark:border-gray-800">
                <Compass className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3 animate-spin" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-300">No AI tools matched your search</h3>
                <p className="text-sm text-gray-500 mt-1">Try searching a different keyword or category.</p>
                <button
                  onClick={() => { onCategorySelect('All'); setLocalSearch(''); onSearchChange(''); }}
                  className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-all"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-left">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-200 dark:border-gray-800/80 pb-3 gap-3">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-orange-500" />
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
                        className={`p-1.5 rounded-lg text-xs transition-all ${
                          viewLayout === 'grid' 
                            ? 'bg-orange-500 text-white font-bold shadow-md' 
                            : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                        }`}
                        title="Large Card Grid View"
                      >
                        <LayoutGrid className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setViewLayout('list')}
                        className={`p-1.5 rounded-lg text-xs transition-all ${
                          viewLayout === 'list' 
                            ? 'bg-orange-500 text-white font-bold shadow-md' 
                            : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                        }`}
                        title="Detailed Row List View"
                      >
                        <List className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setViewLayout('table')}
                        className={`p-1.5 rounded-lg text-xs transition-all ${
                          viewLayout === 'table' 
                            ? 'bg-orange-500 text-white font-bold shadow-md' 
                            : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                        }`}
                        title="Compact Explorer Table View"
                      >
                        <TableIcon className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Interactive Sort Dropdown Selector */}
                    <div className="flex items-center space-x-1.5 bg-white dark:bg-[#181b28] border border-gray-300 dark:border-gray-700/80 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 shadow-sm">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-orange-500" />
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
                      <TAAFTCard
                        key={tool.id || `tool-${idx}`}
                        tool={tool}
                        badge={tool.featured ? "Featured" : "Verified"}
                        badgeColor={tool.featured ? "bg-amber-500" : "bg-blue-600"}
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
                        className="p-4 rounded-2xl bg-white dark:bg-[#141721] border border-gray-200 dark:border-gray-800 hover:border-orange-500/50 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
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
                              <h3 className="font-bold text-base text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors">
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
                            className={`p-2 rounded-xl transition-colors ${
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
                  <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#141721] shadow-xl">
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
                            className="hover:bg-orange-500/5 transition-colors cursor-pointer group"
                          >
                            <td className="py-3 px-4 flex items-center space-x-3">
                              <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-gray-900 dark:text-white overflow-hidden shrink-0">
                                {tool.image ? (
                                  <img src={tool.image} alt={tool.name} className="w-full h-full object-cover" />
                                ) : (
                                  <span>{tool.name.substring(0, 1)}</span>
                                )}
                              </div>
                              <span className="font-bold text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors">
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
                                className="px-3 py-1 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition-all inline-flex items-center space-x-1"
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
                  <div className="mt-8 p-8 rounded-3xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-purple-500/10 border border-orange-500/30 text-center space-y-4 shadow-lg backdrop-blur-md">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-orange-500 text-white flex items-center justify-center font-bold text-2xl shadow-md">
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
                      className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all"
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

// Sub-Component: Larger, Impressive TAAFT Tool Card
interface TAAFTCardProps {
  tool: AITool;
  badge: string;
  badgeColor: string;
  isFavorite: boolean;
  onSelect: () => void;
  onToggleFavorite: () => void;
}

const TAAFTCard: React.FC<TAAFTCardProps> = ({
  tool,
  badge,
  badgeColor,
  isFavorite,
  onSelect,
  onToggleFavorite
}) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-[#141721] border border-gray-200 dark:border-gray-800 hover:border-orange-500/50 rounded-3xl p-5 sm:p-6 flex flex-col justify-between shadow-md hover:shadow-2xl transition-all cursor-pointer group relative overflow-hidden"
      onClick={onSelect}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-all pointer-events-none" />

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
                <h3 className="font-black text-gray-900 dark:text-white text-base group-hover:text-orange-500 transition-colors line-clamp-1">
                  {tool.name}
                </h3>
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
              </div>
              <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 text-[10px] font-mono">
                {tool.category}
              </span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className={`p-2 rounded-xl transition-colors ${
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

        {/* Pricing & Rating Footer */}
        <div className="flex items-center justify-between text-xs pt-3 border-t border-gray-100 dark:border-gray-800/80">
          <span className="px-3 py-1 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 font-mono text-xs font-bold border border-orange-500/20">
            {tool.pricing || 'Free'}
          </span>

          <div className="flex items-center space-x-3">
            <span className="flex items-center text-amber-500 font-bold text-xs">
              <Star className="w-4 h-4 fill-current mr-1" />
              {tool.rating ? tool.rating.toFixed(1) : '4.5'}
            </span>

            <span className="text-orange-500 font-bold group-hover:translate-x-1 transition-transform flex items-center">
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TAAFTHome;
