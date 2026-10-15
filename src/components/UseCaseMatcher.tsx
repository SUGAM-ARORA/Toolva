import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, X, Zap } from 'lucide-react';
import { useCaseTaxonomy, getToolsByUseCase, UseCase } from '../data/recommendationData';
import RecommendationCard from './RecommendationCard';

const UseCaseMatcher: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedUseCase, setSelectedUseCase] = useState<UseCase | null>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return useCaseTaxonomy;
    const q = query.toLowerCase();
    return useCaseTaxonomy.filter(
      u =>
        u.label.toLowerCase().includes(q) ||
        u.description.toLowerCase().includes(q)
    );
  }, [query]);

  const matchedTools = useMemo(() => {
    if (!selectedUseCase) return [];
    return getToolsByUseCase(selectedUseCase);
  }, [selectedUseCase]);

  const selectedEntry = useCaseTaxonomy.find(u => u.id === selectedUseCase);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-semibold mb-4"
        >
          <Zap className="w-4 h-4" />
          Instant Matcher
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4"
        >
          I want to{' '}
          <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            ...
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 text-lg"
        >
          Select your task — get the top AI tools for it instantly.
        </motion.p>
      </div>

      {/* Search Input */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="relative max-w-xl mx-auto mb-8"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search task... (e.g. logo, music, code, video)"
          className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 text-base focus:outline-none focus:border-cyan-500/50 focus:bg-white/8 transition-all duration-200"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </motion.div>

      {/* Use Case Pills Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 mb-10"
      >
        <AnimatePresence>
          {filtered.map((uc, index) => (
            <motion.button
              key={uc.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: index * 0.02 }}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() =>
                setSelectedUseCase(prev => (prev === uc.id ? null : uc.id))
              }
              className={`relative flex flex-col items-start p-4 rounded-2xl border text-left transition-all duration-200 group
                ${selectedUseCase === uc.id
                  ? 'border-cyan-500/60 bg-cyan-500/10 shadow-lg shadow-cyan-500/10'
                  : 'border-white/8 bg-white/4 hover:border-white/16 hover:bg-white/8'
                }`}
            >
              <span className="text-xl mb-2">{uc.emoji}</span>
              <span className={`text-sm font-bold leading-tight ${selectedUseCase === uc.id ? 'text-cyan-300' : 'text-white'}`}>
                {uc.label}
              </span>
              <span className="text-gray-500 text-xs mt-0.5 line-clamp-1">{uc.description}</span>
              {selectedUseCase === uc.id && (
                <motion.div
                  layoutId="use-case-dot"
                  className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-cyan-400"
                />
              )}
            </motion.button>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full text-center py-12 text-gray-500"
          >
            <p className="text-lg">No tasks found for "{query}"</p>
            <p className="text-sm mt-1">Try broader terms like "design", "code", "video"</p>
          </motion.div>
        )}
      </motion.div>

      {/* Results */}
      <AnimatePresence>
        {selectedEntry && matchedTools.length > 0 && (
          <motion.div
            key={selectedEntry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Best tools for{' '}
                  <span className="text-cyan-400">{selectedEntry.emoji} {selectedEntry.label}</span>
                </h3>
                <p className="text-gray-400 text-sm mt-1">{selectedEntry.description}</p>
              </div>
              <button
                onClick={() => setSelectedUseCase(null)}
                className="flex items-center gap-1.5 text-gray-500 hover:text-white text-sm transition-colors"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            </div>

            {/* Ranked tool cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {matchedTools.map((tool, index) => (
                <RecommendationCard
                  key={tool.id}
                  tool={tool}
                  rank={index + 1}
                  showScore={false}
                  delay={index * 0.08}
                />
              ))}
            </div>

            {/* Pro tip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex items-center gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20"
            >
              <ArrowRight className="w-5 h-5 text-blue-400 flex-shrink-0" />
              <p className="text-blue-300 text-sm">
                <span className="font-bold">Pro tip:</span> Use the{' '}
                <span className="text-white font-semibold">Smart Quiz</span> above to get personalized recommendations based on your experience level and budget too!
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UseCaseMatcher;
