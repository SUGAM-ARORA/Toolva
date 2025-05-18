import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Settings, Heart, UserCircle, Bell, Bookmark, Clock, Star, PenTool as Tool, Code, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Key } from 'lucide-react';

interface User {
  id: string;
  email: string;
  user_metadata?: {
    name?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

interface UserMenuProps {
  user: User;
}

type MenuItem = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  count?: number;
  badge?: string;
};

type MenuSection = {
  title: string;
  items: MenuItem[];
};

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  interface Notification {
    id: string;
    user_id: string;
    message: string;
    created_at: string;
    [key: string]: unknown;
  }
    const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userStats, setUserStats] = useState({
    favorites: 0,
    bookmarks: 0,
    reviews: 0,
    contributions: 0,
    reputation: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserStats();
    fetchNotifications();
  }, [user.id]);

  const fetchUserStats = async () => {
    try {
      const { data: favorites } = await supabase
        .from('favorites')
        .select('count')
        .eq('user_id', user.id);

      const { data: reviews } = await supabase
        .from('reviews')
        .select('count')
        .eq('user_id', user.id);

      const { data: contributions } = await supabase
        .from('tools')
        .select('count')
        .eq('submitted_by', user.id);

      setUserStats({
        favorites: favorites?.[0]?.count || 0,
        bookmarks: 0, // Implement bookmarks table
        reviews: reviews?.[0]?.count || 0,
        contributions: contributions?.[0]?.count || 0,
        reputation: calculateReputation(reviews?.[0]?.count || 0, contributions?.[0]?.count || 0)
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const calculateReputation = (reviews: number, contributions: number) => {
    return (reviews * 10) + (contributions * 50);
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Signed out successfully');
      navigate('/');
    } catch (err) {
      console.error('Error signing out:', err);
      toast.error('Failed to sign out');
    }
  };

  const menuSections: MenuSection[] = [
    {
      title: 'Profile',
      items: [
        { label: 'My Profile', icon: UserCircle, href: '/profile' },
        { label: 'Favorites', icon: Heart, href: '/favorites', count: userStats.favorites },
        { label: 'Bookmarks', icon: Bookmark, href: '/bookmarks', count: userStats.bookmarks },
        { label: 'Recent Activity', icon: Clock, href: '/activity' }
      ]
    },
    {
      title: 'Contributions',
      items: [
        { label: 'My Reviews', icon: Star, href: '/reviews', count: userStats.reviews },
        { label: 'Submitted Tools', icon: Tool, href: '/submissions', count: userStats.contributions },
        { label: 'API Usage', icon: Code, href: '/api-usage' }
      ]
    },
    {
      title: 'Preferences',
      items: [
        { label: 'Settings', icon: Settings, href: '/settings' },
        { label: 'Notifications', icon: Bell, href: '/notifications', badge: notifications.length.toString() },
        { label: 'API Keys', icon: Key, href: '/api-keys' }
      ]
    }
  ];

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
            {user.user_metadata?.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
          </div>
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
              {notifications.length}
            </span>
          )}
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
          >
            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  {user.user_metadata?.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold">{user.user_metadata?.name || 'User'}</h3>
                  <p className="text-sm text-white/80">{user.email}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                <Star className="w-4 h-4 mx-auto mb-1 text-yellow-500" />
                <div className="font-bold text-gray-900 dark:text-white">{userStats.reviews}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Reviews</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                <Tool className="w-4 h-4 mx-auto mb-1 text-blue-500" />
                <div className="font-bold text-gray-900 dark:text-white">{userStats.contributions}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Tools</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                <Shield className="w-4 h-4 mx-auto mb-1 text-green-500" />
                <div className="font-bold text-gray-900 dark:text-white">{userStats.reputation}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Rep</div>
              </div>
            </div>

            <div className="py-2 max-h-[calc(100vh-300px)] overflow-y-auto">
              {menuSections.map((section, index) => (
                <div key={index} className="px-2">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {section.title}
                  </div>
                  {section.items.map((item, itemIndex) => (
                    <Link
                      key={itemIndex}
                      to={item.href}
                      className="flex items-center px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="w-4 h-4 mr-3" />
                      <span className="flex-1">{item.label}</span>
                      {item.count !== undefined && (
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-600 rounded-full">
                          {item.count}
                        </span>
                      )}
                      {item.badge && (
                        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                  {index < menuSections.length - 1 && (
                    <div className="my-2 border-b border-gray-200 dark:border-gray-700" />
                  )}
                </div>
              ))}
            </div>

            <div className="p-2 border-t border-gray-200 dark:border-gray-700">
              <motion.button
                whileHover={{ x: 5 }}
                onClick={handleSignOut}
                className="flex items-center w-full px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Sign Out
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;