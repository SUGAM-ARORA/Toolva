import { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, Search, Filter, Heart, Share2, Zap, BookOpen } from 'lucide-react';
import { aiTools } from './data/aiTools';
import { categories } from './data/categories';
import Sidebar from './components/Sidebar';
import ToolCard from './components/ToolCard';
import ThemeToggle from './components/ThemeToggle';
import AuthModal from './components/AuthModal';
import UserMenu from './components/UserMenu';
import ToolFinder from './components/ToolFinder';
import CompareTools from './components/CompareTools';
import SubmitTool from './components/SubmitTool';
import Footer from './components/Footer';
import toast, { Toaster } from 'react-hot-toast';
import Pagination from './components/Pagination';
import { supabase } from './lib/supabase';

function App() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [view, setView] = useState<'grid' | 'finder' | 'compare' | 'submit'>('grid');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    // Check current auth status
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const handleToggleTheme = () => {
    setIsDark(!isDark);
  };

  const handleFavorite = (toolName: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (favorites.includes(toolName)) {
      setFavorites(favorites.filter(name => name !== toolName));
      toast.success('Removed from favorites');
    } else {
      setFavorites([...favorites, toolName]);
      toast.success('Added to favorites');
    }
  };

  const filteredTools = aiTools.filter(tool => 
    selectedCategory === 'All' || tool.category === selectedCategory
  );

  const totalPages = Math.ceil(filteredTools.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTools = filteredTools.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setShowMobileSidebar(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white ml-2 lg:ml-0">
                ToolVa
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <nav className="hidden lg:flex space-x-4">
                <button
                  onClick={() => setView('grid')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    view === 'grid'
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Browse
                </button>
                <button
                  onClick={() => setView('finder')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    view === 'finder'
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  AI Finder
                </button>
                <button
                  onClick={() => setView('compare')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    view === 'compare'
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Compare
                </button>
                <button
                  onClick={() => setView('submit')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    view === 'submit'
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Submit Tool
                </button>
              </nav>

              <div className="flex items-center space-x-2">
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
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Sidebar */}
            <Sidebar
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              onPriceFilterChange={() => {}}
              onRatingFilterChange={() => {}}
              onUserCountFilterChange={() => {}}
              isOpen={showMobileSidebar}
              onClose={() => setShowMobileSidebar(false)}
            />

            {/* Main Content */}
            <div className="flex-1">
              {view === 'grid' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedTools.map(tool => (
                      <ToolCard
                        key={tool.name}
                        tool={tool}
                        onFavorite={() => handleFavorite(tool.name)}
                        isFavorited={favorites.includes(tool.name)}
                      />
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <div className="mt-8">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                      />
                    </div>
                  )}
                </>
              )}
              {view === 'finder' && <ToolFinder tools={aiTools} />}
              {view === 'compare' && <CompareTools tools={aiTools} />}
              {view === 'submit' && <SubmitTool onClose={() => setView('grid')} />}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}

      {/* Mobile Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <nav className="flex justify-around p-2">
          <button
            onClick={() => setView('grid')}
            className={`p-2 rounded-md ${
              view === 'grid'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <BookOpen className="h-6 w-6" />
          </button>
          <button
            onClick={() => setView('finder')}
            className={`p-2 rounded-md ${
              view === 'finder'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <Search className="h-6 w-6" />
          </button>
          <button
            onClick={() => setView('compare')}
            className={`p-2 rounded-md ${
              view === 'compare'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <Filter className="h-6 w-6" />
          </button>
          <button
            onClick={() => setView('submit')}
            className={`p-2 rounded-md ${
              view === 'submit'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <Zap className="h-6 w-6" />
          </button>
        </nav>
      </div>
    </div>
  );
}

export default App;