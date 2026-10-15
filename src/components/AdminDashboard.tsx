import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  UserCheck, 
  Check, 
  X, 
  Clock, 
  Users, 
  ArrowLeft, 
  RefreshCw, 
  Activity, 
  Search, 
  Crown, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Lock 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getCurrentUser, getUsersDatabase, updateUserInDatabase, logUserActivity, isUserSuperAdmin, ToolvaUser } from '../lib/auth';
import { api } from '../lib/apiClient';
import toast from 'react-hot-toast';

interface PendingTool {
  id: string;
  name: string;
  description: string;
  category: string;
  url: string;
  pricing?: string;
  submittedBy: string;
  createdAt: string;
}

interface AdminDashboardProps {
  onBackToHome?: () => void;
  onViewActivityLogs?: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToHome, onViewActivityLogs }) => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [activeTab, setActiveTab] = useState<'pending' | 'users'>('pending');
  const [pendingTools, setPendingTools] = useState<PendingTool[]>([]);
  const [users, setUsers] = useState<ToolvaUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isSuperAdmin = isUserSuperAdmin(currentUser);

  const fetchPendingTools = () => {
    try {
      const stored = localStorage.getItem('toolva_pending_tools');
      if (stored) {
        setPendingTools(JSON.parse(stored));
      } else {
        setPendingTools([]);
      }
    } catch {
      setPendingTools([]);
    }
  };

  const fetchUsers = () => {
    const db = getUsersDatabase();
    setUsers(db);
  };

  useEffect(() => {
    fetchPendingTools();
    fetchUsers();
    logUserActivity('PAGE_VIEW', 'Opened Toolva Control Centre Dashboard');
  }, []);

  const handleBackHome = () => {
    if (onBackToHome) {
      onBackToHome();
    } else {
      navigate('/');
    }
  };

  const handleApproveTool = (id: string, name: string) => {
    try {
      const toolToApprove = pendingTools.find(t => t.id === id);
      if (toolToApprove) {
        // Save to approved custom tools
        const storedApproved = localStorage.getItem('toolva_approved_tools');
        const approvedList = storedApproved ? JSON.parse(storedApproved) : [];
        approvedList.unshift(toolToApprove);
        localStorage.setItem('toolva_approved_tools', JSON.stringify(approvedList));
      }

      // Remove from pending list
      const updatedPending = pendingTools.filter(t => t.id !== id);
      setPendingTools(updatedPending);
      localStorage.setItem('toolva_pending_tools', JSON.stringify(updatedPending));

      logUserActivity('TOOL_APPROVED', `SuperAdmin approved AI tool submission "${name}"`);
      toast.success(`Tool "${name}" approved & published to AI directory!`);
    } catch (err) {
      toast.error(`Failed to approve tool "${name}"`);
    }
  };

  const handleRejectTool = (id: string, name: string) => {
    try {
      const updatedPending = pendingTools.filter(t => t.id !== id);
      setPendingTools(updatedPending);
      localStorage.setItem('toolva_pending_tools', JSON.stringify(updatedPending));

      logUserActivity('TOOL_REJECTED', `SuperAdmin rejected AI tool submission "${name}"`);
      toast.success(`Tool "${name}" rejected.`);
    } catch (err) {
      toast.error(`Failed to reject tool "${name}"`);
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="max-w-4xl mx-auto pt-24 pb-12 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">Admin Access Restricted</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Toolva Control Centre is restricted to SuperAdmin and Platform Owner accounts.
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
      {/* Navigation Sub-header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3 ml-36 sm:ml-40">
          <button
            onClick={handleBackHome}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-2xl bg-white dark:bg-[#141721] hover:bg-gray-100 dark:hover:bg-[#1c202f] border border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-700 dark:text-gray-200 shadow-md transition-transform active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-orange-500" />
            <span>Back to AI Directory</span>
          </button>
          <span className="text-xs font-black uppercase font-mono tracking-wider text-amber-500 hidden md:inline flex items-center gap-1.5">
            <Crown className="w-4 h-4 text-amber-400" /> TOOLVA CONTROL CENTRE
          </span>
        </div>

        <div className="flex items-center space-x-3 mr-0 sm:mr-64">
          <button
            onClick={() => navigate('/users')}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/20 text-xs font-bold transition-all cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>User Management</span>
          </button>
          <button
            onClick={() => navigate('/activity')}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20 text-xs font-bold transition-all cursor-pointer"
          >
            <Activity className="w-4 h-4" />
            <span>Activity Logs</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-[#141721] border border-gray-200 dark:border-gray-800/80 p-5 rounded-2xl flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase font-mono">Pending Tool Submissions</p>
              <p className="text-2xl font-black text-orange-500 mt-1">{pendingTools.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white dark:bg-[#141721] border border-gray-200 dark:border-gray-800/80 p-5 rounded-2xl flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase font-mono">Platform Users</p>
              <p className="text-2xl font-black text-purple-500 mt-1">{users.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white dark:bg-[#141721] border border-gray-200 dark:border-gray-800/80 p-5 rounded-2xl flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase font-mono">SuperAdmin Status</p>
              <p className="text-2xl font-black text-emerald-500 mt-1">ACTIVE</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
              <Crown className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Tab Toggle Header */}
        <div className="bg-white dark:bg-[#141721] border border-gray-200 dark:border-gray-800/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900 dark:text-white">AI Tool Submission Approvals</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Review, verify, approve, or reject user-submitted AI tools in real time.</p>
              </div>
            </div>

            <button
              onClick={fetchPendingTools}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors"
              title="Refresh Submissions"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Pending Tools List (REAL SUBMISSIONS ONLY) */}
          {pendingTools.length === 0 ? (
            <div className="text-center py-12 space-y-3 bg-gray-50 dark:bg-gray-950/40 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto opacity-40" />
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">No Pending Submissions</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                All submitted AI tools have been reviewed. New tool submissions will appear here for SuperAdmin approval.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingTools.map((tool) => (
                <div 
                  key={tool.id} 
                  className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-950/80 border border-gray-200 dark:border-gray-800 space-y-4 shadow-sm hover:border-orange-500/50 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 font-mono">
                        {tool.category || 'Productivity'}
                      </span>
                      <h4 className="font-bold text-base text-gray-900 dark:text-white mt-1">{tool.name}</h4>
                    </div>
                    <span className="text-[10px] font-mono text-gray-400">
                      {new Date(tool.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{tool.description}</p>

                  <div className="text-xs space-y-1 font-mono text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800/80 pt-2">
                    <p>🌐 <a href={tool.url} target="_blank" rel="noreferrer" className="text-orange-500 hover:underline">{tool.url}</a></p>
                    <p>📧 Submitted By: <span className="text-gray-700 dark:text-gray-200 font-bold">{tool.submittedBy}</span></p>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <button
                      onClick={() => handleApproveTool(tool.id, tool.name)}
                      className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve Tool</span>
                    </button>
                    <button
                      onClick={() => handleRejectTool(tool.id, tool.name)}
                      className="flex-1 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject Tool</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
