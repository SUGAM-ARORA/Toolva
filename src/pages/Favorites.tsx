import React from 'react';
import { supabase } from '../lib/supabase';
import { AITool } from '../types';
import ToolCard from '../components/ToolCard';
import { motion } from 'framer-motion';

const Favorites = () => {
  const [favorites, setFavorites] = React.useState<AITool[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: favoritesData, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      setFavorites(favoritesData);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Your Favorite Tools
      </h1>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            You haven't added any tools to your favorites yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ToolCard tool={tool} onFavorite={() => {}} isFavorited={true} />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Favorites;