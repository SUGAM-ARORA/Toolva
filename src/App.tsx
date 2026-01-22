import { lazy, Suspense } from 'react';
import { useState, useEffect, useMemo } from 'react';
import { Menu, Search, Filter, Zap, BookOpen, Users, Brain, Workflow, Book, Trophy, GraduationCap, ArrowRight } from 'lucide-react';
import { categories } from './data/categories';
import Sidebar from './components/Sidebar';
import ThemeToggle from './components/ThemeToggle';
import AuthModal from './components/AuthModal';
import UserMenu from './components/UserMenu';
import LoadingSpinner from './components/LoadingSpinner';
import toast, { Toaster } from 'react-hot-toast';
import Pagination from './components/Pagination';
import { supabase } from './lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Profile from './pages/Profile';
import Favorites from './pages/Favorites';
import Settings from './pages/Settings';
import ReactGA from 'react-ga4';
import { GitHubSignIn } from './components/GitHubSignIn';
import { AuthCallback } from './pages/AuthCallback';
import { AITool } from './types';
import Fuse from 'fuse.js';
import GlobalSearch from './components/GlobalSearch';

import { aiTools } from './data/aiTools';

// Lazy load components
const ToolCard = lazy(() => import('./components/ToolCard'));
const ToolFinder = lazy(() => import('./components/ToolFinder'));
const CompareTools = lazy(() => import('./components/CompareTools'));
const PersonaRecommendations = lazy(() => import('./components/PersonaRecommendations'));
const PromptExplorer = lazy(() => import('./components/PromptExplorer'));
const WorkflowBuilder = lazy(() => import('./components/WorkflowBuilder'));
const AILearningHub = lazy(() => import('./components/AILearningHub'));
const AITermsDictionary = lazy(() => import('./components/AITermsDictionary'));
const WeeklyRecommendations = lazy(() => import('./components/WeeklyRecommendations'));
const SubmitTool = lazy(() => import('./components/SubmitTool'));
const Footer = lazy(() => import('./components/Footer'));

