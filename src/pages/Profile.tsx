import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (!user) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
            {user.email[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {user.user_metadata?.name || 'User'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Account Details
            </h2>
            <div className="space-y-2">
              <p className="text-gray-600 dark:text-gray-300">
                Member since: {new Date(user.created_at).toLocaleDateString()}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Last login: {new Date(user.last_sign_in_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Quick Actions
            </h2>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/settings')}
                className="w-full flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg"
              >
                <Settings className="w-5 h-5 mr-2" />
                Settings
              </button>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;