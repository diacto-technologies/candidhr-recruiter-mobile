import React, { useState, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import {
  selectRapidlyInterviewReport,
  selectRapidlyInterviewReportLoading,
} from '../../../../../features/rapidhire/selectors';
import { selectSelectedApplication } from '../../../../../features/applications/selectors';
import { Typography } from '../../../../../components';
import { colors } from '../../../../../theme/colors';
import { VideoResponseCard, VideoResponseItem } from '../../../../../components/organisms/VideoResponseCard';
import { useStyles } from './styles';
import { InterviewBreakdownModal } from './components/InterviewBreakdownModal';

interface RapidlyInterviewProps {
  application_id: string;
}

export default function RapidlyInterview({ application_id }: RapidlyInterviewProps) {
  const styles = useStyles();
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [breakdownModalVisible, setBreakdownModalVisible] = useState(false);

  const reportData = useAppSelector(selectRapidlyInterviewReport);
  const loading = useAppSelector(selectRapidlyInterviewReportLoading);
  const application = useAppSelector(selectSelectedApplication);

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

  const videoResponses: VideoResponseItem[] = useMemo(() => {
    if (!reportData) return [];

    const count = Math.max(
      questions.length,
      candidateTurns.length,
      candidateTimelineItems.length,
      1
    );
    const list: VideoResponseItem[] = [];

    for (let i = 0; i < count; i++) {
      const qText = questions[i]?.text || candidateTurns[i]?.text || (i === 0 ? 'Interview Question' : `Question ${i + 1}`);
      const answerTurn = candidateTurns[i];
      const timelineItem = candidateTimelineItems[i] || candidateTimelineItems[0];

      let durationSec = 4;
      if (timelineItem?.endMs && timelineItem?.startMs) {
        durationSec = Math.max(1, Math.round((timelineItem.endMs - timelineItem.startMs) / 1000));
      } else if (reportData.duration_seconds) {
        durationSec = reportData.duration_seconds;
      }

      const startTimeSec = timelineItem?.startMs ? timelineItem.startMs / 1000 : 0;
      const endTimeSec = timelineItem?.endMs ? timelineItem.endMs / 1000 : startTimeSec + durationSec;

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

  if (!reportData?.has_interview && !loading && !reportData?.recording_url) {
    return (
      <View style={styles.emptyStateContainer}>
        <Typography variant="semiBoldTxtmd" color={colors.gray[700]}>
          No Rapidly interview recording available.
        </Typography>
        <Typography variant="regularTxtsm" color={colors.gray[500]} style={styles.marginTop2}>
          Candidate has not completed the Rapidly interview yet.
        </Typography>
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <VideoResponseCard
        responses={videoResponses}
        activeIndex={selectedQuestionIndex}
        onActiveIndexChange={setSelectedQuestionIndex}
        headerRight={
          <TouchableOpacity
            onPress={() => setBreakdownModalVisible(true)}
            style={styles.breakdownButton}
          >
            <Typography variant="semiBoldTxtxs" color={colors.brand[600]}>
              Breakdown
            </Typography>
          </TouchableOpacity>
        }
      />

      {/* Breakdown Modal */}
      <InterviewBreakdownModal
        visible={breakdownModalVisible}
        onClose={() => setBreakdownModalVisible(false)}
        reportData={reportData}
        candidateName={candidateName}
        jobTitle={jobTitle}
      />
    </ScrollView>
  );
}
