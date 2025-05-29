import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowRight, Calendar, Bookmark, Share2 } from 'lucide-react';
import { AITool } from '../types';
import { aiTools } from '../data/aiTools';

const WeeklyRecommendations = () => {
  const [currentWeek] = useState(new Date());
  
  // Simulate curated recommendations
  const weeklyPicks = aiTools
    .filter(tool => tool.rating >= 4.7)
    .slice(0, 6)
    .map(tool => ({
      ...tool,
      curatorNote: `${tool.name} stands out for its exceptional ${tool.category.toLowerCase()} capabilities and user-friendly interface.`
    }));

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          This Week's Top AI Tools
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Hand-picked recommendations by our AI experts for {currentWeek.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {weeklyPicks.map((tool, index) => (
          <motion.div
            key={tool.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="relative h-48">
              <img
                src={tool.image}
                alt={tool.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl font-bold text-white mb-1">
                  {tool.name}
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs text-white">
                    {tool.category}
                  </span>
                  <div className="flex items-center space-x-1 px-2 py-1 bg-white/20 backdrop-blur-md rounded-full">
                    <Star className="h-3 w-3 text-yellow-400" />
                    <span className="text-xs font-medium text-white">
                      {tool.rating}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                <Calendar className="w-4 h-4 mr-2" />
                Featured this week
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {tool.curatorNote}
              </p>

              <div className="flex items-center justify-between">
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  Try Now
                  <ArrowRight className="w-4 h-4 ml-1" />
                </a>
                <div className="flex space-x-2">
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                    <Bookmark className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                    <Share2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyRecommendations;