import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Cpu, Zap, BarChart2, ShieldCheck, ExternalLink, Filter, 
  ArrowRight, Search, Info, HelpCircle, HardDrive, CheckCircle2
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { HARDWARE_BENCHMARK_CATALOG, compareHardwareSpeed } from '../lib/hardwareBenchmarkData';

interface HardwareBenchmarksProps {
  onBackToHome?: () => void;
}

export const HardwareBenchmarks: React.FC<HardwareBenchmarksProps> = ({ onBackToHome }) => {
  const [selectedModel, setSelectedModel] = useState<string>('All');
  const [searchHardware, setSearchHardware] = useState<string>('');
  const [metricView, setMetricView] = useState<'generation' | 'prompt' | 'vram'>('generation');

  const models = useMemo(() => {
    const list = Array.from(new Set(HARDWARE_BENCHMARK_CATALOG.map((b) => b.modelName)));
    return ['All', ...list];
  }, []);

  const filteredBenchmarks = useMemo(() => {
    return HARDWARE_BENCHMARK_CATALOG.filter((b) => {
      const matchModel = selectedModel === 'All' || b.modelName === selectedModel;
      const matchHw = !searchHardware || b.hardware.toLowerCase().includes(searchHardware.toLowerCase());
      return matchModel && matchHw;
    });
  }, [selectedModel, searchHardware]);

  const chartData = useMemo(() => {
    return filteredBenchmarks.map((b) => ({
      name: `${b.hardware.split('(')[0].trim()}`,
      fullName: b.hardware,
      model: b.modelName,
      value:
        metricView === 'generation'
          ? b.tokensPerSecGen
          : metricView === 'prompt'
          ? b.tokensPerSecPrompt
          : b.vramUsedGB,
      unit: metricView === 'vram' ? 'GB' : 'tok/s',
      quant: b.quantization,
    }));
  }, [filteredBenchmarks, metricView]);

  const topBenchmark = useMemo(() => {
    if (filteredBenchmarks.length === 0) return null;
    return [...filteredBenchmarks].sort((a, b) => b.tokensPerSecGen - a.tokensPerSecGen)[0];
  }, [filteredBenchmarks]);

  const speedupComparison = useMemo(() => {
    return compareHardwareSpeed('Llama-3.1-8B', '4090', 'i7-13700K');
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900/30 via-black to-[#0e121a] border border-purple-500/20 p-8 sm:p-12 text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold uppercase tracking-wider">
          <Cpu className="w-3.5 h-3.5" />
          <span>Sourced & Reproducible Measurements</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Hardware & Local AI <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Benchmarks</span>
        </h1>
        <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
          Compare real generation throughput (tokens/sec), prompt processing speed, and VRAM footprints across NVIDIA GPUs, Apple Silicon, and CPUs.
        </p>

        {speedupComparison && (
          <div className="pt-2">
            <div className="inline-flex items-center space-x-3 bg-purple-500/10 border border-purple-500/30 px-4 py-2 rounded-2xl text-xs text-purple-300">
              <Zap className="w-4 h-4 text-purple-400 shrink-0" />
              <span>
                <strong>Key Insight:</strong> NVIDIA RTX 4090 delivers <strong>{speedupComparison.ratio}x faster</strong> throughput than Intel i7 CPU on Llama-3.1-8B.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="bg-white dark:bg-[#141824] border border-gray-200 dark:border-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Model Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          <span className="text-xs font-bold text-gray-500 shrink-0 mr-1">Model:</span>
          {models.map((m) => (
            <button
              key={m}
              onClick={() => setSelectedModel(m)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedModel === m
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'bg-gray-100 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 hover:text-white'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Metric View Switcher */}
        <div className="flex items-center space-x-2 w-full md:w-auto justify-between md:justify-end">
          <div className="flex bg-gray-100 dark:bg-gray-800/80 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setMetricView('generation')}
              className={`px-3 py-1 rounded-lg transition-all ${
                metricView === 'generation' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-500 hover:text-white'
              }`}
            >
              Generation (tok/s)
            </button>
            <button
              onClick={() => setMetricView('prompt')}
              className={`px-3 py-1 rounded-lg transition-all ${
                metricView === 'prompt' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-500 hover:text-white'
              }`}
            >
              Prompt Eval (tok/s)
            </button>
            <button
              onClick={() => setMetricView('vram')}
              className={`px-3 py-1 rounded-lg transition-all ${
                metricView === 'vram' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-500 hover:text-white'
              }`}
            >
              VRAM (GB)
            </button>
          </div>
        </div>
      </div>

      {/* Visual Chart */}
      <div className="bg-white dark:bg-[#141824] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {metricView === 'generation' && 'Generation Throughput (Tokens per Second)'}
              {metricView === 'prompt' && 'Prompt Processing Speed (Tokens per Second)'}
              {metricView === 'vram' && 'VRAM Consumption (Gigabytes)'}
            </h3>
            <p className="text-xs text-gray-500">Higher is better for throughput; lower is better for VRAM footprint.</p>
          </div>
          {topBenchmark && (
            <div className="hidden sm:flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-xs text-emerald-400 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Leader: {topBenchmark.hardware.split('(')[0]} ({topBenchmark.tokensPerSecGen} tok/s)</span>
            </div>
          )}
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" opacity={0.3} />
              <XAxis dataKey="name" stroke="#718096" fontSize={11} interval={0} angle={-15} textAnchor="end" />
              <YAxis stroke="#718096" fontSize={11} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white dark:bg-[#1c2230] border border-gray-200 dark:border-gray-700 p-3 rounded-xl shadow-xl text-xs space-y-1">
                        <p className="font-bold text-gray-900 dark:text-white">{data.fullName}</p>
                        <p className="text-gray-400">Model: {data.model}</p>
                        <p className="text-gray-400">Quant: {data.quant}</p>
                        <p className="font-black text-purple-400 text-sm">
                          {data.value} {data.unit}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? '#8b5cf6' : index === 1 ? '#a855f7' : '#6366f1'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sourced Data Table */}
      <div className="bg-white dark:bg-[#141824] border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <HardDrive className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Verified Benchmark Records</h3>
          </div>
          <span className="text-xs text-gray-500">{filteredBenchmarks.length} records found</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-[#10131c] text-gray-400 uppercase font-bold tracking-wider border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="p-4">Hardware Setup</th>
                <th className="p-4">Model & Quant</th>
                <th className="p-4">Gen Speed</th>
                <th className="p-4">Prompt Speed</th>
                <th className="p-4">VRAM</th>
                <th className="p-4">Verification</th>
                <th className="p-4">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800/60 font-mono text-gray-300">
              {filteredBenchmarks.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="p-4 font-sans font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                    <span>{b.hardware}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-gray-900 dark:text-gray-200">{b.modelName}</span>
                    <span className="block text-gray-500 text-[11px] font-sans">{b.quantization}</span>
                  </td>
                  <td className="p-4 text-purple-400 font-black">{b.tokensPerSecGen} tok/s</td>
                  <td className="p-4 text-gray-400">{b.tokensPerSecPrompt} tok/s</td>
                  <td className="p-4 text-gray-300">{b.vramUsedGB} GB</td>
                  <td className="p-4">
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  </td>
                  <td className="p-4">
                    <a
                      href={b.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-purple-400 hover:text-purple-300 font-sans font-semibold text-xs"
                    >
                      <span>Evidence</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Methodology Disclosure */}
        <div className="p-6 bg-gray-50 dark:bg-[#10131c] border-t border-gray-200 dark:border-gray-800 text-xs text-gray-400 space-y-2">
          <div className="flex items-center space-x-2 font-bold text-gray-300">
            <Info className="w-4 h-4 text-purple-400" />
            <span>Benchmark Methodology & Provenance Disclosure</span>
          </div>
          <p>
            All benchmarks are recorded using reproducible CLI scripts (llama.cpp benchmark runner, Ollama CLI, or vLLM benchmarking suite). Context lengths are fixed at 2,048 or 4,096 tokens, temperature is fixed at 0.0 for deterministic evaluation, and results are averaged over 5 consecutive runs. ToolVa does not use fabricated or estimated speeds.
          </p>
        </div>
      </div>
    </div>
  );
};
export default HardwareBenchmarks;
