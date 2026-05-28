export const formatDifficulty = (difficulty?: string) => {
  if (!difficulty) return "Easy";
  return (difficulty.charAt(0).toUpperCase() + difficulty.slice(1)) as
    | "Easy"
    | "Medium"
    | "Hard";
};

export const isAcceptedStatus = (status: any) => {
  const id = status?.id ?? status?.status_id;
  const desc = status?.description ?? "";
  return id === 3 || String(desc).toLowerCase() === "accepted";
};

export const toTitleCase = (value?: string) =>
  String(value ?? "")
    .split(/[\s_-]+/g)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

/** Web section row: "Considered: 5 of 5" — uses questions_considered only (no answered fallback). */
export const formatSectionConsideredOf = (section: any) => {
  const den = section?.total_questions ?? section?.select_random ?? 0;
  const raw = section?.questions_considered;
  if (raw !== undefined && raw !== null && Number.isFinite(Number(raw))) {
    return `${Number(raw)} of ${den}`;
  }
  return den > 0 ? `— of ${den}` : "—";
};

export const formatSectionPercent = (p: number) => {
  const n = Number(p);
  if (!Number.isFinite(n)) return "0%";
  if (Math.abs(n - Math.round(n)) < 1e-6) return `${Math.round(n)}%`;
  return `${n.toFixed(2)}%`;
};

export const formatQuestionTypeLabel = (value?: string) => {
  const v = String(value ?? "").toLowerCase();
  if (!v) return "Text";
  if (v.includes("coding")) return "Coding";
  if (v.includes("single_choice")) return "MCQ";
  if (v.includes("multiple_choice")) return "Multiple";
  if (v.includes("mcq")) return "MCQ";
  if (v.includes("multiple")) return "Multiple";
  return toTitleCase(value);
};

export const parseChoiceIds = (value: any): number[] => {
  if (value == null) return [];
  if (Array.isArray(value)) {
    return value
      .map((v) => Number(v))
      .filter((n) => Number.isFinite(n));
  }

  const str = String(value).trim();
  if (!str) return [];

  try {
    const parsed = JSON.parse(str);
    if (Array.isArray(parsed)) {
      return parsed
        .map((v) => Number(v))
        .filter((n) => Number.isFinite(n));
    }
  } catch {
    // ignore
  }

  return str
    .split(/\r?\n|,|\|/g)
    .map((p) => Number(String(p).trim().replace(/^"+|"+$/g, "")))
    .filter((n) => Number.isFinite(n));
};

export const toLabelFromKey = (value?: string) => {
  const v = String(value ?? "").trim();
  if (!v) return "";
  return v
    .replace(/_/g, " ")
    .split(/\s+/g)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

export const normalizeAiEvaluation = (ai: any, questionPoints?: number) => {
  if (!ai || typeof ai !== "object") return null;

  const flags: string[] = Array.isArray(ai?.ai_flags)
    ? ai.ai_flags.map((item: any) => String(item).toLowerCase())
    : [];

  const breakdownFromArray = Array.isArray(ai?.ai_breakdown)
    ? ai.ai_breakdown.map((item: any) => ({
      key: String(item?.key ?? item?.label ?? "").trim(),
      label: String(item?.label ?? toLabelFromKey(item?.key) ?? "Metric").trim(),
      note: String(item?.note ?? "").trim(),
      score: Number(item?.score ?? 0),
    }))
    : [];

  const breakdownFromObject =
    !breakdownFromArray.length && ai?.ai_subscores && typeof ai.ai_subscores === "object"
      ? Object.entries(ai.ai_subscores).map(([k, v]: [string, any]) => ({
        key: k,
        label: toLabelFromKey(k) || "Metric",
        note: "",
        score: Number(v ?? 0),
      }))
      : [];

  const breakdown = breakdownFromArray.length ? breakdownFromArray : breakdownFromObject;

  const improvements = Array.isArray(ai?.ai_improvements)
    ? ai.ai_improvements.map((item: any) => String(item).trim()).filter(Boolean)
    : [];

  return {
    status: String(ai?.ai_status ?? "").trim() || "Scored",
    score: Number(ai?.ai_score ?? ai?.ai_overall_score ?? 0),
    maxScore: Number(questionPoints ?? 5) || 5,
    note: String(ai?.ai_note ?? ai?.ai_summary ?? ai?.ai_feedback ?? "").trim(),
    relevance: String(ai?.ai_relevance ?? "").trim(),
    language: String(ai?.ai_language ?? "").trim(),
    isOffTopic: flags.includes("off_topic"),
    breakdown,
    improvements,
  };
};
