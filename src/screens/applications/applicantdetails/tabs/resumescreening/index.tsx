import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ResumeScore from './resumescore';
import SkillScore from './skillscart';
import AiSummary from './aisummarycart';
import DetailedResume from './resumedetailcart';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import {selectApplicationStages, selectAssessmentLogs, selectMarkSessionReviewedLoading, selectParseResumeLoading, selectResumeScreeningReport, selectSelectedApplication, selectApplicationsLoading, selectResumeScreeningReportLoading } from '../../../../../features/applications/selectors';

import { colors } from '../../../../../theme/colors';
import Typography from '../../../../../components/atoms/typography';
import StatusDropdown from '../../../../../components/organisms/dropdown/statusDropdown';
import Card from '../../../../../components/atoms/card';
import { formatMonDDYYYY } from '../../../../../utils/dateformatter';
import Button from '../../../../../components/atoms/button';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getResumeScreeningReportRequestAction, markSessionAsReviewedRequestAction, parseResumeRequestAction } from '../../../../../features/applications/actions';
import { useAppDispatch } from '../../../../../hooks/useAppDispatch';
import Feather from 'react-native-vector-icons/Feather';
import { getApprovalStageStatusOptions } from '../stageStatusOptions';
import { PERMISSIONS } from '../../../../../utils/permission.constants';
import Divider from '../../../../../components/atoms/divider';
import { useStyles } from './styles';

