import { formatMonDDYYYY } from '../../../../utils/dateformatter';
import { buildApplicationPdfHtml } from '../../../../components/organisms/ApplicationDetails/buildApplicationPdfHtml';

/** Backend sometimes returns `ai_summary_json` as a stringified JSON object. */
export function parseResumeAiSummaryJson(raw: unknown): Record<string, any> {
  if (raw == null || raw === '') return {};
  if (typeof raw === 'string') {
    try {
      const o = JSON.parse(raw);
      return o && typeof o === 'object' ? (o as Record<string, any>) : {};
    } catch {
      return {};
    }
  }
  if (typeof raw === 'object') return raw as Record<string, any>;
  return {};
}

export const humanizeStatus = (status?: string | null) => {
  if (!status) return 'Under Review';
  return status
    .replace(/_/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
};

export const generatePreviewHtmlString = ({
  application,
  stages,
  resumeScreeningReport,
}: {
  application: any;
  stages: any[];
  resumeScreeningReport: any;
}): string => {
  if (!application) {
    throw new Error('Application data is not available yet');
  }

  const applicant = application?.applicant;
  const appliedAt = application?.applied_at ? formatMonDDYYYY(application.applied_at) : 'N/A';

  const stageCards = (stages ?? []).map((s) => ({
    id: s.id,
    name: s.stage_name,
    statusText: humanizeStatus(s.status || s.workflow_last_status),
    rawStatus: String(s.workflow_last_status || s.status || ''),
    date: formatMonDDYYYY(s.workflow_status_updated_at || s.updated_at || s.created_at),
  }));

  const ai: any = parseResumeAiSummaryJson(application?.resume?.ai_summary_json);
  const scorecardV3 = resumeScreeningReport?.attributes?.scorecard_v3 ?? null;

  return buildApplicationPdfHtml({
    application,
    applicant: {
      name: applicant?.name ?? applicant?.name ?? 'Candidate',
      appliedAt,
      email: applicant?.email ?? 'N/A',
      contact: String(applicant?.contact ?? 'N/A'),
      location: [applicant?.location?.city, applicant?.location?.state].filter(Boolean).join(', ') || 'N/A',
    },
    job: {
      title: application?.job?.title ?? 'N/A',
    },
    stages: stageCards,
    scorecardV3,
    aiSummary: {
      summary: ai?.summary ?? 'No data found.',
      potentialRedFlags: Array.isArray(ai?.potentialRedFlags)
        ? ai.potentialRedFlags
        : Array.isArray(ai?.potential_red_flags)
          ? ai.potential_red_flags
          : [],
      recruiterRecommendation: ai?.recruiterRecommendation ?? ai?.recruiter_recommendation ?? 'No data found.',
      matchedSkills: Array.isArray(ai?.matchedSkills)
        ? ai.matchedSkills
        : Array.isArray(ai?.matched_skills)
          ? ai.matched_skills
          : [],
      missingSkills: Array.isArray(ai?.missingSkills)
        ? ai.missingSkills
        : Array.isArray(ai?.missing_skills)
          ? ai.missing_skills
          : [],
      jobReadinessScore: Number(ai?.jobReadinessScore ?? ai?.job_readiness_score ?? 0),
      matchScore: Number(ai?.matchScore ?? ai?.match_score ?? 0),
      keyInsights: Array.isArray(ai?.key_insights) ? ai.key_insights : [],
    },
  });
};
