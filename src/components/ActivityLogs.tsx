import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Search, RefreshCw, ArrowLeft, Crown, Lock } from 'lucide-react';
import { getCurrentUser, isUserSuperAdmin, getActivityLogs } from '../lib/auth';
import { api } from '../lib/apiClient';

interface ActivityLogItem {
  id: number | string;
  userId: number | string;
  userEmail: string;
  userName: string;
  userRole: string;
  action: string;
  details: string;
  ipAddress: string;
  createdAt: string;
}

interface ActivityLogsProps {
  onBackToHome?: () => void;
  onBackToAdmin?: () => void;
}

const ActivityLogs: React.FC<ActivityLogsProps> = ({ onBackToHome, onBackToAdmin }) => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState('All');

  const isSuperAdmin = isUserSuperAdmin(currentUser);

  const handleBackHome = () => {
    if (onBackToHome) onBackToHome();
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleBackAdmin = () => {
    if (onBackToAdmin) onBackToAdmin();
    navigate('/admin');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/superadmin/activity-logs');
      if (Array.isArray(res)) {
        setLogs(res);
      } else {
        setLogs(getActivityLogs());
      }
    } catch {
      setLogs(getActivityLogs());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  if (!isSuperAdmin) {
    return (
      <div className="max-w-4xl mx-auto pt-24 pb-12 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">Activity Logs Access Restricted</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Activity Logs Tracker is restricted to SuperAdmin and Platform Owner accounts.
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

  const filteredLogs = logs.filter(log => {
    const matchesSearch = !searchQuery ||
      log.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = filterAction === 'All' || log.action === filterAction;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] text-gray-900 dark:text-white pt-20 pb-24 font-sans">
      {/* Sub-header Navigation Bar offset to avoid TOOLVA.AI collision */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3 ml-36 sm:ml-40">
          <button
            onClick={handleBackHome}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-2xl bg-white dark:bg-[#141721] hover:bg-gray-100 dark:hover:bg-[#1c202f] border border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-700 dark:text-gray-200 shadow-md transition-transform active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-orange-500" />
            <span>Back to AI Directory</span>
          </button>
          <button
            onClick={handleBackAdmin}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30 text-xs font-bold transition-transform active:scale-95 cursor-pointer"
          >
            <Crown className="w-4 h-4 text-amber-500" />
            <span>Control Centre</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-6 sm:p-8 rounded-3xl text-white shadow-xl">
          <div>
            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
              Super Admin Security Monitor
            </span>
            <h1 className="text-2xl sm:text-4xl font-black mt-2">
              User Activity & Audit Logs
            </h1>
            <p className="text-xs sm:text-sm text-white/90 mt-1">
              Real-time tracking of login timestamps, user roles, page views, and actions across Toolva.
            </p>
          </div>

          <button
            onClick={fetchLogs}
            className="px-5 py-2.5 bg-black/30 hover:bg-black/50 text-white font-bold text-xs rounded-2xl transition-all border border-white/20 flex items-center gap-2 shrink-0 self-start sm:self-auto cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Logs</span>
          </button>
        </div>

        {/* Search & Action Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#141721] p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search email, user, or action..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#1c202f] border border-gray-200 dark:border-gray-700/80 rounded-xl text-xs font-medium text-gray-900 dark:text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <span className="text-xs text-gray-500 whitespace-nowrap">Filter Action:</span>
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="bg-gray-50 dark:bg-[#1c202f] border border-gray-200 dark:border-gray-700/80 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:border-orange-500 w-full sm:w-auto"
            >
              <option value="All">All Actions</option>
              <option value="USER_LOGIN">USER_LOGIN</option>
              <option value="PAGE_VIEW">PAGE_VIEW</option>
              <option value="TOOL_SUBMITTED">TOOL_SUBMITTED</option>
              <option value="ROLE_UPDATED">ROLE_UPDATED</option>
            </select>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white dark:bg-[#141721] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-[#1c202f] text-gray-500 dark:text-gray-400 uppercase text-[10px] tracking-wider border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">User</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Details</th>
                  <th className="p-4 text-right">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="p-4 font-mono text-[11px] text-gray-500 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-gray-900 dark:text-white block">{log.userName}</span>
                      <span className="text-[11px] text-gray-500 block">{log.userEmail}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        log.userRole === 'superadmin' || log.userRole === 'SuperAdmin'
                          ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400'
                          : log.userRole === 'admin' || log.userRole === 'Admin'
                          ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                      }`}>
                        {log.userRole || 'visitor'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold ${
                        log.action === 'USER_LOGIN'
                          ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400'
                          : log.action === 'PAGE_VIEW'
                          ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                          : 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 text-gray-700 dark:text-gray-300 font-medium max-w-xs truncate">
                      {log.details}
                    </td>
                    <td className="p-4 text-right font-mono text-[11px] text-gray-500">
                      {log.ipAddress}
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

export default ActivityLogs;
