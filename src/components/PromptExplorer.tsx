import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Brain, Lightbulb, Star, Copy, PenTool, Image, Code, BarChart, FileText, Briefcase, Zap, TrendingUp, Clock, Users, Filter, X, BookOpen, Target, Rocket, Video, Music, Mic, Camera, Globe, Shield, Database, Cpu, Heart, Award, Trophy, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface Prompt {
  id: string;
  title: string;
  prompt: string;
  category: string;
  rating: number;
  usageCount: number;
  tags: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  author: string;
  featured?: boolean;
  useCase: string;
  expectedOutput: string;
  tips: string[];
}

const categories = [
  { id: 'content', name: 'Content Creation', icon: PenTool, color: 'from-blue-500 to-indigo-600' },
  { id: 'image', name: 'Image Generation', icon: Image, color: 'from-purple-500 to-pink-600' },
  { id: 'code', name: 'Code Development', icon: Code, color: 'from-green-500 to-emerald-600' },
  { id: 'analysis', name: 'Data Analysis', icon: BarChart, color: 'from-orange-500 to-red-600' },
  { id: 'writing', name: 'Writing', icon: FileText, color: 'from-cyan-500 to-blue-600' },
  { id: 'business', name: 'Business', icon: Briefcase, color: 'from-violet-500 to-purple-600' },
  { id: 'marketing', name: 'Marketing', icon: TrendingUp, color: 'from-pink-500 to-rose-600' },
  { id: 'education', name: 'Education', icon: BookOpen, color: 'from-indigo-500 to-blue-600' },
  { id: 'video', name: 'Video Creation', icon: Video, color: 'from-red-500 to-pink-600' },
  { id: 'audio', name: 'Audio & Music', icon: Music, color: 'from-yellow-500 to-orange-600' },
  { id: 'research', name: 'Research', icon: Brain, color: 'from-teal-500 to-cyan-600' },
  { id: 'creative', name: 'Creative Writing', icon: Lightbulb, color: 'from-amber-500 to-yellow-600' }
];

