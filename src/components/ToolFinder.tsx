import React, { useState } from 'react';
import { Search, Wand2 } from 'lucide-react';

interface ToolFinderProps {
  tools: any[];
  onToolSelect: (tool: any) => void;
}

export default function ToolFinder({ tools, onToolSelect }: ToolFinderProps) {
  const [task, setTask] = useState('');
  const [suggestedTools, setSuggestedTools] = useState<any[]>([]);

  const taskCategories = {
    'image': ['create image', 'generate art', 'edit photo', 'design'],
    'writing': ['write article', 'blog post', 'content', 'copywriting'],
    'code': ['programming', 'coding', 'development', 'software'],
    'chat': ['conversation', 'question', 'answer', 'chat'],
    'video': ['create video', 'edit video', 'animation'],
    'music': ['create music', 'generate audio', 'sound'],
    'education': ['learn', 'study', 'teach', 'education']
  };

  const findRelevantTools = (input: string) => {
    const inputLower = input.toLowerCase();
    let category = '';

    // Determine category based on input
    for (const [cat, keywords] of Object.entries(taskCategories)) {
      if (keywords.some(keyword => inputLower.includes(keyword))) {
        category = cat;
        break;
      }
    }

    // Filter tools based on category
    let relevantTools = tools;
    if (category === 'image') {
      relevantTools = tools.filter(tool => tool.category === 'Image Generation');
    } else if (category === 'writing') {
      relevantTools = tools.filter(tool => tool.category === 'Writing');
    } else if (category === 'code') {
      relevantTools = tools.filter(tool => tool.category === 'Code');
    } else if (category === 'chat') {
      relevantTools = tools.filter(tool => tool.category === 'Chatbots');
    } else if (category === 'video') {
      relevantTools = tools.filter(tool => tool.category === 'Video');
    } else if (category === 'music') {
      relevantTools = tools.filter(tool => tool.category === 'Music');
    } else if (category === 'education') {
      relevantTools = tools.filter(tool => tool.category === 'Education');
    }

    // Sort by rating
    return relevantTools.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  };

  const handleSearch = () => {
    const results = findRelevantTools(task);
    setSuggestedTools(results);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-dark-200 rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Find the Perfect AI Tool</h2>
        
        <div className="flex gap-4 mb-8">
          <div className="flex-1">
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Describe what you want to do... (e.g., 'create an image of a sunset')"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-dark-400 focus:ring-2 focus:ring-primary-500 dark:bg-dark-300 dark:text-white"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
          >
            <Wand2 className="h-5 w-5" />
            Find Tools
          </button>
        </div>

        {suggestedTools.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recommended Tools</h3>
            <div className="grid gap-6 md:grid-cols-2">
              {suggestedTools.map((tool) => (
                <div
                  key={tool.name}
                  className="bg-gray-50 dark:bg-dark-300 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onToolSelect(tool)}
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={tool.image}
                      alt={tool.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{tool.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{tool.description}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-sm font-medium text-primary-600 dark:text-primary-400">{tool.rating} ★</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{tool.pricing}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}