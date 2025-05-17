import React from 'react';
import { Star, Heart, Share2, BookmarkPlus, ExternalLink } from 'lucide-react';
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
    } catch (err) {
      // Fallback for browsers that don't support native sharing
      navigator.clipboard.writeText(tool.url);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden"
    >
      <div className="relative">
        <img
          src={tool.image}
          alt={tool.name}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        <div className="absolute top-4 right-4 flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onFavorite}
            className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Heart
              className={`h-5 w-5 ${
                isFavorited ? 'text-red-500 fill-current' : 'text-gray-400'
              }`}
            />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleShare}
            className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Share2 className="h-5 w-5 text-gray-400" />
          </motion.button>
        </div>
        {tool.featured && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-medium rounded-full">
            Featured
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {tool.name}
          </h3>
          <div className="flex items-center space-x-1 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
            <Star className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {tool.rating}
            </span>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {tool.description}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Category</span>
            <p className="font-medium text-gray-900 dark:text-white">{tool.category}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Pricing</span>
            <p className="font-medium text-gray-900 dark:text-white">{tool.pricing}</p>
          </div>
          {tool.dailyUsers && (
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Daily Users</span>
              <p className="font-medium text-gray-900 dark:text-white">{tool.dailyUsers}</p>
            </div>
          )}
          {tool.modelType && (
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Model Type</span>
              <p className="font-medium text-gray-900 dark:text-white">{tool.modelType}</p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {tool.github && (
            <a
              href={tool.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              <BookmarkPlus className="h-4 w-4 mr-1" />
              View on GitHub
            </a>
          )}
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-colors"
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