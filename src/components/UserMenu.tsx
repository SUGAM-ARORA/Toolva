import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Settings, LogOut, Star, Wrench, Shield, Trophy, Target, Gift, Activity, Clock, Heart, Bookmark, Globe, Brain, Book, Lightbulb, CreditCard } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface User {
  id: string;
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
}

type MenuItem = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  count?: number;
  badge?: string;
  color?: string;
};

type MenuSection = {
  title: string;
  items: MenuItem[];
};

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
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
  const [subscriptionStatus, setSubscriptionStatus] = useState({
    plan: 'Free',
    validUntil: new Date().toISOString(),
    features: ['Basic Access', 'Limited Tools']
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserStats();
    fetchNotifications();
    fetchSubscriptionStatus();
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
        bookmarks: Math.floor(Math.random() * 20),
        reviews: reviews?.[0]?.count || 0,
        contributions: contributions?.[0]?.count || 0,
        reputation: calculateReputation(reviews?.[0]?.count || 0, contributions?.[0]?.count || 0),
        achievements: Math.floor(Math.random() * 10),
        streak: Math.floor(Math.random() * 30),
        languages: Math.floor(Math.random() * 15)
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const fetchSubscriptionStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setSubscriptionStatus({
          plan: data.plan,
          validUntil: data.valid_until,
          features: data.features
        });
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
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
      await supabase.auth.signOut();
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
        { label: 'My Profile', icon: User, href: '/profile', color: 'text-blue-500' },
        { label: 'Favorites', icon: Heart, href: '/favorites', count: userStats.favorites, color: 'text-red-500' },
        { label: 'Bookmarks', icon: Bookmark, href: '/bookmarks', count: userStats.bookmarks, color: 'text-purple-500' },
        { label: 'Recent Activity', icon: Clock, href: '/activity', color: 'text-green-500' }
      ]
    },
    {
      title: 'Learning',
      items: [
        { label: 'AI Learning Hub', icon: Brain, href: '/learning', badge: 'New!', color: 'text-indigo-500' },
        { label: 'AI Dictionary', icon: Book, href: '/dictionary', color: 'text-emerald-500' },
        { label: 'Language Support', icon: Globe, href: '/languages', count: userStats.languages, color: 'text-cyan-500' },
        { label: 'Prompts Library', icon: Lightbulb, href: '/prompts', badge: 'Beta', color: 'text-amber-500' }
      ]
    },
    {
      title: 'Contributions',
      items: [
        { label: 'My Reviews', icon: Star, href: '/reviews', count: userStats.reviews, color: 'text-yellow-500' },
        { label: 'Submitted Tools', icon: Wrench, href: '/submissions', count: userStats.contributions, color: 'text-indigo-500' },
        { label: 'Achievements', icon: Trophy, href: '/achievements', count: userStats.achievements, color: 'text-amber-500' },
        { label: 'Goals', icon: Target, href: '/goals', badge: `${userStats.streak} day streak`, color: 'text-cyan-500' }
      ]
    },
    {
      title: 'Rewards',
      items: [
        { label: 'Reputation', icon: Shield, href: '/reputation', count: userStats.reputation, color: 'text-emerald-500' },
        { label: 'Rewards', icon: Gift, href: '/rewards', badge: 'New!', color: 'text-pink-500' },
        { label: 'Activity Stats', icon: Activity, href: '/stats', color: 'text-violet-500' },
        { label: 'Settings', icon: Settings, href: '/settings', color: 'text-gray-500' }
      ]
    },
    {
      title: 'Subscription',
      items: [
        {
          label: `${subscriptionStatus.plan} Plan`,
          icon: CreditCard,
          href: '/subscription',
          badge: new Date(subscriptionStatus.validUntil) > new Date() ? 'Active' : 'Expired',
          color: 'text-purple-500'
        },
        {
          label: 'Upgrade Plan',
          icon: Gift,
          href: '/subscription/upgrade',
          color: 'text-green-500'
        }
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
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium overflow-hidden">
            {user.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt={user.user_metadata?.name || 'User'}
                className="w-full h-full object-cover"
              />
            ) : (
              user.user_metadata?.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()
            )}
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
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                  {user.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt={user.user_metadata?.name || 'User'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold">
                      {user.user_metadata?.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{user.user_metadata?.name || 'User'}</h3>
                  <p className="text-sm text-white/80">{user.email}</p>
                  <div className="flex items-center mt-2">
                    <Trophy className="w-4 h-4 text-yellow-300 mr-1" />
                    <span className="text-sm">Level {Math.floor(userStats.reputation / 100)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 p-4 border-b border-gray-200 dark:border-gray-700">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20"
              >
                <Star className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
                <div className="font-bold text-gray-900 dark:text-white">{userStats.reviews}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Reviews</div>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center p-3 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20"
              >
                <Wrench className="w-5 h-5 mx-auto mb-1 text-emerald-500" />
                <div className="font-bold text-gray-900 dark:text-white">{userStats.contributions}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Tools</div>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center p-3 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20"
              >
                <Shield className="w-5 h-5 mx-auto mb-1 text-purple-500" />
                <div className="font-bold text-gray-900 dark:text-white">{userStats.reputation}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Rep</div>
              </motion.div>
            </div>

            <div className="py-2 max-h-[calc(100vh-400px)] overflow-y-auto">
              {menuSections.map((section, index) => (
                <div key={index} className="px-2">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {section.title}
                  </div>
                  {section.items.map((item, itemIndex) => (
                    <motion.div
                      key={itemIndex}
                      whileHover={{ x: 4 }}
                      className="relative"
                    >
                      <Link
                        to={item.href}
                        className="flex items-center px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsOpen(false)}
                      >
                        <item.icon className={`w-5 h-5 mr-3 ${item.color}`} />
                        <span className="flex-1">{item.label}</span>
                        {item.count !== undefined && (
                          <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-600 rounded-full">
                            {item.count}
                          </span>
                        )}
                        {item.badge && (
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </motion.div>
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
                <LogOut className="w-5 h-5 mr-3" />
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