import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ResumeScore from './resumescore';
import SkillScore from './skillscart';
import AiSummary from './aisummarycart';
import DetailedResume from './resumedetailcart';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import { selectApplicationsDetailLoading, selectApplicationStages, selectAssessmentLogs, selectMarkSessionReviewedLoading, selectParseResumeLoading, selectSelectedApplication, selectApplicationsLoading } from '../../../../../features/applications/selectors';
import { formatPercentage, getScoreStatus, getSkillStatus } from '../../../../../screens/applications/applicantdetails/helper';
import { colors } from '../../../../../theme/colors';
import Typography from '../../../../../components/atoms/typography';
import { shadowStyles } from '../../../../../theme/shadowcolor';
import StatusDropdown from '../../../../../components/organisms/dropdown/statusDropdown';
import Card from '../../../../../components/atoms/card';
import { formatMonDDYYYY } from '../../../../../utils/dateformatter';
import Button from '../../../../../components/atoms/button';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { markSessionAsReviewedRequestAction, parseResumeRequestAction } from '../../../../../features/applications/actions';
import { useAppDispatch } from '../../../../../hooks/useAppDispatch';
import Feather from 'react-native-vector-icons/Feather';
import { getApprovalStageStatusOptions } from '../stageStatusOptions';
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
}

