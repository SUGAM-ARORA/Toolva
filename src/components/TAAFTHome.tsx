import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AITool } from '../types';
import { 
  Search, 
  Star, 
  Bookmark, 
  Bell, 
  CheckCircle2, 
  Home as HomeIcon, 
  Compass, 
  Trophy, 
  Users, 
  Plus, 
  Settings, 
  HelpCircle, 
  Mail, 
  SlidersHorizontal,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Zap,
  Gift,
  Code,
  Flame
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
}

type TabType = 'home' | 'forYou' | 'justLaunched' | 'featured' | 'free';

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
  onOpenSubmit
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Filter tools based on search and category
  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesSearch = !localSearch || 
        tool.name.toLowerCase().includes(localSearch.toLowerCase()) ||
        tool.description.toLowerCase().includes(localSearch.toLowerCase()) ||
        tool.category.toLowerCase().includes(localSearch.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || 
        tool.category.toLowerCase() === selectedCategory.toLowerCase();

      if (!matchesSearch || !matchesCategory) return false;

      if (activeTab === 'free') {
        return tool.pricing?.toLowerCase().includes('free') || tool.pricing?.toLowerCase().includes('no pricing');
      }
      return true;
    });
  }, [tools, localSearch, selectedCategory, activeTab]);

  // Divide into Just Launched (left column) and Featured (right column)
  const { justLaunched, featured } = useMemo(() => {
    const list = [...filteredTools];
    const half = Math.ceil(list.length / 2);
    return {
      justLaunched: list.slice(0, half),
      featured: list.slice(half)
    };
  }, [filteredTools]);

  const spotlightTool = tools.length > 0 ? tools[Math.floor(tools.length * 0.1) % tools.length] : null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(localSearch);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] text-gray-900 dark:text-white flex flex-col md:flex-row relative selection:bg-orange-500 selection:text-white font-sans">
      
      {/* ─── Left Vertical Navigation Mini-Bar (Desktop) ─── */}
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
            onClick={() => setActiveTab('featured')}
            className="p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-all"
            title="Featured Tools"
          >
            <Trophy className="w-5 h-5" />
          </button>

          <button 
            onClick={() => setActiveTab('forYou')}
            className="p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-all relative"
            title="For You"
          >
            <Users className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </button>

          <button 
            onClick={onOpenSubmit}
            className="p-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/20 hover:scale-110 transition-all"
            title="Submit an AI Tool"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col items-center space-y-4">
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

      {/* ─── Main Content Area ─── */}
      <main className="flex-1 md:pl-14 pt-4 pb-24 overflow-x-hidden">
        
        {/* Hero Section */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[10px] sm:text-xs font-semibold tracking-widest text-gray-500 uppercase">
              *The Ultimate AI Directory & Aggregator
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-wider text-gray-900 dark:text-white mt-2 font-mono uppercase drop-shadow-md">
              THERE'S AN AI FOR THAT<span className="text-orange-500 text-2xl sm:text-4xl align-top">®</span>
            </h1>
            
            {/* Stats Ticker */}
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium mt-3">
              <span className="text-orange-500 dark:text-orange-400 font-bold">{tools.length.toLocaleString()} AIs</span> for{' '}
              <span className="text-orange-500 dark:text-orange-400 font-bold">📞 154 tasks</span> and{' '}
              <span className="text-orange-500 dark:text-orange-400 font-bold">48 categories</span>.
            </p>

            {/* Spotlight Banner */}
            {spotlightTool && (
              <div className="mt-4 inline-flex items-center space-x-2 bg-gray-100 dark:bg-[#1c202f] border border-gray-300 dark:border-gray-700/80 px-4 py-1.5 rounded-full text-xs sm:text-sm hover:border-orange-500/50 transition-all cursor-pointer shadow-lg"
                   onClick={() => onToolSelect(spotlightTool)}>
                <span className="text-gray-600 dark:text-gray-400">Spotlight:</span>
                <span className="text-orange-500 dark:text-orange-400 font-semibold hover:underline flex items-center">
                  {spotlightTool.name} <span className="text-gray-500 ml-1">({spotlightTool.category})</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 inline" />
                </span>
              </div>
            )}

            {/* Glassmorphic Search Bar */}
            <form onSubmit={handleSearchSubmit} className="mt-6 max-w-2xl mx-auto relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500" />
              
              <div className="relative flex items-center bg-white dark:bg-[#181b28] border border-gray-300 dark:border-gray-700/80 rounded-2xl overflow-hidden shadow-2xl">
                <div className="pl-4 text-gray-500 dark:text-gray-400">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => {
                    setLocalSearch(e.target.value);
                    onSearchChange(e.target.value);
                  }}
                  placeholder="Find AIs using natural language or keywords..."
                  className="w-full bg-transparent px-4 py-4 text-sm sm:text-base text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
                />
                <div className="hidden sm:flex items-center pr-3">
                  <kbd className="px-2 py-1 text-[11px] font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/80 border border-gray-300 dark:border-gray-700 rounded-md">
                    /
                  </kbd>
                </div>
                <button
                  type="submit"
                  className="px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold text-sm transition-all flex items-center space-x-1"
                >
                  <Search className="w-4 h-4 sm:hidden" />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>
            </form>

            <p className="text-[11px] sm:text-xs text-gray-500 mt-2.5">
              #1 AI aggregator. Updated daily. Used by 30M+ developers & creators.
            </p>
          </motion.div>
        </div>

        {/* ─── Pill Navigation Tabs ─── */}
        <div className="max-w-4xl mx-auto px-4 my-4 flex items-center justify-center flex-wrap gap-2 sm:gap-3 border-b border-gray-800/80 pb-6">
          <button
            onClick={() => { setActiveTab('home'); onCategorySelect('All'); }}
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center space-x-1.5 ${
              activeTab === 'home' && selectedCategory === 'All'
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 shadow-lg scale-105 font-bold'
                : 'bg-gray-100 dark:bg-[#1c202f] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-700/60'
            }`}
          >
            <span>Home</span>
          </button>

          <button
            onClick={() => setActiveTab('forYou')}
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center space-x-1.5 ${
              activeTab === 'forYou'
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 shadow-lg scale-105 font-bold'
                : 'bg-gray-100 dark:bg-[#1c202f] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-700/60'
            }`}
          >
            <span>For You</span>
            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold animate-pulse">
              52
            </span>
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
            onClick={() => setActiveTab('featured')}
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center space-x-1.5 ${
              activeTab === 'featured'
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 shadow-lg scale-105 font-bold'
                : 'bg-gray-100 dark:bg-[#1c202f] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-700/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-500 dark:text-yellow-400" />
            <span>Featured</span>
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
            <span>Free Tools</span>
          </button>

          <button
            onClick={onOpenSidebar}
            className="px-4 py-2 rounded-full text-xs sm:text-sm font-semibold bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 transition-all flex items-center space-x-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>All Categories ({tools.length})</span>
          </button>
        </div>

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

        {/* ─── Two-Column Main Grid (Just Launched vs Featured) ─── */}
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              
              {/* Left Column: Just Launched */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800/80 pb-3">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                    <span className="text-gray-400">✈</span>
                    <span>Just Launched</span>
                  </h2>
                  <span className="text-xs text-gray-500 font-mono">{justLaunched.length} tools</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {justLaunched.map((tool, idx) => (
                    <TAAFTCard
                      key={tool.id || `jl-${idx}`}
                      tool={tool}
                      badge="New"
                      badgeColor="bg-red-500"
                      isFavorite={favorites.includes(tool.id)}
                      onSelect={() => onToolSelect(tool)}
                      onToggleFavorite={() => onToggleFavorite(tool.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Right Column: Featured */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800/80 pb-3">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                    <span>Featured</span>
                    <span className="text-orange-500 text-sm align-top">®</span>
                  </h2>
                  <span className="text-xs text-gray-500 font-mono">{featured.length} tools</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {featured.map((tool, idx) => (
                    <TAAFTCard
                      key={tool.id || `ft-${idx}`}
                      tool={tool}
                      badge={idx % 3 === 0 ? "Featured" : "For You"}
                      badgeColor={idx % 3 === 0 ? "bg-blue-600" : "bg-purple-600"}
                      isFavorite={favorites.includes(tool.id)}
                      onSelect={() => onToolSelect(tool)}
                      onToggleFavorite={() => onToggleFavorite(tool.id)}
                    />
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>

      </main>
    </div>
  );
};

// ─── Reusable Sleek TAAFT Card Component ───
interface TAAFTCardProps {
  tool: AITool;
  badge?: string;
  badgeColor?: string;
  isFavorite?: boolean;
  onSelect: () => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
}

const TAAFTCard: React.FC<TAAFTCardProps> = ({
  tool,
  badge = "New",
  badgeColor = "bg-red-500",
  isFavorite = false,
  onSelect,
  onToggleFavorite
}) => {
  const rating = tool.rating || 5.0;
  const bookmarkCount = useMemo(() => {
    return Math.floor((tool.rating || 4.5) * 12) + (tool.name.length % 20);
  }, [tool]);

  return (
    <motion.div
      whileHover={{ y: -4, borderColor: '#f97316' }}
      transition={{ duration: 0.2 }}
      onClick={onSelect}
      className="bg-white dark:bg-[#181b28] border border-gray-200 dark:border-gray-800/90 hover:border-orange-500/60 rounded-2xl p-4 flex flex-col justify-between cursor-pointer group shadow-lg hover:shadow-orange-500/10 transition-all min-h-[145px] relative overflow-hidden"
    >
      {/* Top Row: Pill Badge + Stats */}
      <div className="flex items-center justify-between mb-2.5">
        <span className={`${badgeColor} text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm`}>
          {badge}
        </span>
        <div className="flex items-center space-x-2 text-[11px] text-gray-500 dark:text-gray-400 font-mono">
          <span className="flex items-center text-yellow-500 dark:text-yellow-400 font-bold">
            ★ {rating.toFixed(1)}
          </span>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(e); }}
            className={`hover:text-red-500 dark:hover:text-red-400 transition-colors flex items-center space-x-0.5 ${
              isFavorite ? 'text-red-500 font-bold' : 'text-gray-400 dark:text-gray-500'
            }`}
            title={isFavorite ? "Remove from favorites" : "Save to favorites"}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current text-red-500' : ''}`} />
            <span>{bookmarkCount}</span>
          </button>
        </div>
      </div>

      {/* Middle Row: Avatar + Name + Checkmark + Description */}
      <div className="flex items-start space-x-3 my-1">
        <img
          src={tool.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(tool.name)}&background=272b3f&color=fff&size=80`}
          alt={tool.name}
          className="w-10 h-10 rounded-xl object-cover border border-gray-200 dark:border-gray-700/60 shadow-md shrink-0 bg-gray-100 dark:bg-gray-800"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tool.name)}&background=272b3f&color=fff&size=80`;
          }}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-1.5">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
              {tool.name}
            </h3>
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500/20 shrink-0" title="Verified AI Tool" />
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1 mt-0.5 font-normal">
            {tool.description}
          </p>
        </div>
      </div>

      {/* Bottom Row: Pricing & Category */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200 dark:border-gray-800/60 text-[11px]">
        <span className="text-gray-600 dark:text-gray-400 font-medium truncate max-w-[65%]">
          {tool.pricing || 'Free + Premium'}
        </span>
        <span className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-mono truncate max-w-[35%] bg-gray-100 dark:bg-gray-900/80 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-800">
          {tool.category}
        </span>
      </div>
    </motion.div>
  );
};

export default TAAFTHome;
