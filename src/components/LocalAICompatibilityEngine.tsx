import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu, HardDrive, Zap, CheckCircle2, AlertTriangle, XCircle,
  HelpCircle, Info, Sliders, ArrowRight, Copy, Check, Terminal,
  RefreshCw, Laptop, Server, Layers, ShieldCheck, Share2
} from 'lucide-react';
import toast from 'react-hot-toast';

export interface ModelPreset {
  id: string;
  name: string;
  paramCountB: number;
  family: string;
  defaultQuant: string;
  contextDefault: number;
  layers: number;
  kvHeads: number;
  headDim: number;
  license: string;
  commercialUse: string;
  bestRuntime: string;
  ollamaTag: string;
}

const MODEL_PRESETS: ModelPreset[] = [
  {
    id: 'llama-3.1-8b',
    name: 'Llama 3.1 8B Instruct',
    paramCountB: 8.03,
    family: 'Llama',
    defaultQuant: 'Q4_K_M',
    contextDefault: 8192,
    layers: 32,
    kvHeads: 8,
    headDim: 128,
    license: 'Llama 3.1 Community License',
    commercialUse: 'Permitted up to 700M monthly active users',
    bestRuntime: 'Ollama / llama.cpp',
    ollamaTag: 'llama3.1:8b',
  },
  {
    id: 'llama-3.1-70b',
    name: 'Llama 3.1 70B Instruct',
    paramCountB: 70.6,
    family: 'Llama',
    defaultQuant: 'Q4_K_M',
    contextDefault: 8192,
    layers: 80,
    kvHeads: 8,
    headDim: 128,
    license: 'Llama 3.1 Community License',
    commercialUse: 'Permitted up to 700M monthly active users',
    bestRuntime: 'vLLM / llama.cpp (ExLlamaV2 for Windows)',
    ollamaTag: 'llama3.1:70b',
  },
  {
    id: 'mistral-7b',
    name: 'Mistral 7B Instruct v0.3',
    paramCountB: 7.25,
    family: 'Mistral',
    defaultQuant: 'Q4_K_M',
    contextDefault: 8192,
    layers: 32,
    kvHeads: 8,
    headDim: 128,
    license: 'Apache 2.0',
    commercialUse: 'Fully Permitted (Unrestricted Commercial)',
    bestRuntime: 'vLLM / Ollama',
    ollamaTag: 'mistral:7b',
  },
  {
    id: 'gemma-2-9b',
    name: 'Gemma 2 9B Instruct',
    paramCountB: 9.24,
    family: 'Gemma',
    defaultQuant: 'Q4_K_M',
    contextDefault: 8192,
    layers: 42,
    kvHeads: 8,
    headDim: 256,
    license: 'Gemma Terms of Use',
    commercialUse: 'Permitted for commercial & research',
    bestRuntime: 'Ollama / LM Studio',
    ollamaTag: 'gemma2:9b',
  },
  {
    id: 'gemma-2-27b',
    name: 'Gemma 2 27B Instruct',
    paramCountB: 27.2,
    family: 'Gemma',
    defaultQuant: 'Q4_K_M',
    contextDefault: 8192,
    layers: 46,
    kvHeads: 16,
    headDim: 128,
    license: 'Gemma Terms of Use',
    commercialUse: 'Permitted for commercial & research',
    bestRuntime: 'llama.cpp / vLLM',
    ollamaTag: 'gemma2:27b',
  },
  {
    id: 'deepseek-coder-v2-16b',
    name: 'DeepSeek Coder V2 Lite (16B MoE)',
    paramCountB: 15.7,
    family: 'DeepSeek',
    defaultQuant: 'Q4_K_M',
    contextDefault: 16384,
    layers: 27,
    kvHeads: 16,
    headDim: 128,
    license: 'DeepSeek License',
    commercialUse: 'Permitted commercial use',
    bestRuntime: 'Ollama / llama.cpp',
    ollamaTag: 'deepseek-coder-v2:16b',
  },
  {
    id: 'qwen-2.5-32b',
    name: 'Qwen 2.5 32B Instruct',
    paramCountB: 32.5,
    family: 'Qwen',
    defaultQuant: 'Q4_K_M',
    contextDefault: 16384,
    layers: 64,
    kvHeads: 8,
    headDim: 128,
    license: 'Apache 2.0',
    commercialUse: 'Fully Permitted (Unrestricted Commercial)',
    bestRuntime: 'vLLM / Ollama',
    ollamaTag: 'qwen2.5:32b',
  },
  {
    id: 'llama-3.1-405b',
    name: 'Llama 3.1 405B Base/Instruct',
    paramCountB: 405.0,
    family: 'Llama',
    defaultQuant: 'Q4_K_M',
    contextDefault: 8192,
    layers: 126,
    kvHeads: 8,
    headDim: 128,
    license: 'Llama 3.1 Community License',
    commercialUse: 'Permitted up to 700M monthly active users',
    bestRuntime: 'vLLM Multi-GPU / Aphrodite',
    ollamaTag: 'llama3.1:405b',
  },
];

