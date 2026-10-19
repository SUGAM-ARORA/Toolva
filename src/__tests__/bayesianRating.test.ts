import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  calculateBayesianRating,
  getSampleConfidence,
  evaluateToolRatings,
  validateReviewSubmission,
  DEFAULT_PRIOR_M,
  DEFAULT_GLOBAL_MEAN_C,
} from '../lib/bayesianRating.js';

describe('Bayesian Rating Engine Tests', () => {
  test('Empty reviews returns global catalog mean C', () => {
    const res = calculateBayesianRating([]);
    assert.strictEqual(res.weightedScore, DEFAULT_GLOBAL_MEAN_C);
    assert.strictEqual(res.reviewCount, 0);
  });

  test('Single 5-star review is moderated by prior M=10 to avoid score inflation', () => {
    // WR = (1 / (1 + 10)) * 5.0 + (10 / (1 + 10)) * 4.2 = (5.0 / 11) + (42 / 11) = 47 / 11 ≈ 4.27
    const res = calculateBayesianRating([5.0]);
    assert.strictEqual(res.reviewCount, 1);
    assert.strictEqual(res.rawAverage, 5.0);
    assert.strictEqual(res.weightedScore, 4.27);
  });

  test('Tool with 10 reviews at 4.8 has weightedScore of 4.50', () => {
    // WR = (10 / 20) * 4.8 + (10 / 20) * 4.2 = 2.4 + 2.1 = 4.50
    const ratings = Array(10).fill(4.8);
    const res = calculateBayesianRating(ratings);
    assert.strictEqual(res.reviewCount, 10);
    assert.strictEqual(res.weightedScore, 4.5);
  });

  test('Large sample (100 reviews at 4.8) strongly converges toward organic average', () => {
    // WR = (100 / 110) * 4.8 + (10 / 110) * 4.2 = 4.3636 + 0.3818 = 4.75
    const ratings = Array(100).fill(4.8);
    const res = calculateBayesianRating(ratings);
    assert.strictEqual(res.reviewCount, 100);
    assert.strictEqual(res.weightedScore, 4.75);
  });

  test('Confidence tier correctly categorizes sample volume', () => {
    assert.strictEqual(getSampleConfidence(3).level, 'low');
    assert.strictEqual(getSampleConfidence(15).level, 'moderate');
    assert.strictEqual(getSampleConfidence(50).level, 'high');
  });

  test('Anti-manipulation: Tool submitter cannot review own tool', () => {
    const res = validateReviewSubmission({
      userId: 'user_123',
      userEmail: 'founder@ai-corp.com',
      toolSubmitter: 'founder@ai-corp.com',
      existingReviews: [],
    });
    assert.strictEqual(res.allowed, false);
    assert.match(res.reason || '', /cannot rate their own listings/);
  });

  test('Anti-manipulation: User cannot submit duplicate review', () => {
    const res = validateReviewSubmission({
      userId: 'user_123',
      userEmail: 'dev@company.com',
      toolSubmitter: 'other@tool.com',
      existingReviews: [
        {
          id: 'rev_1',
          toolId: 'tool_1',
          userId: 'user_123',
          userName: 'Dev',
          userRole: 'user',
          rating: 5,
          comment: 'Great',
          dimensionScores: { overall: 5, easeOfUse: 5, quality: 5, devExperience: 5, value: 5 },
          verifiedReviewer: true,
          createdAt: new Date().toISOString(),
        },
      ],
    });
    assert.strictEqual(res.allowed, false);
    assert.match(res.reason || '', /already submitted a review/);
  });
});
