import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers, Sparkles, ArrowRight, ChevronRight, CheckCircle2, 
  DollarSign, Server, Cloud, Zap, RefreshCw, Cpu, Mic,
  Video, Code, Brain, FileText, Image, Search, X
} from 'lucide-react';
import { AITool } from '../types';

interface AIStackPlannerProps {
  tools: AITool[];
  onBackToHome?: () => void;
  onToolSelect?: (tool: AITool) => void;
}

interface StackStep {
  stage: string;
  purpose: string;
  icon: any;
  color: string;
  options: {
    type: 'cloud' | 'local' | 'hybrid';
    toolName: string;
    description: string;
    pricing: string;
    notes?: string;
  }[];
}

interface StackBlueprint {
  title: string;
  totalCostEstimate: string;
  steps: StackStep[];
  tags: string[];
}

// Predefined use-case blueprints
const BLUEPRINTS: Record<string, StackBlueprint> = {
  youtube: {
    title: '🎬 Faceless YouTube Channel',
    totalCostEstimate: '$0 – $30/month depending on volume',
    tags: ['Content', 'Video', 'Automation', 'Voice'],
    steps: [
      {
        stage: '1. Script Writing',
        purpose: 'Generate engaging video scripts from topic ideas',
        icon: FileText,
        color: 'from-blue-500 to-indigo-500',
        options: [
          { type: 'cloud', toolName: 'Claude 3.5 Sonnet', description: 'Best narrative quality for scripts', pricing: '$3/1M tokens', notes: 'Recommended for < 100 videos/mo' },
          { type: 'local', toolName: 'Ollama (LLaMA 3.1 8B)', description: 'Free, runs locally, solid quality', pricing: 'FREE', notes: 'Needs 8GB+ RAM' },
        ],
      },
      {
        stage: '2. AI Voice Cloning',
        purpose: 'Convert scripts to natural-sounding speech',
        icon: Mic,
        color: 'from-purple-500 to-pink-500',
        options: [
          { type: 'cloud', toolName: 'ElevenLabs', description: 'Best voice quality, 10min free/mo', pricing: '$5-$22/mo', notes: 'Most realistic output' },
          { type: 'local', toolName: 'Kokoro-TTS / Coqui', description: 'Open source, runs on CPU', pricing: 'FREE', notes: 'Requires ~2GB storage' },
        ],
      },
      {
        stage: '3. Video Generation',
        purpose: 'Create background visuals and animations',
        icon: Video,
        color: 'from-orange-500 to-red-500',
        options: [
          { type: 'cloud', toolName: 'Remotion + Stable Diffusion', description: 'Programmatic video with AI imagery', pricing: 'FREE (self-hosted)', notes: 'Needs Node.js + GPU' },
          { type: 'cloud', toolName: 'Runway ML', description: 'Professional AI video generation', pricing: '$12-$28/mo' },
        ],
      },
      {
        stage: '4. SEO & Title Optimization',
        purpose: 'Generate SEO-optimized titles, tags, descriptions',
        icon: Search,
        color: 'from-green-500 to-teal-500',
        options: [
          { type: 'cloud', toolName: 'GPT-4o mini', description: 'Fast, cheap SEO text generation', pricing: '$0.15/1M tokens', notes: 'Ideal for bulk SEO tasks' },
        ],
      },
    ],
  },
  codeassistant: {
    title: '💻 Personal AI Coding Assistant',
    totalCostEstimate: '$0 – $20/month',
    tags: ['Coding', 'Development', 'Local AI'],
    steps: [
      {
        stage: '1. Code Generation & Chat',
        purpose: 'Inline code suggestions, explanations, debugging',
        icon: Code,
        color: 'from-blue-500 to-cyan-500',
        options: [
          { type: 'local', toolName: 'Continue + Ollama', description: 'VS Code extension with local LLM', pricing: 'FREE', notes: 'Best privacy-first option' },
          { type: 'cloud', toolName: 'GitHub Copilot', description: 'Industry-standard coding AI', pricing: '$10/mo', notes: 'Best cloud option' },
        ],
      },
      {
        stage: '2. Code Review & Security',
        purpose: 'Automated PR reviews, vulnerability detection',
        icon: CheckCircle2,
        color: 'from-green-500 to-emerald-500',
        options: [
          { type: 'cloud', toolName: 'Claude 3.5 Sonnet', description: 'Best at understanding complex codebases', pricing: '$3/1M tokens', notes: 'Via API integration' },
        ],
      },
      {
        stage: '3. Documentation Generation',
        purpose: 'Auto-generate docstrings, READMEs, API docs',
        icon: FileText,
        color: 'from-purple-500 to-violet-500',
        options: [
          { type: 'local', toolName: 'Ollama (DeepSeek Coder)', description: 'Code-specialized local model', pricing: 'FREE', notes: 'Needs 8GB VRAM for 7B' },
          { type: 'cloud', toolName: 'GPT-4o', description: 'Best documentation quality', pricing: '$2.50/1M tokens' },
        ],
      },
    ],
  },
  research: {
    title: '📚 AI Research Assistant',
    totalCostEstimate: '$0 – $15/month',
    tags: ['Research', 'Analysis', 'Documents'],
    steps: [
      {
        stage: '1. Document Processing & RAG',
        purpose: 'Ingest PDFs, papers, websites for Q&A',
        icon: Brain,
        color: 'from-indigo-500 to-purple-500',
        options: [
          { type: 'local', toolName: 'Ollama + LangChain + Chroma', description: 'Fully local RAG pipeline', pricing: 'FREE', notes: 'Best for sensitive documents' },
          { type: 'cloud', toolName: 'Perplexity API', description: 'Web-aware research assistant', pricing: '$0.005/search' },
        ],
      },
      {
        stage: '2. Summarization & Analysis',
        purpose: 'Condense long papers into key insights',
        icon: Sparkles,
        color: 'from-pink-500 to-rose-500',
        options: [
          { type: 'cloud', toolName: 'Claude 3 Haiku', description: 'Fast, cost-effective summarization', pricing: '$0.25/1M tokens' },
          { type: 'local', toolName: 'Mistral 7B (Ollama)', description: 'Great local summarization', pricing: 'FREE', notes: 'Needs 8GB RAM' },
        ],
      },
      {
        stage: '3. Citation & Reference Management',
        purpose: 'Extract and format citations from papers',
        icon: FileText,
        color: 'from-yellow-500 to-orange-500',
        options: [
          { type: 'cloud', toolName: 'GPT-4o mini', description: 'Reliable citation extraction', pricing: '$0.15/1M tokens' },
        ],
      },
    ],
  },
  imagegeneration: {
    title: '🎨 AI Image & Design Studio',
    totalCostEstimate: '$0 – $25/month',
    tags: ['Images', 'Design', 'Creative', 'Visual'],
    steps: [
      {
        stage: '1. Text-to-Image Generation',
        purpose: 'Create high-quality images from prompts',
        icon: Image,
        color: 'from-pink-500 to-purple-500',
        options: [
          { type: 'local', toolName: 'ComfyUI + SDXL', description: 'Most powerful local image generation', pricing: 'FREE', notes: 'Needs 8GB+ VRAM' },
          { type: 'cloud', toolName: 'Flux.1 (via Replicate)', description: 'State-of-the-art quality', pricing: '~$0.055/image' },
          { type: 'cloud', toolName: 'DALL-E 3', description: 'OpenAI image generation', pricing: '$0.04-0.12/image' },
        ],
      },
      {
        stage: '2. Prompt Engineering Assistant',
        purpose: 'Generate optimized prompts for images',
        icon: FileText,
        color: 'from-orange-500 to-yellow-500',
        options: [
          { type: 'local', toolName: 'Ollama (Llama 3)', description: 'Free local prompt generation', pricing: 'FREE' },
        ],
      },
    ],
  },
};