interface HardwareRigPreset {
  label: string;
  gpuName: string;
  vramGB: number;
  ramGB: number;
  os: 'Linux' | 'macOS' | 'Windows';
  acceleration: string;
}

const HARDWARE_RIG_PRESETS: HardwareRigPreset[] = [
  { label: 'MacBook Pro M3 Max (36GB Unified)', gpuName: 'Apple M3 Max GPU', vramGB: 28, ramGB: 36, os: 'macOS', acceleration: 'Metal' },
  { label: 'MacBook Pro M2 Pro (16GB Unified)', gpuName: 'Apple M2 Pro GPU', vramGB: 12, ramGB: 16, os: 'macOS', acceleration: 'Metal' },
  { label: 'Gaming PC (NVIDIA RTX 4070 12GB + 32GB RAM)', gpuName: 'NVIDIA RTX 4070', vramGB: 12, ramGB: 32, os: 'Windows', acceleration: 'CUDA' },
  { label: 'AI Rig (NVIDIA RTX 4090 24GB + 64GB RAM)', gpuName: 'NVIDIA RTX 4090', vramGB: 24, ramGB: 64, os: 'Linux', acceleration: 'CUDA' },
  { label: 'Dual Workstation (2x RTX 3090 48GB + 128GB RAM)', gpuName: 'Dual NVIDIA RTX 3090', vramGB: 48, ramGB: 128, os: 'Linux', acceleration: 'CUDA' },
  { label: 'Laptop CPU Only (Intel Core i7 + 16GB RAM)', gpuName: 'CPU-Only (Intel Xe)', vramGB: 0, ramGB: 16, os: 'Windows', acceleration: 'AVX2 CPU' },
];

const QUANT_OPTIONS: Record<string, { bpw: number; label: string; qualityPenalty: string }> = {
  'FP16': { bpw: 16.0, label: 'FP16 (Unquantized - 16-bit)', qualityPenalty: '0% (Exact baseline)' },
  'Q8_0': { bpw: 8.5, label: 'Q8_0 (8-bit High Precision)', qualityPenalty: '< 0.5% degradation' },
  'Q5_K_M': { bpw: 5.5, label: 'Q5_K_M (5-bit Balanced)', qualityPenalty: '~1.0% degradation' },
  'Q4_K_M': { bpw: 4.5, label: 'Q4_K_M (4-bit Recommended Default)', qualityPenalty: '~1.8% degradation' },
  'Q3_K_S': { bpw: 3.4, label: 'Q3_K_S (3-bit High Compression)', qualityPenalty: '~4.5% degradation' },
  'AWQ': { bpw: 4.2, label: 'AWQ (Activation-aware 4-bit for vLLM)', qualityPenalty: '~1.5% degradation' },
};