const samplePrompts: Prompt[] = [
  {
    id: '1',
    title: 'Blog Post Outline Generator',
    prompt: 'Create a comprehensive blog post outline for "[TOPIC]" that includes:\n\n1. An engaging introduction hook\n2. 5-7 main sections with subpoints\n3. SEO-optimized headings\n4. A compelling conclusion with call-to-action\n5. Suggested meta description\n\nTarget audience: [AUDIENCE]\nTone: [TONE]\nWord count goal: [WORD_COUNT]',
    category: 'content',
    rating: 4.8,
    usageCount: 15420,
    tags: ['writing', 'blog', 'content', 'SEO'],
    difficulty: 'Beginner',
    estimatedTime: '5 min',
    author: 'ContentPro',
    featured: true,
    useCase: 'Creating structured blog posts with SEO optimization',
    expectedOutput: 'Detailed outline with headings, subpoints, and meta description',
    tips: ['Be specific about your target audience', 'Include relevant keywords', 'Keep headings engaging']
  },
  {
    id: '2',
    title: 'Advanced Code Refactoring Assistant',
    prompt: 'Analyze the following code and provide a comprehensive refactoring plan:\n\n```\n[YOUR_CODE]\n```\n\nPlease provide:\n1. Code quality assessment (1-10 scale)\n2. Specific improvement suggestions\n3. Performance optimization opportunities\n4. Best practices recommendations\n5. Refactored version with explanations\n6. Testing strategies for the refactored code\n\nProgramming language: [LANGUAGE]\nFramework: [FRAMEWORK]\nPerformance requirements: [REQUIREMENTS]',
    category: 'code',
    rating: 4.9,
    usageCount: 8750,
    tags: ['programming', 'optimization', 'clean code', 'refactoring'],
    difficulty: 'Advanced',
    estimatedTime: '15 min',
    author: 'DevMaster',
    useCase: 'Improving code quality and performance',
    expectedOutput: 'Detailed refactoring plan with optimized code',
    tips: ['Provide context about your codebase', 'Specify performance goals', 'Include test cases']
  },
  {
    id: '3',
    title: 'Creative Image Prompt Generator',
    prompt: 'Generate a detailed image prompt for creating "[CONCEPT]" with the following specifications:\n\n🎨 Style: [STYLE] (e.g., photorealistic, digital art, watercolor)\n📐 Composition: [COMPOSITION] (e.g., close-up, wide shot, bird\'s eye view)\n🌈 Color palette: [COLORS]\n💡 Lighting: [LIGHTING] (e.g., golden hour, dramatic shadows, soft diffused)\n🎭 Mood: [MOOD]\n📱 Aspect ratio: [RATIO]\n\nInclude technical parameters:\n- Camera settings (if photorealistic)\n- Art medium details\n- Negative prompts to avoid\n- Quality enhancers',
    category: 'image',
    rating: 4.7,
    usageCount: 12300,
    tags: ['image generation', 'creative', 'art', 'design'],
    difficulty: 'Intermediate',
    estimatedTime: '8 min',
    author: 'ArtisticAI',
    useCase: 'Creating detailed prompts for AI image generation',
    expectedOutput: 'Comprehensive image generation prompt with technical details',
    tips: ['Be specific about style and mood', 'Include negative prompts', 'Specify technical requirements']
  },
  {
    id: '4',
    title: 'Business Strategy Analyzer',
    prompt: 'Conduct a comprehensive business analysis for "[BUSINESS_IDEA]" including:\n\n📊 Market Analysis:\n- Target market size and demographics\n- Competitor landscape\n- Market trends and opportunities\n\n💰 Financial Projections:\n- Revenue model options\n- Cost structure breakdown\n- Break-even analysis\n- Funding requirements\n\n🎯 Strategic Recommendations:\n- Go-to-market strategy\n- Risk assessment\n- Success metrics (KPIs)\n- Timeline and milestones\n\nIndustry: [INDUSTRY]\nBudget range: [BUDGET]\nTimeline: [TIMELINE]',
    category: 'business',
    rating: 4.6,
    usageCount: 6890,
    tags: ['business', 'strategy', 'analysis', 'planning'],
    difficulty: 'Advanced',
    estimatedTime: '20 min',
    author: 'BizConsultant',
    useCase: 'Comprehensive business planning and analysis',
    expectedOutput: 'Detailed business analysis with strategic recommendations',
    tips: ['Provide market context', 'Be realistic about budget', 'Include competitive analysis']
  },
  {
    id: '5',
    title: 'Social Media Campaign Creator',
    prompt: 'Design a comprehensive social media campaign for "[PRODUCT/SERVICE]":\n\n🎯 Campaign Objectives:\n- Primary goal: [GOAL] (awareness, engagement, conversion)\n- Target metrics: [METRICS]\n- Budget: [BUDGET]\n- Duration: [TIMEFRAME]\n\n📱 Platform Strategy:\n- Platform selection and rationale\n- Content calendar (30 days)\n- Posting schedule optimization\n- Hashtag strategy\n\n🎨 Creative Elements:\n- Visual style guide\n- Content themes and pillars\n- Engagement tactics\n- Influencer collaboration ideas\n\n📊 Success Measurement:\n- KPI tracking plan\n- A/B testing strategies\n- ROI calculation methods',
    category: 'marketing',
    rating: 4.7,
    usageCount: 9870,
    tags: ['marketing', 'social media', 'campaign', 'strategy'],
    difficulty: 'Intermediate',
    estimatedTime: '18 min',
    author: 'SocialGuru',
    useCase: 'Creating comprehensive social media marketing campaigns',
    expectedOutput: 'Complete campaign strategy with content calendar',
    tips: ['Define clear objectives', 'Know your audience', 'Plan for measurement']
  },
  {
    id: '6',
    title: 'Video Script Writer',
    prompt: 'Create an engaging video script for "[VIDEO_TOPIC]":\n\n🎬 Video Details:\n- Duration: [LENGTH] minutes\n- Platform: [PLATFORM] (YouTube, TikTok, Instagram, etc.)\n- Target audience: [AUDIENCE]\n- Video style: [STYLE] (educational, entertaining, promotional)\n\n📝 Script Structure:\n- Hook (first 5 seconds)\n- Introduction and value proposition\n- Main content with key points\n- Call-to-action\n- Outro\n\n🎭 Production Notes:\n- Visual cues and B-roll suggestions\n- Music and sound effect recommendations\n- Pacing and timing notes\n- Engagement elements (questions, polls)\n\nTone: [TONE]\nBrand voice: [BRAND_VOICE]',
    category: 'video',
    rating: 4.8,
    usageCount: 7650,
    tags: ['video', 'script', 'content', 'storytelling'],
    difficulty: 'Intermediate',
    estimatedTime: '12 min',
    author: 'VideoCreator',
    useCase: 'Writing engaging video scripts for various platforms',
    expectedOutput: 'Complete video script with production notes',
    tips: ['Start with a strong hook', 'Keep audience engaged', 'Include clear call-to-action']
  },
  {
    id: '7',
    title: 'Research Paper Assistant',
    prompt: 'Help me structure and outline a research paper on "[RESEARCH_TOPIC]":\n\n📚 Paper Requirements:\n- Academic level: [LEVEL] (undergraduate, graduate, PhD)\n- Field of study: [FIELD]\n- Paper length: [PAGES] pages\n- Citation style: [STYLE] (APA, MLA, Chicago)\n\n🔍 Research Framework:\n- Research question formulation\n- Literature review structure\n- Methodology recommendations\n- Data analysis approach\n- Expected findings and implications\n\n📖 Paper Structure:\n- Abstract outline\n- Introduction framework\n- Main sections with subsections\n- Conclusion structure\n- Reference requirements\n\nDeadline: [DEADLINE]\nSpecial requirements: [REQUIREMENTS]',
    category: 'research',
    rating: 4.9,
    usageCount: 5430,
    tags: ['research', 'academic', 'writing', 'analysis'],
    difficulty: 'Advanced',
    estimatedTime: '25 min',
    author: 'AcademicHelper',
    useCase: 'Structuring academic research papers',
    expectedOutput: 'Comprehensive research paper outline and framework',
    tips: ['Define clear research questions', 'Follow academic standards', 'Plan your timeline']
  },
  {
    id: '8',
    title: 'Creative Story Generator',
    prompt: 'Create an engaging story based on these elements:\n\n📖 Story Elements:\n- Genre: [GENRE] (fantasy, sci-fi, mystery, romance, etc.)\n- Setting: [SETTING] (time and place)\n- Main character: [CHARACTER] (brief description)\n- Conflict/Challenge: [CONFLICT]\n- Tone: [TONE] (dark, humorous, inspiring, etc.)\n\n✨ Story Structure:\n- Compelling opening scene\n- Character development arc\n- Plot progression with twists\n- Climax and resolution\n- Satisfying conclusion\n\n🎭 Writing Style:\n- Narrative perspective: [PERSPECTIVE] (first person, third person)\n- Target length: [LENGTH] words\n- Target audience: [AUDIENCE]\n\nSpecial elements to include: [ELEMENTS]',
    category: 'creative',
    rating: 4.6,
    usageCount: 11200,
    tags: ['creative writing', 'storytelling', 'fiction', 'narrative'],
    difficulty: 'Intermediate',
    estimatedTime: '15 min',
    author: 'StoryWeaver',
    useCase: 'Generating creative stories and narratives',
    expectedOutput: 'Complete story with well-developed characters and plot',
    tips: ['Develop compelling characters', 'Create engaging conflicts', 'Show, don\'t tell']
  }
];

