import React, { useState, useEffect } from 'react';
import { Search, Sparkles, MessageSquare, Image, Code2, Music, Video, PenTool, BookOpen, Briefcase, LayoutGrid, Star, Heart, LogIn, LogOut, Menu, Zap, Globe, Database, Cpu, Cloud, Palette, FileCode, Headphones, Camera, Keyboard, Microscope, Share2, Gauge, Trophy, Gamepad } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { Toaster, toast } from 'react-hot-toast';
import AuthModal from './components/AuthModal';
import ThemeToggle from './components/ThemeToggle';
import Sidebar from './components/Sidebar';
import ToolFinder from './components/ToolFinder';
import CompareTools from './components/CompareTools';
import ToolCard from './components/ToolCard';

interface AITool {
  name: string;
  description: string;
  category: string;
  url: string;
  github?: string;
  image: string;
  pricing: string;
  rating?: number;
  featured?: boolean;
  dailyUsers?: string;
  modelType?: string;
  easeOfUse?: number;
  codeQuality?: number;
  userExperience?: number;
}

export const categories = [
  { name: 'All', icon: LayoutGrid },
  { name: 'Chatbots', icon: MessageSquare },
  { name: 'Image Generation', icon: Image },
  { name: 'Code', icon: Code2 },
  { name: 'Music', icon: Music },
  { name: 'Video', icon: Video },
  { name: 'Writing', icon: PenTool },
  { name: 'Education', icon: BookOpen },
  { name: 'Business', icon: Briefcase },
  { name: 'APIs', icon: Cloud },
  { name: 'Research', icon: Microscope },
  { name: 'Design', icon: Palette },
  { name: 'Gaming', icon: Gamepad },
  { name: 'Analytics', icon: Gauge }
];

const existingTools: AITool[] = [
  {
    name: 'ChatGPT',
    description: 'Advanced language model for conversation and text generation',
    category: 'Chatbots',
    url: 'https://chat.openai.com',
    image: 'https://images.unsplash.com/photo-1676299081847-c3c9b2d93517',
    pricing: 'Free / $20 monthly',
    rating: 4.8,
    featured: true,
    dailyUsers: '100M+',
    modelType: 'GPT-4',
    easeOfUse: 5,
    codeQuality: 4.5,
    userExperience: 4.8
  },
  {
    name: 'Google Gemini',
    description: 'Next-generation AI model with advanced reasoning capabilities',
    category: 'Chatbots',
    url: 'https://gemini.google.com',
    image: 'https://images.unsplash.com/photo-1685094488371-5ad47f1ad93f',
    pricing: 'Free / $10 monthly',
    rating: 4.7,
    featured: true,
    dailyUsers: '50M+',
    modelType: 'Gemini Ultra',
    easeOfUse: 4.8,
    codeQuality: 4.7,
    userExperience: 4.6
  },
  {
    name: 'DeepSeek',
    description: 'Advanced coding assistant with deep understanding of software development',
    category: 'Code',
    url: 'https://deepseek.ai',
    image: 'https://images.unsplash.com/photo-1687163155606-e769e7232c37',
    pricing: 'Free Beta',
    rating: 4.6,
    featured: true,
    dailyUsers: '1M+',
    modelType: 'DeepSeek Coder',
    easeOfUse: 4.5,
    codeQuality: 4.9,
    userExperience: 4.7
  },
  {
    name: 'Anthropic Claude',
    description: 'Advanced AI assistant for analysis and content creation',
    category: 'Chatbots',
    url: 'https://claude.ai',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
    pricing: 'Free / $20 monthly',
    rating: 4.7,
    featured: true,
    dailyUsers: '10M+',
    modelType: 'Claude 3',
    easeOfUse: 4.6,
    codeQuality: 4.8,
    userExperience: 4.7
  },
  {
    name: 'Midjourney',
    description: 'Create stunning artwork using AI',
    category: 'Image Generation',
    url: 'https://www.midjourney.com',
    image: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714',
    pricing: 'From $10 monthly',
    rating: 4.8,
    featured: true,
    dailyUsers: '15M+',
    modelType: 'MJ v6',
    easeOfUse: 4.3,
    codeQuality: 'N/A',
    userExperience: 4.8
  }
];

