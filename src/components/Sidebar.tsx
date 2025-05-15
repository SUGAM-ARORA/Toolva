import React from 'react';
import { X } from 'lucide-react';
import { ToolCategory } from '../types';
import { aiTools } from '../data/aiTools';

interface SidebarProps {
  categories: ToolCategory[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onPriceFilterChange: (price: string) => void;
  onRatingFilterChange: (rating: number) => void;
  onUserCountFilterChange: (count: string) => void;
  toolCount: number;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  onPriceFilterChange,
  onRatingFilterChange,
  onUserCountFilterChange,
  isOpen = true,
  onClose
}) => {
  const priceOptions = ['Free', 'Paid', 'Open Source'];
  const userCountOptions = ['1K+', '10K+', '100K+', '1M+', '10M+'];
  const ratingOptions = [4, 4.5, 4.8];

  // Calculate actual counts for each category
  const getCategoryCount = (categoryName: string) => {
    if (categoryName === 'All') {
      return aiTools.length;
    }
    return aiTools.filter(tool => tool.category === categoryName).length;
  };

  return (
    <div 
      className={`fixed lg:relative inset-y-0 left-0 z-30 w-64 transform bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="h-full overflow-y-auto">
        {/* Mobile close button */}
        <div className="lg:hidden absolute right-4 top-4">
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Categories
            </h2>
            <div className="space-y-1">
              {categories.map((category) => {
                const Icon = category.icon;
                const actualCount = getCategoryCount(category.name);
                return (
                  <button
                    key={category.name}
                    onClick={() => onCategoryChange(category.name)}
                    className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                      selectedCategory === category.name
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    <span className="flex-1 text-left">{category.name}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {actualCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Price
            </h2>
            <div className="space-y-2">
              {priceOptions.map((price) => (
                <label
                  key={price}
                  className="flex items-center text-sm text-gray-700 dark:text-gray-300"
                >
                  <input
                    type="checkbox"
                    onChange={() => onPriceFilterChange(price)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3">{price}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Minimum Rating
            </h2>
            <div className="space-y-2">
              {ratingOptions.map((rating) => (
                <label
                  key={rating}
                  className="flex items-center text-sm text-gray-700 dark:text-gray-300"
                >
                  <input
                    type="radio"
                    name="rating"
                    onChange={() => onRatingFilterChange(rating)}
                    className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3">★ {rating}+</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Daily Users
            </h2>
            <div className="space-y-2">
              {userCountOptions.map((count) => (
                <label
                  key={count}
                  className="flex items-center text-sm text-gray-700 dark:text-gray-300"
                >
                  <input
                    type="checkbox"
                    onChange={() => onUserCountFilterChange(count)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3">{count}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Total Tools: <span className="font-medium">{aiTools.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;