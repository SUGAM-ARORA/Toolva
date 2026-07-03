import React from 'react';
import { Github, Twitter, Linkedin, Mail, ArrowRight, Zap, Code, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface FooterProps {
  onViewChange?: (view: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onViewChange }) => {
  const navigate = useNavigate();

  const handleNav = (e: React.MouseEvent, view: string) => {
    e.preventDefault();
    if (onViewChange) {
      onViewChange(view);
    }
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white dark:bg-[#0f1117] border-t border-gray-200 dark:border-gray-800/80 mt-12 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-orange-500/5 dark:bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-wider font-mono flex items-center">
                TOOLVA<span className="text-orange-500">.AI</span>
              </h3>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                The ultimate directory for AI tools and resources. Discover, compare, and find the perfect AI solutions for your workflow.
              </p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800/60 text-gray-500 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800/60 text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800/60 text-gray-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-700/10 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800/60 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6 flex items-center space-x-2">
              <Zap className="w-4 h-4 text-orange-500" />
              <span>Explore</span>
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" onClick={(e) => handleNav(e, 'grid')} className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors flex items-center group">
                  <ArrowRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-orange-500" />
                  Browse Tools (Griha)
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => handleNav(e, 'finder')} className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors flex items-center group">
                  <ArrowRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-orange-500" />
                  AI Finder (Veda)
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => handleNav(e, 'compare')} className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors flex items-center group">
                  <ArrowRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-orange-500" />
                  Compare Tools (Tulna)
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => handleNav(e, 'personas')} className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors flex items-center group">
                  <ArrowRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-orange-500" />
                  Personas (Vyakta)
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6 flex items-center space-x-2">
              <Code className="w-4 h-4 text-blue-500" />
              <span>Resources</span>
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" onClick={(e) => handleNav(e, 'learning')} className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors flex items-center group">
                  <ArrowRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-blue-500" />
                  Learning Hub (Vidya)
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => handleNav(e, 'dictionary')} className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors flex items-center group">
                  <ArrowRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-blue-500" />
                  AI Dictionary (Medha)
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => handleNav(e, 'prompts')} className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors flex items-center group">
                  <ArrowRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-blue-500" />
                  Prompt Explorer (Uttara)
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => handleNav(e, 'submit')} className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors flex items-center group">
                  <ArrowRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-blue-500" />
                  Submit a Tool (Samarp)
                </a>
              </li>
            </ul>
          </div>

          {/* Legal / User */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6 flex items-center space-x-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Platform</span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/profile" onClick={() => window.scrollTo({ top: 0 })} className="text-sm text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors flex items-center group">
                  <ArrowRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-green-500" />
                  My Profile
                </Link>
              </li>
              <li>
                <Link to="/favorites" onClick={() => window.scrollTo({ top: 0 })} className="text-sm text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors flex items-center group">
                  <ArrowRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-green-500" />
                  Favorites
                </Link>
              </li>
              <li>
                <Link to="/settings" onClick={() => window.scrollTo({ top: 0 })} className="text-sm text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors flex items-center group">
                  <ArrowRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-green-500" />
                  Settings
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors flex items-center group">
                  <ArrowRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-green-500" />
                  Privacy & Terms
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800/80 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-500">
            © {new Date().getFullYear()} ToolVa. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <span className="text-xs text-gray-400 dark:text-gray-600 font-mono">Build v2.0.4</span>
            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
            <span className="text-xs text-gray-400 dark:text-gray-600 flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
              Systems Normal
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;