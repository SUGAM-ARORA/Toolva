import React, { useState, useEffect } from 'react';
import { Search, X, Plus, ArrowRight, Star, Users, Zap, Shield, Code, Globe, Clock, TrendingUp, BarChart3, Target, Sparkles, Brain, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AITool } from '../types';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface CompareToolsProps {
  tools: AITool[];
}

interface ComparisonMetric {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  type: 'rating' | 'text' | 'number' | 'boolean' | 'array';
  weight: number;
}

interface ComparisonScore {
  toolId: string;
  score: number;
  strengths: string[];
  weaknesses: string[];
}

const CompareTools: React.FC<CompareToolsProps> = ({ tools }) => {
  const [selectedTools, setSelectedTools] = useState<AITool[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [comparisonScores, setComparisonScores] = useState<ComparisonScore[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'detailed' | 'summary' | 'visual'>('detailed');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const comparisonMetrics: ComparisonMetric[] = [
    { key: 'rating', label: 'Overall Rating', icon: Star, type: 'rating', weight: 1.0 },
    { key: 'dailyUsers', label: 'Daily Users', icon: Users, type: 'text', weight: 0.8 },
    { key: 'pricing', label: 'Pricing', icon: Zap, type: 'text', weight: 0.9 },
    { key: 'easeOfUse', label: 'Ease of Use', icon: Target, type: 'rating', weight: 0.9 },
    { key: 'codeQuality', label: 'Code Quality', icon: Code, type: 'rating', weight: 0.7 },
    { key: 'userExperience', label: 'User Experience', icon: Shield, type: 'rating', weight: 0.8 },
    { key: 'modelType', label: 'Model Type', icon: Brain, type: 'text', weight: 0.6 },
    { key: 'category', label: 'Category', icon: Filter, type: 'text', weight: 0.5 },
    { key: 'github', label: 'Open Source', icon: Globe, type: 'boolean', weight: 0.4 },
    { key: 'lastUpdated', label: 'Last Updated', icon: Clock, type: 'text', weight: 0.3 }
  ];

  useEffect(() => {
    setSelectedMetrics(comparisonMetrics.slice(0, 6).map(m => m.key));
  }, []);

  useEffect(() => {
    if (selectedTools.length >= 2) {
      analyzeTools();
    }
  }, [selectedTools, selectedMetrics]);

  const analyzeTools = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const scores = selectedTools.map(tool => {
      let totalScore = 0;
      let totalWeight = 0;
      const strengths: string[] = [];
      const weaknesses: string[] = [];

      selectedMetrics.forEach(metricKey => {
        const metric = comparisonMetrics.find(m => m.key === metricKey);
        if (!metric) return;

        const value = tool[metricKey as keyof AITool];
        let score = 0;

        switch (metric.type) {
          case 'rating':
            score = (parseFloat(value as string) || 0) / 5;
            if (score >= 0.8) strengths.push(metric.label);
            if (score <= 0.4) weaknesses.push(metric.label);
            break;
          case 'text':
            if (metricKey === 'dailyUsers') {
              const users = parseInt((value as string)?.replace(/[^0-9]/g, '') || '0');
              score = Math.min(users / 1000000, 1); // Normalize to 1M users
              if (users >= 100000) strengths.push('High user adoption');
              if (users <= 1000) weaknesses.push('Limited user base');
            } else if (metricKey === 'pricing') {
              score = (value as string)?.toLowerCase().includes('free') ? 1 : 0.5;
              if (score === 1) strengths.push('Free tier available');
            }
            break;
          case 'boolean':
            score = value ? 1 : 0;
            if (value && metricKey === 'github') strengths.push('Open source');
            break;
        }

        totalScore += score * metric.weight;
        totalWeight += metric.weight;
      });

      return {
        toolId: tool.id,
        score: totalWeight > 0 ? totalScore / totalWeight : 0,
        strengths,
        weaknesses
      };
    });

    setComparisonScores(scores);
    generateRecommendations(scores);
    setIsAnalyzing(false);
  };

  const generateRecommendations = (scores: ComparisonScore[]) => {
    const sortedScores = [...scores].sort((a, b) => b.score - a.score);
    const recommendations = [];

    if (sortedScores.length >= 2) {
      const winner = selectedTools.find(t => t.id === sortedScores[0].toolId);
      const runnerUp = selectedTools.find(t => t.id === sortedScores[1].toolId);

      if (winner && runnerUp) {
        recommendations.push({
          type: 'best_overall',
          title: `${winner.name} is the best overall choice`,
          description: `With a score of ${(sortedScores[0].score * 100).toFixed(1)}%, ${winner.name} outperforms other options.`,
          tool: winner
        });

        recommendations.push({
          type: 'alternative',
          title: `Consider ${runnerUp.name} as an alternative`,
          description: `${runnerUp.name} scored ${(sortedScores[1].score * 100).toFixed(1)}% and might be better for specific use cases.`,
          tool: runnerUp
        });
      }
    }

    setRecommendations(recommendations);
  };

  const handleAddTool = (tool: AITool) => {
    if (selectedTools.length < 4 && !selectedTools.find(t => t.id === tool.id)) {
      setSelectedTools([...selectedTools, tool]);
      setSearchQuery('');
      toast.success(`${tool.name} added to comparison`);
    } else if (selectedTools.length >= 4) {
      toast.error('Maximum 4 tools can be compared');
    }
  };

  const handleRemoveTool = (toolId: string) => {
    setSelectedTools(selectedTools.filter(tool => tool.id !== toolId));
    setComparisonScores(comparisonScores.filter(score => score.toolId !== toolId));
  };

  const filteredTools = tools.filter(tool =>
    (tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
    !selectedTools.find(t => t.id === tool.id)
  );

  const getComparisonValue = (tool: AITool, key: string) => {
    const value = tool[key as keyof AITool];
    if (value === undefined || value === null || value === '') {
      return 'N/A';
    }
    if (typeof value === 'boolean') {
      return value ? '✓' : '✗';
    }
    return value;
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 dark:text-green-400';
    if (score >= 0.6) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full mb-6"
        >
          <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
          <span className="text-purple-600 dark:text-purple-400 font-medium">AI-Powered Comparison</span>
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
        >
          Compare AI Tools Side by Side
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
        >
          Get detailed comparisons with AI-powered insights to make the best choice for your needs
        </motion.p>
      </div>

      {/* Selected Tools */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Selected Tools ({selectedTools.length}/4)
          </h3>
          {selectedTools.length >= 2 && (
            <div className="flex space-x-2">
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as any)}
                className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
              >
                <option value="detailed">Detailed View</option>
                <option value="summary">Summary View</option>
                <option value="visual">Visual Comparison</option>
              </select>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {selectedTools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
            >
              <div className="relative h-32">
                <img
                  src={tool.image}
                  alt={tool.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <button
                  onClick={() => handleRemoveTool(tool.id)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 right-2">
                  <h4 className="font-semibold text-white text-sm">{tool.name}</h4>
                  <div className="flex items-center mt-1">
                    <Star className="w-3 h-3 text-yellow-400 mr-1" />
                    <span className="text-xs text-white">{tool.rating}</span>
                  </div>
                </div>
              </div>
              
              {comparisonScores.find(s => s.toolId === tool.id) && (
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Score</span>
                    <span className={`font-bold ${getScoreColor(comparisonScores.find(s => s.toolId === tool.id)?.score || 0)}`}>
                      {((comparisonScores.find(s => s.toolId === tool.id)?.score || 0) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
          
          {selectedTools.length < 4 && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-blue-500 dark:hover:border-blue-400"
              onClick={() => document.getElementById('tool-search')?.focus()}
            >
              <div className="text-center">
                <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Add Tool</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Tool Search */}
      {selectedTools.length < 4 && (
        <div className="mb-8">
          <div className="relative max-w-xl mx-auto">
            <input
              id="tool-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for tools to compare..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          </div>

          {searchQuery && (
            <div className="mt-4 max-h-64 overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              {filteredTools.length > 0 ? (
                filteredTools.slice(0, 10).map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => handleAddTool(tool)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
                  >
                    <img
                      src={tool.image}
                      alt={tool.name}
                      className="w-10 h-10 rounded-lg object-cover mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {tool.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {tool.category} • {tool.rating} ⭐
                      </div>
                    </div>
                    <Plus className="w-5 h-5 text-gray-400" />
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-gray-500 dark:text-gray-400">
                  No matching tools found
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Metric Selection */}
      {selectedTools.length >= 2 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Comparison Metrics
          </h3>
          <div className="flex flex-wrap gap-2">
            {comparisonMetrics.map(metric => {
              const Icon = metric.icon;
              const isSelected = selectedMetrics.includes(metric.key);
              return (
                <motion.button
                  key={metric.key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedMetrics(selectedMetrics.filter(m => m !== metric.key));
                    } else {
                      setSelectedMetrics([...selectedMetrics, metric.key]);
                    }
                  }}
                  className={`flex items-center px-3 py-2 rounded-lg transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {metric.label}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* AI Analysis Loading */}
      {isAnalyzing && (
        <div className="mb-8 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
            <span className="text-blue-600 dark:text-blue-400">Analyzing tools with AI...</span>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
            AI Recommendations
          </h3>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800"
              >
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {rec.title}
                </h4>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  {rec.description}
                </p>
                <div className="flex items-center">
                  <img
                    src={rec.tool.image}
                    alt={rec.tool.name}
                    className="w-8 h-8 rounded-lg object-cover mr-3"
                  />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {rec.tool.name}
                  </span>
                  <ArrowRight className="w-4 h-4 ml-2 text-gray-400" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Comparison Table */}
      {selectedTools.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Metric
                  </th>
                  {selectedTools.map(tool => (
                    <th key={tool.id} className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <div className="flex items-center">
                        <img
                          src={tool.image}
                          alt={tool.name}
                          className="w-6 h-6 rounded object-cover mr-2"
                        />
                        {tool.name}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {selectedMetrics.map(metricKey => {
                  const metric = comparisonMetrics.find(m => m.key === metricKey);
                  if (!metric) return null;
                  
                  const Icon = metric.icon;
                  return (
                    <tr key={metricKey} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Icon className="w-5 h-5 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {metric.label}
                          </span>
                        </div>
                      </td>
                      {selectedTools.map(tool => (
                        <td key={`${tool.id}-${metricKey}`} className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {getComparisonValue(tool, metricKey)}
                          </span>
                        </td>
                      ))}
                    </tr>
                  );
                })}
                
                {/* Scores Row */}
                {comparisonScores.length > 0 && (
                  <tr className="bg-blue-50 dark:bg-blue-900/20">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <TrendingUp className="w-5 h-5 text-blue-500 mr-2" />
                        <span className="text-sm font-bold text-blue-700 dark:text-blue-300">
                          AI Score
                        </span>
                      </div>
                    </td>
                    {selectedTools.map(tool => {
                      const score = comparisonScores.find(s => s.toolId === tool.id);
                      return (
                        <td key={`${tool.id}-score`} className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-bold ${getScoreColor(score?.score || 0)}`}>
                            {score ? `${(score.score * 100).toFixed(1)}%` : 'N/A'}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Strengths & Weaknesses */}
      {comparisonScores.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {selectedTools.map(tool => {
            const score = comparisonScores.find(s => s.toolId === tool.id);
            if (!score) return null;

            return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={tool.image}
                    alt={tool.name}
                    className="w-10 h-10 rounded-lg object-cover mr-3"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {tool.name}
                    </h4>
                    <span className={`text-sm font-medium ${getScoreColor(score.score)}`}>
                      {(score.score * 100).toFixed(1)}% Score
                    </span>
                  </div>
                </div>

                {score.strengths.length > 0 && (
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">
                      Strengths
                    </h5>
                    <ul className="space-y-1">
                      {score.strengths.map((strength, index) => (
                        <li key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {score.weaknesses.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">
                      Areas for Improvement
                    </h5>
                    <ul className="space-y-1">
                      {score.weaknesses.map((weakness, index) => (
                        <li key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2" />
                          {weakness}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {selectedTools.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Start Comparing Tools
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Search and select tools above to begin your detailed comparison analysis.
          </p>
        </div>
      )}
    </div>
  );
};

export default CompareTools;