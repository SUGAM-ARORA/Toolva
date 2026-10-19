/**
 * ToolVa — Bayesian Rating & Scoring Engine
 * 
 * Implements the canonical Bayesian Weighted Rating formula from the Master Tracker:
 * WR = (v / (v + m)) * R + (m / (v + m)) * C
 * 
 * Where:
 * - v: Verified review count for this tool
 * - m: Prior weight parameter (default = 10)
 * - R: Arithmetic mean of ratings for this tool
 * - C: Global catalog mean rating (default = 4.20)
 */

import { DimensionScores, UserReview } from '../types';

export const DEFAULT_PRIOR_M = 10;
export const DEFAULT_GLOBAL_MEAN_C = 4.20;

export interface BayesianRatingResult {
  weightedScore: number;       // WR rounded to 2 decimals
  rawAverage: number;          // R rounded to 2 decimals
  reviewCount: number;         // v
  confidenceLevel: 'low' | 'moderate' | 'high';
  confidenceLabel: string;
  dimensionAverages: DimensionScores;
}

/**
 * Calculates the Bayesian Weighted Rating according to the documented formula.
 */
export function calculateBayesianRating(
  ratings: number[],
  m: number = DEFAULT_PRIOR_M,
  c: number = DEFAULT_GLOBAL_MEAN_C
): { weightedScore: number; rawAverage: number; reviewCount: number } {
  const v = ratings.length;
  if (v === 0) {
    return {
      weightedScore: c,
      rawAverage: c,
      reviewCount: 0,
    };
  }

  const sum = ratings.reduce((acc, val) => acc + val, 0);
  const R = sum / v;

  // Formula: WR = (v / (v + m)) * R + (m / (v + m)) * C
  const weightedRating = (v / (v + m)) * R + (m / (v + m)) * c;

  return {
    weightedScore: Math.round(weightedRating * 100) / 100,
    rawAverage: Math.round(R * 100) / 100,
    reviewCount: v,
  };
}

/**
 * Computes the sample confidence tier based on review count v relative to prior m.
 */
export function getSampleConfidence(
  reviewCount: number,
  m: number = DEFAULT_PRIOR_M
): { level: 'low' | 'moderate' | 'high'; label: string } {
  if (reviewCount < m) {
    return {
      level: 'low',
      label: `Early rating — ${reviewCount} review${reviewCount === 1 ? '' : 's'} (Confidence: Low, prior M=${m})`,
    };
  }
  if (reviewCount < m * 2.5) {
    return {
      level: 'moderate',
      label: `Established rating — ${reviewCount} reviews (Confidence: Moderate)`,
    };
  }
  return {
    level: 'high',
    label: `Verified high confidence — ${reviewCount} reviews`,
  };
}

/**
 * Computes average dimension scores across verified user reviews.
 */
export function calculateDimensionAverages(reviews: UserReview[]): DimensionScores {
  if (!reviews || reviews.length === 0) {
    return {
      overall: 4.2,
      easeOfUse: 4.2,
      quality: 4.2,
      devExperience: 4.2,
      value: 4.2,
      localPerformance: 4.0,
    };
  }

  let totalOverall = 0;
  let totalEase = 0;
  let totalQuality = 0;
  let totalDev = 0;
  let totalValue = 0;
  let totalLocal = 0;
  let localCount = 0;

  for (const rev of reviews) {
    totalOverall += rev.rating || 4;
    if (rev.dimensionScores) {
      totalEase += rev.dimensionScores.easeOfUse || rev.rating;
      totalQuality += rev.dimensionScores.quality || rev.rating;
      totalDev += rev.dimensionScores.devExperience || rev.rating;
      totalValue += rev.dimensionScores.value || rev.rating;
      if (rev.dimensionScores.localPerformance !== undefined) {
        totalLocal += rev.dimensionScores.localPerformance;
        localCount++;
      }
    }
  }

  const n = reviews.length;
  const round1 = (num: number) => Math.round(num * 10) / 10;

  return {
    overall: round1(totalOverall / n),
    easeOfUse: round1(totalEase / n),
    quality: round1(totalQuality / n),
    devExperience: round1(totalDev / n),
    value: round1(totalValue / n),
    localPerformance: localCount > 0 ? round1(totalLocal / localCount) : 4.0,
  };
}

/**
 * Full rating evaluation combining Bayesian score, confidence, and dimension metrics.
 */
export function evaluateToolRatings(
  reviews: UserReview[],
  m: number = DEFAULT_PRIOR_M,
  c: number = DEFAULT_GLOBAL_MEAN_C
): BayesianRatingResult {
  const ratings = reviews.map((r) => r.rating);
  const { weightedScore, rawAverage, reviewCount } = calculateBayesianRating(ratings, m, c);
  const confidence = getSampleConfidence(reviewCount, m);
  const dimensionAverages = calculateDimensionAverages(reviews);

  return {
    weightedScore,
    rawAverage,
    reviewCount,
    confidenceLevel: confidence.level,
    confidenceLabel: confidence.label,
    dimensionAverages,
  };
}

/**
 * Anti-Manipulation Rule Enforcement:
 * 1. Tool author/submitter CANNOT rate their own tool.
 * 2. Each user may only review a tool once.
 */
export function validateReviewSubmission(params: {
  userId: string;
  userEmail?: string;
  toolSubmitter?: string;
  existingReviews: UserReview[];
}): { allowed: boolean; reason?: string } {
  const { userId, userEmail, toolSubmitter, existingReviews } = params;

  if (toolSubmitter) {
    const cleanSub = toolSubmitter.toLowerCase().trim();
    if (userEmail && cleanSub === userEmail.toLowerCase().trim()) {
      return { allowed: false, reason: 'Tool authors and submitters cannot rate their own listings.' };
    }
  }

  const hasAlreadyReviewed = existingReviews.some((r) => r.userId === userId);
  if (hasAlreadyReviewed) {
    return { allowed: false, reason: 'You have already submitted a review for this tool.' };
  }

  return { allowed: true };
}
