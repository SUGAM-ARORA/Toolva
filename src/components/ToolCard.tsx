import React from 'react';
import { Heart, Star, Github } from 'lucide-react';

interface ToolCardProps {
  tool: {
    name: string;
    description: string;
    category: string;
    url: string;
    github?: string;
    image: string;
    pricing: string;
    rating?: number;
    featured?: boolean;
  };
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export default function ToolCard({ tool, isFavorite, onToggleFavorite }: ToolCardProps) {
  return (
    <div className="bg-white dark:bg-dark-200 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all transform hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden">
        <img
          src={tool.image}
          alt={tool.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 flex space-x-2">
          <button
            onClick={onToggleFavorite}
            className={`p-2 rounded-full ${
              isFavorite
                ? 'bg-red-500 text-white'
                : 'bg-white dark:bg-dark-200 text-gray-600 dark:text-gray-300'
            }`}
          >
            <Heart className="h-5 w-5" fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{tool.name}</h3>
          <div className="flex items-center space-x-1">
            <Star className="h-5 w-5 text-yellow-400" fill="currentColor" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{tool.rating}</span>
          </div>
        </div>
        <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-300 rounded-full text-sm">
          {tool.category}
        </span>
        <p className="mt-3 text-gray-600 dark:text-gray-300">{tool.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">{tool.pricing}</span>
          <div className="flex space-x-2">
            {tool.github && (
              <a
                href={tool.github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors flex items-center space-x-2"
              >
                <Github className="h-5 w-5" />
                <span>GitHub</span>
              </a>
            )}
            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Visit Tool
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}