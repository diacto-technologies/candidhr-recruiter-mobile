import React, { useEffect, useState, useMemo } from 'react';
import { View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import CustomTimeline from './timelinecard';
import AssessmentsDetails from './assessmentdetails';
import { useAppDispatch } from '../../../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import {
  getAssessmentLogsRequestAction,
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

interface TimelineItem {
  title: string;
  date?: string;
  status: 'completed' | 'current';
}

const Assessment = () => {
  const styles = useStyles();
  const [session, setSelectedSession] = useState<string | null>(null);
  const [selectedStageStatus, setSelectedStageStatus] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const application = useAppSelector(selectSelectedApplication);
  const assessmentLogs = useAppSelector(selectAssessmentLogs);
  const assessmentReport = useAppSelector(selectAssessmentReport);
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

  useEffect(() => {
    if (!assessmentLogs?.length) {
      setSelectedSession(null);
      return;
    }
    const currentExists = assessmentLogs.some((item) => item.content_id === session);
    if (!session || !currentExists) {
      setSelectedSession(assessmentLogs[0]?.content_id ?? null);
    }
  }, [assessmentLogs, session]);

  useEffect(() => {
    if (session && assessmentLogs?.length) {
      dispatch(getAssessmentReportRequestAction(session));
    }
  }, [session, assessmentLogs?.length]);



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
    if (session && assessmentLogs?.length) {
      const currentSession = assessmentLogs.find(item => item.content_id === session);
      if (currentSession?.status_text) {
        return mapStatusTextToId(currentSession.status_text);
      }
    }
    return '';
  }, [session, assessmentLogs]);

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
              options={assessmentLogs?.map((item, index) => ({
                id: item.content_id,
                name: `Assessment`,
                status_text: item?.session_status ?? "—",
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

      <CustomTimeline progress={progress} data={timelineData} />

      <AssessmentsDetails />
    </View>
  );
};

export default Assessment;
