import React, { useState } from 'react';
import { X, Copy, Check, ShieldCheck, Cpu, Star, TrendingUp, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { AITool } from '../types';

interface BadgeModalProps {
  tool: AITool;
  isOpen: boolean;
  onClose: () => void;
}

export const BadgeModal: React.FC<BadgeModalProps> = ({ tool, isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [embedFormat, setEmbedFormat] = useState<'markdown' | 'html'>('markdown');

  if (!isOpen) return null;

  const baseUrl = window.location.origin;
  const toolSlug = tool.id || tool.name.toLowerCase().replace(/[^a-z0-9]/g, '-');

  const badges = [
    {
      title: 'Bayesian Rating Badge',
      description: 'Displays the live community rating weighted by our transparent Bayesian formula.',
      icon: Star,
      color: 'text-amber-500',
      badgeUrl: `${baseUrl}/api/badges/${toolSlug}/rating.svg`,
      previewAlt: `ToolVa Rating: ${tool.rating || 4.5} ★`,
    },
    {
      title: 'Verified Active Badge',
      description: 'Shows that automated weekly checks confirmed this tool is live and maintained.',
      icon: ShieldCheck,
      color: 'text-emerald-500',
      badgeUrl: `${baseUrl}/api/badges/${toolSlug}/verified.svg`,
      previewAlt: 'ToolVa Verified Active',
    },
    {
      title: 'Local AI Hardware Spec Badge',
      description: 'Shows minimum hardware and VRAM requirements for local inference.',
      icon: Cpu,
      color: 'text-purple-500',
      badgeUrl: `${baseUrl}/api/badges/${toolSlug}/hardware.svg?vram=${encodeURIComponent(tool.minVRAM || '8GB VRAM')}`,
      previewAlt: `Local AI: ${tool.minVRAM || '8GB VRAM'}`,
    },
    {
      title: 'GitHub Momentum Badge',
      description: 'Highlights weekly star growth and community adoption velocity.',
      icon: TrendingUp,
      color: 'text-blue-500',
      badgeUrl: `${baseUrl}/api/badges/${toolSlug}/momentum.svg?growth=%2B180%2Fwk`,
      previewAlt: 'ToolVa Momentum: +180/wk',
    },
  ];

  const getEmbedCode = (badgeUrl: string, altText: string) => {
    const targetUrl = `${baseUrl}/?tool=${toolSlug}`;
    if (embedFormat === 'markdown') {
      return `[![${altText}](${badgeUrl})](${targetUrl})`;
    }
    return `<a href="${targetUrl}" target="_blank" rel="noopener noreferrer"><img src="${badgeUrl}" alt="${altText}" /></a>`;
  };

  const handleCopy = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    toast.success('Badge embed code copied to clipboard!');
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-white dark:bg-[#121620] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/10 text-orange-500 border border-orange-500/20">
                  Dynamic README Badges
                </span>
              </div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white mt-1">
                Embed Badges for {tool.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Format Selector */}
          <div className="px-6 pt-4 flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">Select syntax format:</span>
            <div className="flex bg-gray-100 dark:bg-gray-800/80 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setEmbedFormat('markdown')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  embedFormat === 'markdown'
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Markdown (GitHub)
              </button>
              <button
                onClick={() => setEmbedFormat('html')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  embedFormat === 'html'
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                HTML
              </button>
            </div>
          </div>

          {/* Badges List */}
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            {badges.map((b, index) => {
              const Icon = b.icon;
              const code = getEmbedCode(b.badgeUrl, b.previewAlt);
              const isCopied = copiedIndex === index;

              return (
                <div
                  key={b.title}
                  className="p-4 rounded-xl bg-gray-50 dark:bg-[#181d2a] border border-gray-200 dark:border-gray-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <Icon className={`w-4 h-4 ${b.color}`} />
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{b.title}</span>
                    </div>
                    {/* Live Badge Preview */}
                    <img src={b.badgeUrl} alt={b.previewAlt} className="h-5" />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{b.description}</p>
                  
                  {/* Code snippet block */}
                  <div className="flex items-center justify-between bg-white dark:bg-[#0e121a] p-2.5 rounded-lg border border-gray-200 dark:border-gray-800 text-xs font-mono text-gray-700 dark:text-gray-300">
                    <span className="truncate pr-4">{code}</span>
                    <button
                      onClick={() => handleCopy(code, index)}
                      className="inline-flex items-center space-x-1 px-3 py-1 rounded-md bg-orange-500/10 hover:bg-orange-500 text-orange-600 hover:text-white dark:text-orange-400 dark:hover:text-white transition-all text-xs font-semibold shrink-0"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#151924] flex items-center justify-between text-xs text-gray-500">
            <span>Badges update automatically every 5 minutes from ToolVa API.</span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-medium transition-colors"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
export default BadgeModal;