const INTENT_SUGGESTIONS = [
  "Build a faceless YouTube channel",
  "Create a personal coding assistant",
  "Set up an AI research pipeline",
  "Build an AI image generation studio",
  "Automate customer support",
];

const detectIntent = (input: string): string | null => {
  const lower = input.toLowerCase();
  if (lower.includes('youtube') || lower.includes('video') || lower.includes('faceless')) return 'youtube';
  if (lower.includes('cod') || lower.includes('programm') || lower.includes('developer')) return 'codeassistant';
  if (lower.includes('research') || lower.includes('paper') || lower.includes('document') || lower.includes('pdf')) return 'research';
  if (lower.includes('image') || lower.includes('design') || lower.includes('art') || lower.includes('visual')) return 'imagegeneration';
  return null;
};

const AIStackPlanner: React.FC<AIStackPlannerProps> = ({ tools, onBackToHome }) => {
  const [intent, setIntent] = useState('');
  const [blueprint, setBlueprint] = useState<StackBlueprint | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<Record<string, number>>({});
  const [noMatch, setNoMatch] = useState(false);

  const handleGenerate = () => {
    const matched = detectIntent(intent);
    setIsGenerating(true);
    setNoMatch(false);
    setSelectedTypes({});

    setTimeout(() => {
      if (matched && BLUEPRINTS[matched]) {
        setBlueprint(BLUEPRINTS[matched]);
      } else {
        setNoMatch(true);
        setBlueprint(null);
      }
      setIsGenerating(false);
    }, 1200);
  };

  const handleSuggestion = (suggestion: string) => {
    setIntent(suggestion);
    const matched = detectIntent(suggestion);
    setIsGenerating(true);
    setNoMatch(false);
    setSelectedTypes({});
    setTimeout(() => {
      if (matched && BLUEPRINTS[matched]) {
        setBlueprint(BLUEPRINTS[matched]);
      } else {
        setNoMatch(true);
        setBlueprint(null);
      }
      setIsGenerating(false);
    }, 900);
  };

  const totalMonthly = blueprint
    ? blueprint.steps
        .map((step, idx) => {
          const selected = step.options[selectedTypes[idx] ?? 0];
          const price = selected?.pricing ?? '';
          if (price.toUpperCase().includes('FREE') || price === '$0') return 0;
          const match = price.match(/\$([0-9.]+)/);
          return match ? parseFloat(match[1]) : 0;
        })
        .reduce((a, b) => a + b, 0)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] text-gray-900 dark:text-white">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/90 dark:bg-[#141721]/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {onBackToHome && (
            <button onClick={onBackToHome} className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">←</button>
          )}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-black text-base text-gray-900 dark:text-white">AI Stack Planner</h1>
              <p className="text-[10px] text-gray-500 font-mono">Intent-based multi-tool workflow architect</p>
            </div>
          </div>
        </div>
        {blueprint && (
          <button
            onClick={() => { setBlueprint(null); setIntent(''); setNoMatch(false); }}
            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Intent Input */}
        {!blueprint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Hero */}
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center shadow-xl">
                <Layers className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                What do you want to build?
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
                Describe your goal and ToolVa will generate a complete multi-tool AI stack blueprint — with pricing, local vs cloud options, and step-by-step guidance.
              </p>
            </div>

            {/* Input + Generate */}
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={intent}
                  onChange={e => setIntent(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && intent.trim() && handleGenerate()}
                  placeholder="e.g., I want to build a faceless YouTube channel..."
                  className="w-full px-5 py-4 bg-white dark:bg-[#141721] text-gray-900 dark:text-white rounded-2xl border border-gray-200 dark:border-gray-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-sm shadow-xl transition-all pr-32"
                />
                <button
                  onClick={handleGenerate}
                  disabled={!intent.trim() || isGenerating}
                  className="absolute right-2 top-2 bottom-2 px-5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-50 flex items-center space-x-1.5"
                >
                  {isGenerating ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Plan</span>
                    </>
                  )}
                </button>
              </div>

              {/* Suggestions */}
              <div className="space-y-2">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Try these examples:</p>
                <div className="flex flex-wrap gap-2">
                  {INTENT_SUGGESTIONS.map(suggestion => (
                    <button
                      key={suggestion}
                      onClick={() => handleSuggestion(suggestion)}
                      className="px-3 py-1.5 bg-white dark:bg-[#141721] border border-gray-200 dark:border-gray-700 hover:border-purple-500/50 text-gray-700 dark:text-gray-300 text-xs rounded-xl transition-all hover:shadow-md font-medium"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* No match message */}
            {noMatch && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 bg-white dark:bg-[#141721] rounded-2xl border border-gray-200 dark:border-gray-800 text-center"
              >
                <div className="text-3xl mb-3">🤔</div>
                <h3 className="font-black text-gray-900 dark:text-white mb-2">No Blueprint Found</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  We don't have a pre-built stack for "{intent}" yet. Try one of the example suggestions above, or{' '}
                  <a href="mailto:support.toolva@gmail.com" className="text-purple-500 hover:text-purple-600 font-bold">request this blueprint</a>.
                </p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Blueprint Result */}
        <AnimatePresence>
          {blueprint && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Blueprint Header */}
              <div className="bg-gradient-to-br from-purple-500/10 via-indigo-500/10 to-transparent border border-purple-500/30 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black text-gray-900 dark:text-white">{blueprint.title}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Stack for: <em className="text-purple-400 font-bold">"{intent}"</em>
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {blueprint.tags.map(tag => (
                        <span key={tag} className="px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-400 text-xs font-bold">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs text-gray-500 font-mono">Estimated monthly cost</div>
                    <div className="text-2xl font-black text-green-500">${totalMonthly.toFixed(2)}</div>
                    <div className="text-xs text-gray-400">{blueprint.totalCostEstimate}</div>
                  </div>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-4">
                {blueprint.steps.map((step, idx) => {
                  const selectedOptionIdx = selectedTypes[idx] ?? 0;
                  const selectedOption = step.options[selectedOptionIdx];
                  const Icon = step.icon;

                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white dark:bg-[#141721] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
                    >
                      {/* Step Header */}
                      <div className={`bg-gradient-to-r ${step.color} p-4 flex items-center space-x-3`}>
                        <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-black text-white text-sm">{step.stage}</div>
                          <div className="text-white/80 text-xs">{step.purpose}</div>
                        </div>
                      </div>

                      {/* Options */}
                      <div className="p-4 space-y-3">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Choose your approach:</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {step.options.map((option, optIdx) => (
                            <button
                              key={optIdx}
                              onClick={() => setSelectedTypes(prev => ({ ...prev, [idx]: optIdx }))}
                              className={`text-left p-3 rounded-xl border transition-all ${
                                selectedOptionIdx === optIdx
                                  ? 'border-purple-500/50 bg-purple-500/5 shadow-md'
                                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-black text-xs text-gray-900 dark:text-white">{option.toolName}</span>
                                <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold ${
                                  option.type === 'local'
                                    ? 'bg-purple-500/20 text-purple-400'
                                    : option.type === 'hybrid'
                                    ? 'bg-yellow-500/20 text-yellow-500'
                                    : 'bg-blue-500/20 text-blue-400'
                                }`}>
                                  {option.type === 'local' ? '🖥️ LOCAL' : option.type === 'hybrid' ? '🔄 HYBRID' : '☁️ CLOUD'}
                                </span>
                              </div>
                              <div className="text-[11px] text-gray-500 mb-2">{option.description}</div>
                              <div className="flex items-center justify-between">
                                <span className="font-black text-xs text-green-500">{option.pricing}</span>
                                {option.notes && (
                                  <span className="text-[9px] text-gray-400 italic">{option.notes}</span>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>

                        {/* Selected summary */}
                        <div className="flex items-center space-x-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            Using: <strong>{selectedOption?.toolName}</strong> — {selectedOption?.pricing}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Total Summary */}
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <div className="font-black text-gray-900 dark:text-white">Total Stack Cost</div>
                  <div className="text-xs text-gray-500">Based on your selections above</div>
                </div>
                <div className="text-3xl font-black text-green-500">${totalMonthly.toFixed(2)}<span className="text-sm font-bold">/mo</span></div>
              </div>

              {/* Try again */}
              <button
                onClick={() => { setBlueprint(null); setIntent(''); setNoMatch(false); }}
                className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 text-gray-500 hover:border-purple-500/50 hover:text-purple-500 rounded-2xl text-sm font-bold transition-all flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Plan a Different Stack</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading state */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16 space-y-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center shadow-xl">
                <Sparkles className="w-8 h-8 text-white animate-pulse" />
              </div>
              <div className="text-center">
                <div className="font-black text-gray-900 dark:text-white">Generating Your Stack Blueprint...</div>
                <div className="text-sm text-gray-500 mt-1">Analyzing your goal and mapping the best AI tools</div>
              </div>
              <div className="flex space-x-1.5">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-purple-500 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AIStackPlanner;
