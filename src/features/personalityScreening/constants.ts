export const PERSONALITY_SCREENING_ACTION_TYPES = {
  // Saga trigger (never used directly in the slice)
  GET_LIST_TRIGGER: "personalityScreening/GET_LIST_TRIGGER",
} as const;

/** Default sort: most recent assigned first (used on first load) */
export const DEFAULT_ORDER = "-assigned_at";
