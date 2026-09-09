export interface CefrLevelInfo {
  level: string;
  name: string;
  color: string;
  bg: string;
  border: string;
  barColor: string;
}

export const CEFR_LEVELS_MAP: Record<string, CefrLevelInfo> = {
  A1: {
    level: 'A1',
    name: 'Beginner',
    color: '#EF4444',
    bg: '#FEF2F2',
    border: '#EF4444',
    barColor: '#EF4444',
  },
  A2: {
    level: 'A2',
    name: 'Elementary',
    color: '#EF4444',
    bg: '#FEF2F2',
    border: '#EF4444',
    barColor: '#EF4444',
  },
  B1: {
    level: 'B1',
    name: 'Intermediate',
    color: '#D97706',
    bg: '#FFFBEB',
    border: '#D97706',
    barColor: '#D97706',
  },
  B2: {
    level: 'B2',
    name: 'Upper-intermediate',
    color: '#2563EB',
    bg: '#EFF6FF',
    border: '#2563EB',
    barColor: '#2563EB',
  },
  C1: {
    level: 'C1',
    name: 'Advanced',
    color: '#16A34A',
    bg: '#DCFCE7',
    border: '#16A34A',
    barColor: '#16A34A',
  },
  C2: {
    level: 'C2',
    name: 'Proficient',
    color: '#16A34A',
    bg: '#DCFCE7',
    border: '#16A34A',
    barColor: '#16A34A',
  },
};

export const CEFR_LEVELS_LIST: CefrLevelInfo[] = [
  CEFR_LEVELS_MAP.A1,
  CEFR_LEVELS_MAP.A2,
  CEFR_LEVELS_MAP.B1,
  CEFR_LEVELS_MAP.B2,
  CEFR_LEVELS_MAP.C1,
  CEFR_LEVELS_MAP.C2,
];

export const getCefrColor = (level?: string): CefrLevelInfo => {
  if (!level) return CEFR_LEVELS_MAP.C1;
  const normalized = level.toUpperCase().trim();
  if (CEFR_LEVELS_MAP[normalized]) {
    return CEFR_LEVELS_MAP[normalized];
  }
  if (normalized.startsWith('A')) return CEFR_LEVELS_MAP.A1;
  if (normalized.startsWith('B1')) return CEFR_LEVELS_MAP.B1;
  if (normalized.startsWith('B2')) return CEFR_LEVELS_MAP.B2;
  if (normalized.startsWith('B')) return CEFR_LEVELS_MAP.B2;
  if (normalized.startsWith('C2')) return CEFR_LEVELS_MAP.C2;
  if (normalized.startsWith('C')) return CEFR_LEVELS_MAP.C1;
  return CEFR_LEVELS_MAP.C1;
};
