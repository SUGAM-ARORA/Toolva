import React from 'react';
import { Star, Heart, Share2, BookmarkPlus, ExternalLink, Zap, Users, Clock, Code } from 'lucide-react';
import { AITool } from '../types';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface ToolCardProps {
  tool: AITool;
  onFavorite: () => void;
  isFavorited: boolean;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, onFavorite, isFavorited }) => {
  const handleShare = async () => {
    try {
      await navigator.share({
        title: tool.name,
        text: tool.description,
        url: tool.url
      });
    } catch {
      navigator.clipboard.writeText(tool.url);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <motion.img
          src={tool.image}
          alt={tool.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onFavorite}
            className="p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors"
          >
            <Heart
              className={`h-5 w-5 ${
                isFavorited ? 'text-red-500 fill-current' : 'text-white'
              }`}
            />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleShare}
            className="p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors"
          >
            <Share2 className="h-5 w-5 text-white" />
          </motion.button>
        </div>

        {/* Featured Badge */}
        {tool.featured && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center space-x-1">
            <Zap className="w-4 h-4 text-white" />
            <span className="text-xs font-medium text-white">Featured</span>
          </div>
        )}

        {/* Tool Name and Category */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">
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

      {/* Content Section */}
      <div className="p-6">
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
          {tool.description}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">{tool.dailyUsers}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-green-500 dark:text-green-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">{tool.modelType}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Code className="w-4 h-4 text-purple-500 dark:text-purple-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {tool.codeQuality ? `${tool.codeQuality}/5` : 'N/A'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {tool.easeOfUse}/5
            </span>
          </div>
        </div>

        {/* Pricing Badge */}
        <div className="mb-6">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 text-blue-700 dark:text-blue-300">
            {tool.pricing}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {tool.github && (
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={tool.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              <BookmarkPlus className="h-4 w-4 mr-2" />
              View on GitHub
            </motion.a>
          )}
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-300 transform"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Try Now
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
};

export default ToolCard;