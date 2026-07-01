import React from 'react';
import { motion } from 'framer-motion';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import { ExternalLink, Star, Users, CheckCircle, XCircle, Zap, Trophy } from 'lucide-react';
import { RecommendedTool } from '../data/recommendationData';

interface RecommendationCardProps {
  tool: RecommendedTool & { matchScore?: number };
  rank?: number;
  showScore?: boolean;
  delay?: number;
}

const getScoreColor = (score: number) => {
  if (score >= 90) return { text: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/40', glow: 'shadow-emerald-500/20' };
  if (score >= 75) return { text: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/40', glow: 'shadow-blue-500/20' };
  if (score >= 60) return { text: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/40', glow: 'shadow-yellow-500/20' };
  return { text: 'text-gray-400', bg: 'bg-gray-500/20', border: 'border-gray-500/40', glow: 'shadow-gray-500/20' };
};

const RADAR_COLORS: Record<string, string> = {
  Design: '#a855f7',
  Code: '#3b82f6',
  Writing: '#f97316',
  Chatbots: '#10b981',
  Video: '#ef4444',
  Music: '#eab308',
  Audio: '#6366f1',
  Research: '#06b6d4',
  Analytics: '#14b8a6',
  DevOps: '#94a3b8',
  'Machine Learning': '#f59e0b',
  Education: '#84cc16',
  Security: '#f43f5e',
  Business: '#8b5cf6',
  Productivity: '#64748b',
  'Image Generation': '#ec4899',
};

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  tool,
  rank,
  showScore = true,
  delay = 0,
}) => {
  const scoreColors = getScoreColor(tool.matchScore ?? tool.recommendationScore);
  const radarColor = RADAR_COLORS[tool.category] || '#6366f1';

  const radarData = [
    { subject: 'Ease', value: tool.metrics.easeOfUse },
    { subject: 'Quality', value: tool.metrics.outputQuality },
    { subject: 'Speed', value: tool.metrics.speed },
    { subject: 'Features', value: tool.metrics.features },
    { subject: 'Value', value: tool.metrics.value },
    { subject: 'Support', value: tool.metrics.support },
  ];

  const displayScore = tool.matchScore ?? tool.recommendationScore;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -4, scale: 1.01 }}
      className={`relative rounded-2xl overflow-hidden border ${scoreColors.border} bg-gray-900/80 backdrop-blur-md shadow-xl ${scoreColors.glow} hover:shadow-2xl transition-all duration-300 flex flex-col`}
    >
      {/* Rank Badge */}
      {rank && rank <= 3 && (
        <div className="absolute top-3 left-3 z-10">
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold
            ${rank === 1 ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40' :
              rank === 2 ? 'bg-gray-400/20 text-gray-300 border border-gray-400/40' :
              'bg-amber-700/20 text-amber-400 border border-amber-700/40'}`}
          >
            <Trophy className="w-3 h-3" />
            #{rank}
          </div>
        </div>
      )}

      {/* Champion Badge */}
      {tool.badge && (
        <div className="absolute top-3 right-3 z-10">
          <span className="px-2 py-1 rounded-full text-xs font-bold bg-white/10 backdrop-blur-sm text-white border border-white/20">
            {tool.badge}
          </span>
        </div>
      )}

      {/* Match Score Arc */}
      {showScore && (
        <div className={`absolute top-0 left-0 right-0 h-1 ${
          displayScore >= 90 ? 'bg-gradient-to-r from-emerald-500 to-green-400' :
          displayScore >= 75 ? 'bg-gradient-to-r from-blue-500 to-cyan-400' :
          'bg-gradient-to-r from-yellow-500 to-orange-400'
        }`} />
      )}

      <div className="p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0 border border-white/10">
            <img
              src={tool.logoUrl}
              alt={tool.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tool.name)}&background=1e293b&color=6366f1&size=48`;
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-base leading-tight truncate">{tool.name}</h3>
            <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">{tool.tagline}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded-full text-xs bg-white/10 text-gray-300 border border-white/10">
                {tool.category}
              </span>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <span className="text-yellow-400 text-xs font-semibold">{tool.rating}</span>
              </div>
            </div>
          </div>

          {/* Match Score */}
          {showScore && (
            <div className={`flex-shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-xl border ${scoreColors.border} ${scoreColors.bg}`}>
              <span className={`text-lg font-black ${scoreColors.text}`}>{displayScore}</span>
              <span className="text-gray-500 text-[9px] font-medium">MATCH</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-400 text-xs leading-relaxed mb-4 line-clamp-2">
          {tool.description}
        </p>

        {/* Radar Chart */}
        <div className="h-32 -mx-2 mb-3">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} margin={{ top: 4, right: 8, bottom: 4, left: 8 }}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 500 }}
              />
              <Radar
                name={tool.name}
                dataKey="value"
                stroke={radarColor}
                fill={radarColor}
                fillOpacity={0.2}
                strokeWidth={1.5}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Strengths */}
        <div className="mb-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Strengths</p>
          <div className="space-y-1">
            {tool.strengths.slice(0, 2).map((s, i) => (
              <div key={i} className="flex items-start gap-1.5">
                <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300 text-xs">{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weakness */}
        {tool.weaknesses.length > 0 && (
          <div className="mb-4">
            <div className="flex items-start gap-1.5">
              <XCircle className="w-3 h-3 text-red-400 flex-shrink-0 mt-0.5" />
              <span className="text-gray-500 text-xs">{tool.weaknesses[0]}</span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-400">{tool.pricing}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-400">{tool.usersCount}</span>
            </div>
          </div>
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold transition-all duration-200 shadow-md hover:shadow-indigo-500/25"
          >
            Try Free
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default RecommendationCard;
