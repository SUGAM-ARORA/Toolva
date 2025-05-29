import React, { useState } from 'react';
import { Search, Book, ArrowRight, Bookmark, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Term {
  term: string;
  definition: string;
  category: string;
  examples: string[];
  relatedTerms: string[];
}

const terms: Term[] = [
  {
    term: 'Large Language Model (LLM)',
    definition: 'An AI model trained on vast amounts of text data to understand and generate human-like text.',
    category: 'Core Concepts',
    examples: ['GPT-4', 'Claude', 'Gemini'],
    relatedTerms: ['Transformer', 'Natural Language Processing', 'Neural Network']
  },
  {
    term: 'Prompt Engineering',
    definition: 'The practice of designing and optimizing input prompts to get desired outputs from AI models.',
    category: 'Techniques',
    examples: ['Chain-of-thought prompting', 'Few-shot learning', 'Zero-shot prompting'],
    relatedTerms: ['Context Window', 'Token', 'Temperature']
  },
  // Add more terms...
];

const AITermsDictionary = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);
  const [savedTerms, setSavedTerms] = useState<string[]>([]);

  const categories = ['All', ...new Set(terms.map(term => term.category))];

  const filteredTerms = terms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         term.definition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleSavedTerm = (term: string) => {
    setSavedTerms(prev => 
      prev.includes(term) 
        ? prev.filter(t => t !== term)
        : [...prev, term]
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          AI Terms Dictionary
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Understand AI terminology with clear explanations and examples
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Search and Categories */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="relative mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search terms..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            <div className="space-y-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Bookmark className="w-5 h-5 mr-2" />
              Saved Terms
            </h3>
            {savedTerms.length > 0 ? (
              <div className="space-y-2">
                {savedTerms.map(term => (
                  <div
                    key={term}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <span className="text-gray-700 dark:text-gray-300">{term}</span>
                    <button
                      onClick={() => toggleSavedTerm(term)}
                      className="text-red-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center">
                No saved terms yet
              </p>
            )}
          </div>
        </div>

        {/* Terms List and Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTerms.map((term, index) => (
                <motion.div
                  key={term.term}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => setSelectedTerm(term)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {term.term}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSavedTerm(term.term);
                      }}
                      className={`p-1 rounded-full ${
                        savedTerms.includes(term.term)
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-400 dark:text-gray-500'
                      }`}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                    {term.definition}
                  </p>
                  <div className="mt-2">
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full">
                      {term.category}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {selectedTerm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {selectedTerm.term}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleSavedTerm(selectedTerm.term)}
                      className={`p-2 rounded-lg ${
                        savedTerms.includes(selectedTerm.term)
                          ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      <Bookmark className="w-5 h-5" />
                    </button>
                    <button
                      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Definition
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      {selectedTerm.definition}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Examples
                    </h4>
                    <ul className="list-disc list-inside space-y-2">
                      {selectedTerm.examples.map((example, index) => (
                        <li
                          key={index}
                          className="text-gray-700 dark:text-gray-300"
                        >
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Related Terms
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTerm.relatedTerms.map((term, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                        >
                          {term}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AITermsDictionary;