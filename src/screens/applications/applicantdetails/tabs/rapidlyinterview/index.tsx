import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../../../hooks/useAppDispatch';
import {
  selectRapidlyInterviewReport,
  selectRapidlyInterviewReportLoading,
} from '../../../../../features/rapidhire/selectors';
import { getRapidlyInterviewReportRequestAction } from '../../../../../features/rapidhire/actions';
import {
  selectSelectedApplication,
  selectApplicationStages,
} from '../../../../../features/applications/selectors';
import { SvgXml } from 'react-native-svg';
import { Typography } from '../../../../../components';
import { colors } from '../../../../../theme/colors';
import ApplicantTabStatus from '../../../../../components/atoms/applicanttabstatus';
import { alertTriangleIcon } from '../../../../../assets/svg/alertTriangle';
import { RapidlyInterviewCard, RapidlyInterviewItem } from './components/RapidlyInterviewCard';
import { useStyles } from './styles';
import { InterviewBreakdownModal } from './components/InterviewBreakdownModal';
import { InterviewMonitoringModal } from './components/InterviewMonitoringModal';
import { buildRapidlyInterviewItems } from './interviewSyncUtils';

interface RapidlyInterviewProps {
  application_id: string;
}

export default function RapidlyInterview({ application_id }: RapidlyInterviewProps) {
  const styles = useStyles();
  const dispatch = useAppDispatch();
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [breakdownModalVisible, setBreakdownModalVisible] = useState(false);
  const [monitoringModalVisible, setMonitoringModalVisible] = useState(false);

  const reportData = useAppSelector(selectRapidlyInterviewReport);
  const loading = useAppSelector(selectRapidlyInterviewReportLoading);
  const application = useAppSelector(selectSelectedApplication);
  const stages = useAppSelector(selectApplicationStages);

  useEffect(() => {
    if (application_id && !reportData && !loading) {
      dispatch(getRapidlyInterviewReportRequestAction(application_id));
    }
  }, [application_id, reportData, loading, dispatch]);

  const candidateName = reportData?.candidate_name || application?.applicant?.name || 'Candidate';
  const jobTitle = application?.job?.title || 'Job';

  const videoResponses: RapidlyInterviewItem[] = useMemo(() => {
    return buildRapidlyInterviewItems(reportData);
  }, [reportData]);

  const calculatedTotalDuration = useMemo(() => {
    const timelineMaxSec =
      reportData?.timeline && reportData.timeline.length > 0
        ? Math.round(
            Math.max(...reportData.timeline.map((t) => t.endMs || t.startMs || 0)) / 1000
          )
        : 0;

    const responseMaxSec =
      videoResponses && videoResponses.length > 0
        ? Math.max(...videoResponses.map((r) => r.endTime || (r.startTime + r.duration) || 0))
        : 0;

    const candidates = [
      timelineMaxSec,
      responseMaxSec,
      reportData?.duration_seconds || 0,
      reportData?.report?.assessment?.delivery?.total_time_sec || 0,
    ];

    const maxVal = Math.max(...candidates);
    return maxVal > 0 ? maxVal : undefined;
  }, [reportData, videoResponses]);

  const activeQuestionIndex = Math.min(
    selectedQuestionIndex,
    Math.max(0, videoResponses.length - 1)
  );

  const rapidlyStage = useMemo(() => {
    return (
      stages?.find(
        (s) =>
          s.stage_type === 'rapidly_interview' ||
          s.stage_type === 'rapidhire' ||
          s.stage_type === 'automated_video_interview',
      ) ?? null
    );
  }, [stages]);

  const stageStatus = useMemo(() => {
    if (reportData?.status === 'completed') {
      return 'Completed';
    }
    if (reportData?.status) {
      return reportData.status;
    }
    return rapidlyStage?.status ?? 'Completed';
  }, [reportData?.status, rapidlyStage?.status]);

  const isAbandoned = Boolean(
    reportData?.status === 'abandoned' ||
    (reportData?.has_interview && !reportData?.recording_url && reportData?.status !== 'completed'),
  );

  const hasAssessment = Boolean(
    reportData?.score != null ||
    reportData?.report?.assessment?.overall,
  );
  const hasProctoring = Boolean(reportData?.proctoring);

  const handleOpenBreakdown = useCallback(() => {
    setBreakdownModalVisible(true);
  }, []);

  const handleCloseBreakdown = useCallback(() => {
    setBreakdownModalVisible(false);
  }, []);

  const handleOpenMonitoring = useCallback(() => {
    setMonitoringModalVisible(true);
  }, []);

  const handleCloseMonitoring = useCallback(() => {
    setMonitoringModalVisible(false);
  }, []);

  const headerButtons = useMemo(() => {
    return (
      <View style={styles.headerRightWrap}>
        {hasAssessment && (
          <TouchableOpacity
            onPress={handleOpenBreakdown}
            style={styles.breakdownButton}
          >
            <Typography variant="semiBoldTxtxs" color={colors.brand[600]}>
              Breakdown
            </Typography>
          </TouchableOpacity>
        )}
        {hasProctoring && (
          <TouchableOpacity
            onPress={handleOpenMonitoring}
            style={styles.monitoringButton}
          >
            <Typography variant="semiBoldTxtxs" color={colors.gray[700]}>
              Interview monitoring
            </Typography>
          </TouchableOpacity>
        )}
      </View>
    );
  }, [hasAssessment, hasProctoring, styles, handleOpenBreakdown, handleOpenMonitoring]);

  if (loading && !reportData) {
    return (
      <View style={styles.emptyStateContainer}>
        <ActivityIndicator size="large" color={colors.brand[600]} />
        <Typography variant="regularTxtsm" color={colors.gray[600]} style={styles.marginTop2}>
          Loading rapidly interview report...
        </Typography>
      </View>
    );
  }

  if (isAbandoned) {
    return (
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <ApplicantTabStatus
          label="Stages"
          stage={rapidlyStage}
          status={stageStatus}
        />

        <View style={styles.abandonedCard}>
          <View style={styles.abandonedIconWrap}>
            <SvgXml xml={alertTriangleIcon(colors.brand[600])} width={26} height={26} />
          </View>
          <Typography variant="semiBoldTxtlg" color={colors.gray[900]} style={styles.abandonedTitle}>
            Interview not completed
          </Typography>
          <Typography variant="regularTxtsm" color={colors.gray[600]} style={styles.abandonedDesc}>
            <Typography variant="semiBoldTxtsm" color={colors.gray[800]}>
              {candidateName}{' '}
            </Typography>
            started the interview but didn't finish it, so no recording or analysis is available. They can be re-invited to try again.
          </Typography>
        </View>
      </ScrollView>
    );
  }

  if (!reportData?.has_interview && !loading && !reportData?.recording_url) {
    return (
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <ApplicantTabStatus
          label="Stages"
          stage={rapidlyStage}
          status={stageStatus}
        />
        <View style={styles.emptyStateContainer}>
          <Typography variant="semiBoldTxtmd" color={colors.gray[700]}>
            No Rapidly interview recording available.
          </Typography>
          <Typography variant="regularTxtsm" color={colors.gray[500]} style={styles.marginTop2}>
            Candidate has not completed the Rapidly interview yet.
          </Typography>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <ApplicantTabStatus
        label="Stages"
        stage={rapidlyStage}
        status={stageStatus}
      />

      <RapidlyInterviewCard
        responses={videoResponses}
        activeIndex={activeQuestionIndex}
        onActiveIndexChange={setSelectedQuestionIndex}
        totalDuration={calculatedTotalDuration}
        candidateName={candidateName}
        headerRight={headerButtons}
      />

      {/* Breakdown Modal */}
      {hasAssessment && (
        <InterviewBreakdownModal
          visible={breakdownModalVisible}
          onClose={handleCloseBreakdown}
          reportData={reportData}
          candidateName={candidateName}
          jobTitle={jobTitle}
        />
      )}

      {/* Interview Monitoring Modal */}
      {hasProctoring && (
        <InterviewMonitoringModal
          visible={monitoringModalVisible}
          onClose={handleCloseMonitoring}
          proctoring={reportData?.proctoring}
          candidateName={candidateName}
        />
      )}
    </ScrollView>
  );
}