// ─── Types ────────────────────────────────────────────────────────────────────
type BuildApplicationPdfHtmlParams = {
  application: any;
  applicant: {
    name: string;
    appliedAt: string;
    email: string;
    contact: string;
    location: string;
  };
  job: {
    title: string;
  };
  stages: Array<{
    id: string;
    name: string;
    statusText: string;
    /** Raw workflow status for palette lookup (optional). */
    rawStatus?: string;
    date: string;
  }>;
  aiSummary: {
    summary: string;
    potentialRedFlags: string[];
    recruiterRecommendation: string;
    matchedSkills: string[];
    missingSkills: string[];
    jobReadinessScore: number;
    matchScore: number;
    /** From `ai_summary_json.key_insights` — rendered as strengths when no scorecard. */
    keyInsights?: string[];
  };
  /** When set (e.g. from resume screening report), mirrors `ApplicantPdfForm` data + layout. */
  scorecardV3?: any | null;
};

/** Aligns with `ApplicantPdfForm` (react-pdf) — slate + indigo system. */
const C = {
  indigo600: "#6366f1",
  indigo700: "#4338ca",
  indigo50: "#eef2ff",
  indigo100: "#e0e7ff",
  indigoBorder: "#c7d2fe",
  slate50: "#f8fafc",
  slate200: "#e2e8f0",
  slate400: "#94a3b8",
  slate500: "#64748b",
  slate600: "#475569",
  slate700: "#334155",
  slate800: "#1e293b",
  slate900: "#0f172a",
  greenBadgeBg: "#d1fae5",
  greenBadgeText: "#065f46",
  blueBadgeBg: "#dbeafe",
  blueBadgeText: "#1d4ed8",
  purplePillBg: "#ede9fe",
  purplePillText: "#5b21b6",
  red50: "#fef2f2",
  red600: "#dc2626",
  red700: "#b91c1c",
  white: "#ffffff",
};

const BAR_COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"];

const STAGE_STATUS: Record<string, { label: string; bg: string; text: string }> = {
  approval_pending: { label: "Pending Review", bg: "#fef3c7", text: "#b45309" },
  approved: { label: "Approved", bg: "#d1fae5", text: "#065f46" },
  not_approved: { label: "Not Approved", bg: "#fee2e2", text: "#b91c1c" },
  completed: { label: "Completed", bg: "#d1fae5", text: "#065f46" },
  Shortlisted: { label: "Shortlisted", bg: "#dbeafe", text: "#1d4ed8" },
  Rejected: { label: "Rejected", bg: "#fee2e2", text: "#b91c1c" },
  "Under Review": { label: "Under Review", bg: "#fef3c7", text: "#b45309" },
  "On Hold": { label: "On Hold", bg: "#fef3c7", text: "#b45309" },
  "Scheduled Final Interview": { label: "Final Interview Scheduled", bg: "#ede9fe", text: "#5b21b6" },
  Hired: { label: "Hired", bg: "#d1fae5", text: "#065f46" },
};

