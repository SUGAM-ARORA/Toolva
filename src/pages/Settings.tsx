import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Bell, Lock, ShieldCheck, Smartphone, Globe, ArrowLeft, KeyRound, QrCode, CheckCircle, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCurrentUser, saveAuth } from '../lib/auth';
import { api } from '../lib/apiClient';
import toast from 'react-hot-toast';

const Settings = () => {
  const [user, setUser] = useState<any>(getCurrentUser());
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('en');

  // Change Password state
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // 2FA state
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secret, setSecret] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [isSettingUp2FA, setIsSettingUp2FA] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(user?.twoFactorEnabled || false);

  // Phone Verification state
  const [phone, setPhone] = useState(user?.phone || '');
  const [phoneOTP, setPhoneOTP] = useState('');
  const [showPhoneOTPInput, setShowPhoneOTPInput] = useState(false);
  const [isSendingPhoneOTP, setIsSendingPhoneOTP] = useState(false);
  const [phoneTimer, setPhoneTimer] = useState(0);

  useEffect(() => {
    fetchLatestProfile();
  }, []);

  const fetchLatestProfile = async () => {
    try {
      const data = await api.get('/user/profile');
      if (data) {
        setUser(data);
        setIs2FAEnabled(data.twoFactorEnabled || false);
        if (data.phone) setPhone(data.phone);
        const token = localStorage.getItem('toolva_token');
        if (token) saveAuth(data, token);
      }
    } catch (e) {
      // Offline fallback
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    setIsChangingPassword(true);
    try {
      await api.post('/user/change-password', {
        currentPassword,
        newPassword,
      });
      toast.success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowChangePassword(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleStart2FASetup = async () => {
    setIsSettingUp2FA(true);
    try {
      const data = await api.post('/user/2fa/setup', {});
      setQrCodeUrl(data.qrCodeUrl);
      setSecret(data.secret);
      setShow2FASetup(true);
    } catch (err: any) {
      toast.error(err.message || 'Failed to initiate 2FA setup');
    } finally {
      setIsSettingUp2FA(false);
    }
  };

  const handleEnable2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (totpCode.length < 6) {
      toast.error('Please enter a 6-digit TOTP passcode');
      return;
    }

    setIsSettingUp2FA(true);
    try {
      await api.post('/user/2fa/enable', { code: totpCode });
      toast.success('Two-Factor Authentication is now enabled!');
      setIs2FAEnabled(true);
      setShow2FASetup(false);
      setTotpCode('');
      fetchLatestProfile();
    } catch (err: any) {
      toast.error(err.message || 'Invalid 2FA code');
    } finally {
      setIsSettingUp2FA(false);
    }
  };

  const handleDisable2FA = async () => {
    try {
      await api.post('/user/2fa/disable', {});
      toast.success('Two-Factor Authentication disabled');
      setIs2FAEnabled(false);
      fetchLatestProfile();
    } catch (err: any) {
      toast.error(err.message || 'Failed to disable 2FA');
    }
  };

  const handleSendPhoneOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setIsSendingPhoneOTP(true);
    try {
      await api.post('/user/send-phone-otp', { phone });
      setShowPhoneOTPInput(true);
      setPhoneTimer(60);
      toast.success('SMS OTP code sent to your mobile number!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to send SMS OTP');
    } finally {
      setIsSendingPhoneOTP(false);
    }
  };

  const handleVerifyPhoneOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/user/verify-phone', { phone, otp: phoneOTP });
      toast.success('Mobile number verified successfully!');
      setShowPhoneOTPInput(false);
      setPhoneOTP('');
      fetchLatestProfile();
    } catch (err: any) {
      toast.error(err.message || 'SMS OTP verification failed');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <Link
        to="/"
        className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium mb-4"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Home
      </Link>

      <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-8 tracking-tight">
        Account & Security Settings
      </h1>

      <div className="space-y-6">
        {/* Security & 2FA Suite */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-purple-600" />
                Two-Factor Authentication (2FA)
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Protect your Toolva account with Google Authenticator or Authy TOTP 2FA.
              </p>
            </div>

            <span
              className={`px-3 py-1 text-xs font-bold rounded-full ${
                is2FAEnabled
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
              }`}
            >
              {is2FAEnabled ? '2FA Enabled' : '2FA Disabled'}
            </span>
          </div>

          {!is2FAEnabled ? (
            <div>
              {!show2FASetup ? (
                <button
                  onClick={handleStart2FASetup}
                  disabled={isSettingUp2FA}
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <QrCode className="w-5 h-5" />
                  {isSettingUp2FA ? 'Generating QR Code...' : 'Setup 2FA with Authenticator App'}
                </button>
              ) : (
                <div className="bg-purple-50 dark:bg-purple-950/30 p-6 rounded-2xl border border-purple-200 dark:border-purple-800 space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    {qrCodeUrl && (
                      <img
                        src={qrCodeUrl}
                        alt="2FA QR Code"
                        className="w-44 h-44 rounded-xl border-4 border-white shadow-md"
                      />
                    )}
                    <div className="space-y-2">
                      <h3 className="font-bold text-gray-900 dark:text-white">Scan QR Code in Authenticator App</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Scan using Google Authenticator, Authy, 1Password, or Microsoft Authenticator.
                      </p>
                      <div className="bg-white dark:bg-gray-900 p-2.5 rounded-lg border font-mono text-xs text-purple-600 dark:text-purple-400 select-all">
                        Secret: {secret}
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleEnable2FA} className="space-y-3 pt-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Enter 6-Digit Code from App
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        maxLength={6}
                        value={totpCode}
                        onChange={(e) => setTotpCode(e.target.value)}
                        className="px-4 py-2.5 bg-white dark:bg-gray-900 border border-purple-300 dark:border-purple-700 rounded-xl text-center font-bold text-lg tracking-widest text-gray-900 dark:text-white w-48 outline-none"
                        placeholder="123456"
                        required
                      />
                      <button
                        type="submit"
                        disabled={isSettingUp2FA || totpCode.length < 6}
                        className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-50"
                      >
                        Verify & Enable 2FA
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between bg-green-50 dark:bg-green-950/20 p-4 rounded-xl border border-green-200 dark:border-green-900">
              <div className="flex items-center gap-3 text-green-700 dark:text-green-400 font-semibold">
                <CheckCircle className="w-5 h-5" />
                Two-Factor Authentication is protecting your account.
              </div>
              <button
                onClick={handleDisable2FA}
                className="px-4 py-2 text-sm bg-red-100 hover:bg-red-200 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-bold rounded-lg transition-colors"
              >
                Disable 2FA
              </button>
            </div>
          )}
        </div>

        {/* Change Password */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-600" />
                Password & Security
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Update your account password securely.
              </p>
            </div>
            <button
              onClick={() => setShowChangePassword(!showChangePassword)}
              className="px-4 py-2 text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold rounded-xl hover:bg-blue-100 transition-colors"
            >
              {showChangePassword ? 'Cancel' : 'Change Password'}
            </button>
          </div>

          {showChangePassword && (
            <form onSubmit={handleChangePassword} className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isChangingPassword}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-50"
              >
                {isChangingPassword ? 'Updating Password...' : 'Save New Password'}
              </button>
            </form>
          )}
        </div>

        {/* Mobile Number & SMS Verification */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-1xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-emerald-600" />
            Mobile Phone Verification
          </h2>

          <form onSubmit={handleSendPhoneOTP} className="space-y-3">
            <div className="flex gap-3">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="+1 (555) 000-0000"
              />
              <button
                type="submit"
                disabled={isSendingPhoneOTP}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all"
              >
                {isSendingPhoneOTP ? 'Sending OTP...' : 'Send SMS OTP'}
              </button>
            </div>
          </form>

          {showPhoneOTPInput && (
            <form onSubmit={handleVerifyPhoneOTP} className="mt-4 pt-4 border-t space-y-3">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Enter 6-Digit SMS OTP
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  maxLength={6}
                  value={phoneOTP}
                  onChange={(e) => setPhoneOTP(e.target.value)}
                  className="w-48 px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-center font-bold tracking-widest text-gray-900 dark:text-white outline-none"
                  placeholder="123456"
                  required
                />
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl shadow-md"
                >
                  Verify Phone
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;