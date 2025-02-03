import React from 'react';
import { Home, Bookmark, Settings, Info, Star, Wand2, BarChart3 } from 'lucide-react';
import { categories } from '../App';

interface SidebarProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onNavigate: (page: string) => void;
}

export default function Sidebar({ selectedCategory, setSelectedCategory, isOpen, setIsOpen, onNavigate }: SidebarProps) {
  const menuItems = [
    { name: 'Home', icon: Home, action: () => onNavigate('home') },
    { name: 'Tool Finder', icon: Wand2, action: () => onNavigate('finder') },
    { name: 'Compare Tools', icon: BarChart3, action: () => onNavigate('compare') },
    { name: 'Favorites', icon: Bookmark, action: () => onNavigate('favorites') },
    { name: 'Featured', icon: Star, action: () => onNavigate('featured') },
    { name: 'Settings', icon: Settings, action: () => onNavigate('settings') },
    { name: 'About', icon: Info, action: () => onNavigate('about') },
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-dark-200 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:w-64 shadow-lg lg:shadow-none`}
    >
      <div className="h-full flex flex-col">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Navigation</h2>
        </div>
        
        <nav className="flex-1 overflow-y-auto">
          <div className="px-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={item.action}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-dark-300 rounded-lg transition-colors"
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-6">
            <h3 className="px-4 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Categories
            </h3>
            <div className="mt-2 px-4 space-y-1">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.name}
                    onClick={() => {
                      setSelectedCategory(category.name);
                      onNavigate('home');
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      selectedCategory === category.name
                        ? 'bg-primary-500 text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-dark-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}