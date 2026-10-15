import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Users,
  Settings, 
  LogOut, 
  Star, 
  Wrench, 
  Shield, 
  Trophy, 
  Target, 
  Gift, 
  Activity, 
  Clock, 
  Heart, 
  Bookmark, 
  Globe, 
  Brain, 
  Book, 
  Lightbulb, 
  CreditCard 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { getUserExpertise, ExpertiseProgress, isUserSuperAdmin } from '../lib/auth';

interface User {
  id: string | number;
  email: string;
  user_metadata?: {
    name?: string;
    avatar_url?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

interface UserMenuProps {
  user: User;
  onViewChange?: (view: string) => void;
}

type MenuItem = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  count?: number;
  badge?: string;
  color?: string;
  onClick?: () => void;
};

type MenuSection = {
  title: string;
  items: MenuItem[];
};

const UserMenu: React.FC<UserMenuProps> = ({ user, onViewChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [expertise, setExpertise] = useState<ExpertiseProgress>(() => getUserExpertise());
  const [userStats, setUserStats] = useState({
    favorites: 0,
    bookmarks: 0,
    reviews: 0,
    contributions: 0,
    reputation: 0,
    achievements: 0,
    streak: 0,
    languages: 0
  });

  const navigate = useNavigate();

  const userRole = (user as any)?.role || 'visitor';
  const isSuperAdmin = userRole === 'superadmin' || user.email === 'sugamarora@gmail.com';
  const isAdmin = userRole === 'admin' || isSuperAdmin;

  useEffect(() => {
    fetchUserStats();

    const handleExpertiseChange = () => setExpertise(getUserExpertise());
    window.addEventListener('expertise-change', handleExpertiseChange);
    return () => window.removeEventListener('expertise-change', handleExpertiseChange);
  }, [user?.id]);

  const fetchUserStats = async () => {
    try {
      const stored = localStorage.getItem('toolva_favorites');
      const count = stored ? JSON.parse(stored).length : 4;
      setUserStats(prev => ({ ...prev, favorites: count }));
    } catch {
      setUserStats(prev => ({ ...prev, favorites: 4 }));
    }
  };

  const handleSignOut = async () => {
    try {
      localStorage.removeItem('toolva_token');
      localStorage.removeItem('toolva_user');
      window.dispatchEvent(new Event('auth-change'));
      toast.success('Signed out successfully');
      navigate('/');
    } catch (err) {
      console.error('Error signing out:', err);
      toast.error('Failed to sign out');
    }
  };

  const isSuperAdminOrOwner = isUserSuperAdmin(user as any);

  const menuSections: MenuSection[] = [
    ...(isSuperAdminOrOwner ? [{
      title: 'SuperAdmin & Owner Controls',
      items: [
        { label: 'User Management (10 Roles)', icon: Users, href: '/users', color: 'text-purple-500', onClick: () => onViewChange?.('users') },
        { label: 'Activity Logs Tracker', icon: Activity, href: '/activity', color: 'text-emerald-500', onClick: () => onViewChange?.('activity') },
        { label: 'Admin Control Panel', icon: Shield, href: '/admin', color: 'text-rose-500', onClick: () => onViewChange?.('admin') }
      ]
    }] : []),
    {
      title: 'Account & Profile',
      items: [
        { label: 'My Profile', icon: User, href: '/profile', color: 'text-orange-500' },
        { label: 'Saved Favorites', icon: Heart, href: '/favorites', color: 'text-red-500', count: userStats.favorites },
        { label: 'Account Settings', icon: Settings, href: '/settings', color: 'text-purple-500' }
      ]
    },
    {
      title: 'Explore & Tools',
      items: [
        { label: 'AI Finder & Search', icon: Brain, href: '/', color: 'text-blue-500', onClick: () => onViewChange?.('finder') },
        { label: 'Compare AI Tools', icon: Wrench, href: '/', color: 'text-emerald-500', onClick: () => onViewChange?.('compare') },
        { label: 'Prompt Explorer', icon: Lightbulb, href: '/', color: 'text-amber-500', onClick: () => onViewChange?.('prompts') }
      ]
    },
    {
      title: 'Help & Support',
      items: [
        { label: 'Help & FAQs', icon: Book, href: '/help', color: 'text-teal-500' },
        { label: 'Contact Support', icon: Globe, href: '/contact', color: 'text-indigo-500' }
      ]
    }
  ];

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => {
          setIsOpen(false);
          navigate('/profile');
        }}
        className="flex items-center space-x-2.5 px-3.5 py-2 rounded-2xl bg-white dark:bg-[#141721] hover:bg-gray-100 dark:hover:bg-[#1c202f] transition-all border border-gray-200 dark:border-gray-800 shadow-lg backdrop-blur-md cursor-pointer group"
        title="View Profile & Account Settings"
      >
        <div className="relative">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 via-amber-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md overflow-hidden group-hover:scale-105 transition-transform">
            {(user as any)?.avatar_url ? (
              <img
                src={(user as any).avatar_url}
                alt={(user as any)?.name || 'User'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : null}
            <span className="font-extrabold uppercase">
              {(user as any)?.name?.[0]?.toUpperCase() || (user as any)?.email?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
        </div>
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-xs font-black text-gray-900 dark:text-white leading-tight flex items-center gap-1.5 group-hover:text-orange-500 transition-colors">
            {(user as any)?.name || user?.email?.split('@')[0] || 'User'}
            <span className="bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 text-[10px] px-1.5 py-0.2 rounded-md font-mono font-bold">
              {expertise.role}
            </span>
          </span>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
            {expertise.toolsOpenedCount} tools opened
          </span>
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#141721] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden z-50"
          >
            <Link 
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="block bg-gradient-to-r from-orange-500 via-amber-500 to-purple-600 p-6 text-white hover:opacity-95 transition-opacity cursor-pointer group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center overflow-hidden shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                  {(user as any)?.avatar_url ? (
                    <img
                      src={(user as any).avatar_url}
                      alt={(user as any)?.name || 'User'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold">
                      {(user as any)?.name?.[0]?.toUpperCase() || (user as any)?.email?.[0]?.toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-black leading-tight group-hover:underline">{(user as any)?.name || 'User'}</h3>
                  <p className="text-xs text-white/90">{user?.email || 'user@toolva.com'}</p>
                  <div className="flex items-center space-x-1.5 mt-1">
                    <span className="bg-white/20 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                      Rank: {expertise.role}
                    </span>
                    <span className="text-[10px] text-white/80 font-mono">
                      ({expertise.toolsOpenedCount} tools)
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            <div className="py-2 max-h-[calc(100vh-300px)] overflow-y-auto">
              {menuSections.map((section, index) => (
                <div key={index} className="px-2 py-1">
                  <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-500 font-mono">
                    {section.title}
                  </div>
                  {section.items.map((item, itemIndex) => (
                    <motion.div
                      key={itemIndex}
                      whileHover={{ x: 3 }}
                      className="relative"
                    >
                      <Link
                        to={item.href}
                        className="flex items-center px-3 py-2 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        onClick={() => {
                          setIsOpen(false);
                          if (item.onClick) item.onClick();
                        }}
                      >
                        <item.icon className={`w-4 h-4 mr-3 ${item.color}`} />
                        <span className="flex-1">{item.label}</span>
                        {item.count !== undefined && item.count > 0 && (
                          <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-orange-500/10 text-orange-500 rounded-full">
                            {item.count}
                          </span>
                        )}
                      </Link>
                    </motion.div>
                  ))}
                  {index < menuSections.length - 1 && (
                    <div className="my-1 border-b border-gray-100 dark:border-gray-800/80" />
                  )}
                </div>
              ))}

              <div className="p-2 border-t border-gray-100 dark:border-gray-800/80 mt-1">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center px-3 py-2 rounded-xl text-xs font-bold text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;