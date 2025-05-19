import React, { useState } from 'react';
import { Search, Sparkles, Brain, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

const PromptExplorer = () => {
  const [prompt, setPrompt] = useState('');
  const [suggestions, setSuggestions] = useState([
    {
      title: 'Content Creation',
      prompts: [
        'Write a blog post about AI trends',
        'Create social media captions',
        'Generate product descriptions'
      ]
    },
    {
      title: 'Image Generation',
      prompts: [
        'Create a logo design',
        'Generate product photos',
        'Design marketing materials'
      ]
    },
    {
      title: 'Code Development',
      prompts: [
        'Debug this function',
        'Optimize database queries',
        'Create unit tests'
      ]
    }
  ]);

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle prompt submission
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          What Can I Do With AI Today?
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Explore AI possibilities and find the perfect tools for your tasks
        </p>
      </div>

      <form onSubmit={handlePromptSubmit} className="mb-8">
        <div className="relative">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to achieve..."
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <button
            type="submit"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Sparkles className="w-5 h-5" />
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {suggestions.map((category, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {category.title}
            </h3>
            <div className="space-y-3">
              {category.prompts.map((prompt, promptIndex) => (
                <button
                  key={promptIndex}
                  onClick={() => setPrompt(prompt)}
                  className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PromptExplorer;