export default function ResumeScreening() {
  const styles = useStyles();
  const dispatch = useAppDispatch();
  const assessmentLogs = useAppSelector(selectAssessmentLogs);
  const stages = useAppSelector(selectApplicationStages);
  const application = useAppSelector(selectSelectedApplication);
  const resumeScreeningReport = useAppSelector(selectResumeScreeningReport);
  const loading = useAppSelector(selectResumeScreeningReportLoading);
  const [selectedStageStatus, setSelectedStageStatus] = useState<string | null>(null);
  const loadingMarkReviewed = useAppSelector(
    selectMarkSessionReviewedLoading
  );
  const components =
    resumeScreeningReport?.attributes?.scorecard_v3?.components ?? [];
  const skillComponent = components.find(c => c?.key === "skills");
  const loadingParseResume = useAppSelector(selectParseResumeLoading);

  const resumeStage = useMemo(
    () => stages?.find((s) => s.stage_type === 'resume_screening'),
    [stages]
  );

  const resumeSessionLog = useMemo(() => {
    if (!resumeStage?.id) return null;
    return (
      assessmentLogs?.find(
        (l: any) =>
          l?.stage_id === resumeStage.id && l?.content_type === 'resume_screening'
      ) ?? null
    );
  }, [assessmentLogs, resumeStage?.id]);

  /** Report API uses the session log `content_id` (same as `resume_id` when screening completed). */
  const resumeScreeningContentId = useMemo(() => {
    const fromLog = resumeSessionLog?.content_id?.trim();
    if (fromLog) return fromLog;
    return application?.resume_id?.trim() ?? '';
  }, [resumeSessionLog?.content_id, application?.resume_id]);

  useEffect(() => {
    if (!resumeScreeningContentId) return;
    dispatch(getResumeScreeningReportRequestAction(resumeScreeningContentId));
  }, [resumeScreeningContentId, dispatch]);

  const isReviewed = resumeSessionLog?.session_status === 'reviewed';

  const skills = useMemo(() => {
    return components
      .find(c => c?.key === "skills")
      ?.tiered_items
      ?.map((item) => ({
        title: item?.name ?? "_",
        matched: item?.tier === "high",
        tier: item?.tier, // 👈 important for sorting
        proficiencyEvidence: item?.reason ?? "",
      }))
      ?.sort((a, b) => {
        const order: Record<string, number> = {
          high: 1,
          medium: 2,
          low: 3,
        };
        return (order[a.tier ?? ""] ?? 4) - (order[b.tier ?? ""] ?? 4);
      }) ?? [];
  }, [components]);

  const scoreDetails = useMemo(() => {
    const SCORE_METRICS = [
      { key: "skills", title: "Skill" },
      { key: "experience", title: "Experience" },
      { key: "projects", title: "Projects" },
      { key: "education", title: "Education" },
      { key: "certifications", title: "Certification" },
    ];
    return SCORE_METRICS.map(({ key, title }) => {
      const comp = components.find(c => c?.key === key);
      return {
        title,
        percentage: `${Number(comp?.weight_percent ?? 0)}%`,
        value: `${comp?.score ?? 0}/${comp?.max_score ?? 0}`,
        completed: (comp?.raw_score_percent ?? 0) >= 70,
      };
    });
  }, [components]);

  const currentStageStatus = resumeStage?.status ?? null;
  const STAGE_STATUS_OPTIONS = useMemo(() => {
    return getApprovalStageStatusOptions(currentStageStatus);
  }, [currentStageStatus]);

  useEffect(() => {
    const stageStatus = stages?.find(s => s.stage_type === "resume_screening")?.status;
    if (stageStatus) {
      setSelectedStageStatus(stageStatus);
    }
  }, [stages]);

  const resumeScreeningStatus =
    stages?.find(stage => stage.stage_type === "resume_screening")?.status
      ?.replace("_", " ")
      ?.replace(/\b\w/g, c => c.toUpperCase());

  return (
    <Fragment>
      <View style={styles.container}>
        <StatusDropdown
          label="Stages"
          options={STAGE_STATUS_OPTIONS}
          labelKey="name"
          valueKey="id"
          setValue={selectedStageStatus ?? currentStageStatus}
          onSelect={(item) => setSelectedStageStatus(item?.id)}
          openModalOnSelect
          changeStatusModalProps={{
            applicantName: application?.candidate?.name,
            entityId: resumeStage?.id,
            currentStatus: currentStageStatus,
            newStatusOptions: STAGE_STATUS_OPTIONS,
            stageId: resumeStage?.id ?? undefined,
            applicationId: application?.id ?? undefined,
            contentType: "Resume Screening",
            onUpdateStatus: (newStatusId) => {
              setSelectedStageStatus(newStatusId);
            },
          }}
        />

        <Card style={{ gap: 4, flex: 1, width: '100%' }}>
          <Typography variant="regularTxtxs" style={{ backgroundColor: colors?.brand['200'], borderTopRightRadius: 12, borderTopLeftRadius: 12, borderTopStartRadius: 12, padding: 5 }} numberOfLines={2}>
            Stage was {resumeScreeningStatus} by{" "}
            {stages?.find(s => s.stage_type === "resume_screening")?.reviewed_by?.name ??
              "Workflow"}{" "}
            on{" "}
            {formatMonDDYYYY(
              stages?.find(s => s.stage_type === "resume_screening")?.reviewed_at ??
              stages?.find(s => s.stage_type === "resume_screening")
                ?.workflow_status_updated_at,
              "DD MMM YYYY HH:mm",
              "IST"
            )}
            <Divider />
          </Typography>
          <View style={{ paddingHorizontal: 16, paddingBottom: 10 }}>
            <View style={styles.reviewRow}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {/* <Typography variant="regularTxtxs" style={{ paddingRight: 5 }}>
                    Details:
                  </Typography> */}
                  <Button
                    variant="outline"
                    borderRadius={8}
                    borderWidth={1}
                    borderColor={colors.brand[200]}
                    buttonColor={colors.brand[25]}
                    textColor={colors.brand[700]}
                    startIcon={
                      <Feather
                        name="refresh-cw"
                        size={13}
                        color={colors.brand[700]}
                      />
                    }
                    size={25}
                    paddingHorizontal={5}
                    style={{ flex: 1 }}
                    textVariant="mediumTxtxs"
                    onPress={() => {
                      if (application?.id && !loadingParseResume) {
                        dispatch(parseResumeRequestAction(application.id));
                      }
                    }}
                    disabled={!application?.id || loadingParseResume}
                  >
                    {loadingParseResume ? 'Recomputing…' : 'Recompute'}
                  </Button>
                </View>
              </View>
              <View style={{ gap: 4, alignItems: 'flex-end' }}>
                {(PERMISSIONS.UPDATE_RESUME_SCREENING_STATUS) &&
                  <>
                    {!!resumeSessionLog?.id &&
                      <Button
                        variant="outline"
                        borderRadius={20}
                        borderWidth={1}
                        borderColor={isReviewed ? colors.success[200] : colors.brand[200]}
                        buttonColor={isReviewed ? colors.success[25] : colors.brand[25]}
                        textColor={isReviewed ? colors.success[700] : colors.brand[700]}
                        startIcon={
                          <Ionicons
                            name="checkmark"
                            size={14}
                            color={isReviewed ? colors.success[700] : colors.brand[700]}
                          />
                        }
                        size={30}
                        paddingHorizontal={10}
                        style={{ flex: 1 }}
                        textVariant="mediumTxtxs"
                        onPress={() => {
                          if (resumeSessionLog?.id && !isReviewed && !loadingMarkReviewed) {
                            dispatch(markSessionAsReviewedRequestAction(resumeSessionLog.id));
                          }
                        }}
                        disabled={!resumeSessionLog?.id || isReviewed || loadingMarkReviewed}
                      >
                        {loadingMarkReviewed
                          ? 'Marking…'
                          : isReviewed
                            ? 'Review completed'
                            : 'Mark as Reviewed'}
                      </Button>
                    }
                  </>
                }
                {resumeSessionLog?.action_taken_by?.name && (
                  <>
                    <Typography variant="regularTxtxs">
                      Reviewed by {resumeSessionLog?.action_taken_by?.name}
                    </Typography>
                  </>
                )}
                <Typography variant="regularTxtxs">
                  {formatMonDDYYYY(
                    resumeSessionLog?.action_taken_at,
                    "DD MMM YYYY HH:mm",
                    "IST"
                  )}
                </Typography>
              </View>
            </View>
          </View>
        </Card>
        <ResumeScore
          overall={`${resumeScreeningReport?.attributes?.scorecard_v3?.overall_score ?? "0"}/ ${resumeScreeningReport?.attributes?.scorecard?.scale_max ?? "10"}`}
          isloading={loading}
          details={scoreDetails}
        />

        <SkillScore
          title="Skills"
          isloading={loading}
          overall={String(Math.round(skillComponent?.raw_score_percent ?? 0))}
          data={skills}
        />

        <AiSummary
          isloading={loading}
          overview={
            resumeScreeningReport?.attributes?.scorecard_v3?.ai_summary?.overview ??
            ""
          }
          strengths={
            resumeScreeningReport?.attributes?.scorecard_v3?.ai_summary?.strengths ??
            []
          }
          gaps={
            resumeScreeningReport?.attributes?.scorecard_v3?.ai_summary?.gaps ?? []
          }
          redFlags={
            resumeScreeningReport?.attributes?.scorecard_v3?.ai_summary?.red_flags ??
            []
          }
          recruiterNote={
            resumeScreeningReport?.attributes?.scorecard_v3?.ai_summary
              ?.recruiter_note ?? ""
          }
        />
        <DetailedResume />
      </View>
    </Fragment>
  );
}
