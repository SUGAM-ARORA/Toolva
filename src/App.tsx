import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Brain, MessageSquare, Image, Code2, Music, Video, PenTool, BookOpen, Briefcase, LayoutGrid, Star, Heart, LogIn, LogOut, UserPlus, Menu } from 'lucide-react';
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
  },
  {
    name: 'DALL-E 3',
    description: 'Advanced AI art and image generation from text descriptions',
    category: 'Image Generation',
    url: 'https://labs.openai.com',
    image: 'https://images.unsplash.com/photo-1686191128892-3b37add4c844',
    pricing: 'Pay per use',
    rating: 4.7,
    dailyUsers: '20M+',
    modelType: 'DALL-E 3',
    easeOfUse: 4.9,
    codeQuality: 'N/A',
    userExperience: 4.7
  },
  {
    name: 'Stable Diffusion XL',
    description: 'Open-source image generation with exceptional quality',
    category: 'Image Generation',
    url: 'https://stability.ai',
    image: 'https://images.unsplash.com/photo-1682687220923-c58b9a4592ae',
    pricing: 'Free / API pricing',
    rating: 4.6,
    dailyUsers: '5M+',
    modelType: 'SDXL 1.0',
    easeOfUse: 4.2,
    codeQuality: 4.5,
    userExperience: 4.4
  },
  {
    name: 'GitHub Copilot',
    description: 'AI-powered code completion and suggestion tool',
    category: 'Code',
    url: 'https://github.com/features/copilot',
    image: 'https://images.unsplash.com/photo-1687163155606-e769e7232c37',
    pricing: '$10 monthly',
    rating: 4.9,
    featured: true,
    dailyUsers: '50M+',
    modelType: 'CodeGen',
    easeOfUse: 4.9,
    codeQuality: 4.8,
    userExperience: 4.9
  },
  {
    name: 'Amazon CodeWhisperer',
    description: 'AI code companion for AWS and general development',
    category: 'Code',
    url: 'https://aws.amazon.com/codewhisperer',
    image: 'https://images.unsplash.com/photo-1687163155606-e769e7232c37',
    pricing: 'Free for individual use',
    rating: 4.5,
    dailyUsers: '10M+',
    modelType: 'Custom LLM',
    easeOfUse: 4.4,
    codeQuality: 4.6,
    userExperience: 4.3
  },
  {
    name: 'Jasper',
    description: 'AI writing assistant for marketing and content',
    category: 'Writing',
    url: 'https://www.jasper.ai',
    image: 'https://images.unsplash.com/photo-1686191128892-3b37add4c844',
    pricing: 'From $49 monthly',
    rating: 4.5,
    dailyUsers: '5M+',
    modelType: 'Custom GPT',
    easeOfUse: 4.7,
    codeQuality: 'N/A',
    userExperience: 4.6
  },
  {
    name: 'Copy.ai',
    description: 'AI-powered copywriting and content generation',
    category: 'Writing',
    url: 'https://www.copy.ai',
    image: 'https://images.unsplash.com/photo-1686191128892-3b37add4c844',
    pricing: 'Free / $36 monthly',
    rating: 4.4,
    dailyUsers: '2M+',
    modelType: 'Custom GPT',
    easeOfUse: 4.8,
    codeQuality: 'N/A',
    userExperience: 4.5
  },
  {
    name: 'Synthesia',
    description: 'Create AI videos with virtual presenters',
    category: 'Video',
    url: 'https://www.synthesia.io',
    image: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714',
    pricing: 'From $30/video',
    rating: 4.4,
    dailyUsers: '1M+',
    modelType: 'Custom AI',
    easeOfUse: 4.3,
    codeQuality: 'N/A',
    userExperience: 4.4
  },
  {
    name: 'RunwayML',
    description: 'AI-powered creative tools for video editing',
    category: 'Video',
    url: 'https://runway.ml',
    image: 'https://images.unsplash.com/photo-1682687220923-c58b9a4592ae',
    pricing: 'From $15 monthly',
    rating: 4.6,
    dailyUsers: '2M+',
    modelType: 'Gen-2',
    easeOfUse: 4.2,
    codeQuality: 'N/A',
    userExperience: 4.5
  },
  {
    name: 'Mubert',
    description: 'AI-generated music and soundtracks',
    category: 'Music',
    url: 'https://mubert.com',
    image: 'https://images.unsplash.com/photo-1685094488371-5ad47f1ad93f',
    pricing: 'Free / Pro plans',
    rating: 4.3,
    dailyUsers: '500K+',
    modelType: 'Custom AI',
    easeOfUse: 4.4,
    codeQuality: 'N/A',
    userExperience: 4.2
  },
  {
    name: 'Duolingo Max',
    description: 'AI-powered language learning platform',
    category: 'Education',
    url: 'https://www.duolingo.com',
    image: 'https://images.unsplash.com/photo-1686191128892-3b37add4c844',
    pricing: '$7 monthly',
    rating: 4.7,
    dailyUsers: '20M+',
    modelType: 'GPT-4',
    easeOfUse: 4.9,
    codeQuality: 'N/A',
    userExperience: 4.8
  },
  {
    name: 'Perplexity AI',
    description: 'AI-powered search engine with detailed answers',
    category: 'Chatbots',
    url: 'https://www.perplexity.ai',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
    pricing: 'Free / $20 monthly',
    rating: 4.5,
    dailyUsers: '5M+',
    modelType: 'Claude/GPT-4',
    easeOfUse: 4.8,
    codeQuality: 'N/A',
    userExperience: 4.6
  },
  {
    name: 'Replicate',
    description: 'Platform for running various AI models',
    category: 'Image Generation',
    url: 'https://replicate.com',
    image: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714',
    pricing: 'Pay per use',
    rating: 4.4,
    dailyUsers: '1M+',
    modelType: 'Various',
    easeOfUse: 4.1,
    codeQuality: 4.5,
    userExperience: 4.3
  },
  {
    name: 'Hugging Face',
    description: 'Open-source AI model hub and deployment platform',
    category: 'Code',
    url: 'https://huggingface.co',
    image: 'https://images.unsplash.com/photo-1687163155606-e769e7232c37',
    pricing: 'Free / Enterprise',
    rating: 4.7,
    dailyUsers: '10M+',
    modelType: 'Various',
    easeOfUse: 4.2,
    codeQuality: 4.8,
    userExperience: 4.5
  },
  {
    name: 'Notion AI',
    description: 'AI-powered writing and productivity assistant',
    category: 'Writing',
    url: 'https://notion.so',
    image: 'https://images.unsplash.com/photo-1686191128892-3b37add4c844',
    pricing: '$10 monthly add-on',
    rating: 4.6,
    dailyUsers: '30M+',
    modelType: 'Custom GPT',
    easeOfUse: 4.9,
    codeQuality: 'N/A',
    userExperience: 4.7
  },
  {
    name: 'Anthropic Claude Pro',
    description: 'Advanced AI model with enhanced capabilities',
    category: 'Chatbots',
    url: 'https://claude.ai/pro',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
    pricing: '$20 monthly',
    rating: 4.8,
    dailyUsers: '5M+',
    modelType: 'Claude 3 Opus',
    easeOfUse: 4.7,
    codeQuality: 4.9,
    userExperience: 4.8
  }
];

