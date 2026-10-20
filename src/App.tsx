import { lazy, Suspense } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { 
  Menu, Search, Filter, Zap, BookOpen, Users, Brain, Workflow, 
  Book, Trophy, GraduationCap, RefreshCw, Cpu, Layers, DollarSign, TrendingUp, HardDrive 
} from 'lucide-react';
import { categories } from './data/categories';
import { getAllTools, mergeTools, localAITools } from './data/unifiedTools';
import { aiTools } from './data/aiTools';
import ToolvaHome from './components/ToolvaHome';
import NavigationSidebar from './components/NavigationSidebar';
import ThemeToggle from './components/ThemeToggle';
import AuthModal from './components/AuthModal';
import UserMenu from './components/UserMenu';
import LandingPage from './components/LandingPage';
import LoadingSpinner from './components/LoadingSpinner';
import toast, { Toaster } from 'react-hot-toast';
import Pagination from './components/Pagination';
import { api } from './lib/apiClient';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import ReactGA from 'react-ga4';
import { AITool } from './types';

// ── Google Analytics 4 Initialisation ──────────────────────────
// Measurement ID is also placed in index.html for pre-React loading.
// react-ga4 gives us programmatic event + page-view tracking in the SPA.
const GA_MEASUREMENT_ID = 'G-N87HLGF2NN';
ReactGA.initialize(GA_MEASUREMENT_ID);

/** Fires a GA page_view event on every React Router navigation. */
function RouteTracker() {
  const location = useLocation();
  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: location.pathname + location.search });
  }, [location]);
  return null;
}

