/**
 * Toolva — Unified Tools Service
 *
 * Merges data from sources:
 * 1. Backend API live tools (from /api/tools)
 * 2. Local static recommendedTools (from recommendationData.ts)
 * 3. GitHub awesome-ai-tools repo (cached in localStorage)
 *
 * Rigorous normalization & deduplication eliminates redundant tool entries.
 */

import { AITool } from '../types';
import { recommendedTools, RecommendedTool } from './recommendationData';
import { aiTools } from './aiTools';

const GITHUB_CACHE_KEY = 'toolva_github_tools_cache_v2';
const GITHUB_CACHE_EXPIRY_KEY = 'toolva_github_tools_expiry_v2';
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

/**
 * Normalize tool names for aggressive end-to-end deduplication.
 * Strips URLs, version tags (v6, v5, 3.5, 4.0), spaces, noise words, and special characters.
 */
export function normalizeToolName(name: string): string {
  if (!name) return '';
  let clean = name
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '');

  // Strip noise words & version tags
  clean = clean
    .replace(/\b(voice|ai|official|api|generator|app|tool|sdk|cli|studio|labs?|inc|llc|v?\d+(\.\d+)*)\b/gi, '')
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '');

  // Fallback to basic alphanumeric if stripping made it empty (e.g. for a tool named "AI")
  if (!clean) {
    clean = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  return clean;
}

/**
 * Deterministic rating generator based on string hash (eliminates Math.random).
 */
export function getDeterministicRating(key: string): number {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  const positiveHash = Math.abs(hash);
  const rating = 4.1 + (positiveHash % 8) * 0.1; // 4.1 - 4.8
  return Math.round(rating * 10) / 10;
}

// Adapter: RecommendedTool → AITool
export function recommendedToAITool(r: RecommendedTool): AITool {
  return {
    id: r.id,
    name: r.name,
    description: r.description,
    category: r.category,
    url: r.url,
    image: r.logoUrl,
    pricing: r.pricing,
    rating: r.rating,
    dailyUsers: r.usersCount,
    modelType: r.category,
    easeOfUse: r.metrics.easeOfUse,
    codeQuality: r.metrics.outputQuality,
    userExperience: r.metrics.easeOfUse,
    featured: r.isChampion ?? false,
    lastUpdated: new Date().toISOString().split('T')[0],
  };
}

// Deduplicate all local curated tool arrays into one master unique list
const rawRecommendedTools: AITool[] = (recommendedTools || []).map(recommendedToAITool);
const combinedRawTools: AITool[] = [...rawRecommendedTools, ...(aiTools || [])];

function getUrlHostKey(urlStr: string): string {
  if (!urlStr) return '';
  try {
    const host = new URL(urlStr.startsWith('http') ? urlStr : `https://${urlStr}`).hostname.toLowerCase().replace(/^www\./, '');
    return host.split('.')[0]; // e.g. elevenlabs from elevenlabs.io
  } catch {
    return '';
  }
}

const localMap = new Map<string, AITool>();
const seenHosts = new Set<string>();

for (const tool of combinedRawTools) {
  if (!tool || !tool.name) continue;
  const nameKey = normalizeToolName(tool.name);
  const hostKey = getUrlHostKey(tool.url || tool.website || '');

  if (nameKey && !localMap.has(nameKey) && (!hostKey || !seenHosts.has(hostKey))) {
    localMap.set(nameKey, tool);
    if (hostKey) seenHosts.add(hostKey);
  }
}
export const localAITools: AITool[] = Array.from(localMap.values()).sort((a, b) =>
  a.name.localeCompare(b.name, undefined, { sensitivity: 'base', numeric: true })
);

export function mergeTools(): AITool[] {
  return localAITools;
}

// GitHub awesome-ai-tools fetcher
const RAW_README_URL =
  'https://raw.githubusercontent.com/mahseema/awesome-ai-tools/main/README.md';

