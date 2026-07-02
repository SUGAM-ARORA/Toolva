import { lazy, Suspense } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Menu, Search, Filter, Zap, BookOpen, Users, Brain, Workflow, Book, Trophy, GraduationCap, RefreshCw } from 'lucide-react';
import { categories } from './data/categories';
import { getAllTools, mergeTools, localAITools } from './data/unifiedTools';
import { aiTools } from './data/aiTools';
import Sidebar from './components/Sidebar';
import TAAFTHome from './components/TAAFTHome';
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
import { getAllTools, localAITools } from './data/unifiedTools';

// Lazy load components
const ToolCard = lazy(() => import('./components/ToolCard'));
const ToolFinder = lazy(() => import('./components/ToolFinder'));
const CompareTools = lazy(() => import('./components/CompareTools'));
const PersonaRecommendations = lazy(() => import('./components/PersonaRecommendations'));
const SmartRecommender = lazy(() => import('./components/SmartRecommender'));
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
  const [user, setUser] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  // Immediately seed with local tools so Griha is never empty
  const [tools, setTools] = useState<AITool[]>(localAITools);
  const [isLoading, setIsLoading] = useState(false); // no full-screen spinner; we already have data
  const [isSyncing, setIsSyncing] = useState(false);
  const itemsPerPage = 12;

  useEffect(() => {
    syncTools();
  }, []);

  // Background sync: fetch Supabase + GitHub and merge into displayed tools
  const syncTools = useCallback(async () => {
    setIsSyncing(true);
    try {
      let supabaseTools: AITool[] = [];
      try {
        const { data, error } = await supabase
          .from('tools')
          .select('*')
          .eq('verified', true);
        if (!error && data && data.length > 0) supabaseTools = data;
      } catch (e) {
        // Supabase unavailable — that's fine, we have local data
      }

      const merged = await getAllTools(supabaseTools);
      if (merged.length > 0) setTools(merged);
    } catch (err) {
      // Stay with local tools silently
    } finally {
      setIsSyncing(false);
    }
  }, []);

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
              className="fixed inset-y-0 left-0 z-50 w-80 bg-[#141721] shadow-2xl"
            >
              <Sidebar
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                onClose={() => setShowSidebar(false)}
                onFilterChange={() => {}}
                toolsCount={tools.length}
                tools={tools}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Top-Left Menu Trigger Button */}
        <div className={`fixed top-4 z-40 transition-all ${view === 'grid' ? 'left-4 md:left-20' : 'left-4'}`}>
          <button
            onClick={() => setShowSidebar(true)}
            className="flex items-center space-x-2 px-3.5 py-2 bg-[#141721] hover:bg-[#1f2435] text-white rounded-xl shadow-2xl border border-gray-700/80 backdrop-blur-md transition-all hover:scale-105 group"
            title="Open Toolva Menu & Navigation"
          >
            <Menu className="h-5 w-5 text-orange-500 group-hover:rotate-90 transition-transform duration-300" />
            <span className="text-xs font-black uppercase tracking-wider font-mono text-gray-200 group-hover:text-white">
              TOOLVA<span className="text-orange-500">.AI</span>
            </span>
          </button>
        </div>

        <div className="flex-1 flex flex-col">
          <Routes>
            <Route path="/profile" element={<Profile />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/" element={
              <main className="flex-1 pt-0 pb-20">
                {view === 'grid' && (
                  <TAAFTHome
                    tools={tools}
                    selectedCategory={selectedCategory}
                    onCategorySelect={handleCategorySelect}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onToolSelect={(tool) => {
                      window.open(tool.url || tool.website || '#', '_blank');
                    }}
                    onToggleFavorite={handleFavorite}
                    favorites={favorites}
                    onOpenSidebar={() => setShowSidebar(true)}
                    onOpenSubmit={() => setView('submit')}
                  />
                )}
                  {view === 'finder' && (
                    <Suspense fallback={<LoadingSpinner />}>
                      <SmartRecommender />
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