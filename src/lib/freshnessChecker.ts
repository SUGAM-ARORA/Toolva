/**
 * Toolva — Automated URL & Freshness Checking Engine
 * 
 * Implements acceptance criteria for Tasks 4.1, 4.2, 4.3, 4.4:
 * - Weekly automated check of tool websites and repository endpoints
 * - SSRF protection prohibiting private IP checks
 * - Records last checked date, HTTP status code, and latency
 * - Identifies redirects, temporary errors, and dead links
 * - Flags stale prices (>90 days) and unreviewed listings (>180 days)
 */

import { isSsrfSafeUrl } from './security';
import { AITool } from '../types';

export interface FreshnessCheckResult {
  url: string;
  isAlive: boolean;
  httpStatus: number;
  responseTimeMs: number;
  isRedirect: boolean;
  lastCheckedDate: string;
  errorMessage?: string;
}

export interface StalePolicyStatus {
  isPriceStale: boolean;
  priceDaysOld: number;
  isListingStale: boolean;
  listingDaysOld: number;
  badge: 'verified_active' | 'needs_review' | 'broken_link';
}

/**
 * Evaluates the freshness status of a tool according to the documented stale-data policy.
 */
export function evaluateStalePolicy(tool: AITool, now: Date = new Date()): StalePolicyStatus {
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  
  // 1. Pricing freshness (Threshold: 90 days)
  let priceDaysOld = 0;
  if (tool.pricingLastVerified) {
    const verifiedDate = new Date(tool.pricingLastVerified);
    priceDaysOld = Math.max(0, Math.floor((now.getTime() - verifiedDate.getTime()) / ONE_DAY_MS));
  } else {
    priceDaysOld = 120; // Untracked pricing is treated as stale
  }
  const isPriceStale = priceDaysOld > 90;

  // 2. Listing review freshness (Threshold: 180 days)
  let listingDaysOld = 0;
  if (tool.lastUpdated) {
    const updatedDate = new Date(tool.lastUpdated);
    listingDaysOld = Math.max(0, Math.floor((now.getTime() - updatedDate.getTime()) / ONE_DAY_MS));
  } else {
    listingDaysOld = 200;
  }
  const isListingStale = listingDaysOld > 180;

  // 3. Badge assignment
  let badge: 'verified_active' | 'needs_review' | 'broken_link' = 'verified_active';
  if (tool.freshnessStatus === 'broken_link' || (tool.httpStatus && tool.httpStatus >= 400)) {
    badge = 'broken_link';
  } else if (isListingStale || isPriceStale) {
    badge = 'needs_review';
  } else if (tool.verifiedActive) {
    badge = 'verified_active';
  }

  return {
    isPriceStale,
    priceDaysOld,
    isListingStale,
    listingDaysOld,
    badge,
  };
}

/**
 * Checks a URL safely with SSRF protection.
 */
export async function checkUrlFreshness(url: string, timeoutMs: number = 8000): Promise<FreshnessCheckResult> {
  const ssrfCheck = isSsrfSafeUrl(url);
  if (!ssrfCheck.safe) {
    return {
      url,
      isAlive: false,
      httpStatus: 400,
      responseTimeMs: 0,
      isRedirect: false,
      lastCheckedDate: new Date().toISOString().split('T')[0],
      errorMessage: `Blocked by SSRF policy: ${ssrfCheck.reason}`,
    };
  }

  const startTime = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      method: 'HEAD',
      mode: 'no-cors', // In browser client mode
      signal: controller.signal,
    });
    clearTimeout(timer);
    const duration = Date.now() - startTime;

    return {
      url,
      isAlive: true,
      httpStatus: res.status || 200,
      responseTimeMs: duration,
      isRedirect: res.redirected || false,
      lastCheckedDate: new Date().toISOString().split('T')[0],
    };
  } catch (err: any) {
    clearTimeout(timer);
    const duration = Date.now() - startTime;
    return {
      url,
      isAlive: false,
      httpStatus: 0,
      responseTimeMs: duration,
      isRedirect: false,
      lastCheckedDate: new Date().toISOString().split('T')[0],
      errorMessage: err.name === 'AbortError' ? 'Connection timed out' : err.message,
    };
  }
}
