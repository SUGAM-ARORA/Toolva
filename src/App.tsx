import { useState, useEffect } from 'react';
import { Menu, Search, Filter, Zap, BookOpen } from 'lucide-react';
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
import { motion, AnimatePresence } from 'framer-motion';

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
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 12;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-transparent backdrop-blur-md bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setShowMobileSidebar(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-300"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-bold text-white ml-2 lg:ml-0">
                Toolva
              </h1>
            </div>

            <div className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-300 hover:text-white">Home</a>
              <a href="#" className="text-gray-300 hover:text-white">About</a>
              <a href="#" className="text-gray-300 hover:text-white">Contact</a>
            </div>

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

      {/* Hero Section */}
      {view === 'grid' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative min-h-screen bg-gray-900 text-white pt-16"
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#1a237e,_transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#0d47a1,_transparent_50%)]" />
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Discover the Best AI Tools
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-12">
                Browse our directory of {aiTools.length}+ AI tools to find the right solution for your needs
              </p>

              <div className="relative max-w-2xl mx-auto mb-12">
                <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20"></div>
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
                transition={{ delay: 0.2, duration: 0.8 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
              >
                {categories.slice(0, 8).map((category, index) => (
                  <motion.button
                    key={category.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`p-4 rounded-xl backdrop-blur-sm border border-white/20 transition-all ${
                      selectedCategory === category.name
                        ? 'bg-blue-600/30 border-blue-400'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <category.icon className="h-6 w-6 mb-2 mx-auto text-blue-400" />
                    <span className="text-sm font-medium">{category.name}</span>
                  </motion.button>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="flex justify-center space-x-4"
              >
                <button
                  onClick={() => setView('finder')}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-medium"
                >
                  AI Finder
                </button>
                <button
                  onClick={() => setView('compare')}
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 font-medium"
                >
                  Compare Tools
                </button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="flex-1 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            <AnimatePresence>
              {showMobileSidebar && (
                <motion.div
                  initial={{ x: -300 }}
                  animate={{ x: 0 }}
                  exit={{ x: -300 }}
                  className="fixed inset-y-0 left-0 z-40"
                >
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
                </motion.div>
              )}
            </AnimatePresence>

            <div className="hidden lg:block">
              <Sidebar
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                onPriceFilterChange={() => {}}
                onRatingFilterChange={() => {}}
                onUserCountFilterChange={() => {}}
                isOpen={true}
                onClose={() => {}}
              />
            </div>

            <div className="flex-1">
              {view === 'grid' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedTools.map((tool, index) => (
                      <motion.div
                        key={tool.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                      >
                        <ToolCard
                          tool={tool}
                          onFavorite={() => handleFavorite(tool.name)}
                          isFavorited={favorites.includes(tool.name)}
                        />
                      </motion.div>
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
                </motion.div>
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
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700">
        <nav className="flex justify-around p-2">
          <button
            onClick={() => setView('grid')}
            className={`p-2 rounded-md ${
              view === 'grid'
                ? 'text-blue-400'
                : 'text-gray-400'
            }`}
          >
            <BookOpen className="h-6 w-6" />
          </button>
          <button
            onClick={() => setView('finder')}
            className={`p-2 rounded-md ${
              view === 'finder'
                ? 'text-blue-400'
                : 'text-gray-400'
            }`}
          >
            <Search className="h-6 w-6" />
          </button>
          <button
            onClick={() => setView('compare')}
            className={`p-2 rounded-md ${
              view === 'compare'
                ? 'text-blue-400'
                : 'text-gray-400'
            }`}
          >
            <Filter className="h-6 w-6" />
          </button>
          <button
            onClick={() => setView('submit')}
            className={`p-2 rounded-md ${
              view === 'submit'
                ? 'text-blue-400'
                : 'text-gray-400'
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