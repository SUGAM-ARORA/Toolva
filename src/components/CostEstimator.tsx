import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Calculator, TrendingDown, Zap, Server, Cloud, Info, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface CostEstimatorProps {
  onBackToHome?: () => void;
}

interface Provider {
  id: string;
  name: string;
  model: string;
  inputCostPer1M: number;  // USD per 1M input tokens
  outputCostPer1M: number; // USD per 1M output tokens
  color: string;
  type: 'cloud' | 'local';
  hardware?: string;
  notes?: string;
  url: string;
  sourceDate: string; // When pricing was last verified
}

const PROVIDERS: Provider[] = [
  {
    id: 'gpt4o',
    name: 'OpenAI',
    model: 'GPT-4o',
    inputCostPer1M: 2.50,
    outputCostPer1M: 10.00,
    color: '#10a37f',
    type: 'cloud',
    notes: 'Most capable GPT-4 class model',
    url: 'https://openai.com/pricing',
    sourceDate: '2024-10',
  },
  {
    id: 'gpt4o-mini',
    name: 'OpenAI',
    model: 'GPT-4o mini',
    inputCostPer1M: 0.15,
    outputCostPer1M: 0.60,
    color: '#34d399',
    type: 'cloud',
    notes: 'Budget-friendly GPT-4 class',
    url: 'https://openai.com/pricing',
    sourceDate: '2024-10',
  },
  {
    id: 'claude35sonnet',
    name: 'Anthropic',
    model: 'Claude 3.5 Sonnet',
    inputCostPer1M: 3.00,
    outputCostPer1M: 15.00,
    color: '#f97316',
    type: 'cloud',
    notes: 'Excellent at coding & analysis',
    url: 'https://www.anthropic.com/pricing',
    sourceDate: '2024-10',
  },
  {
    id: 'claude3haiku',
    name: 'Anthropic',
    model: 'Claude 3 Haiku',
    inputCostPer1M: 0.25,
    outputCostPer1M: 1.25,
    color: '#fb923c',
    type: 'cloud',
    notes: 'Fast, affordable Anthropic model',
    url: 'https://www.anthropic.com/pricing',
    sourceDate: '2024-10',
  },
  {
    id: 'gemini15pro',
    name: 'Google',
    model: 'Gemini 1.5 Pro',
    inputCostPer1M: 1.25,
    outputCostPer1M: 5.00,
    color: '#4285f4',
    type: 'cloud',
    notes: '1M context window, multimodal',
    url: 'https://ai.google.dev/pricing',
    sourceDate: '2024-10',
  },
  {
    id: 'gemini15flash',
    name: 'Google',
    model: 'Gemini 1.5 Flash',
    inputCostPer1M: 0.075,
    outputCostPer1M: 0.30,
    color: '#34a853',
    type: 'cloud',
    notes: 'Most affordable at scale',
    url: 'https://ai.google.dev/pricing',
    sourceDate: '2024-10',
  },
  {
    id: 'groq-llama',
    name: 'Groq',
    model: 'LLaMA 3.1 70B',
    inputCostPer1M: 0.59,
    outputCostPer1M: 0.79,
    color: '#f59e0b',
    type: 'cloud',
    notes: 'Ultra-fast inference speeds',
    url: 'https://groq.com/pricing',
    sourceDate: '2024-10',
  },
  {
    id: 'local-runpod',
    name: 'Self-Hosted',
    model: 'vLLM / RunPod RTX 4090',
    inputCostPer1M: 0.08,
    outputCostPer1M: 0.08,
    color: '#8b5cf6',
    type: 'local',
    hardware: 'NVIDIA RTX 4090 (24GB VRAM)',
    notes: 'Unlimited tokens, $0.74/hr GPU. 3.3M tokens/hr at typical throughput.',
    url: 'https://runpod.io',
    sourceDate: '2024-10',
  },
  {
    id: 'local-ollama',
    name: 'Local / Ollama',
    model: 'Llama 3.1 8B (Quantized)',
    inputCostPer1M: 0,
    outputCostPer1M: 0,
    color: '#ec4899',
    type: 'local',
    hardware: '≥ 8GB RAM (Apple M2 or better)',
    notes: 'Completely free, runs on your machine. Speed depends on hardware.',
    url: 'https://ollama.com',
    sourceDate: '2024-10',
  },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-[#1c202f] border border-gray-200 dark:border-gray-700 rounded-xl p-3 shadow-xl text-xs">
        <p className="font-bold text-gray-900 dark:text-white mb-1">{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.name} style={{ color: entry.color }} className="font-semibold">
            {entry.name}: ${entry.value.toFixed(2)}/mo
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const CostEstimator: React.FC<CostEstimatorProps> = ({ onBackToHome }) => {
  const [inputTokensM, setInputTokensM] = useState(10);   // in millions
  const [outputTokensM, setOutputTokensM] = useState(3);  // in millions
  const [selectedProviders, setSelectedProviders] = useState<string[]>(['gpt4o', 'claude35sonnet', 'gemini15pro', 'groq-llama', 'local-runpod']);
  const [showAll, setShowAll] = useState(false);
  const [showPricingNote, setShowPricingNote] = useState(true);

  const calculations = useMemo(() => {
    return PROVIDERS.map(p => {
      const inputCost = (inputTokensM * p.inputCostPer1M);
      const outputCost = (outputTokensM * p.outputCostPer1M);
      const totalMonthly = inputCost + outputCost;
      return {
        ...p,
        inputCost,
        outputCost,
        totalMonthly,
        totalAnnual: totalMonthly * 12,
      };
    }).sort((a, b) => a.totalMonthly - b.totalMonthly);
  }, [inputTokensM, outputTokensM]);

  const cheapest = calculations[0];
  const mostExpensive = calculations[calculations.length - 1];
  const potentialSavings = mostExpensive.totalMonthly - cheapest.totalMonthly;

  const chartData = calculations
    .filter(c => selectedProviders.includes(c.id))
    .map(c => ({
      name: `${c.name}\n${c.model.split(' ').slice(-2).join(' ')}`,
      shortName: c.model.split(' ').slice(0, 2).join(' '),
      'Monthly Cost': parseFloat(c.totalMonthly.toFixed(2)),
      color: c.color,
    }));

  const toggleProvider = (id: string) => {
    setSelectedProviders(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] text-gray-900 dark:text-white">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/90 dark:bg-[#141721]/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
            >
              ← 
            </button>
          )}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
              <Calculator className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-black text-base text-gray-900 dark:text-white">AI Cost Estimator</h1>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">Compare real infrastructure costs across providers</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Pricing Note */}
        <AnimatePresence>
          {showPricingNote && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-start space-x-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-700 dark:text-amber-400"
            >
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold">Pricing last verified October 2024.</span> AI provider pricing changes frequently. Always verify current rates at each provider's official pricing page before making financial decisions.
              </div>
              <button onClick={() => setShowPricingNote(false)} className="text-amber-500 hover:text-amber-700 font-bold shrink-0">✕</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Savings Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10 border border-green-500/30 p-6 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <TrendingDown className="w-5 h-5 text-green-500" />
                <span className="text-sm font-bold text-green-600 dark:text-green-400">Potential Monthly Savings</span>
              </div>
              <div className="text-4xl font-black text-gray-900 dark:text-white">
                ${potentialSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                By choosing <strong>{cheapest.name} {cheapest.model}</strong> over <strong>{mostExpensive.name} {mostExpensive.model}</strong>
              </p>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-xl">
              <DollarSign className="w-5 h-5 text-green-500" />
              <div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Annual savings</div>
                <div className="font-black text-green-600 dark:text-green-400">
                  ${(potentialSavings * 12).toLocaleString('en-US', { maximumFractionDigits: 0 })} / yr
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Token Usage Sliders */}
        <div className="bg-white dark:bg-[#141721] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-6">
          <h2 className="font-black text-lg flex items-center space-x-2">
            <Zap className="w-5 h-5 text-orange-500" />
            <span>Monthly Token Usage</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Input Tokens</label>
                <span className="text-sm font-black text-orange-500">{inputTokensM}M tokens</span>
              </div>
              <input
                type="range"
                min={0.1}
                max={100}
                step={0.1}
                value={inputTokensM}
                onChange={e => setInputTokensM(parseFloat(e.target.value))}
                className="w-full accent-orange-500"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                <span>100K</span><span>10M</span><span>50M</span><span>100M</span>
              </div>
              <p className="text-[11px] text-gray-500">Prompts, system messages, context sent to the model</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Output Tokens</label>
                <span className="text-sm font-black text-blue-500">{outputTokensM}M tokens</span>
              </div>
              <input
                type="range"
                min={0.1}
                max={30}
                step={0.1}
                value={outputTokensM}
                onChange={e => setOutputTokensM(parseFloat(e.target.value))}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                <span>100K</span><span>3M</span><span>15M</span><span>30M</span>
              </div>
              <p className="text-[11px] text-gray-500">AI responses generated (typically 3–10x less than input)</p>
            </div>
          </div>
        </div>

        {/* Bar Chart Comparison */}
        <div className="bg-white dark:bg-[#141721] rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-lg">Monthly Cost Comparison</h2>
            <span className="text-xs text-gray-500 font-mono">USD / month</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis
                  dataKey="shortName"
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  angle={-25}
                  textAnchor="end"
                />
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickFormatter={(v) => `$${v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Monthly Cost" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Provider Cards Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-lg">All Providers</h2>
            <button
              onClick={() => setShowAll(!showAll)}
              className="flex items-center space-x-1 text-xs text-orange-500 hover:text-orange-600 font-bold"
            >
              <span>{showAll ? 'Show Less' : 'Show All'}</span>
              {showAll ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(showAll ? calculations : calculations.slice(0, 6)).map((p, idx) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`relative bg-white dark:bg-[#141721] rounded-2xl border transition-all cursor-pointer ${
                  selectedProviders.includes(p.id)
                    ? 'border-orange-500/40 shadow-lg shadow-orange-500/10'
                    : 'border-gray-200 dark:border-gray-800 opacity-60'
                }`}
                onClick={() => toggleProvider(p.id)}
              >
                <div className="p-5 space-y-3">
                  {/* Rank badge */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                      <div>
                        <div className="text-xs text-gray-500 font-mono">{p.name}</div>
                        <div className="font-black text-sm text-gray-900 dark:text-white">{p.model}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      {idx === 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-green-500/20 border border-green-500/30 text-green-600 dark:text-green-400 text-[10px] font-bold">
                          CHEAPEST
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.type === 'local'
                          ? 'bg-purple-500/20 border border-purple-500/30 text-purple-400'
                          : 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
                      }`}>
                        {p.type === 'local' ? '🖥️ LOCAL' : '☁️ CLOUD'}
                      </span>
                    </div>
                  </div>

                  {p.hardware && (
                    <div className="text-[11px] text-purple-400 bg-purple-500/10 border border-purple-500/20 rounded-lg px-2 py-1 font-mono">
                      {p.hardware}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-gray-50 dark:bg-[#1c202f] rounded-xl p-2">
                      <div className="text-[10px] text-gray-500 font-mono">Monthly</div>
                      <div className="font-black text-base" style={{ color: p.color }}>
                        ${p.totalMonthly.toFixed(p.totalMonthly < 1 ? 3 : 2)}
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-[#1c202f] rounded-xl p-2">
                      <div className="text-[10px] text-gray-500 font-mono">Annual</div>
                      <div className="font-black text-base text-gray-900 dark:text-white">
                        ${p.totalAnnual < 1 ? p.totalAnnual.toFixed(2) : p.totalAnnual.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </div>
                    </div>
                  </div>

                  {p.notes && (
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">{p.notes}</p>
                  )}

                  <div className="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-gray-800">
                    <div className="text-[10px] text-gray-400 font-mono">
                      In: ${p.inputCostPer1M}/1M · Out: ${p.outputCostPer1M}/1M
                    </div>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="text-[10px] text-orange-500 hover:text-orange-600 flex items-center space-x-0.5"
                    >
                      <span>Source</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Local vs Cloud Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#141721] rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center space-x-2 mb-3">
              <Cloud className="w-5 h-5 text-blue-500" />
              <h3 className="font-black text-sm">Best Cloud Option</h3>
            </div>
            {(() => {
              const best = calculations.filter(c => c.type === 'cloud')[0];
              return best ? (
                <div>
                  <div className="text-xl font-black" style={{ color: best.color }}>{best.name} {best.model}</div>
                  <div className="text-2xl font-black text-gray-900 dark:text-white">${best.totalMonthly.toFixed(2)}/mo</div>
                  <p className="text-xs text-gray-500 mt-1">{best.notes}</p>
                </div>
              ) : null;
            })()}
          </div>
          <div className="bg-white dark:bg-[#141721] rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center space-x-2 mb-3">
              <Server className="w-5 h-5 text-purple-500" />
              <h3 className="font-black text-sm">Best Local Option</h3>
            </div>
            {(() => {
              const best = calculations.filter(c => c.type === 'local').sort((a, b) => a.totalMonthly - b.totalMonthly)[0];
              return best ? (
                <div>
                  <div className="text-xl font-black" style={{ color: best.color }}>{best.name} {best.model}</div>
                  <div className="text-2xl font-black text-gray-900 dark:text-white">
                    {best.totalMonthly === 0 ? 'FREE' : `$${best.totalMonthly.toFixed(2)}/mo`}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{best.notes}</p>
                </div>
              ) : null;
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostEstimator;
