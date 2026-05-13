import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ResumeScore from './resumescore';
import SkillScore from './skillscart';
import AiSummary from './aisummarycart';
import DetailedResume from './resumedetailcart';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import { selectApplicationsDetailLoading, selectApplicationStages, selectAssessmentLogs, selectMarkSessionReviewedLoading, selectParseResumeLoading, selectResumeScreeningReport, selectSelectedApplication, selectApplicationsLoading, selectResumeScreeningReportLoading } from '../../../../../features/applications/selectors';
import { formatPercentage, getScoreStatus, getSkillStatus } from '../../../../../screens/applications/applicantdetails/helper';
import { colors } from '../../../../../theme/colors';
import Typography from '../../../../../components/atoms/typography';
import { shadowStyles } from '../../../../../theme/shadowcolor';
import StatusDropdown from '../../../../../components/organisms/dropdown/statusDropdown';
import Card from '../../../../../components/atoms/card';
import { formatMonDDYYYY } from '../../../../../utils/dateformatter';
import Button from '../../../../../components/atoms/button';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getResumeScreeningReportRequestAction, markSessionAsReviewedRequestAction, parseResumeRequestAction } from '../../../../../features/applications/actions';
import { useAppDispatch } from '../../../../../hooks/useAppDispatch';
import Feather from 'react-native-vector-icons/Feather';
import { getApprovalStageStatusOptions } from '../stageStatusOptions';
import { usePermission } from '../../../../../hooks/usePermission';
import { PERMISSIONS } from '../../../../../utils/permission.constants';
import Divider from '../../../../../components/atoms/divider';
interface ResumeSkill {
  name: string;
  relevance_score: number | string;
  matched?: string;
}
interface ResumeMatchedSkill {
  name: string;
}
interface SkillScoreItem {
  title: string;
  value: string;
  matched: boolean;
  proficiencyLevel: string;
  proficiencyEvidence: string;
}

export default function ResumeScreening() {
  const { can } = usePermission();
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
  const matchedSkills =
    application?.resume?.skills_matched
      ?.map((item: any) => item?.matched_candidate_skill_name)
      ?.filter((val: any) => typeof val === "string" && val.length > 0) ?? [];

  const skills =
    components
      .find(c => c?.key === "skills")
      ?.tiered_items
      ?.map((item) => ({
        title: item?.name ?? "_",

        value:
          item?.tier === "high"
            ? "Matched"
            : item?.tier === "medium"
              ? "Relevant"
              : "_",

        matched: item?.tier === "high",

        tier: item?.tier, // 👈 important for sorting

        proficiencyLevel:
          item?.tier === "high"
            ? "High"
            : item?.tier === "medium"
              ? "Medium"
              : "Low",

        proficiencyEvidence: item?.reason ?? "",
      }))
      ?.sort((a, b) => {
        const order: Record<string, number> = {
          high: 1,
          medium: 2,
          low: 3,
        };

        return (order[a.tier] ?? 4) - (order[b.tier] ?? 4);
      }) ?? [];

  const calculateOverallSkillScore = (skills: any[] = []) => {
    if (!skills.length) return 0;

    const total = skills.reduce(
      (sum, skill) => sum + Number(skill?.proficiency_score ?? 0),
      0
    );

    return Math.round((total / skills.length) * 10); // convert to %
  };

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

  // const calculateSkillScore = (skills: any[] = []) => {
  //   if (!skills.length) return 0;

  //   const total = skills.reduce(
  //     (sum, skill) => sum + Number(skill?.relevance_score ?? 0),
  //     0
  //   );

  //   // relevance_score is 0–10 → convert to %
  //   return Math.round((total / skills.length) * 10);
  // };
  return (
    <Fragment>
      <View style={styles.container}>
        {/* <View style={styles.shortListedCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View
              style={{
                height: 8,
                width: 8,
                borderRadius: 30,
                backgroundColor: application?.resume?.approved_at
                  ? colors.success[500]
                  : application?.resume?.status_text === "Under Review"
                    ? colors.warning[500]
                    : colors.error[500],
              }}
            /> */}
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
          overall={formatPercentage(resumeScreeningReport?.attributes?.scorecard_v3?.overall_score ?? "0")}
          isloading={loading}
          status={getScoreStatus(resumeScreeningReport?.attributes?.scorecard_v3?.overall_score ?? "0")}
          details={[
            {
              title: "Skill",
              percentage: `${Number(
                components.find(c => c?.key === "skills")?.weight_percent ?? 0
              )}%`,
              value: `${components.find(c => c?.key === "skills")?.score ?? 0
                }/${components.find(c => c?.key === "skills")?.max_score ?? 0
                }`,
              completed:
                (components.find(c => c?.key === "skills")?.raw_score_percent ?? 0) >= 70,
            },

            {
              title: "Experience",
              percentage: `${Number(
                components.find(c => c?.key === "experience")?.weight_percent ?? 0
              )}%`,
              value: `${components.find(c => c?.key === "experience")?.score ?? 0
                }/${components.find(c => c?.key === "experience")?.max_score ?? 0
                }`,
              completed:
                (components.find(c => c?.key === "experience")?.raw_score_percent ?? 0) >= 70,
            },

            {
              title: "Projects",
              percentage: `${Number(
                components.find(c => c?.key === "projects")?.weight_percent ?? 0
              )}%`,
              value: `${components.find(c => c?.key === "projects")?.score ?? 0
                }/${components.find(c => c?.key === "projects")?.max_score ?? 0
                }`,
              completed:
                (components.find(c => c?.key === "projects")?.raw_score_percent ?? 0) >= 70,
            },

            {
              title: "Education",
              percentage: `${Number(
                components.find(c => c?.key === "education")?.weight_percent ?? 0
              )}%`,
              value: `${components.find(c => c?.key === "education")?.score ?? 0
                }/${components.find(c => c?.key === "education")?.max_score ?? 0
                }`,
              completed:
                (components.find(c => c?.key === "education")?.raw_score_percent ?? 0) >= 70,
            },

            {
              title: "Certification",
              percentage: `${Number(
                components.find(c => c?.key === "certifications")?.weight_percent ?? 0
              )}%`,
              value: `${components.find(c => c?.key === "certifications")?.score ?? 0
                }/${components.find(c => c?.key === "certifications")?.max_score ?? 0
                }`,
              completed:
                (components.find(c => c?.key === "certifications")?.raw_score_percent ?? 0) >= 70,
            },
          ]}
        />

        <SkillScore
          title="Skills"
          isloading={loading}
          overall={String(Math.round(skillComponent?.raw_score_percent ?? 0))}
          status={String(
            getSkillStatus(Math.round(skillComponent?.raw_score_percent ?? 0))
          )}
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
          headline={
            resumeScreeningReport?.attributes?.scorecard_v3?.ai_summary?.headline
          }
        />
        <DetailedResume />
      </View>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 16 },
  shortListedCard: {
    backgroundColor: colors.common.white,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: colors.gray[300],
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 8,
    // shadowColor: '#0A0D12',
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.05,
    // shadowRadius: 3,
    // elevation: 1,
    ...shadowStyles.shadow_xs
  },
  reviewRow: {
    flexDirection: "row",
    //justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },

});
