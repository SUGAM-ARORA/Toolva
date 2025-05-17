import React from 'react';
import { X, ChevronRight } from 'lucide-react';
import { ToolCategory } from '../types';
import { motion } from 'framer-motion';

interface SidebarProps {
  categories: ToolCategory[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  onClose
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -300 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="h-full overflow-y-auto bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl"
    >
      <div className="sticky top-0 z-10 backdrop-blur-md bg-gray-900/50">
        <div className="p-4 flex justify-between items-center border-b border-gray-700">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Categories
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-2">
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.name;
          
          return (
            <motion.button
              key={category.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onCategoryChange(category.name);
                onClose();
              }}
              className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${
                isSelected
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'hover:bg-gray-700/50 text-gray-300'
              }`}
            >
              <Icon className={`h-5 w-5 mr-3 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
              <span className="flex-1 text-left font-medium">{category.name}</span>
              <div className="flex items-center">
                <span className={`text-sm ${isSelected ? 'text-white' : 'text-gray-500'}`}>
                  {category.count}
                </span>
                <ChevronRight className={`h-4 w-4 ml-2 ${isSelected ? 'text-white' : 'text-gray-500'}`} />
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="mt-8 p-4 bg-gray-800/50">
        <h3 className="text-sm font-semibold text-gray-400 mb-4">Quick Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-700/50 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-400">{categories.length}</div>
            <div className="text-sm text-gray-400">Categories</div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3">
            <div className="text-2xl font-bold text-purple-400">
              {categories.reduce((acc, cat) => acc + cat.count, 0)}
            </div>
            <div className="text-sm text-gray-400">Total Tools</div>
          </div>
        </div>
      </div>

      {/* Featured Categories */}
      <div className="mt-8 p-4">
        <h3 className="text-sm font-semibold text-gray-400 mb-4">Featured Categories</h3>
        <div className="space-y-2">
          {categories.filter(cat => cat.count > 50).slice(0, 3).map(category => (
            <div key={category.name} className="bg-gray-700/30 rounded-lg p-3">
              <div className="flex items-center">
                <category.icon className="h-4 w-4 text-blue-400 mr-2" />
                <span className="text-sm font-medium text-gray-300">{category.name}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">{category.description}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;