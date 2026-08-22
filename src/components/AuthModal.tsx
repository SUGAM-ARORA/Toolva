import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, Eye, EyeOff, ShieldCheck, Smartphone, KeyRound, RefreshCw, CheckCircle } from 'lucide-react';
import { api } from '../lib/apiClient';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface AuthModalProps {
  onClose: () => void;
}

type AuthStep = 'auth' | 'email-otp' | 'phone-otp' | '2fa';

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Multi-step & OTP states
  const [step, setStep] = useState<AuthStep>('auth');
  const [emailOTP, setEmailOTP] = useState('');
  const [phoneOTP, setPhoneOTP] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);

  // 60-second timers
  const [emailTimer, setEmailTimer] = useState(60);
  const [phoneTimer, setPhoneTimer] = useState(60);

  // Temporary auth payload held during verification steps
  const [tempAuth, setTempAuth] = useState<{ token: string; user: any } | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'email-otp' && emailTimer > 0) {
      interval = setInterval(() => setEmailTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, emailTimer]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'phone-otp' && phoneTimer > 0) {
      interval = setInterval(() => setPhoneTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, phoneTimer]);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await api.post('/auth/forgot-password', { email });
      toast.success(data.message || 'Reset code generated!');
      if (data.resetCode) {
        toast(`Your reset code is: ${data.resetCode}`, { duration: 10000, icon: '🔑' });
      }
      setShowResetForm(true);
    } catch (err: any) {
      setError(err.message || 'Failed to request password reset');
      toast.error(err.message || 'Request failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await api.post('/auth/reset-password', {
        email,
        resetCode,
        newPassword,
      });
      toast.success(data.message || 'Password reset successfully!');
      setShowForgotPassword(false);
      setShowResetForm(false);
      setIsLogin(true);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
      toast.error(err.message || 'Reset failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        // Login Flow (supports 2FA challenge)
        const data = await api.post('/auth/login', {
          email,
          password,
          twoFactorCode: step === '2fa' ? twoFactorCode : undefined,
        });

        if (data.requires2FA) {
          setStep('2fa');
          toast('Two-Factor Authentication required. Enter the code from your app.', { icon: '🔐' });
          setIsLoading(false);
          return;
        }

        finishAuth(data.token, data.user, 'Successfully signed in!');
      } else {
        // Registration Flow
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters long');
        }

        const data = await api.post('/auth/register', {
          name,
          email,
          password,
        });

        // Save session immediately so user is logged in
        localStorage.setItem('toolva_token', data.token);
        localStorage.setItem('toolva_user', JSON.stringify(data.user));
        window.dispatchEvent(new Event('auth-change'));

        setTempAuth({ token: data.token, user: data.user });
        setStep('email-otp');
        setEmailTimer(60);
        toast.success('Registration successful! Verification code sent to your email.');
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      setError(err.message || 'An error occurred during authentication');
      toast.error(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await api.post('/auth/verify-email', { email, otp: emailOTP });
      toast.success('Email verified successfully!');

      if (tempAuth) {
        // Update user state
        tempAuth.user.emailVerified = true;
        localStorage.setItem('toolva_user', JSON.stringify(tempAuth.user));
        window.dispatchEvent(new Event('auth-change'));
        setStep('phone-otp');
        setPhoneTimer(60);
      } else {
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Email verification failed');
      toast.error(err.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmailOTP = async () => {
    if (emailTimer > 0) return;
    setError('');
    try {
      await api.post('/auth/resend-email-otp', { email });
      setEmailTimer(60);
      toast.success('New verification code sent to your email!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to resend code');
    }
  };

  const handleSendPhoneOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      setError('Please enter your mobile phone number');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await api.post('/auth/send-phone-otp', { phone });
      setPhoneTimer(60);
      toast.success('SMS OTP code sent to your phone number!');
    } catch (err: any) {
      setError(err.message || 'Failed to send SMS OTP');
      toast.error(err.message || 'Failed to send SMS');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyPhoneOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await api.post('/auth/verify-phone', { phone, otp: phoneOTP });
      toast.success('Mobile number verified!');

      if (tempAuth) {
        finishAuth(tempAuth.token, tempAuth.user, 'Registration & verification complete!');
      } else {
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Phone verification failed');
      toast.error(err.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const finishAuth = (token: string, user: any, message: string) => {
    localStorage.setItem('toolva_token', token);
    localStorage.setItem('toolva_user', JSON.stringify(user));
    toast.success(message);
    window.dispatchEvent(new Event('auth-change'));
    onClose();
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  };

  if (showForgotPassword) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-white/90 dark:bg-[#1a1c23]/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 max-w-md w-full relative overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors z-10"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="p-8">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Reset Password</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Enter your email address to receive password reset instructions.
            </p>

            {!showResetForm ? (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white outline-none"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all"
                >
                  {isLoading ? 'Sending Code...' : 'Send Reset Code'}
                </button>

                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="w-full text-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-semibold"
                >
                  Back to Sign In
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    6-Digit Reset Code
                  </label>
                  <input
                    type="text"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white outline-none text-center font-mono text-lg tracking-widest"
                    placeholder="123456"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white outline-none"
                    placeholder="••••••••"
                    required
                  />
                </div>

                {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg transition-all"
                >
                  {isLoading ? 'Resetting...' : 'Set New Password'}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // STEP 2: Email Verification OTP Screen
  if (step === 'email-otp') {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-white/90 dark:bg-[#1a1c23]/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 max-w-md w-full p-8 relative"
        >
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-600 dark:text-blue-400">
              <Mail className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-1">Verify Email</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              We sent a 6-digit code to <span className="font-semibold text-gray-800 dark:text-gray-200">{email}</span>
            </p>
          </div>

          <form onSubmit={handleVerifyEmail} className="space-y-5">
            <div>
              <input
                type="text"
                maxLength={6}
                value={emailOTP}
                onChange={(e) => setEmailOTP(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-center text-2xl font-bold tracking-widest text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="123456"
                required
              />
            </div>

            {error && <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>}

            <button
              type="submit"
              disabled={isLoading || emailOTP.length < 6}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Verify Email Code'}
            </button>

            <div className="flex items-center justify-between text-sm pt-2">
              <span className="text-gray-500 dark:text-gray-400">
                Code expires in: <span className="font-bold text-blue-600 dark:text-blue-400">{emailTimer}s</span>
              </span>
              <button
                type="button"
                disabled={emailTimer > 0}
                onClick={handleResendEmailOTP}
                className="flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-40"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Resend Code
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  // STEP 3: Phone Number & SMS OTP Screen
  if (step === 'phone-otp') {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-white/90 dark:bg-[#1a1c23]/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 max-w-md w-full p-8 relative"
        >
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-600 dark:text-emerald-400">
              <Smartphone className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-1">Mobile Verification</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter mobile phone number to receive 6-digit SMS OTP
            </p>
          </div>

          {!phoneOTP && (
            <form onSubmit={handleSendPhoneOTP} className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="+1 (555) 000-0000"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl shadow-lg transition-all"
              >
                {isLoading ? 'Sending SMS...' : 'Send SMS OTP'}
              </button>
            </form>
          )}

          {phoneOTP !== '' || phoneTimer > 0 ? (
            <form onSubmit={handleVerifyPhoneOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  6-Digit SMS OTP Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={phoneOTP}
                  onChange={(e) => setPhoneOTP(e.target.value)}
                  className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-center text-2xl font-bold tracking-widest text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="123456"
                  required
                />
              </div>

              {error && <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>}

              <button
                type="submit"
                disabled={isLoading || phoneOTP.length < 6}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : 'Verify Mobile OTP'}
              </button>

              <div className="flex items-center justify-between text-sm pt-2">
                <span className="text-gray-500 dark:text-gray-400">
                  OTP expires in: <span className="font-bold text-emerald-600 dark:text-emerald-400">{phoneTimer}s</span>
                </span>
                <button
                  type="button"
                  disabled={phoneTimer > 0}
                  onClick={handleSendPhoneOTP}
                  className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 hover:underline disabled:opacity-40"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Resend SMS OTP
                </button>
              </div>
            </form>
          ) : null}

          <button
            type="button"
            onClick={() => finishAuth(tempAuth!.token, tempAuth!.user, 'Registration complete!')}
            className="w-full mt-4 text-center text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Skip for now
          </button>
        </motion.div>
      </div>
    );
  }

  // STEP 4: 2FA Login Challenge Screen
  if (step === '2fa') {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-white/90 dark:bg-[#1a1c23]/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 max-w-md w-full p-8 relative"
        >
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center mx-auto mb-3 text-purple-600 dark:text-purple-400">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-1">Two-Factor Authentication</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter the 6-digit code from Google Authenticator or Authy
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                maxLength={6}
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-center text-2xl font-bold tracking-widest text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="123456"
                required
                autoFocus
              />
            </div>

            {error && <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>}

            <button
              type="submit"
              disabled={isLoading || twoFactorCode.length < 6}
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50"
            >
              {isLoading ? 'Verifying 2FA...' : 'Authenticate'}
            </button>

            <button
              type="button"
              onClick={() => setStep('auth')}
              className="w-full text-center text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Back to Login
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // DEFAULT STEP 1: Main Login & Registration Screen
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
                  Full Name
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

            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 rounded-xl text-white font-bold text-lg shadow-lg shadow-blue-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] mt-4 ${
                isLoading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
              }`}
            >
              {isLoading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
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