const escapeHtml = (v: any): string => {
  if (v === null || v === undefined) return "";
  return String(v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

const absUrl = (u: string): string => {
  const t = String(u || "").trim();
  if (!t) return "";
  if (/^https?:\/\//i.test(t)) return t;
  return `https://${t}`;
};

const clamp = (v: number, lo = 0, hi = 100) => Math.min(hi, Math.max(lo, v || 0));

const parseNum = (v: unknown) => {
  const n = parseFloat(String(v ?? "0"));
  return Number.isFinite(n) ? n : 0;
};

const fmtExperienceMonths = (monthsRaw: unknown): string | null => {
  if (monthsRaw == null) return null;
  const m = parseInt(String(monthsRaw), 10);
  if (Number.isNaN(m) || m <= 0) return null;
  const y = Math.floor(m / 12);
  const rem = m % 12;
  if (y === 0) return `${rem} mo`;
  if (rem === 0) return `${y} yr`;
  return `${y} yr ${rem} mo`;
};

const fmtCTC = (value: unknown): string | null => {
  if (value == null || value === "") return null;
  const num = parseFloat(String(value));
  if (Number.isNaN(num) || num <= 0) return null;
  return num.toLocaleString("en-IN");
};

const initialsFrom = (name: string): string =>
  String(name || "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("") || "?";

/** Same logic as `ApplicantPdfForm` / SkillsPanelV2 — Matched vs Relevant vs — */
const skillMatchLabel = (skill: any): "matched" | "relevant" | "none" => {
  const bd = skill?.breakdown || {};
  const matchType = String(bd.match_type || "").trim();
  const matchExplanation = String(bd.explanation || "").trim();
  const matchedEvidence = String(bd.matched_evidence || "").trim();
  const isMatched =
    Boolean(bd.is_match) || Boolean(matchType || matchExplanation || matchedEvidence);
  if (isMatched) {
    const matchInfo = matchExplanation || matchedEvidence || "";
    return matchInfo ? "matched" : "relevant";
  }
  const r = String(skill?.relevance || "").toLowerCase();
  if (r === "high") return "matched";
  if (r === "medium") return "relevant";
  return "none";
};

const skillReqMatchCellHtml = (skill: any): string => {
  const m = skillMatchLabel(skill);
  if (m === "matched") {
    return `<span style="display:inline-block;padding:2px 7px;border-radius:100px;font-size:11px;font-weight:600;background:${C.greenBadgeBg};color:${C.greenBadgeText};">Matched</span>`;
  }
  if (m === "relevant") {
    return `<span style="display:inline-block;padding:2px 7px;border-radius:100px;font-size:11px;font-weight:600;background:${C.blueBadgeBg};color:${C.blueBadgeText};">Relevant</span>`;
  }
  return `<span style="font-size:11px;color:${C.slate400};">—</span>`;
};

/** Timeline relevance — mirrors `RelevancePill` in ApplicantPdfForm */
const timelineRelevanceHtml = (relevance: unknown): string => {
  const r = String(relevance ?? "").toLowerCase();
  if (r === "high") {
    return `<span style="display:inline-block;padding:2px 7px;border-radius:100px;font-size:10px;font-weight:600;background:${C.purplePillBg};color:${C.purplePillText};">Highly Relevant</span>`;
  }
  if (r === "medium") {
    return `<span style="display:inline-block;padding:2px 7px;border-radius:100px;font-size:10px;font-weight:600;background:${C.blueBadgeBg};color:${C.blueBadgeText};">Relevant</span>`;
  }
  return "";
};

const parseScoreWeight = (application: any): Record<string, number> => {
  const raw = application?.resume?.score_weight ?? application?.job?.score_weight ?? null;
  if (raw == null) return {};
  if (typeof raw === "string") {
    try {
      const o = JSON.parse(raw);
      return o && typeof o === "object" ? o : {};
    } catch {
      return {};
    }
  }
  if (typeof raw === "object") return raw as Record<string, number>;
  return {};
};

const weightPercent = (sw: Record<string, number>, key: string): number => {
  const v = parseFloat(String(sw[key] ?? 0));
  if (!Number.isFinite(v)) return 0;
  return Math.round(v * 100);
};

const stagePillStyle = (statusText: string, raw?: string): { label: string; bg: string; text: string } => {
  const tryKeys = [raw, statusText].filter(Boolean) as string[];
  for (const k of tryKeys) {
    if (k && STAGE_STATUS[k]) return STAGE_STATUS[k];
  }
  const s = `${statusText} ${raw || ""}`.toLowerCase();
  if (s.includes("reject") || s.includes("not approved")) return STAGE_STATUS.not_approved;
  if (s.includes("shortlist") || s.includes("hired") || (s.includes("approved") && !s.includes("not")))
    return STAGE_STATUS.approved;
  if (s.includes("hold")) return STAGE_STATUS["On Hold"];
  if (s.includes("pending") || s.includes("review")) return STAGE_STATUS["Under Review"];
  return { label: escapeHtml(statusText), bg: "#f1f5f9", text: "#475569" };
};

const iconMail = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="${C.indigo600}" stroke-width="1.8" style="vertical-align:middle;flex-shrink:0;"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>`;
const iconPhone = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="${C.indigo600}" stroke-width="1.8" style="vertical-align:middle;flex-shrink:0;"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>`;
const iconLocation = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="${C.indigo600}" stroke-width="1.8" style="vertical-align:middle;flex-shrink:0;"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>`;
const iconBriefcase = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="${C.indigo600}" stroke-width="1.8" style="vertical-align:middle;"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.073a2.25 2.25 0 01-2.25 2.25h-12a2.25 2.25 0 01-2.25-2.25V6a2.25 2.25 0 012.25-2.25h4.5a2.25 2.25 0 012.25 2.25v.75"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 3.75h-6a.75.75 0 00-.75.75v.75h7.5v-.75A.75.75 0 0015 3.75z"/></svg>`;

const secHtml = (label: string) =>
  `<div style="display:flex;align-items:center;margin-top:14px;margin-bottom:8px;">
    <div style="width:5px;height:5px;border-radius:3px;background:${C.indigo600};margin-right:6px;flex-shrink:0;"></div>
    <span style="font-size:10px;font-weight:700;color:${C.indigo600};letter-spacing:0.9px;text-transform:uppercase;">${escapeHtml(label)}</span>
  </div>`;

const dividerHtml = `<div style="height:1px;background:${C.slate200};margin-top:12px;margin-bottom:4px;"></div>`;

const progressBarHtml = (value: number, color: string, track = C.slate200, h = 5) =>
  `<div style="height:${h}px;border-radius:3px;background:${track};overflow:hidden;flex:1;min-width:0;margin-right:8px;">
    <div style="height:100%;width:${clamp(value)}%;background:${color};border-radius:3px;"></div>
  </div>`;

const V3_ORDER = ["skills", "experience", "projects", "education", "certifications"];

const tieredOf = (components: any[], key: string) => {
  const comp = components.find((c) => c?.key === key);
  return Array.isArray(comp?.tiered_items) ? comp.tiered_items : [];
};

const workDescFromParts = (desc: string): string => {
  const parts = String(desc)
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length <= 1) {
    return `<div style="font-size:11px;color:${C.slate600};line-height:1.55;">${escapeHtml(String(desc))}</div>`;
  }
  return `<div style="font-size:11px;color:${C.slate600};line-height:1.55;">${parts
    .map((part) => {
      const end = /[.!?]$/.test(part) ? "" : ".";
      return `<p style="margin:0 0 4px 0;">${escapeHtml(part)}${end}</p>`;
    })
    .join("")}</div>`;
};

const timelineCardHtml = (opts: {
  title: string;
  sub?: string;
  meta?: string;
  relevance?: unknown;
  body?: string;
}): string => {
  const rel = timelineRelevanceHtml(opts.relevance);
  return `<div style="display:flex;margin-bottom:10px;align-items:flex-start;">
    <div style="width:10px;margin-right:10px;flex-shrink:0;padding-top:4px;">
      <div style="width:8px;height:8px;border-radius:4px;background:${C.indigo600};"></div>
    </div>
    <div style="flex:1;background:${C.slate50};border:1px solid ${C.slate200};border-radius:8px;padding:9px 11px;">
      <div style="display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-bottom:2px;">
        <span style="font-size:12px;font-weight:700;color:${C.slate800};">${escapeHtml(opts.title)}</span>
        ${rel}
      </div>
      ${opts.sub ? `<div style="font-size:11px;font-weight:600;color:${C.indigo600};margin-bottom:2px;">${escapeHtml(opts.sub)}</div>` : ""}
      ${opts.meta ? `<div style="font-size:10px;color:${C.slate500};margin-bottom:4px;">${escapeHtml(opts.meta)}</div>` : ""}
      ${opts.body || ""}
    </div>
  </div>`;
};

const footerBarHtml = (name: string) =>
  `<div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid ${C.slate200};padding-top:10px;margin-top:20px;">
    <span style="font-size:10px;color:${C.slate400};">CandidHR</span>
    <div style="text-align:right;">
      <div style="font-size:10px;color:${C.slate400};">${escapeHtml(name)}</div>
      <div style="font-size:10px;color:${C.slate400};margin-top:1px;">Applicant Profile</div>
    </div>
  </div>`;

export const buildApplicationPdfHtml = ({
  application,
  applicant,
  job,
  stages,
  aiSummary,
  scorecardV3: scorecardV3Param,
}: BuildApplicationPdfHtmlParams): string => {
  const scorecardV3 = scorecardV3Param ?? application?.scorecard_v3 ?? null;
  const rawComponents = Array.isArray(scorecardV3?.components) ? scorecardV3.components : [];
  const sortedComponents = [...rawComponents].sort((a, b) => {
    const ai = V3_ORDER.indexOf(a?.key);
    const bi = V3_ORDER.indexOf(b?.key);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });
  const hasScorecard = sortedComponents.length > 0 && scorecardV3 != null;

  const ctx = application?.application_context ?? {};
  const cand = application?.applicant ?? {};
  const linkedin = String(cand.linkedin || "").trim();
  const github = String(cand.github || "").trim();

  const monthsRaw =
    application?.resume?.relevant_experience_in_months ?? ctx?.relevant_experience_in_months;
  const months = typeof monthsRaw === "number" ? monthsRaw : parseNum(monthsRaw);
  const years = months > 0 ? Math.max(1, Math.round(months / 12)) : null;
  const experienceTagline =
    years != null
      ? `${escapeHtml(job.title)} ${years} year${years > 1 ? "s" : ""} Experience`
      : escapeHtml(job.title);

  const scoreWeightObj = parseScoreWeight(application);

  const overallScoreResume = String(application?.resume?.resume_score?.overall_score ?? "0.00");
  const overallScoreV3 =
    scorecardV3?.overall_score != null ? String(scorecardV3.overall_score) : overallScoreResume;
  const overallScore = hasScorecard ? overallScoreV3 : overallScoreResume;

  const scoreMetaResume = [
    { label: "Skills", value: application?.resume?.resume_score?.skills_score ?? "0", max: 3, wKey: "skills" },
    {
      label: "Work Experience",
      value: application?.resume?.resume_score?.work_exp_score ?? "0",
      max: 4,
      wKey: "work_experience",
    },
    { label: "Projects", value: application?.resume?.resume_score?.projects_score ?? "0", max: 1, wKey: "projects" },
    {
      label: "Education",
      value: application?.resume?.resume_score?.education_score ?? "0",
      max: 1,
      wKey: "education",
    },
    {
      label: "Certifications",
      value: application?.resume?.resume_score?.certifications_score ?? "0",
      max: 1,
      wKey: "certifications",
    },
  ];

  const scoreDataV3 = sortedComponents.map((c: any) => ({
    label: c?.label || String(c?.key || "Untitled").replace(/_/g, " "),
    score: parseNum(c?.score),
    max_score: parseNum(c?.max_score),
    weight_percent: parseNum(c?.weight_percent),
  }));

  const scoreRowsHtml = hasScorecard
    ? scoreDataV3
        .map((row, i) => {
          const pct =
            row.max_score > 0 ? clamp((row.score / row.max_score) * 100, 0, 100) : 0;
          const display =
            row.max_score > 0
              ? `${escapeHtml(String(row.score))}/${row.max_score}`
              : escapeHtml(String(row.score));
          const w = row.weight_percent > 0 ? `${Math.round(row.weight_percent)}%` : "";
          return `<div style="display:flex;align-items:center;margin-bottom:6px;">
          <div style="width:86px;flex-shrink:0;font-size:10px;color:${C.slate600};font-weight:500;">${escapeHtml(row.label)}</div>
          ${progressBarHtml(pct, BAR_COLORS[i % BAR_COLORS.length])}
          <div style="width:32px;flex-shrink:0;text-align:right;font-size:10px;font-weight:600;color:${C.slate800};">${display}</div>
          ${w ? `<div style="width:30px;flex-shrink:0;text-align:right;font-size:9px;color:${C.slate400};">${w}</div>` : `<div style="width:30px;"></div>`}
        </div>`;
        })
        .join("")
    : scoreMetaResume
        .map((row, i) => {
          const v = parseNum(row.value);
          const barPct = row.max > 0 ? Math.min(100, Math.round((v / row.max) * 100)) : 0;
          const display =
            row.max > 0 ? `${escapeHtml(String(row.value))}/${row.max}` : escapeHtml(String(row.value));
          const wPct = weightPercent(scoreWeightObj, row.wKey);
          return `<div style="display:flex;align-items:center;margin-bottom:6px;">
        <div style="width:86px;flex-shrink:0;font-size:10px;color:${C.slate600};font-weight:500;">${escapeHtml(row.label)}</div>
        ${progressBarHtml(barPct, BAR_COLORS[i % BAR_COLORS.length])}
        <div style="width:32px;flex-shrink:0;text-align:right;font-size:10px;font-weight:600;color:${C.slate800};">${display}</div>
        <div style="width:30px;flex-shrink:0;text-align:right;font-size:9px;color:${C.slate400};">${wPct}%</div>
      </div>`;
        })
        .join("");

  const statsItems: { label: string; value: string }[] = [];
  const expStr = fmtExperienceMonths(ctx?.relevant_experience_in_months ?? monthsRaw);
  const curCTC = fmtCTC(ctx?.current_ctc);
  const expCTC = fmtCTC(ctx?.expected_ctc);
  if (expStr) statsItems.push({ label: "Experience", value: expStr });
  if (curCTC) statsItems.push({ label: "Current CTC", value: curCTC });
  if (expCTC) statsItems.push({ label: "Expected CTC", value: expCTC });

  const statsChipsHtml =
    statsItems.length > 0
      ? `${secHtml("Candidate Info")}<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:4px;">${statsItems
          .map(
            (item) => `
        <div style="display:flex;flex-direction:column;align-items:flex-start;background:${C.slate50};border:1px solid ${C.slate200};border-radius:8px;padding:8px 12px;min-width:100px;">
          <span style="font-size:9px;font-weight:600;color:${C.slate400};text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px;">${escapeHtml(item.label)}</span>
          <span style="font-size:12px;font-weight:700;color:${C.slate800};">${escapeHtml(item.value)}</span>
        </div>`
          )
          .join("")}</div>`
      : "";

  const stagesHtml =
    stages.length > 0
      ? `${dividerHtml}${secHtml("Application Stages")}<div style="display:flex;flex-wrap:wrap;gap:7px;padding-bottom:4px;">${stages
          .map((s) => {
            const st = stagePillStyle(s.statusText, s.rawStatus);
            return `<div style="border-radius:8px;padding:7px 12px;margin-bottom:6px;background:${st.bg};">
            <div style="font-size:11px;font-weight:600;color:${st.text};line-height:1.35;">${escapeHtml(s.name)}</div>
            <div style="font-size:10px;margin-top:2px;opacity:0.85;color:${st.text};">${st.label}</div>
            <div style="font-size:9px;margin-top:1px;opacity:0.75;color:${st.text};">${escapeHtml(s.date)}</div>
          </div>`;
          })
          .join("")}</div>`
      : "";

  const v3ai = scorecardV3?.ai_summary;
  const insights = (aiSummary.keyInsights ?? []).filter((x) => String(x ?? "").trim());
  const summaryRaw = String(aiSummary.summary ?? "").trim();
  let fallbackHeadline = "AI-GENERATED SUMMARY";
  let fallbackOverview = "";
  if (!summaryRaw || summaryRaw === "No data found.") {
    fallbackOverview = "No summary available.";
  } else {
    const m = summaryRaw.match(/^(.+?[.!?])(?:\s+|$)([\s\S]*)$/);
    if (m && m[1]) {
      fallbackHeadline = m[1].trim().toUpperCase();
      fallbackOverview = (m[2] ?? "").trim();
    } else {
      fallbackHeadline = summaryRaw.toUpperCase();
    }
  }
  const fallbackStrengths =
    insights.length > 0
      ? insights
      : summaryRaw
          .split(/\n+/)
          .map((p) => p.trim())
          .filter(Boolean)
          .slice(1);

  const aiHeadline = v3ai?.headline != null && String(v3ai.headline).trim() !== "" ? String(v3ai.headline).trim() : fallbackHeadline;
  const aiOverview =
    v3ai?.overview != null && String(v3ai.overview).trim() !== ""
      ? String(v3ai.overview).trim()
      : fallbackOverview || summaryRaw;
  const aiStrengths: string[] = Array.isArray(v3ai?.strengths) && v3ai.strengths.length ? v3ai.strengths : fallbackStrengths;
  const aiGaps: string[] = Array.isArray(v3ai?.gaps) ? v3ai.gaps : [];
  const aiRedFlags: string[] =
    Array.isArray(v3ai?.red_flags) && v3ai.red_flags.length
      ? v3ai.red_flags
      : aiSummary.potentialRedFlags ?? [];
  const recRaw = v3ai?.recruiter_note ?? aiSummary.recruiterRecommendation;
  const hasRec =
    recRaw &&
    String(recRaw).trim() !== "" &&
    String(recRaw).trim() !== "No data found.";

  const calloutIndigo = (title: string, inner: string) =>
    `<div style="border-radius:8px;padding:10px 12px;margin-bottom:8px;background:${C.indigo50};border-left:3px solid ${C.indigo600};">
      <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.7px;color:${C.indigo700};margin-bottom:5px;">${escapeHtml(title)}</div>
      ${inner}
    </div>`;
  const calloutRed = (title: string, inner: string) =>
    `<div style="border-radius:8px;padding:10px 12px;margin-bottom:8px;background:${C.red50};border-left:3px solid #ef4444;">
      <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.7px;color:${C.red700};margin-bottom:5px;">${escapeHtml(title)}</div>
      ${inner}
    </div>`;

  const overviewBlock =
    aiOverview && aiOverview !== "No data found."
      ? calloutIndigo(
          aiHeadline,
          `<div style="font-size:11px;color:${C.slate700};line-height:1.65;">${escapeHtml(aiOverview)}</div>`
        )
      : "";

  const strengthsBlock =
    aiStrengths.length > 0
      ? calloutIndigo(
          "Strengths",
          aiStrengths.map((s) => `<div style="font-size:11px;color:${C.slate700};margin-bottom:2px;line-height:1.55;">• ${escapeHtml(s)}</div>`).join("")
        )
      : "";

  const gapsBlock =
    aiGaps.length > 0
      ? calloutRed(
          "Gaps",
          aiGaps.map((g) => `<div style="font-size:11px;color:${C.slate700};margin-bottom:2px;">• ${escapeHtml(g)}</div>`).join("")
        )
      : "";

  const redFlagsBlock =
    aiRedFlags.length > 0
      ? calloutRed(
          "Red Flags",
          aiRedFlags.map((f) => `<div style="font-size:11px;color:${C.slate700};margin-bottom:2px;">• ${escapeHtml(f)}</div>`).join("")
        )
      : "";

  const recruiterBlock = hasRec
    ? calloutIndigo(
        "Recruiter Note",
        `<div style="font-size:11px;color:${C.slate700};line-height:1.65;font-style:italic;">${escapeHtml(String(recRaw).trim())}</div>`
      )
    : "";

  const hasAiSection =
    !!overviewBlock ||
    !!strengthsBlock ||
    !!gapsBlock ||
    !!redFlagsBlock ||
    !!recruiterBlock;

  const skillsComp = rawComponents.find((c: any) => c?.key === "skills");
  const skillItems = Array.isArray(skillsComp?.tiered_items) ? skillsComp.tiered_items : [];
  const skillsTop10 = skillItems.slice(0, 10).map((item: any) => {
    const tier = String(item?.tier || "").toLowerCase();
    const isMatch = tier === "high";
    const reason = item?.reason || "";
    return {
      name: item?.name || "",
      relevance: tier || null,
      breakdown: {
        is_match: isMatch,
        match_type: tier || null,
        explanation: isMatch ? reason : null,
        matched_evidence: isMatch ? reason : null,
      },
    };
  });

  const skillsMatchedResume = Array.isArray(application?.resume?.skills_matched)
    ? application.resume.skills_matched
    : [];

  const skillRowsSource = hasScorecard && skillsTop10.length > 0 ? skillsTop10 : skillsMatchedResume;

  const skillIntelRows =
    skillRowsSource.length > 0
      ? skillRowsSource
          .map(
            (sk: any, i: number) => `
        <tr style="background:${i % 2 !== 0 ? C.slate50 : C.white};">
          <td style="padding:8px 10px;border-top:1px solid ${C.slate200};font-size:11px;color:${C.slate700};font-weight:600;">${escapeHtml(sk?.name ?? "—")}</td>
          <td style="padding:8px 10px;border-top:1px solid ${C.slate200};text-align:right;">${skillReqMatchCellHtml(sk)}</td>
        </tr>`
          )
          .join("")
      : `<tr><td colspan="2" style="padding:14px;text-align:center;font-size:11px;color:${C.slate400};">No skill match data</td></tr>`;

  const workExpV3 = tieredOf(rawComponents, "experience").map((item: any) => ({
    position: item?.title || "—",
    company: item?.company || "",
    description:
      Array.isArray(item?.responsibilities) && item.responsibilities.length > 0
        ? item.responsibilities.join("; ")
        : item?.reason || "",
    relevance: item?.tier || null,
    meta: [item?.start_date, item?.end_date].filter(Boolean).join(" – "),
  }));

  const workExperience = Array.isArray(application?.resume?.work_experience)
    ? application.resume.work_experience
    : [];

  const workList = hasScorecard && workExpV3.length > 0 ? workExpV3 : workExperience;

  const workTimelineHtml =
    workList.length > 0
      ? workList
          .map((w: any) => {
            const title = w?.position ?? "—";
            const sub = w?.company || "";
            const meta =
              w?.meta ||
              (w?.startDate || w?.endDate
                ? `${String(w?.startDate ?? "—")} – ${String(w?.endDate ?? "Present")}`
                : "");
            const body = w?.description ? workDescFromParts(String(w.description)) : "";
            return timelineCardHtml({ title, sub, meta, relevance: w?.relevance, body });
          })
          .join("")
      : `<div style="font-size:11px;color:${C.slate400};">No work experience found</div>`;

  const projectsV3 = tieredOf(rawComponents, "projects").map((item: any) => ({
    name: item?.name || "—",
    description: item?.description || item?.reason || "",
    relevance: item?.tier || null,
  }));

  const projectsResume = Array.isArray(application?.resume?.projects) ? application.resume.projects : [];

  const projectsList = hasScorecard && projectsV3.length > 0 ? projectsV3 : projectsResume;

  const projectsHtml =
    projectsList.length > 0
      ? projectsList
          .map((p: any) =>
            timelineCardHtml({
              title: p?.name ?? "—",
              relevance: p?.relevance,
              body: p?.description
                ? `<div style="font-size:11px;color:${C.slate600};line-height:1.55;">${escapeHtml(p.description)}</div>`
                : "",
            })
          )
          .join("")
      : `<div style="font-size:11px;color:${C.slate400};">No projects found</div>`;

  const eduV3 = tieredOf(rawComponents, "education").map((item: any) => ({
    school: item?.institution || item?.school || item?.degree || "—",
    degree: [item?.degree_type, item?.field_of_study].filter(Boolean).join(" in ") || item?.degree || "",
    relevance: item?.tier || null,
    meta: [item?.start_date, item?.end_date].filter(Boolean).join(" – "),
  }));

  const educationResume = Array.isArray(application?.resume?.education) ? application.resume.education : [];

  const eduList = hasScorecard && eduV3.length > 0 ? eduV3 : educationResume;

  const eduHtml =
    eduList.length > 0
      ? eduList
          .map((e: any) =>
            timelineCardHtml({
              title: e?.school ?? "—",
              sub: e?.degree || "",
              meta: e?.meta || [e?.startDate, e?.endDate].filter(Boolean).join(" – "),
              relevance: e?.relevance,
              body:
                e?.cgpa != null && e?.cgpa !== ""
                  ? `<div style="font-size:10px;color:${C.slate500};">CGPA: ${escapeHtml(String(e.cgpa))}</div>`
                  : "",
            })
          )
          .join("")
      : `<div style="font-size:11px;color:${C.slate400};">No education details found</div>`;

  const certsV3 = tieredOf(rawComponents, "certifications").map((item: any) => ({
    name: item?.name || "—",
  }));

  const certifications = Array.isArray(application?.resume?.certifications)
    ? application.resume.certifications
    : [];

  const certsList = hasScorecard && certsV3.length > 0 ? certsV3 : certifications;

  const certPillsHtml =
    certsList.length > 0
      ? `<div style="display:flex;flex-wrap:wrap;gap:6px;">${certsList
          .map(
            (c: any) =>
              `<span style="display:inline-block;background:${C.slate50};border:1px solid ${C.slate200};border-radius:100px;padding:4px 9px;font-size:10px;font-weight:500;color:${C.slate700};">${escapeHtml(c?.name ?? "—")}</span>`
          )
          .join("")}</div>`
      : `<div style="font-size:11px;color:${C.slate400};">No certifications found</div>`;

  const appliedLine = escapeHtml(
    String(applicant.appliedAt ?? "")
      .replace(/^Applied:\s*/i, "")
      .replace(/^on\s+/i, "")
      .trim()
  );

  const contactBits: string[] = [];
  if (applicant.email && applicant.email !== "N/A") {
    contactBits.push(
      `<span style="display:inline-flex;align-items:center;margin-right:14px;margin-bottom:3px;font-size:10px;color:${C.slate600};">${iconMail}<span style="margin-left:3px;">${escapeHtml(applicant.email)}</span></span>`
    );
  }
  if (applicant.contact && applicant.contact !== "N/A") {
    contactBits.push(
      `<span style="display:inline-flex;align-items:center;margin-right:14px;margin-bottom:3px;font-size:10px;color:${C.slate600};">${iconPhone}<span style="margin-left:3px;">${escapeHtml(applicant.contact)}</span></span>`
    );
  }
  if (applicant.location && applicant.location !== "N/A") {
    contactBits.push(
      `<span style="display:inline-flex;align-items:center;margin-right:14px;margin-bottom:3px;font-size:10px;color:${C.slate600};">${iconLocation}<span style="margin-left:3px;">${escapeHtml(applicant.location)}</span></span>`
    );
  }
  if (linkedin) {
    contactBits.push(
      `<a href="${escapeHtml(absUrl(linkedin))}" style="display:inline-flex;align-items:center;margin-right:14px;margin-bottom:3px;font-size:10px;color:${C.indigo600};text-decoration:none;"><span style="margin-left:3px;">LinkedIn</span></a>`
    );
  }
  if (github) {
    contactBits.push(
      `<a href="${escapeHtml(absUrl(github))}" style="display:inline-flex;align-items:center;margin-right:14px;margin-bottom:3px;font-size:10px;color:${C.indigo600};text-decoration:none;"><span style="margin-left:3px;">GitHub</span></a>`
    );
  }

  const profilePic = cand.profile_pic ? String(cand.profile_pic).trim() : "";
  const initials = initialsFrom(applicant.name);
  const avatarBlock = profilePic
    ? `<img src="${escapeHtml(profilePic)}" alt="" style="width:52px;height:52px;border-radius:26px;object-fit:cover;flex-shrink:0;margin-right:14px;"/>`
    : `<div style="width:52px;height:52px;border-radius:26px;background:${C.indigo100};margin-right:14px;flex-shrink:0;display:flex;align-items:center;justify-content:center;">
         <span style="font-size:17px;font-weight:700;color:${C.indigo700};">${escapeHtml(initials)}</span>
       </div>`;

  const hasResumeScoreBlock =
    hasScorecard ||
    application?.resume?.resume_score?.overall_score != null ||
    application?.resume?.resume_score != null;

  const scoreSectionHtml =
    hasResumeScoreBlock
      ? `${secHtml("Resume Score")}
    <div style="background:${C.slate50};border:1px solid ${C.slate200};border-radius:10px;padding:14px;display:flex;align-items:center;flex-wrap:wrap;gap:14px;margin-bottom:6px;">
      <div style="min-width:72px;text-align:center;padding-right:14px;margin-right:4px;border-right:1px solid ${C.slate200};">
        <div style="font-size:26px;font-weight:700;color:${C.indigo700};line-height:1;">${escapeHtml(overallScore)}</div>
        <div style="font-size:9px;font-weight:600;color:${C.slate500};text-transform:uppercase;letter-spacing:0.4px;margin-top:4px;">Out of 10</div>
      </div>
      <div style="flex:1;min-width:200px;">${scoreRowsHtml}</div>
    </div>`
      : "";

  const page2HasContent =
    skillRowsSource.length > 0 ||
    workList.length > 0 ||
    projectsList.length > 0 ||
    eduList.length > 0 ||
    certsList.length > 0;

  const bleed = "margin-left:-18px;margin-right:-18px;width:calc(100% + 36px);";

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet"/>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: ${C.white};
    color: ${C.slate900};
    line-height: 1.45;
    font-size: 13px;
    -webkit-text-size-adjust: 100%;
  }
  .wrap { max-width: 595px; margin: 0 auto; padding: 20px 18px 32px; }
  @media print {
    .pdf-page-break { page-break-before: always; break-before: page; }
  }
</style>
</head>
<body>
<div class="wrap">

  <div style="height:3px;background:${C.indigo600};${bleed}margin-top:-20px;"></div>

  <div style="background:${C.slate50};border-bottom:1px solid ${C.slate200};${bleed}padding:18px 24px 16px;margin-bottom:10px;">
    <div style="display:flex;align-items:flex-start;">
      ${avatarBlock}
      <div style="flex:1;min-width:0;">
        <div style="font-size:16px;font-weight:700;color:${C.slate900};margin-bottom:4px;">${escapeHtml(applicant.name)}</div>
        <div style="display:inline-flex;flex-direction:row;align-items:center;background:${C.indigo50};border:1px solid ${C.indigoBorder};border-radius:100px;padding:2px 8px;margin-bottom:7px;">
          ${iconBriefcase}<span style="font-size:10px;font-weight:600;color:${C.indigo700};margin-left:3px;">${experienceTagline}</span>
        </div>
        <div style="font-size:10px;color:${C.slate400};margin-bottom:7px;">Applied ${appliedLine}</div>
        <div style="display:flex;flex-wrap:wrap;">${contactBits.join("")}</div>
      </div>
    </div>
  </div>

  <div style="padding-top:4px;">
    ${scoreSectionHtml}
    ${statsChipsHtml}
    ${stagesHtml}
    ${
      hasAiSection
        ? `${dividerHtml}${secHtml("AI Summary")}
    ${overviewBlock}
    ${strengthsBlock}
    ${gapsBlock}
    ${redFlagsBlock}
    ${recruiterBlock}`
        : ""
    }
    ${footerBarHtml(applicant.name)}
  </div>

  ${
    page2HasContent
      ? `<div class="pdf-page-break"></div>
  <div style="height:3px;background:${C.indigo600};${bleed}margin-top:0;"></div>
  <div style="background:${C.slate50};border-bottom:1px solid ${C.slate200};${bleed}padding:12px 24px;display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
    <span style="font-size:13px;font-weight:700;color:${C.slate900};">${escapeHtml(applicant.name)}</span>
    <span style="font-size:10px;color:${C.slate400};">Applicant Profile</span>
  </div>
  <div style="padding-top:4px;">
    ${secHtml("Skill Intelligence")}
    <div style="border:1px solid ${C.slate200};border-radius:8px;overflow:hidden;margin-bottom:12px;">
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:${C.indigo50};">
            <th style="text-align:left;padding:7px 10px;font-size:9px;font-weight:700;color:${C.indigo700};text-transform:uppercase;letter-spacing:0.4px;">Skill</th>
            <th style="text-align:right;padding:7px 10px;font-size:9px;font-weight:700;color:${C.indigo700};text-transform:uppercase;letter-spacing:0.4px;">Req match</th>
          </tr>
        </thead>
        <tbody>${skillIntelRows}</tbody>
      </table>
    </div>
    ${workList.length > 0 ? `${secHtml("Work Experience")}${workTimelineHtml}` : ""}
    ${projectsList.length > 0 ? `${secHtml("Projects")}${projectsHtml}` : ""}
    ${eduList.length > 0 ? `${secHtml("Education")}${eduHtml}` : ""}
    ${certsList.length > 0 ? `${secHtml("Certifications")}<div style="margin-bottom:12px;">${certPillsHtml}</div>` : ""}
    ${footerBarHtml(applicant.name)}
  </div>`
      : ""
  }

</div>
<script>
  function reportHeight() {
    var h = document.documentElement.scrollHeight || document.body.scrollHeight;
    window.ReactNativeWebView && window.ReactNativeWebView.postMessage(String(h));
  }
  window.addEventListener("load", reportHeight);
  document.addEventListener("DOMContentLoaded", reportHeight);
  setTimeout(reportHeight, 300);
  setTimeout(reportHeight, 800);
</script>
</body>
</html>`;
};
