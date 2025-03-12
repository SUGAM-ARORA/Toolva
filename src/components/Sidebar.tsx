import React from 'react';
import { Home, Bookmark, Settings, Info, Star, Wand2, BarChart3, X, TrendingUp, Bell, Share2, Download, HelpCircle, Users, Zap, Globe, ChevronRight } from 'lucide-react';
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
    { name: 'Trending', icon: TrendingUp, action: () => onNavigate('trending') },
    { name: 'Favorites', icon: Bookmark, action: () => onNavigate('favorites') },
    { name: 'Featured', icon: Star, action: () => onNavigate('featured') },
    { name: 'News & Updates', icon: Bell, action: () => onNavigate('news') },
    { name: 'Share', icon: Share2, action: () => onNavigate('share') },
    { name: 'Community', icon: Users, action: () => onNavigate('community') },
    { name: 'API Access', icon: Zap, action: () => onNavigate('api') },
    { name: 'Integrations', icon: Globe, action: () => onNavigate('integrations') },
    { name: 'Download App', icon: Download, action: () => onNavigate('download') },
    { name: 'Help & Support', icon: HelpCircle, action: () => onNavigate('help') },
    { name: 'Settings', icon: Settings, action: () => onNavigate('settings') },
    { name: 'About', icon: Info, action: () => onNavigate('about') }
  ];

  const menuSections = [
    {
      title: 'Main',
      items: menuItems.slice(0, 3)
    },
    {
      title: 'Discover',
      items: menuItems.slice(3, 7)
    },
    {
      title: 'Community',
      items: menuItems.slice(7, 10)
    },
    {
      title: 'Resources',
      items: menuItems.slice(10)
    }
  ];

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-white dark:bg-dark-200 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-72 shadow-xl lg:shadow-none overflow-hidden flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b dark:border-dark-400 flex items-center justify-between bg-primary-50 dark:bg-dark-300">
          <h2 className="text-lg font-semibold text-primary-900 dark:text-primary-100">Navigation</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-primary-100 dark:hover:bg-dark-400 text-primary-700 dark:text-primary-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Sidebar Content */}
        <nav className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-8">
            {menuSections.map((section) => (
              <div key={section.title}>
                <h3 className="px-3 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.name}
                        onClick={() => {
                          item.action();
                          setIsOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-dark-300 rounded-lg transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                          <span className="font-medium group-hover:text-primary-600 dark:group-hover:text-primary-400">
                            {item.name}
                          </span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Categories Section */}
            <div>
              <h3 className="px-3 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Categories
              </h3>
              <div className="space-y-1">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.name}
                      onClick={() => {
                        setSelectedCategory(category.name);
                        onNavigate('home');
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors group ${
                        selectedCategory === category.name
                          ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-900 dark:text-primary-100'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-dark-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`h-5 w-5 ${
                          selectedCategory === category.name
                            ? 'text-primary-600 dark:text-primary-400'
                            : 'text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400'
                        }`} />
                        <span className={`font-medium ${
                          selectedCategory === category.name
                            ? 'text-primary-900 dark:text-primary-100'
                            : 'group-hover:text-primary-600 dark:group-hover:text-primary-400'
                        }`}>
                          {category.name}
                        </span>
                      </div>
                      <ChevronRight className={`h-4 w-4 ${
                        selectedCategory === category.name
                          ? 'text-primary-600 dark:text-primary-400'
                          : 'text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 opacity-0 group-hover:opacity-100'
                        } transition-opacity`} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t dark:border-dark-400 bg-primary-50/50 dark:bg-dark-300/50">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>© 2025 ToolVa</span>
            <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400">Terms</a>
            <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400">Privacy</a>
          </div>
        </div>
      </aside>
    </>
  );
}