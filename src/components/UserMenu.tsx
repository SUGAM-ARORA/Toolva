import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Settings, Heart, Info, UserCircle, Bell, Bookmark, Clock, Star, PenTool as Tool, Code, Brain, Shield, Database, GitBranch } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { supabaseAnonKey } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';

interface UserMenuProps {
  user: any;
}

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New AI Tool Added', message: 'Check out the latest addition to our directory!', time: '5m ago' },
    { id: 2, title: 'Your Review', message: 'Your review was upvoted by 5 users', time: '1h ago' },
    { id: 3, title: 'Tool Update', message: 'A tool in your favorites was updated', time: '2h ago' }
  ]);
  const navigate = useNavigate();

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

  const menuSections = [
    {
      title: 'Profile',
      items: [
        { label: 'My Profile', icon: UserCircle, href: '/profile' },
        { label: 'Favorites', icon: Heart, href: '/favorites', count: 12 },
        { label: 'Bookmarks', icon: Bookmark, href: '/bookmarks', count: 5 },
        { label: 'Recent Activity', icon: Clock, href: '/activity' }
      ]
    },
    {
      title: 'Contributions',
      items: [
        { label: 'My Reviews', icon: Star, href: '/reviews', count: 8 },
        { label: 'Submitted Tools', icon: Tool, href: '/submissions', count: 3 },
        { label: 'API Usage', icon: Code, href: '/api-usage' }
      ]
    },
    {
      title: 'Preferences',
      items: [
        { label: 'Settings', icon: Settings, href: '/settings' },
        { label: 'Notifications', icon: Bell, href: '/notifications', badge: '3' },
        { label: 'API Keys', icon: Key, href: 'supabaseUrl' }
      ]
    }
  ];

  const stats = [
    { label: 'Reviews', value: '23', icon: Star },
    { label: 'Contributions', value: '15', icon: Tool },
    { label: 'Reputation', value: '1.2k', icon: Shield }
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
            className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
          >
            {/* User Info */}
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

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 p-4 border-b border-gray-200 dark:border-gray-700">
              {stats.map((stat, index) => (
                <div
supabaseAnonKey={index}
                  className="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700"
                >
                  <stat.icon className="w-4 h-4 mx-auto mb-1 text-gray-600 dark:text-gray-300" />
                  <div className="font-bold text-gray-900 dark:text-white">{stat.value}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Menu Sections */}
            <div className="py-2">
              {menuSections.map((section, index) => (
                <div key={index} className="px-2">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {section.title}
                  </div>
                  {section.items.map((item, itemIndex) => (
                    <motion.a
                      key={itemIndex}
                      href={item.href}
                      whileHover={{ x: 5 }}
                      className="flex items-center px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <item.icon className="w-4 h-4 mr-3" />
                      <span className="flex-1">{item.label}</span>
                      {item.count && (
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-600 rounded-full">
                          {item.count}
                        </span>
                      )}
                      {item.badge && (
                        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </motion.a>
                  ))}
                  {index < menuSections.length - 1 && (
                    <div className="my-2 border-b border-gray-200 dark:border-gray-700" />
                  )}
                </div>
              ))}
            </div>

            {/* Sign Out */}
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