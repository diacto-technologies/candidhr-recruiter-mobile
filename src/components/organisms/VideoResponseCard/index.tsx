import React, { useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Typography } from '../../atoms';
import Divider from '../../atoms/divider';
import VideoPlayerBox from '../../molecules/videoplayer';
import CopyText from '../../molecules/copyText';
import { colors } from '../../../theme/colors';
import { arrowDown } from '../../../assets/svg/arrowdown';
import { copyIcon } from '../../../assets/svg/copy';
import { formatMonDDYYYY, formatTime as globalFormatTime } from '../../../utils/dateformatter';
import { useStyles } from './styles';
import { VideoResponseCardProps, VideoResponseItem } from './types';

export * from './types';

const formatSecondsToMinutes = (seconds?: number | null) => {
  if (seconds == null || isNaN(seconds) || seconds < 0) {
    return '00:00';
  }
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export const VideoResponseCard: React.FC<VideoResponseCardProps> = ({
  responses = [],
  activeIndex: controlledActiveIndex,
  onActiveIndexChange,
  emptyMessage = 'Question-level video and transcription will appear here when response data is available.',
  headerRight,
  containerStyle,
}) => {
  const styles = useStyles();

  const [internalActiveIndex, setInternalActiveIndex] = useState(0);
  const [responseDropdownOpen, setResponseDropdownOpen] = useState(false);
  const [transcriptionView, setTranscriptionView] = useState<'continuous' | 'bytime'>('continuous');

  const activeIndex = controlledActiveIndex !== undefined ? controlledActiveIndex : internalActiveIndex;
  const selectedResponse = responses[activeIndex] || responses[0];
  const [currentTime, setCurrentTime] = useState(0);

  React.useEffect(() => {
    setCurrentTime(0);
  }, [selectedResponse?.id, selectedResponse?.videoFile, selectedResponse?.startTime, activeIndex]);

  const handleSelectIndex = (index: number) => {
    if (controlledActiveIndex === undefined) {
      setInternalActiveIndex(index);
    }
    onActiveIndexChange?.(index);
    setResponseDropdownOpen(false);
  };

  if (!responses || responses.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Typography variant="regularTxtsm" color={colors.gray[600]}>
          {emptyMessage}
        </Typography>
      </View>
    );
  }

  const transcriptionText = selectedResponse?.transcriptionText || 'No transcription available';
  const transcriptionSegments = selectedResponse?.transcriptionSegments || [];

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

  const videoPlayerKey = `vp_${selectedResponse?.id ?? activeIndex}_${selectedResponse?.videoFile ?? ''}_${selectedResponse?.startTime ?? 0}`;

  return (
    <View style={[styles.responsesCard, containerStyle]}>
      {/* Top Header Row */}
      <View style={styles.rowBetween}>
        <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
          Responses
        </Typography>

        <View style={styles.headerRightWrap}>
          <Typography variant="regularTxtsm" color={colors.gray[600]}>
            {`${activeIndex + 1}/${responses.length}`}
          </Typography>
          {headerRight}
        </View>
      </View>

      {/* Response Dropdown */}
      <View style={styles.responseDropdownWrapper}>
        <TouchableOpacity
          style={styles.responseDropdownButton}
          onPress={() => setResponseDropdownOpen(!responseDropdownOpen)}
        >
          <View style={styles.responseSelectedItem}>
            <View style={styles.responseSelectedContent}>
              <Typography variant="mediumTxtmd" color={colors.gray[900]} numberOfLines={1}>
                {selectedResponse?.questionText ?? '—'}
              </Typography>
            </View>
            <SvgXml xml={arrowDown} />
          </View>
        </TouchableOpacity>

        {responseDropdownOpen && (
          <View style={styles.responseDropdownContainer}>
            <ScrollView nestedScrollEnabled style={styles.responseDropdownScroll}>
              {responses.map((item, index) => {
                const isActive = index === activeIndex;
                return (
                  <TouchableOpacity
                    key={item.id || index}
                    style={[
                      styles.responseDropdownItem,
                      isActive && styles.responseDropdownItemActive,
                    ]}
                    onPress={() => handleSelectIndex(index)}
                  >
                    {item?.videoThumbnail ? (
                      <Image
                        source={{ uri: item.videoThumbnail }}
                        resizeMode="cover"
                        style={styles.responseThumbnail}
                      />
                    ) : (
                      <View style={styles.thumbnail} />
                    )}
                    <View style={styles.responseDropdownContent}>
                      <Typography
                        variant="mediumTxtmd"
                        color={colors.gray[900]}
                        numberOfLines={4}
                        ellipsizeMode="tail"
                      >
                        {item.questionText ?? '—'}
                      </Typography>
                      {Boolean(item.startedAt) && (
                        <Typography variant="regularTxtsm" color={colors.gray[600]}>
                          {formatMonDDYYYY(item.startedAt, 'DD MMM YYYY HH:mm', 'IST')}
                        </Typography>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}
      </View>

      {/* Tag Row: Duration & Started Date */}
      <View style={styles.tagRow}>
        <View style={styles.tag}>
          <Typography variant="regularTxtxs" color={colors.gray[700]}>
            Duration: {globalFormatTime(selectedResponse?.duration || 0)}
          </Typography>
        </View>

        {Boolean(selectedResponse?.startedAt) && (
          <View style={styles.tag}>
            <Typography variant="regularTxtxs" color={colors.gray[600]}>
              {formatMonDDYYYY(selectedResponse.startedAt, 'DD MMM YYYY HH:mm', 'IST')}
            </Typography>
          </View>
        )}
      </View>

      {/* Main Video Player */}
      <View style={styles.mainVideoCard}>
        <VideoPlayerBox
          key={videoPlayerKey}
          source={selectedResponse?.videoFile || ''}
          startTime={selectedResponse?.startTime || 0}
          duration={selectedResponse?.duration || 0}
          onProgress={(e) => setCurrentTime(e.currentTime || 0)}
        />
      </View>

      {/* Video Title */}
      {Boolean(selectedResponse?.questionText) && (
        <Typography variant="semiBoldTxtmd" color={colors.gray[900]} style={styles.videoTitle}>
          {selectedResponse.questionText}
        </Typography>
      )}

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
                      currentTime >= (w.start ?? 0) && currentTime <= (w.end ?? 0);

                    return (
                      <Typography
                        key={`${sIndex}-${wIndex}`}
                        variant="regularTxtsm"
                        style={[
                          styles.transcriptionText,
                          {
                            backgroundColor: isActive ? colors.brand[200] : 'transparent',
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
                    currentTime >= (segment.start ?? 0) &&
                    currentTime <= (segment.end ?? 0);

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

export default VideoResponseCard;