import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { api } from '../lib/apiClient';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isConnectionHealthy, setIsConnectionHealthy] = useState(true);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.error('Password reset is not yet supported on the custom backend.');
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        // Custom backend login
        const data = await api.post('/auth/login', {
          email,
          password,
        });

        // Save token and user data
        localStorage.setItem('toolva_token', data.token);
        localStorage.setItem('toolva_user', JSON.stringify(data.user));
        
        toast.success('Successfully signed in!');
        window.dispatchEvent(new Event('auth-change')); // Trigger app re-render
        onClose();
      } else {
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters long');
        }

        // Custom backend registration
        await api.post('/auth/register', {
          name,
          email,
          password,
        });

        toast.success('Account created successfully! You can now log in.');
        setIsLogin(true); // Switch to login view
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      setError(err.message || 'An error occurred during authentication');
      toast.error(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 }
  };

  if (showForgotPassword) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4 relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Reset Password
            </h2>

            {!showResetForm ? (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-2 px-4 rounded-lg text-white font-medium ${
                    isLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Instructions'}
                </button>

                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="w-full text-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Back to Sign In
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Reset Code
                  </label>
                  <input
                    type="text"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-2 px-4 rounded-lg text-white font-medium ${
                    isLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="bg-white/90 dark:bg-[#1a1c23]/90 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 dark:border-gray-700/50 max-w-md w-full relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full z-10"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-8 relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isLogin
                ? 'Enter your details to access your account'
                : 'Join us to explore and save your favorite AI tools'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Name
                </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all outline-none"
                    placeholder="John Doe"
                    required
                  />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all outline-none"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all outline-none"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {isLogin && (
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 block w-full text-right"
              >
                Forgot password?
              </button>
            )}

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 rounded-xl text-white font-bold text-lg shadow-lg shadow-blue-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] mt-4 ${
                isLoading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
              }`}
            >
              {isLoading
                ? 'Please wait...'
                : isLogin
                ? 'Sign In'
                : 'Create Account'}
            </button>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                  }}
                  className="ml-2 font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  {isLogin ? 'Sign up' : 'Log in'}
                </button>
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthModal;