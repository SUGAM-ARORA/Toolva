import React from 'react';
import { X } from 'lucide-react';
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full overflow-y-auto bg-white dark:bg-gray-800 shadow-lg"
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Categories</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-4 space-y-2">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <motion.button
              key={category.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onCategoryChange(category.name);
                onClose();
              }}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                selectedCategory === category.name
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              <span className="flex-1 text-left">{category.name}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {category.count}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default Sidebar;