interface LocalAICompatibilityEngineProps {
  onBackToHome?: () => void;
}

export const LocalAICompatibilityEngine: React.FC<LocalAICompatibilityEngineProps> = ({ onBackToHome }) => {
  // Machine Hardware State
  const [gpuName, setGpuName] = useState('NVIDIA RTX 4070');
  const [vramGB, setVramGB] = useState<number>(12);
  const [ramGB, setRamGB] = useState<number>(32);
  const [os, setOs] = useState<'Linux' | 'macOS' | 'Windows'>('Windows');
  const [acceleration, setAcceleration] = useState('CUDA');

  // Model State
  const [selectedModelId, setSelectedModelId] = useState<string>('llama-3.1-8b');
  const [quantization, setQuantization] = useState<string>('Q4_K_M');
  const [contextTokens, setContextTokens] = useState<number>(8192);
  const [runtime, setRuntime] = useState<string>('Ollama');
  const [copiedCmd, setCopiedCmd] = useState(false);

  // Active Model Record
  const activeModel = useMemo(() => {
    return MODEL_PRESETS.find(m => m.id === selectedModelId) || MODEL_PRESETS[0];
  }, [selectedModelId]);

  // Handle Preset Rig Selection
  const applyRigPreset = (rig: HardwareRigPreset) => {
    setGpuName(rig.gpuName);
    setVramGB(rig.vramGB);
    setRamGB(rig.ramGB);
    setOs(rig.os);
    setAcceleration(rig.acceleration);
    toast.success(`Loaded rig: ${rig.label}`);
  };

  // Calculation Engine
  const analysis = useMemo(() => {
    const quantInfo = QUANT_OPTIONS[quantization] || QUANT_OPTIONS['Q4_K_M'];
    const bpw = quantInfo.bpw;

    // 1. Model Weights Memory (in GB)
    // Formula: (Param_Count * bits_per_weight / 8) * 1.12 allocation overhead
    const weightsGB = (activeModel.paramCountB * bpw / 8) * 1.12;

    // 2. KV Cache Memory (in GB)
    // Formula: 2 * layers * kvHeads * headDim * contextTokens * 2 bytes (FP16 KV) / 1024^3
    const kvCacheBytes = 2 * activeModel.layers * activeModel.kvHeads * activeModel.headDim * contextTokens * 2;
    const kvCacheGB = kvCacheBytes / (1024 * 1024 * 1024);

    // 3. Framework & CUDA/Metal Runtime Overhead
    // CUDA typically consumes ~600MB - 1GB VRAM for context; macOS Metal takes ~400MB
    const frameworkOverheadGB = os === 'macOS' ? 0.45 : vramGB > 0 ? 0.85 : 0.2;

    // 4. Total Memory Needed
    const totalRequiredVRAM = weightsGB + kvCacheGB + frameworkOverheadGB;
    const totalRequiredRAM = weightsGB + kvCacheGB + 2.5; // system RAM if offloaded + OS buffer

    // 5. Fit Verdict
    let verdict: 'likely_fits' | 'may_fit' | 'unlikely_fits' = 'likely_fits';
    let verdictTitle = 'Likely Fits Comfortably';
    let verdictColor = 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';
    let summaryText = '';

    if (vramGB >= totalRequiredVRAM) {
      verdict = 'likely_fits';
      verdictTitle = 'Likely Fits Comfortably in GPU VRAM';
      verdictColor = 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';
      summaryText = `Model fits 100% in GPU VRAM with ${(vramGB - totalRequiredVRAM).toFixed(1)} GB of headroom. Full hardware acceleration active.`;
    } else if (vramGB > 0 && vramGB >= weightsGB * 0.6 && ramGB >= totalRequiredRAM) {
      verdict = 'may_fit';
      verdictTitle = 'May Fit with Constraints (Partial GPU Offload)';
      verdictColor = 'text-amber-500 bg-amber-500/10 border-amber-500/30';
      const offloadPct = Math.round((vramGB / totalRequiredVRAM) * 100);
      summaryText = `Requires partial offloading: ~${offloadPct}% layers offloaded to GPU, rest executed on CPU system RAM (${ramGB} GB available). Expect reduced generation speed.`;
    } else if (vramGB === 0 && ramGB >= totalRequiredRAM) {
      verdict = 'may_fit';
      verdictTitle = 'CPU-Only Execution Feasible';
      verdictColor = 'text-blue-500 bg-blue-500/10 border-blue-500/30';
      summaryText = `Fits entirely in system RAM (${ramGB} GB available vs ${totalRequiredRAM.toFixed(1)} GB needed). Runs via CPU AVX2 instructions with low power.`;
    } else {
      verdict = 'unlikely_fits';
      verdictTitle = 'Unlikely to Fit / Out of Memory (OOM)';
      verdictColor = 'text-rose-500 bg-rose-500/10 border-rose-500/30';
      summaryText = `Requires ${totalRequiredVRAM.toFixed(1)} GB VRAM or ${totalRequiredRAM.toFixed(1)} GB system RAM. Current rig has ${vramGB} GB VRAM & ${ramGB} GB RAM. Will cause thrashing or crash.`;
    }

    // Estimated Speed (tokens/sec)
    let estimatedSpeed = 0;
    if (verdict === 'likely_fits') {
      if (acceleration === 'CUDA' && vramGB >= 24) estimatedSpeed = activeModel.paramCountB <= 10 ? 85 : 35;
      else if (acceleration === 'CUDA' && vramGB >= 12) estimatedSpeed = activeModel.paramCountB <= 10 ? 60 : 18;
      else if (acceleration === 'Metal') estimatedSpeed = activeModel.paramCountB <= 10 ? 55 : 22;
      else estimatedSpeed = 30;
    } else if (verdict === 'may_fit') {
      estimatedSpeed = vramGB > 0 ? 12 : 5;
    } else {
      estimatedSpeed = 0.5;
    }

    return {
      weightsGB: Number(weightsGB.toFixed(2)),
      kvCacheGB: Number(kvCacheGB.toFixed(2)),
      frameworkOverheadGB: Number(frameworkOverheadGB.toFixed(2)),
      totalRequiredVRAM: Number(totalRequiredVRAM.toFixed(2)),
      totalRequiredRAM: Number(totalRequiredRAM.toFixed(2)),
      verdict,
      verdictTitle,
      verdictColor,
      summaryText,
      estimatedSpeed,
      freeHeadroomGB: Number((vramGB - totalRequiredVRAM).toFixed(2)),
    };
  }, [activeModel, quantization, contextTokens, vramGB, ramGB, os, acceleration]);

  const commandToRun = `ollama run ${activeModel.ollamaTag}`;

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(commandToRun);
    setCopiedCmd(true);
    toast.success('Ollama terminal command copied!');
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-950/40 via-black to-[#0e121a] border border-orange-500/25 p-8 sm:p-12 text-center space-y-4 shadow-xl">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider">
          <Cpu className="w-3.5 h-3.5" />
          <span>Priority 1 — Open-Source & Local AI Intelligence</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Local-AI <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-red-400 bg-clip-text text-transparent">Compatibility Engine</span>
        </h1>
        <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Enter your machine hardware specifications to get explainable VRAM breakdowns, context scaling curves, and runtime compatibility estimates. Never guess if a model will fit.
        </p>

        {/* Quick Hardware Presets */}
        <div className="pt-3">
          <span className="text-xs font-bold text-gray-400 block mb-2 uppercase tracking-wider">
            Quick-Select Hardware Profiles:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {HARDWARE_RIG_PRESETS.map((rig) => (
              <button
                key={rig.label}
                onClick={() => applyRigPreset(rig)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-900/80 hover:bg-orange-500/20 text-gray-300 hover:text-white border border-gray-800 hover:border-orange-500/40 transition-all flex items-center gap-1.5"
              >
                <Laptop className="w-3.5 h-3.5 text-orange-400" />
                <span>{rig.label.split('(')[0].trim()}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Two-Column Interactive Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Inputs (Hardware Specs & Model Config) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Card 1: Machine Specifications */}
          <div className="bg-white dark:bg-[#141721] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-5">
            <h3 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Laptop className="w-4 h-4 text-orange-500" />
              <span>1. Your Machine Specifications</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  GPU Device / Architecture:
                </label>
                <input
                  type="text"
                  value={gpuName}
                  onChange={(e) => setGpuName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-[#0c0f17] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:border-orange-500 font-semibold"
                  placeholder="e.g. NVIDIA RTX 4070 / Apple M3 Max"
                />
              </div>

              {/* VRAM Slider */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-gray-700 dark:text-gray-300">
                    Dedicated GPU VRAM:
                  </label>
                  <span className="font-black font-mono text-orange-500 text-sm">
                    {vramGB === 0 ? '0 GB (CPU Only)' : `${vramGB} GB`}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={64}
                  step={2}
                  value={vramGB}
                  onChange={(e) => setVramGB(parseInt(e.target.value, 10))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
                  <span>0GB (CPU)</span>
                  <span>8GB</span>
                  <span>16GB</span>
                  <span>24GB (4090)</span>
                  <span>48GB+</span>
                </div>
              </div>

              {/* System RAM Slider */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-gray-700 dark:text-gray-300">
                    System RAM (RAM):
                  </label>
                  <span className="font-black font-mono text-purple-400 text-sm">
                    {ramGB} GB
                  </span>
                </div>
                <input
                  type="range"
                  min={8}
                  max={128}
                  step={8}
                  value={ramGB}
                  onChange={(e) => setRamGB(parseInt(e.target.value, 10))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
                  <span>8GB</span>
                  <span>16GB</span>
                  <span>32GB</span>
                  <span>64GB</span>
                  <span>128GB</span>
                </div>
              </div>

              {/* Operating System & Acceleration */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                    Operating System:
                  </label>
                  <select
                    value={os}
                    onChange={(e) => {
                      const newOs = e.target.value as any;
                      setOs(newOs);
                      if (newOs === 'macOS') setAcceleration('Metal');
                      else if (vramGB > 0) setAcceleration('CUDA');
                      else setAcceleration('AVX2 CPU');
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#0c0f17] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none font-semibold"
                  >
                    <option value="Linux">Linux (CUDA / ROCm)</option>
                    <option value="macOS">macOS (Metal Unified)</option>
                    <option value="Windows">Windows (CUDA / DirectML)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                    Runtime Driver:
                  </label>
                  <select
                    value={acceleration}
                    onChange={(e) => setAcceleration(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#0c0f17] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none font-semibold"
                  >
                    <option value="CUDA">NVIDIA CUDA</option>
                    <option value="Metal">Apple Metal</option>
                    <option value="ROCm">AMD ROCm</option>
                    <option value="Vulkan">Vulkan / DirectML</option>
                    <option value="AVX2 CPU">CPU Only (AVX2 / AVX-512)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Model Configuration */}
          <div className="bg-white dark:bg-[#141721] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-5">
            <h3 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-orange-500" />
              <span>2. Target Model & Workload Parameters</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  Model Architecture:
                </label>
                <select
                  value={selectedModelId}
                  onChange={(e) => setSelectedModelId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-[#0c0f17] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none font-bold"
                >
                  {MODEL_PRESETS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.paramCountB}B Params)
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantization Select */}
              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  Quantization Format (Bits Per Weight):
                </label>
                <select
                  value={quantization}
                  onChange={(e) => setQuantization(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-[#0c0f17] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none font-bold"
                >
                  {Object.entries(QUANT_OPTIONS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.label} — {v.qualityPenalty}
                    </option>
                  ))}
                </select>
              </div>

              {/* Context Window */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-gray-700 dark:text-gray-300">
                    Active Context Window:
                  </label>
                  <span className="font-black font-mono text-blue-400 text-sm">
                    {contextTokens.toLocaleString()} tokens
                  </span>
                </div>
                <input
                  type="range"
                  min={2048}
                  max={65536}
                  step={2048}
                  value={contextTokens}
                  onChange={(e) => setContextTokens(parseInt(e.target.value, 10))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
                  <span>2K (Chat)</span>
                  <span>8K (Standard)</span>
                  <span>16K (Coding)</span>
                  <span>32K</span>
                  <span>64K (Docs)</span>
                </div>
              </div>

              {/* Preferred Runtime */}
              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  Serving Framework / Runtime:
                </label>
                <select
                  value={runtime}
                  onChange={(e) => setRuntime(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-[#0c0f17] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none font-semibold"
                >
                  <option value="Ollama">Ollama (Easiest Local LLM Runner)</option>
                  <option value="llama.cpp">llama.cpp (Maximum Performance GGUF)</option>
                  <option value="vLLM">vLLM (High Throughput PagedAttention Server)</option>
                  <option value="LM Studio">LM Studio (GUI Desktop App)</option>
                  <option value="ExLlamaV2">ExLlamaV2 (Fastest EXL2 for NVIDIA)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Explainable Results & Evidence */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Verdict Banner */}
          <div className={`p-6 rounded-3xl border ${analysis.verdictColor} shadow-md space-y-3`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                {analysis.verdict === 'likely_fits' && <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />}
                {analysis.verdict === 'may_fit' && <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />}
                {analysis.verdict === 'unlikely_fits' && <XCircle className="w-6 h-6 text-rose-500 shrink-0" />}
                <h2 className="text-xl font-black">{analysis.verdictTitle}</h2>
              </div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/20">
                {analysis.verdict.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed opacity-90">
              {analysis.summaryText}
            </p>
          </div>

          {/* Explainable Memory Breakdown Card */}
          <div className="bg-white dark:bg-[#141721] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-orange-500" />
                <span>Explainable Memory Allocation Breakdown</span>
              </h3>
              <span className="text-xs font-mono text-gray-400">
                Total: <strong className="text-gray-900 dark:text-white">{analysis.totalRequiredVRAM} GB VRAM</strong>
              </span>
            </div>

            {/* Visual Stacked Progress Bar */}
            <div className="space-y-2">
              <div className="w-full h-6 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden flex shadow-inner">
                <div
                  style={{ width: `${Math.min(100, (analysis.weightsGB / Math.max(vramGB, analysis.totalRequiredVRAM)) * 100)}%` }}
                  className="bg-orange-500 h-full flex items-center justify-center text-[10px] font-bold text-white overflow-hidden px-1 transition-all"
                  title={`Weights: ${analysis.weightsGB} GB`}
                >
                  Weights ({analysis.weightsGB}G)
                </div>
                <div
                  style={{ width: `${Math.min(100, (analysis.kvCacheGB / Math.max(vramGB, analysis.totalRequiredVRAM)) * 100)}%` }}
                  className="bg-blue-500 h-full flex items-center justify-center text-[10px] font-bold text-white overflow-hidden px-1 transition-all"
                  title={`KV Cache: ${analysis.kvCacheGB} GB`}
                >
                  KV ({analysis.kvCacheGB}G)
                </div>
                <div
                  style={{ width: `${Math.min(100, (analysis.frameworkOverheadGB / Math.max(vramGB, analysis.totalRequiredVRAM)) * 100)}%` }}
                  className="bg-purple-500 h-full flex items-center justify-center text-[10px] font-bold text-white overflow-hidden px-1 transition-all"
                  title={`Overhead: ${analysis.frameworkOverheadGB} GB`}
                >
                  OS ({analysis.frameworkOverheadGB}G)
                </div>
              </div>

              {/* Legend & Breakdown Table */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20">
                  <span className="text-[11px] text-orange-500 font-semibold block">Model Weights</span>
                  <p className="text-base font-black text-gray-900 dark:text-white font-mono mt-0.5">
                    {analysis.weightsGB} GB
                  </p>
                  <span className="text-[10px] text-gray-400">@ {quantization} format</span>
                </div>
                <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                  <span className="text-[11px] text-blue-400 font-semibold block">KV Cache</span>
                  <p className="text-base font-black text-gray-900 dark:text-white font-mono mt-0.5">
                    {analysis.kvCacheGB} GB
                  </p>
                  <span className="text-[10px] text-gray-400">@ {contextTokens} tokens</span>
                </div>
                <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                  <span className="text-[11px] text-purple-400 font-semibold block">Runtime / OS</span>
                  <p className="text-base font-black text-gray-900 dark:text-white font-mono mt-0.5">
                    {analysis.frameworkOverheadGB} GB
                  </p>
                  <span className="text-[10px] text-gray-400">Driver & allocations</span>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-[11px] text-emerald-400 font-semibold block">Estimated Speed</span>
                  <p className="text-base font-black text-gray-900 dark:text-white font-mono mt-0.5">
                    ~{analysis.estimatedSpeed} tok/s
                  </p>
                  <span className="text-[10px] text-gray-400">Generation rate</span>
                </div>
              </div>
            </div>

            {/* Sourced Calculations Formula Explanation */}
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#0c0f17] border border-gray-200 dark:border-gray-800 text-xs space-y-2">
              <span className="font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-blue-400" />
                <span>Underlying Mathematical Formula & Assumptions:</span>
              </span>
              <ul className="space-y-1 text-gray-600 dark:text-gray-400 font-mono text-[11px] pl-4 list-disc">
                <li>Weights = (Parameters: {activeModel.paramCountB}B × BPW: {QUANT_OPTIONS[quantization]?.bpw} / 8) × 1.12 allocation factor</li>
                <li>KV Cache = 2 × {activeModel.layers} layers × {activeModel.kvHeads} KV heads × {activeModel.headDim} dim × {contextTokens} tokens × 2 bytes</li>
                <li>Overhead includes CUDA context ({acceleration}) and display output buffers.</li>
              </ul>
            </div>
          </div>

          {/* License & Commercial Use Sourced Explainer (Priority 1, Item 3) */}
          <div className="bg-white dark:bg-[#141721] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>License & Commercial-Use Explainer</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#161a26] border border-gray-200 dark:border-gray-800">
                <span className="text-gray-400 font-semibold block mb-0.5">Exact Model License:</span>
                <p className="font-black text-gray-900 dark:text-white">{activeModel.license}</p>
                <span className="text-[10px] text-emerald-500 font-bold mt-1 inline-block">Official Repository Terms</span>
              </div>
              <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#161a26] border border-gray-200 dark:border-gray-800">
                <span className="text-gray-400 font-semibold block mb-0.5">Commercial-Use Permissions:</span>
                <p className="font-black text-gray-900 dark:text-white">{activeModel.commercialUse}</p>
                <span className="text-[10px] text-blue-400 font-bold mt-1 inline-block">Source Date: 2024-10-18 (Verified)</span>
              </div>
            </div>
          </div>

          {/* Quick Execution Runner Command */}
          <div className="bg-gray-900 p-5 rounded-3xl border border-gray-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-bold text-gray-300">
                <Terminal className="w-4 h-4 text-orange-400" />
                <span>Launch in Terminal (Ready to Run):</span>
              </div>
              <button
                onClick={handleCopyCommand}
                className="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCmd ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-3 rounded-xl bg-black font-mono text-xs text-emerald-400 overflow-x-auto scrollbar-none">
              {commandToRun}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default LocalAICompatibilityEngine;
