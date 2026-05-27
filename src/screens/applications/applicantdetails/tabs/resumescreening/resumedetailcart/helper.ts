import { colors } from "../../../../../../theme/colors";
import type { RelevanceLevel, ScorecardComponent } from "./resumedetail";

export const formatRelevance = (relevance?: RelevanceLevel): string => {
  if (!relevance) return "_";

  const map: Record<RelevanceLevel, string> = {
    matched: "Matched",
    high: "Highly relevant",
    medium: "Relevant",
    low: "Low",
  };

  return map[relevance] ?? relevance;
};

export const relevanceStyleMap: Record<
  RelevanceLevel,
  {
    textColor: string;
    borderColor: string;
    backgroundColor: string;
  }
> = {
  matched: {
    textColor: colors.success[900],
    borderColor: colors.success[200],
    backgroundColor: colors.success[100],
  },
  high: {
    textColor: colors.success[700],
    borderColor: colors.success[200],
    backgroundColor: colors.success[50],
  },
  medium: {
    textColor: colors.brand[700],
    borderColor: colors.brand[200],
    backgroundColor: colors.brand[50],
  },
  low: {
    textColor: colors.gray[600],
    borderColor: colors.gray[200],
    backgroundColor: colors.gray[50],
  },
};

export const getRelevanceStyles = (relevance?: RelevanceLevel) => {
  return relevance
    ? relevanceStyleMap[relevance]
    : {
        textColor: colors.gray[600],
        borderColor: colors.gray[200],
        backgroundColor: colors.gray[50],
      };
};

const RELEVANCE_ORDER: RelevanceLevel[] = ["matched", "high", "medium", "low"];

const tierIndex = (t?: RelevanceLevel) =>
  t && RELEVANCE_ORDER.indexOf(t) >= 0
    ? RELEVANCE_ORDER.indexOf(t)
    : RELEVANCE_ORDER.length;

/** Scorecard v3 uses `tier`; resume_details uses `relevance`. */
export const sortByTierOrRelevance = <
  T extends { tier?: RelevanceLevel; relevance?: RelevanceLevel }
>(
  items: T[]
): T[] =>
  [...(items ?? [])].sort((a, b) => {
    const ta = a.tier ?? a.relevance;
    const tb = b.tier ?? b.relevance;
    return tierIndex(ta) - tierIndex(tb);
  });

export function tieredItemsForKeys(
  components: ScorecardComponent[] | undefined,
  keys: readonly string[]
) {
  const list = components ?? [];
  for (const k of keys) {
    const found = list.find((c) => c?.key === k);
    if (found?.tiered_items?.length) return found.tiered_items;
  }
  return [];
}

/** Snake_case dates from scorecard / resume_details. */
export const pickStartDate = (item: {
  start_date?: string;
  startDate?: string;
}) => item.start_date ?? item.startDate;

export const pickEndDate = (item: { end_date?: string; endDate?: string }) =>
  item.end_date ?? item.endDate;

export const pickTierLabel = (item: {
  tier?: RelevanceLevel;
  relevance?: RelevanceLevel;
}) => item.tier ?? item.relevance;
