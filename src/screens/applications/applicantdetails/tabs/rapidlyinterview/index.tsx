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

  const questions = useMemo(() => {
    if (reportData?.report?.questions?.length) {
      return reportData.report.questions;
    }
    const aiTurns = reportData?.report?.turns?.filter(t => t.role === 'ai') ?? [];
    return aiTurns.map((turn, index) => ({
      text: turn.text,
      order: index,
    }));
  }, [reportData?.report?.questions, reportData?.report?.turns]);

  const candidateTurns = useMemo(() => {
    return reportData?.report?.turns?.filter(t => t.role === 'candidate') ?? [];
  }, [reportData?.report?.turns]);

  const candidateTimelineItems = useMemo(() => {
    const items = reportData?.timeline ?? [];
    if (!items.length) return [];
    const candidateOnly = items.filter(item => !item.role || (item.role as string) === 'candidate');
    if (candidateOnly.length > 0) return candidateOnly;
    return items;
  }, [reportData?.timeline]);

  const videoResponses: RapidlyInterviewItem[] = useMemo(() => {
    if (!reportData) return [];

    const count = Math.max(
      questions.length,
      candidateTurns.length,
      candidateTimelineItems.length,
      1
    );
    const list: RapidlyInterviewItem[] = [];
    const allTimelineItems = reportData?.timeline ?? [];
    const totalDur =
      reportData.duration_seconds ||
      reportData?.report?.assessment?.delivery?.total_time_sec ||
      (allTimelineItems.length > 0
        ? Math.round(Math.max(...allTimelineItems.map(t => t.endMs || t.startMs || 0)) / 1000)
        : 0);
    const aiTimelineItems = allTimelineItems.filter(item => item.role === 'ai');

    for (let i = 0; i < count; i++) {
      const qText = questions[i]?.text || candidateTurns[i]?.text || (i === 0 ? 'Interview Question' : `Question ${i + 1}`);
      const answerTurn = candidateTurns[i];
      const timelineItem = candidateTimelineItems[i] || aiTimelineItems[i] || allTimelineItems[i];

      let startTimeSec = 0;
      if (i === 0) {
        startTimeSec = 0;
      } else {
        if (aiTimelineItems[i]?.startMs !== undefined && aiTimelineItems[i].startMs > 0) {
          startTimeSec = aiTimelineItems[i].startMs / 1000;
        } else if (candidateTimelineItems[i]?.startMs !== undefined && candidateTimelineItems[i].startMs > 0) {
          startTimeSec = candidateTimelineItems[i].startMs / 1000;
        } else if (timelineItem?.startMs !== undefined && timelineItem.startMs > 0) {
          startTimeSec = timelineItem.startMs / 1000;
        }

        const prevStart = list[i - 1]?.startTime || 0;
        if (startTimeSec <= prevStart) {
          if (totalDur > 0) {
            startTimeSec = Math.round((i * totalDur) / count);
          } else {
            startTimeSec = prevStart + (list[i - 1]?.duration || 30);
          }
        }
      }

      let durationSec = 0;
      if (timelineItem?.endMs && timelineItem?.startMs && timelineItem.endMs > timelineItem.startMs) {
        durationSec = Math.max(1, Math.round((timelineItem.endMs - timelineItem.startMs) / 1000));
      } else if (totalDur > 0) {
        const nextStart = i < count - 1 ? Math.round(((i + 1) * totalDur) / count) : totalDur;
        durationSec = Math.max(1, nextStart - startTimeSec);
      } else {
        durationSec = 30;
      }

      const endTimeSec = startTimeSec + durationSec;

      const segments = timelineItem?.words?.length
        ? [
          {
            text: answerTurn?.text || timelineItem.text,
            start: 0,
            end: durationSec,
            words: timelineItem.words.map(w => {
              const wStart = w.start != null ? w.start : 0;
              const wEnd = w.end != null ? w.end : 0;
              const baseMs = timelineItem.startMs || 0;
              const relStart = baseMs > 0 && wStart >= baseMs ? (wStart - baseMs) / 1000 : wStart / 1000;
              const relEnd = baseMs > 0 && wEnd >= baseMs ? (wEnd - baseMs) / 1000 : wEnd / 1000;
              return {
                word: w.w,
                start: Math.max(0, relStart),
                end: Math.max(0, relEnd),
              };
            }),
          },
        ]
        : [
          {
            text: answerTurn?.text || reportData?.report?.transcript || '',
            start: 0,
            end: durationSec,
          },
        ];

      list.push({
        id: `rapidly-q-${i}-${startTimeSec}`,
        questionText: qText,
        startedAt: reportData.updated_at,
        duration: durationSec,
        startTime: startTimeSec,
        endTime: endTimeSec,
        videoFile: reportData.recording_url,
        videoThumbnail: reportData.thumbnail_url,
        transcriptionText: answerTurn?.text || reportData?.report?.transcript || 'No transcription available.',
        transcriptionSegments: segments,
      });
    }

    return list;
  }, [reportData, questions, candidateTurns, candidateTimelineItems]);

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
        activeIndex={selectedQuestionIndex}
        onActiveIndexChange={setSelectedQuestionIndex}
        totalDuration={
          reportData?.duration_seconds ||
          reportData?.report?.assessment?.delivery?.total_time_sec ||
          (reportData?.timeline && reportData.timeline.length > 0
            ? Math.round(Math.max(...reportData.timeline.map(t => t.endMs || t.startMs || 0)) / 1000)
            : undefined)
        }
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