/** Top-left home button & mobile navigation toggle */
function TopLeftHomeButton({
  onGoHome,
  currentView,
  onOpenMobileNav,
}: {
  onGoHome: () => void;
  currentView: string;
  onOpenMobileNav: () => void;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomeView = location.pathname === '/' && currentView === 'grid';

  const handleClick = () => {
    onGoHome();
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <div className="md:hidden fixed top-3 left-3 z-40 flex items-center space-x-2">
      <button
        onClick={onOpenMobileNav}
        className="p-2.5 rounded-xl bg-white/95 dark:bg-[#111625]/95 hover:bg-white dark:hover:bg-[#161d30] text-gray-700 dark:text-gray-200 shadow-lg border border-gray-200/90 dark:border-gray-800/90 backdrop-blur-md cursor-pointer"
        title="Open Navigation Menu"
        id="mobile-nav-toggle"
      >
        <Menu className="w-5 h-5 text-cyan-500" />
      </button>

      <button
        onClick={handleClick}
        className="group flex items-center space-x-2 px-3 py-2 bg-white/95 dark:bg-[#111625]/95 hover:bg-white dark:hover:bg-[#161d30] text-gray-800 dark:text-white rounded-xl shadow-lg border border-gray-200/90 dark:border-gray-800/90 backdrop-blur-md transition-all active:scale-95 cursor-pointer"
        title="Return to ToolVa Home"
        id="top-left-home-button"
      >
        <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-500 via-sky-400 to-blue-600 flex items-center justify-center font-black text-white text-xs shadow-md shadow-cyan-500/25 shrink-0">
          T
        </div>
        <div className="flex flex-col text-left">
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-black uppercase tracking-wider font-mono text-gray-900 dark:text-gray-100">
              TOOLVA<span className="text-cyan-500 font-extrabold">.AI</span>
            </span>
            {!isHomeView && (
              <span className="text-[9px] bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 font-bold px-1.5 py-0.5 rounded-full border border-cyan-500/30">
                ← Home
              </span>
            )}
          </div>
        </div>
      </button>
    </div>
  );
}

// Lazy load components & pages
const Profile = lazy(() => import('./pages/Profile'));
const Favorites = lazy(() => import('./pages/Favorites'));
const Settings = lazy(() => import('./pages/Settings'));
const HelpFAQ = lazy(() => import('./pages/HelpFAQ'));
const Contact = lazy(() => import('./pages/Contact'));
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
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const ActivityLogs = lazy(() => import('./components/ActivityLogs'));
const UserManagement = lazy(() => import('./components/UserManagement'));
const ContactHelp = lazy(() => import('./components/ContactHelp'));
const HardwareBenchmarks = lazy(() => import('./components/HardwareBenchmarks'));
const AIStackPlanner = lazy(() => import('./components/AIStackPlanner'));
const CostEstimator = lazy(() => import('./components/CostEstimator'));
const MomentumIndex = lazy(() => import('./components/MomentumIndex'));
const ToolDetailModal = lazy(() => import('./components/ToolDetailModal'));
const LocalAICompatibilityEngine = lazy(() => import('./components/LocalAICompatibilityEngine'));

function App() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });
  const [themePreset, setThemePreset] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('toolva_theme_preset') || 'cyan';
    }
    return 'cyan';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme-preset', themePreset);
    localStorage.setItem('toolva_theme_preset', themePreset);
  }, [themePreset]);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [view, setView] = useState<'grid' | 'finder' | 'compare' | 'submit' | 'personas' | 'prompts' | 'workflows' | 'learning' | 'dictionary' | 'weekly' | 'benchmarks' | 'planner' | 'estimator' | 'momentum' | 'local-ai' | string>('grid');
  const [selectedModalTool, setSelectedModalTool] = useState<AITool | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  const handleGoHome = useCallback(() => {
    setView('grid');
    setSelectedCategory('All');
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [user, setUser] = useState<any>(null);
  const isAuthenticated = !!user;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  // Immediately seed with local tools so Griha is never empty
  const [tools, setTools] = useState<AITool[]>(localAITools);
  const [isLoading, setIsLoading] = useState(false); // no full-screen spinner; we already have data
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasEntered, setHasEntered] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('hasEnteredToolva') === 'true';
    }
    return false;
  });
  const itemsPerPage = 12;

  const handleEnterApp = () => {
    setHasEntered(true);
    sessionStorage.setItem('hasEnteredToolva', 'true');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    syncTools();
  }, []);

  const syncTools = useCallback(async () => {
    setIsSyncing(true);
    try {
      let backendTools: AITool[] = [];
      try {
        const data = await api.get('/tools');
        if (Array.isArray(data) && data.length > 0) {
          backendTools = data;
        }
      } catch (e) {
        // Backend offline or empty — fallback to local catalog
      }

      const merged = await getAllTools(backendTools);
      if (merged.length > 0) setTools(merged);
    } catch (err) {
      // Stay with local tools silently
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // GA scripts are loaded from index.html; react-ga4 is initialised at module level above.

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem('toolva_user');
        const token = localStorage.getItem('toolva_token');

        if (storedUser && token) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          fetchFavorites();
        } else {
          setUser(null);
          setFavorites([]);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        localStorage.removeItem('toolva_user');
        localStorage.removeItem('toolva_token');
        setUser(null);
        setFavorites([]);
      }
    };

    initializeAuth();

    // Listen for custom auth changes (e.g. from login/logout)
    const handleAuthChange = () => {
      initializeAuth();
    };

    window.addEventListener('auth-change', handleAuthChange);

    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  const fetchFavorites = async () => {
    try {
      const data = await api.get('/user/favorites');
      setFavorites(data.map((f: any) => f.tool_id));
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setFavorites([]);
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
        await api.delete(`/user/favorites/${toolId}`);
        setFavorites(favorites.filter(id => id !== toolId));
        toast.success('Removed from favorites');
      } else {
        // Insert new favorite
        await api.post(`/user/favorites/${toolId}`, {});
        setFavorites([...favorites, toolId]);
        toast.success('Added to favorites');
      }
    } catch (error) {
      console.error('Error managing favorites:', error);
      toast.error('Failed to update favorites');
      // Re-fetch to ensure state synchronization
      await fetchFavorites();
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
    { label: 'AI Directory', icon: BookOpen, view: 'grid' },
    { label: 'Local-AI Compatibility', icon: Cpu, view: 'local-ai' },
    { label: 'Hardware Benchmarks', icon: HardDrive, view: 'benchmarks' },
    { label: 'AI Stack Planner', icon: Layers, view: 'planner' },
    { label: 'Cost Estimator', icon: DollarSign, view: 'estimator' },
    { label: 'GitHub Momentum', icon: TrendingUp, view: 'momentum' },
    { label: 'AI Finder', icon: Search, view: 'finder' },
    { label: 'Tool Compare', icon: Filter, view: 'compare' },
    { label: 'Workflow Builder', icon: Workflow, view: 'workflows' },
    { label: 'Prompt Studio', icon: Brain, view: 'prompts' },
    { label: 'Learning Hub', icon: GraduationCap, view: 'learning' },
    { label: 'AI Dictionary', icon: Book, view: 'dictionary' },
    { label: 'Weekly Leaderboard', icon: Trophy, view: 'weekly' },
    { label: 'Submit Tool', icon: Zap, view: 'submit' }
  ];

  return (
    <Router>
      {/* Track every SPA route change as a GA page_view */}
      <RouteTracker />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex overflow-x-hidden">
        <Toaster position="top-right" />
        
        <AnimatePresence mode="wait">
          {!hasEntered && (
            <motion.div 
              key="landing"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="fixed inset-0 z-[100] bg-[#0B0F19]"
            >
              <LandingPage onEnter={handleEnterApp} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Left Navigation Sidebar (Desktop Dock + Mobile Drawer) */}
        <NavigationSidebar
          currentView={view}
          onViewChange={(v: string) => setView(v)}
          onGoHome={handleGoHome}
          user={user}
          isMobileOpen={isMobileNavOpen}
          onCloseMobile={() => setIsMobileNavOpen(false)}
        />

        {/* Mobile Top Navigation & Home Brand Button */}
        <TopLeftHomeButton
          onGoHome={handleGoHome}
          currentView={view}
          onOpenMobileNav={() => setIsMobileNavOpen(true)}
        />

        {/* Top-Right Floating User Menu, Theme Toggle & Account Actions */}
        <div className="fixed top-4 right-4 z-40 flex items-center space-x-2">
          <ThemeToggle
            isDark={isDark}
            onToggle={handleToggleTheme}
          />

          {user ? (
            <UserMenu user={user} onViewChange={setView} />
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Sign In / Join</span>
            </button>
          )}
        </div>

        <div className="flex-1 flex flex-col md:pl-16 min-w-0 transition-all duration-300">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/profile" element={<Profile />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/help" element={<HelpFAQ />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/users" element={<UserManagement onBackToHome={handleGoHome} />} />
              <Route path="/activity" element={<ActivityLogs onBackToHome={handleGoHome} onBackToAdmin={() => setView('admin')} />} />
              <Route path="/admin" element={<AdminDashboard onBackToHome={handleGoHome} onViewActivityLogs={() => setView('activity-logs')} />} />
              <Route path="/" element={
              <main className="flex-1 pt-0 pb-20">
                {view === 'grid' && (
                  <ToolvaHome
                    tools={tools}
                    selectedCategory={selectedCategory}
                    onCategorySelect={handleCategorySelect}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onToolSelect={(tool) => {
                      setSelectedModalTool(tool);
                    }}
                    onToggleFavorite={handleFavorite}
                    favorites={favorites}
                    onOpenSubmit={() => setView('submit')}
                    onViewChange={(v: string) => setView(v)}
                    isAuthenticated={isAuthenticated}
                    onOpenAuth={() => setShowAuthModal(true)}
                    navItems={navItems}
                    currentView={view}
                  />
                )}
                  {view === 'finder' && (
                    <Suspense fallback={<LoadingSpinner />}>
                      <SmartRecommender onBackToHome={handleGoHome} />
                    </Suspense>
                  )}
                  {view === 'compare' && (
                    <Suspense fallback={<LoadingSpinner />}>
                      <CompareTools tools={tools} onBackToHome={handleGoHome} />
                    </Suspense>
                  )}
                  {view === 'personas' && (
                    <Suspense fallback={<LoadingSpinner />}>
                      <PersonaRecommendations tools={tools} onBackToHome={handleGoHome} />
                    </Suspense>
                  )}
                  {view === 'prompts' && (
                    <Suspense fallback={<LoadingSpinner />}>
                      <PromptExplorer onBackToHome={handleGoHome} />
                    </Suspense>
                  )}
                  {view === 'workflows' && (
                    <Suspense fallback={<LoadingSpinner />}>
                      <WorkflowBuilder tools={tools} onBackToHome={handleGoHome} />
                    </Suspense>
                  )}
                  {view === 'learning' && (
                    <Suspense fallback={<LoadingSpinner />}>
                      <AILearningHub onBackToHome={handleGoHome} />
                    </Suspense>
                  )}
                  {view === 'dictionary' && (
                    <Suspense fallback={<LoadingSpinner />}>
                      <AITermsDictionary onBackToHome={handleGoHome} />
                    </Suspense>
                  )}
                  {view === 'weekly' && (
                    <Suspense fallback={<LoadingSpinner />}>
                      <WeeklyRecommendations tools={tools} onBackToHome={handleGoHome} />
                    </Suspense>
                  )}
                  {view === 'submit' && (
                    <Suspense fallback={<LoadingSpinner />}>
                      <SubmitTool onClose={handleGoHome} onOpenAuth={() => setShowAuthModal(true)} />
                    </Suspense>
                  )}
                  {view === 'admin' && (
                    <Suspense fallback={<LoadingSpinner />}>
                      <AdminDashboard onBackToHome={handleGoHome} onViewActivityLogs={() => setView('activity-logs')} />
                    </Suspense>
                  )}
                  {view === 'users' && (
                    <Suspense fallback={<LoadingSpinner />}>
                      <UserManagement onBackToHome={handleGoHome} />
                    </Suspense>
                  )}
                  {(view === 'activity' || view === 'activity-logs') && (
                    <Suspense fallback={<LoadingSpinner />}>
                      <ActivityLogs onBackToHome={handleGoHome} onBackToAdmin={() => setView('admin')} />
                    </Suspense>
                  )}
                  {view === 'local-ai' && (
                    <Suspense fallback={<LoadingSpinner />}>
                      <LocalAICompatibilityEngine onBackToHome={handleGoHome} />
                    </Suspense>
                  )}
                  {view === 'benchmarks' && (
                    <Suspense fallback={<LoadingSpinner />}>
                      <HardwareBenchmarks onBackToHome={handleGoHome} />
                    </Suspense>
                  )}
                  {view === 'planner' && (
                    <Suspense fallback={<LoadingSpinner />}>
                      <AIStackPlanner tools={tools} onBackToHome={handleGoHome} onToolSelect={(tool) => setSelectedModalTool(tool)} />
                    </Suspense>
                  )}
                  {view === 'estimator' && (
                    <Suspense fallback={<LoadingSpinner />}>
                      <CostEstimator onBackToHome={handleGoHome} />
                    </Suspense>
                  )}
                  {view === 'momentum' && (
                    <Suspense fallback={<LoadingSpinner />}>
                      <MomentumIndex tools={tools} onBackToHome={handleGoHome} onToolSelect={(tool) => setSelectedModalTool(tool)} />
                    </Suspense>
                  )}
                  {view === 'contact' && (
                    <Suspense fallback={<LoadingSpinner />}>
                      <ContactHelp onBackToHome={handleGoHome} />
                    </Suspense>
                  )}
              </main>
            } />
          </Routes>
        </Suspense>

          <Suspense fallback={<LoadingSpinner />}>
            <Footer onViewChange={(v: any) => setView(v)} />
          </Suspense>
        </div>

        {showAuthModal && (
          <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)}>
            <div className="space-y-4">
            </div>
          </AuthModal>
        )}

        {selectedModalTool && (
          <Suspense fallback={null}>
            <ToolDetailModal
              tool={selectedModalTool}
              isOpen={!!selectedModalTool}
              onClose={() => setSelectedModalTool(null)}
              onToggleFavorite={handleFavorite}
              isFavorite={favorites.includes(selectedModalTool.id)}
            />
          </Suspense>
        )}
      </div>
    </Router>
  );
}

export default App;