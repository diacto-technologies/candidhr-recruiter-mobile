import React, { useState, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Typography } from '../../../../../../components/atoms';
import Divider from '../../../../../../components/atoms/divider';
import VideoPlayerBox from '../../../../../../components/molecules/videoplayer';
import CopyText from '../../../../../../components/molecules/copyText';
import { colors } from '../../../../../../theme/colors';
import { copyIcon } from '../../../../../../assets/svg/copy';
import { useStyles } from '../styles';

export interface RapidlyInterviewItem {
  id: string;
  questionText: string;
  startedAt?: string | null;
  duration: number;
  startTime: number;
  endTime: number;
  videoFile?: string | null;
  videoThumbnail?: string | null;
  transcriptionText: string;
  transcriptionSegments?: Array<{
    text?: string;
    start?: number;
    end?: number;
    words?: Array<{ word: string; start: number; end: number }>;
  }>;
}

export interface RapidlyInterviewCardProps {
  responses: RapidlyInterviewItem[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  headerRight?: React.ReactNode;
  totalDuration?: number;
  candidateName?: string;
}

const formatSecondsToMinutes = (seconds?: number | null) => {
  if (seconds == null || isNaN(seconds) || seconds < 0) {
    return '00:00';
  }
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export const RapidlyInterviewCard: React.FC<RapidlyInterviewCardProps> = ({
  responses = [],
  activeIndex,
  onActiveIndexChange,
  headerRight,
  totalDuration,
}) => {
  const styles = useStyles();
  const [currentTime, setCurrentTime] = useState(0);
  const [loadedVideoDuration, setLoadedVideoDuration] = useState<number>(0);
  const [transcriptionView, setTranscriptionView] = useState<'continuous' | 'bytime'>('continuous');

  const selectedResponse = responses[activeIndex] || responses[0];

  const totalVideoDuration = useMemo(() => {
    if (loadedVideoDuration > 0) {
      return loadedVideoDuration;
    }

    let maxTime = 0;
    responses.forEach((r) => {
      const end = (r.startTime || 0) + (r.duration || 0);
      if (end > maxTime) maxTime = end;
      if ((r.endTime || 0) > maxTime) maxTime = r.endTime;
    });

    const candidates = [
      totalDuration || 0,
      maxTime,
      selectedResponse?.duration || 0,
    ];

    return Math.max(...candidates, 0);
  }, [totalDuration, responses, selectedResponse, loadedVideoDuration]);

  const userNavigatedTimeRef = React.useRef<number>(0);

  const chapters = useMemo(() => {
    const totalDur = totalVideoDuration || totalDuration || 0;
    const count = responses.length;
    return responses.map((r, idx) => {
      let time = r.startTime || 0;
      if (idx > 0 && (time <= 0 || time <= (responses[idx - 1]?.startTime || 0))) {
        const prevTime = responses[idx - 1]?.startTime || 0;
        time = Math.max(prevTime + 1, totalDur > 0 ? Math.round((idx * totalDur) / count) : idx * 30);
      }
      return {
        time,
        title: r.questionText || `Question ${idx + 1}`,
      };
    });
  }, [responses, totalVideoDuration, totalDuration]);

  const handleSelectIndex = (index: number) => {
    if (index < 0 || index >= responses.length) return;
    userNavigatedTimeRef.current = Date.now() + 2000;
    onActiveIndexChange(index);
  };

  const handleChapterChange = (chapterIndex: number) => {
    if (Date.now() < userNavigatedTimeRef.current) {
      return;
    }
    onActiveIndexChange(chapterIndex);
  };

  if (!responses || responses.length === 0) {
    return (
      <View style={styles.emptyStateContainer}>
        <Typography variant="regularTxtsm" color={colors.gray[600]}>
          No interview responses available.
        </Typography>
      </View>
    );
  }

  const transcriptionText =
    selectedResponse?.transcriptionText || 'No spoken answer was transcribed for this question.';
  const transcriptionSegments = selectedResponse?.transcriptionSegments || [];
  const questionRelativeTime = Math.max(0, currentTime - (selectedResponse?.startTime || 0));

  const hasTimestamps = Boolean(
    transcriptionSegments &&
      transcriptionSegments.length > 0 &&
      transcriptionSegments.some(
        (s) =>
          (s.start !== null && s.start !== undefined && s.end !== null && s.end !== undefined) ||
          (s.words && s.words.length > 0 && s.words.some((w) => w.start !== null && w.start !== undefined))
      )
  );

  React.useEffect(() => {
    if (!hasTimestamps && transcriptionView === 'bytime') {
      setTranscriptionView('continuous');
    }
  }, [hasTimestamps, transcriptionView]);

  return (
    <View style={styles.cardContainer}>
      {/* Top Header Row with Questions & Stepper Buttons */}
      <View style={styles.topHeaderRow}>
        <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
          Questions
        </Typography>

        <View style={styles.headerRightWrap}>
          <View style={styles.stepperWrap}>
            <Typography variant="regularTxtsm" color={colors.gray[600]}>
              {`${activeIndex + 1} / ${responses.length}`}
            </Typography>

            <TouchableOpacity
              disabled={activeIndex === 0}
              onPress={() => handleSelectIndex(activeIndex - 1)}
              style={[
                styles.stepperBtn,
                activeIndex === 0 && styles.stepperBtnDisabled,
              ]}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Typography
                variant="semiBoldTxtmd"
                color={activeIndex === 0 ? colors.gray[300] : colors.gray[700]}
              >
                {'‹'}
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={activeIndex === responses.length - 1}
              onPress={() => handleSelectIndex(activeIndex + 1)}
              style={[
                styles.stepperBtn,
                activeIndex === responses.length - 1 && styles.stepperBtnDisabled,
              ]}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Typography
                variant="semiBoldTxtmd"
                color={activeIndex === responses.length - 1 ? colors.gray[300] : colors.gray[700]}
              >
                {'›'}
              </Typography>
            </TouchableOpacity>
          </View>

          {headerRight}
        </View>
      </View>

      {/* Main Continuous Video Player with Chapter Separation Dots */}
      <View style={styles.mainVideoCard}>
        <VideoPlayerBox
          key={`rapidly_${responses[0]?.videoFile || 'vid'}`}
          source={responses[0]?.videoFile || ''}
          startTime={0}
          duration={totalVideoDuration}
          chapters={chapters}
          activeChapterIndex={activeIndex}
          onChapterChange={handleChapterChange}
          onProgress={(e) => setCurrentTime(e.currentTime || 0)}
          onDurationLoaded={setLoadedVideoDuration}
        />
      </View>

      {/* Question Number Label & Title */}
      <View style={styles.questionHeader}>
        <Typography
          variant="semiBoldTxtxs"
          color={colors.brand[600]}
          style={styles.questionNumberLabel}
        >
          {`QUESTION ${activeIndex + 1}`}
        </Typography>

        {Boolean(selectedResponse?.questionText) && (
          <Typography
            variant="semiBoldTxtmd"
            color={colors.gray[900]}
            style={styles.videoTitle}
          >
            {selectedResponse.questionText}
          </Typography>
        )}
      </View>

      {/* Transcription Section */}
      <View style={styles.transcriptionSection}>
        <Divider />
        <View style={styles.transcriptionHeader}>
          <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
            Transcription
          </Typography>
          <CopyText text={transcriptionText} message="Transcription copied">
            <SvgXml xml={copyIcon} />
          </CopyText>
        </View>

        {/* Tabs: Continuous vs By time (only when timestamps exist) */}
        {hasTimestamps && (
          <View style={styles.transcriptionTabs}>
            <TouchableOpacity
              style={[
                styles.transcriptionTab,
                transcriptionView === 'continuous' && styles.transcriptionTabActive,
              ]}
              onPress={() => setTranscriptionView('continuous')}
            >
              <Typography
                variant="mediumTxtsm"
                color={transcriptionView === 'continuous' ? colors.brand[700] : colors.gray[700]}
              >
                Continuous
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.transcriptionTab,
                transcriptionView === 'bytime' && styles.transcriptionTabActive,
              ]}
              onPress={() => setTranscriptionView('bytime')}
            >
              <Typography
                variant="mediumTxtsm"
                color={transcriptionView === 'bytime' ? colors.brand[700] : colors.gray[700]}
              >
                By time
              </Typography>
            </TouchableOpacity>
          </View>
        )}

        {/* Transcription Content */}
        <View style={styles.transcriptionContent}>
          {transcriptionView === 'continuous' ? (
            transcriptionSegments.length > 0 &&
            transcriptionSegments.some((s) => s.words && s.words.length > 0) ? (
              <View style={styles.wordWrap}>
                {transcriptionSegments.map((seg, sIndex) =>
                  seg.words?.map((w, wIndex) => {
                    const isActive =
                      (currentTime >= (w.start ?? 0) && currentTime <= (w.end ?? 0)) ||
                      (questionRelativeTime >= (w.start ?? 0) && questionRelativeTime <= (w.end ?? 0));

                    return (
                      <Typography
                        key={`${sIndex}-${wIndex}`}
                        variant="regularTxtsm"
                        style={[
                          styles.transcriptionText,
                          {
                            backgroundColor: isActive ? colors.brand[100] : 'transparent',
                          },
                          styles.wordHighlight,
                        ]}
                      >
                        {w.word + ' '}
                      </Typography>
                    );
                  })
                )}
              </View>
            ) : (
              <Typography variant="regularTxtsm" color={colors.gray[700]} style={styles.transcriptionText}>
                {transcriptionText}
              </Typography>
            )
          ) : (
            <View style={styles.transcriptionSegments}>
              {transcriptionSegments.length > 0 ? (
                transcriptionSegments.map((segment, index) => {
                  const isActive =
                    (currentTime >= (segment.start ?? 0) && currentTime <= (segment.end ?? 0)) ||
                    (questionRelativeTime >= (segment.start ?? 0) && questionRelativeTime <= (segment.end ?? 0));

                  return (
                    <View key={index} style={styles.transcriptionSegment}>
                      <Typography
                        variant="regularTxtsm"
                        color={isActive ? colors.brand[700] : colors.gray[700]}
                        style={styles.transcriptionSegmentText}
                      >
                        {segment.text}
                      </Typography>

                      {segment.start !== undefined &&
                        segment.start !== null &&
                        segment.end !== undefined &&
                        segment.end !== null && (
                          <Typography
                            variant="regularTxtxs"
                            color={colors.gray[500]}
                            style={styles.transcriptionTimestamp}
                          >
                            {formatSecondsToMinutes(segment.start)} -{' '}
                            {formatSecondsToMinutes(segment.end)}
                          </Typography>
                        )}
                    </View>
                  );
                })
              ) : (
                <Typography variant="regularTxtsm" color={colors.gray[700]} style={styles.transcriptionText}>
                  {transcriptionText}
                </Typography>
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default RapidlyInterviewCard;