function App() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });
  const [showSidebar, setShowSidebar] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // New States for Search and Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPricing, setSelectedPricing] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number | null>(null);

  const [view, setView] = useState<'grid' | 'finder' | 'compare' | 'submit' | 'personas' | 'prompts' | 'workflows' | 'learning' | 'dictionary' | 'weekly'>('grid');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [tools, setTools] = useState<AITool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 12;

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
      console.warn('Error fetching tools from Supabase, falling back to local data:', error);
      toast.error('Using offline data mode');
      setTools(aiTools); // Fallback to local data
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const script1 = document.createElement('script');
    script1.src = "https://www.googletagmanager.com/gtag/js?id=G-N87HLGF2NN";
    script1.async = true;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-N87HLGF2NN');
    `;
    document.head.appendChild(script2);
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Session error:', error);
          await supabase.auth.signOut();
          setUser(null);
          setFavorites([]);
          return;
        }

        setUser(session?.user ?? null);
        if (session?.user) {
          fetchFavorites(session.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        await supabase.auth.signOut();
        setUser(null);
        setFavorites([]);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchFavorites(session.user.id);
        } else {
          setFavorites([]);
        }
      } else if (event === 'SIGNED_IN') {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchFavorites(session.user.id);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchFavorites = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('tool_id')
        .eq('user_id', userId);

      if (error) throw error;
      setFavorites(data.map(f => f.tool_id));
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const handleToggleTheme = () => {
    setIsDark(!isDark);
  };

  const handleFavorite = async (toolId: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    try {
      if (favorites.includes(toolId)) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('tool_id', toolId);

        if (error) throw error;
        setFavorites(favorites.filter(id => id !== toolId));
        toast.success('Removed from favorites');
      } else {
        // Check if favorite already exists before inserting
        const { data: existingFavorite, error: checkError } = await supabase
          .from('favorites')
          .select('id')
          .eq('user_id', user.id)
          .eq('tool_id', toolId)
          .single();

        if (checkError && checkError.code !== 'PGRST116') {
          // PGRST116 is "not found" error, which is expected when no record exists
          throw checkError;
        }

        if (existingFavorite) {
          // Already exists, just update local state
          if (!favorites.includes(toolId)) {
            setFavorites([...favorites, toolId]);
          }
          toast.success('Already in favorites');
          return;
        }

        // Insert new favorite
        const { error } = await supabase
          .from('favorites')
          .insert([{ user_id: user.id, tool_id: toolId }]);

        if (error) throw error;
        setFavorites([...favorites, toolId]);
        toast.success('Added to favorites');
      }
    } catch (error) {
      console.error('Error managing favorites:', error);
      toast.error('Failed to update favorites');
      // Re-fetch to ensure state synchronization
      await fetchFavorites(user.id);
    }
  };

  // Fuse.js initialization
  const fuse = useMemo(() => {
    // Handle potential import issues with Fuse.js (ESM vs CommonJS)
    const FuseConstructor = (Fuse as any).default || Fuse;
    return new FuseConstructor(tools || [], {
      keys: ['name', 'description', 'category', 'pricing'],
      threshold: 0.3,
      ignoreLocation: true
    });
  }, [tools]);

  // Handle category selection from hero section
  const handleCategorySelect = (categoryName: string) => {
    if (categoryName === 'All') {
      setSelectedCategories([]);
    } else {
      setSelectedCategories([categoryName]);
    }
    // Scroll to tools section
    const toolsSection = document.getElementById('tools-section');
    if (toolsSection) {
      toolsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filter Logic
  const filteredTools = useMemo(() => {
    let result = tools || [];

    // Search Filter
    if (searchQuery && fuse) {
      const searchResults = fuse.search(searchQuery);
      result = searchResults.map(r => r.item);
    }

    // Category Filter
    if (selectedCategories.length > 0) {
      result = result.filter(tool => selectedCategories.includes(tool.category));
    }

    // Pricing Filter
    if (selectedPricing.length > 0) {
      result = result.filter(tool => {
        const pricing = tool.pricing?.toLowerCase() || '';
        return selectedPricing.some(p => {
          if (p === 'Free') return pricing.includes('free');
          if (p === 'Paid') return (pricing.includes('$') || pricing.includes('paid')) && !pricing.includes('free');
          if (p === 'Freemium') return pricing.includes('free') && (pricing.includes('$') || pricing.includes('paid'));
          return false;
        });
      });
    }

    // Rating Filter
    if (minRating !== null) {
      result = result.filter(tool => (tool.rating || 0) >= minRating);
    }

    return result;
  }, [tools, searchQuery, selectedCategories, selectedPricing, minRating, fuse]);

  const totalPages = Math.ceil(filteredTools.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTools = filteredTools.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, searchQuery, selectedPricing, minRating]);

  const navItems = [
    { label: 'Griha', icon: BookOpen, view: 'grid' },
    { label: 'Veda', icon: Search, view: 'finder' },
    { label: 'Tulna', icon: Filter, view: 'compare' },
    { label: 'Vyakta', icon: Users, view: 'personas' },
    { label: 'Uttara', icon: Brain, view: 'prompts' },
    { label: 'Disha', icon: Workflow, view: 'workflows' },
    { label: 'Vidya', icon: GraduationCap, view: 'learning' },
    { label: 'Medha', icon: Book, view: 'dictionary' },
    { label: 'Saptak', icon: Trophy, view: 'weekly' },
    { label: 'Samarp', icon: Zap, view: 'submit' }
  ];

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
        <Toaster position="top-right" />

        <AnimatePresence>
          {showSidebar && (
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg"
            >
              <Sidebar
                categories={categories}
                selectedCategories={selectedCategories}
                onCategoryChange={setSelectedCategories}
                onClose={() => setShowSidebar(false)}
                onFilterChange={() => { }}
                toolsCount={tools.length}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 flex flex-col">
          <header className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${searchQuery ? 'bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm' : 'bg-white dark:bg-gray-800'
            } shadow-sm border-b border-gray-200 dark:border-gray-700`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-20 gap-4">
                {/* Logo and Menu */}
                <div className="flex items-center min-w-max">
                  <button
                    onClick={() => setShowSidebar(!showSidebar)}
                    className="p-2 mr-2 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 lg:hidden"
                  >
                    <Menu className="h-6 w-6" />
                  </button>
                  <Link to="/" className="flex items-center group">
                    <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2 group-hover:bg-blue-700 transition-colors">
                      <Brain className="h-5 w-5 text-white" />
                    </div>
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                      Toolva
                    </h1>
                  </Link>
                </div>

                {/* Global Search Center */}
                <div className="flex-1 max-w-2xl px-4 lg:px-8">
                  <GlobalSearch
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    categories={categories}
                    selectedCategories={selectedCategories}
                    onCategoryChange={setSelectedCategories}
                    selectedPricing={selectedPricing}
                    onPricingChange={setSelectedPricing}
                    minRating={minRating}
                    onRatingChange={setMinRating}
                  />
                </div>

                {/* Right Side: Theme & Auth */}
                <div className="flex items-center space-x-3 min-w-max">
                  <ThemeToggle isDark={isDark} onToggle={handleToggleTheme} />
                  {user ? (
                    <UserMenu user={user} />
                  ) : (
                    <button
                      onClick={() => setShowAuthModal(true)}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
                    >
                      Sign In
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:block border-t border-gray-100 dark:border-gray-700">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex space-x-1 py-1 overflow-x-auto no-scrollbar">
                  {navItems.map(item => (
                    <button
                      key={item.label}
                      onClick={() => setView(item.view as any)}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${view === item.view
                        ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                    >
                      <div className="flex items-center">
                        <item.icon className="h-4 w-4 mr-1.5" />
                        {item.label}
                      </div>
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </header>

          <Routes>
            <Route path="/profile" element={<Profile />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/" element={
              <main className="flex-1 pt-24 pb-20">
                {view === 'grid' && (
                  <div className="min-h-[500px] relative">
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-4xl mx-auto mb-16"
                      >
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400">
                          Discover the Future of AI
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                          Explore our curated collection of {tools.length}+ top-tier AI tools. Filter, compare, and find the perfect solution for your workflow.
                        </p>

                        <div className="flex justify-center gap-4 flex-wrap">
                          {categories.slice(0, 6).map((category) => {
                            const Icon = category.icon;
                            if (category.name === 'All') return null;
                            const isSelected = selectedCategories.includes(category.name);
                            return (
                              <button
                                key={category.name}
                                onClick={() => handleCategorySelect(category.name)}
                                className={`flex items-center px-4 py-2 rounded-full border transition-all ${isSelected
                                  ? 'bg-blue-600 border-blue-600 text-white'
                                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-blue-500 dark:hover:border-blue-400'
                                  }`}
                              >
                                <Icon className="h-4 w-4 mr-2" />
                                <span className="text-sm font-medium">{category.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>

                      <div id="tools-section">
                        {isLoading ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, index) => (
                              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 animate-pulse h-80">
                                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center justify-between mb-6">
                              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                {filteredTools.length} {filteredTools.length === 1 ? 'Result' : 'Results'}
                              </h2>
                              <div className="flex gap-2">
                                {(selectedCategories.length > 0 || selectedPricing.length > 0 || minRating) && (
                                  <button
                                    onClick={() => {
                                      setSelectedCategories([]);
                                      setSelectedPricing([]);
                                      setMinRating(null);
                                      setSearchQuery('');
                                    }}
                                    className="text-sm text-red-500 hover:text-red-700 font-medium"
                                  >
                                    Clear Filters
                                  </button>
                                )}
                              </div>
                            </div>

                            {filteredTools.length > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {paginatedTools.map((tool, index) => (
                                  <motion.div
                                    key={tool.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05, duration: 0.5 }}
                                    className="h-full"
                                  >
                                    <Suspense fallback={<LoadingSpinner />}>
                                      <ToolCard
                                        tool={tool}
                                        onFavorite={() => handleFavorite(tool.id)}
                                        isFavorited={favorites.includes(tool.id)}
                                      />
                                    </Suspense>
                                  </motion.div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-20">
                                <Search className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No tools found</h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                  Try adjusting your search or filters to find what you're looking for.
                                </p>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {totalPages > 1 && (
                        <div className="mt-12">
                          <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {view === 'finder' && (
                  <Suspense fallback={<LoadingSpinner />}>
                    <ToolFinder tools={tools} />
                  </Suspense>
                )}
                {view === 'compare' && (
                  <Suspense fallback={<LoadingSpinner />}>
                    <CompareTools tools={tools} />
                  </Suspense>
                )}
                {view === 'personas' && (
                  <Suspense fallback={<LoadingSpinner />}>
                    <PersonaRecommendations tools={tools} />
                  </Suspense>
                )}
                {view === 'prompts' && (
                  <Suspense fallback={<LoadingSpinner />}>
                    <PromptExplorer />
                  </Suspense>
                )}
                {view === 'workflows' && (
                  <Suspense fallback={<LoadingSpinner />}>
                    <WorkflowBuilder tools={tools} />
                  </Suspense>
                )}
                {view === 'learning' && (
                  <Suspense fallback={<LoadingSpinner />}>
                    <AILearningHub />
                  </Suspense>
                )}
                {view === 'dictionary' && (
                  <Suspense fallback={<LoadingSpinner />}>
                    <AITermsDictionary />
                  </Suspense>
                )}
                {view === 'weekly' && (
                  <Suspense fallback={<LoadingSpinner />}>
                    <WeeklyRecommendations tools={tools} />
                  </Suspense>
                )}
                {view === 'submit' && (
                  <Suspense fallback={<LoadingSpinner />}>
                    <SubmitTool onClose={() => setView('grid')} />
                  </Suspense>
                )}
              </main>
            } />
          </Routes>

          <Suspense fallback={<LoadingSpinner />}>
            <Footer />
          </Suspense>
        </div>

        {showAuthModal && (
          <AuthModal onClose={() => setShowAuthModal(false)} />
        )}

        {/* Mobile Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40">
          <nav className="grid grid-cols-5 gap-1 p-2">
            {navItems.slice(0, 5).map(item => (
              <button
                key={item.label}
                onClick={() => setView(item.view as any)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${view === item.view
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            ))}
          </nav>
          <nav className="grid grid-cols-5 gap-1 p-2 border-t border-gray-200 dark:border-gray-700">
            {navItems.slice(5).map(item => (
              <button
                key={item.label}
                onClick={() => setView(item.view as any)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${view === item.view
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </Router>
  );
}

export default App;