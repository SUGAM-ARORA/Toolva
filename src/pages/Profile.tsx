import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Settings, 
  LogOut, 
  Shield, 
  Trophy, 
  ArrowLeft,
  Sparkles,
  Flame,
  Heart,
  Camera,
  Save,
  UserCheck,
  Edit3,
  ExternalLink,
  Smartphone,
  Crown
} from 'lucide-react';
import { getOrCreateCurrentUser, logout, getUserExpertise, ExpertiseProgress, saveAuth, ToolvaUser } from '../lib/auth';
import { localAITools } from '../data/unifiedTools';
import { AITool } from '../types';
import toast from 'react-hot-toast';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<ToolvaUser>(() => getOrCreateCurrentUser());
  const [expertise, setExpertise] = useState<ExpertiseProgress>(() => getUserExpertise());
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [name, setName] = useState(user.name || 'Sugam Arora');
  const [email, setEmail] = useState(user.email || 'sugam.arora23@gmail.com');
  const [phone, setPhone] = useState(user.phone || '8699122792');
  const [location, setLocation] = useState(user.location || 'San Francisco, CA');
  const [bio, setBio] = useState(user.bio || 'AI enthusiast discovering, testing, and mastering next-gen tools on Toolva.');
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url || '');
  const [userId, setUserId] = useState(user.userId || 'TLVA-849201');
  const [role, setRole] = useState(user.role || 'superadmin');
  const [authType, setAuthType] = useState(user.authType || 'Custom JWT / Toolva Auth Token');

  // Favorites state - 100% Dynamic from localStorage
  const [favorites, setFavorites] = useState<AITool[]>([]);

  useEffect(() => {
    const updated = getOrCreateCurrentUser();
    setUser(updated);
    setName(updated.name || 'Sugam Arora');
    setEmail(updated.email || 'sugam.arora23@gmail.com');
    setPhone(updated.phone || '8699122792');
    setLocation(updated.location || 'San Francisco, CA');
    setBio(updated.bio || 'AI enthusiast discovering, testing, and mastering next-gen tools on Toolva.');
    setAvatarUrl(updated.avatar_url || '');
    setUserId(updated.userId || 'TLVA-849201');
    setRole(updated.role || 'superadmin');
    setAuthType(updated.authType || 'Custom JWT / Toolva Auth Token');
    setExpertise(getUserExpertise());

    // Load real favorites from localStorage
    try {
      const storedFavs = localStorage.getItem('toolva_favorites');
      if (storedFavs) {
        const parsed = JSON.parse(storedFavs);
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (typeof parsed[0] === 'string') {
            const matched = localAITools.filter(tool => parsed.includes(tool.id));
            setFavorites(matched);
          } else {
            setFavorites(parsed);
          }
        } else {
          setFavorites([]);
        }
      } else {
        setFavorites([]);
      }
    } catch {
      setFavorites([]);
    }

    const handleExpertiseChange = () => setExpertise(getUserExpertise());
    window.addEventListener('expertise-change', handleExpertiseChange);
    return () => window.removeEventListener('expertise-change', handleExpertiseChange);
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: ToolvaUser = {
      ...user,
      name,
      email,
      phone,
      location,
      bio,
      avatar_url: avatarUrl,
      userId,
      role,
      authType
    };

    saveAuth(updatedUser, localStorage.getItem('toolva_token') || 'token_active_owner');
    setUser(updatedUser);
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleSignOut = () => {
    logout();
    toast.success('Signed out successfully');
    navigate('/');
  };

  const getRankBadgeColor = (r: string) => {
    switch (r) {
      case 'Master': return 'from-amber-500 via-yellow-400 to-amber-600 text-amber-950';
      case 'Expert': return 'from-purple-600 via-pink-500 to-rose-600 text-white';
      case 'Proficient': return 'from-blue-600 via-cyan-500 to-teal-500 text-white';
      case 'Practitioner': return 'from-emerald-500 to-green-600 text-white';
      default: return 'from-gray-700 to-slate-800 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] text-gray-900 dark:text-white transition-colors duration-200 pt-20 pb-24 font-sans">
      {/* Sub-header Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3 ml-36 sm:ml-40">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-2xl bg-white dark:bg-[#141721] hover:bg-gray-100 dark:hover:bg-[#1c202f] border border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-700 dark:text-gray-200 shadow-md transition-transform active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-orange-500" />
            <span>Back to AI Directory</span>
          </button>
          <span className="text-xs font-black uppercase font-mono tracking-wider text-gray-400 dark:text-gray-500 hidden md:inline">
            USER PROFILE & ACCOUNT
          </span>
        </div>

        <div className="flex items-center space-x-3 mr-0 sm:mr-64">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-2xl border text-xs font-bold transition-all shadow-md ${
              isEditing 
                ? 'bg-orange-500 text-white border-orange-500 shadow-orange-500/20' 
                : 'bg-white dark:bg-[#141721] hover:bg-gray-100 dark:hover:bg-[#1c202f] border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
          </button>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 text-xs font-bold transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* User Hero Card */}
        <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#141721] border border-gray-200 dark:border-gray-800/80 p-6 sm:p-8 shadow-xl">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-orange-500/10 dark:bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-500/10 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 text-center md:text-left">
              {/* Profile Avatar Badge (No Stock Photos) */}
              <div className="relative group">
                <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-orange-500 via-amber-400 to-purple-600 p-1 shadow-xl">
                  <div className="w-full h-full rounded-[22px] bg-white dark:bg-[#0b0c10] flex items-center justify-center font-black text-4xl text-orange-500 overflow-hidden relative">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="uppercase font-extrabold">{name?.[0]?.toUpperCase() || 'S'}</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-orange-500 text-white border-4 border-white dark:border-[#141721] flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  title="Upload Profile Photo"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <div>
                <div className="flex items-center justify-center md:justify-start space-x-3">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 dark:text-white">
                    {name}
                  </h1>
                  <span className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-600 dark:text-orange-400 text-xs font-mono font-bold">
                    {userId}
                  </span>
                  {role === 'superadmin' && (
                    <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-mono font-bold flex items-center gap-1">
                      <Crown className="w-3.5 h-3.5 text-amber-400" /> SUPERADMIN
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-mono">{email}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-md">{bio}</p>

                {/* Gamified Rank Badge */}
                <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <div className={`px-4 py-1.5 rounded-xl bg-gradient-to-r ${getRankBadgeColor(expertise.role)} text-xs font-black tracking-wide shadow-md flex items-center space-x-1.5`}>
                    <Trophy className="w-4 h-4 text-yellow-300" />
                    <span>Rank: {expertise.role}</span>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-300 font-mono px-3 py-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700/80 rounded-xl font-bold">
                    🔥 {expertise.toolsOpenedCount} AI Tools Used
                  </span>
                </div>
              </div>
            </div>

            {/* Level Progress Card */}
            <div className="w-full md:w-80 bg-gray-50 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl space-y-3 shadow-inner">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-orange-500" /> Rank Progress
                </span>
                <span className="text-orange-500 dark:text-orange-400 font-mono font-bold">{expertise.progressPercent}%</span>
              </div>

              <div className="w-full bg-gray-200 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-amber-400 h-full transition-all duration-300" 
                  style={{ width: `${expertise.progressPercent}%` }} 
                />
              </div>

              <p className="text-[11px] text-gray-500 dark:text-gray-400 text-center font-mono">
                {expertise.role === 'Master' 
                  ? '🏆 Master Rank Reached!' 
                  : `Open ${expertise.nextThreshold - expertise.toolsOpenedCount} more tools to reach next level`}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Edit Form */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="bg-white dark:bg-[#141721] border border-orange-500/40 p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl">
            <div className="flex items-center space-x-3 border-b border-gray-200 dark:border-gray-800 pb-4">
              <div className="p-2.5 bg-orange-500/10 text-orange-500 rounded-xl">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Edit Profile & Owner Permissions</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Update your user details, avatar photo URL, and admin role permissions.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-medium text-gray-900 dark:text-white outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Account Role Permission
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-mono font-bold text-purple-600 dark:text-purple-400 outline-none focus:border-orange-500"
                >
                  <option value="superadmin">👑 SUPERADMIN (Project Owner)</option>
                  <option value="admin">🛡️ ADMIN</option>
                  <option value="user">👤 USER</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-medium text-gray-900 dark:text-white outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Mobile / Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="8699122792"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-medium text-gray-900 dark:text-white outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Avatar Photo URL (Optional)
                </label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="Leave empty for initial letter badge"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-medium text-gray-900 dark:text-white outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Location / Region
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="San Francisco, CA"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-medium text-gray-900 dark:text-white outline-none focus:border-orange-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Bio / Headline
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-medium text-gray-900 dark:text-white outline-none focus:border-orange-500 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-2 border-t border-gray-200 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center space-x-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        )}

        {/* User Attribute Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Identity & Security Card */}
          <div className="bg-white dark:bg-[#141721] border border-gray-200 dark:border-gray-800/80 p-6 rounded-3xl space-y-4 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 flex items-center gap-2 font-mono">
              <Shield className="w-4 h-4 text-orange-500" /> Account Security & Auth
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800/80">
                <span className="text-gray-500 dark:text-gray-400">Unique User ID</span>
                <span className="font-mono font-bold text-orange-600 dark:text-orange-400">{userId}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800/80">
                <span className="text-gray-500 dark:text-gray-400">Authentication Type</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{authType}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800/80">
                <span className="text-gray-500 dark:text-gray-400">Account Role</span>
                <span className="font-mono font-bold text-purple-600 dark:text-purple-400 uppercase">{role}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500 dark:text-gray-400">Security Standard</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">2FA & Encrypted Session</span>
              </div>
            </div>
          </div>

          {/* Contact Details Card */}
          <div className="bg-white dark:bg-[#141721] border border-gray-200 dark:border-gray-800/80 p-6 rounded-3xl space-y-4 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-2 font-mono">
              <Smartphone className="w-4 h-4 text-blue-500" /> Contact Details
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800/80">
                <span className="text-gray-500 dark:text-gray-400">Email Address</span>
                <span className="font-mono font-bold text-gray-900 dark:text-white">{email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800/80">
                <span className="text-gray-500 dark:text-gray-400">Mobile Number</span>
                <span className="font-mono font-bold text-gray-900 dark:text-white">{phone}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800/80">
                <span className="text-gray-500 dark:text-gray-400">Location</span>
                <span className="font-mono font-bold text-gray-900 dark:text-white">{location}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500 dark:text-gray-400">Support Desk</span>
                <a href="mailto:support.toolva@gmail.com" className="font-mono font-bold text-orange-500 hover:underline">
                  support.toolva@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Usage & Rank Metrics */}
          <div className="bg-white dark:bg-[#141721] border border-gray-200 dark:border-gray-800/80 p-6 rounded-3xl space-y-4 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-2 font-mono">
              <Flame className="w-4 h-4 text-purple-500" /> Usage & Rank Metrics
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800/80">
                <span className="text-gray-500 dark:text-gray-400">AI Tools Used</span>
                <span className="font-mono font-bold text-gray-900 dark:text-white">{expertise.toolsOpenedCount} tools opened</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800/80">
                <span className="text-gray-500 dark:text-gray-400">Current Level</span>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{expertise.role}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800/80">
                <span className="text-gray-500 dark:text-gray-400">Active Streak</span>
                <span className="font-mono font-bold text-red-500">7 Days Discovery</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500 dark:text-gray-400">For You Feed</span>
                <span className={`font-mono font-bold ${expertise.unlockedForYou ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`}>
                  {expertise.unlockedForYou ? 'UNLOCKED' : 'LOCKED (21+ tools needed)'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Favorite AI Tools Section */}
        <div className="bg-white dark:bg-[#141721] border border-gray-200 dark:border-gray-800/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center font-bold">
                <Heart className="w-5 h-5 fill-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white">Favorite AI Tools</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Your bookmarked and saved tools for quick launch.</p>
              </div>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 font-bold">
              {favorites.length} Saved Tools
            </span>
          </div>

          {favorites.length === 0 ? (
            <div className="text-center py-10 space-y-3 bg-gray-50 dark:bg-gray-950/50 rounded-2xl border border-dashed border-gray-300 dark:border-gray-800">
              <Heart className="w-10 h-10 text-gray-400 mx-auto opacity-40" />
              <p className="text-xs text-gray-500 font-mono">No favorited AI tools added yet.</p>
              <button
                onClick={() => navigate('/')}
                className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                Explore AI Directory & Save Favorites
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {favorites.map((tool) => (
                <div key={tool.id} className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-950/80 border border-gray-200 dark:border-gray-800 hover:border-orange-500/50 transition-all space-y-3 group">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                      {tool.category}
                    </span>
                    <span className="text-[10px] font-mono text-gray-500">⭐ {tool.rating}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors">{tool.name}</h4>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">{tool.pricing}</p>
                  </div>
                  <a
                    href={tool.url || tool.website || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 bg-gray-200 dark:bg-gray-900 hover:bg-orange-500 text-gray-800 dark:text-gray-300 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1"
                  >
                    <span>Launch Tool</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;