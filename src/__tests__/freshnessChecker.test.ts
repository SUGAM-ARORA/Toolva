import { test, describe } from 'node:test';
import assert from 'node:assert';
import { evaluateStalePolicy } from '../lib/freshnessChecker.js';
import { AITool } from '../types/index.js';

describe('Freshness & Stale-Data Policy Tests', () => {
  const baseTool: AITool = {
    id: 'tool-test',
    name: 'Test LLM',
    description: 'A test model',
    category: 'Chatbots',
    url: 'https://example.com',
    image: '',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '1000',
    modelType: 'Chatbots',
    easeOfUse: 4.5,
    userExperience: 4.5,
    verifiedActive: true,
  };

  test('Flags pricing older than 90 days as stale', () => {
    const now = new Date('2026-10-19T00:00:00Z');
    const oldTool: AITool = {
      ...baseTool,
      pricingLastVerified: '2026-06-01T00:00:00Z', // >130 days old
      lastUpdated: '2026-09-01T00:00:00Z',
    };

    const policy = evaluateStalePolicy(oldTool, now);
    assert.strictEqual(policy.isPriceStale, true);
    assert.strictEqual(policy.badge, 'needs_review');
  });

  test('Considers freshly verified tool within 30 days as verified active', () => {
    const now = new Date('2026-10-19T00:00:00Z');
    const freshTool: AITool = {
      ...baseTool,
      pricingLastVerified: '2026-10-01T00:00:00Z', // 18 days old
      lastUpdated: '2026-10-01T00:00:00Z',
    };

    const policy = evaluateStalePolicy(freshTool, now);
    assert.strictEqual(policy.isPriceStale, false);
    assert.strictEqual(policy.isListingStale, false);
    assert.strictEqual(policy.badge, 'verified_active');
  });

  test('Identifies broken link status', () => {
    const brokenTool: AITool = {
      ...baseTool,
      freshnessStatus: 'broken_link',
      httpStatus: 404,
    };

    const policy = evaluateStalePolicy(brokenTool);
    assert.strictEqual(policy.badge, 'broken_link');
  });
});
