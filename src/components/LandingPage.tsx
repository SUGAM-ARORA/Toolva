import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, Sparkles, Bot, Image as ImageIcon, Code, Video, Music, TrendingUp, BookOpen, Mouse } from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
}

const floatingCards = [
  { icon: Bot, label: 'ChatGPT', color: 'from-green-400 to-emerald-500', delay: 0 },
  { icon: ImageIcon, label: 'Image Generation', color: 'from-purple-400 to-fuchsia-500', delay: 0.2 },
  { icon: Code, label: 'Coding', color: 'from-blue-400 to-cyan-500', delay: 0.4 },
  { icon: Video, label: 'Video', color: 'from-red-400 to-rose-500', delay: 0.1 },
  { icon: Music, label: 'Music', color: 'from-yellow-400 to-orange-500', delay: 0.3 },
  { icon: TrendingUp, label: 'Marketing', color: 'from-pink-400 to-rose-500', delay: 0.5 },
  { icon: BookOpen, label: 'Education', color: 'from-indigo-400 to-blue-500', delay: 0.25 },
];

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll to enter
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100 && !isScrolled) {
        setIsScrolled(true);
        onEnter();
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled, onEnter]);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white overflow-hidden relative flex flex-col items-center">
      
      {/* Background Animated Gradient & Grid */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        
        {/* Glowing Orbs */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/30 rounded-full blur-[128px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -40, 0],
            y: [0, 60, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/2 -right-20 w-[30rem] h-[30rem] bg-cyan-500/20 rounded-full blur-[128px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
            x: [0, 20, 0],
            y: [0, -20, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-600/20 rounded-full blur-[128px]" 
        />
      </div>

      {/* Floating Cards (Background) */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {floatingCards.map((card, idx) => {
          const Icon = card.icon;
          // Calculate random starting positions
          const top = `${15 + (idx * 12)}%`;
          const left = idx % 2 === 0 ? `${10 + (idx * 5)}%` : `${75 - (idx * 4)}%`;
          
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 50 }}
              animate={{ 
                opacity: 0.8,
                y: [0, -20, 0],
                x: [0, 10, 0],
                rotate: [-2, 2, -2]
              }}
              transition={{
                opacity: { duration: 1, delay: card.delay },
                y: { duration: 6 + idx, repeat: Infinity, ease: "easeInOut", delay: card.delay },
                x: { duration: 7 + idx, repeat: Infinity, ease: "easeInOut", delay: card.delay + 1 },
                rotate: { duration: 8 + idx, repeat: Infinity, ease: "easeInOut", delay: card.delay }
              }}
              className="absolute hidden md:flex items-center space-x-3 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-3 rounded-2xl shadow-xl"
              style={{ top, left }}
            >
              <div className={`p-2 rounded-xl bg-gradient-to-br ${card.color}`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-sm text-gray-200">{card.label}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center min-h-screen">
        
        {/* Logo Spotlight */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8 relative"
        >
          <div className="absolute inset-0 bg-blue-500/40 blur-3xl rounded-full scale-150"></div>
          <div className="relative flex items-center justify-center space-x-3">
             <span className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center font-black text-2xl text-white shadow-[0_0_40px_rgba(56,189,248,0.5)] border border-white/20">
               T
             </span>
             <span className="text-3xl font-black tracking-wider text-white font-mono uppercase">
               TOOLVA<span className="text-cyan-400">.AI</span>
             </span>
          </div>
        </motion.div>

        {/* Headlines */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400 max-w-4xl leading-tight pb-2"
        >
          Discover the Best AI Tools in One Place
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="text-lg md:text-xl text-gray-400 max-w-3xl mb-12 leading-relaxed"
        >
          Explore thousands of AI tools for writing, coding, design, video, marketing, productivity, education, and more—all carefully organized to help you find the perfect tool in seconds.
        </motion.p>

        {/* Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-16"
        >
          <button 
            onClick={onEnter}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-lg flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(56,189,248,0.4)] border border-white/10 group"
          >
            <span>Explore Tools</span>
            <Sparkles className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
          </button>
          
          <button 
            onClick={onEnter}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-lg border border-white/10 text-white font-bold text-lg transition-all transform hover:scale-105 active:scale-95"
          >
            Browse Categories
          </button>
        </motion.div>

        {/* Search Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="w-full max-w-2xl mx-auto mb-16"
        >
          <div 
            onClick={onEnter}
            className="relative cursor-pointer group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
            <div className="relative bg-[#1A1F2E]/80 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center px-6 py-5 shadow-2xl transition-transform transform group-hover:-translate-y-1">
              <Search className="w-6 h-6 text-gray-400 mr-4" />
              <span className="text-xl text-gray-500 flex-1 text-left font-light">Search 5000+ AI Tools...</span>
              <div className="hidden sm:flex items-center space-x-1">
                <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-xs text-gray-400 font-mono">⌘</kbd>
                <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-xs text-gray-400 font-mono">K</kbd>
              </div>
            </div>
          </div>

          {/* Search Chips */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {['ChatGPT', 'Coding', 'Image AI', 'Resume', 'Video AI', 'Productivity'].map((chip, i) => (
              <span 
                key={chip} 
                className="px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                onClick={onEnter}
              >
                {chip}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Badges */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-20 text-gray-400 text-sm font-medium"
        >
          <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-green-400 mr-2 shadow-[0_0_10px_rgba(74,222,128,0.8)]"></div>5000+ AI Tools</div>
          <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-purple-400 mr-2 shadow-[0_0_10px_rgba(192,132,252,0.8)]"></div>250+ Categories</div>
          <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-cyan-400 mr-2 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>Updated Daily</div>
          <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-yellow-400 mr-2 shadow-[0_0_10px_rgba(250,204,21,0.8)]"></div>Free & Paid</div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer text-gray-500 hover:text-gray-300 transition-colors"
          onClick={onEnter}
        >
          <Mouse className="w-6 h-6 mb-2 animate-bounce" />
          <span className="text-xs font-semibold tracking-widest uppercase">Scroll to Explore</span>
        </motion.div>

      </div>
      
      {/* Fake Page Content underneath to trigger scrolling */}
      <div className="h-[20vh] w-full bg-transparent"></div>
    </div>
  );
};

export default LandingPage;
