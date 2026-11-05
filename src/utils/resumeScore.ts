/**
 * Resume Score Utilities & Configuration
 *
 * Professional tier-based color system for candidate resume scores:
 *
 * | Score Range | Tier / Color                  | Background (bg)          | Text / Foreground (fg) |
 * |-------------|-------------------------------|--------------------------|------------------------|
 * | ≥ 8.0       | Green (Strong match)          | rgba(16, 185, 129, 0.12) | #065f46                |
 * | 6.0 – 7.9   | Indigo / Blue (Above average) | rgba(99, 102, 241, 0.10) | #3730a3                |
 * | 4.0 – 5.9   | Amber / Orange (Average)      | rgba(245, 158, 11, 0.12) | #92400e                |
 * | < 4.0       | Red (Low match)               | rgba(239, 68, 68, 0.10)  | #991b1b                |
 */

export type ResumeScoreTier = 'strong_match' | 'above_average' | 'average' | 'low_match';

export interface ResumeScoreTierConfig {
  tier: ResumeScoreTier;
  label: string;
  minScore: number;
  maxScore: number;
  bg: string;
  fg: string;
}

export interface ResumeScoreColorInfo {
  tier: ResumeScoreTier;
  tierLabel: string;
  score: number;
  formatted: string;
  bg: string;
  fg: string;
  textColor: string; // Alias for fg for backwards/flexible compatibility
}

export const RESUME_SCORE_TIERS: Record<ResumeScoreTier, ResumeScoreTierConfig> = {
  strong_match: {
    tier: 'strong_match',
    label: 'Strong match',
    minScore: 8.0,
    maxScore: 10.0,
    bg: 'rgba(16, 185, 129, 0.12)',
    fg: '#065f46',
  },
  above_average: {
    tier: 'above_average',
    label: 'Above average',
    minScore: 6.0,
    maxScore: 7.9,
    bg: 'rgba(99, 102, 241, 0.10)',
    fg: '#3730a3',
  },
  average: {
    tier: 'average',
    label: 'Average',
    minScore: 4.0,
    maxScore: 5.9,
    bg: 'rgba(245, 158, 11, 0.12)',
    fg: '#92400e',
  },
  low_match: {
    tier: 'low_match',
    label: 'Low match',
    minScore: 0.0,
    maxScore: 3.99,
    bg: 'rgba(239, 68, 68, 0.10)',
    fg: '#991b1b',
  },
};

/**
 * Normalizes any score input into a standard 10-point scale number.
 * Handles numbers, strings ("7.8", "7.8/10", "78%"), null, undefined.
 */
export const parseResumeScoreValue = (
  rawScore: number | string | null | undefined
): number | null => {
  if (rawScore == null) return null;

  let num: number;
  if (typeof rawScore === 'number') {
    num = rawScore;
  } else {
    const cleaned = String(rawScore)
      .replace(/[^\d.-]/g, ' ')
      .trim()
      .split(/\s+/)[0];
    num = parseFloat(cleaned);
  }

  if (isNaN(num)) return null;

  // Handle percentages > 10 (e.g. 78 -> 7.8)
  if (num > 10 && num <= 100) {
    return num / 10;
  }

  return num;
};

/**
 * Returns the score color info (tier, formatted string, bg, fg/textColor)
 * based on the exact Resume Score color configuration:
 *  - >= 8.0: Green (Strong match) -> bg: rgba(16, 185, 129, 0.12), fg: #065f46
 *  - 6.0 – 7.9: Indigo / Blue (Above average) -> bg: rgba(99, 102, 241, 0.10), fg: #3730a3
 *  - 4.0 – 5.9: Amber / Orange (Average) -> bg: rgba(245, 158, 11, 0.12), fg: #92400e
 *  - < 4.0: Red (Low match) -> bg: rgba(239, 68, 68, 0.10), fg: #991b1b
 */
export const getResumeScoreColorInfo = (
  rawScore: number | string | null | undefined
): ResumeScoreColorInfo | null => {
  const num = parseResumeScoreValue(rawScore);
  if (num == null) return null;

  // Clamp within 0.0 to 10.0
  const clamped = Math.max(0, Math.min(10, num));
  const formatted = clamped.toFixed(1);

  if (clamped >= 8.0) {
    const config = RESUME_SCORE_TIERS.strong_match;
    return {
      tier: config.tier,
      tierLabel: config.label,
      score: clamped,
      formatted,
      bg: config.bg,
      fg: config.fg,
      textColor: config.fg,
    };
  }

  if (clamped >= 6.0) {
    const config = RESUME_SCORE_TIERS.above_average;
    return {
      tier: config.tier,
      tierLabel: config.label,
      score: clamped,
      formatted,
      bg: config.bg,
      fg: config.fg,
      textColor: config.fg,
    };
  }

  if (clamped >= 4.0) {
    const config = RESUME_SCORE_TIERS.average;
    return {
      tier: config.tier,
      tierLabel: config.label,
      score: clamped,
      formatted,
      bg: config.bg,
      fg: config.fg,
      textColor: config.fg,
    };
  }

  const config = RESUME_SCORE_TIERS.low_match;
  return {
    tier: config.tier,
    tierLabel: config.label,
    score: clamped,
    formatted,
    bg: config.bg,
    fg: config.fg,
    textColor: config.fg,
  };
};

/**
 * Extracts and computes score color info directly from candidate-like objects.
 * Prioritizes resume_score, then match_score (scaled to 10 if <= 1.0), then overall_score.
 */
export const getCandidateResumeScoreInfo = (
  candidate?: {
    resume_score?: number | string | null;
    match_score?: number | string | null;
    overall_score?: number | string | null;
  } | null
): ResumeScoreColorInfo | null => {
  if (!candidate) return null;

  if (candidate.resume_score != null) {
    return getResumeScoreColorInfo(candidate.resume_score);
  }

  const secondary = candidate.match_score ?? candidate.overall_score;
  if (secondary != null) {
    const num = Number(secondary);
    if (!isNaN(num)) {
      // If normalized decimal between 0 and 1, scale up to 10-point scale (e.g. 0.78 -> 7.8)
      const scaled = num > 0 && num <= 1.0 ? num * 10 : num;
      return getResumeScoreColorInfo(scaled);
    }
  }

  return null;
};