const PromptExplorer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [prompts, setPrompts] = useState<Prompt[]>(samplePrompts);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [savedPrompts, setSavedPrompts] = useState<string[]>([]);

  const smartQueries = [
    "Create engaging social media content",
    "Write professional emails",
    "Generate creative story ideas",
    "Analyze business data",
    "Design marketing campaigns",
    "Code review and optimization",
    "Educational content creation",
    "Video script writing"
  ];

  const handleSearch = (query: string) => {
    setIsLoading(true);
    setSearchQuery(query);
    
    setTimeout(() => {
      let filtered = samplePrompts.filter(prompt =>
        prompt.title.toLowerCase().includes(query.toLowerCase()) ||
        prompt.prompt.toLowerCase().includes(query.toLowerCase()) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
        prompt.useCase.toLowerCase().includes(query.toLowerCase())
      );

      if (selectedCategory) {
        filtered = filtered.filter(prompt => prompt.category === selectedCategory);
      }

      if (selectedDifficulty) {
        filtered = filtered.filter(prompt => prompt.difficulty === selectedDifficulty);
      }

      // Sort prompts
      switch (sortBy) {
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'usage':
          filtered.sort((a, b) => b.usageCount - a.usageCount);
          break;
        case 'newest':
          filtered.sort((a, b) => parseInt(b.id) - parseInt(a.id));
          break;
        default:
          filtered.sort((a, b) => b.usageCount - a.usageCount);
      }

      setPrompts(filtered);
      setIsLoading(false);
    }, 300);
  };

  useEffect(() => {
    handleSearch(searchQuery);
  }, [selectedCategory, selectedDifficulty, sortBy]);

  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    toast.success('Prompt copied to clipboard!');
  };

  const handleSavePrompt = (promptId: string) => {
    if (savedPrompts.includes(promptId)) {
      setSavedPrompts(savedPrompts.filter(id => id !== promptId));
      toast.success('Prompt removed from saved list');
    } else {
      setSavedPrompts([...savedPrompts, promptId]);
      toast.success('Prompt saved successfully');
    }
  };

  const handleSmartQuery = (query: string) => {
    setSearchQuery(query);
    handleSearch(query);
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

  const featuredPrompts = samplePrompts.filter(prompt => prompt.featured);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full mb-6"
        >
          <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
          <span className="text-purple-600 dark:text-purple-400 font-medium">AI Prompt Library</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
        >
          Master AI with Expert Prompts
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
        >
          Discover thousands of proven prompts for every use case. From content creation to code optimization, unlock AI's full potential.
        </motion.p>
      </div>

      {/* Smart Query Suggestions */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {smartQueries.map((query, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSmartQuery(query)}
              className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all"
            >
              <Lightbulb className="w-4 h-4 inline mr-2" />
              {query}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="relative max-w-4xl mx-auto mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur" />
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="What would you like to create with AI?"
            className="w-full pl-12 pr-20 py-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg text-lg"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 max-w-4xl mx-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Difficulty
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-3 mb-8 justify-center">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(selectedCategory === category.id ? '' : category.id)}
              className={`flex items-center px-4 py-2 rounded-full transition-all ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {category.name}
            </motion.button>
          );
        })}
      </div>

      {/* Featured Prompts */}
      {featuredPrompts.length > 0 && (
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Star className="w-6 h-6 text-yellow-500 mr-2" />
            Featured Prompts
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {featuredPrompts.map((prompt, index) => (
              <motion.div
                key={prompt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-xl overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300"
                onClick={() => setSelectedPrompt(prompt)}
              >
                <div className="absolute top-4 right-4">
                  <Star className="w-5 h-5 text-yellow-300" />
                </div>
                <div className="p-6 text-white">
                  <h4 className="text-lg font-semibold mb-2">{prompt.title}</h4>
                  <p className="text-purple-100 text-sm mb-4 line-clamp-2">
                    {prompt.useCase}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                      {prompt.difficulty}
                    </span>
                    <div className="flex items-center text-sm">
                      <Users className="w-4 h-4 mr-1" />
                      {prompt.usageCount.toLocaleString()}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Prompts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          ))
        ) : (
          prompts.map((prompt, index) => (
            <motion.div
              key={prompt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border border-gray-200 dark:border-gray-700"
              onClick={() => setSelectedPrompt(prompt)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {prompt.title}
                  </h4>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(prompt.difficulty)}`}>
                      {prompt.difficulty}
                    </span>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="w-4 h-4 mr-1" />
                      {prompt.estimatedTime}
                    </div>
                  </div>
                </div>
                <div className="flex items-center ml-4">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {prompt.rating}
                  </span>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                {prompt.useCase}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {prompt.tags.slice(0, 3).map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {prompt.tags.length > 3 && (
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                    +{prompt.tags.length - 3}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Users className="w-4 h-4 mr-1" />
                  {prompt.usageCount.toLocaleString()} uses
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    by {prompt.author}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSavePrompt(prompt.id);
                    }}
                    className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors ${
                      savedPrompts.includes(prompt.id) ? 'text-yellow-500' : 'text-gray-400'
                    }`}
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyPrompt(prompt.prompt);
                    }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Copy className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {prompts.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No prompts found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
        </div>
      )}

      {/* Prompt Detail Modal */}
      <AnimatePresence>
        {selectedPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedPrompt(null)}
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
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {selectedPrompt.title}
                    </h3>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getDifficultyColor(selectedPrompt.difficulty)}`}>
                        {selectedPrompt.difficulty}
                      </span>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4 mr-1" />
                        {selectedPrompt.estimatedTime}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Users className="w-4 h-4 mr-1" />
                        {selectedPrompt.usageCount.toLocaleString()} uses
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedPrompt(null)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Use Case
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      {selectedPrompt.useCase}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Prompt Template
                      </h4>
                      <button
                        onClick={() => handleCopyPrompt(selectedPrompt.prompt)}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Prompt
                      </button>
                    </div>
                    <div className="relative">
                      <pre className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm overflow-x-auto">
                        {selectedPrompt.prompt}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Expected Output
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      {selectedPrompt.expectedOutput}
                    </p>
                  </div>

                  {selectedPrompt.tips.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Pro Tips
                      </h4>
                      <ul className="space-y-2">
                        {selectedPrompt.tips.map((tip, index) => (
                          <li key={index} className="flex items-start">
                            <Lightbulb className="w-4 h-4 text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Tags
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedPrompt.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 text-sm font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Details
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Author:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{selectedPrompt.author}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Rating:</span>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 mr-1" />
                            <span className="font-medium text-gray-900 dark:text-white">{selectedPrompt.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Category:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {categories.find(c => c.id === selectedPrompt.category)?.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PromptExplorer;