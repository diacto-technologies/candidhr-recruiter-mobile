import React, { useEffect, useState, useMemo } from 'react';
import { View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useAppDispatch } from '../../../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import {
  getAssessmentOptionsReportRequestAction,
  exportAssessmentReportRequestAction,
  getPerformanceReportRequestAction,
  markSessionAsReviewedRequestAction,
} from '../../../../../features/applications/actions';
import {
  selectApplicationStages,
  selectAssessmentLogs,
  selectSelectedApplication,
  selectMarkSessionReviewedLoading,
  selectPerformanceReport,
  selectAssessmentOptions,
  selectAssessmentOptionsLoading,
  selectExportAssessmentReportLoading,
} from '../../../../../features/applications/selectors';
import type { RootState } from '../../../../../store';
import { formatMonDDYYYY } from '../../../../../utils/dateformatter';
import Dropdown from '../../../../../components/organisms/dropdown';
import Typography from '../../../../../components/atoms/typography';
import { arrowDown } from '../../../../../assets/svg/arrowdown';
import { colors } from '../../../../../theme/colors';
import { getStatusColor } from '../../../../../components/organisms/applicantlist/helper';
import { useStyles } from './styles';
import StatusDropdown from '../../../../../components/organisms/dropdown/statusDropdown';
import { Button } from '../../../../../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Card from '../../../../../components/atoms/card';
import { getApprovalStageStatusOptions } from '../stageStatusOptions';
import AssessmentsDetails from '../assessment/assessmentdetails';
import CustomTimeline from '../assessment/timelinecard';
import AssessmentReportsCard from './assessmentreportscard';
import AssignmentDropdown from '../../../../../components/organisms/dropdown/assignmentdropdown';
import AssessmentsDetailsV2 from '../assessment/assessmentdetails/assessmentsdetailsv2';
import ProctoringCard from '../assessment/assessmentdetails/components/ProctoringCard';
import TimeAnalyticsCard from '../assessment/assessmentdetails/components/TimeAnalyticsCard';
import RecommendationCard from '../assessment/assessmentdetails/components/RecommendationCard';
import { useStyles as useAssessmentDetailsStyles } from '../assessment/assessmentdetails/styles';
import type { StrengthsWeaknesses } from '../assessment/assessmentdetails/types';
import { showToastMessage } from '../../../../../utils/toast';

interface TimelineItem {
  title: string;
  date?: string;
  status: 'completed' | 'current';
}

const normalizeContentType = (v: unknown) =>
  String(v ?? '')
    .toLowerCase()
    .trim()
    .replace(/[\s-]+/g, '_');

type AssessmentV2Props = {
  sessionContentId: string | null;
  onSessionContentIdChange: (id: string | null) => void;
  selectedAssignmentId: string | null;
  onSelectedAssignmentIdChange: (id: string | null) => void;
};

const logLatestActivityMs = (log: {
  action_taken_at?: string | null;
  updated_at?: string | null;
  assigned_at?: string;
}) =>
  new Date(
    log.action_taken_at || log.updated_at || log.assigned_at || 0
  ).getTime();

