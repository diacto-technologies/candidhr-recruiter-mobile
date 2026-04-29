import type {
  AssessmentCreateWizardBasicInfo,
  AssessmentCreateWizardProctoring,
  AssessmentCreateWizardSection,
  UpdateBlueprintRequestPayload,
} from './types';

function stripHtmlToPlain(html: string): string {
  if (!html || !html.trim()) return '';
  return html
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildProctoringConfigurationFromWizard(
  proctoring: AssessmentCreateWizardProctoring
) {
  return {
    full_screen_mode: proctoring.fullscreen,
    track_tab_switches: proctoring.tabSwitch,
    disable_copy_paste: proctoring.copyPaste,
    disable_right_click: proctoring.rightClick,
    disable_printing: false,
    enforce_single_screen: proctoring.singleScreen,
    webcam_monitoring: proctoring.webcam,
    eye_gaze_monitoring: proctoring.eyeGaze && proctoring.webcam,
    device_restriction: false,
    allowed_ip_ranges: null,
    auto_submit_on_violation: proctoring.autoSubmit,
    max_tab_switches: proctoring.maxTabSwitch,
    max_fullscreen_exits: proctoring.maxFullscreenExit,
    record_video: false,
    record_audio: false,
    record_screen: false,
    room_scan_required: false,
    show_warnings: true,
    verify_id_card: false,
    detect_multiple_faces: false,
    detect_no_face: false,
    detect_mobile_phone: false,
    detect_voices: false,
  };
}

/**
 * Proctoring-only PATCH (rare; prefer {@link buildBlueprintPatchPayloadOmittingLockedDuration}).
 */
export function buildProctoringOnlyBlueprintPatchPayload(
  proctoring: AssessmentCreateWizardProctoring
): Record<string, unknown> {
  return {
    is_proctoring_enabled: true,
    proctoring_configuration: buildProctoringConfigurationFromWizard(proctoring),
  };
}

/**
 * Same as a full blueprint save, but omits fields the API **locks** on published or in-use
 * blueprints — including **`proctoring_configuration`**: the server does not allow changing
 * proctoring for those templates on this PATCH (error `proctoring_config: Cannot modify…`).
 * Omit = server keeps existing values. Draft / unlocked blueprints still use the full payload
 * with proctoring on the first PATCH attempt.
 */
export function buildBlueprintPatchPayloadOmittingLockedDuration(args: {
  basicInfo: AssessmentCreateWizardBasicInfo;
  sections: AssessmentCreateWizardSection[];
  instructionsHtml: string;
  proctoring: AssessmentCreateWizardProctoring;
}): Record<string, unknown> {
  const full = buildUpdateBlueprintPayload(args) as unknown as Record<string, unknown>;
  const {
    default_duration: _d,
    default_passing_score: _p,
    min_sections_required: _m,
    is_proctoring_enabled: _e,
    proctoring_configuration: _pc,
    ...rest
  } = full;
  return rest;
}

export function buildUpdateBlueprintPayload(args: {
  basicInfo: AssessmentCreateWizardBasicInfo;
  sections: AssessmentCreateWizardSection[];
  instructionsHtml: string;
  proctoring: AssessmentCreateWizardProctoring;
}): UpdateBlueprintRequestPayload {
  const { basicInfo, sections, instructionsHtml, proctoring } = args;
  const instructionsPlain = stripHtmlToPlain(instructionsHtml);

  const proctoring_configuration = buildProctoringConfigurationFromWizard(proctoring);

  const sortedSections = sections
    .filter((s) => s.testId)
    .map((s, index) => ({
      _uid: s.id,
      test_id: s.testId as string,
      select_random: s.toShow,
      required_questions: s.required,
      shuffle: s.shuffle,
      order: index + 1,
    }));

  return {
    title: basicInfo.title.trim(),
    description: basicInfo.description,
    default_duration: Math.max(60, basicInfo.durationMins * 60),
    default_passing_score: basicInfo.passingScore,
    instructions: instructionsPlain,
    instructions_html: instructionsHtml,
    is_proctoring_enabled: true,
    min_sections_required: 1,
    proctoring_configuration,
    skills: basicInfo.skills,
    sections: sortedSections,
  };
}

export { stripHtmlToPlain };
