/**
 * Toolva Security Utilities
 * 
 * Provides URL sanitization, XSS prevention, and input validation
 * for user-generated content in the open-source frontend.
 */

// ─── URL Sanitization ────────────────────────────────────────

const DANGEROUS_PROTOCOLS = ['javascript:', 'data:', 'vbscript:', 'file:'];

/**
 * Sanitize a URL to prevent javascript: and other dangerous protocol exploits.
 * Returns the URL if safe, or '#' if potentially malicious.
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') return '#';
  
  const trimmed = url.trim();
  const lower = trimmed.toLowerCase();

  // Block dangerous protocols explicitly
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('file:') ||
    lower.includes('javascript:')
  ) {
    console.warn(`[Security] Blocked dangerous URL protocol`);
    return '#';
  }

  // Allow blob: URLs for local file preview objects
  if (lower.startsWith('blob:')) {
    return trimmed;
  }

  // Allow safe relative paths
  if (trimmed.startsWith('//')) return `https:${trimmed}`;
  if (trimmed.startsWith('/')) return trimmed;

  try {
    const parsed = new URL(trimmed);
    const protocol = parsed.protocol.toLowerCase();
    
    if (protocol === 'http:' || protocol === 'https:') {
      return parsed.href;
    }
  } catch {
    return '#';
  }

  return '#';
}

/**
 * Validate that a URL is a proper HTTPS URL.
 */
export function isValidHttpsUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Validate that a URL is reachable (basic format check).
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// ─── Text Sanitization (XSS Prevention) ──────────────────────

const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
};

/**
 * Escape HTML special characters to prevent XSS injection.
 */
export function escapeHtml(text: string): string {
  if (!text || typeof text !== 'string') return '';
  return text.replace(/[&<>"'\/]/g, (char) => HTML_ESCAPE_MAP[char] || char);
}

/**
 * Strip all HTML tags from a string.
 * Uses iterative replacement to prevent incomplete multi-character sanitization bypasses (e.g. <<script>script>).
 */
export function stripHtml(html: string): string {
  if (!html || typeof html !== 'string') return '';
  
  if (typeof window !== 'undefined' && typeof DOMParser !== 'undefined') {
    try {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return (doc.body.textContent || '').trim();
    } catch {
      // Fallback to iterative replacement if DOMParser fails
    }
  }

  let clean = html;
  let previous = '';
  while (clean !== previous) {
    previous = clean;
    clean = clean.replace(/<[^>]*>/g, '');
  }
  return clean.trim();
}

// ─── Input Validation ────────────────────────────────────────

/**
 * Validate a tool submission payload.
 * Returns an array of error messages (empty if valid).
 */
export function validateToolSubmission(data: {
  name?: string;
  description?: string;
  category?: string;
  url?: string;
  pricing?: string;
  submitterEmail?: string;
}): string[] {
  const errors: string[] = [];

  if (!data.name?.trim()) errors.push('Tool name is required');
  if (data.name && data.name.length > 100) errors.push('Tool name must be under 100 characters');

  if (!data.description?.trim()) errors.push('Description is required');
  if (data.description && data.description.length > 2000) errors.push('Description must be under 2000 characters');

  if (!data.category?.trim()) errors.push('Category is required');

  if (!data.url?.trim()) {
    errors.push('Website URL is required');
  } else if (!isValidUrl(data.url)) {
    errors.push('Invalid website URL format');
  } else if (!isValidHttpsUrl(data.url)) {
    errors.push('Website URL must use HTTPS');
  }

  if (data.submitterEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.submitterEmail)) {
    errors.push('Invalid email address format');
  }

  return errors;
}

/**
 * Rate limiter for client-side actions.
 */
const rateLimitMap = new Map<string, number>();

export function isRateLimited(actionKey: string, cooldownMs: number = 5000): boolean {
  const now = Date.now();
  const lastAction = rateLimitMap.get(actionKey) || 0;
  
  if (now - lastAction < cooldownMs) {
    return true;
  }
  
  rateLimitMap.set(actionKey, now);
  return false;
}
