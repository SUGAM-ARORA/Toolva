import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, Star, Wrench, Shield, Trophy, Target, Gift, Activity, Clock, Heart, Bookmark } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    reviews: 0,
    contributions: 0,
    reputation: 0,
    favorites: 0,
    streak: 0,
    achievements: 0,
    level: 1
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    fetchUserData();
    fetchUserStats();
    fetchRecentActivity();
  }, []);

  const fetchUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchUserStats = async () => {
    try {
      const { data: reviews } = await supabase
        .from('reviews')
        .select('count')
        .eq('user_id', user?.id);

      const { data: contributions } = await supabase
        .from('tools')
        .select('count')
        .eq('submitted_by', user?.id);

      const { data: favorites } = await supabase
        .from('favorites')
        .select('count')
        .eq('user_id', user?.id);

      setStats({
        reviews: reviews?.[0]?.count || 0,
        contributions: contributions?.[0]?.count || 0,
        reputation: ((reviews?.[0]?.count || 0) * 10) + ((contributions?.[0]?.count || 0) * 50),
        favorites: favorites?.[0]?.count || 0,
        streak: Math.floor(Math.random() * 30),
        achievements: Math.floor(Math.random() * 10),
        level: Math.floor(((reviews?.[0]?.count || 0) * 10 + (contributions?.[0]?.count || 0) * 50) / 100) + 1
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const fetchRecentActivity = async () => {
    // Simulated recent activity
    setRecentActivity([
      { type: 'review', tool: 'ChatGPT', date: '2025-01-19' },
      { type: 'favorite', tool: 'DALL-E 3', date: '2025-01-18' },
      { type: 'contribution', tool: 'Stable Diffusion XL', date: '2025-01-17' },
      { type: 'achievement', name: 'Power User', date: '2025-01-16' }
    ]);
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  if (!user) return null;

  const statCards = [
    { icon: Star, label: 'Reviews', value: stats.reviews, color: 'from-yellow-500 to-amber-500' },
    { icon: Wrench, label: 'Contributions', value: stats.contributions, color: 'from-blue-500 to-indigo-500' },
    { icon: Shield, label: 'Reputation', value: stats.reputation, color: 'from-green-500 to-emerald-500' },
    { icon: Heart, label: 'Favorites', value: stats.favorites, color: 'from-red-500 to-pink-500' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto px-4 py-8"
    >
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-xl p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
          <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
            {user.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt={user.user_metadata?.name || 'User'}
                className="w-full h-full object-cover"
              />
            ) : (
              user.email[0].toUpperCase()
            )}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-white mb-2">
              {user.user_metadata?.name || 'User'}
            </h1>
            <p className="text-blue-100 mb-4">{user.email}</p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center bg-white/20 px-3 py-1 rounded-full">
                <Trophy className="w-4 h-4 text-yellow-300 mr-2" />
                <span className="text-white">Level {stats.level}</span>
              </div>
              <div className="flex items-center bg-white/20 px-3 py-1 rounded-full">
                <Activity className="w-4 h-4 text-green-300 mr-2" />
                <span className="text-white">{stats.streak} Day Streak</span>
              </div>
              <div className="flex items-center bg-white/20 px-3 py-1 rounded-full">
                <Gift className="w-4 h-4 text-pink-300 mr-2" />
                <span className="text-white">{stats.achievements} Achievements</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 text-white shadow-lg`}
          >
            <stat.icon className="w-8 h-8 mb-4" />
            <div className="text-3xl font-bold mb-2">{stat.value}</div>
            <div className="text-white/80">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  {activity.type === 'review' && <Star className="w-5 h-5 text-yellow-500 mr-3" />}
                  {activity.type === 'favorite' && <Heart className="w-5 h-5 text-red-500 mr-3" />}
                  {activity.type === 'contribution' && <Wrench className="w-5 h-5 text-blue-500 mr-3" />}
                  {activity.type === 'achievement' && <Trophy className="w-5 h-5 text-purple-500 mr-3" />}
                  <div className="flex-1">
                    <p className="text-gray-900 dark:text-white">
                      {activity.type === 'achievement' 
                        ? `Earned the ${activity.name} achievement`
                        : `${activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}d ${activity.tool}`}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Quick Actions
            </h2>
            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02, x: 4 }}
                onClick={() => navigate('/settings')}
                className="w-full flex items-center px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <Settings className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                <span className="text-gray-700 dark:text-gray-300">Settings</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02, x: 4 }}
                onClick={() => navigate('/favorites')}
                className="w-full flex items-center px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <Bookmark className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                <span className="text-gray-700 dark:text-gray-300">Saved Tools</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02, x: 4 }}
                onClick={() => navigate('/goals')}
                className="w-full flex items-center px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <Target className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                <span className="text-gray-700 dark:text-gray-300">Goals</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02, x: 4 }}
                onClick={handleSignOut}
                className="w-full flex items-center px-4 py-3 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30"
              >
                <LogOut className="w-5 h-5 text-red-500 dark:text-red-400 mr-3" />
                <span className="text-red-600 dark:text-red-400">Sign Out</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;