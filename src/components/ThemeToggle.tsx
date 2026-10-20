import React from 'react';
import { Sun, Moon, Palette } from 'lucide-react';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, onToggle }) => {
  return (
    <div className="flex items-center bg-gray-100 dark:bg-gray-800/80 p-1 rounded-xl border border-gray-200 dark:border-gray-700/60 shadow-xs">
      <button
        onClick={onToggle}
        className="p-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition-all flex items-center justify-center cursor-pointer"
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {isDark ? (
          <Sun className="h-4 w-4 text-cyan-400 hover:rotate-45 transition-transform" />
        ) : (
          <Moon className="h-4 w-4 text-blue-500 hover:-rotate-12 transition-transform" />
        )}
      </button>
    </div>
  );
};

export default ThemeToggle;