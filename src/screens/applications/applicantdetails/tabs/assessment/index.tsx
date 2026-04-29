import React, { useEffect, useState, useMemo } from 'react';
import { View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import CustomTimeline from './timelinecard';
import AssessmentsDetails from './assessmentdetails';
import { useAppDispatch } from '../../../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import {
  getAssessmentReportRequestAction,
  markSessionAsReviewedRequestAction,
} from '../../../../../features/applications/actions';
import {
  selectApplicationStages,
  selectAssessmentLogs,
  selectAssessmentReport,
  selectSelectedApplication,
  selectMarkSessionReviewedLoading,
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
import Shimmer from '../../../../../components/atoms/shimmer';
import { selectAssessmentLoading } from '../../../../../features/applications/selectors';

interface TimelineItem {
  title: string;
  date?: string;
  status: 'completed' | 'current' | 'upcoming';
}

const normalizeContentType = (v: unknown) =>
  String(v ?? '')
    .toLowerCase()
    .trim()
    .replace(/[\s-]+/g, '_');

type AssessmentProps = {
  sessionContentId: string | null;
  onSessionContentIdChange: (id: string | null) => void;
};

const Assessment = ({ sessionContentId, onSessionContentIdChange }: AssessmentProps) => {
  const styles = useStyles();
  const [selectedStageStatus, setSelectedStageStatus] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const application = useAppSelector(selectSelectedApplication);
  const assessmentLogs = useAppSelector(selectAssessmentLogs);
  const filteredAssessmentLogs = useMemo(() => {
    const logs = assessmentLogs ?? [];
    return logs.filter((l) => normalizeContentType(l?.content_type) === 'assessment');
  }, [assessmentLogs]);
  const assessmentReport = useAppSelector(selectAssessmentReport);
  const assessmentLoading = useAppSelector(selectAssessmentLoading);
  const stages = useAppSelector(selectApplicationStages);
  const loadingMarkReviewed = useAppSelector(selectMarkSessionReviewedLoading);


  // useEffect(() => {
  //   // if (!stages?.length) return;
  //   const stage = stages.find(
  //     s => s.stage_type === 'assessment'
  //   );
  //   if (stage?.id && !assessmentLogs?.length) {
  //     dispatch(getAssessmentLogsRequestAction(stage.id));
  //   }

  // }, [stages]);

  // useEffect(() => {
  //   if (applicant?.id) {
  //     dispatch(getAssessmentLogsRequestAction(applicant?.id as string));
  //   }
  // }, []);

  useEffect(() => {
    const stageStatus = stages?.find(s => s.stage_type === "assessment")?.status;
    if (stageStatus) {
      setSelectedStageStatus(stageStatus);
    }
  }, [stages]);

  const currentSessionLog = useMemo(
    () =>
      filteredAssessmentLogs?.find((item) => item.content_id === sessionContentId) ?? null,
    [filteredAssessmentLogs, sessionContentId]
  );

  /** True when Redux already has the report for this session (avoids refetch + shimmer on tab remount). */
  const reportMatchesSession = useMemo(() => {
    if (!sessionContentId || !assessmentReport) return false;
    return (
      assessmentReport.id === sessionContentId ||
      (!!currentSessionLog && assessmentReport.id === currentSessionLog.id)
    );
  }, [sessionContentId, assessmentReport, currentSessionLog]);

  useEffect(() => {
    if (!filteredAssessmentLogs?.length) {
      onSessionContentIdChange(null);
      return;
    }
    const currentExists = filteredAssessmentLogs.some(
      (item) => item.content_id === sessionContentId
    );
    if (!sessionContentId || !currentExists) {
      onSessionContentIdChange(filteredAssessmentLogs[0]?.content_id ?? null);
    }
  }, [filteredAssessmentLogs, sessionContentId, onSessionContentIdChange]);

  useEffect(() => {
    if (!sessionContentId || !filteredAssessmentLogs?.length) return;
    if (reportMatchesSession) return;
    dispatch(getAssessmentReportRequestAction(sessionContentId));
  }, [
    sessionContentId,
    filteredAssessmentLogs?.length,
    dispatch,
    reportMatchesSession,
  ]);

  const isReviewed = currentSessionLog?.session_status === 'reviewed';

  const assessmentStage = useMemo(
    () => stages?.find((s) => s.stage_type === 'assessment'),
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
    if (sessionContentId && filteredAssessmentLogs?.length) {
      const currentSession = filteredAssessmentLogs.find(
        (item) => item.content_id === sessionContentId
      );
      if (currentSession?.status_text) {
        return mapStatusTextToId(currentSession.status_text);
      }
    }
    return '';
  }, [sessionContentId, filteredAssessmentLogs]);

  const assessmentStatus =
    stages?.find(stage => stage.stage_type === "assessment")?.status
      ?.replace("_", " ")
      ?.replace(/\b\w/g, c => c.toUpperCase());



  const timelineSteps = [
    {
      title: 'Invited On',
      date: formatMonDDYYYY(assessmentReport?.timeline?.assigned_at, 'DD MMM YYYY HH:mm', 'IST'),
      completed: !!assessmentReport?.timeline?.assigned_at,
    },
    {
      title: 'Link Opened',
      date: formatMonDDYYYY(
        assessmentReport?.timeline?.link_opened_at,
        'DD MMM YYYY HH:mm', 'IST'
      ),
      completed: !!assessmentReport?.timeline?.link_opened,
    },
    {
      title: 'Started',
      date: formatMonDDYYYY(
        assessmentReport?.timeline?.started_at,
        'DD MMM YYYY HH:mm', 'IST'
      ),
      completed: !!assessmentReport?.timeline?.started,
    },
    {
      title: 'Completed',
      date: formatMonDDYYYY(
        assessmentReport?.timeline?.completed_at,
        'DD MMM YYYY HH:mm', 'IST'
      ),
      completed: !!assessmentReport?.timeline?.completed,
    },
  ];

  const completedSteps = timelineSteps.filter(step => step.completed).length;
  const progress = Math.round(
    (completedSteps / timelineSteps.length) * 100
  );

  const timelineData: TimelineItem[] = (() => {
    let foundCurrent = false
    return timelineSteps.map((step) => {
      if (step.completed) {
        return { title: step.title, date: step.date, status: 'completed' as const }
      }
      if (!foundCurrent) {
        foundCurrent = true
        return { title: step.title, date: step.date, status: 'current' as const }
      }
      return { title: step.title, date: step.date, status: 'upcoming' as const }
    })
  })();


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
          contentType: "Assessment",
          onUpdateStatus: (newStatusId) => {
            setSelectedStageStatus(newStatusId);
          },
        }}
      />
      <View style={{ zIndex: 1000 }}>
        <Card style={{ gap: 4 ,flex:1,width:'100%'}}>
          <Typography variant="regularTxtxs" style={{ backgroundColor: colors?.brand['200'], borderTopEndRadius: 12, borderTopStartRadius: 12, padding: 5 }} numberOfLines={2}>
            Stage was {assessmentStatus} by{" "}
            {stages?.find(s => s.stage_type === "assessment")?.reviewed_by?.name ??
              "Workflow"}{" "}
            on{" "}
            {formatMonDDYYYY(
              stages?.find(s => s.stage_type === "assessment")?.reviewed_at ??
              stages?.find(s => s.stage_type === "assessment")
                ?.workflow_status_updated_at,
              "DD MMM YYYY HH:mm",
              "IST"
            )}
          </Typography>
          <View style={{ paddingHorizontal: 16, paddingVertical: 10 }}>
            <Dropdown
              label="Session"
              dropdownLabel="Session"
              options={filteredAssessmentLogs?.map((item, index) => ({
                id: item.content_id,
                name: `Assessment`,
                status_text: item?.session_status ?? "—",
                raw: item,
              })) ?? []}
              setValue={sessionContentId ?? ''}
              statusKey="status_text"
              labelKey="name"
              valueKey="id"
              onSelect={item => onSessionContentIdChange(item?.id ?? null)}
              onChangeText={() => { }}
            />
            <View style={styles.reviewRow}>
              <Typography variant="regularTxtxs" style={{ flex: 1 }}>
                {filteredAssessmentLogs
                  ?.find(item => item.content_id === sessionContentId)
                  ?.action_taken_by?.name ? (
                  <>
                    Reviewed by{" "}
                    {
                      filteredAssessmentLogs.find(item => item.content_id === sessionContentId)
                        ?.action_taken_by?.name
                    }{" "}
                    ·{" "}
                    {formatMonDDYYYY(
                      filteredAssessmentLogs.find(item => item.content_id === sessionContentId)
                        ?.action_taken_at,
                      "DD MMM YYYY HH:mm",
                      "IST"
                    )}
                  </>
                ) : filteredAssessmentLogs?.find(item => item.content_id === sessionContentId)
                  ?.workflow_status_updated_at ? (
                  <>
                    Reviewed by Workflow ·{" "}
                    {formatMonDDYYYY(
                      filteredAssessmentLogs.find(item => item.content_id === sessionContentId)
                        ?.workflow_status_updated_at,
                      "DD MMM YYYY HH:mm",
                      "IST"
                    )}
                  </>
                ) : filteredAssessmentLogs?.find(item => item.content_id === sessionContentId)
                  ?.updated_at ? (
                  <>
                    ·{" "}
                    {formatMonDDYYYY(
                      filteredAssessmentLogs.find(item => item.content_id === sessionContentId)
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

      {assessmentLoading && !!sessionContentId && !reportMatchesSession ? (
        <View style={{ gap: 14, paddingVertical: 18 }}>
          <Shimmer width="40%" height={20} borderRadius={8} />
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Shimmer width="45%" height={14} borderRadius={8} />
            <Shimmer width="45%" height={14} borderRadius={8} />
          </View>
          <Shimmer width="100%" height={180} borderRadius={16} />
          <Shimmer width="100%" height={220} borderRadius={12} />
        </View>
      ) : (
        <>
          <CustomTimeline progress={progress} data={timelineData} />
          <AssessmentsDetails />
        </>
      )}
    </View>
  );
};

export default Assessment;
