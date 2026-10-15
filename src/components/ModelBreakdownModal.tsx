import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles, Zap, Cpu, Compass, CheckCircle2 } from 'lucide-react';

interface ModelInfo {
  id: string;
  name: string;
  version: string;
  tagline: string;
  badge: string;
  why: string;
  when: string;
  how: string;
  where: string;
  bestFor: string;
  speed: string;
  contextWindow: string;
  pricing: string;
}

const CLAUDE_MODELS: ModelInfo[] = [
  {
    id: 'sonnet-3-7',
    name: 'Claude 3.7 Sonnet / Sonnet 5',
    version: 'v3.7 / v5 Flagship',
    tagline: 'Hybrid reasoning & full-stack software development champion',
    badge: 'Best for Coding & Agents',
    why: 'Combines instant natural language responses with extended thinking time for complex multi-file engineering.',
    when: 'Use when building full-stack web applications, refactoring complex codebases, or executing multi-step autonomous agent workflows.',
    how: 'Provide project context or codebase files; set thinking budget for deep logic problems.',
    where: 'Deploy in Cursor Editor, Claude.ai, Anthropic API, AWS Bedrock, or GCP Vertex AI.',
    bestFor: 'Complex Coding, Agentic Workflows, Technical Architecture, System Refactoring',
    speed: '⚡ Fast (120+ tokens/sec)',
    contextWindow: '200,000 Tokens (~150,000 words)',
    pricing: '$3.00 / M input, $15.00 / M output'
  },
  {
    id: 'opus-4-8',
    name: 'Claude 4.8 Opus',
    version: 'v4.8 Frontier Reasoning',
    tagline: 'Deep scientific research, complex math proofs & enterprise intelligence',
    badge: 'Best for Deep Reasoning',
    why: 'Highest intelligence benchmark score on complex reasoning, academic research, and deep domain analysis.',
    when: 'Use when writing research papers, analyzing legal contracts, solving advanced mathematical theorems, or architecting enterprise systems.',
    how: 'Pass comprehensive documentation, datasets, or multi-page research papers for deep synthesis.',
    where: 'Claude.ai Enterprise, Anthropic API, AWS Bedrock.',
    bestFor: 'Mathematical Proofs, Academic Research, Enterprise Strategy, Deep Data Analysis',
    speed: '🐢 Moderate (50 tokens/sec)',
    contextWindow: '200,000 Tokens (~150,000 words)',
    pricing: '$15.00 / M input, $75.00 / M output'
  },
  {
    id: 'haiku-3-5',
    name: 'Claude 3.5 Haiku',
    version: 'v3.5 High Throughput',
    tagline: 'Ultra-fast, budget-friendly AI for real-time applications',
    badge: 'Best for Speed & Cost',
    why: 'Matches previous generation flagship intelligence at 4x the speed and a fraction of the API cost.',
    when: 'Use for high-volume customer support bots, data classification, background log parsing, or instant UI feedback.',
    how: 'Send concise prompts with low latency requirements.',
    where: 'API pipelines, edge deployments, customer chatbots, web microservices.',
    bestFor: 'Real-time Chat, High-Volume Data Parsing, Cost Optimization, Customer Support',
    speed: '⚡⚡ Ultra Fast (250+ tokens/sec)',
    contextWindow: '200,000 Tokens (~150,000 words)',
    pricing: '$0.80 / M input, $4.00 / M output'
  },
  {
    id: 'mythos-experimental',
    name: 'Claude Mythos (Experimental)',
    version: 'Frontier Experimental',
    tagline: 'Quantum mechanics, biophysics & formal mathematical proof solver',
    badge: 'Scientific Frontier',
    why: 'Specialized scientific foundation model trained on formal logic, molecular biology, and quantum simulation.',
    when: 'Use for drug discovery modeling, quantum physics simulations, and formal code verification.',
    how: 'Input LaTeX math, chemical formulas, or formal logic specifications.',
    where: 'Anthropic Research Labs & Enterprise Bio/Tech API.',
    bestFor: 'Quantum Physics, Molecular Chemistry, Formal Proof Verification',
    speed: '🧠 Deep Thinking (Variable)',
    contextWindow: '500,000 Tokens (~375,000 words)',
    pricing: 'Enterprise Research Tier'
  },
  {
    id: 'fable-experimental',
    name: 'Claude Fable (Experimental)',
    version: 'Frontier Creative',
    tagline: 'Narrative intelligence, multi-chapter fiction & natural human prose',
    badge: 'Creative & Narrative',
    why: 'Trained specifically on human emotional intelligence, literary structure, character development, and natural dialogue.',
    when: 'Use for novel writing, video game scriptwriting, dialogue generation, and creative brand storytelling.',
    how: 'Provide character bibles, world lore, and chapter outlines.',
    where: 'Claude Studio & Creative API.',
    bestFor: 'Screenwriting, Creative Writing, Novel Generation, Game Dialogue',
    speed: '⚡ Fast (100 tokens/sec)',
    contextWindow: '200,000 Tokens (~150,000 words)',
    pricing: 'Creator Tier'
  }
];

