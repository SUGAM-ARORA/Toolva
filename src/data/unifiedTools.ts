/**
 * Toolva — Unified Tools Service
 *
 * Merges data from four sources:
 * 1. Local static aiTools (from aiTools.ts)
 * 2. Local static recommendedTools (from recommendationData.ts)
 * 3. Bundled GitHub awesomeToolsData (435+ tools from awesome-ai-tools repo)
 * 4. Supabase live tools & runtime GitHub fetcher
 *
 * All sources are converted to the common AITool interface.
 */

import { AITool } from '../types';
import { aiTools } from './aiTools';
import { awesomeToolsData } from './awesomeToolsData';
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
 * Merges Supabase tools with local static tools, recommended tools, and bundled awesome tools.
 */
export function mergeTools(supabaseTools: AITool[]): AITool[] {
  const supabaseNames = new Set(supabaseTools.map(t => t.name.toLowerCase().trim()));
  const uniqueLocal = aiTools.filter(t => !supabaseNames.has(t.name.toLowerCase().trim()));
  const combinedLocalNames = new Set([...supabaseNames, ...uniqueLocal.map(t => t.name.toLowerCase().trim())]);
  const uniqueRecommended = localAITools.filter(t => !combinedLocalNames.has(t.name.toLowerCase().trim()));
  const combinedNames2 = new Set([...combinedLocalNames, ...uniqueRecommended.map(t => t.name.toLowerCase().trim())]);
  const uniqueAwesome = awesomeToolsData.filter(t => !combinedNames2.has(t.name.toLowerCase().trim()));
  return [...supabaseTools, ...uniqueLocal, ...uniqueRecommended, ...uniqueAwesome];
}

// ─── GitHub awesome-ai-tools fetcher ─────────────────────────
const RAW_README_URL =
  'https://raw.githubusercontent.com/mahseema/awesome-ai-tools/main/README.md';

/**
 * Parse the awesome-ai-tools README.md markdown and extract tool entries.
 */
function parseMarkdownTools(markdown: string): AITool[] {
  const tools: AITool[] = [];
  const lines = markdown.split('\n');

  let currentCategory = 'General';
  let idCounter = 0;

  // Category headers: ## Category Name or ### Category Name
  const categoryRegex = /^#{2,3}\s+(.+)/;

  for (const rawLine of lines) {
    const line = rawLine.trim();

    const catMatch = line.match(categoryRegex);
    if (catMatch) {
      currentCategory = catMatch[1].trim();
      continue;
    }

    if (!line.startsWith('-') && !line.startsWith('*')) continue;

    const linkMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      let name = linkMatch[1].replace(/\*\*/g, '').trim();
      let url = linkMatch[2].trim();

      // Handle nested broken URL format: [Amazon Q Developer]([https://...](https://...))
      if (url.startsWith('[http')) {
        const nestedMatch = url.match(/\]\((http[^)]+)\)/);
        if (nestedMatch) url = nestedMatch[1];
      }

      if (!name || !url.startsWith('http')) continue;

      let description = line.substring(linkMatch.index! + linkMatch[0].length)
        .replace(/^[\s*–—-]+/, '')
        .trim();
      
      // Remove review links and tags
      description = description.replace(/\*\[reviews?\]\([^)]+\)\*/gi, '').trim();
      description = description.replace(/#opensource/gi, '').trim();
      description = description.replace(/^\*\*/, '').replace(/\*\*$/, '').trim();
      // Also cleanup dashes left behind
      description = description.replace(/^[-–—]\s*/, '').trim();

      if (!description) description = `${name} — AI tool`;

      // Map category string to our known categories
      const cat = mapCategory(currentCategory);

      tools.push({
        id: `github-awesome-live-${++idCounter}`,
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
export async function fetchGithubTools(forceRefresh = false): Promise<AITool[]> {
  // Check cache unless forced
  if (!forceRefresh) {
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
  }

  try {
    const res = await fetch(RAW_README_URL, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const markdown = await res.text();
    const tools = parseMarkdownTools(markdown);

    // Persist to cache
    try {
      localStorage.setItem(GITHUB_CACHE_KEY, JSON.stringify(tools));
      localStorage.setItem(
        GITHUB_CACHE_EXPIRY_KEY,
        String(Date.now() + CACHE_TTL_MS)
      );
    } catch {
      // localStorage quota might be exceeded, ignore
    }

    console.log(`[Toolva] Fetched ${tools.length} live tools from GitHub awesome-ai-tools`);

    return tools;
  } catch (err) {
    console.warn('[Toolva] GitHub runtime fetch failed, using fallback/cache:', err);
    try {
      const stale = localStorage.getItem(GITHUB_CACHE_KEY);
      if (stale) return JSON.parse(stale) as AITool[];
    } catch { /* empty */ }
    return [];
  }
}

/**
 * Get the full merged tool list:
 * supabaseTools + local aiTools + recommendedTools + bundled awesomeTools + live GitHub awesome tools
 */
export async function getAllTools(supabaseTools: AITool[], forceRefresh = false): Promise<AITool[]> {
  const baseMerged = mergeTools(supabaseTools);
  const githubTools = await fetchGithubTools(forceRefresh);

  // If live fetch returned items, merge any unique ones on top of baseMerged
  const baseNames = new Set(baseMerged.map(t => t.name.toLowerCase().trim()));
  const uniqueLiveGithub = githubTools.filter(t => !baseNames.has(t.name.toLowerCase().trim()));

  return [...baseMerged, ...uniqueLiveGithub];
}