function parseMarkdownTools(markdown: string): AITool[] {
  const tools: AITool[] = [];
  const lines = markdown.split('\n');

  let currentCategory = 'General';
  let idCounter = 0;

  const categoryRegex = /^#{2,3}\s+(.+)/;
  const toolRegex = /^[-*]\s+\[([^\]]+)\]\(([^)]+)\)\s*[-–—]?\s*(.*)/;

  for (const rawLine of lines) {
    const line = rawLine.trim();

    const catMatch = line.match(categoryRegex);
    if (catMatch) {
      currentCategory = catMatch[1].trim();
      continue;
    }

    const toolMatch = line.match(toolRegex);
    if (toolMatch) {
      const name = toolMatch[1].trim();
      const url = toolMatch[2].trim();
      const description = toolMatch[3].trim() || `${name} — AI tool`;

      if (!name || !url.startsWith('http')) continue;

      const cat = mapCategory(currentCategory);

      tools.push({
        id: `github-awesome-${++idCounter}`,
        name,
        description,
        category: cat,
        url,
        image: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1e293b&color=6366f1&size=120`,
        pricing: 'Freemium',
        rating: getDeterministicRating(name),
        dailyUsers: 'Verified',
        modelType: cat,
        easeOfUse: 4.5,
        userExperience: 4.5,
        featured: false,
        lastUpdated: new Date().toISOString().split('T')[0],
      });
    }
  }

  return tools;
}

function mapCategory(raw: string): string {
  const r = raw.toLowerCase();
  if (r.includes('image') || r.includes('art') || r.includes('photo')) return 'Image Generation';
  if (r.includes('video')) return 'Video';
  if (r.includes('audio') || r.includes('speech') || r.includes('voice')) return 'Audio';
  if (r.includes('music')) return 'Music';
  if (r.includes('code') || r.includes('dev') || r.includes('programming')) return 'Code';
  if (r.includes('writ') || r.includes('text') || r.includes('copy')) return 'Writing';
  if (r.includes('chat') || r.includes('assistant') || r.includes('llm') || r.includes('model')) return 'Chatbots';
  if (r.includes('design') || r.includes('ui') || r.includes('ux')) return 'Design';
  if (r.includes('data') || r.includes('analytic')) return 'Analytics';
  if (r.includes('research')) return 'Research';
  if (r.includes('business') || r.includes('market') || r.includes('sales')) return 'Business';
  if (r.includes('education') || r.includes('learn')) return 'Education';
  if (r.includes('secur')) return 'Security';
  if (r.includes('devops') || r.includes('infra')) return 'DevOps';
  if (r.includes('machine learning') || r.includes(' ml ') || r.includes('training')) return 'Machine Learning';
  return 'Productivity';
}

export async function fetchGithubTools(): Promise<AITool[]> {
  try {
    const cached = localStorage.getItem(GITHUB_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached) as AITool[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(RAW_README_URL, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const markdown = await res.text();
    const tools = parseMarkdownTools(markdown);

    try {
      localStorage.setItem(GITHUB_CACHE_KEY, JSON.stringify(tools));
      localStorage.setItem(GITHUB_CACHE_EXPIRY_KEY, String(Date.now() + CACHE_TTL_MS));
    } catch {
      // ignore
    }

    return tools;
  } catch (err) {
    try {
      const stale = localStorage.getItem(GITHUB_CACHE_KEY);
      if (stale) return JSON.parse(stale) as AITool[];
    } catch { /* empty */ }
    return [];
  }
}

/**
 * Get full deduplicated master tool catalog:
 * Backend API tools + local curated tools + GitHub tools
 * Sorted Alphabetically A to Z (like a dictionary)
 */
export async function getAllTools(backendTools: AITool[] = []): Promise<AITool[]> {
  const githubTools = await fetchGithubTools();
  const toolMap = new Map<string, AITool>();
  const hostMap = new Set<string>();

  // 1. Local curated tools (highest local priority)
  for (const tool of localAITools) {
    const nameKey = normalizeToolName(tool.name);
    const hostKey = getUrlHostKey(tool.url || tool.website || '');
    if (nameKey && !toolMap.has(nameKey) && (!hostKey || !hostMap.has(hostKey))) {
      toolMap.set(nameKey, tool);
      if (hostKey) hostMap.add(hostKey);
    }
  }

  // 2. Backend API tools
  for (const tool of backendTools) {
    const nameKey = normalizeToolName(tool.name);
    const hostKey = getUrlHostKey(tool.url || tool.website || '');
    if (nameKey && (!hostKey || !hostMap.has(hostKey))) {
      toolMap.set(nameKey, tool);
      if (hostKey) hostMap.add(hostKey);
    }
  }

  // 3. Unique GitHub tools
  for (const tool of githubTools) {
    const nameKey = normalizeToolName(tool.name);
    const hostKey = getUrlHostKey(tool.url || tool.website || '');
    if (nameKey && !toolMap.has(nameKey) && (!hostKey || !hostMap.has(hostKey))) {
      toolMap.set(nameKey, tool);
      if (hostKey) hostMap.add(hostKey);
    }
  }

  return Array.from(toolMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: 'base', numeric: true })
  );
}
