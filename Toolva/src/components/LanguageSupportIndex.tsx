import React, { useState } from 'react';
import { Globe, Search, Check, X, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  supportLevel: 'full' | 'partial' | 'basic';
  features: string[];
  tools: string[];
  lastUpdated: string;
}

const languages: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    supportLevel: 'full',
    features: ['Text Generation', 'Translation', 'Sentiment Analysis', 'Named Entity Recognition'],
    tools: ['GPT-4', 'Claude', 'Gemini', 'DALL-E 3'],
    lastUpdated: '2025-01-19'
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    supportLevel: 'full',
    features: ['Text Generation', 'Translation', 'Sentiment Analysis'],
    tools: ['GPT-4', 'Claude', 'Gemini'],
    lastUpdated: '2025-01-19'
  },
  // Add more languages...
];

const LanguageSupportIndex = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [filter, setFilter] = useState<'all' | 'full' | 'partial' | 'basic'>('all');

  const filteredLanguages = languages.filter(lang => {
    const matchesSearch = 
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || lang.supportLevel === filter;
    return matchesSearch && matchesFilter;
  });

  const getSupportLevelColor = (level: string) => {
    switch (level) {
      case 'full':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'partial':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'basic':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Language Support Index
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Explore AI tool support across different languages
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Search and Filters */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-20">
            <div className="relative mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search languages..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            <div className="space-y-2">
              {(['all', 'full', 'partial', 'basic'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setFilter(level)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    filter === level
                      ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)} Support
                </button>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-blue-500 mt-1 mr-2" />
                <div>
                  <h4 className="font-medium text-blue-700 dark:text-blue-300">
                    Support Levels
                  </h4>
                  <ul className="mt-2 space-y-2 text-sm text-blue-600 dark:text-blue-400">
                    <li>Full - Complete feature support</li>
                    <li>Partial - Most features supported</li>
                    <li>Basic - Limited feature support</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Language List and Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLanguages.map((language, index) => (
              <motion.div
                key={language.code}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => setSelectedLanguage(language)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {language.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {language.nativeName}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    getSupportLevelColor(language.supportLevel)
                  }`}>
                    {language.supportLevel.charAt(0).toUpperCase() + language.supportLevel.slice(1)}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Supported Features
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {language.features.slice(0, 3).map((feature, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs"
                        >
                          {feature}
                        </span>
                      ))}
                      {language.features.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs">
                          +{language.features.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Compatible Tools
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {language.tools.slice(0, 2).map((tool, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-xs"
                        >
                          {tool}
                        </span>
                      ))}
                      {language.tools.length > 2 && (
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-xs">
                          +{language.tools.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Last updated: {new Date(language.lastUpdated).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {selectedLanguage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedLanguage.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedLanguage.nativeName}
                  </p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                  getSupportLevelColor(selectedLanguage.supportLevel)
                }`}>
                  {selectedLanguage.supportLevel.charAt(0).toUpperCase() + selectedLanguage.supportLevel.slice(1)} Support
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Supported Features
                  </h4>
                  <ul className="space-y-2">
                    {selectedLanguage.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center text-gray-700 dark:text-gray-300"
                      >
                        <Check className="w-5 h-5 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Compatible Tools
                  </h4>
                  <div className="space-y-3">
                    {selectedLanguage.tools.map((tool, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <span className="text-gray-700 dark:text-gray-300">
                          {tool}
                        </span>
                        <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                          View Details
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LanguageSupportIndex;