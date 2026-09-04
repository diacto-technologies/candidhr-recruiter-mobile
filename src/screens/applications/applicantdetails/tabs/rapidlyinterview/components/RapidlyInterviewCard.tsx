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
}

export const RapidlyInterviewCard: React.FC<RapidlyInterviewCardProps> = ({
  responses = [],
  activeIndex,
  onActiveIndexChange,
  headerRight,
}) => {
  const styles = useStyles();
  const [currentTime, setCurrentTime] = useState(0);

  const selectedResponse = responses[activeIndex] || responses[0];

  const chapters = useMemo(() => {
    return responses.map((r, idx) => ({
      time: r.startTime || 0,
      title: r.questionText || `Question ${idx + 1}`,
    }));
  }, [responses]);

  const totalVideoDuration = useMemo(() => {
    let maxTime = 0;
    responses.forEach((r) => {
      const end = (r.startTime || 0) + (r.duration || 0);
      if (end > maxTime) maxTime = end;
    });
    return maxTime || selectedResponse?.duration || 0;
  }, [responses, selectedResponse]);

  const handleSelectIndex = (index: number) => {
    if (index < 0 || index >= responses.length) return;
    onActiveIndexChange(index);
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

  const transcriptionText = selectedResponse?.transcriptionText || 'No transcription available';
  const transcriptionSegments = selectedResponse?.transcriptionSegments || [];

  return (
    <View style={styles.rapidlyCardContainer}>
      {/* Top Header Row with Questions & Stepper Buttons */}
      <View style={styles.rapidlyCardHeaderRow}>
        <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
          Questions
        </Typography>

        <View style={styles.rapidlyHeaderRightWrap}>
          {headerRight}

          <View style={styles.rapidlyStepperWrap}>
            <Typography variant="regularTxtsm" color={colors.gray[600]}>
              {`${activeIndex + 1} / ${responses.length}`}
            </Typography>

            <TouchableOpacity
              disabled={activeIndex === 0}
              onPress={() => handleSelectIndex(activeIndex - 1)}
              style={[
                styles.rapidlyStepperBtn,
                activeIndex === 0 && styles.rapidlyStepperBtnDisabled,
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
                styles.rapidlyStepperBtn,
                activeIndex === responses.length - 1 && styles.rapidlyStepperBtnDisabled,
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
        </View>
      </View>

      {/* Main Continuous Video Player with Chapter Dots */}
      <View style={styles.rapidlyVideoWrapper}>
        <VideoPlayerBox
          key={`rapidly_${responses[0]?.videoFile || 'vid'}`}
          source={responses[0]?.videoFile || ''}
          startTime={0}
          duration={totalVideoDuration}
          chapters={chapters}
          activeChapterIndex={activeIndex}
          onChapterChange={handleSelectIndex}
          onProgress={(e) => setCurrentTime(e.currentTime || 0)}
        />
      </View>

      {/* Question Title */}
      {Boolean(selectedResponse?.questionText) && (
        <Typography variant="semiBoldTxtmd" color={colors.gray[900]} style={styles.rapidlyQuestionTitleText}>
          {selectedResponse.questionText}
        </Typography>
      )}

      {/* Transcription Section */}
      <View style={styles.rapidlyTranscriptionSection}>
        <Divider />
        <View style={styles.rapidlyTranscriptionHeader}>
          <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
            Transcription
          </Typography>
          <CopyText text={transcriptionText} message="Transcription copied">
            <SvgXml xml={copyIcon} />
          </CopyText>
        </View>

        {/* Direct Continuous Word-by-Word Highlight */}
        <View style={styles.rapidlyTranscriptionContent}>
          {transcriptionSegments.length > 0 &&
          transcriptionSegments.some((s) => s.words && s.words.length > 0) ? (
            <View style={styles.rapidlyWordWrap}>
              {transcriptionSegments.map((seg, sIndex) =>
                seg.words?.map((w, wIndex) => {
                  const isActive =
                    currentTime >= (w.start ?? 0) && currentTime <= (w.end ?? 0);

                  return (
                    <Typography
                      key={`${sIndex}-${wIndex}`}
                      variant="regularTxtsm"
                      style={[
                        styles.rapidlyTranscriptionText,
                        {
                          backgroundColor: isActive ? colors.brand[100] : 'transparent',
                        },
                        styles.rapidlyWordHighlight,
                      ]}
                    >
                      {w.word + ' '}
                    </Typography>
                  );
                })
              )}
            </View>
          ) : (
            <Typography variant="regularTxtsm" color={colors.gray[700]} style={styles.rapidlyTranscriptionText}>
              {transcriptionText}
            </Typography>
          )}
        </View>
      </View>
    </View>
  );
};
