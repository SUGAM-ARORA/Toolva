import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  BookOpen,
  Cpu,
  HardDrive,
  Layers,
  DollarSign,
  TrendingUp,
  Search,
  Filter,
  Workflow,
  Brain,
  GraduationCap,
  Book,
  Trophy,
  Zap,
  Users,
  Activity,
  Shield,
  HelpCircle,
  Mail,
  Settings,
  X,
  Sparkles,
} from 'lucide-react';
import { isUserSuperAdmin, getCurrentUser } from '../lib/auth';

export interface NavigationSidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onGoHome: () => void;
  user?: any;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  currentView,
  onViewChange,
  onGoHome,
  user,
  isMobileOpen,
  onCloseMobile,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = user || getCurrentUser();
  const isSuperAdmin = isUserSuperAdmin(currentUser);

  const isHomeActive = location.pathname === '/' && currentView === 'grid';

  const handleSelectView = (viewId: string) => {
    onViewChange(viewId);
    if (location.pathname !== '/') {
      navigate('/');
    }
    onCloseMobile();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (href: string) => {
    navigate(href);
    onCloseMobile();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const primaryNav = [
    { label: 'AI Directory', icon: BookOpen, view: 'grid', badge: 'All Tools' },
    { label: 'Local-AI Engine', icon: Cpu, view: 'local-ai', badge: 'Private' },
    { label: 'Hardware Benchmarks', icon: HardDrive, view: 'benchmarks' },
    { label: 'AI Stack Planner', icon: Layers, view: 'planner' },
    { label: 'Cost Estimator', icon: DollarSign, view: 'estimator' },
    { label: 'GitHub Momentum', icon: TrendingUp, view: 'momentum', badge: 'Live' },
  ];

  const discoveryNav = [
    { label: 'Smart Recommender', icon: Search, view: 'finder' },
    { label: 'Tool Compare', icon: Filter, view: 'compare' },
    { label: 'Workflow Builder', icon: Workflow, view: 'workflows' },
    { label: 'Prompt Studio', icon: Brain, view: 'prompts' },
    { label: 'Learning Hub', icon: GraduationCap, view: 'learning' },
    { label: 'AI Dictionary', icon: Book, view: 'dictionary' },
    { label: 'Weekly Leaderboard', icon: Trophy, view: 'weekly' },
    { label: 'Submit AI Tool', icon: Zap, view: 'submit', highlight: true },
  ];

  const adminNav = [
    { label: 'User Management', icon: Users, view: 'users', path: '/users' },
    { label: 'Activity Logs', icon: Activity, view: 'activity', path: '/activity' },
    { label: 'Admin Dashboard', icon: Shield, view: 'admin', path: '/admin' },
  ];

  const utilityNav = [
    { label: 'Help & FAQ', icon: HelpCircle, path: '/help' },
    { label: 'Contact Us', icon: Mail, path: '/contact' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <>
      {/* ── Mobile Backdrop Overlay ── */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden transition-opacity"
        />
      )}

      {/* ── Main Sidebar Container ── */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 md:z-30 flex flex-col bg-white/95 dark:bg-[#0c101b]/95 backdrop-blur-xl border-r border-gray-200/90 dark:border-gray-800/80 shadow-2xl transition-all duration-300 ease-in-out group/sidebar ${
          isMobileOpen
            ? 'translate-x-0 w-64'
            : '-translate-x-full md:translate-x-0 w-64 md:w-16 md:hover:w-64'
        }`}
      >
        {/* ── Top Brand Header & Home Navigation ── */}
        <div className="h-16 flex items-center justify-between px-3.5 border-b border-gray-200/70 dark:border-gray-800/70 shrink-0">
          <button
            onClick={() => {
              onGoHome();
              onCloseMobile();
            }}
            className="flex items-center space-x-3 w-full text-left group cursor-pointer overflow-hidden"
            title="Toolva.ai Home"
          >
            {/* Centered Glowing Logo Tile */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-sky-400 to-blue-600 flex items-center justify-center font-black text-white text-sm shadow-md shadow-cyan-500/25 shrink-0 group-hover:scale-105 transition-transform">
              T
            </div>

            {/* Brand Title Label (Reveals on Hover/Expand) */}
            <div className="flex flex-col overflow-hidden whitespace-nowrap opacity-100 md:opacity-0 md:group-hover/sidebar:opacity-100 transition-all duration-200">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-black uppercase tracking-wider font-mono text-gray-900 dark:text-white">
                  TOOLVA<span className="text-cyan-500 font-extrabold">.AI</span>
                </span>
                {isHomeActive && (
                  <span className="text-[9px] bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 font-bold px-1.5 py-0.2 rounded-full border border-cyan-500/30">
                    Home
                  </span>
                )}
              </div>
              <span className="text-[9px] text-gray-400 dark:text-gray-500 font-medium">
                Autonomous AI Hub
              </span>
            </div>
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Scrollable Navigation Items ── */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-800">
          {/* Section: Core Workflows */}
          <div className="space-y-1">
            <div className="px-2.5 pb-1 text-[9px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 font-mono whitespace-nowrap opacity-100 md:opacity-0 md:group-hover/sidebar:opacity-100 transition-opacity">
              Intelligence
            </div>
            {primaryNav.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === '/' && currentView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => handleSelectView(item.view)}
                  title={item.label}
                  className={`group relative flex items-center w-full h-10 px-2 rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/15 via-sky-500/10 to-blue-500/15 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 font-bold shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-gray-100/80 dark:hover:bg-[#141926]'
                  }`}
                >
                  {/* Left Active Glow Indicator */}
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-cyan-500 to-blue-600 rounded-r-full" />
                  )}

                  <div className="w-6 h-6 flex items-center justify-center shrink-0">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-500' : 'group-hover:text-cyan-500 transition-colors'}`} />
                  </div>

                  <span className="ml-3 text-xs truncate whitespace-nowrap opacity-100 md:opacity-0 md:group-hover/sidebar:opacity-100 transition-opacity duration-200">
                    {item.label}
                  </span>

                  {item.badge && (
                    <span className="ml-auto text-[9px] font-mono px-1.5 py-0.2 rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 opacity-100 md:opacity-0 md:group-hover/sidebar:opacity-100 transition-opacity">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Section: Discovery & Studios */}
          <div className="space-y-1 pt-2 border-t border-gray-100 dark:border-gray-800/60">
            <div className="px-2.5 pb-1 text-[9px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 font-mono whitespace-nowrap opacity-100 md:opacity-0 md:group-hover/sidebar:opacity-100 transition-opacity">
              Discovery & Studio
            </div>
            {discoveryNav.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === '/' && currentView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => handleSelectView(item.view)}
                  title={item.label}
                  className={`group relative flex items-center w-full h-10 px-2 rounded-xl transition-all cursor-pointer ${
                    item.highlight
                      ? 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-white font-bold shadow-md shadow-cyan-500/20 hover:scale-[1.02]'
                      : isActive
                      ? 'bg-gradient-to-r from-cyan-500/15 via-sky-500/10 to-blue-500/15 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 font-bold shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-gray-100/80 dark:hover:bg-[#141926]'
                  }`}
                >
                  {isActive && !item.highlight && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-cyan-500 to-blue-600 rounded-r-full" />
                  )}

                  <div className="w-6 h-6 flex items-center justify-center shrink-0">
                    <Icon className={`w-4 h-4 ${item.highlight ? 'text-white' : isActive ? 'text-cyan-500' : 'group-hover:text-cyan-500 transition-colors'}`} />
                  </div>

                  <span className="ml-3 text-xs truncate whitespace-nowrap opacity-100 md:opacity-0 md:group-hover/sidebar:opacity-100 transition-opacity duration-200">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Section: Administration (SuperAdmin Only) */}
          {isSuperAdmin && (
            <div className="space-y-1 pt-2 border-t border-purple-500/20">
              <div className="px-2.5 pb-1 text-[9px] font-bold uppercase tracking-wider text-purple-400 font-mono whitespace-nowrap opacity-100 md:opacity-0 md:group-hover/sidebar:opacity-100 transition-opacity flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                <span>SuperAdmin</span>
              </div>
              {adminNav.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || (location.pathname === '/' && currentView === item.view);
                return (
                  <button
                    key={item.view}
                    onClick={() => handleNavClick(item.path)}
                    title={item.label}
                    className={`group relative flex items-center w-full h-10 px-2 rounded-xl transition-all cursor-pointer ${
                      isActive
                        ? 'bg-purple-500/15 border border-purple-500/30 text-purple-600 dark:text-purple-400 font-bold shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-purple-500 hover:bg-purple-500/5'
                    }`}
                  >
                    <div className="w-6 h-6 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-purple-400" />
                    </div>
                    <span className="ml-3 text-xs truncate whitespace-nowrap opacity-100 md:opacity-0 md:group-hover/sidebar:opacity-100 transition-opacity duration-200">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Bottom Utility Section ── */}
        <div className="p-2 border-t border-gray-200/70 dark:border-gray-800/70 space-y-0.5 shrink-0 bg-gray-50/50 dark:bg-[#090d16]/50">
          {utilityNav.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                title={item.label}
                className={`flex items-center w-full h-9 px-2 rounded-xl transition-all ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/60'
                }`}
              >
                <div className="w-6 h-6 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="ml-3 text-xs truncate whitespace-nowrap opacity-100 md:opacity-0 md:group-hover/sidebar:opacity-100 transition-opacity duration-200">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
};

export default NavigationSidebar;
