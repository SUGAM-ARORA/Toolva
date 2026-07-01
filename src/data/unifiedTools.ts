/**
 * Toolva — Unified Tools Service
 *
 * Merges data from three sources:
 * 1. Local static recommendedTools (from recommendationData.ts)
 * 2. Supabase live tools (passed in from App.tsx)
 * 3. GitHub awesome-ai-tools repo (auto-fetched & cached in localStorage)
 *
 * All sources are converted to the common AITool interface.
 */

import { AITool } from '../types';
import { recommendedTools, RecommendedTool } from './recommendationData';

const GITHUB_CACHE_KEY = 'toolva_github_tools_cache';
const GITHUB_CACHE_EXPIRY_KEY = 'toolva_github_tools_expiry';
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

// ─── Adapter: RecommendedTool → AITool ──────────────────────
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

// Convert all local recommended tools to AITool format
export const localAITools: AITool[] = recommendedTools.map(recommendedToAITool);

// ─── Merge utility ───────────────────────────────────────────
/**
 * Merges Supabase tools with local tools.
 * Local tools that have the same name (case-insensitive) as a Supabase tool are skipped.
 */
export function mergeTools(supabaseTools: AITool[]): AITool[] {
  const supabaseNames = new Set(supabaseTools.map(t => t.name.toLowerCase().trim()));
  const uniqueLocal = localAITools.filter(t => !supabaseNames.has(t.name.toLowerCase().trim()));
  return [...supabaseTools, ...uniqueLocal];
}

// ─── GitHub awesome-ai-tools fetcher ─────────────────────────
const RAW_README_URL =
  'https://raw.githubusercontent.com/mahseema/awesome-ai-tools/main/README.md';

/**
 * Parse the awesome-ai-tools README.md markdown and extract tool entries.
 * Each list item looks like:
 *   - [Tool Name](url) - Description
 */
function parseMarkdownTools(markdown: string): AITool[] {
  const tools: AITool[] = [];
  const lines = markdown.split('\n');

  let currentCategory = 'General';
  let idCounter = 0;

  // Category headers: ## Category Name or ### Category Name
  const categoryRegex = /^#{2,3}\s+(.+)/;
  // Tool entries: - [Name](url) - Description  OR  * [Name](url) - Description
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

      // Map category string to our known categories
      const cat = mapCategory(currentCategory);

      tools.push({
        id: `github-awesome-${++idCounter}`,
        name,
        description,
        category: cat,
        url,
        image: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1e293b&color=6366f1&size=120`,
        pricing: 'See website',
        rating: 4.0 + Math.random() * 0.8, // 4.0 – 4.8 placeholder
        dailyUsers: 'N/A',
        modelType: cat,
        easeOfUse: 4,
        userExperience: 4,
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
  if (r.includes('product') || r.includes('workflow') || r.includes('automat')) return 'Productivity';
  return 'Productivity'; // fallback
}

// ─── Public API ───────────────────────────────────────────────
export async function fetchGithubTools(): Promise<AITool[]> {
  // Check cache
  try {
    const expiry = localStorage.getItem(GITHUB_CACHE_EXPIRY_KEY);
    if (expiry && Date.now() < parseInt(expiry)) {
      const cached = localStorage.getItem(GITHUB_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as AITool[];
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    }
  } catch {
    // ignore parse errors
  }

  try {
    const res = await fetch(RAW_README_URL, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const markdown = await res.text();
    const tools = parseMarkdownTools(markdown);

    // Persist to cache
    localStorage.setItem(GITHUB_CACHE_KEY, JSON.stringify(tools));
    localStorage.setItem(
      GITHUB_CACHE_EXPIRY_KEY,
      String(Date.now() + CACHE_TTL_MS)
    );

    return tools;
  } catch (err) {
    console.warn('[Toolva] GitHub fetch failed, using cache or empty:', err);
    // Try stale cache on error
    try {
      const stale = localStorage.getItem(GITHUB_CACHE_KEY);
      if (stale) return JSON.parse(stale) as AITool[];
    } catch { /* empty */ }
    return [];
  }
}

/**
 * Get the full merged tool list:
 * supabaseTools + local recommendedTools + GitHub awesome tools
 */
export async function getAllTools(supabaseTools: AITool[]): Promise<AITool[]> {
  const githubTools = await fetchGithubTools();

  // Merge all, deduplicating by name
  const merged = mergeTools(supabaseTools);
  const mergedNames = new Set(merged.map(t => t.name.toLowerCase().trim()));
  const uniqueGithub = githubTools.filter(t => !mergedNames.has(t.name.toLowerCase().trim()));

  return [...merged, ...uniqueGithub];
}
