import React, { useEffect, useState, useMemo, SetStateAction } from 'react';
import { View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useAppDispatch } from '../../../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import {
  getAssessmentLogsRequestAction,
  getAssessmentOptionsReportRequestAction,
  exportAssessmentReportRequestAction,
  getAssessmentReportRequestAction,
  getPerformanceReportRequestAction,
  markSessionAsReviewedRequestAction,
} from '../../../../../features/applications/actions';
import {
  selectApplicationStages,
  selectAssessmentLogs,
  selectAssessmentReport,
  selectSelectedApplication,
  selectMarkSessionReviewedLoading,
  selectPerformanceReport,
  selectAssessmentOptions,
  selectAssessmentOptionsLoading,
  selectExportAssessmentReportLoading,
} from '../../../../../features/applications/selectors';
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

const AssessmentV2 = () => {
  const styles = useStyles();
  const assessmentDetailsStyles = useAssessmentDetailsStyles();
  const [session, setSelectedSession] = useState<string | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);
  const [selectedStageStatus, setSelectedStageStatus] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const application = useAppSelector(selectSelectedApplication);
  const applicationId = application?.id ?? null;
  const assessmentLogs = useAppSelector(selectAssessmentLogs);
  const performanceReport = useAppSelector(selectPerformanceReport);
  const stages = useAppSelector(selectApplicationStages);
  const loadingMarkReviewed = useAppSelector(selectMarkSessionReviewedLoading);
  const assessmentOptions = useAppSelector(selectAssessmentOptions);
  const loadingOptions = useAppSelector(selectAssessmentOptionsLoading);
  const loadingExportReport = useAppSelector(selectExportAssessmentReportLoading);
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
    if (!assessmentLogs?.length) {
      setSelectedSession(null);
      return;
    }
  
    const currentExists = assessmentLogs.some(
      (item) => item.content_id === session
    );
  
    if (!session || !currentExists) {
      setSelectedSession(assessmentLogs[0]?.content_id ?? null);
    }
  }, [assessmentLogs, session]);

  useEffect(() => {
    if (assessmentOptions?.length) {
      setSelectedAssignment(assessmentOptions[0]?.id);
    }
  }, [assessmentOptions]);

  useEffect(() => {
    if (selectedAssignment) {
      dispatch(getPerformanceReportRequestAction(selectedAssignment));
    }
  }, [selectedAssignment,dispatch]);

  useEffect(() => {
    if (!applicationId) return;
  
    dispatch(
      getAssessmentOptionsReportRequestAction({
        application_id: applicationId,
        page: 1,
      })
    );
  }, [applicationId,dispatch]);



  //Ensure dropdown shows the currently active session.
  // useEffect(() => {
  //   if (!session && assessmentLogs?.length) {
  //     setSelectedSession(assessmentLogs[assessmentLogs.length - 1]?.id);
  //   }
  // }, [assessmentLogs, session]);

  // Map status_text to STATUS_OPTIONS id format

  const currentSessionLog = useMemo(
    () => assessmentLogs?.find((item) => item.content_id === session) ?? null,
    [assessmentLogs, session]
  );
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
    if (session && assessmentLogs?.length) {
      const currentSession = assessmentLogs.find(item => item.content_id === session);
      if (currentSession?.status_text) {
        return mapStatusTextToId(currentSession.status_text);
      }
    }
    return '';
  }, [session, assessmentLogs]);

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
      <View style={{zIndex: 1000,}}>
        <Card style={{gap: 4,width:"100%"}}>
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
            <Dropdown
              label="Session"
              dropdownLabel="Session"
              options={assessmentLogs?.map((item, index) => ({
                id: item.content_id,
                name: `Session`,
                status: item?.session_status ?? "—",
                raw: item,
              })) ?? []}
              setValue={session ?? undefined}
              statusKey="status_text"
              labelKey="name"
              valueKey="id"
              onSelect={item => setSelectedSession(item?.id)}
              onChangeText={() => { }}
            />
            <View style={styles.reviewRow}>
              <Typography variant="regularTxtxs" style={{ flex: 1 }}>
                {assessmentLogs
                  ?.find(item => item.content_id === session)
                  ?.action_taken_by?.name ? (
                  <>
                    Reviewed by{" "}
                    {
                      assessmentLogs.find(item => item.content_id === session)
                        ?.action_taken_by?.name
                    }{" "}
                    ·{" "}
                    {formatMonDDYYYY(
                      assessmentLogs.find(item => item.content_id === session)
                        ?.action_taken_at,
                      "DD MMM YYYY HH:mm",
                      "IST"
                    )}
                  </>
                ) : assessmentLogs?.find(item => item.content_id === session)
                  ?.workflow_status_updated_at ? (
                  <>
                    Reviewed by Workflow ·{" "}
                    {formatMonDDYYYY(
                      assessmentLogs.find(item => item.content_id === session)
                        ?.workflow_status_updated_at,
                      "DD MMM YYYY HH:mm",
                      "IST"
                    )}
                  </>
                ) : assessmentLogs?.find(item => item.content_id === session)
                  ?.updated_at ? (
                  <>
                    ·{" "}
                    {formatMonDDYYYY(
                      assessmentLogs.find(item => item.content_id === session)
                        ?.updated_at,
                      "DD MMM YYYY HH:mm",
                      "IST"
                    )}
                  </>
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
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(assessmentLogs?.find(item => item.content_id === session)?.status_text ?? "_") }]} />
            <Typography
              variant="mediumTxtmd"
              color={colors.gray[900]}
            >
              Status {assessmentLogs?.find(item => item.content_id === session)?.status_text ?? "_"}
            </Typography>
          </View>
          <SvgXml xml={arrowDown} />
        </View>
      </View> */}
      </View>

      <AssessmentReportsCard
        count={assessmentOptions?.length ?? 0}
        selectedItem={selectedAssignment}
        options={
          assessmentOptions?.map((item) => ({
            id: item.id,
            job_title: item.job_title,
            date: formatMonDDYYYY(item.created_at, "DD MMM YYYY"),
            status: item.status,
          })) || []
        }
        onSelect={(item: { id: SetStateAction<string>; }) => {
          setSelectedAssignment(item.id);
        }}
        onRefresh={() => {
          dispatch(
            getAssessmentOptionsReportRequestAction({
              application_id: selectedAssignment,
              page: 1,
            }),
          );
        }}
        onExport={() => {
          if (!selectedAssignment) {
            showToastMessage("Please select an assignment to export", "error");
            return;
          }
          dispatch(
            exportAssessmentReportRequestAction({
              select_all: false,
              assignment_ids: [selectedAssignment],
            })
          );
        }}
        refreshing={loadingOptions}
        exporting={loadingExportReport}
      />

      <CustomTimeline progress={progress} data={timelineData} />

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
