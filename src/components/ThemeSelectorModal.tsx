import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Palette, Sun, Moon, Sparkles, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

export interface ThemePreset {
  id: string;
  name: string;
  tagline: string;
  accent: string;
  secondary: string;
  gradient: string;
  darkBg: string;
  darkCard: string;
  lightBg: string;
  lightCard: string;
  tag: string;
  description: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'amber',
    name: 'Cyber Amber',
    tagline: 'ToolVa Signature Glow',
    accent: '#f97316',
    secondary: '#ef4444',
    gradient: 'from-orange-500 to-red-500',
    darkBg: '#0B0F19',
    darkCard: '#141721',
    lightBg: '#f8fafc',
    lightCard: '#ffffff',
    tag: 'Signature Default',
    description: 'Vibrant neon amber & sunset red over deep obsidian void. High-energy discovery look.',
  },
  {
    id: 'indigo',
    name: 'Electric Indigo',
    tagline: 'Linear & Raycast SaaS Style',
    accent: '#6366f1',
    secondary: '#8b5cf6',
    gradient: 'from-indigo-500 to-purple-600',
    darkBg: '#090d16',
    darkCard: '#111625',
    lightBg: '#f8f9ff',
    lightCard: '#ffffff',
    tag: 'Developer Platform',
    description: 'Deep midnight navy paired with radiant electric violet. The hallmark of Silicon Valley developer tools.',
  },
  {
    id: 'emerald',
    name: 'Emerald Matrix',
    tagline: 'Supabase & Terminal Aesthetic',
    accent: '#10b981',
    secondary: '#34d399',
    gradient: 'from-emerald-500 to-teal-400',
    darkBg: '#0a0f0d',
    darkCard: '#121a16',
    lightBg: '#f4fbf7',
    lightCard: '#ffffff',
    tag: 'Open-Source Hacker',
    description: 'Basalt carbon backdrop infused with glowing hyper-mint and terminal emerald. Crisp and analytical.',
  },
  {
    id: 'crimson',
    name: 'Crimson Velocity',
    tagline: 'Bold Performance & Speed',
    accent: '#f43f5e',
    secondary: '#fb7185',
    gradient: 'from-rose-500 to-red-600',
    darkBg: '#0e0b0e',
    darkCard: '#19141a',
    lightBg: '#fff5f7',
    lightCard: '#ffffff',
    tag: 'Momentum & Power',
    description: 'Charcoal graphite with striking ruby rose accents. Imparts decisive velocity and high impact.',
  },
  {
    id: 'cyan',
    name: 'Arctic Cyan',
    tagline: 'Quantum & Deep Oceanic AI',
    accent: '#06b6d4',
    secondary: '#38bdf8',
    gradient: 'from-cyan-500 to-blue-500',
    darkBg: '#080f18',
    darkCard: '#0e1a2b',
    lightBg: '#f0f9ff',
    lightCard: '#ffffff',
    tag: 'Deep Intelligence',
    description: 'Oceanic abyss illuminated by luminous electric cyan. High clarity, cold-room server room feel.',
  },
  {
    id: 'monolith',
    name: 'Monolith Slate',
    tagline: 'Minimalist Carbon & Monochrome',
    accent: '#64748b',
    secondary: '#94a3b8',
    gradient: 'from-slate-600 to-gray-900',
    darkBg: '#050505',
    darkCard: '#0d0d10',
    lightBg: '#ffffff',
    lightCard: '#f9fafb',
    tag: 'Minimalist Studio',
    description: 'True pitch black with titanium chrome accents. Uncompromising clarity and distraction-free elegance.',
  },
  {
    id: 'solar',
    name: 'Solar Flare',
    tagline: 'Warm Gold & Radiant Dawn',
    accent: '#f59e0b',
    secondary: '#d97706',
    gradient: 'from-amber-500 to-yellow-600',
    darkBg: '#0f0e08',
    darkCard: '#1c180e',
    lightBg: '#fefce8',
    lightCard: '#ffffff',
    tag: 'Radiant Gold',
    description: 'Rich amber sunlight with molten bronze highlights. Warm, inviting, and radiant in both day & night.',
  },
  {
    id: 'synthwave',
    name: 'Neon Synthwave',
    tagline: 'Cyberpunk & Retrowave Magenta',
    accent: '#d946ef',
    secondary: '#ec4899',
    gradient: 'from-fuchsia-500 to-pink-500',
    darkBg: '#130919',
    darkCard: '#20102b',
    lightBg: '#fdf4ff',
    lightCard: '#ffffff',
    tag: 'Retro Cyberpunk',
    description: 'Electric magenta neon over obsidian shadows. High-contrast futuristic cyberpunk aesthetic.',
  },
  {
    id: 'aurora',
    name: 'Nordic Aurora',
    tagline: 'Borealis Teal & Frost Mint',
    accent: '#14b8a6',
    secondary: '#2dd4bf',
    gradient: 'from-teal-500 to-emerald-400',
    darkBg: '#071214',
    darkCard: '#0e1f22',
    lightBg: '#f0fdfa',
    lightCard: '#ffffff',
    tag: 'Northern Lights',
    description: 'Luminescent glacial teal against polar midnight. Clean, crystalline, and calming for long sessions.',
  },
  {
    id: 'amethyst',
    name: 'Royal Amethyst',
    tagline: 'Deep Nebula & Imperial Violet',
    accent: '#a855f7',
    secondary: '#7c3aed',
    gradient: 'from-purple-500 to-indigo-600',
    darkBg: '#0f091a',
    darkCard: '#1a112c',
    lightBg: '#faf5ff',
    lightCard: '#ffffff',
    tag: 'Imperial Violet',
    description: 'Majestic royal purple and cosmic ultraviolet. Premium luxury developer experience.',
  },
  {
    id: 'ochre',
    name: 'Burnt Ochre',
    tagline: 'Warm Terracotta & Clay Earth',
    accent: '#ea580c',
    secondary: '#c2410c',
    gradient: 'from-orange-600 to-amber-700',
    darkBg: '#120a06',
    darkCard: '#22130c',
    lightBg: '#fff7ed',
    lightCard: '#ffffff',
    tag: 'Organic Earth',
    description: 'Earthy terracotta rust and burnt sienna. Grounded, humanistic, and easy on the eyes.',
  },
  {
    id: 'cobalt',
    name: 'Cobalt Deep Space',
    tagline: 'Royal Azure & Deep Satellite',
    accent: '#2563eb',
    secondary: '#3b82f6',
    gradient: 'from-blue-600 to-cyan-500',
    darkBg: '#080d1a',
    darkCard: '#101a33',
    lightBg: '#eff6ff',
    lightCard: '#ffffff',
    tag: 'Deep Space',
    description: 'Vivid royal cobalt paired with oceanic cerulean. Authoritative and crystalline aerospace grade.',
  },
];

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPreset: string;
  onSelectPreset: (presetId: string) => void;
  isDark: boolean;
  onToggleDark: () => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  onClose,
  currentPreset,
  onSelectPreset,
  isDark,
  onToggleDark,
}) => {
  if (!isOpen) return null;

  const handleApplyPreset = (id: string) => {
    onSelectPreset(id);
    document.documentElement.setAttribute('data-theme-preset', id);
    localStorage.setItem('toolva_theme_preset', id);
    toast.success(`Theme updated to ${THEME_PRESETS.find(p => p.id === id)?.name}!`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-5xl bg-white dark:bg-[#11141e] border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/70 dark:bg-[#141824]/70 shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <span>Theme & Color Presets</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20 font-bold">
                    12 Curated Palettes (24 Light & Dark Modes)
                  </span>
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Select a color identity. Every theme includes dedicated handcrafted Dark Mode and Light Mode schemes.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Dark/Light Quick Toggle */}
              <button
                onClick={onToggleDark}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-bold transition-all border border-gray-300 dark:border-gray-700"
                title="Toggle Dark / Light Mode"
              >
                {isDark ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-indigo-400" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>

              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Theme Grid */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 scrollbar-thin">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {THEME_PRESETS.map((preset) => {
                const isSelected = currentPreset === preset.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => handleApplyPreset(preset.id)}
                    className={`group cursor-pointer rounded-2xl p-4.5 border transition-all duration-200 relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-orange-500 bg-orange-500/5 dark:bg-orange-500/10 shadow-lg shadow-orange-500/10 ring-2 ring-orange-500/30'
                        : 'border-gray-200 dark:border-gray-800/80 bg-gray-50/50 dark:bg-[#141824]/50 hover:border-gray-400 dark:hover:border-gray-700 hover:shadow-md'
                    }`}
                  >
                    {/* Top Meta */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-gray-200/70 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                          {preset.tag}
                        </span>
                        {isSelected && (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-orange-500">
                            <Check className="w-3.5 h-3.5" />
                            Active
                          </span>
                        )}
                      </div>

                      <div>
                        <h4 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-2">
                          <span
                            className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                            style={{ backgroundColor: preset.accent }}
                          />
                          <span>{preset.name}</span>
                        </h4>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-0.5">
                          {preset.tagline}
                        </p>
                      </div>

                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                        {preset.description}
                      </p>

                      {/* Visual Swatch Preview Box */}
                      <div className="pt-2">
                        <div className="rounded-xl p-3 border border-gray-200/80 dark:border-gray-700/60 shadow-inner space-y-2 bg-white dark:bg-[#0c0f17]">
                          <div className="text-[10px] font-mono text-gray-400 flex justify-between items-center">
                            <span>Palette Preview</span>
                            <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-7 h-7 rounded-lg shadow-sm flex items-center justify-center text-[10px] font-bold text-white"
                              style={{ backgroundColor: preset.accent }}
                              title="Primary Accent"
                            >
                              P
                            </div>
                            <div
                              className="w-7 h-7 rounded-lg shadow-sm flex items-center justify-center text-[10px] font-bold text-white"
                              style={{ backgroundColor: preset.secondary }}
                              title="Secondary Accent"
                            >
                              S
                            </div>
                            <div
                              className="w-7 h-7 rounded-lg border border-gray-400/40 shadow-sm flex items-center justify-center text-[10px] font-bold"
                              style={{
                                backgroundColor: isDark ? preset.darkBg : preset.lightBg,
                                color: isDark ? '#fff' : '#000',
                              }}
                              title="Canvas Background"
                            >
                              BG
                            </div>
                            <div
                              className="w-7 h-7 rounded-lg border border-gray-400/40 shadow-sm flex items-center justify-center text-[10px] font-bold"
                              style={{
                                backgroundColor: isDark ? preset.darkCard : preset.lightCard,
                                color: isDark ? '#fff' : '#000',
                              }}
                              title="Component Card"
                            >
                              CD
                            </div>
                          </div>

                          {/* Mini Mock UI Preview */}
                          <div className="pt-1 flex items-center gap-1.5">
                            <div
                              className="flex-1 py-1 px-2 rounded-md text-[10px] font-bold text-white text-center shadow-xs"
                              style={{ backgroundColor: preset.accent }}
                            >
                              Button
                            </div>
                            <div
                              className="px-2 py-1 rounded-md text-[10px] font-semibold text-center border"
                              style={{
                                borderColor: preset.accent,
                                color: preset.accent,
                                backgroundColor: `${preset.accent}15`,
                              }}
                            >
                              Badge
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Button */}
                    <div className="pt-4 mt-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApplyPreset(preset.id);
                        }}
                        className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                            : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Selected Preset</span>
                          </>
                        ) : (
                          <span>Apply {preset.name}</span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ThemeSelectorModal;
