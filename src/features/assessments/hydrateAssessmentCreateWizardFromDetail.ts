import type {
  AssessmentBlueprintDetail,
  AssessmentCreateWizardBasicInfo,
  AssessmentCreateWizardProctoring,
  AssessmentCreateWizardSection,
  BlueprintSection,
} from './types';

function normalizeSkills(skills: unknown): string[] {
  if (!Array.isArray(skills)) {
    return [];
  }
  return skills
    .map((s) => (typeof s === 'string' ? s : (s as { name?: string })?.name))
    .filter((x): x is string => typeof x === 'string' && x.length > 0);
}

function durationMinsFromDetail(d: AssessmentBlueprintDetail): number {
  if (
    d.total_duration_in_minutes != null &&
    !Number.isNaN(Number(d.total_duration_in_minutes))
  ) {
    return Math.max(1, Math.round(Number(d.total_duration_in_minutes)));
  }
  if (d.default_duration != null && !Number.isNaN(Number(d.default_duration))) {
    return Math.max(1, Math.round(Number(d.default_duration) / 60));
  }
  return 60;
}

function mapProctoring(
  c: AssessmentBlueprintDetail['proctoring_configuration']
): AssessmentCreateWizardProctoring {
  return {
    fullscreen: c?.full_screen_mode ?? true,
    tabSwitch: c?.track_tab_switches ?? true,
    copyPaste: c?.disable_copy_paste ?? false,
    rightClick: c?.disable_right_click ?? false,
    singleScreen: c?.enforce_single_screen ?? false,
    webcam: c?.webcam_monitoring ?? true,
    eyeGaze: c?.eye_gaze_monitoring ?? false,
    autoSubmit: c?.auto_submit_on_violation ?? false,
    maxTabSwitch: c?.max_tab_switches ?? 3,
    maxFullscreenExit: c?.max_fullscreen_exits ?? 3,
  };
}

/**
 * Map GET /assessments/v2/blueprints/{id}/ into create-assessment wizard state.
 */
export function hydrateAssessmentCreateWizardFromDetail(
  detail: AssessmentBlueprintDetail
): {
  basicInfo: AssessmentCreateWizardBasicInfo;
  sections: AssessmentCreateWizardSection[];
  instructionsHtml: string;
  proctoringDraft: AssessmentCreateWizardProctoring;
} {
  const skills = normalizeSkills(detail.skills);
  const passing =
    detail.default_passing_score != null &&
    !Number.isNaN(Number(detail.default_passing_score))
      ? Math.min(100, Math.max(0, Math.round(Number(detail.default_passing_score))))
      : 50;

  const basicInfo: AssessmentCreateWizardBasicInfo = {
    id: detail.id,
    title: (detail.title ?? '').trim() || 'Untitled',
    description: detail.description ?? '',
    durationMins: durationMinsFromDetail(detail),
    passingScore: passing,
    skills: [...skills],
    is_published: Boolean(detail.is_published),
    is_archived: Boolean(detail.is_archived),
  };

  const rawSections: BlueprintSection[] = Array.isArray(detail.sections)
    ? [...detail.sections]
    : [];
  rawSections.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const sections: AssessmentCreateWizardSection[] = rawSections
    .map((s) => {
      const testId = s.test?.id?.trim() ?? '';
      if (!testId) {
        return null;
      }
      const toShowN = Math.max(
        1,
        Number(s.select_random ?? s.total_questions ?? 1) || 1
      );
      const reqRaw =
        s.required_questions != null ? Number(s.required_questions) : toShowN;
      const requiredN = Math.max(1, Math.min(toShowN, reqRaw || toShowN));
      const t = s.test;
      return {
        id: s.id,
        testId,
        toShow: toShowN,
        required: requiredN,
        shuffle: Boolean(s.shuffle),
        testTitle: t?.title,
        labelQuestions: t?.total_questions,
        labelMarks: t?.total_marks as number | undefined,
        labelDuration: t?.time_duration,
      } as AssessmentCreateWizardSection;
    })
    .filter((s): s is AssessmentCreateWizardSection => s != null);

  const instructionsHtml = detail.instructions_html?.trim() ? detail.instructions_html : '';
  const proctoringDraft = mapProctoring(detail.proctoring_configuration);

  return { basicInfo, sections, instructionsHtml, proctoringDraft };
}