const additionalTools: AITool[] = [
  {
    name: 'PydanticAI',
    description: 'Python agent framework for production-grade Generative AI applications',
    category: 'Code',
    url: 'https://ai.pydantic.dev',
    github: 'https://github.com/pydantic/pydantic-ai',
    image: 'https://images.unsplash.com/photo-1687163155606-e769e7232c37',
    pricing: 'Free / Open Source',
    rating: 4.6,
    dailyUsers: '100K+',
    modelType: 'Custom',
    easeOfUse: 4.4,
    codeQuality: 4.8,
    userExperience: 4.5
  },
  {
    name: 'Pipecat Flows',
    description: 'Open source Voice AI agent builder',
    category: 'APIs',
    url: 'https://flows.pipecat.ai',
    github: 'https://github.com/pipecat-ai/pipecat',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
    pricing: 'Free / Open Source',
    rating: 4.5,
    dailyUsers: '50K+',
    modelType: 'Various',
    easeOfUse: 4.3,
    codeQuality: 4.7,
    userExperience: 4.4
  },
  {
    name: 'Hyperwrite',
    description: 'AI writer for content generation, research, and more',
    category: 'Writing',
    url: 'https://www.hyperwriteai.com',
    image: 'https://images.unsplash.com/photo-1686191128892-3b37add4c844',
    pricing: 'Free / Premium',
    rating: 4.6,
    dailyUsers: '1M+',
    modelType: 'Custom GPT',
    easeOfUse: 4.8,
    codeQuality: 'N/A',
    userExperience: 4.7
  }
];

const newTools: AITool[] = [
  {
    name: 'Rendora AI',
    description: 'Advanced text-to-3D model generation platform',
    category: 'Design',
    url: 'https://rendora.ai',
    image: 'https://images.unsplash.com/photo-1682687220923-c58b9a4592ae',
    pricing: 'Free beta',
    rating: 4.6,
    dailyUsers: '50K+',
    modelType: '3D Gen',
    easeOfUse: 4.4,
    codeQuality: 'N/A',
    userExperience: 4.5
  },
  {
    name: 'Windsurf AI',
    description: 'AI-powered UI/UX design assistant',
    category: 'Design',
    url: 'https://windsurf.ai',
    image: 'https://images.unsplash.com/photo-1682687220923-c58b9a4592ae',
    pricing: 'From $19/month',
    rating: 4.5,
    dailyUsers: '20K+',
    modelType: 'Custom',
    easeOfUse: 4.7,
    codeQuality: 'N/A',
    userExperience: 4.6
  },
  {
    name: 'Groq Cloud',
    description: 'Ultra-fast LLM inference platform',
    category: 'APIs',
    url: 'https://groq.com',
    github: 'https://github.com/groq',
    image: 'https://images.unsplash.com/photo-1687163155606-e769e7232c37',
    pricing: 'Pay per use',
    rating: 4.8,
    dailyUsers: '100K+',
    modelType: 'LLM',
    easeOfUse: 4.6,
    codeQuality: 4.8,
    userExperience: 4.7
  }
];

const additionalNewTools: AITool[] = [
  {
    name: 'Perplexity AI',
    description: 'Advanced research assistant with real-time information access',
    category: 'Research',
    url: 'https://perplexity.ai',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free / $20 monthly',
    rating: 4.7,
    dailyUsers: '2M+',
    modelType: 'Custom LLM',
    easeOfUse: 4.8,
    userExperience: 4.7
  },
  {
    name: 'Synthesia',
    description: 'Create professional AI videos with custom avatars',
    category: 'Video',
    url: 'https://synthesia.io',
    image: 'https://images.unsplash.com/photo-1682687221073-53ad74c2cad7',
    pricing: 'From $30/video',
    rating: 4.6,
    dailyUsers: '500K+',
    modelType: 'Video Gen',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'Runway Gen-2',
    description: 'Advanced AI video generation and editing platform',
    category: 'Video',
    url: 'https://runway.ml',
    image: 'https://images.unsplash.com/photo-1682687221080-5cb261c645cb',
    pricing: 'From $15/month',
    rating: 4.8,
    dailyUsers: '1M+',
    modelType: 'Gen-2',
    easeOfUse: 4.4,
    userExperience: 4.7
  },
  {
    name: 'Stable Audio',
    description: 'Generate custom music and sound effects with AI',
    category: 'Music',
    url: 'https://stable.audio',
    image: 'https://images.unsplash.com/photo-1682687221363-72518513620e',
    pricing: 'Credits based',
    rating: 4.5,
    dailyUsers: '200K+',
    modelType: 'Audio Gen',
    easeOfUse: 4.3,
    userExperience: 4.4
  },
  {
    name: 'Gamma',
    description: 'AI-powered presentation and document creation',
    category: 'Business',
    url: 'https://gamma.app',
    image: 'https://images.unsplash.com/photo-1682687221203-d5bf269962b9',
    pricing: 'Free / $10 monthly',
    rating: 4.7,
    dailyUsers: '300K+',
    modelType: 'Custom',
    easeOfUse: 4.8,
    userExperience: 4.7
  },
  {
    name: 'Codeium',
    description: 'AI code completion and explanation assistant',
    category: 'Code',
    url: 'https://codeium.com',
    image: 'https://images.unsplash.com/photo-1682687221248-3116ba6ab483',
    pricing: 'Free for individuals',
    rating: 4.6,
    dailyUsers: '400K+',
    modelType: 'Code LLM',
    easeOfUse: 4.7,
    userExperience: 4.6
  },
  {
    name: 'Tome',
    description: 'AI-powered storytelling and presentation platform',
    category: 'Business',
    url: 'https://tome.app',
    image: 'https://images.unsplash.com/photo-1682687221123-4673装饰3',
    pricing: 'Free / $20 monthly',
    rating: 4.7,
    dailyUsers: '250K+',
    modelType: 'Custom',
    easeOfUse: 4.6,
    userExperience: 4.7
  },
  {
    name: 'Soundraw',
    description: 'AI music generation for content creators',
    category: 'Music',
    url: 'https://soundraw.io',
    image: 'https://images.unsplash.com/photo-1682687221299-c29175402c9c',
    pricing: 'From $15/month',
    rating: 4.5,
    dailyUsers: '150K+',
    modelType: 'Music Gen',
    easeOfUse: 4.4,
    userExperience: 4.5
  },
  {
    name: 'Pictory',
    description: 'Automated video creation from long-form content',
    category: 'Video',
    url: 'https://pictory.ai',
    image: 'https://images.unsplash.com/photo-1682687221213-c2dd49d75d97',
    pricing: 'From $25/month',
    rating: 4.6,
    dailyUsers: '100K+',
    modelType: 'Video Gen',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'Descript',
    description: 'AI-powered video and audio editing platform',
    category: 'Video',
    url: 'https://descript.com',
    image: 'https://images.unsplash.com/photo-1682687221459-82ae3e3f7d58',
    pricing: 'Free / $15 monthly',
    rating: 4.8,
    dailyUsers: '800K+',
    modelType: 'Custom',
    easeOfUse: 4.7,
    userExperience: 4.8
  }
];