const AssessmentV2 = ({
  sessionContentId,
  onSessionContentIdChange,
  selectedAssignmentId,
  onSelectedAssignmentIdChange,
}: AssessmentV2Props) => {
  const styles = useStyles();
  const assessmentDetailsStyles = useAssessmentDetailsStyles();
  const [selectedStageStatus, setSelectedStageStatus] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const application = useAppSelector(selectSelectedApplication);
  const applicationId = application?.id ?? null;
  const assessmentLogs = useAppSelector(selectAssessmentLogs);
  const assessmentOptionsAppId = useAppSelector(
    (state: RootState) => state.applications.assessmentOptionsApplicationId ?? null
  );
  const filteredV2Logs = useMemo(() => {
    const logs = assessmentLogs ?? [];
    return logs.filter(
      (l) => normalizeContentType(l?.content_type) === 'assessment_v2'
    );
  }, [assessmentLogs]);
  const performanceReport = useAppSelector(selectPerformanceReport);
  const stages = useAppSelector(selectApplicationStages);
  const loadingMarkReviewed = useAppSelector(selectMarkSessionReviewedLoading);
  const assessmentOptions = useAppSelector(selectAssessmentOptions);
  const loadingOptions = useAppSelector(selectAssessmentOptionsLoading);
  const loadingExportReport = useAppSelector(selectExportAssessmentReportLoading);

  const questions: any[] = performanceReport?.question_analysis?.questions ?? [];
  const hasQuestions = questions.some((q) => q?.question_type !== "coding");
  const hasCoding = questions.some((q) => q?.question_type === "coding");
  const shouldShowEmptyState = !performanceReport || (!hasQuestions && !hasCoding);

  const strengthsWeaknesses = (performanceReport as any)?.strengths_weaknesses as
    | StrengthsWeaknesses
    | undefined;

  useEffect(() => {
    const stageStatus = stages?.find(s => s.stage_type === "assessment_v2")?.status;
    if (stageStatus && stageStatus !== selectedStageStatus) {
      setSelectedStageStatus(stageStatus);
    }
  }, [stages]);

  useEffect(() => {
    if (!filteredV2Logs?.length) {
      onSessionContentIdChange(null);
      return;
    }

    const currentExists = filteredV2Logs.some(
      (item) => item.content_id === sessionContentId
    );

    if (!sessionContentId || !currentExists) {
      const latest = [...filteredV2Logs].sort(
        (a, b) => logLatestActivityMs(b) - logLatestActivityMs(a)
      )[0];
      onSessionContentIdChange(latest?.content_id ?? null);
    }
  }, [filteredV2Logs, sessionContentId, onSessionContentIdChange]);

  /** Load assignment list once per application (avoids clearing options on every tab visit). */
  useEffect(() => {
    if (!applicationId) return;
    if (
      assessmentOptionsAppId === applicationId &&
      assessmentOptions.length > 0
    ) {
      return;
    }
    dispatch(
      getAssessmentOptionsReportRequestAction({
        application_id: applicationId,
        page: 1,
      })
    );
  }, [applicationId, assessmentOptionsAppId, assessmentOptions.length, dispatch]);

  /** Keep selected assignment valid when options load; preserve parent state on tab return. */
  useEffect(() => {
    if (!assessmentOptions?.length) return;
    const exists = assessmentOptions.some((o) => o.id === selectedAssignmentId);
    if (!selectedAssignmentId || !exists) {
      onSelectedAssignmentIdChange(assessmentOptions[0]?.id ?? null);
    }
  }, [
    assessmentOptions,
    selectedAssignmentId,
    onSelectedAssignmentIdChange,
  ]);

  const reportMatchesAssignment = useMemo(() => {
    if (!selectedAssignmentId || !performanceReport) return false;
    return (
      performanceReport.assessment_info?.assignment_id === selectedAssignmentId
    );
  }, [selectedAssignmentId, performanceReport]);

  useEffect(() => {
    if (!selectedAssignmentId) return;
    if (reportMatchesAssignment) return;
    dispatch(getPerformanceReportRequestAction(selectedAssignmentId));
  }, [selectedAssignmentId, dispatch, reportMatchesAssignment]);



  //Ensure dropdown shows the currently active session.
  // useEffect(() => {
  //   if (!session && assessmentLogs?.length) {
  //     setSelectedSession(assessmentLogs[assessmentLogs.length - 1]?.id);
  //   }
  // }, [assessmentLogs, session]);

  // Map status_text to STATUS_OPTIONS id format

  const currentSessionLog = useMemo(() => {
    if (!sessionContentId || !filteredV2Logs?.length) return null;
    const matches = filteredV2Logs.filter(
      (item) => item.content_id === sessionContentId
    );
    if (!matches.length) return null;
    return [...matches].sort(
      (a, b) => logLatestActivityMs(b) - logLatestActivityMs(a)
    )[0];
  }, [filteredV2Logs, sessionContentId]);
  const isReviewed = currentSessionLog?.session_status === 'reviewed';

  const assessmentStage = useMemo(
    () => stages?.find((s) => s.stage_type === 'assessment_v2'),
    [stages]
  );
  const currentStageStatus = assessmentStage?.status ?? null;
  const STAGE_STATUS_OPTIONS = useMemo(() => {
    return getApprovalStageStatusOptions(currentStageStatus);
  }, [currentStageStatus]);

  const mapStatusTextToId = (statusText: string): string => {
    const statusMap: { [key: string]: string } = {
      'Started': 'started',
      'Assigned': 'assigned',
      'Under Review': 'under_review',
      'Completed': 'completed',
      'On Hold': 'on_hold',
      'Rejected': 'rejected',
      'Shortlisted': 'shortlisted',
      'Scheduled Final Interview': 'final_interview',
      'Hired': 'hired',
    };
    return statusMap[statusText] || '';
  };

  // Get current status id from selected session
  const currentStatusId = useMemo(() => {
    if (currentSessionLog?.status_text) {
      return mapStatusTextToId(currentSessionLog.status_text);
    }
    return '';
  }, [currentSessionLog]);

  const assessmentStatus =
    stages?.find(stage => stage.stage_type === "assessment_v2")?.status
      ?.replace("_", " ")
      ?.replace(/\b\w/g, c => c.toUpperCase());



  const timelineSteps = [
    {
      title: 'Assigned',
      date: formatMonDDYYYY(
        performanceReport?.assessment_info?.assigned_at,
        'DD MMM YYYY HH:mm',
        'IST'
      ),
      completed: !!performanceReport?.assessment_info?.assigned_at,
    },
    {
      title: 'Started',
      date: formatMonDDYYYY(
        performanceReport?.assessment_info?.started_at,
        'DD MMM YYYY HH:mm',
        'IST'
      ),
      completed: !!performanceReport?.assessment_info?.started_at,
    },
    {
      title: 'Completed',
      date: formatMonDDYYYY(
        performanceReport?.assessment_info?.completed_at,
        'DD MMM YYYY HH:mm',
        'IST'
      ),
      completed: !!performanceReport?.assessment_info?.completed_at,
    },
    {
      title: 'Valid Until',
      date: formatMonDDYYYY(
        performanceReport?.assessment_info?.valid_to,
        'DD MMM YYYY HH:mm',
        'IST'
      ),
      completed: !!performanceReport?.assessment_info?.valid_to,
    },
  ];

  const completedSteps = timelineSteps.filter(step => step.completed).length;
  const progress = Math.round(
    (completedSteps / timelineSteps.length) * 100
  );

  const timelineData: TimelineItem[] = timelineSteps.map(step => ({
    title: step.title,
    date: step.date,
    status: step.completed ? 'completed' : 'current',
  }));


  return (
    <View style={styles.container}>
      <StatusDropdown
        label="Stages"
        options={STAGE_STATUS_OPTIONS}
        labelKey="name"
        valueKey="id"
        setValue={
          assessmentStage?.status === STAGE_STATUS_OPTIONS?.[0]?.id
            ? null
            : selectedStageStatus
        }
        onSelect={(item) => setSelectedStageStatus(item?.id)}
        openModalOnSelect
        changeStatusModalProps={{
          applicantName: application?.candidate?.name,
          entityId: assessmentStage?.id,
          currentStatus: currentStageStatus,
          newStatusOptions: STAGE_STATUS_OPTIONS,
          stageId: assessmentStage?.id ?? undefined,
          applicationId: application?.id ?? undefined,
          contentType: "assessment_v2",
          onUpdateStatus: (newStatusId) => {
            setSelectedStageStatus(newStatusId);
          },
        }}
      />
      <View style={{ zIndex: 1000, }}>
        <Card style={{ gap: 4, width: "100%" }}>
          <Typography variant="regularTxtxs" style={{ backgroundColor: colors?.brand['200'], borderTopEndRadius: 12, borderTopStartRadius: 12, padding: 5 }} numberOfLines={2}>
            Stage was {assessmentStatus} by{" "}
            {stages?.find(s => s.stage_type === "assessment_v2")?.reviewed_by?.name ??
              "Workflow"}{" "}
            on{" "}
            {formatMonDDYYYY(
              stages?.find(s => s.stage_type === "assessment_v2")?.reviewed_at ??
              stages?.find(s => s.stage_type === "assessment_v2")
                ?.workflow_status_updated_at,
              "DD MMM YYYY HH:mm",
              "IST"
            )}
          </Typography>
          <View style={{ paddingHorizontal: 16, paddingVertical: 10 }}>
            <View style={styles.reviewRow}>
              <Typography variant="regularTxtxs" style={{ flex: 1 }}>
                {isReviewed ? (
                  currentSessionLog?.action_taken_by?.name ? (
                    <>
                      Reviewed by {currentSessionLog.action_taken_by.name} ·{" "}
                      {formatMonDDYYYY(
                        currentSessionLog.action_taken_at,
                        "DD MMM YYYY HH:mm",
                        "IST"
                      )}
                    </>
                  ) : currentSessionLog?.workflow_status_updated_at ? (
                    <>
                      Reviewed by Workflow ·{" "}
                      {formatMonDDYYYY(
                        currentSessionLog.workflow_status_updated_at,
                        "DD MMM YYYY HH:mm",
                        "IST"
                      )}
                    </>
                  ) : currentSessionLog?.updated_at ? (
                    <>
                      ·{" "}
                      {formatMonDDYYYY(
                        currentSessionLog.updated_at,
                        "DD MMM YYYY HH:mm",
                        "IST"
                      )}
                    </>
                  ) : null
                ) : null}
              </Typography>

              <Button
                variant="outline"
                borderRadius={20}
                borderWidth={1}
                borderColor={isReviewed ? colors.success[200] : colors.brand[200]}
                buttonColor={isReviewed ? colors.success[400] : colors.brand[25]}
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
                  if (currentSessionLog?.id && !isReviewed && !loadingMarkReviewed) {
                    dispatch(markSessionAsReviewedRequestAction(currentSessionLog.id));
                  }
                }}
                disabled={!currentSessionLog?.id || isReviewed || loadingMarkReviewed}
              >
                {loadingMarkReviewed ? 'Marking…' : isReviewed ? 'Review completed' : 'Mark as Reviewed'}
              </Button>
            </View>
          </View>
        </Card>
        {/* <View style={styles.shortListedCard}>
        <View style={styles.rowBetween}>
          <View style={styles.row}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(filteredV2Logs?.find(item => item.content_id === sessionContentId)?.status_text ?? "_") }]} />
            <Typography
              variant="mediumTxtmd"
              color={colors.gray[900]}
            >
              Status {filteredV2Logs?.find(item => item.content_id === sessionContentId)?.status_text ?? "_"}
            </Typography>
          </View>
          <SvgXml xml={arrowDown} />
        </View>
      </View> */}
      </View>

      <AssessmentReportsCard
        count={assessmentOptions?.length ?? 0}
        selectedItem={selectedAssignmentId}
        options={
          assessmentOptions?.map((item) => ({
            id: item.id,
            job_title: item.job_title,
            date: formatMonDDYYYY(item.created_at, "DD MMM YYYY"),
            status: item.status,
          })) || []
        }
        onSelect={(item) => {
          onSelectedAssignmentIdChange(item.id);
        }}
        onRefresh={() => {
          if (!applicationId) return;
          dispatch(
            getAssessmentOptionsReportRequestAction({
              application_id: applicationId,
              page: 1,
            }),
          );
        }}
        onExport={() => {
          if (!selectedAssignmentId) {
            showToastMessage("Please select an assignment to export", "error");
            return;
          }
          dispatch(
            exportAssessmentReportRequestAction({
              select_all: false,
              assignment_ids: [selectedAssignmentId],
            })
          );
        }}
        refreshing={loadingOptions}
        exporting={loadingExportReport}
      />

      {!shouldShowEmptyState && (
        <CustomTimeline title={"Assessment Timeline"} progress={progress} data={timelineData} />
      )}

      <AssessmentsDetailsV2 />
      <ProctoringCard
        proctoring={performanceReport?.proctoring_summary}
        styles={assessmentDetailsStyles}
      />
      <TimeAnalyticsCard
        timeAnalytics={performanceReport?.time_analytics}
        styles={assessmentDetailsStyles}
      />
      <RecommendationCard
        recommendations={performanceReport?.recommendations}
        overallAssessmentText={strengthsWeaknesses?.overall_assessment}
        styles={assessmentDetailsStyles}
      />
    </View>
  );
};

export default AssessmentV2;
