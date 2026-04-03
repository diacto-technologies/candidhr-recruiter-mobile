import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useAppSelector } from "../../../../../../hooks/useAppSelector";
import {
  selectApplicationStages,
  selectSelectedApplication,
} from "../../../../../../features/applications/selectors";
import { formatMonDDYYYY } from "../../../../../../utils/dateformatter";

// ─── Colour tokens ────────────────────────────────────────────────────────────
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
};

// ─── Stage colour ─────────────────────────────────────────────────────────────
const stageColor = (status: string): string => {
  switch (status) {
    case "Shortlisted":               return "#3B82F6";
    case "Rejected":                  return "#EF4444";
    case "Under Review":              return "#F59E0B";
    case "On Hold":                   return "#F59E0B";
    case "Hired":                     return "#A78BFA";
    case "Completed":                 return "#22C55E";
    case "Scheduled Final Interview": return "#3B82F6";
    default:                          return "#6B7280";
  }
};

const STAGE_LEGEND = [
  { label: "Shortlisted",  color: "#3B82F6" },
  { label: "Rejected",     color: "#EF4444" },
  { label: "Under Review", color: "#F59E0B" },
  { label: "Hired",        color: "#A78BFA" },
  { label: "Completed",    color: "#22C55E" },
];

// ─── ProgressBar ─────────────────────────────────────────────────────────────
const ProgressBar = ({
  value,
  color,
  trackColor = C.gray200,
  height = 10,
}: {
  value: number;
  color: string;
  trackColor?: string;
  height?: number;
}) => (
  <View style={{ height, borderRadius: 999, backgroundColor: trackColor, overflow: "hidden", flex: 1 }}>
    <View
      style={{
        height,
        width: `${Math.max(0, Math.min(100, value || 0))}%`,
        backgroundColor: color,
        borderRadius: 999,
      }}
    />
  </View>
);

// ─── Verified Badge ───────────────────────────────────────────────────────────
const VerifiedBadge = () => (
  <View style={s.verifiedBadge}>
    <Text style={s.verifiedCheck}>✓</Text>
  </View>
);

