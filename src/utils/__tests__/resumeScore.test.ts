import {
  getResumeScoreColorInfo,
  getCandidateResumeScoreInfo,
  parseResumeScoreValue,
  RESUME_SCORE_TIERS,
} from '../resumeScore';

describe('Resume Score Color Utility', () => {
  describe('RESUME_SCORE_TIERS specifications', () => {
    it('has exact colors for Green (Strong match) >= 8.0', () => {
      expect(RESUME_SCORE_TIERS.strong_match).toEqual({
        tier: 'strong_match',
        label: 'Strong match',
        minScore: 8.0,
        maxScore: 10.0,
        bg: 'rgba(16, 185, 129, 0.12)',
        fg: '#065f46',
      });
    });

    it('has exact colors for Indigo/Blue (Above average) 6.0 – 7.9', () => {
      expect(RESUME_SCORE_TIERS.above_average).toEqual({
        tier: 'above_average',
        label: 'Above average',
        minScore: 6.0,
        maxScore: 7.9,
        bg: 'rgba(99, 102, 241, 0.10)',
        fg: '#3730a3',
      });
    });

    it('has exact colors for Amber/Orange (Average) 4.0 – 5.9', () => {
      expect(RESUME_SCORE_TIERS.average).toEqual({
        tier: 'average',
        label: 'Average',
        minScore: 4.0,
        maxScore: 5.9,
        bg: 'rgba(245, 158, 11, 0.12)',
        fg: '#92400e',
      });
    });

    it('has exact colors for Red (Low match) < 4.0', () => {
      expect(RESUME_SCORE_TIERS.low_match).toEqual({
        tier: 'low_match',
        label: 'Low match',
        minScore: 0.0,
        maxScore: 3.99,
        bg: 'rgba(239, 68, 68, 0.10)',
        fg: '#991b1b',
      });
    });
  });

  describe('parseResumeScoreValue', () => {
    it('parses numeric values correctly', () => {
      expect(parseResumeScoreValue(8.5)).toBe(8.5);
      expect(parseResumeScoreValue(0)).toBe(0);
      expect(parseResumeScoreValue(10)).toBe(10);
    });

    it('parses string numbers and strings with suffixes', () => {
      expect(parseResumeScoreValue('7.8')).toBe(7.8);
      expect(parseResumeScoreValue('7.8/10')).toBe(7.8);
      expect(parseResumeScoreValue('85%')).toBe(8.5);
    });

    it('returns null for null, undefined, or invalid inputs', () => {
      expect(parseResumeScoreValue(null)).toBeNull();
      expect(parseResumeScoreValue(undefined)).toBeNull();
      expect(parseResumeScoreValue('invalid')).toBeNull();
    });
  });

  describe('getResumeScoreColorInfo tier classifications', () => {
    it('returns Green for scores >= 8.0', () => {
      const info80 = getResumeScoreColorInfo(8.0);
      expect(info80).not.toBeNull();
      expect(info80?.tier).toBe('strong_match');
      expect(info80?.bg).toBe('rgba(16, 185, 129, 0.12)');
      expect(info80?.fg).toBe('#065f46');
      expect(info80?.formatted).toBe('8.0');

      const info95 = getResumeScoreColorInfo(9.5);
      expect(info95?.tier).toBe('strong_match');
      expect(info95?.formatted).toBe('9.5');
    });

    it('returns Indigo / Blue for scores between 6.0 and 7.9', () => {
      const info78 = getResumeScoreColorInfo(7.8);
      expect(info78?.tier).toBe('above_average');
      expect(info78?.bg).toBe('rgba(99, 102, 241, 0.10)');
      expect(info78?.fg).toBe('#3730a3');
      expect(info78?.formatted).toBe('7.8');

      const info60 = getResumeScoreColorInfo(6.0);
      expect(info60?.tier).toBe('above_average');
      expect(info60?.formatted).toBe('6.0');

      const info79 = getResumeScoreColorInfo(7.9);
      expect(info79?.tier).toBe('above_average');
    });

    it('returns Amber / Orange for scores between 4.0 and 5.9', () => {
      const info52 = getResumeScoreColorInfo(5.2);
      expect(info52?.tier).toBe('average');
      expect(info52?.bg).toBe('rgba(245, 158, 11, 0.12)');
      expect(info52?.fg).toBe('#92400e');
      expect(info52?.formatted).toBe('5.2');

      const info40 = getResumeScoreColorInfo(4.0);
      expect(info40?.tier).toBe('average');
      expect(info40?.formatted).toBe('4.0');
    });

    it('returns Red for scores < 4.0', () => {
      const info03 = getResumeScoreColorInfo(0.3);
      expect(info03?.tier).toBe('low_match');
      expect(info03?.bg).toBe('rgba(239, 68, 68, 0.10)');
      expect(info03?.fg).toBe('#991b1b');
      expect(info03?.formatted).toBe('0.3');

      const info39 = getResumeScoreColorInfo(3.9);
      expect(info39?.tier).toBe('low_match');
      expect(info39?.formatted).toBe('3.9');

      const info01 = getResumeScoreColorInfo(0.1);
      expect(info01?.tier).toBe('low_match');
      expect(info01?.formatted).toBe('0.1');
    });

    it('returns null for empty or non-numeric inputs', () => {
      expect(getResumeScoreColorInfo(null)).toBeNull();
      expect(getResumeScoreColorInfo(undefined)).toBeNull();
      expect(getResumeScoreColorInfo('N/A')).toBeNull();
    });
  });

  describe('getCandidateResumeScoreInfo', () => {
    it('uses resume_score directly when present', () => {
      const cand = {
        resume_score: 7.8,
        match_score: 0.76,
        overall_score: 0.78,
      };
      const info = getCandidateResumeScoreInfo(cand);
      expect(info?.formatted).toBe('7.8');
      expect(info?.tier).toBe('above_average');
      expect(info?.fg).toBe('#3730a3');
    });

    it('scales decimal match_score <= 1.0 to 10-point scale when resume_score is missing', () => {
      const cand = {
        resume_score: null,
        match_score: 0.85,
      };
      const info = getCandidateResumeScoreInfo(cand);
      expect(info?.formatted).toBe('8.5');
      expect(info?.tier).toBe('strong_match');
      expect(info?.fg).toBe('#065f46');
    });

    it('scales decimal overall_score <= 1.0 to 10-point scale when match_score and resume_score are missing', () => {
      const cand = {
        resume_score: null,
        overall_score: 0.55,
      };
      const info = getCandidateResumeScoreInfo(cand);
      expect(info?.formatted).toBe('5.5');
      expect(info?.tier).toBe('average');
      expect(info?.fg).toBe('#92400e');
    });

    it('returns null if candidate has no scores', () => {
      expect(getCandidateResumeScoreInfo(null)).toBeNull();
      expect(getCandidateResumeScoreInfo({})).toBeNull();
      expect(getCandidateResumeScoreInfo({ resume_score: null })).toBeNull();
    });
  });
});

