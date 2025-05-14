import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { Menu, Transition } from '@headlessui/react';
import { LogOut, Settings, User as UserIcon } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { supabase } from './lib/supabase';
import AuthModal from './components/AuthModal';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                ToolVa
              </h1>

              <div className="flex items-center space-x-4">
                <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />

                {user ? (
                  <Menu as="div" className="relative">
                    <Menu.Button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                      <img
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`}
                        alt="Profile"
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-gray-700 dark:text-gray-300">
                        {user.email}
                      </span>
                    </Menu.Button>

                    <Transition
                      enter="transition duration-100 ease-out"
                      enterFrom="transform scale-95 opacity-0"
                      enterTo="transform scale-100 opacity-100"
                      leave="transition duration-75 ease-out"
                      leaveFrom="transform scale-100 opacity-100"
                      leaveTo="transform scale-95 opacity-0"
                    >
                      <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={`${
                                  active
                                    ? 'bg-gray-100 dark:bg-gray-700'
                                    : ''
                                } flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                              >
                                <UserIcon className="w-4 h-4 mr-2" />
                                Profile
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={`${
                                  active
                                    ? 'bg-gray-100 dark:bg-gray-700'
                                    : ''
                                } flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                              >
                                <Settings className="w-4 h-4 mr-2" />
                                Settings
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={handleSignOut}
                                className={`${
                                  active
                                    ? 'bg-gray-100 dark:bg-gray-700'
                                    : ''
                                } flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400`}
                              >
                                <LogOut className="w-4 h-4 mr-2" />
                                Sign out
                              </button>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Sign in
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Your existing content here */}
        </main>

        {/* Auth Modal */}
        {showAuthModal && (
          <AuthModal onClose={() => setShowAuthModal(false)} />
        )}

        {/* Toast Notifications */}
        <Toaster position="bottom-right" />
      </div>
    </div>
  );
}

export default App;