interface ModelBreakdownModalProps {
  onClose: () => void;
}

const ModelBreakdownModal: React.FC<ModelBreakdownModalProps> = ({ onClose }) => {
  const [selectedModel, setSelectedModel] = useState<ModelInfo>(CLAUDE_MODELS[0]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white dark:bg-[#141721] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden relative"
      >
        {/* Sticky Header with Close Button */}
        <div className="bg-gradient-to-r from-orange-500 to-purple-600 p-5 text-white flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2.5 py-0.5 rounded-full">
              Model Breakdown Guide
            </span>
            <h2 className="text-xl sm:text-2xl font-black mt-1 leading-tight">
              Claude AI Models Comparison
            </h2>
          </div>

          <button
            onClick={onClose}
            className="flex items-center space-x-1 bg-black/30 hover:bg-black/50 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md shrink-0"
          >
            <span>Close</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Model Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {CLAUDE_MODELS.map((model) => {
              const isSelected = selectedModel.id === model.id;
              return (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                    isSelected
                      ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {model.name}
                </button>
              );
            })}
          </div>

          {/* Active Model Content Card */}
          <div className="bg-gray-50 dark:bg-[#1c202f] rounded-xl p-5 border border-gray-200 dark:border-gray-700/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 dark:border-gray-700/60 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {selectedModel.name}
                  </h3>
                  <span className="bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {selectedModel.badge}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {selectedModel.tagline}
                </p>
              </div>

              <div className="text-left sm:text-right text-[11px] space-y-0.5">
                <span className="block font-bold text-orange-500">{selectedModel.speed}</span>
                <span className="block text-gray-500">{selectedModel.contextWindow}</span>
              </div>
            </div>

            {/* 4 Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-white dark:bg-[#141721] p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-orange-500 flex items-center gap-1 mb-1">
                  <Sparkles className="w-3.5 h-3.5" /> 1. WHY Use It?
                </h4>
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-snug">
                  {selectedModel.why}
                </p>
              </div>

              <div className="bg-white dark:bg-[#141721] p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-blue-500 flex items-center gap-1 mb-1">
                  <Cpu className="w-3.5 h-3.5" /> 2. WHEN To Choose It?
                </h4>
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-snug">
                  {selectedModel.when}
                </p>
              </div>

              <div className="bg-white dark:bg-[#141721] p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1 mb-1">
                  <Zap className="w-3.5 h-3.5" /> 3. HOW To Prompt It?
                </h4>
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-snug">
                  {selectedModel.how}
                </p>
              </div>

              <div className="bg-white dark:bg-[#141721] p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-purple-500 flex items-center gap-1 mb-1">
                  <Compass className="w-3.5 h-3.5" /> 4. WHERE To Access?
                </h4>
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-snug">
                  {selectedModel.where}
                </p>
              </div>
            </div>

            {/* Best For Summary */}
            <div className="bg-orange-500/10 p-3 rounded-lg border border-orange-500/20">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-1 mb-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> 5. WHICH Use Cases Are Best?
              </h4>
              <p className="text-xs text-gray-800 dark:text-gray-200 font-bold">
                {selectedModel.bestFor}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 dark:bg-[#181b28] px-6 py-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-gray-500">Press ESC or click backdrop to close</span>
          <button
            onClick={onClose}
            className="px-5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow transition-all"
          >
            Close Guide
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ModelBreakdownModal;
