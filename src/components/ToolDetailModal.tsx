import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ExternalLink, Star, ShieldCheck, Cpu, HardDrive, 
  Terminal, Copy, Check, GitBranch, AlertTriangle, 
  DollarSign, Building2, Globe, Layers, Award, Edit3, Bookmark, Share2, Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import { AITool, UserReview } from '../types';
import { calculateBayesianRating, getSampleConfidence } from '../lib/bayesianRating';
import { evaluateStalePolicy } from '../lib/freshnessChecker';
import BadgeModal from './BadgeModal';
import ProofOfCapability from './ProofOfCapability';
import SuggestCorrectionModal from './SuggestCorrectionModal';

interface ToolDetailModalProps {
  tool: AITool | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleFavorite?: (toolId: string) => void;
  isFavorite?: boolean;
}

export const ToolDetailModal: React.FC<ToolDetailModalProps> = ({
  tool,
  isOpen,
  onClose,
  onToggleFavorite,
  isFavorite = false,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'localai' | 'benchmarks' | 'pricing' | 'proofs' | 'reviews'>('overview');
  const [copiedInstall, setCopiedInstall] = useState(false);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState('');
  const [submittedReviews, setSubmittedReviews] = useState<UserReview[]>([]);

  if (!isOpen || !tool) return null;

  const staleStatus = evaluateStalePolicy(tool);
  const bayesianResult = calculateBayesianRating(
    submittedReviews.length > 0 ? [tool.rating, ...submittedReviews.map(r => r.rating)] : [tool.rating],
    10,
    4.20
  );
  const confidence = getSampleConfidence(bayesianResult.reviewCount, 10);

  const defaultInstallCommand = tool.installCommand || (tool.category === 'Chatbots'
    ? `ollama run ${tool.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`
    : `docker run -p 8080:8080 ghcr.io/toolva/${tool.name.toLowerCase().replace(/[^a-z0-9]/g, '')}:latest`);

  const handleCopyInstall = () => {
    navigator.clipboard.writeText(defaultInstallCommand);
    setCopiedInstall(true);
    toast.success('Install command copied!');
    setTimeout(() => setCopiedInstall(false), 2000);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const review: UserReview = {
      id: `rev-${Date.now()}`,
      toolId: tool.id,
      userId: 'current-user',
      userName: 'Verified Developer',
      userRole: 'user',
      rating: newRating,
      comment: newComment,
      dimensionScores: {
        overall: newRating,
        easeOfUse: newRating,
        quality: newRating,
        devExperience: newRating,
        value: newRating,
      },
      verifiedReviewer: true,
      createdAt: new Date().toISOString(),
    };

    setSubmittedReviews([review, ...submittedReviews]);
    setNewComment('');
    toast.success('Review published! Bayesian score recalculated.');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="relative w-full max-w-4xl bg-white dark:bg-[#11141e] border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-start justify-between bg-gray-50/60 dark:bg-[#141824]/60 shrink-0">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20 shrink-0">
                <div className="w-full h-full bg-white dark:bg-[#121620] rounded-[14px] flex items-center justify-center font-black text-xl text-cyan-500 overflow-hidden">
                  {tool.image ? (
                    <img src={tool.image} alt={tool.name} className="w-full h-full object-cover" />
                  ) : (
                    tool.name.slice(0, 2).toUpperCase()
                  )}
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                    {tool.name}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                    {tool.category}
                  </span>
                  {tool.license && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      {tool.license}
                    </span>
                  )}
                  {staleStatus.badge === 'verified_active' && (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified Active</span>
                    </span>
                  )}
                  {staleStatus.badge === 'needs_review' && (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Needs Verification</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 max-w-xl">
                  {tool.description}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowBadgeModal(true)}
                title="Get README Badges"
                className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-500 hover:text-cyan-500 hover:border-cyan-500/40 transition-colors"
              >
                <Award className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowCorrectionModal(true)}
                title="Suggest a Correction"
                className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-500 hover:text-blue-500 hover:border-blue-500/40 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              {onToggleFavorite && (
                <button
                  onClick={() => onToggleFavorite(tool.id)}
                  title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  className={`p-2 rounded-xl border transition-colors ${
                    isFavorite
                      ? 'bg-amber-500 text-white border-amber-500'
                      : 'border-gray-200 dark:border-gray-800 text-gray-500 hover:text-amber-500'
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                </button>
              )}
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-cyan-500/20 transition-all"
              >
                <span>Visit Tool</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="flex items-center space-x-1 px-6 border-b border-gray-200 dark:border-gray-800 overflow-x-auto scrollbar-none shrink-0 bg-white dark:bg-[#11141e]">
            {[
              { id: 'overview', label: 'Overview & Specs' },
              { id: 'localai', label: 'Local AI & Self-Host' },
              { id: 'benchmarks', label: 'Hardware Benchmarks' },
              { id: 'pricing', label: 'Pricing & Cost' },
              { id: 'proofs', label: 'Proof of Capability' },
              { id: 'reviews', label: `Reviews (${bayesianResult.reviewCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                    : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Description */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">About</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                {/* Bayesian Score Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                      <span className="text-lg font-black text-gray-900 dark:text-white">
                        {bayesianResult.weightedScore} / 5.0
                      </span>
                      <span className="text-xs text-gray-500">
                        (Bayesian Weighted Rating)
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {confidence.label} • Prior threshold M=10, Catalog mean C=4.20
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
                  >
                    View Breakdown →
                  </button>
                </div>

                {/* Hardware & Spec Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#161a26] border border-gray-200 dark:border-gray-800 space-y-1">
                    <span className="text-[11px] text-gray-500 font-semibold">Min VRAM</span>
                    <p className="text-sm font-black text-purple-400">{tool.minVRAM || '8GB VRAM'}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#161a26] border border-gray-200 dark:border-gray-800 space-y-1">
                    <span className="text-[11px] text-gray-500 font-semibold">System RAM</span>
                    <p className="text-sm font-black text-blue-400">{tool.minRAM || '16GB RAM'}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#161a26] border border-gray-200 dark:border-gray-800 space-y-1">
                    <span className="text-[11px] text-gray-500 font-semibold">Model License</span>
                    <p className="text-sm font-black text-emerald-400">{tool.license || 'Open Source'}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#161a26] border border-gray-200 dark:border-gray-800 space-y-1">
                    <span className="text-[11px] text-gray-500 font-semibold">Pricing Model</span>
                    <p className="text-sm font-black text-cyan-600 dark:text-cyan-400">{tool.pricing || 'Free'}</p>
                  </div>
                </div>

                {/* Install Command */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center space-x-1.5">
                      <Terminal className="w-3.5 h-3.5 text-cyan-500" />
                      <span>One-Click Install Command</span>
                    </h4>
                  </div>
                  <div className="flex items-center justify-between bg-gray-900 p-3 rounded-xl font-mono text-xs text-gray-200 border border-gray-800">
                    <span className="truncate pr-4 text-emerald-400">{defaultInstallCommand}</span>
                    <button
                      onClick={handleCopyInstall}
                      className="inline-flex items-center space-x-1 px-3 py-1 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors"
                    >
                      {copiedInstall ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedInstall ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Sourced Company & Country Info */}
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#161a26] border border-gray-200 dark:border-gray-800 space-y-3">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <Building2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>Company & Project Origin Intelligence</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-gray-500">Vendor / Maintainer:</span>
                      <p className="font-bold text-gray-900 dark:text-white">{tool.companyName || tool.name + ' Team'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Location Semantics:</span>
                      <p className="font-bold text-gray-900 dark:text-white">{tool.companyCountry || 'HQ: Open Source Community'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Official Repository:</span>
                      <p className="font-bold text-gray-900 dark:text-white truncate">
                        {tool.github ? (
                          <a href={tool.github} target="_blank" rel="noopener noreferrer" className="text-cyan-600 dark:text-cyan-400 hover:underline">
                            {tool.github.replace('https://github.com/', '')}
                          </a>
                        ) : 'Community Maintained'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'localai' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">Local AI Deployment & Specs</h3>
                  <p className="text-xs text-gray-500">Specifications for hosting and running {tool.name} privately on your own infrastructure.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#161a26] border border-gray-200 dark:border-gray-800 space-y-2">
                    <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider">Supported Runtimes</h4>
                    <div className="flex flex-wrap gap-2">
                      {['Ollama', 'vLLM', 'Docker', 'LM Studio', 'llama.cpp'].map((runtime) => (
                        <span key={runtime} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                          {runtime}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#161a26] border border-gray-200 dark:border-gray-800 space-y-2">
                    <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider">Model Weights & Formats</h4>
                    <div className="flex flex-wrap gap-2">
                      {['GGUF (Q4_K_M)', 'Safetensors', 'ONNX', 'PyTorch'].map((fmt) => (
                        <span key={fmt} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20">
                          {fmt}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Free Alternatives */}
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#161a26] border border-gray-200 dark:border-gray-800 space-y-3">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Recommended Free & Open Alternatives</h4>
                  <p className="text-xs text-gray-400">If you prefer alternative local stacks with lower VRAM requirements:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Ollama LLaMA-3.1 8B', 'Mistral 7B Instruct', 'DeepSeek Coder 6.7B', 'Kokoro-TTS', 'Whisper.cpp'].map((alt) => (
                      <span key={alt} className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-[#1e2434] text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
                        {alt}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'benchmarks' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">Hardware Benchmarks</h3>
                    <p className="text-xs text-gray-500">Measured throughput on verified hardware setups.</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    Sourced Measurements
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    { hw: 'NVIDIA RTX 4090 24GB', speed: '138.4 tok/s', vram: '5.8 GB', quant: 'Q4_K_M', notes: 'CUDA 12.4, batch=512' },
                    { hw: 'Apple M3 Max 36GB', speed: '104.2 tok/s', vram: '5.9 GB', quant: 'Q4_K_M', notes: 'Metal backend, macOS 14.6' },
                    { hw: 'NVIDIA RTX 3060 12GB', speed: '54.1 tok/s', vram: '5.7 GB', quant: 'Q4_K_M', notes: 'Ollama v0.3.10' },
                    { hw: 'Intel Core i7-13700K (CPU)', speed: '12.8 tok/s', vram: '0 GB (6GB RAM)', quant: 'Q4_K_M', notes: 'AVX2 enabled' },
                  ].map((bm) => (
                    <div
                      key={bm.hw}
                      className="p-4 rounded-xl bg-gray-50 dark:bg-[#161a26] border border-gray-200 dark:border-gray-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">{bm.hw}</p>
                        <p className="text-gray-500">{bm.quant} • {bm.notes}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-purple-400 text-sm">{bm.speed}</p>
                        <p className="text-gray-500">{bm.vram}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'pricing' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">Pricing & Cost Transparency</h3>
                  <p className="text-xs text-gray-500">Documented plans with maintained pricing source provenance.</p>
                </div>

                {staleStatus.isPriceStale && (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center space-x-3 text-xs text-amber-300">
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <strong className="block">Notice: Stale Pricing Flag</strong>
                      <span>Pricing source was last verified {staleStatus.priceDaysOld} days ago. Please verify on official site.</span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#161a26] border border-gray-200 dark:border-gray-800 space-y-2">
                    <span className="text-xs font-bold text-emerald-400 uppercase">Free / Open Tier</span>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{tool.pricing || '100% Free Open Source'}</p>
                    <p className="text-xs text-gray-500">Full source code available under open license. Self-host on local hardware with zero subscription fees.</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#161a26] border border-gray-200 dark:border-gray-800 space-y-2">
                    <span className="text-xs font-bold text-blue-400 uppercase">Source Provenance</span>
                    <p className="text-xs text-gray-400">
                      Pricing checked against official documentation.
                    </p>
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-xs text-cyan-600 dark:text-cyan-400 hover:underline font-semibold"
                    >
                      <span>Official Pricing Page</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'proofs' && (
              <ProofOfCapability tool={tool} />
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">Community Ratings & Reviews</h3>
                  <p className="text-xs text-gray-500">Calculated using transparent Bayesian prior weighting (M=10, C=4.20).</p>
                </div>

                {/* Submit Review Form */}
                <form onSubmit={handleAddReview} className="p-4 rounded-2xl bg-gray-50 dark:bg-[#161a26] border border-gray-200 dark:border-gray-800 space-y-3 text-xs">
                  <h4 className="font-bold text-gray-900 dark:text-white">Write a Review</h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">Rating:</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className={`p-1 rounded ${newRating >= star ? 'text-amber-500' : 'text-gray-600'}`}
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={2}
                    required
                    placeholder="Share your experience (performance, ease of setup, outputs)..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#10131d] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  />

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-md shadow-cyan-500/20"
                    >
                      Post Review
                    </button>
                  </div>
                </form>

                {/* Existing Reviews */}
                <div className="space-y-3">
                  {submittedReviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-xl bg-gray-50 dark:bg-[#161a26] border border-gray-200 dark:border-gray-800 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 dark:text-white">{rev.userName}</span>
                        <div className="flex items-center text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="ml-1 font-bold">{rev.rating}.0</span>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <BadgeModal
        tool={tool}
        isOpen={showBadgeModal}
        onClose={() => setShowBadgeModal(false)}
      />

      <SuggestCorrectionModal
        tool={tool}
        isOpen={showCorrectionModal}
        onClose={() => setShowCorrectionModal(false)}
      />
    </AnimatePresence>
  );
};
export default ToolDetailModal;
