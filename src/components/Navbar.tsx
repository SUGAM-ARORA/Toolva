import { FC, useState, useEffect } from 'react';
import { Menu, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import UserMenu from './UserMenu';

// Props definition matching usage in App.tsx
interface NavbarProps {
    showSidebar: boolean;
    setShowSidebar: (show: boolean) => void;
    isDark: boolean;
    onToggleTheme: () => void;
    user: any;
    setShowAuthModal: (show: boolean) => void;
    navItems: {
        label: string;
        icon: any;
        view: string;
    }[];
    currentView: string;
    onViewChange: (view: string) => void;
    onSearch?: (query: string) => void;
    searchQuery?: string;
}

const Navbar: FC<NavbarProps> = ({
    showSidebar,
    setShowSidebar,
    isDark,
    onToggleTheme,
    user,
    setShowAuthModal,
    navItems,
    currentView,
    onViewChange,
    onSearch,
    searchQuery = ''
}) => {
    const [scrolled, setScrolled] = useState(false);
    const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle search
    const handleSearch = (query: string) => {
        setLocalSearchQuery(query);
        if (onSearch) {
            onSearch(query);
        }
        if (currentView !== 'grid' && query.trim()) {
            onViewChange('grid');
        }
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled
                    ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-sm'
                    : 'bg-white dark:bg-gray-900'
            } border-b border-gray-200 dark:border-gray-800`}
        >
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 relative">
                    
                    {/* Left: Logo */}
                    <div className="flex items-center gap-3 flex-shrink-0 ml-0 sm:ml-4 lg:ml-12">
                        <button
                            onClick={() => setShowSidebar(!showSidebar)}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors lg:hidden"
                            aria-label="Toggle menu"
                        >
                            <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        </button>
                        
                        <Link to="/" className="flex items-center gap-2.5 group">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg group-hover:shadow-xl transition-shadow">
                                T
                            </div>
                            <span className="text-xl font-semibold text-gray-900 dark:text-white hidden sm:block">
                                Toolva
                            </span>
                        </Link>
                    </div>

                    {/* Center: Navigation (Desktop) */}
                    <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
                        {navItems.map((item) => {
                            const isActive = currentView === item.view;
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.view}
                                    onClick={() => onViewChange(item.view)}
                                    className={`relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                        isActive
                                            ? 'text-blue-600 dark:text-blue-400'
                                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                                >
                                    <span className="flex items-center gap-1.5">
                                        <Icon className="h-4 w-4" />
                                        <span>{item.label}</span>
                                    </span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-lg -z-10"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-auto lg:ml-0 mr-0 sm:mr-4 lg:mr-12">
                        {/* Search */}
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search tools..."
                                value={localSearchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-48 lg:w-56 pl-9 pr-4 py-1.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400"
                            />
                        </div>

                        {/* Search Icon (Mobile) */}
                        <button
                            onClick={() => onViewChange('finder')}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Search"
                        >
                            <Search className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        </button>

                        <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />

                        {user ? (
                            <UserMenu user={user} />
                        ) : (
                            <button
                                onClick={() => setShowAuthModal(true)}
                                className="hidden sm:flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:shadow-lg transition-all"
                            >
                                Sign In
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
