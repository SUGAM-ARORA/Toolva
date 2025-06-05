import React, { useState, useEffect } from 'react';
import { User, Code, Briefcase, Palette, PenTool, Camera, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { AITool } from '../types';
import LoadingSpinner from './LoadingSpinner';

const personas = [
  {
    id: 'developer',
    name: 'Developer',
    icon: Code,
    categories: ['Code', 'APIs', 'DevOps'],
    description: 'Tools for coding, development, and deployment'
  },
  {
    id: 'designer',
    name: 'Designer',
    icon: Palette,
    categories: ['Design', 'Image Generation'],
    description: 'Creative and design-focused AI tools'
  },
  {
    id: 'content',
    name: 'Content Creator',
    icon: PenTool,
    categories: ['Writing', 'Content Creation'],
    description: 'Tools for content creation and management'
  },
  {
    id: 'business',
    name: 'Business Owner',
    icon: Briefcase,
    categories: ['Business', 'Marketing', 'Analytics'],
    description: 'Business automation and analytics tools'
  },
  {
    id: 'photographer',
    name: 'Photographer',
    icon: Camera,
    categories: ['Image Generation', 'Design'],
    description: 'Photography and image editing tools'
  },
  {
    id: 'researcher',
    name: 'Researcher',
    icon: Brain,
    categories: ['Research', 'Analytics'],
    description: 'Research and data analysis tools'
  }
];

const PersonaRecommendations = () => {
  const [selectedPersona, setSelectedPersona] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tools, setTools] = useState<AITool[]>([]);
  const [recommendations, setRecommendations] = useState<AITool[]>([]);
  
  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('verified', true);

      if (error) throw error;
      setTools(data);
    } catch (error) {
      console.error('Error fetching tools:', error);
    }
  };

  const handlePersonaSelect = async (personaId: string) => {
    setIsLoading(true);
    setSelectedPersona(personaId);

    try {
      const persona = personas.find(p => p.id === personaId);
      if (!persona) return;

      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .in('category', persona.categories)
        .order('rating', { ascending: false })
        .limit(6);

      if (error) throw error;
      setRecommendations(data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="text-center mb-12">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
        >
          Find Your Perfect AI Stack
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-gray-600 dark:text-gray-400"
        >
          Get personalized tool recommendations based on your role
        </motion.p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {personas.map((persona, index) => {
          const Icon = persona.icon;
          const isSelected = selectedPersona === persona.id;
          
          return (
            <motion.button
              key={persona.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handlePersonaSelect(persona.id)}
              className={`p-6 rounded-xl text-left transition-all ${
                isSelected
                  ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 hover:shadow-md'
              }`}
            >
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-lg ${
                  isSelected 
                    ? 'bg-white/20' 
                    : 'bg-blue-50 dark:bg-gray-700'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    isSelected
                      ? 'text-white'
                      : 'text-blue-500 dark:text-blue-400'
                  }`} />
                </div>
                <h3 className={`ml-3 font-semibold ${
                  isSelected
                    ? 'text-white'
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {persona.name}
                </h3>
              </div>
              <p className={`text-sm ${
                isSelected
                  ? 'text-white/80'
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                {persona.description}
              </p>
            </motion.button>
          );
        })}
      </div>

      {selectedPersona && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Recommended Tools
          </h3>
          
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((tool, index) => (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {tool.name}
                    </h4>
                    <span className="px-3 py-1 text-sm font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full">
                      {tool.category}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {tool.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {tool.pricing}
                    </span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {tool.rating}
                      </span>
                    </div>
                  </div>
                  
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Try Now
                  </a>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default PersonaRecommendations;