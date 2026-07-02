import React, { useState } from 'react';
import { Star, Heart, Share2, ExternalLink, Zap, Users, Clock, Code, Shield, Database, GitBranch, Book, Globe } from 'lucide-react';
import { AITool } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface ToolCardProps {
  tool: AITool;
  onFavorite?: () => void;
  isFavorited?: boolean;
}

const ToolCard: React.FC<ToolCardProps> = ({ 
  tool, 
  onFavorite,
  isFavorited = false
}) => {
  const [showDetails, setShowDetails] = useState(false);

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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="h-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Image Section */}
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <motion.img
          src={tool.image}
          alt={tool.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
          {onFavorite && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onFavorite();
              }}
              className="p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors"
            >
              <Heart
                className={`h-5 w-5 ${
                  isFavorited ? 'text-red-500 fill-current' : 'text-white'
                }`}
              />
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleShare();
            }}
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

        {/* Additional Features */}
        <div className="space-y-2 mb-6">
          {tool.github && (
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <GitBranch className="w-4 h-4 mr-2" />
              <span className="text-sm">GitHub Repository Available</span>
            </div>
          )}
          {tool.documentation && (
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Book className="w-4 h-4 mr-2" />
              <span className="text-sm">Documentation Available</span>
            </div>
          )}
          {tool.apiEndpoint && (
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Globe className="w-4 h-4 mr-2" />
              <span className="text-sm">API Access</span>
            </div>
          )}
        </div>

        {/* Tech Stack */}
        {tool.techStack && tool.techStack.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tech Stack</h4>
            <div className="flex flex-wrap gap-2">
              {tool.techStack.map((tech, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

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
              <GitBranch className="h-4 w-4 mr-2" />
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

        {/* Show More/Less Button */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
        >
          {showDetails ? 'Show Less' : 'Show More'}
        </button>

        {/* Additional Details */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              {tool.integrations && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Integrations
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {tool.integrations.map((integration, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full"
                      >
                        {integration}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {tool.pricingDetails && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pricing Details
                  </h4>
                  {tool.pricingDetails.free && (
                    <div className="mb-2">
                      <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Free Plan
                      </h5>
                      <ul className="list-disc list-inside text-sm text-gray-500 dark:text-gray-400">
                        {tool.pricingDetails.free.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {tool.pricingDetails.paid && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Paid Plans
                      </h5>
                      {tool.pricingDetails.paid.plans.map((plan, index) => (
                        <div key={index} className="mb-2">
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {plan.name} - {plan.price}
                          </p>
                          <ul className="list-disc list-inside text-sm text-gray-500 dark:text-gray-400">
                            {plan.features.map((feature, featureIndex) => (
                              <li key={featureIndex}>{feature}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {tool.lastUpdated && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Last Updated: {formatDate(tool.lastUpdated)}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ToolCard;