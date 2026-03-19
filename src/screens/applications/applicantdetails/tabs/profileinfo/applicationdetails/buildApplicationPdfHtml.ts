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

// ─── Colour tokens (mirrors C object in ApplicationDetailsCard.tsx) ──────────
const C = {
  brand:    "#4F46E5",
  brandBg:  "#EEF2FF",
  brandBdr: "#4338CA",
  redText:  "#DC2626",
  redBg:    "#FEF2F2",
  redBdr:   "#EF4444",
  green:    "#16A34A",
  greenBar: "#22C55E",
  blueBar:  "#3B82F6",
  amber:    "#F59E0B",
  amberBg:  "#FEF3C7",
  linkedin: "#0A66C2",
  gray900:  "#111827",
  gray700:  "#374151",
  gray600:  "#4B5563",
  gray500:  "#6B7280",
  gray400:  "#9CA3AF",
  gray200:  "#E5E7EB",
  gray100:  "#F3F4F6",
  gray50:   "#F9FAFB",
  white:    "#FFFFFF",
  verified: "#3B82F6",
  legendPurple: "#667EEA",
  legendBlue:   "#4299E1",
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

// ─── Stage colour (mirrors stageColor in ApplicationDetailsCard.tsx) ──────────
const getStageColor = (statusText: string): string => {
  switch (statusText) {
    case "Shortlisted":                return "#3B82F6";
    case "Rejected":                   return "#EF4444";
    case "Under Review":               return "#F59E0B";
    case "On Hold":                    return "#F59E0B";
    case "Hired":                      return "#A78BFA";
    case "Completed":                  return "#22C55E";
    case "Scheduled Final Interview":  return "#3B82F6";
    default:                           return "#6B7280";
  }
};

// ─── Sub-builders ─────────────────────────────────────────────────────────────

/** Blue circle with ✓ — mirrors VerifiedBadge component */
const verifiedBadge = () =>
  `<span style="
    display:inline-flex;align-items:center;justify-content:center;
    width:14px;height:14px;border-radius:50%;
    background:${C.verified};
    font-size:8px;color:#fff;font-weight:700;
    margin-left:5px;vertical-align:middle;flex-shrink:0;
    line-height:1;
  ">✓</span>`;

/** Horizontal progress bar */
const progressBar = (value: number, color: string, trackColor: string, height = 10) =>
  `<div style="
    height:${height}px;border-radius:999px;
    background:${trackColor};overflow:hidden;flex:1;
  ">
    <div style="
      height:100%;width:${clamp(value)}%;
      background:${color};border-radius:999px;
    "></div>
  </div>`;

// ─── Main export ──────────────────────────────────────────────────────────────
export const buildApplicationPdfHtml = ({
  application,
  applicant,
  job,
  stages,
  aiSummary,
}: BuildApplicationPdfHtmlParams): string => {

  // ── Stage pills ────────────────────────────────────────────────────────────
  const stagesHtml = stages
    .map((s) => `
      <div style="flex:1;padding:4px;">
        <div style="
          background:${getStageColor(s.statusText)};
          border-radius:8px;padding:8px 6px;text-align:center;
        ">
          <div style="color:#fff;font-size:9px;font-weight:700;line-height:1.4;">
            ${escapeHtml(s.name)}
          </div>
          <div style="color:rgba(255,255,255,0.82);font-size:8px;margin-top:3px;">
            ${escapeHtml(s.date)}
          </div>
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
    ? application.resume.skills_matched : [];

  const skillRows = skillsMatched.length > 0
    ? skillsMatched
        .map((sk: any) => `
          <tr>
            <td style="padding:9px 12px;border-top:1px solid ${C.gray200};font-size:10.5px;color:${C.gray900};text-align:center;">
              ${escapeHtml(sk?.name ?? "—")}
            </td>
            <td style="padding:9px 12px;border-top:1px solid ${C.gray200};font-size:10.5px;color:${C.gray900};text-align:center;">
              ${escapeHtml(sk?.relevance ?? "—")}
            </td>
            <td style="padding:9px 12px;border-top:1px solid ${C.gray200};font-size:10.5px;color:${C.gray900};text-align:center;">
              ${sk?.relevance_score != null ? `${escapeHtml(sk.relevance_score)}/10` : "N/A"}
            </td>
          </tr>`)
        .join("")
    : `<tr><td colspan="3" style="padding:10px;text-align:center;font-size:10px;color:${C.gray400};">No data available</td></tr>`;

  // ── Score breakdown ────────────────────────────────────────────────────────
  const overallScore = application?.resume?.resume_score?.overall_score ?? "0.00";

  const scoreRows = [
    {
      label: "Skill",
      value: application?.resume?.resume_score?.skills_score ?? "0.00",
      weight: (((application?.resume?.score_weight as any)?.skills ??
        (application?.job?.score_weight as any)?.skills ?? 0) as number) * 100,
    },
    {
      label: "Work Experience",
      value: application?.resume?.resume_score?.work_exp_score ?? "0.00",
      weight: (((application?.resume?.score_weight as any)?.work_experience ??
        (application?.job?.score_weight as any)?.work_experience ?? 0) as number) * 100,
    },
    {
      label: "Projects",
      value: application?.resume?.resume_score?.projects_score ?? "0.00",
      weight: (((application?.resume?.score_weight as any)?.projects ??
        (application?.job?.score_weight as any)?.projects ?? 0) as number) * 100,
    },
    {
      label: "Education",
      value: application?.resume?.resume_score?.education_score ?? "0.00",
      weight: (((application?.resume?.score_weight as any)?.education ??
        (application?.job?.score_weight as any)?.education ?? 0) as number) * 100,
    },
  ];

  const scoreBreakdownHtml = scoreRows
    .map((item) => `
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
        <div style="width:100px;font-size:9.5px;color:${C.gray500};font-weight:600;flex-shrink:0;">
          ${escapeHtml(item.label)}
        </div>
        ${progressBar(item.weight, C.amber, C.amberBg, 7)}
        <span style="font-size:13px;color:${C.amber};flex-shrink:0;">&#9734;</span>
        <div style="width:30px;font-size:9.5px;color:${C.gray700};text-align:right;flex-shrink:0;">
          ${escapeHtml(item.value)}
        </div>
      </div>`)
    .join("");

  // ── Work experience ────────────────────────────────────────────────────────
  const workExperience = Array.isArray(application?.resume?.work_experience)
    ? application.resume.work_experience : [];

  const workHtml = workExperience.length > 0
    ? workExperience
        .map((w: any) => `
          <div style="margin-bottom:12px;">
            <div style="display:flex;align-items:center;">
              <span style="font-size:11.5px;font-weight:700;color:${C.gray900};">
                ${escapeHtml(w?.position ?? "—")}
              </span>
              ${(w?.relevance === "high" || w?.relevance === "medium") ? verifiedBadge() : ""}
            </div>
            <div style="font-size:10px;color:${C.gray700};margin-top:2px;">
              ${escapeHtml(w?.company ?? "—")}
              ${(w?.startDate || w?.endDate)
                ? `&nbsp;&nbsp;<strong>|</strong>&nbsp;&nbsp;${escapeHtml(w?.startDate ?? "—")} - ${escapeHtml(w?.endDate ?? "Present")}`
                : ""}
            </div>
            ${w?.description
              ? `<div style="font-size:10px;color:${C.gray500};margin-top:4px;line-height:1.65;">${escapeHtml(w.description)}</div>`
              : ""}
          </div>`)
        .join("")
    : `<div style="font-size:10px;color:${C.gray400};">No work experience found</div>`;

  // ── Education ──────────────────────────────────────────────────────────────
  const education = Array.isArray(application?.resume?.education)
    ? application.resume.education : [];

  const eduHtml = education.length > 0
    ? education
        .map((e: any) => `
          <div style="margin-bottom:10px;">
            <div style="display:flex;align-items:center;">
              <span style="font-size:11.5px;font-weight:700;color:${C.gray900};">
                &#8226; ${escapeHtml(e?.school ?? "—")}
              </span>
              ${(e?.relevance === "high" || e?.relevance === "medium") ? verifiedBadge() : ""}
            </div>
            <div style="font-size:10px;color:${C.gray700};margin-top:2px;">
              ${escapeHtml(e?.degree ?? "—")}
              ${(e?.startDate || e?.endDate)
                ? `&nbsp;&nbsp;<strong>|</strong>&nbsp;&nbsp;${escapeHtml(e?.startDate ?? "—")} - ${escapeHtml(e?.endDate ?? "—")}`
                : ""}
            </div>
          </div>`)
        .join("")
    : `<div style="font-size:10px;color:${C.gray400};">No education details found</div>`;

  // ── Certifications ─────────────────────────────────────────────────────────
  const certifications = Array.isArray(application?.resume?.certifications)
    ? application.resume.certifications : [];

  const certHtml = certifications.length > 0
    ? certifications
        .map((c: any) => `
          <div style="display:flex;align-items:center;margin-bottom:7px;">
            <span style="font-size:10.5px;color:${C.gray700};">
              &#8226; ${escapeHtml(c?.name ?? "—")}
            </span>
            ${(c?.relevance === "high" || c?.relevance === "medium") ? verifiedBadge() : ""}
          </div>`)
        .join("")
    : `<div style="font-size:10px;color:${C.gray400};">No certifications found</div>`;

  // ── Salary ─────────────────────────────────────────────────────────────────
  const currentCTC = application?.current_ctc != null
    ? escapeHtml(application.current_ctc.toLocaleString()) : "N/A";

  const expectedCTC = application?.resume?.expected_ctc != null
    ? escapeHtml(application.resume.expected_ctc.toLocaleString())
    : application?.expected_ctc != null
    ? escapeHtml(application.expected_ctc.toLocaleString()) : "0";

  // ── Stage legend (mirrors STAGE_LEGEND array) ──────────────────────────────
  const stageLegendHtml = [
    ["#3B82F6", "Shortlisted"],
    ["#EF4444", "Rejected"],
    ["#F59E0B", "Under Review"],
    ["#A78BFA", "Hired"],
    ["#22C55E", "Completed"],
  ]
    .map(([color, label]) => `
      <div style="display:flex;align-items:center;gap:4px;">
        <div style="width:9px;height:9px;border-radius:50%;background:${color};flex-shrink:0;"></div>
        <span style="font-size:8px;color:${C.gray700};">${label}</span>
      </div>`)
    .join("");

  // ─────────────────────────────────────────────────────────────────────────
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: Arial, Helvetica, sans-serif;
    background: ${C.white};
    color: ${C.gray900};
    line-height: 1.5;
    font-size: 12px;
  }
</style>
</head>
<body>

<!-- ══════════════════════════════════════
     PAGE 1
══════════════════════════════════════ -->
<div style="padding:18px;max-width:800px;margin:0 auto;">

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
        <div style="display:flex;flex-wrap:wrap;gap:12px;margin-top:6px;">
          <span style="font-size:10px;color:${C.gray700};">&#9993; ${escapeHtml(applicant.email)}</span>
          <span style="font-size:10px;color:${C.gray700};">&#128222; ${escapeHtml(applicant.contact)}</span>
          <span style="font-size:10px;color:${C.gray700};">&#128205; ${escapeHtml(applicant.location)}</span>
        </div>
        <div style="margin-top:7px;">
          <span style="
            display:inline-block;
            background:${C.linkedin};color:#fff;
            font-size:9px;font-weight:700;
            padding:3px 9px;border-radius:4px;
          ">in</span>
        </div>
      </div>
    </div>
    <!-- job title -->
    <div style="font-size:13px;font-weight:700;color:${C.gray900};text-align:right;padding-left:10px;max-width:45%;">
      ${escapeHtml(job.title)}
    </div>
  </div>

  <!-- STAGES -->
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
    <div style="font-size:14px;font-weight:700;color:${C.brand};">Stages</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
      ${stageLegendHtml}
    </div>
  </div>
  <div style="
    display:flex;
    background:rgba(206,213,221,0.18);
    border-radius:8px;padding:4px;
    margin-bottom:14px;
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
    border-left:4px solid ${C.brand};background:${C.brandBg};
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
    <div style="
      flex:1;background:${C.gray50};
      border:1px solid ${C.gray200};border-radius:8px;padding:12px;
    ">
      <div style="font-size:11px;font-weight:700;color:${C.gray900};margin-bottom:6px;">Matched Skills</div>
      ${matchedHtml}
    </div>
    <div style="
      flex:1;background:${C.gray50};
      border:1px solid ${C.gray200};border-radius:8px;padding:12px;
    ">
      <div style="font-size:11px;font-weight:700;color:${C.gray900};margin-bottom:6px;">Missing Skills</div>
      ${missingHtml}
    </div>
  </div>

  <!-- Job Readiness Score -->
  <div style="margin-bottom:12px;">
    <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
      <span style="font-size:11px;font-weight:600;color:${C.gray700};">Job Readiness Score</span>
      <span style="font-size:11px;font-weight:700;color:${C.gray700};">${escapeHtml(String(aiSummary.jobReadinessScore))}%</span>
    </div>
    <div style="height:10px;border-radius:999px;background:${C.gray200};overflow:hidden;">
      <div style="height:100%;width:${clamp(aiSummary.jobReadinessScore)}%;background:${C.greenBar};border-radius:999px;"></div>
    </div>
  </div>

  <!-- Match Score -->
  <div style="margin-bottom:4px;">
    <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
      <span style="font-size:11px;font-weight:600;color:${C.gray700};">Match Score</span>
      <span style="font-size:11px;font-weight:700;color:${C.gray700};">${escapeHtml(String(aiSummary.matchScore))}%</span>
    </div>
    <div style="height:10px;border-radius:999px;background:${C.gray200};overflow:hidden;">
      <div style="height:100%;width:${clamp(aiSummary.matchScore)}%;background:${C.blueBar};border-radius:999px;"></div>
    </div>
  </div>

</div><!-- /page 1 -->


<!-- ══════════════════════════════════════
     PAGE 2 — Resume Details
══════════════════════════════════════ -->
<div style="
  padding:18px;max-width:800px;margin:0 auto;
  border-top:2px solid ${C.gray200};
">

  <div style="font-size:16px;font-weight:700;color:${C.brand};margin-bottom:14px;">Resume Details</div>

  <!-- QUICK INFO -->
  <div style="
    border:1px solid ${C.gray200};border-radius:10px;
    padding:14px;background:${C.white};margin-bottom:16px;
  ">
    <div style="font-size:11px;font-weight:700;color:${C.gray900};margin-bottom:10px;">Quick Info</div>
    <div style="display:flex;border:1px solid ${C.gray200};border-radius:8px;overflow:hidden;">
      <div style="flex:1;padding:11px;text-align:center;border-right:1px solid ${C.gray200};">
        <div style="font-size:9.5px;font-weight:700;color:${C.gray900};margin-bottom:3px;">Relevant Experience</div>
        <div style="font-size:10.5px;color:${C.gray500};">
          ${escapeHtml(String(application?.resume?.relevant_experience_in_months ?? "N/A"))} months
        </div>
      </div>
      <div style="flex:1;padding:11px;text-align:center;border-right:1px solid ${C.gray200};">
        <div style="font-size:9.5px;font-weight:700;color:${C.gray900};margin-bottom:3px;">Current Annual Salary</div>
        <div style="font-size:10.5px;color:${C.gray500};">${currentCTC}</div>
      </div>
      <div style="flex:1;padding:11px;text-align:center;">
        <div style="font-size:9.5px;font-weight:700;color:${C.gray900};margin-bottom:3px;">Expected Annual Salary</div>
        <div style="font-size:10.5px;color:${C.gray500};">${expectedCTC}</div>
      </div>
    </div>
  </div>

  <!-- SCORE -->
  <div style="font-size:11px;font-weight:700;color:${C.gray900};margin-bottom:10px;">Score</div>
  <div style="display:flex;align-items:flex-start;gap:16px;margin-bottom:16px;">
    <!-- overall -->
    <div style="min-width:75px;">
      <div style="display:flex;align-items:flex-start;gap:2px;">
        <span style="font-size:32px;font-weight:700;color:${C.gray900};line-height:1.1;">
          ${escapeHtml(overallScore)}
        </span>
        <span style="font-size:16px;color:${C.amber};margin-top:3px;">&#9733;</span>
      </div>
      <div style="font-size:9px;color:${C.gray400};margin-top:4px;">Overall Score</div>
    </div>
    <!-- breakdown -->
    <div style="flex:1;padding-top:4px;">${scoreBreakdownHtml}</div>
  </div>

  <!-- SKILLS TABLE -->
  <div style="font-size:11px;font-weight:700;color:${C.gray900};margin-bottom:8px;">Skills</div>
  <table style="
    width:100%;border-collapse:collapse;
    border:1px solid ${C.gray200};border-radius:8px;
    overflow:hidden;margin-bottom:10px;
  ">
    <thead>
      <tr style="background:${C.gray100};">
        <th style="padding:9px 12px;font-size:10px;font-weight:700;color:${C.gray700};text-align:center;width:34%;">
          Skill Name
        </th>
        <th style="padding:9px 12px;font-size:10px;font-weight:700;color:${C.gray700};text-align:center;width:33%;">
          Relevance
        </th>
        <th style="padding:9px 12px;font-size:10px;font-weight:700;color:${C.gray700};text-align:center;width:33%;">
          Matches with Job
        </th>
      </tr>
    </thead>
    <tbody>${skillRows}</tbody>
  </table>

  <!-- Relevance legend — dots matching legendChipDot style -->
  <div style="display:flex;justify-content:flex-end;gap:14px;align-items:center;margin-bottom:14px;">
    <div style="display:flex;align-items:center;gap:5px;">
      <div style="width:14px;height:14px;border-radius:50%;background:${C.legendPurple};"></div>
      <span style="font-size:10px;color:${C.gray700};">Highly Relevant</span>
    </div>
    <div style="display:flex;align-items:center;gap:5px;">
      <div style="width:14px;height:14px;border-radius:50%;background:${C.legendBlue};"></div>
      <span style="font-size:10px;color:${C.gray700};">Relevant</span>
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

</body>
</html>`;
};