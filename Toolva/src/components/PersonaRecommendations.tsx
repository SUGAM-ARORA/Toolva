import React, { useState, useEffect } from 'react';
import { User, Code, Briefcase, Palette, PenTool, Camera, Brain, Sparkles, Star, ArrowRight, Users, Clock, Zap, Target, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { AITool } from '../types';
import LoadingSpinner from './LoadingSpinner';
import toast from 'react-hot-toast';

const personas = [
  {
    id: 'developer',
    name: 'Developer',
    icon: Code,
    categories: ['Code', 'APIs', 'DevOps'],
    description: 'Tools for coding, development, and deployment',
    color: 'from-blue-500 to-indigo-600',
    stats: { users: '2.5M+', tools: '45+', satisfaction: '94%' }
  },
  {
    id: 'designer',
    name: 'Designer',
    icon: Palette,
    categories: ['Design', 'Image Generation'],
    description: 'Creative and design-focused AI tools',
    color: 'from-purple-500 to-pink-600',
    stats: { users: '1.8M+', tools: '32+', satisfaction: '96%' }
  },
  {
    id: 'content',
    name: 'Content Creator',
    icon: PenTool,
    categories: ['Writing', 'Content Creation'],
    description: 'Tools for content creation and management',
    color: 'from-green-500 to-emerald-600',
    stats: { users: '3.2M+', tools: '38+', satisfaction: '92%' }
  },
  {
    id: 'business',
    name: 'Business Owner',
    icon: Briefcase,
    categories: ['Business', 'Marketing', 'Analytics'],
    description: 'Business automation and analytics tools',
    color: 'from-orange-500 to-red-600',
    stats: { users: '1.5M+', tools: '28+', satisfaction: '89%' }
  },
  {
    id: 'photographer',
    name: 'Photographer',
    icon: Camera,
    categories: ['Image Generation', 'Design'],
    description: 'Photography and image editing tools',
    color: 'from-cyan-500 to-blue-600',
    stats: { users: '950K+', tools: '22+', satisfaction: '91%' }
  },
  {
    id: 'researcher',
    name: 'Researcher',
    icon: Brain,
    categories: ['Research', 'Analytics'],
    description: 'Research and data analysis tools',
    color: 'from-violet-500 to-purple-600',
    stats: { users: '680K+', tools: '19+', satisfaction: '93%' }
  }
];

interface PersonaRecommendationsProps {
  tools: AITool[];
}

const PersonaRecommendations: React.FC<PersonaRecommendationsProps> = ({ tools }) => {
  const [selectedPersona, setSelectedPersona] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<AITool[]>([]);
  const [showPersonaDetails, setShowPersonaDetails] = useState(false);
  
  const handlePersonaSelect = async (personaId: string) => {
    setIsLoading(true);
    setSelectedPersona(personaId);
    setShowPersonaDetails(true);

    try {
      const persona = personas.find(p => p.id === personaId);
      if (!persona) {
        setIsLoading(false);
        return;
      }

      // Filter tools based on persona categories
      const filteredTools = tools.filter(tool => 
        persona.categories.some(category => 
          tool.category.toLowerCase().includes(category.toLowerCase())
        )
      );

      // Sort by rating and take top 6
      const sortedTools = filteredTools
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 6);

      setRecommendations(sortedTools);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast.error('Failed to load recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedPersonaData = personas.find(p => p.id === selectedPersona);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full mb-6"
        >
          <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
          <span className="text-blue-600 dark:text-blue-400 font-medium">AI-Powered Recommendations</span>
        </motion.div>
        
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
          className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
        >
          Get personalized tool recommendations based on your role and workflow needs
        </motion.p>
      </div>

      {!showPersonaDetails ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {personas.map((persona, index) => {
            const Icon = persona.icon;
            
            return (
              <motion.div
                key={persona.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePersonaSelect(persona.id)}
                className={`relative overflow-hidden rounded-2xl cursor-pointer group`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${persona.color} opacity-90`} />
                <div className="absolute inset-0 bg-black/20" />
                
                <div className="relative p-8 text-white">
                  <div className="flex items-center mb-6">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                      <Icon className="w-8 h-8" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-bold">{persona.name}</h3>
                      <p className="text-white/80 text-sm">{persona.stats.users} users</p>
                    </div>
                  </div>

                  <p className="text-white/90 mb-6 leading-relaxed">
                    {persona.description}
                  </p>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{persona.stats.tools}</div>
                      <div className="text-xs text-white/70">Tools</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{persona.stats.satisfaction}</div>
                      <div className="text-xs text-white/70">Satisfaction</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{persona.stats.users.split('.')[0]}M+</div>
                      <div className="text-xs text-white/70">Users</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {persona.categories.slice(0, 2).map((category, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 text-xs font-medium bg-white/20 backdrop-blur-sm rounded-full"
                        >
                          {category}
                        </span>
                      ))}
                      {persona.categories.length > 2 && (
                        <span className="px-2 py-1 text-xs font-medium bg-white/20 backdrop-blur-sm rounded-full">
                          +{persona.categories.length - 2}
                        </span>
                      )}
                    </div>
                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* Back Button and Persona Header */}
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => {
                  setShowPersonaDetails(false);
                  setSelectedPersona('');
                  setRecommendations([]);
                }}
                className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowRight className="w-5 h-5 mr-2 transform rotate-180" />
                Back to Personas
              </button>
              
              {selectedPersonaData && (
                <div className="flex items-center">
                  <div className={`p-3 bg-gradient-to-br ${selectedPersonaData.color} rounded-xl text-white mr-4`}>
                    <selectedPersonaData.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedPersonaData.name} Tools
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Curated for your workflow
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Recommendations */}
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((tool, index) => (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                  >
                    <div className="relative h-48">
                      <img
                        src={tool.image}
                        alt={tool.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h4 className="text-lg font-semibold text-white mb-1">
                          {tool.name}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 text-xs font-medium bg-white/20 backdrop-blur-sm rounded-full text-white">
                            {tool.category}
                          </span>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 mr-1" />
                            <span className="text-sm font-medium text-white">
                              {tool.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                        {tool.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {tool.pricing}
                        </span>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 text-gray-400 mr-1" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {tool.dailyUsers}
                          </span>
                        </div>
                      </div>
                      
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
                      >
                        Try Now
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {recommendations.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  No tools found for this persona
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Try selecting a different persona or check back later for new tools.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default PersonaRecommendations;