export default function ResumeScreening() {
  const dispatch = useAppDispatch();
  const assessmentLogs = useAppSelector(selectAssessmentLogs);
  const stages = useAppSelector(selectApplicationStages);
  const application = useAppSelector(selectSelectedApplication);
  const loading = useAppSelector(selectApplicationsDetailLoading);
  const [selectedStageStatus, setSelectedStageStatus] = useState<string | null>(null);
  const loadingMarkReviewed = useAppSelector(
    selectMarkSessionReviewedLoading
  );
  const loadingParseResume = useAppSelector(selectParseResumeLoading);


  const isReviewed = assessmentLogs?.[0]?.session_status === 'reviewed';
  const matchedSkills =
    application?.resume?.skills_matched
      ?.map((item: any) => item?.matched_candidate_skill_name)
      ?.filter((val: any) => typeof val === "string" && val.length > 0) ?? [];

  const skills: SkillScoreItem[] =
    application?.resume?.skills?.map((skill: any) => ({
      title: skill?.name ?? "_",
      value: `${Number(skill?.relevance_score ?? 0) * 10}%`,
      matched: Boolean(skill?.breakdown?.is_match),
      proficiencyLevel: skill?.breakdown?.proficiency_level,
      proficiencyEvidence: skill?.breakdown?.proficiency_evidence,
    })) ?? [];

  const calculateOverallSkillScore = (skills: any[] = []) => {
    if (!skills.length) return 0;

    const total = skills.reduce(
      (sum, skill) => sum + Number(skill?.proficiency_score ?? 0),
      0
    );

    return Math.round((total / skills.length) * 10); // convert to %
  };

  const resumeStage = useMemo(
    () => stages?.find((s) => s.stage_type === 'resume_screening'),
    [stages]
  );
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
          <Typography variant="regularTxtxs" style={{ backgroundColor: colors?.brand['200'], borderTopEndRadius: 12, borderTopStartRadius: 12, padding: 5 }} numberOfLines={2}>
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
          </Typography>
          <View style={{ paddingHorizontal: 16, paddingBottom: 10 }}>
            <View style={styles.reviewRow}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Typography variant="regularTxtxs" style={{ paddingRight: 5 }}>
                    Details:
                  </Typography>
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
                {assessmentLogs.length > 0 &&
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
                      if (assessmentLogs?.[0]?.id && !isReviewed && !loadingMarkReviewed) {
                        dispatch(markSessionAsReviewedRequestAction(assessmentLogs?.[0]?.id));
                      }
                    }}
                    disabled={!assessmentLogs?.[0]?.id || isReviewed || loadingMarkReviewed}
                  >
                    {loadingMarkReviewed
                      ? 'Marking…'
                      : isReviewed
                        ? 'Review completed'
                        : 'Mark as Reviewed'}
                  </Button>
                }
                {assessmentLogs?.[0]?.action_taken_by?.name && (
                  <>
                    <Typography variant="regularTxtxs">
                      Reviewed by {assessmentLogs?.[0]?.action_taken_by?.name}
                    </Typography>
                  </>
                )}
                <Typography variant="regularTxtxs">
                  {formatMonDDYYYY(
                    assessmentLogs?.[0]?.action_taken_at,
                    "DD MMM YYYY HH:mm",
                    "IST"
                  )}
                </Typography>
              </View>
            </View>
          </View>
        </Card>
        <ResumeScore
          overall={formatPercentage(application?.resume?.resume_score?.overall_score ?? "0")}
          isloading={loading}
          status={getScoreStatus(application?.resume?.resume_score?.overall_score ?? "0")}
          details={[
            {
              title: "Skill",
              percentage: `${Number(application?.job?.score_weight?.skills ?? 0) * 100}%`,
              value: application?.resume?.resume_score?.skills_score ?? "_",
              completed:
                (Number(application?.resume?.resume_score?.skills_score ?? 0) / 3) * 100 >=
                Number(application?.job?.score_weight?.skills ?? 0) * 100,
            },
            {
              title: "Experience",
              percentage: `${Number(application?.job?.score_weight?.work_experience ?? 0) * 100}%`,
              value: application?.resume?.resume_score?.work_exp_score ?? "_",
              completed:
                (Number(application?.resume?.resume_score?.work_exp_score ?? 0) / 3) * 100 >=
                Number(application?.job?.score_weight?.work_experience ?? 0) * 100,
            },
            {
              title: "Projects",
              percentage: `${Number(application?.job?.score_weight?.projects ?? 0) * 100}%`,
              value: application?.resume?.resume_score?.projects_score ?? "_",
              completed:
                (Number(application?.resume?.resume_score?.projects_score ?? 0) / 2) * 100 >=
                Number(application?.job?.score_weight?.projects ?? 0) * 100,
            },
            {
              title: "Education",
              percentage: `${Number(application?.job?.score_weight?.education ?? 0) * 100}%`,
              value: application?.resume?.resume_score?.education_score ?? "_",
              completed:
                (Number(application?.resume?.resume_score?.education_score ?? 0) / 1) * 100 >=
                Number(application?.job?.score_weight?.education ?? 0) * 100,
            },
            {
              title: "Certification",
              percentage: `${Number(application?.job?.score_weight?.certifications ?? 0) * 100}%`,
              value: application?.resume?.resume_score?.certifications_score ?? "_",
              completed:
              (Number(application?.resume?.resume_score?.certifications_score ?? 0) / 1) * 100 >=
              Number(application?.job?.score_weight?.certifications ?? 0) * 100,        
            },
          ]}
        />

        <SkillScore
          title="Skills"
          isloading={loading}
          overall={String(calculateOverallSkillScore(
            application?.resume?.resume_json?.score_breakdown?.skills_detail?.relevant_skills_evaluation ?? []
          ))}
          status={String(getSkillStatus(calculateOverallSkillScore(
            application?.resume?.resume_json?.score_breakdown?.skills_detail?.relevant_skills_evaluation ?? []
          )))}
          data={skills}
        />

        <AiSummary
          isloading={loading}
          summary={application?.resume?.ai_summary_json?.summary ?? "_"}
          matchScore={application?.resume?.ai_summary_json?.match_score ?? 0}
          readinessScore={application?.resume?.ai_summary_json?.job_readiness_score ?? 0}
          matchedSkills={application?.resume?.resume_json?.skills ?? []}
          quickFacts={{
            lastRole: application?.resume?.ai_summary_json?.last_position_held ?? "_",
            lastCompany: application?.resume?.ai_summary_json?.last_company ?? "_",
            education: application?.resume?.ai_summary_json?.highest_education ?? "_",
            experience: application?.resume?.ai_summary_json?.relevant_experience ?? [],
            certifications: application?.resume?.ai_summary_json?.notable_certifications ?? [],
            applicantDetails: application?.resume?.ai_summary_json?.recruiter_recommendation ?? "_",
          }}
          risks={application?.resume?.ai_summary_json?.potential_red_flags ?? []}
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
