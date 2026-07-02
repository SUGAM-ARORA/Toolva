import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ArrowRight, Calendar, Bookmark, Share2, TrendingUp, Users, Clock, Zap, Target, Award, Filter, Search, Eye, Heart, Download, ExternalLink } from 'lucide-react';
import { AITool } from '../types';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface WeeklyRecommendationsProps {
  tools: AITool[];
}

interface WeeklyPick {
  tool: AITool;
  curatorNote: string;
  weeklyRank: number;
  growthRate: number;
  specialBadge?: string;
  featured: boolean;
}

interface TrendingMetric {
  label: string;
  value: string;
  change: number;
  icon: React.ComponentType<{ className?: string }>;
}

const WeeklyRecommendations: React.FC<WeeklyRecommendationsProps> = ({ tools }) => {
  const [currentWeek] = useState(new Date());
  const [weeklyPicks, setWeeklyPicks] = useState<WeeklyPick[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [trendingMetrics, setTrendingMetrics] = useState<TrendingMetric[]>([]);
  const [userInteractions, setUserInteractions] = useState<Record<string, boolean>>({});

  const categories = ['All', 'Trending', 'New Releases', 'Editor\'s Choice', 'Community Favorites'];

  useEffect(() => {
    generateWeeklyPicks();
    generateTrendingMetrics();
  }, [tools]);

  const generateWeeklyPicks = async () => {
    setIsLoading(true);
    
    // Simulate AI curation process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const picks: WeeklyPick[] = tools
      .filter(tool => tool.rating >= 4.5)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 12)
      .map((tool, index) => ({
        tool,
        curatorNote: generateCuratorNote(tool),
        weeklyRank: index + 1,
        growthRate: Math.floor(Math.random() * 50) + 10,
        specialBadge: getSpecialBadge(tool, index),
        featured: index < 3
      }));

    setWeeklyPicks(picks);
    setIsLoading(false);
  };

  const generateCuratorNote = (tool: AITool): string => {
    const notes = [
      `${tool.name} stands out for its exceptional ${tool.category.toLowerCase()} capabilities and intuitive interface.`,
      `This week, ${tool.name} impressed our team with its innovative approach to ${tool.category.toLowerCase()}.`,
      `${tool.name} continues to lead in ${tool.category.toLowerCase()} with consistent updates and user satisfaction.`,
      `Our community loves ${tool.name} for its reliability and powerful ${tool.category.toLowerCase()} features.`,
      `${tool.name} offers the perfect balance of functionality and ease of use in ${tool.category.toLowerCase()}.`
    ];
    return notes[Math.floor(Math.random() * notes.length)];
  };

  const getSpecialBadge = (tool: AITool, index: number): string | undefined => {
    if (index === 0) return 'Tool of the Week';
    if (index < 3) return 'Editor\'s Choice';
    if (tool.pricing.toLowerCase().includes('free')) return 'Best Free Tool';
    if (parseInt(tool.dailyUsers.replace(/[^0-9]/g, '')) > 100000) return 'Most Popular';
    return undefined;
  };

  const generateTrendingMetrics = () => {
    const metrics: TrendingMetric[] = [
      {
        label: 'Weekly Views',
        value: '2.4M',
        change: 15.3,
        icon: Eye
      },
      {
        label: 'New Users',
        value: '12.8K',
        change: 8.7,
        icon: Users
      },
      {
        label: 'Tool Launches',
        value: '47',
        change: 23.1,
        icon: Zap
      },
      {
        label: 'Avg Rating',
        value: '4.7',
        change: 2.4,
        icon: Star
      }
    ];
    setTrendingMetrics(metrics);
  };

  const handleInteraction = async (toolId: string, type: 'bookmark' | 'like') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to interact with tools');
        return;
      }

      setUserInteractions(prev => ({
        ...prev,
        [`${toolId}_${type}`]: !prev[`${toolId}_${type}`]
      }));

      toast.success(`Tool ${type === 'bookmark' ? 'bookmarked' : 'liked'}!`);
    } catch (error) {
      console.error('Error handling interaction:', error);
      toast.error('Failed to update interaction');
    }
  };

  const shareWeeklyPicks = async () => {
    try {
      await navigator.share({
        title: 'This Week\'s Top AI Tools',
        text: 'Check out the best AI tools curated by experts this week!',
        url: window.location.href
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const filteredPicks = weeklyPicks.filter(pick => {
    const matchesCategory = selectedCategory === 'All' || 
      (selectedCategory === 'Trending' && pick.growthRate > 30) ||
      (selectedCategory === 'New Releases' && pick.weeklyRank <= 5) ||
      (selectedCategory === 'Editor\'s Choice' && pick.specialBadge === 'Editor\'s Choice') ||
      (selectedCategory === 'Community Favorites' && parseInt(pick.tool.dailyUsers.replace(/[^0-9]/g, '')) > 50000);
    
    const matchesSearch = !searchQuery || 
      pick.tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pick.tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-full mb-6"
        >
          <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
          <span className="text-yellow-600 dark:text-yellow-400 font-medium">Weekly Curated Selection</span>
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
        >
          This Week's Top AI Tools
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
        >
          Hand-picked by our AI experts for {currentWeek.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
          })}
        </motion.p>
      </div>

      {/* Trending Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {trendingMetrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{metric.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 dark:text-green-400">
                    +{metric.change}%
                  </span>
                </div>
              </div>
              <metric.icon className="w-8 h-8 text-blue-500 dark:text-blue-400" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full transition-all ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools..."
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as 'grid' | 'list')}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="grid">Grid View</option>
            <option value="list">List View</option>
          </select>

          <button
            onClick={shareWeeklyPicks}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </button>
        </div>
      </div>

      {/* Featured Tools */}
      {filteredPicks.filter(pick => pick.featured).length > 0 && (
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Star className="w-6 h-6 text-yellow-500 mr-2" />
            Featured This Week
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {filteredPicks.filter(pick => pick.featured).map((pick, index) => (
              <motion.div
                key={pick.tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-sm font-bold">
                    #{pick.weeklyRank}
                  </span>
                </div>
                
                <div className="relative h-48">
                  <img
                    src={pick.tool.image}
                    alt={pick.tool.name}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                <div className="p-6 text-white">
                  <h4 className="text-xl font-bold mb-2">{pick.tool.name}</h4>
                  <p className="text-blue-100 mb-4 line-clamp-2">{pick.curatorNote}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="font-medium">{pick.tool.rating}</span>
                      </div>
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                        <span className="text-sm">+{pick.growthRate}%</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleInteraction(pick.tool.id, 'like')}
                        className={`p-2 rounded-full transition-colors ${
                          userInteractions[`${pick.tool.id}_like`]
                            ? 'bg-red-500 text-white'
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleInteraction(pick.tool.id, 'bookmark')}
                        className={`p-2 rounded-full transition-colors ${
                          userInteractions[`${pick.tool.id}_bookmark`]
                            ? 'bg-yellow-500 text-white'
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <a
                    href={pick.tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center py-3 px-4 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                  >
                    Try Now
                    <ExternalLink className="w-4 h-4 inline ml-2" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* All Picks */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            All Weekly Picks ({filteredPicks.length})
          </h3>
          <button
            className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <Download className="w-4 h-4 mr-2" />
            Export List
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
          }>
            <AnimatePresence>
              {filteredPicks.map((pick, index) => (
                <motion.div
                  key={pick.tool.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${
                    viewMode === 'list' ? 'flex items-center p-4' : ''
                  }`}
                >
                  {viewMode === 'grid' ? (
                    <>
                      <div className="relative h-48">
                        <img
                          src={pick.tool.image}
                          alt={pick.tool.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        
                        <div className="absolute top-4 left-4">
                          <span className="px-2 py-1 bg-blue-600 text-white rounded-full text-sm font-bold">
                            #{pick.weeklyRank}
                          </span>
                        </div>

                        {pick.specialBadge && (
                          <div className="absolute top-4 right-4">
                            <span className="px-2 py-1 bg-yellow-500 text-yellow-900 rounded-full text-xs font-medium">
                              {pick.specialBadge}
                            </span>
                          </div>
                        )}

                        <div className="absolute bottom-4 left-4 right-4">
                          <h4 className="text-lg font-bold text-white mb-1">
                            {pick.tool.name}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs text-white">
                              {pick.tool.category}
                            </span>
                            <div className="flex items-center space-x-1 px-2 py-1 bg-white/20 backdrop-blur-md rounded-full">
                              <Star className="h-3 w-3 text-yellow-400" />
                              <span className="text-xs font-medium text-white">
                                {pick.tool.rating}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                          <Calendar className="w-4 h-4 mr-2" />
                          Featured this week
                          <div className="flex items-center ml-auto">
                            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                            <span className="text-green-600 dark:text-green-400">
                              +{pick.growthRate}%
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                          {pick.curatorNote}
                        </p>

                        <div className="flex items-center justify-between">
                          <a
                            href={pick.tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                          >
                            Try Now
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </a>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleInteraction(pick.tool.id, 'bookmark')}
                              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                            >
                              <Bookmark className={`w-4 h-4 ${
                                userInteractions[`${pick.tool.id}_bookmark`]
                                  ? 'text-yellow-500'
                                  : 'text-gray-400'
                              }`} />
                            </button>
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                              <Share2 className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <img
                        src={pick.tool.image}
                        alt={pick.tool.name}
                        className="w-16 h-16 rounded-lg object-cover mr-4"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            #{pick.weeklyRank} {pick.tool.name}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm font-medium">{pick.tool.rating}</span>
                          </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-1">
                          {pick.curatorNote}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {pick.tool.category}
                          </span>
                          <div className="flex items-center text-green-600 dark:text-green-400 text-sm">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            +{pick.growthRate}%
                          </div>
                        </div>
                      </div>
                      <a
                        href={pick.tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Try
                      </a>
                    </>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {filteredPicks.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No tools found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your filters or search terms.
          </p>
        </div>
      )}
    </div>
  );
};

export default WeeklyRecommendations;