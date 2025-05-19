import React, { useState } from 'react';
import { User, Code, Briefcase, Palette, PenTool, Camera, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import { aiTools } from '../data/aiTools';

const personas = [
  {
    id: 'developer',
    name: 'Developer',
    icon: Code,
    categories: ['Code', 'APIs', 'DevOps']
  },
  {
    id: 'designer',
    name: 'Designer',
    icon: Palette,
    categories: ['Design', 'Image Generation']
  },
  {
    id: 'writer',
    name: 'Content Creator',
    icon: PenTool,
    categories: ['Writing', 'Content Creation']
  },
  {
    id: 'business',
    name: 'Business Owner',
    icon: Briefcase,
    categories: ['Business', 'Marketing', 'Analytics']
  }
];

const PersonaRecommendations = () => {
  const [selectedPersona, setSelectedPersona] = useState('');
  
  const getRecommendedTools = () => {
    if (!selectedPersona) return [];
    const persona = personas.find(p => p.id === selectedPersona);
    return aiTools.filter(tool => 
      persona?.categories.includes(tool.category)
    ).slice(0, 6);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Find Your Perfect AI Stack
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Get personalized tool recommendations based on your role
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {personas.map((persona) => {
          const Icon = persona.icon;
          return (
            <motion.button
              key={persona.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedPersona(persona.id)}
              className={`p-6 rounded-xl text-center transition-all ${
                selectedPersona === persona.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="w-8 h-8 mx-auto mb-3" />
              <h3 className="font-semibold">{persona.name}</h3>
            </motion.button>
          );
        })}
      </div>

      {selectedPersona && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getRecommendedTools().map((tool, index) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {tool.category}
                  </p>
                </div>
                <div className="flex items-center bg-blue-100 dark:bg-blue-900/20 px-2 py-1 rounded-full">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {tool.rating}
                  </span>
                  <Star className="w-4 h-4 text-blue-600 dark:text-blue-400 ml-1" />
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                {tool.description}
              </p>

              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Now
              </a>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PersonaRecommendations;