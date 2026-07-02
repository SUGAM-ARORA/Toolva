import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ExternalLink, Star, ChevronRight, Sparkles } from 'lucide-react';
import { categoryChampions, recommendedTools } from '../data/recommendationData';
import RecommendationCard from './RecommendationCard';

const CategoryChampions: React.FC = () => {
  const [selectedChampion, setSelectedChampion] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const selectedData = selectedChampion
    ? categoryChampions.find(c => c.category === selectedChampion)
    : null;

  const selectedTool = selectedChampion
    ? recommendedTools.find(t => t.isChampion && t.championCategory === selectedChampion)
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm font-semibold mb-4"
        >
          <Trophy className="w-4 h-4" />
          Hall of Champions
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4"
        >
          Best AI Tool in Every{' '}
          <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Category
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 text-lg max-w-2xl mx-auto"
        >
          Market researchers analyzed thousands of tools. These are the undisputed champions — click any to explore.
        </motion.p>
      </div>

      {/* Champions Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 mb-10">
        {categoryChampions.map((champion, index) => (
          <motion.button
            key={champion.category}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.04 }}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() =>
              setSelectedChampion(prev =>
                prev === champion.category ? null : champion.category
              )
            }
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={`relative rounded-2xl p-4 border transition-all duration-300 text-left overflow-hidden group ${
              selectedChampion === champion.category
                ? 'border-yellow-400/60 bg-yellow-500/10 shadow-lg shadow-yellow-500/10'
                : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
            }`}
          >
            {/* Background gradient on hover */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${champion.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}
            />

            <div className="relative">
              <div className="text-2xl mb-2">{champion.icon}</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                {champion.category}
              </div>
              <div className={`text-sm font-bold ${champion.color} leading-tight`}>
                {champion.champion}
              </div>

              {selectedChampion === champion.category && (
                <motion.div
                  layoutId="champion-indicator"
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center"
                  initial={false}
                >
                  <div className="w-2 h-2 rounded-full bg-yellow-900" />
                </motion.div>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Selected Champion Detail */}
      <AnimatePresence>
        {selectedData && (
          <motion.div
            key={selectedData.category}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className={`rounded-3xl border border-white/10 bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl p-6 sm:p-8 mb-8`}>
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Info Side */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${selectedData.gradient} flex items-center justify-center text-3xl shadow-lg`}>
                      {selectedData.icon}
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm font-semibold uppercase tracking-widest">
                        Best in {selectedData.category}
                      </div>
                      <h3 className={`text-2xl sm:text-3xl font-black ${selectedData.color}`}>
                        {selectedData.champion}
                      </h3>
                    </div>
                    <div className="ml-auto">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500/20 border border-yellow-500/30">
                        <Trophy className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 text-sm font-bold">Category Champion</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    {selectedData.reason}
                  </p>

                  {selectedTool && (
                    <>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center gap-1.5">
                          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                          <span className="text-yellow-400 font-bold text-lg">{selectedTool.rating}</span>
                          <span className="text-gray-500">/ 5</span>
                        </div>
                        <div className="w-px h-5 bg-gray-700" />
                        <span className="text-gray-300 font-semibold">{selectedTool.usersCount} users</span>
                        <div className="w-px h-5 bg-gray-700" />
                        <span className="text-gray-300 font-semibold">{selectedTool.pricing}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-6">
                        {selectedTool.strengths.slice(0, 4).map((s, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <Sparkles className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-300 text-sm">{s}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-3">
                        <a
                          href={selectedTool.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r ${selectedData.gradient} text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200`}
                        >
                          Try {selectedData.champion}
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => setSelectedChampion(null)}
                          className="px-5 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 font-semibold transition-all duration-200"
                        >
                          Close
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Card Side */}
                {selectedTool && (
                  <div className="lg:w-72 xl:w-80">
                    <RecommendationCard
                      tool={selectedTool}
                      showScore={false}
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mini Stats Row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4"
      >
        {[
          { label: 'Categories Covered', value: '14+', icon: '📂' },
          { label: 'Tools Evaluated', value: '200+', icon: '🔍' },
          { label: 'Champions Selected', value: categoryChampions.length.toString(), icon: '🏆' },
          { label: 'Updated', value: 'June 2025', icon: '📅' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-white/8 bg-white/4 p-4 text-center"
          >
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-xl font-black text-white">{stat.value}</div>
            <div className="text-gray-500 text-xs">{stat.label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default CategoryChampions;
