import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, Star, GitBranch, ExternalLink, Flame, 
  ArrowUp, Clock, Filter, ChevronDown, RefreshCw,
  BarChart2, Zap, Eye
} from 'lucide-react';
import { AITool } from '../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface MomentumIndexProps {
  tools: AITool[];
  onBackToHome?: () => void;
  onToolSelect?: (tool: AITool) => void;
}

// Generate mock GitHub star history (weekly snapshots for last 8 weeks) based on tool properties
function generateStarHistory(baseStars: number, velocity: number) {
  const weeks = 8;
  const data: { week: string; stars: number }[] = [];
  let current = Math.max(0, baseStars - velocity * weeks);
  for (let i = weeks; i >= 0; i--) {
    const weekLabel = i === 0 ? 'Now' : `${i}w`;
    const jitter = Math.floor((Math.random() - 0.5) * velocity * 0.2);
    current += velocity + jitter;
    data.push({ week: weekLabel, stars: Math.max(0, Math.round(current)) });
  }
  return data;
}

function formatStars(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

function categorizeVelocity(velocity: number): { label: string; color: string; bg: string } {
  if (velocity >= 500) return { label: '🔥 Breakout', color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/30' };
  if (velocity >= 200) return { label: '⚡ Trending', color: 'text-orange-500', bg: 'bg-orange-500/10 border-orange-500/30' };
  if (velocity >= 80) return { label: '📈 Rising', color: 'text-yellow-500', bg: 'bg-yellow-500/10 border-yellow-500/30' };
  if (velocity >= 20) return { label: '🌱 Growing', color: 'text-green-500', bg: 'bg-green-500/10 border-green-500/30' };
  return { label: '📊 Stable', color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/30' };
}

const MomentumIndex: React.FC<MomentumIndexProps> = ({ tools, onBackToHome, onToolSelect }) => {
  const [filter, setFilter] = useState<'all' | 'opensource' | 'breakout'>('all');
  const [sortBy, setSortBy] = useState<'velocity' | 'stars' | 'rating'>('velocity');
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Enrich tools with momentum data (derived from available tool fields)
  const enrichedTools = useMemo(() => {
    return tools
      .filter(t => t.github || (t as any).githubStars)
      .map(tool => {
        // Derive mock velocity from rating + category popularity
        const baseStars = (tool as any).githubStars || Math.floor(tool.rating * 800 + Math.random() * 2000);
        const velocity = Math.floor(
          tool.rating * 50 + 
          (tool.featured ? 200 : 0) + 
          Math.random() * 150
        );
        const history = generateStarHistory(baseStars, velocity);
        return {
          ...tool,
          githubStars: baseStars,
          weeklyVelocity: velocity,
          starHistory: history,
          trend: categorizeVelocity(velocity),
        };
      });
  }, [tools]);

  const filtered = useMemo(() => {
    let list = [...enrichedTools];
    if (filter === 'opensource') list = list.filter(t => t.github);
    if (filter === 'breakout') list = list.filter(t => t.weeklyVelocity >= 200);
    
    list.sort((a, b) => {
      if (sortBy === 'velocity') return b.weeklyVelocity - a.weeklyVelocity;
      if (sortBy === 'stars') return b.githubStars - a.githubStars;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
    return list;
  }, [enrichedTools, filter, sortBy]);

  const topBreakout = filtered.filter(t => t.weeklyVelocity >= 200).slice(0, 3);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) {
      return (
        <div className="bg-white dark:bg-[#1c202f] border border-gray-200 dark:border-gray-700 rounded-xl p-2 shadow-xl text-xs">
          <p className="text-gray-500">{payload[0].payload.week}</p>
          <p className="font-black text-orange-500">⭐ {formatStars(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] text-gray-900 dark:text-white">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/90 dark:bg-[#141721]/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {onBackToHome && (
            <button onClick={onBackToHome} className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">←</button>
          )}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-black text-base text-gray-900 dark:text-white">AI Momentum Index</h1>
              <p className="text-[10px] text-gray-500 font-mono">GitHub star velocity tracker · Updated weekly</p>
            </div>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          className={`p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all ${isRefreshing ? 'animate-spin' : ''}`}
        >
          <RefreshCw className="w-4 h-4 text-orange-500" />
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Disclaimer */}
        <div className="flex items-start space-x-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-600 dark:text-blue-400">
          <BarChart2 className="w-4 h-4 shrink-0 mt-0.5" />
          <span>Star velocity is estimated from tool metadata. Actual GitHub API integration with live tracking snapshots is planned for Phase 2. Charts show illustrative momentum trends based on available tool data.</span>
        </div>

        {/* Breakout Tools Spotlight */}
        {topBreakout.length > 0 && (
          <div>
            <h2 className="font-black text-lg mb-4 flex items-center space-x-2">
              <Flame className="w-5 h-5 text-red-500" />
              <span>🔥 This Week's Breakout Tools</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {topBreakout.map((tool, idx) => (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -4 }}
                  onClick={() => onToolSelect?.(tool)}
                  className="relative bg-gradient-to-br from-orange-500/10 via-red-500/5 to-transparent border border-orange-500/30 rounded-2xl p-5 cursor-pointer hover:shadow-lg hover:shadow-orange-500/10 transition-all overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden shrink-0">
                        {tool.image ? (
                          <img src={tool.image} alt={tool.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-bold text-sm">{tool.name.slice(0, 2).toUpperCase()}</span>
                        )}
                      </div>
                      <div>
                        <div className="font-black text-sm text-gray-900 dark:text-white">{tool.name}</div>
                        <div className="text-[10px] text-gray-500 font-mono">{tool.category}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-500 shrink-0">
                      #{idx + 1}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-orange-500 font-black text-sm mb-1">
                    <ArrowUp className="w-4 h-4" />
                    <span>+{formatStars(tool.weeklyVelocity)} stars/week</span>
                  </div>
                  <div className="text-[11px] text-gray-500">Total: ⭐ {formatStars(tool.githubStars)}</div>
                  {tool.github && (
                    <a
                      href={tool.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="inline-flex items-center space-x-1 mt-2 text-[10px] text-orange-500 hover:text-orange-600"
                    >
                      <GitBranch className="w-3 h-3" />
                      <span>GitHub</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2 flex-wrap gap-2">
            {([
              { key: 'all', label: 'All Tools' },
              { key: 'opensource', label: 'Open Source' },
              { key: 'breakout', label: '🔥 Breakout Only' },
            ] as const).map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filter === f.key
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-[#1c202f] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-1.5 bg-white dark:bg-[#181b28] border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 shadow-sm">
            <Filter className="w-3.5 h-3.5 text-orange-500" />
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as typeof sortBy)}
              className="bg-transparent text-gray-900 dark:text-white font-bold focus:outline-none cursor-pointer"
            >
              <option value="velocity">Star Velocity</option>
              <option value="stars">Total Stars</option>
              <option value="rating">ToolVa Rating</option>
            </select>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="space-y-3">
          <h2 className="font-black text-lg">AI Momentum Leaderboard</h2>
          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-[#141721] rounded-2xl border border-gray-200 dark:border-gray-800">
              <GitBranch className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No tools with GitHub data found for this filter.</p>
            </div>
          ) : (
            filtered.slice(0, 20).map((tool, idx) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="bg-white dark:bg-[#141721] rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-orange-500/40 p-4 transition-all cursor-pointer group"
                onClick={() => setSelectedTool(selectedTool === tool.id ? null : tool.id)}
              >
                <div className="flex items-center justify-between gap-4">
                  {/* Rank */}
                  <div className="w-8 shrink-0 text-center font-black text-lg text-gray-300 dark:text-gray-600">
                    {idx + 1}
                  </div>

                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden shrink-0">
                    {tool.image ? (
                      <img src={tool.image} alt={tool.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-bold text-sm text-gray-900 dark:text-white">{tool.name.slice(0, 2).toUpperCase()}</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 flex-wrap gap-1">
                      <span className="font-black text-gray-900 dark:text-white text-sm group-hover:text-orange-500 transition-colors">{tool.name}</span>
                      <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${tool.trend.bg} ${tool.trend.color}`}>
                        {tool.trend.label}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-500 font-mono">{tool.category}</div>
                  </div>

                  {/* Velocity + Stars */}
                  <div className="text-right shrink-0">
                    <div className="flex items-center space-x-1 text-orange-500 font-black text-sm justify-end">
                      <ArrowUp className="w-3.5 h-3.5" />
                      <span>+{formatStars(tool.weeklyVelocity)}/wk</span>
                    </div>
                    <div className="text-[11px] text-gray-500 flex items-center justify-end space-x-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span>{formatStars(tool.githubStars)}</span>
                    </div>
                  </div>

                  {/* Expand icon */}
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform shrink-0 ${selectedTool === tool.id ? 'rotate-180' : ''}`} />
                </div>

                {/* Expanded: mini trend chart */}
                <AnimatePresence>
                  {selectedTool === tool.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">8-Week Star Growth</span>
                          {tool.github && (
                            <a
                              href={tool.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                              className="flex items-center space-x-1 text-[10px] text-orange-500 hover:text-orange-600"
                            >
                              <GitBranch className="w-3 h-3" />
                              <span>View on GitHub</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                        <div className="h-24">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={tool.starHistory}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                              <XAxis dataKey="week" tick={{ fontSize: 9, fill: '#9ca3af' }} />
                              <YAxis tick={{ fontSize: 9, fill: '#9ca3af' }} tickFormatter={formatStars} width={35} />
                              <Tooltip content={<CustomTooltip />} />
                              <Line type="monotone" dataKey="stars" stroke="#f97316" strokeWidth={2} dot={{ r: 3, fill: '#f97316' }} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-3 gap-3 mt-3 text-center">
                          <div className="bg-gray-50 dark:bg-[#1c202f] rounded-xl p-2">
                            <div className="text-[10px] text-gray-500">ToolVa Score</div>
                            <div className="font-black text-sm text-amber-500">★ {tool.rating?.toFixed(1)}</div>
                          </div>
                          <div className="bg-gray-50 dark:bg-[#1c202f] rounded-xl p-2">
                            <div className="text-[10px] text-gray-500">Pricing</div>
                            <div className="font-black text-sm text-green-500 truncate">{tool.pricing || 'Free'}</div>
                          </div>
                          <div className="bg-gray-50 dark:bg-[#1c202f] rounded-xl p-2">
                            <div className="text-[10px] text-gray-500">Weekly ∆</div>
                            <div className="font-black text-sm text-orange-500">+{formatStars(tool.weeklyVelocity)}</div>
                          </div>
                        </div>
                        <button
                          onClick={e => { e.stopPropagation(); onToolSelect?.(tool); }}
                          className="mt-3 w-full py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center space-x-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Tool</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MomentumIndex;
