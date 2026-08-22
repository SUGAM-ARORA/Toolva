import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  ShieldCheck, 
  Search, 
  RefreshCw, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  UserCheck, 
  Crown, 
  Award, 
  Clock, 
  Mail, 
  Smartphone, 
  MapPin, 
  Edit3, 
  Save, 
  Filter 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  getCurrentUser, 
  getUsersDatabase, 
  updateUserInDatabase, 
  logUserActivity, 
  isUserSuperAdmin,
  ALL_ROLES, 
  UserRole, 
  ToolvaUser 
} from '../lib/auth';
import toast from 'react-hot-toast';

interface UserManagementProps {
  onBackToHome?: () => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ onBackToHome }) => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [users, setUsers] = useState<ToolvaUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [editingUserId, setEditingUserId] = useState<string | number | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');

  const handleBackHome = () => {
    if (onBackToHome) {
      onBackToHome();
    }
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const isSuperAdmin = isUserSuperAdmin(currentUser);

  useEffect(() => {
    loadUsers();
    logUserActivity('PAGE_VIEW', 'Opened User Management Dashboard');
  }, []);

  const loadUsers = () => {
    const db = getUsersDatabase();
    setUsers(db);
  };

  const handleRoleChange = (userId: string | number, newRole: string) => {
    const targetUser = users.find(u => u.id === userId || u.userId === userId);
    if (!targetUser) return;

    const updatedUser: ToolvaUser = {
      ...targetUser,
      role: newRole
    };

    updateUserInDatabase(updatedUser);
    loadUsers();
    setEditingUserId(null);
    toast.success(`Updated role for ${targetUser.name || targetUser.email} to ${newRole}`);
    logUserActivity('ROLE_CHANGE', `Changed user ${targetUser.email} role to ${newRole}`);
  };

  const handleToggleStatus = (userId: string | number) => {
    const targetUser = users.find(u => u.id === userId || u.userId === userId);
    if (!targetUser) return;

    const newStatus = targetUser.status === 'Active' ? 'Suspended' : 'Active';
    const updatedUser: ToolvaUser = {
      ...targetUser,
      status: newStatus
    };

    updateUserInDatabase(updatedUser);
    loadUsers();
    toast.success(`User ${targetUser.email} is now ${newStatus}`);
    logUserActivity('USER_STATUS_CHANGE', `Toggled ${targetUser.email} status to ${newStatus}`);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      (user.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.userId || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'All' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const getRoleBadgeStyle = (roleName?: string) => {
    switch (roleName) {
      case 'SuperAdmin': return 'bg-purple-500/20 text-purple-600 dark:text-purple-300 border-purple-500/30';
      case 'Platform Owner': return 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border-amber-500/30';
      case 'Platform Reader': return 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border-cyan-500/30';
      case 'Lead': return 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border-indigo-500/30';
      case 'Admin': return 'bg-rose-500/20 text-rose-600 dark:text-rose-300 border-rose-500/30';
      case 'Master': return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-300 border-yellow-500/30';
      case 'Expert': return 'bg-pink-500/20 text-pink-600 dark:text-pink-300 border-pink-500/30';
      case 'Proficient': return 'bg-blue-500/20 text-blue-600 dark:text-blue-300 border-blue-500/30';
      case 'Practitioner': return 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-emerald-500/30';
      default: return 'bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/30';
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="max-w-4xl mx-auto pt-24 pb-12 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">SuperAdmin Access Required</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          User Management is restricted to SuperAdmin and Platform Owner accounts.
        </p>
        <button
          onClick={handleBackHome}
          className="px-6 py-2.5 bg-orange-500 text-white font-bold text-xs rounded-xl shadow-lg hover:bg-orange-600 transition-all cursor-pointer"
        >
          Back to AI Directory
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] text-gray-900 dark:text-white pt-20 pb-24 font-sans">
      {/* Sub-header Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3 ml-36 sm:ml-40">
          <button
            onClick={handleBackHome}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-2xl bg-white dark:bg-[#141721] hover:bg-gray-100 dark:hover:bg-[#1c202f] border border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-700 dark:text-gray-200 shadow-md transition-transform active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-orange-500" />
            <span>Back to AI Directory</span>
          </button>
          <span className="text-xs font-black uppercase font-mono tracking-wider text-purple-500 hidden md:inline flex items-center gap-1.5">
            <Crown className="w-4 h-4 text-amber-400" /> SUPERADMIN USER MANAGEMENT
          </span>
        </div>

        <button
          onClick={loadUsers}
          className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-white dark:bg-[#141721] hover:bg-gray-100 dark:hover:bg-[#1c202f] border border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-700 dark:text-gray-200 shadow-md transition-all mr-0 sm:mr-64"
        >
          <RefreshCw className="w-4 h-4 text-orange-500" />
          <span>Refresh Database</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-[#141721] border border-gray-200 dark:border-gray-800/80 p-5 rounded-2xl flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase font-mono">Total Platform Users</p>
              <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{users.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white dark:bg-[#141721] border border-gray-200 dark:border-gray-800/80 p-5 rounded-2xl flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase font-mono">SuperAdmins & Owners</p>
              <p className="text-2xl font-black text-purple-500 mt-1">
                {users.filter(u => u.role === 'SuperAdmin' || u.role === 'Platform Owner' || u.role === 'superadmin').length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
              <Crown className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white dark:bg-[#141721] border border-gray-200 dark:border-gray-800/80 p-5 rounded-2xl flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase font-mono">Active Sessions</p>
              <p className="text-2xl font-black text-emerald-500 mt-1">
                {users.filter(u => u.status !== 'Suspended').length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white dark:bg-[#141721] border border-gray-200 dark:border-gray-800/80 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by name, email, or user ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-medium text-gray-900 dark:text-white outline-none focus:border-orange-500"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500 dark:text-gray-400 font-bold font-mono">Role Filter:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 outline-none focus:border-orange-500"
            >
              <option value="All">All 10 Roles</option>
              {ALL_ROLES.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
        </div>

        {/* User Management Table */}
        <div className="bg-white dark:bg-[#141721] border border-gray-200 dark:border-gray-800/80 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 text-[10px] font-extrabold uppercase font-mono tracking-wider text-gray-500 dark:text-gray-400">
                  <th className="py-4 px-6">User & Identity</th>
                  <th className="py-4 px-6">Email Address</th>
                  <th className="py-4 px-6">Assigned Role (SuperAdmin Editable)</th>
                  <th className="py-4 px-6">Tools Used</th>
                  <th className="py-4 px-6">Last Active</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/80 text-xs">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/40 transition-colors">
                    {/* User Identity */}
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-purple-600 p-0.5 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
                          <div className="w-full h-full rounded-[10px] bg-gray-950 flex items-center justify-center uppercase">
                            {user.name?.[0] || user.email[0]}
                          </div>
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white leading-tight">{user.name || 'Anonymous User'}</p>
                          <span className="text-[10px] font-mono text-orange-500">{user.userId || 'TLVA-000000'}</span>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-4 px-6 font-mono text-gray-600 dark:text-gray-300">
                      {user.email}
                    </td>

                    {/* Assigned Role */}
                    <td className="py-4 px-6">
                      {editingUserId === user.id ? (
                        <div className="flex items-center space-x-2">
                          <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="px-3 py-1.5 bg-gray-50 dark:bg-gray-950 border border-orange-500 rounded-xl text-xs font-mono font-bold text-orange-500 outline-none"
                          >
                            {ALL_ROLES.map(role => (
                              <option key={role} value={role}>{role}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleRoleChange(user.id, selectedRole)}
                            className="p-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 shadow-md"
                            title="Confirm Role Change"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold border ${getRoleBadgeStyle(user.role)}`}>
                            {user.role || 'Novice'}
                          </span>
                          <button
                            onClick={() => {
                              setEditingUserId(user.id);
                              setSelectedRole(user.role || 'Novice');
                            }}
                            className="text-gray-400 hover:text-orange-500 p-1 transition-colors"
                            title="Edit User Role"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Tools Used */}
                    <td className="py-4 px-6 font-mono font-bold text-gray-800 dark:text-gray-200">
                      🔥 {user.toolsOpenedCount || 0} tools
                    </td>

                    {/* Last Active */}
                    <td className="py-4 px-6 font-mono text-[11px] text-gray-500 dark:text-gray-400">
                      {user.lastActive ? new Date(user.lastActive).toLocaleString() : 'Recent'}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                        user.status === 'Suspended' 
                          ? 'bg-red-500/10 text-red-500 border border-red-500/20' 
                          : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      }`}>
                        {user.status || 'Active'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all ${
                          user.status === 'Suspended'
                            ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20'
                            : 'bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20'
                        }`}
                      >
                        {user.status === 'Suspended' ? 'Reactivate User' : 'Suspend User'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
