import React, { useState, useEffect } from 'react';
import { Search, Book, ArrowRight, Bookmark, Share2, Filter, Star, TrendingUp, Brain, Lightbulb, Target, Zap, Globe, Code, Database, Shield, Eye, Heart, Download, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface Term {
  id: string;
  term: string;
  definition: string;
  category: string;
  examples: string[];
  relatedTerms: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  popularity: number;
  lastUpdated: string;
  tags: string[];
  pronunciation?: string;
  etymology?: string;
  usageContext: string[];
  synonyms: string[];
  antonyms: string[];
  featured: boolean;
}

interface TermCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  termCount: number;
}

interface DictionaryStats {
  totalTerms: number;
  categoriesCount: number;
  avgDifficulty: string;
  lastUpdated: string;
}

const AITermsDictionary = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);
  const [savedTerms, setSavedTerms] = useState<string[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [categories, setCategories] = useState<TermCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('alphabetical');
  const [dictionaryStats, setDictionaryStats] = useState<DictionaryStats>({
    totalTerms: 0,
    categoriesCount: 0,
    avgDifficulty: 'Intermediate',
    lastUpdated: new Date().toISOString()
  });

  const sampleTerms: Term[] = [
    {
      id: '1',
      term: 'Large Language Model (LLM)',
      definition: 'A type of artificial intelligence model trained on vast amounts of text data to understand and generate human-like text. LLMs use deep learning techniques, particularly transformer architectures, to process and produce language.',
      category: 'Core Concepts',
      examples: ['GPT-4', 'Claude', 'Gemini', 'LLaMA'],
      relatedTerms: ['Transformer', 'Natural Language Processing', 'Neural Network', 'Deep Learning'],
      difficulty: 'Intermediate',
      popularity: 95,
      lastUpdated: '2025-01-15',
      tags: ['NLP', 'Deep Learning', 'Text Generation'],
      pronunciation: 'lahrj lang-gwij mod-l',
      etymology: 'Coined in the 2020s as language models grew in size and capability',
      usageContext: ['Academic Research', 'Industry Applications', 'AI Development'],
      synonyms: ['Foundation Model', 'Generative Language Model'],
      antonyms: ['Small Language Model', 'Rule-based System'],
      featured: true
    },
    {
      id: '2',
      term: 'Prompt Engineering',
      definition: 'The practice of designing and optimizing input prompts to get desired outputs from AI models, particularly language models. It involves crafting specific instructions, examples, and context to guide the model\'s responses.',
      category: 'Techniques',
      examples: ['Chain-of-thought prompting', 'Few-shot learning', 'Zero-shot prompting', 'Role-based prompting'],
      relatedTerms: ['Context Window', 'Token', 'Temperature', 'Fine-tuning'],
      difficulty: 'Beginner',
      popularity: 88,
      lastUpdated: '2025-01-12',
      tags: ['Prompting', 'AI Interaction', 'Optimization'],
      pronunciation: 'prompt en-juh-neer-ing',
      etymology: 'Emerged with the rise of large language models in the early 2020s',
      usageContext: ['AI Applications', 'Content Creation', 'Automation'],
      synonyms: ['Prompt Design', 'Prompt Optimization'],
      antonyms: ['Random Prompting', 'Unstructured Input'],
      featured: true
    },
    {
      id: '3',
      term: 'Transformer',
      definition: 'A neural network architecture that uses self-attention mechanisms to process sequential data. Introduced in the "Attention Is All You Need" paper, transformers have become the foundation for most modern language models.',
      category: 'Architecture',
      examples: ['BERT', 'GPT series', 'T5', 'Vision Transformer'],
      relatedTerms: ['Attention Mechanism', 'Encoder-Decoder', 'Self-Attention', 'Multi-Head Attention'],
      difficulty: 'Advanced',
      popularity: 82,
      lastUpdated: '2025-01-10',
      tags: ['Neural Networks', 'Architecture', 'Attention'],
      pronunciation: 'trans-for-mer',
      etymology: 'Named for its ability to transform input sequences into output sequences',
      usageContext: ['Deep Learning Research', 'NLP Applications', 'Computer Vision'],
      synonyms: ['Attention-based Model'],
      antonyms: ['Recurrent Neural Network', 'Convolutional Neural Network'],
      featured: false
    },
    {
      id: '4',
      term: 'Fine-tuning',
      definition: 'The process of taking a pre-trained model and training it further on a specific dataset or task. This allows the model to adapt its general knowledge to perform better on specialized tasks.',
      category: 'Training',
      examples: ['Task-specific fine-tuning', 'Domain adaptation', 'Instruction tuning', 'RLHF'],
      relatedTerms: ['Transfer Learning', 'Pre-training', 'Supervised Learning', 'Parameter Efficient Fine-tuning'],
      difficulty: 'Intermediate',
      popularity: 79,
      lastUpdated: '2025-01-08',
      tags: ['Training', 'Transfer Learning', 'Adaptation'],
      pronunciation: 'fahyn-toon-ing',
      etymology: 'Borrowed from music, where fine-tuning refers to precise adjustment of instruments',
      usageContext: ['Model Development', 'Task Adaptation', 'Performance Optimization'],
      synonyms: ['Model Adaptation', 'Specialized Training'],
      antonyms: ['Pre-training', 'Training from Scratch'],
      featured: false
    },
    {
      id: '5',
      term: 'Hallucination',
      definition: 'When an AI model generates information that appears plausible but is factually incorrect or not grounded in its training data. This is a common challenge in large language models.',
      category: 'Challenges',
      examples: ['Fabricated citations', 'Invented facts', 'False historical events', 'Non-existent people'],
      relatedTerms: ['Factual Accuracy', 'Grounding', 'Verification', 'Reliability'],
      difficulty: 'Beginner',
      popularity: 76,
      lastUpdated: '2025-01-05',
      tags: ['AI Safety', 'Reliability', 'Accuracy'],
      pronunciation: 'huh-loo-suh-ney-shuhn',
      etymology: 'Borrowed from psychology, referring to false perceptions',
      usageContext: ['AI Safety', 'Model Evaluation', 'Quality Assurance'],
      synonyms: ['Confabulation', 'Fabrication'],
      antonyms: ['Factual Output', 'Grounded Response'],
      featured: true
    },
    {
      id: '6',
      term: 'Retrieval-Augmented Generation (RAG)',
      definition: 'A technique that combines information retrieval with text generation, allowing models to access external knowledge sources to provide more accurate and up-to-date responses.',
      category: 'Techniques',
      examples: ['Document Q&A', 'Knowledge-grounded chatbots', 'Fact-checking systems'],
      relatedTerms: ['Vector Database', 'Embedding', 'Information Retrieval', 'Knowledge Base'],
      difficulty: 'Advanced',
      popularity: 73,
      lastUpdated: '2025-01-03',
      tags: ['Information Retrieval', 'Knowledge Integration', 'Accuracy'],
      pronunciation: 'ri-tree-vuhl awg-men-tid jen-uh-rey-shuhn',
      etymology: 'Combines retrieval (finding information) with augmented generation',
      usageContext: ['Question Answering', 'Knowledge Systems', 'Enterprise AI'],
      synonyms: ['Knowledge-Augmented Generation'],
      antonyms: ['Parametric Generation', 'Closed-book Generation'],
      featured: false
    }
  ];

  const sampleCategories: TermCategory[] = [
    {
      id: 'core',
      name: 'Core Concepts',
      description: 'Fundamental AI and ML concepts',
      icon: Brain,
      color: 'from-blue-500 to-indigo-600',
      termCount: 45
    },
    {
      id: 'techniques',
      name: 'Techniques',
      description: 'Methods and approaches in AI',
      icon: Lightbulb,
      color: 'from-green-500 to-emerald-600',
      termCount: 38
    },
    {
      id: 'architecture',
      name: 'Architecture',
      description: 'Model architectures and designs',
      icon: Database,
      color: 'from-purple-500 to-pink-600',
      termCount: 32
    },
    {
      id: 'training',
      name: 'Training',
      description: 'Training methods and processes',
      icon: Target,
      color: 'from-orange-500 to-red-600',
    termCount: 28
    },
    {
      id: 'challenges',
      name: 'Challenges',
      description: 'Common issues and limitations',
      icon: Shield,
      color: 'from-red-500 to-pink-600',
      termCount: 22
    },
    {
      id: 'applications',
      name: 'Applications',
      description: 'Real-world AI applications',
      icon: Globe,
      color: 'from-cyan-500 to-blue-600',
      termCount: 35
    }
  ];

  useEffect(() => {
    loadTerms();
    loadCategories();
    calculateStats();
  }, []);

  const loadTerms = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    setTerms(sampleTerms);
    setIsLoading(false);
  };

  const loadCategories = () => {
    setCategories(sampleCategories);
  };

  const calculateStats = () => {
    const stats = {
      totalTerms: sampleTerms.length,
      categoriesCount: sampleCategories.length,
      avgDifficulty: 'Intermediate',
      lastUpdated: new Date().toISOString()
    };
    setDictionaryStats(stats);
  };

  const filteredTerms = terms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         term.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         term.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || term.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || term.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'popularity':
        return b.popularity - a.popularity;
      case 'difficulty':
        const difficultyOrder = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      case 'recent':
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      default:
        return a.term.localeCompare(b.term); // alphabetical
    }
  });

  const toggleSavedTerm = async (termId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to save terms');
        return;
      }

      if (savedTerms.includes(termId)) {
        setSavedTerms(prev => prev.filter(id => id !== termId));
        toast.success('Term removed from saved list');
      } else {
        setSavedTerms(prev => [...prev, termId]);
        toast.success('Term saved successfully');
      }
    } catch (error) {
      console.error('Error managing saved terms:', error);
      toast.error('Failed to update saved terms');
    }
  };

  const shareTerm = async (term: Term) => {
    try {
      await navigator.share({
        title: term.term,
        text: term.definition,
        url: window.location.href
      });
    } catch {
      navigator.clipboard.writeText(`${term.term}: ${term.definition}`);
      toast.success('Term definition copied to clipboard!');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Advanced':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-full mb-6"
        >
          <Book className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2" />
          <span className="text-indigo-600 dark:text-indigo-400 font-medium">AI Knowledge Base</span>
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
        >
          AI Terms Dictionary
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
        >
          Comprehensive glossary of AI terminology with clear explanations, examples, and context
        </motion.p>
      </div>

      {/* Dictionary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Terms</p>
              <p className="text-3xl font-bold">{dictionaryStats.totalTerms}</p>
            </div>
            <Book className="w-8 h-8 text-blue-200" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Categories</p>
              <p className="text-3xl font-bold">{dictionaryStats.categoriesCount}</p>
            </div>
            <Database className="w-8 h-8 text-green-200" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Avg Level</p>
              <p className="text-3xl font-bold">{dictionaryStats.avgDifficulty}</p>
            </div>
            <Target className="w-8 h-8 text-purple-200" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Saved Terms</p>
              <p className="text-3xl font-bold">{savedTerms.length}</p>
            </div>
            <Bookmark className="w-8 h-8 text-orange-200" />
          </div>
        </motion.div>
      </div>

      {/* Categories */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <Database className="w-6 h-6 text-blue-500 mr-2" />
          Browse by Category
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                onClick={() => setSelectedCategory(category.name)}
                className={`relative overflow-hidden rounded-2xl cursor-pointer group ${
                  selectedCategory === category.name ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-90`} />
                <div className="relative p-6 text-white">
                  <Icon className="w-12 h-12 mb-4" />
                  <h4 className="text-lg font-bold mb-2">{category.name}</h4>
                  <p className="text-white/80 text-sm mb-4">{category.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{category.termCount} terms</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col lg:flex-row items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search terms, definitions, or tags..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="All">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>{category.name}</option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="All">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="alphabetical">A-Z</option>
              <option value="popularity">Most Popular</option>
              <option value="difficulty">By Difficulty</option>
              <option value="recent">Recently Updated</option>
            </select>

            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as 'grid' | 'list')}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="grid">Grid View</option>
              <option value="list">List View</option>
            </select>
          </div>
        </div>
      </div>

      {/* Featured Terms */}
      {filteredTerms.filter(term => term.featured).length > 0 && (
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Star className="w-6 h-6 text-yellow-500 mr-2" />
            Featured Terms
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {filteredTerms.filter(term => term.featured).map((term, index) => (
              <motion.div
                key={term.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300"
                onClick={() => setSelectedTerm(term)}
              >
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-sm font-bold">
                    Featured
                  </span>
                </div>
                
                <div className="p-6 text-white">
                  <h4 className="text-xl font-bold mb-2">{term.term}</h4>
                  <p className="text-blue-100 mb-4 line-clamp-3">{term.definition}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      term.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-200' :
                      term.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-200' :
                      'bg-red-500/20 text-red-200'
                    }`}>
                      {term.difficulty}
                    </span>
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                      <span className="text-sm">{term.popularity}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-200">{term.category}</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSavedTerm(term.id);
                        }}
                        className={`p-2 rounded-full transition-colors ${
                          savedTerms.includes(term.id)
                            ? 'bg-yellow-500 text-white'
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          shareTerm(term);
                        }}
                        className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Terms List */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            All Terms ({filteredTerms.length})
          </h3>
          <button
            className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Dictionary
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
          }>
            <AnimatePresence>
              {filteredTerms.map((term, index) => (
                <motion.div
                  key={term.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer ${
                    viewMode === 'list' ? 'flex items-center p-4' : 'p-6'
                  }`}
                  onClick={() => setSelectedTerm(term)}
                >
                  {viewMode === 'grid' ? (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                          {term.term}
                        </h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSavedTerm(term.id);
                          }}
                          className={`p-2 rounded-full transition-colors ${
                            savedTerms.includes(term.id)
                              ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                              : 'text-gray-400 hover:text-yellow-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          <Bookmark className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                        {term.definition}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(term.difficulty)}`}>
                          {term.difficulty}
                        </span>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          {term.popularity}%
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {term.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {term.tags.length > 3 && (
                          <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                            +{term.tags.length - 3}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {term.category}
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-gray-900 dark:text-white">
                            {term.term}
                          </h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(term.difficulty)}`}>
                            {term.difficulty}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-2">
                          {term.definition}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {term.category}
                          </span>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            {term.popularity}%
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSavedTerm(term.id);
                        }}
                        className={`ml-4 p-2 rounded-full transition-colors ${
                          savedTerms.includes(term.id)
                            ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                            : 'text-gray-400 hover:text-yellow-500'
                        }`}
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Term Detail Modal */}
      <AnimatePresence>
        {selectedTerm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedTerm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {selectedTerm.term}
                    </h3>
                    {selectedTerm.pronunciation && (
                      <p className="text-gray-500 dark:text-gray-400 italic mb-4">
                        /{selectedTerm.pronunciation}/
                      </p>
                    )}
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedTerm.difficulty)}`}>
                        {selectedTerm.difficulty}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {selectedTerm.category}
                      </span>
                      <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        {selectedTerm.popularity}% popularity
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleSavedTerm(selectedTerm.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        savedTerms.includes(selectedTerm.id)
                          ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      <Bookmark className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => shareTerm(selectedTerm)}
                      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Definition
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {selectedTerm.definition}
                    </p>
                  </div>

                  {selectedTerm.examples.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Examples
                      </h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedTerm.examples.map((example, index) => (
                          <li
                            key={index}
                            className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                          >
                            <Lightbulb className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">
                              {example}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedTerm.usageContext.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Usage Context
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedTerm.usageContext.map((context, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-sm"
                          >
                            {context}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedTerm.synonyms.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Synonyms
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedTerm.synonyms.map((synonym, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                          >
                            {synonym}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedTerm.relatedTerms.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Related Terms
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedTerm.relatedTerms.map((term, index) => (
                          <button
                            key={index}
                            className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-left"
                            onClick={() => {
                              const relatedTerm = terms.find(t => t.term === term);
                              if (relatedTerm) setSelectedTerm(relatedTerm);
                            }}
                          >
                            <ArrowRight className="w-4 h-4 text-gray-500 mr-2" />
                            <span className="text-gray-700 dark:text-gray-300">
                              {term}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedTerm.etymology && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Etymology
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 italic">
                        {selectedTerm.etymology}
                      </p>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTerm.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Last updated: {new Date(selectedTerm.lastUpdated).toLocaleDateString()}</span>
                    <button
                      onClick={() => setSelectedTerm(null)}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {filteredTerms.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Book className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No terms found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your search terms or filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default AITermsDictionary;