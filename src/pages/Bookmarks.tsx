import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AITool } from '../types';
import ToolCard from '../components/ToolCard';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: bookmarksData, error } = await supabase
        .from('bookmarks')
        .select(`
          *,
          tool:tools(*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      setBookmarks(bookmarksData.map(b => b.tool));
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      toast.error('Failed to load bookmarks');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (toolId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', user.id)
        .eq('tool_id', toolId);

      if (error) throw error;

      setBookmarks(bookmarks.filter(b => b.id !== toolId));
      toast.success('Removed from bookmarks');
    } catch (error) {
      console.error('Error removing bookmark:', error);
      toast.error('Failed to remove from bookmarks');
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
        Your Bookmarked Tools
      </h1>

      {bookmarks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            You haven't bookmarked any tools yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bookmarks.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="h-full"
            >
              <ToolCard
                tool={tool}
                onBookmark={() => handleRemoveBookmark(tool.id)}
                isBookmarked={true}
              />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Bookmarks;