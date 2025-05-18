import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, Eye, EyeOff, Github } from 'lucide-react';
import { supabase, checkSupabaseConnection } from '../lib/supabase';
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

  useEffect(() => {
    checkSupabaseConnection().then(isHealthy => {
      setIsConnectionHealthy(isHealthy);
      if (!isHealthy) {
        setError('Unable to connect to authentication service. Please try again later.');
      }
    });
  }, []);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      
      toast.success('Password reset email sent! Please check your inbox.');
      setShowResetForm(true);
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: resetCode,
        type: 'recovery'
      });

      if (error) throw error;

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;

      toast.success('Password reset successfully!');
      setShowResetForm(false);
      setShowForgotPassword(false);
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnectionHealthy) {
      toast.error('Authentication service is currently unavailable. Please try again later.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;
        
        toast.success('Successfully signed in!');
        onClose();
      } else {
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters long');
        }

        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name },
            emailRedirectTo: `${window.location.origin}/auth/callback`
          },
        });

        if (signUpError) throw signUpError;
        
        if (!data?.user) {
          throw new Error('Failed to create user account');
        }

        toast.success('Account created successfully! Please check your email to verify your account.');
        onClose();
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      setError(err.message);
      toast.error(err.message);
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {isLogin
              ? 'Sign in to your account to continue'
              : 'Join us to explore and save your favorite AI tools'}
          </p>

          <div className="space-y-4 mb-6">
            <button
              onClick={() => handleSocialLogin('google')}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 mr-3" />
              Continue with Google
            </button>

            <button
              onClick={() => handleSocialLogin('github')}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Github className="w-5 h-5 mr-3" />
              Continue with GitHub
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter your name"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter your email"
                  required
                />
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter your password"
                  required
                  minLength={6}
                />
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
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
              {!isLogin && (
                <p className="text-xs text-gray-500 mt-1">
                  Password must be at least 6 characters long
                </p>
              )}
            </div>

            {isLogin && (
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
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
              className={`w-full py-2 px-4 rounded-lg text-white font-medium ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading
                ? 'Please wait...'
                : isLogin
                ? 'Sign In'
                : 'Create Account'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : 'Already have an account? Sign in'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthModal;