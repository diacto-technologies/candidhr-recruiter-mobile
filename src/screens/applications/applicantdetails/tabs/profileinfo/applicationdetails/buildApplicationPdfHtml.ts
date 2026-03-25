import React from "react";
import { Image, View, ActivityIndicator, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

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
  };
};

// ─── Colour tokens ────────────────────────────────────────────────────────────
const C = {
  brand: "#6082b6",
  Indigo: "#4f46e5",
  brandBg: "#EEF2FF",
  brandBdr: "#4338CA",
  redText: "#EF4444",
  redBg: "#FEF2F2",
  redBdr: "#EF4444",
  green: "#22C55E",
  greenBar: "#22C55E",
  blueBar: "#3B82F6",
  amber: "#F59E0B",
  amberBg: "#E5E7EB",
  linkedin: "#0A66C2",
  gray900: "#111827",
  gray700: "#374151",
  gray600: "#4B5563",
  gray500: "#6B7280",
  gray400: "#9CA3AF",
  gray200: "#E5E7EB",
  gray100: "#F3F4F6",
  gray50: "#F9FAFB",
  white: "#FFFFFF",
  verified: "#3B82F6",
  legendPurple: "#667EEA",
  legendBlue: "#4299E1",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const escapeHtml = (v: any): string => {
  if (v === null || v === undefined) return "";
  return String(v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

const clamp = (v: number) => Math.max(0, Math.min(100, v || 0));

// ─── Stage colour ─────────────────────────────────────────────────────────────
const getStageColor = (statusText: string): string => {
  switch (statusText) {
    case "Shortlisted":               return "#3b82f6";
    case "Rejected":                  return "#e63946";
    case "Under Review":
    case "On Hold":                   return "#fcac0d";
    case "Scheduled Final Interview": return "#3b82f6";
    case "Hired":                     return "#acacff";
    case "Completed":                 return "#47b881";
    default:                          return "#8d99ae";
  }
};

// ─── Sub-builders ─────────────────────────────────────────────────────────────

const verifiedBadge = (color: string) =>
  `<svg width="14" height="14" viewBox="0 0 24 24"
    fill="${color}" stroke="#ffffff" stroke-width="1.5"
    stroke-linecap="round" stroke-linejoin="round"
    style="display:inline-block;vertical-align:middle;margin-left:5px;flex-shrink:0;">
    <path d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.745 3.745 0 0 1 3.296-1.043A3.745 3.745 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.745 3.745 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"/>
  </svg>`;

const relevanceBadgeHtml = (relevance: unknown): string => {
  const r = String(relevance ?? "").toLowerCase();
  if (r === "high")   return verifiedBadge("#667eea");
  if (r === "medium") return verifiedBadge("#4299e1");
  return "";
};

const progressBar = (value: number, color: string, trackColor: string, height = 10) =>
  `<div style="height:${height}px;border-radius:999px;background:${trackColor};overflow:hidden;flex:1;">
    <div style="height:100%;width:${clamp(value)}%;background:${color};border-radius:999px;"></div>
  </div>`;

// ─── Main HTML builder ────────────────────────────────────────────────────────
export const buildApplicationPdfHtml = ({
  application,
  applicant,
  job,
  stages,
  aiSummary,
}: BuildApplicationPdfHtmlParams): string => {

  // ── Resolve local asset URIs ───────────────────────────────────────────────
  const emailIcon = Image.resolveAssetSource(
    require("../../../../../../assets/images/email.png")
  )?.uri ?? "";
  const phoneIcon = Image.resolveAssetSource(
    require("../../../../../../assets/images/phone.jpg")
  )?.uri ?? "";
  const locationIcon = Image.resolveAssetSource(
    require("../../../../../../assets/images/location.png")
  )?.uri ?? "";

  // ── Stage pills ────────────────────────────────────────────────────────────
  const stagesHtml = stages
    .map((s) => `
      <div style="flex:1;padding:4px;">
        <div style="background:${getStageColor(s.statusText)};border-radius:8px;padding:8px 6px;text-align:center;">
          <div style="color:#fff;font-size:9px;font-weight:700;line-height:1.4;">${escapeHtml(s.name)}</div>
          <div style="color:rgba(255,255,255,0.82);font-size:8px;margin-top:3px;">${escapeHtml(s.date)}</div>
        </div>
      </div>`)
    .join("");

  // ── Red flags ──────────────────────────────────────────────────────────────
  const redFlagsHtml =
    aiSummary.potentialRedFlags?.length > 0
      ? aiSummary.potentialRedFlags
          .map((f) => `<div style="font-size:10.5px;color:${C.redText};margin-bottom:3px;">&#8226; ${escapeHtml(f)}</div>`)
          .join("")
      : `<div style="font-size:10.5px;color:${C.redText};">No data found.</div>`;

  // ── Matched / missing skills ───────────────────────────────────────────────
  const matchedHtml =
    aiSummary.matchedSkills?.length > 0
      ? aiSummary.matchedSkills
          .slice(0, 6)
          .map((s) => `<div style="font-size:10.5px;color:${C.green};margin-bottom:4px;">&#8226; ${escapeHtml(s)}</div>`)
          .join("")
      : `<div style="font-size:10px;color:${C.gray400};">No data found</div>`;

  const missingHtml =
    aiSummary.missingSkills?.length > 0
      ? aiSummary.missingSkills
          .slice(0, 6)
          .map((s) => `<div style="font-size:10.5px;color:${C.redBdr};margin-bottom:4px;">&#8226; ${escapeHtml(s)}</div>`)
          .join("")
      : `<div style="font-size:10px;color:${C.gray400};">No data found</div>`;

  // ── Skills table ───────────────────────────────────────────────────────────
  const skillsMatched = Array.isArray(application?.resume?.skills_matched)
    ? application.resume.skills_matched
    : [];

  const skillRows =
    skillsMatched.length > 0
      ? skillsMatched
          .map(
            (sk: any) => `
          <tr>
            <td style="padding:9px 12px;border-top:1px solid ${C.gray200};font-size:10.5px;color:${C.gray900};text-align:center;">${escapeHtml(sk?.name ?? "—")}</td>
            <td style="padding:9px 12px;border-top:1px solid ${C.gray200};font-size:10.5px;color:${C.gray900};text-align:center;">${escapeHtml(sk?.relevance ?? "—")}</td>
            <td style="padding:9px 12px;border-top:1px solid ${C.gray200};font-size:10.5px;color:${C.gray900};text-align:center;">${sk?.relevance_score != null ? `${escapeHtml(sk.relevance_score)}/10` : "N/A"}</td>
          </tr>`
          )
          .join("")
      : `<tr><td colspan="3" style="padding:10px;text-align:center;font-size:10px;color:${C.gray400};">No data available</td></tr>`;

  // ── Score breakdown ────────────────────────────────────────────────────────
  const overallScore = application?.resume?.resume_score?.overall_score ?? "0.00";

  const scoreRows = [
    {
      label: "Skill",
      value: application?.resume?.resume_score?.skills_score ?? "0.00",
      weight:
        (((application?.resume?.score_weight as any)?.skills ??
          (application?.job?.score_weight as any)?.skills ??
          0) as number) * 100,
    },
    {
      label: "Work Experience",
      value: application?.resume?.resume_score?.work_exp_score ?? "0.00",
      weight:
        (((application?.resume?.score_weight as any)?.work_experience ??
          (application?.job?.score_weight as any)?.work_experience ??
          0) as number) * 100,
    },
    {
      label: "Projects",
      value: application?.resume?.resume_score?.projects_score ?? "0.00",
      weight:
        (((application?.resume?.score_weight as any)?.projects ??
          (application?.job?.score_weight as any)?.projects ??
          0) as number) * 100,
    },
    {
      label: "Education",
      value: application?.resume?.resume_score?.education_score ?? "0.00",
      weight:
        (((application?.resume?.score_weight as any)?.education ??
          (application?.job?.score_weight as any)?.education ??
          0) as number) * 100,
    },
  ];

  const scoreBreakdownHtml = scoreRows
    .map(
      (item) => `
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
        <div style="width:100px;font-size:9.5px;color:${C.gray500};font-weight:600;flex-shrink:0;">${escapeHtml(item.label)}</div>
        ${progressBar(item.weight, C.amber, C.amberBg, 7)}
        <span style="font-size:13px;color:${C.gray400};flex-shrink:0;">&#9734;</span>
        <div style="width:30px;font-size:9.5px;color:${C.gray700};text-align:right;flex-shrink:0;">${escapeHtml(item.value)}</div>
      </div>`
    )
    .join("");

  // ── Work experience ────────────────────────────────────────────────────────
  const workExperience = Array.isArray(application?.resume?.work_experience)
    ? application.resume.work_experience
    : [];

  const workHtml =
    workExperience.length > 0
      ? workExperience
          .map(
            (w: any) => `
          <div style="margin-bottom:12px;">
            <div style="display:flex;align-items:center;">
              <span style="font-size:11.5px;font-weight:700;color:${C.gray900};">${escapeHtml(w?.position ?? "—")}</span>
              ${relevanceBadgeHtml(w?.relevance)}
            </div>
            <div style="font-size:10px;color:${C.gray700};margin-top:2px;">
              ${escapeHtml(w?.company ?? "—")}
              ${w?.startDate || w?.endDate ? `&nbsp;&nbsp;<strong>|</strong>&nbsp;&nbsp;${escapeHtml(w?.startDate ?? "—")} - ${escapeHtml(w?.endDate ?? "Present")}` : ""}
            </div>
            ${w?.description ? `<div style="font-size:10px;color:${C.gray500};margin-top:4px;line-height:1.65;">${escapeHtml(w.description)}</div>` : ""}
          </div>`
          )
          .join("")
      : `<div style="font-size:10px;color:${C.gray400};">No work experience found</div>`;

  // ── Education ──────────────────────────────────────────────────────────────
  const education = Array.isArray(application?.resume?.education)
    ? application.resume.education
    : [];

  const eduHtml =
    education.length > 0
      ? education
          .map(
            (e: any) => `
          <div style="margin-bottom:10px;">
            <div style="display:flex;align-items:center;">
              <span style="font-size:11.5px;font-weight:700;color:${C.gray900};">&#8226; ${escapeHtml(e?.school ?? "—")}</span>
              ${relevanceBadgeHtml(e?.relevance)}
            </div>
            <div style="font-size:10px;color:${C.gray700};margin-top:2px;">
              ${escapeHtml(e?.degree ?? "—")}
              ${e?.startDate || e?.endDate ? `&nbsp;&nbsp;<strong>|</strong>&nbsp;&nbsp;${escapeHtml(e?.startDate ?? "—")} - ${escapeHtml(e?.endDate ?? "—")}` : ""}
            </div>
          </div>`
          )
          .join("")
      : `<div style="font-size:10px;color:${C.gray400};">No education details found</div>`;

  // ── Certifications ─────────────────────────────────────────────────────────
  const certifications = Array.isArray(application?.resume?.certifications)
    ? application.resume.certifications
    : [];

  const certHtml =
    certifications.length > 0
      ? certifications
          .map(
            (c: any) => `
          <div style="display:flex;align-items:center;margin-bottom:7px;">
            <span style="font-size:10.5px;color:${C.gray700};">&#8226; ${escapeHtml(c?.name ?? "—")}</span>
            ${relevanceBadgeHtml(c?.relevance)}
          </div>`
          )
          .join("")
      : `<div style="font-size:10px;color:${C.gray400};">No certifications found</div>`;

  // ── Salary ─────────────────────────────────────────────────────────────────
  const currentCTC =
    application?.current_ctc != null
      ? escapeHtml(application.current_ctc.toLocaleString())
      : "N/A";

  const expectedCTC =
    application?.resume?.expected_ctc != null
      ? escapeHtml(application.resume.expected_ctc.toLocaleString())
      : application?.expected_ctc != null
      ? escapeHtml(application.expected_ctc.toLocaleString())
      : "0";

  // ── Stage legend ───────────────────────────────────────────────────────────
  const stageLegendHtml = [
    ["#3B82F6", "Shortlisted"],
    ["#EF4444", "Rejected"],
    ["#94A3B8", "Under Review"],
    ["#A78BFA", "Hired"],
    ["#22C55E", "Completed"],
  ]
    .map(
      ([color, label]) => `
      <div style="display:flex;align-items:center;gap:4px;">
        <div style="width:9px;height:9px;border-radius:50%;background:${color};flex-shrink:0;"></div>
        <span style="font-size:8px;color:${color};">${label}</span>
      </div>`
    )
    .join("");

  // ─────────────────────────────────────────────────────────────────────────
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<!-- ↓ ADDED: prevents WebView from zooming / mis-scaling on mobile -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
<style>
  * { box-sizing: border-box; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
    background: ${C.white};
    color: ${C.gray900};
    line-height: 1.5;
    font-size: 12px;
    -webkit-text-size-adjust: 100%;
  }
</style>
</head>
<body>

<!-- ══════════════════════════════════════
     PAGE 1
══════════════════════════════════════ -->
<div style="padding:18px;width:100%;max-width:100%;margin:0;">

  <!-- HEADER -->
  <div style="
    display:flex;justify-content:space-between;align-items:flex-start;
    padding-bottom:14px;border-bottom:1px solid ${C.gray200};margin-bottom:14px;
  ">
    <!-- left -->
    <div style="display:flex;align-items:flex-start;gap:12px;flex:1;">
      <!-- avatar -->
      <div style="
        width:48px;height:48px;border-radius:50%;
        background:${C.gray200};
        display:flex;align-items:center;justify-content:center;
        font-size:22px;flex-shrink:0;
      ">&#128100;</div>
      <!-- info -->
      <div>
        <div style="font-size:16px;font-weight:700;color:${C.gray900};">
          ${escapeHtml(applicant.name)}
        </div>
        <div style="font-size:10px;color:${C.gray500};margin-top:2px;">
          Applied on ${escapeHtml(applicant.appliedAt)}
        </div>
        <div style="display:flex;gap:12px;margin-top:6px;align-items:center;flex-wrap:wrap;">
          <span style="font-size:10px;color:${C.gray700};display:inline-flex;align-items:center;gap:4px;">
            <img src="${emailIcon}" style="width:12px;height:12px;display:block;" /> ${escapeHtml(applicant.email)}
          </span>
          <span style="font-size:10px;color:${C.gray700};display:inline-flex;align-items:center;gap:4px;">
            <img src="${phoneIcon}" style="width:12px;height:12px;display:block;" /> ${escapeHtml(applicant.contact)}
          </span>
          <span style="font-size:10px;color:${C.gray700};display:inline-flex;align-items:center;gap:4px;">
            <img src="${locationIcon}" style="width:12px;height:12px;display:block;" /> ${escapeHtml(applicant.location)}
          </span>
        </div>
      </div>
    </div>
    <!-- job title -->
    <div style="font-size:13px;font-weight:700;color:${C.gray900};text-align:right;padding-left:10px;max-width:45%;">
      ${escapeHtml(job.title)}
    </div>
  </div>

  <!-- STAGES -->
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;gap:6px;">
    <div style="font-size:14px;font-weight:700;color:${C.brand};">Stages</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
      ${stageLegendHtml}
    </div>
  </div>
  <!-- ↓ ADDED: overflow-x:auto so stage pills scroll horizontally on small screens -->
  <div style="
    display:flex;
    background:rgba(206, 213, 221, 0.18);
    border-radius:8px;padding:4px;
    margin-bottom:14px;
    overflow-x:auto;
    -webkit-overflow-scrolling:touch;
  ">
    ${stagesHtml}
  </div>

  <!-- PROFILE INFO heading -->
  <div style="font-size:14px;font-weight:700;color:${C.brand};margin-bottom:10px;">Profile Info</div>

  <!-- AI Summary -->
  <div style="background:${C.gray100};border-radius:8px;padding:12px;margin-bottom:12px;">
    <div style="font-size:11px;font-weight:700;color:${C.gray900};margin-bottom:5px;">AI Summary</div>
    <div style="font-size:10.5px;color:${C.gray600};line-height:1.65;">${escapeHtml(aiSummary.summary)}</div>
  </div>

  <!-- Red Flags -->
  <div style="
    border-left:4px solid ${C.redBdr};background:${C.redBg};
    padding:11px;margin-bottom:12px;
  ">
    <div style="font-size:11px;font-weight:700;color:${C.redText};margin-bottom:5px;">
      Potential Red Flags
    </div>
    ${redFlagsHtml}
  </div>

  <!-- Recruiter Recommendation -->
  <div style="
    border-left:4px solid ${C.brandBdr};background:${C.brandBg};
    padding:11px;margin-bottom:14px;
  ">
    <div style="font-size:11px;font-weight:700;color:${C.brandBdr};margin-bottom:5px;">
      Recruiter Recommendation
    </div>
    <div style="font-size:10.5px;color:${C.gray600};line-height:1.65;">
      ${escapeHtml(aiSummary.recruiterRecommendation)}
    </div>
  </div>

  <!-- Matched / Missing Skills -->
  <div style="display:flex;gap:10px;margin-bottom:14px;">
    <div style="flex:1;background:${C.gray100};border:none;border-radius:8px;padding:12px;">
      <div style="font-size:11px;font-weight:700;color:${C.gray900};margin-bottom:6px;">Matched Skills</div>
      ${matchedHtml}
    </div>
    <div style="flex:1;background:${C.gray100};border:none;border-radius:8px;padding:12px;">
      <div style="font-size:11px;font-weight:700;color:${C.gray900};margin-bottom:6px;">Missing Skills</div>
      ${missingHtml}
    </div>
  </div>

  <!-- Job Readiness Score -->
  <div style="flex:1;background:${C.gray100};border:none;border-radius:8px;padding:12px;margin-bottom:14px;">
    <div style="margin-bottom:6px;">
      <span style="font-size:11px;font-weight:600;color:${C.gray700};">Job Readiness Score</span>
    </div>
    <div style="display:flex;align-items:center;gap:12px;">
      <div style="flex:1;height:10px;border-radius:999px;background:${C.gray200};overflow:hidden;">
        <div style="height:100%;width:${clamp(aiSummary.jobReadinessScore)}%;background:${C.greenBar};border-radius:999px;"></div>
      </div>
      <span style="font-size:11px;font-weight:700;color:${C.gray700};min-width:32px;text-align:right;">
        ${escapeHtml(String(aiSummary.jobReadinessScore))}%
      </span>
    </div>
  </div>

  <!-- Match Score -->
  <div style="flex:1;background:${C.gray100};border:none;border-radius:8px;padding:12px;">
    <div style="margin-bottom:6px;">
      <span style="font-size:11px;font-weight:600;color:${C.gray700};">Match Score</span>
    </div>
    <div style="display:flex;align-items:center;gap:12px;">
      <div style="flex:1;height:10px;border-radius:999px;background:${C.gray200};overflow:hidden;">
        <div style="height:100%;width:${clamp(aiSummary.matchScore)}%;background:${C.blueBar};border-radius:999px;"></div>
      </div>
      <span style="font-size:11px;font-weight:700;color:${C.gray700};min-width:32px;text-align:right;">
        ${escapeHtml(String(aiSummary.matchScore))}%
      </span>
    </div>
  </div>

</div><!-- /page 1 -->


<!-- ══════════════════════════════════════
     PAGE 2 — Resume Details
══════════════════════════════════════ -->
<div style="padding:18px;width:100%;max-width:100%;margin:0;border-top:2px solid ${C.gray200};">

  <div style="font-size:16px;font-weight:700;color:${C.brand};margin-bottom:14px;">Resume Details</div>

  <!-- QUICK INFO -->
  <div style="border-radius:10px;padding:14px;margin-bottom:16px;background:${C.gray200};">
    <div style="font-size:11px;font-weight:700;color:${C.gray900};margin-bottom:10px;">Quick Info</div>
    <div style="display:flex;overflow:hidden;">
      <div style="flex:1;text-align:center;">
        <div style="font-size:9.5px;font-weight:700;color:${C.gray900};margin-bottom:3px;">Relevant Experience</div>
        <div style="font-size:10.5px;color:${C.gray500};">
          ${escapeHtml(String(application?.resume?.relevant_experience_in_months ?? "N/A"))} months
        </div>
      </div>
      <div style="flex:1;text-align:center;border-left:1px solid ${C.gray400};border-right:1px solid ${C.gray400};">
        <div style="font-size:9.5px;font-weight:700;color:${C.gray900};margin-bottom:3px;">Current Annual Salary</div>
        <div style="font-size:10.5px;color:${C.gray500};">${currentCTC}</div>
      </div>
      <div style="flex:1;text-align:center;">
        <div style="font-size:9.5px;font-weight:700;color:${C.gray900};margin-bottom:3px;">Expected Annual Salary</div>
        <div style="font-size:10.5px;color:${C.gray500};">${expectedCTC}</div>
      </div>
    </div>
  </div>

  <!-- SCORE -->
  <div style="font-size:11px;font-weight:700;color:${C.gray900};margin-bottom:10px;">Score</div>
  <div style="display:flex;align-items:flex-start;gap:16px;margin-bottom:16px;margin-left:5%;">
    <!-- overall -->
    <div style="min-width:75px;">
      <div style="display:flex;align-items:flex-start;gap:0px;">
        <span style="font-size:32px;font-weight:700;color:${C.gray900};line-height:1.1;">
          ${escapeHtml(overallScore)}
        </span>
        <span style="font-size:16px;color:${C.amber};line-height:1;margin-top:-10px;">&#9733;</span>
      </div>
      <div style="font-size:9px;color:${C.gray400};margin-top:4px;">Overall Score</div>
    </div>
    <div style="border:1px solid ${C.gray200};height:120px;margin-left:5%;"></div>
    <!-- breakdown -->
    <div style="flex:1;padding-top:4px;">${scoreBreakdownHtml}</div>
  </div>

  <!-- SKILLS TABLE -->
  <div style="font-size:14px;font-weight:700;color:${C.gray900};margin-bottom:8px;">Skills</div>
  <div style="border:1px solid ${C.gray200};border-radius:4px;overflow:hidden;margin-bottom:10px;">
    <table style="width:100%;border-collapse:collapse;">
      <thead>
        <tr style="background:${C.gray100};">
          <th style="padding:9px 12px;font-size:10px;font-weight:700;color:${C.gray700};text-align:center;width:34%;">Skill Name</th>
          <th style="padding:9px 12px;font-size:10px;font-weight:700;color:${C.gray700};text-align:center;width:33%;">Relevance</th>
          <th style="padding:9px 12px;font-size:10px;font-weight:700;color:${C.gray700};text-align:center;width:33%;">Matches with Job</th>
        </tr>
      </thead>
      <tbody>${skillRows}</tbody>
    </table>
  </div>

  <!-- Relevance legend -->
  <div style="display:flex;justify-content:flex-end;gap:18px;align-items:center;margin-bottom:14px;">
    <div style="display:flex;align-items:center;gap:8px;">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="${C.legendPurple}" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="display:block;">
        <path d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.745 3.745 0 0 1 3.296-1.043A3.745 3.745 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.745 3.745 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"/>
      </svg>
      <span style="font-size:12px;color:${C.gray700};font-weight:600;">Highly Relevant</span>
    </div>
    <div style="display:flex;align-items:center;gap:8px;">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="${C.legendBlue}" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="display:block;">
        <path d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.745 3.745 0 0 1 3.296-1.043A3.745 3.745 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.745 3.745 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"/>
      </svg>
      <span style="font-size:12px;color:${C.gray700};font-weight:600;">Relevant</span>
    </div>
  </div>

  <!-- WORK EXPERIENCE -->
  <div style="background:#F5F5F5;border-radius:8px;padding:14px;margin-bottom:12px;">
    <div style="font-size:11px;font-weight:700;color:${C.gray900};margin-bottom:10px;">Work Experience</div>
    ${workHtml}
  </div>

  <!-- EDUCATION -->
  <div style="background:#F5F5F5;border-radius:8px;padding:14px;margin-bottom:12px;">
    <div style="font-size:11px;font-weight:700;color:${C.gray900};margin-bottom:10px;">Education</div>
    ${eduHtml}
  </div>

  <!-- CERTIFICATIONS -->
  <div style="background:#F5F5F5;border-radius:8px;padding:14px;margin-bottom:6px;">
    <div style="font-size:11px;font-weight:700;color:${C.gray900};margin-bottom:10px;">Certifications</div>
    ${certHtml}
  </div>

</div><!-- /page 2 -->

<!-- ↓ ADDED: reports full content height to RN so WebView self-sizes correctly -->
<script>
  function reportHeight() {
    var h = document.documentElement.scrollHeight || document.body.scrollHeight;
    window.ReactNativeWebView && window.ReactNativeWebView.postMessage(String(h));
  }
  // fire on load and after any layout shift (images, fonts)
  window.addEventListener("load", reportHeight);
  document.addEventListener("DOMContentLoaded", reportHeight);
  // fallback poll for late-rendering content
  setTimeout(reportHeight, 300);
  setTimeout(reportHeight, 800);
</script>
</body>
</html>`;
};