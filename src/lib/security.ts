/**
 * Toolva Security Utilities
 * 
 * Provides URL sanitization, SSRF prevention, XSS prevention, and input validation
 * for user-generated content in the open-source frontend and API integration.
 */

// ─── URL Sanitization & SSRF Prevention ────────────────────────

const DANGEROUS_PROTOCOLS = ['javascript:', 'data:', 'vbscript:', 'file:'];

/**
 * Validates that a URL does NOT point to localhost, private RFC 1918 networks,
 * link-local addresses, or cloud instance metadata endpoints.
 */
export function isSsrfSafeUrl(urlStr: string): { safe: boolean; reason?: string } {
  if (!urlStr || typeof urlStr !== 'string') {
    return { safe: false, reason: 'URL cannot be empty' };
  }

  const trimmed = urlStr.trim();
  try {
    const parsed = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    const protocol = parsed.protocol.toLowerCase();

    if (protocol !== 'http:' && protocol !== 'https:') {
      return { safe: false, reason: `Disallowed protocol: ${protocol}. Only HTTP and HTTPS are permitted.` };
    }

    const host = parsed.hostname.toLowerCase();

    // 1. Loopback addresses & localhost
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '0.0.0.0' ||
      host === '::1' ||
      host.endsWith('.localhost') ||
      host.endsWith('.local') ||
      host.endsWith('.internal')
    ) {
      return { safe: false, reason: 'Localhost and private internal domain names are forbidden.' };
    }

    // 2. Cloud metadata endpoints
    if (host === '169.254.169.254' || host === 'metadata.google.internal' || host.includes('metadata.')) {
      return { safe: false, reason: 'Access to cloud instance metadata services is strictly blocked.' };
    }

    // 3. IPv4 Private RFC 1918 and Link-Local ranges
    const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const ipMatch = host.match(ipv4Regex);
    if (ipMatch) {
      const octet1 = parseInt(ipMatch[1], 10);
      const octet2 = parseInt(ipMatch[2], 10);

      // 10.0.0.0/8
      if (octet1 === 10) return { safe: false, reason: 'Private network (10.x.x.x) is forbidden.' };
      // 127.0.0.0/8
      if (octet1 === 127) return { safe: false, reason: 'Loopback network (127.x.x.x) is forbidden.' };
      // 172.16.0.0/12 (172.16.x.x - 172.31.x.x)
      if (octet1 === 172 && octet2 >= 16 && octet2 <= 31) {
        return { safe: false, reason: 'Private network (172.16-31.x.x) is forbidden.' };
      }
      // 192.168.0.0/16
      if (octet1 === 192 && octet2 === 168) {
        return { safe: false, reason: 'Private network (192.168.x.x) is forbidden.' };
      }
      // 169.254.0.0/16 (Link-Local)
      if (octet1 === 169 && octet2 === 254) {
        return { safe: false, reason: 'Link-local address (169.254.x.x) is forbidden.' };
      }
    }

    return { safe: true };
  } catch (err) {
    return { safe: false, reason: 'Malformed URL.' };
  }
}

/**
 * Sanitize a URL to prevent javascript: and other dangerous protocol exploits.
 * Returns the URL if safe, or '#' if potentially malicious.
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') return '#';
  
  const trimmed = url.trim();
  const lower = trimmed.toLowerCase();

  for (const dangerous of DANGEROUS_PROTOCOLS) {
    if (lower.startsWith(dangerous) || lower.includes('javascript:')) {
      return '#';
    }
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
 */
export function stripHtml(html: string): string {
  if (!html || typeof html !== 'string') return '';
  
  if (typeof window !== 'undefined' && typeof DOMParser !== 'undefined') {
    try {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return (doc.body.textContent || '').trim();
    } catch {
      // Fallback
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
 * Validate a tool submission payload with SSRF safety checks.
 */
export function validateToolSubmission(data: {
  name?: string;
  description?: string;
  category?: string;
  url?: string;
  pricing?: string;
  submitterEmail?: string;
  github?: string;
  license?: string;
}): string[] {
  const errors: string[] = [];

  if (!data.name?.trim()) errors.push('Tool name is required');
  if (data.name && data.name.length > 100) errors.push('Tool name must be under 100 characters');

  if (!data.description?.trim()) errors.push('Description is required');
  if (data.description && data.description.length > 2000) errors.push('Description must be under 2000 characters');

  if (!data.category?.trim()) errors.push('Category is required');

  if (!data.url?.trim()) {
    errors.push('Website URL is required');
  } else {
    const ssrfCheck = isSsrfSafeUrl(data.url);
    if (!ssrfCheck.safe) {
      errors.push(`URL security check failed: ${ssrfCheck.reason}`);
    }
  }

  if (data.github) {
    const githubCheck = isSsrfSafeUrl(data.github);
    if (!githubCheck.safe) {
      errors.push(`Repository URL security check failed: ${githubCheck.reason}`);
    }
  }

  if (data.submitterEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.submitterEmail)) {
    errors.push('Invalid email address format');
  }

  return errors;
}

// ─── Rate Limiter ────────────────────────────────────────────

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
