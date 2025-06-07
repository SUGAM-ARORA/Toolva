import { lazy, Suspense } from 'react';
import { useState, useEffect } from 'react';
import { Menu, Search, Filter, Zap, BookOpen, Users, Brain, Workflow, Book, Trophy, GraduationCap } from 'lucide-react';
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
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [view, setView] = useState<'grid' | 'finder' | 'compare' | 'submit' | 'personas' | 'prompts' | 'workflows' | 'learning' | 'dictionary' | 'weekly'>('grid');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [bookmarkedTools, setBookmarkedTools] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
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
      console.error('Error fetching tools:', error);
      toast.error('Failed to load tools');
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
          setBookmarkedTools([]);
          return;
        }

        setUser(session?.user ?? null);
        if (session?.user) {
          fetchFavorites(session.user.id);
          fetchBookmarkedTools(session.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        await supabase.auth.signOut();
        setUser(null);
        setFavorites([]);
        setBookmarkedTools([]);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchFavorites(session.user.id);
          fetchBookmarkedTools(session.user.id);
        } else {
          setFavorites([]);
          setBookmarkedTools([]);
        }
      } else if (event === 'SIGNED_IN') {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchFavorites(session.user.id);
          fetchBookmarkedTools(session.user.id);
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

  const fetchBookmarkedTools = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('tool_id')
        .eq('user_id', userId);

      if (error) throw error;
      setBookmarkedTools(data.map(b => b.tool_id));
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
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
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('tool_id', toolId);

        if (error) throw error;
        setFavorites(favorites.filter(id => id !== toolId));
        toast.success('Removed from favorites');
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert([{ user_id: user.id, tool_id: toolId }]);

        if (error) {
          // Handle duplicate key constraint violation
          if (error.code === '23505') {
            // Item already exists, update local state to reflect this
            if (!favorites.includes(toolId)) {
              setFavorites([...favorites, toolId]);
            }
            toast.success('Already in favorites');
            return;
          }
          throw error;
        }
        setFavorites([...favorites, toolId]);
        toast.success('Added to favorites');
      }
      
      // Re-fetch to ensure state synchronization
      await fetchFavorites(user.id);
    } catch (error) {
      console.error('Error managing favorites:', error);
      toast.error('Failed to update favorites');
      // Re-fetch to ensure state synchronization even on error
      await fetchFavorites(user.id);
    }
  };

  const handleBookmark = async (toolId: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    try {
      if (bookmarkedTools.includes(toolId)) {
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('tool_id', toolId);

        if (error) throw error;
        setBookmarkedTools(bookmarkedTools.filter(id => id !== toolId));
        toast.success('Removed from bookmarks');
      } else {
        const { error } = await supabase
          .from('bookmarks')
          .insert([{ user_id: user.id, tool_id: toolId }]);

        if (error) {
          // Handle duplicate key constraint violation
          if (error.code === '23505') {
            // Item already exists, update local state to reflect this
            if (!bookmarkedTools.includes(toolId)) {
              setBookmarkedTools([...bookmarkedTools, toolId]);
            }
            toast.success('Already bookmarked');
            return;
          }
          throw error;
        }
        setBookmarkedTools([...bookmarkedTools, toolId]);
        toast.success('Added to bookmarks');
      }
      
      // Re-fetch to ensure state synchronization
      await fetchBookmarkedTools(user.id);
    } catch (error) {
      console.error('Error managing bookmarks:', error);
      toast.error('Failed to update bookmarks');
      // Re-fetch to ensure state synchronization even on error
      await fetchBookmarkedTools(user.id);
    }
  };

  // Handle category selection from hero section
  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
    // Scroll to tools section
    const toolsSection = document.getElementById('tools-section');
    if (toolsSection) {
      toolsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const filteredTools = tools.filter(tool => 
    (selectedCategory === 'All' || tool.category === selectedCategory) &&
    (searchQuery === '' || 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredTools.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTools = filteredTools.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

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
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                onClose={() => setShowSidebar(false)}
                onFilterChange={() => {}}
                toolsCount={tools.length}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 flex flex-col">
          <header className="fixed top-0 left-0 right-0 z-30 bg-white dark:bg-gray-800 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <button
                    onClick={() => setShowSidebar(!showSidebar)}
                    className="p-2 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <Menu className="h-6 w-6" />
                  </button>
                  <Link to="/" className="flex items-center">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white ml-2">
                      Toolva
                    </h1>
                  </Link>
                </div>

                <nav className="hidden lg:flex space-x-2">
                  {navItems.map(item => (
                    <button
                      key={item.label}
                      onClick={() => setView(item.view as any)}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                        view === item.view
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <item.icon className="h-5 w-5 inline-block mr-1" />
                      {item.label}
                    </button>
                  ))}
                </nav>

                <div className="flex items-center space-x-4">
                  <ThemeToggle isDark={isDark} onToggle={handleToggleTheme} />
                  {user ? (
                    <UserMenu user={user} />
                  ) : (
                    <button
                      onClick={() => setShowAuthModal(true)}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      Sign In
                    </button>
                  )}
                </div>
              </div>
            </div>
          </header>

          <Routes>
            <Route path="/profile" element={<Profile />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/" element={
              <main className="flex-1 pt-16 pb-20">
                {view === 'grid' && (
                  <div className="bg-gray-900 min-h-[500px] relative">
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#1a237e,_transparent_50%)]" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#0d47a1,_transparent_50%)]" />
                      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                    </div>

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-center max-w-4xl mx-auto"
                      >
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                          Discover the Best AI Tools
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-12">
                          Browse our directory of {tools.length}+ AI tools to find the right solution for your needs
                        </p>

                        <div className="relative max-w-2xl mx-auto mb-12">
                          <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20" />
                          <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder="Search AI tools by name, description, or category..."
                              className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4, duration: 0.8 }}
                          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-12 px-4"
                        >
                          {categories.slice(0, 8).map((category) => {
                            const Icon = category.icon;
                            return (
                              <motion.button
                                key={category.name}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleCategorySelect(category.name)}
                                className={`flex flex-col items-center justify-center p-4 sm:p-6 rounded-xl backdrop-blur-sm border border-white/20 transition-all ${
                                  selectedCategory === category.name
                                    ? 'bg-blue-600/30 border-blue-400'
                                    : 'bg-white/5 hover:bg-white/10'
                                }`}
                              >
                                <Icon className="mb-2 text-xl sm:text-2xl text-blue-400" />
                                <span className="mt-1 text-xs sm:text-sm font-semibold text-white">{category.name}</span>
                              </motion.button>
                            );
                          })}
                        </motion.div>
                      </motion.div>
                    </div>
                  </div>
                )}

                <div id="tools-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  {view === 'grid' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {[...Array(8)].map((_, index) => (
                            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 animate-pulse">
                              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {paginatedTools.map((tool, index) => (
                            <motion.div
                              key={tool.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1, duration: 0.5 }}
                              className="h-full"
                            >
                              <Suspense fallback={<LoadingSpinner />}>
                                <ToolCard
                                  tool={tool}
                                  onFavorite={() => handleFavorite(tool.id)}
                                  isFavorited={favorites.includes(tool.id)}
                                  onBookmark={() => handleBookmark(tool.id)}
                                  isBookmarked={bookmarkedTools.includes(tool.id)}
                                />
                              </Suspense>
                            </motion.div>
                          ))}
                        </div>
                      )}
                      {totalPages > 1 && (
                        <div className="mt-8">
                          <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                          />
                        </div>
                      )}
                    </motion.div>
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
                </div>
              </main>
            } />
          </Routes>

          <Suspense fallback={<LoadingSpinner />}>
            <Footer />
          </Suspense>
        </div>

        {showAuthModal && (
          <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)}>
            <div className="space-y-4">
              <GitHubSignIn />
            </div>
          </AuthModal>
        )}

        {/* Mobile Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40">
          <nav className="grid grid-cols-5 gap-1 p-2">
            {navItems.slice(0, 5).map(item => (
              <button
                key={item.label}
                onClick={() => setView(item.view as any)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${
                  view === item.view
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
                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${
                  view === item.view
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