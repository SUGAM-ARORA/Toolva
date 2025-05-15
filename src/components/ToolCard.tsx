import React from 'react';
import { Star, Heart } from 'lucide-react';
import { AITool } from '../types';
import { motion } from 'framer-motion';

interface ToolCardProps {
  tool: AITool;
  onFavorite: () => void;
  isFavorited: boolean;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, onFavorite, isFavorited }) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden"
    >
      <div className="relative">
        <img
          src={tool.image}
          alt={tool.name}
          className="w-full h-48 object-cover"
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onFavorite}
          className="absolute top-4 right-4 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <Heart
            className={`h-5 w-5 ${
              isFavorited ? 'text-red-500 fill-current' : 'text-gray-400'
            }`}
          />
        </motion.button>
        {tool.featured && (
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-4 left-4 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 text-xs font-medium rounded-full"
          >
            Featured
          </motion.span>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {tool.name}
          </h3>
          {tool.rating && (
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="ml-1 text-sm font-medium text-gray-600 dark:text-gray-300">
                {tool.rating}
              </span>
            </div>
          )}
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

        <div className="space-y-2">
          {tool.github && (
            <a
              href={tool.github}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              GitHub Repository
            </a>
          )}
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Try Now
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
};

export default ToolCard;