export const aiTools = [...existingTools, ...additionalTools, ...newTools, ...additionalNewTools];

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

function App() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState('home');
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      fetchFavorites();
    }
  }, [session?.user?.id]);

  const fetchFavorites = async () => {
    const { data, error } = await supabase
      .from('favorites')
      .select('tool_name')
      .eq('user_id', session?.user?.id);

    if (error) {
      console.error('Error fetching favorites:', error);
      return;
    }

    setFavorites(data.map(fav => fav.tool_name));
  };

  const toggleFavorite = async (toolName: string) => {
    if (!session) {
      toast.error('Please login to save favorites');
      return;
    }

    const isFavorite = favorites.includes(toolName);
    
    if (isFavorite) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', session.user.id)
        .eq('tool_name', toolName);

      if (error) {
        toast.error('Failed to remove from favorites');
        return;
      }

      setFavorites(favorites.filter(name => name !== toolName));
      toast.success('Removed from favorites');
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert([{ user_id: session.user.id, tool_name: toolName }]);

      if (error) {
        toast.error('Failed to add to favorites');
        return;
      }

      setFavorites([...favorites, toolName]);
      toast.success('Added to favorites');
    }
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const filteredTools = aiTools.filter(tool => {
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderContent = () => {
    switch (currentPage) {
      case 'finder':
        return <ToolFinder tools={aiTools} onToolSelect={(tool) => {
          setSelectedCategory(tool.category);
          setCurrentPage('home');
        }} />;
      case 'compare':
        return <CompareTools tools={aiTools} />;
      default:
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
            {/* Featured Tools */}
            {selectedCategory === 'All' && searchQuery === '' && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Featured Tools
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {aiTools.filter(tool => tool.featured).map(tool => (
                    <ToolCard
                      key={tool.name}
                      tool={tool}
                      isFavorite={favorites.includes(tool.name)}
                      onToggleFavorite={() => toggleFavorite(tool.name)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Category Title */}
            {selectedCategory !== 'All' && (
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {selectedCategory}
              </h2>
            )}

            {/* Search Results */}
            {searchQuery && (
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Search Results for "{searchQuery}"
              </h2>
            )}

            {/* All Tools Grid */}
            <section>
              {selectedCategory === 'All' && searchQuery === '' && (
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  All Tools
                </h2>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTools.map(tool => (
                  <ToolCard
                    key={tool.name}
                    tool={tool}
                    isFavorite={favorites.includes(tool.name)}
                    onToggleFavorite={() => toggleFavorite(tool.name)}
                  />
                ))}
              </div>
            </section>

            {/* ```jsx
            {/* No Results Message */}
            {filteredTools.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                  No tools found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  Try adjusting your search or category filters
                </p>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-100 transition-colors duration-200">
      <Toaster position="top-right" />
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      
      {/* Header */}
      <header className="bg-white dark:bg-dark-200 shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-300"
              >
                <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              </button>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">ToolVa</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search AI tools..."
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-400 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-300 text-gray-900 dark:text-white w-full sm:w-64 md:w-80"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
              {session ? (
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-dark-300 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-dark-400 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                >
                  <LogIn className="h-5 w-5" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        <Sidebar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          onNavigate={setCurrentPage}
        />
        <main className="flex-1 relative">
          {/* Overlay when sidebar is open on mobile */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-10"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;