const additionalTools: AITool[] = [
  {
    name: 'Bolt AI',
    description: 'AI-powered development environment with real-time code assistance',
    category: 'Code',
    url: 'https://boltai.com',
    github: 'https://github.com/boltai/bolt',
    image: 'https://images.unsplash.com/photo-1687163155606-e769e7232c37',
    pricing: 'Free / $15 monthly',
    rating: 4.7,
    dailyUsers: '2M+',
    modelType: 'Custom LLM',
    easeOfUse: 4.8,
    codeQuality: 4.9,
    userExperience: 4.7
  }
];

export const aiTools = [...existingTools, ...additionalTools];

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
          <>
            {/* Featured Tools */}
            {selectedCategory === 'All' && searchQuery === '' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Featured Tools</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {aiTools.filter(tool => tool.featured).map(tool => (
                    <ToolCard
                      key={tool.name}
                      tool={tool}
                      isFavorite={favorites.includes(tool.name)}
                      onToggleFavorite={toggleFavorite}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* All Tools Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {selectedCategory === 'All' && searchQuery === '' && (
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">All Tools</h2>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.map(tool => (
                  <ToolCard
                    key={tool.name}
                    tool={tool}
                    isFavorite={favorites.includes(tool.name)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            </div>
          </>
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
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-400 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-300 text-gray-900 dark:text-white"
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
                  <span>Sign Out</span>
                </button>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                >
                  <LogIn className="h-5 w-5" />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          onNavigate={setCurrentPage}
        />

        {/* Main Content */}
        <main className="flex-1 min-w-0 overflow-hidden">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;