// ─── Main component ───────────────────────────────────────────────────────────
const ApplicationDetailsCard = () => {
  const application = useAppSelector(selectSelectedApplication);
  const stagesStore = useAppSelector(selectApplicationStages) as any[] | null;

  // ── applicant / job ──────────────────────────────────────────────────────
  const applicant = {
    name:      application?.candidate?.name ?? "—",
    appliedAt: application?.applied_at
      ? formatMonDDYYYY(application.applied_at, "DD MMM YYYY")
      : "—",
    email:    application?.candidate?.email ?? "—",
    contact:  application?.candidate?.contact != null
      ? String(application.candidate.contact) : "—",
    location:
      [application?.candidate?.location?.city, application?.candidate?.location?.state]
        .filter(Boolean).join(", ") || "—",
  };
  const jobTitle = application?.job?.title ?? "—";

  // ── stages ────────────────────────────────────────────────────────────────
  const stages =
    stagesStore?.length
      ? stagesStore.map((st: any, i: number) => ({
          id:         String(st.id ?? i),
          name:       st.stage_name ?? st.name ?? st.stage_type ?? `Stage ${i + 1}`,
          statusText: st.status_text ?? st.status ?? "Under Review",
          date:       formatMonDDYYYY(
            st.workflow_status_updated_at ?? st.reviewed_at ?? st.updated_at ?? application?.applied_at,
            "DD MMM YYYY"
          ),
        }))
      : [];

  // ── AI summary ────────────────────────────────────────────────────────────
  const aiJson = application?.resume?.ai_summary_json ?? null;
  const ai = {
    summary:                 aiJson?.summary               ?? "No summary available.",
    potentialRedFlags:       aiJson?.potential_red_flags   ?? [],
    recruiterRecommendation: aiJson?.recruiter_recommendation ?? "No recommendation available.",
    matchedSkills:           aiJson?.matched_skills        ?? [],
    missingSkills:           aiJson?.missing_skills        ?? [],
    jobReadinessScore:       aiJson?.job_readiness_score   ?? 0,
    matchScore:              aiJson?.match_score           ?? 0,
  };

  // ── resume data ───────────────────────────────────────────────────────────
  const resume       = application?.resume ?? null;
  const overallScore = resume?.resume_score?.overall_score ?? "0.00";

  const scoreRows = [
    { label: "Skill",           value: resume?.resume_score?.skills_score    ?? "0.00", weight: ((resume?.score_weight?.skills          ?? application?.job?.score_weight?.skills          ?? 0) as number) * 100 },
    { label: "Work Experience", value: resume?.resume_score?.work_exp_score  ?? "0.00", weight: ((resume?.score_weight?.work_experience  ?? application?.job?.score_weight?.work_experience  ?? 0) as number) * 100 },
    { label: "Projects",        value: resume?.resume_score?.projects_score  ?? "0.00", weight: ((resume?.score_weight?.projects         ?? application?.job?.score_weight?.projects         ?? 0) as number) * 100 },
    { label: "Education",       value: resume?.resume_score?.education_score ?? "0.00", weight: ((resume?.score_weight?.education        ?? application?.job?.score_weight?.education        ?? 0) as number) * 100 },
  ];

  const skillsMatched  = Array.isArray(resume?.skills_matched)  ? resume!.skills_matched  : [];
  const workExperience = Array.isArray(resume?.work_experience) ? resume!.work_experience : [];
  const education      = Array.isArray(resume?.education)       ? resume!.education       : [];
  const certifications = Array.isArray(resume?.certifications)  ? resume!.certifications  : [];

  const currentCTC  = application?.current_ctc  != null ? String(application.current_ctc.toLocaleString())  : "N/A";
  const expectedCTC = resume?.expected_ctc != null ? String(resume.expected_ctc.toLocaleString())
    : application?.expected_ctc != null ? String(application.expected_ctc.toLocaleString()) : "0";

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: C.white }}>

      {/* ════════════════ PAGE 1 ════════════════ */}
      <View style={s.page}>

        {/* HEADER */}
        <View style={s.header}>
          <View style={s.headerLeft}>
            <View style={s.avatar}><Text style={{ fontSize: 22 }}>👤</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={s.candidateName}>{applicant.name}</Text>
              <Text style={s.appliedDate}>Applied on {applicant.appliedAt}</Text>
              <View style={s.contactRow}>
                <Text style={s.contactText}>✉  {applicant.email}</Text>
                <Text style={s.contactText}>📞  {applicant.contact}</Text>
                <Text style={s.contactText}>📍  {applicant.location}</Text>
              </View>
              <View style={s.linkedinBtn}><Text style={s.linkedinText}>in</Text></View>
            </View>
          </View>
          <Text style={s.jobTitle} numberOfLines={3}>{jobTitle}</Text>
        </View>

        {/* STAGES */}
        <View style={s.stagesHeaderRow}>
          <Text style={s.blueHeading}>Stages</Text>
          <View style={s.legendRow}>
            {STAGE_LEGEND.map((l) => (
              <View key={l.label} style={s.legendItem}>
                <View style={[s.legendDot, { backgroundColor: l.color }]} />
                <Text style={s.legendText}>{l.label}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={s.stagesContainer}>
          {stages.map((st) => (
            <View key={st.id} style={s.stagePillWrap}>
              <View style={[s.stagePill, { backgroundColor: stageColor(st.statusText) }]}>
                <Text style={s.stagePillText} numberOfLines={2}>{st.name}</Text>
                <Text style={s.stagePillDate}>{st.date}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* PROFILE INFO */}
        <Text style={[s.blueHeading, { marginBottom: 2 }]}>Profile Info</Text>

        {/* AI Summary */}
        <View style={s.aiSummaryBox}>
          <Text style={s.cardTitle}>AI Summary</Text>
          <Text style={s.cardText}>{ai.summary}</Text>
        </View>

        {/* Red Flags */}
        <View style={s.redFlagsBox}>
          <Text style={s.redFlagsTitle}>Potential Red Flags</Text>
          {ai.potentialRedFlags.length > 0
            ? ai.potentialRedFlags.map((f: string, i: number) => (
                <Text key={i} style={s.redFlagsText}>• {f}</Text>
              ))
            : <Text style={s.redFlagsText}>No data found.</Text>
          }
        </View>

        {/* Recruiter Recommendation */}
        <View style={s.recBox}>
          <Text style={s.recTitle}>Recruiter Recommendation</Text>
          <Text style={s.cardText}>{ai.recruiterRecommendation}</Text>
        </View>

        {/* Matched / Missing Skills */}
        <View style={s.skillsRow}>
          <View style={s.skillBox}>
            <Text style={s.cardTitle}>Matched Skills</Text>
            {ai.matchedSkills.length > 0
              ? ai.matchedSkills.slice(0, 6).map((sk: string, i: number) => (
                  <Text key={i} style={s.skillGreen}>• {sk}</Text>
                ))
              : <Text style={s.mutedText}>No data found</Text>
            }
          </View>
          <View style={s.skillBox}>
            <Text style={s.cardTitle}>Missing Skills</Text>
            {ai.missingSkills.length > 0
              ? ai.missingSkills.slice(0, 6).map((sk: string, i: number) => (
                  <Text key={i} style={s.skillRed}>• {sk}</Text>
                ))
              : <Text style={s.mutedText}>No data found</Text>
            }
          </View>
        </View>

        {/* Job Readiness Score */}
        <View style={s.scoreBlock}>
          <View style={s.scoreRow}>
            <Text style={s.scoreLabel}>Job Readiness Score</Text>
            <Text style={s.scoreValue}>{ai.jobReadinessScore}%</Text>
          </View>
          <ProgressBar value={ai.jobReadinessScore} color={C.greenBar} />
        </View>

        {/* Match Score */}
        <View style={s.scoreBlock}>
          <View style={s.scoreRow}>
            <Text style={s.scoreLabel}>Match Score</Text>
            <Text style={s.scoreValue}>{ai.matchScore}%</Text>
          </View>
          <ProgressBar value={ai.matchScore} color={C.blueBar} />
        </View>
      </View>

      {/* ════════════════ PAGE 2 — Resume Details ════════════════ */}
      <View style={[s.page, { borderTopWidth: 2, borderTopColor: C.gray200 }]}>

        <Text style={[s.blueHeading, { fontSize: 16, marginBottom: 4 }]}>Resume Details</Text>

        {/* QUICK INFO */}
        <View style={s.quickInfoCard}>
          <Text style={[s.cardTitle, { marginBottom: 10 }]}>Quick Info</Text>
          <View style={s.quickInfoInner}>
            {[
              { label: "Relevant Experience",  value: `${resume?.relevant_experience_in_months ?? "N/A"} months` },
              { label: "Current Annual Salary",  value: currentCTC },
              { label: "Expected Annual Salary", value: expectedCTC },
            ].map((item, i, arr) => (
              <View
                key={item.label}
                style={[s.quickInfoCell, i < arr.length - 1 && { borderRightWidth: 1, borderRightColor: C.gray200 }]}
              >
                <Text style={s.quickInfoLabel}>{item.label}</Text>
                <Text style={s.quickInfoValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* SCORE */}
        <Text style={[s.cardTitle, { marginBottom: 10 }]}>Score</Text>
        <View style={s.scoreSection}>
          <View style={s.overallScoreBlock}>
            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
              <Text style={s.overallScoreNum}>{overallScore}</Text>
              <Text style={s.starIcon}>★</Text>
            </View>
            <Text style={s.overallScoreSub}>Overall Score</Text>
          </View>
          <View style={{ flex: 1 }}>
            {scoreRows.map((item) => (
              <View key={item.label} style={s.breakdownRow}>
                <Text style={s.breakdownLabel}>{item.label}</Text>
                <ProgressBar value={item.weight} color={C.amber} trackColor="#FEF3C7" height={7} />
                <Text style={s.starSmall}>☆</Text>
                <Text style={s.breakdownValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* SKILLS TABLE */}
        <Text style={[s.cardTitle, { marginBottom: 8 }]}>Skills</Text>
        <View style={s.table}>
          <View style={[s.tableRow, { backgroundColor: C.gray100 }]}>
            <Text style={[s.tableHeaderCell, { flex: 2 }]}>Skill Name</Text>
            <Text style={[s.tableHeaderCell, { flex: 1.5 }]}>Relevance</Text>
            <Text style={[s.tableHeaderCell, { flex: 1.5 }]}>Matches with Job</Text>
          </View>
          {skillsMatched.length > 0
            ? skillsMatched.map((sk: any, i: number) => (
                <View key={i} style={[s.tableRow, { borderTopWidth: 1, borderTopColor: C.gray200 }]}>
                  <Text style={[s.tableCell, { flex: 2 }]}>{sk?.name ?? "—"}</Text>
                  <Text style={[s.tableCell, { flex: 1.5 }]}>{sk?.relevance ?? "—"}</Text>
                  <Text style={[s.tableCell, { flex: 1.5 }]}>
                    {sk?.relevance_score != null ? `${sk.relevance_score}/10` : "N/A"}
                  </Text>
                </View>
              ))
            : (
              <View style={[s.tableRow, { borderTopWidth: 1, borderTopColor: C.gray200 }]}>
                <Text style={[s.tableCell, { flex: 1, textAlign: "center", color: C.gray400 }]}>No data available</Text>
              </View>
            )
          }
        </View>

        {/* Relevance legend */}
        <View style={s.relevanceLegend}>
          <View style={s.legendChip}>
            <View style={[s.legendChipDot, { backgroundColor: "#667EEA" }]} />
            <Text style={s.legendChipText}>Highly Relevant</Text>
          </View>
          <View style={s.legendChip}>
            <View style={[s.legendChipDot, { backgroundColor: "#4299E1" }]} />
            <Text style={s.legendChipText}>Relevant</Text>
          </View>
        </View>

        {/* WORK EXPERIENCE */}
        <View style={s.grayBlock}>
          <Text style={[s.cardTitle, { marginBottom: 10 }]}>Work Experience</Text>
          {workExperience.length > 0
            ? workExperience.map((w: any, i: number) => (
                <View key={i} style={{ marginBottom: 12 }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={s.blockTitle}>{w?.position ?? "—"}</Text>
                    {(w?.relevance === "high" || w?.relevance === "medium") && <VerifiedBadge />}
                  </View>
                  <Text style={s.blockSubtitle}>
                    {w?.company ?? "—"}{(w?.startDate || w?.endDate) ? `  |  ${w?.startDate ?? "—"} - ${w?.endDate ?? "Present"}` : ""}
                  </Text>
                  {w?.description ? <Text style={s.blockDesc}>{w.description}</Text> : null}
                </View>
              ))
            : <Text style={s.mutedText}>No work experience found</Text>
          }
        </View>

        {/* EDUCATION */}
        <View style={s.grayBlock}>
          <Text style={[s.cardTitle, { marginBottom: 10 }]}>Education</Text>
          {education.length > 0
            ? education.map((e: any, i: number) => (
                <View key={i} style={{ marginBottom: 10 }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={s.blockTitle}>• {e?.school ?? "—"}</Text>
                    {(e?.relevance === "high" || e?.relevance === "medium") && <VerifiedBadge />}
                  </View>
                  <Text style={s.blockSubtitle}>
                    {e?.degree ?? "—"}{(e?.startDate || e?.endDate) ? `  |  ${e?.startDate ?? "—"} - ${e?.endDate ?? "—"}` : ""}
                  </Text>
                </View>
              ))
            : <Text style={s.mutedText}>No education details found</Text>
          }
        </View>

        {/* CERTIFICATIONS */}
        <View style={s.grayBlock}>
          <Text style={[s.cardTitle, { marginBottom: 10 }]}>Certifications</Text>
          {certifications.length > 0
            ? certifications.map((c: any, i: number) => (
                <View key={i} style={{ flexDirection: "row", alignItems: "center", marginBottom: 7 }}>
                  <Text style={s.blockSubtitle}>• {c?.name ?? "—"}</Text>
                  {(c?.relevance === "high" || c?.relevance === "medium") && <VerifiedBadge />}
                </View>
              ))
            : <Text style={s.mutedText}>No certifications found</Text>
          }
        </View>

      </View>
    </ScrollView>
  );
};

export default ApplicationDetailsCard;

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    backgroundColor: C.white,
    padding: 18,
    gap: 14,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: C.gray200,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: C.gray200,
    alignItems: "center",
    justifyContent: "center",
  },
  candidateName: { fontSize: 16, fontWeight: "700", color: C.gray900 },
  appliedDate:   { fontSize: 10, color: C.gray500, marginTop: 2 },
  contactRow:    { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 6 },
  contactText:   { fontSize: 10, color: C.gray700 },
  linkedinBtn:   {
    alignSelf: "flex-start",
    backgroundColor: C.linkedin,
    borderRadius: 4,
    paddingHorizontal: 9,
    paddingVertical: 3,
    marginTop: 7,
  },
  linkedinText: { color: C.white, fontSize: 9, fontWeight: "700" },
  jobTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: C.gray900,
    textAlign: "right",
    paddingLeft: 10,
    flexShrink: 1,
    maxWidth: "45%",
  },

  // Stages
  stagesHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  blueHeading: {
    fontSize: 14,
    fontWeight: "700",
    color: C.brand,
  },
  legendRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  legendDot:  { width: 9, height: 9, borderRadius: 5 },
  legendText: { fontSize: 8, color: C.gray700 },
  stagesContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(206,213,221,0.18)",
    borderRadius: 8,
    padding: 4,
  },
  stagePillWrap: { flex: 1, padding: 4 },
  stagePill: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: "center",
  },
  stagePillText: {
    color: C.white,
    fontSize: 9,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 13,
  },
  stagePillDate: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 8,
    textAlign: "center",
    marginTop: 3,
  },

  // Profile info
  aiSummaryBox: { backgroundColor: C.gray100, borderRadius: 8, padding: 12 },
  cardTitle: { fontSize: 11, fontWeight: "700", color: C.gray900, marginBottom: 5 },
  cardText:  { fontSize: 10.5, color: C.gray600, lineHeight: 16 },
  redFlagsBox: {
    borderLeftWidth: 4,
    borderLeftColor: C.redBdr,
    backgroundColor: C.redBg,
    padding: 11,
  },
  redFlagsTitle: { fontSize: 11, fontWeight: "700", color: C.redText, marginBottom: 5 },
  redFlagsText:  { fontSize: 10.5, color: C.redText, marginBottom: 3 },
  recBox: {
    borderLeftWidth: 4,
    borderLeftColor: C.brand,
    backgroundColor: C.brandBg,
    padding: 11,
  },
  recTitle: { fontSize: 11, fontWeight: "700", color: C.brandBdr, marginBottom: 5 },
  skillsRow: { flexDirection: "row", gap: 10 },
  skillBox: {
    flex: 1,
    backgroundColor: C.gray50,
    borderWidth: 1,
    borderColor: C.gray200,
    borderRadius: 8,
    padding: 12,
  },
  skillGreen: { fontSize: 10.5, color: C.green,  marginBottom: 4 },
  skillRed:   { fontSize: 10.5, color: C.redBdr, marginBottom: 4 },
  mutedText:  { fontSize: 10, color: C.gray400 },
  scoreBlock: { gap: 6 },
  scoreRow:   { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  scoreLabel: { fontSize: 11, fontWeight: "600", color: C.gray700 },
  scoreValue: { fontSize: 11, fontWeight: "700", color: C.gray700 },

  // Resume details
  quickInfoCard: {
    borderWidth: 1,
    borderColor: C.gray200,
    borderRadius: 10,
    padding: 14,
    backgroundColor: C.white,
  },
  quickInfoInner: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: C.gray200,
    borderRadius: 8,
    overflow: "hidden",
  },
  quickInfoCell: { flex: 1, padding: 11, alignItems: "center" },
  quickInfoLabel: {
    fontSize: 9.5,
    fontWeight: "700",
    color: C.gray900,
    marginBottom: 3,
    textAlign: "center",
  },
  quickInfoValue: { fontSize: 10.5, color: C.gray500, textAlign: "center" },

  scoreSection: { flexDirection: "row", alignItems: "flex-start", gap: 16, marginBottom: 14 },
  overallScoreBlock: { minWidth: 75 },
  overallScoreNum: { fontSize: 32, fontWeight: "700", color: C.gray900, lineHeight: 36 },
  starIcon:        { fontSize: 14, color: C.amber, marginTop: 3, marginLeft: 2 },
  overallScoreSub: { fontSize: 9, color: C.gray400, marginTop: 4 },
  breakdownRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  breakdownLabel: { width: 100, fontSize: 9.5, color: C.gray500, fontWeight: "600" },
  starSmall:      { fontSize: 11, color: C.amber },
  breakdownValue: { width: 30, fontSize: 9.5, color: C.gray700, textAlign: "right" },

  table: {
    borderWidth: 1,
    borderColor: C.gray200,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 10,
  },
  tableRow:        { flexDirection: "row" },
  tableHeaderCell: {
    padding: 9,
    fontSize: 10,
    fontWeight: "700",
    color: C.gray700,
    textAlign: "center",
  },
  tableCell: {
    padding: 9,
    fontSize: 10.5,
    color: C.gray900,
    textAlign: "center",
  },
  relevanceLegend: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 14,
    marginBottom: 10,
  },
  legendChip:     { flexDirection: "row", alignItems: "center", gap: 5 },
  legendChipDot:  { width: 14, height: 14, borderRadius: 7 },
  legendChipText: { fontSize: 10, color: C.gray700 },

  grayBlock: { backgroundColor: "#F5F5F5", borderRadius: 8, padding: 14 },
  blockTitle:    { fontSize: 11.5, fontWeight: "700", color: C.gray900 },
  blockSubtitle: { fontSize: 10, color: C.gray700, marginTop: 2 },
  blockDesc:     { fontSize: 10, color: C.gray500, marginTop: 4, lineHeight: 15 },

  verifiedBadge: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 5,
  },
  verifiedCheck: {
    fontSize: 8,
    color: C.white,
    fontWeight: "700",
    lineHeight: 12,
  },
});