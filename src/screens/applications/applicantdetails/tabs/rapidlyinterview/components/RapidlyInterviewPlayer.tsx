import React, { useRef, useState, useMemo, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Pressable,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Platform,
  Dimensions,
} from 'react-native';
import Video from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { Typography } from '../../../../../../components';
import { colors } from '../../../../../../theme/colors';
import { RapidlyInterviewReportResponse } from '../../../../../../features/rapidhire/types';
import { playVideoIcon } from '../../../../../../assets/svg/playvideoIcon';
import { pauseVideoIcon } from '../../../../../../assets/svg/pausevideo';
import { sounIcon } from '../../../../../../assets/svg/sound';
import { muteVolumeIcon } from '../../../../../../assets/svg/mutevoulme';
import { expandIcon } from '../../../../../../assets/svg/expand';
import { videoButton } from '../../../../../../assets/svg/videobutton';
import { copyIcon } from '../../../../../../assets/svg/copy';
import CopyText from '../../../../../../components/molecules/copyText';
import { useStyles } from '../styles';

interface RapidlyInterviewPlayerProps {
  reportData: RapidlyInterviewReportResponse;
  candidateName: string;
  selectedQuestionIndex: number;
  onSelectQuestionIndex: (index: number) => void;
  onPressBreakdown?: () => void;
}

const formatTime = (seconds?: number) => {
  if (!isFinite(seconds as number) || seconds! < 0) {
    seconds = 0;
  }
  const mins = Math.floor(seconds! / 60);
  const secs = Math.floor(seconds! % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const RapidlyInterviewPlayer: React.FC<RapidlyInterviewPlayerProps> = ({
  reportData,
  candidateName,
  selectedQuestionIndex,
  onSelectQuestionIndex,
  onPressBreakdown,
}) => {
  const styles = useStyles();
  const videoRef = useRef<React.ElementRef<typeof Video>>(null);

  const [isPaused, setIsPaused] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoDuration, setVideoDuration] = useState(reportData.duration_seconds || 0);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timelineBarWidth, setTimelineBarWidth] = useState(0);

  const isSlidingRef = useRef(false);
  const wasLockedRef = useRef(false);

  // Parse questions and candidate responses
  const questions = useMemo(() => {
    if (reportData?.report?.questions?.length) {
      return reportData.report.questions;
    }
    const aiTurns = reportData?.report?.turns?.filter((t) => t.role === 'ai') ?? [];
    return aiTurns.map((turn, index) => ({
      text: turn.text,
      order: index,
    }));
  }, [reportData?.report?.questions, reportData?.report?.turns]);

  const candidateTurns = useMemo(() => {
    return reportData?.report?.turns?.filter((t) => t.role === 'candidate') ?? [];
  }, [reportData?.report?.turns]);

  const candidateTimelineItems = useMemo(() => {
    const items = reportData?.timeline ?? [];
    if (!items.length) return [];
    const candidateOnly = items.filter((item) => !item.role || (item.role as string) === 'candidate');
    if (candidateOnly.length > 0) return candidateOnly;
    return items;
  }, [reportData?.timeline]);

  const totalQuestions = Math.max(
    questions.length,
    candidateTurns.length,
    candidateTimelineItems.length,
    1
  );

  // Build question segments with exact timestamps
  const questionSegments = useMemo(() => {
    const list: Array<{
      index: number;
      questionText: string;
      answerText: string;
      startSec: number;
      endSec: number;
      durationSec: number;
      words: Array<{ word: string; start: number; end: number }>;
    }> = [];

    for (let i = 0; i < totalQuestions; i++) {
      const qText =
        questions[i]?.text ||
        candidateTurns[i]?.text ||
        (i === 0 ? 'Interview Question' : `Question ${i + 1}`);
      const answerTurn = candidateTurns[i];
      const timelineItem = candidateTimelineItems[i] || candidateTimelineItems[0];

      const startSec = timelineItem?.startMs ? timelineItem.startMs / 1000 : 0;
      let durationSec = 4;
      if (timelineItem?.endMs && timelineItem?.startMs) {
        durationSec = Math.max(1, Math.round((timelineItem.endMs - timelineItem.startMs) / 1000));
      } else if (reportData.duration_seconds) {
        durationSec = reportData.duration_seconds;
      }
      const endSec = timelineItem?.endMs ? timelineItem.endMs / 1000 : startSec + durationSec;

      const words = timelineItem?.words?.map((w) => ({
        word: w.w,
        start: w.start / 1000,
        end: w.end / 1000,
      })) || [];

      list.push({
        index: i,
        questionText: qText,
        answerText: answerTurn?.text || timelineItem?.text || reportData?.report?.transcript || '',
        startSec,
        endSec,
        durationSec,
        words,
      });
    }

    return list;
  }, [totalQuestions, questions, candidateTurns, candidateTimelineItems, reportData]);

  const activeQuestion = questionSegments[selectedQuestionIndex] || questionSegments[0];

  const totalDuration = useMemo(() => {
    if (videoDuration > 0) return videoDuration;
    if (reportData.duration_seconds && reportData.duration_seconds > 0) return reportData.duration_seconds;
    const lastSeg = questionSegments[questionSegments.length - 1];
    return lastSeg ? lastSeg.endSec : 1;
  }, [videoDuration, reportData.duration_seconds, questionSegments]);

  // Handle seeking
  const seekToTime = (timeInSec: number) => {
    const clamped = Math.max(0, Math.min(totalDuration, timeInSec));
    setCurrentTime(clamped);
    videoRef.current?.seek(clamped);

    // Update active question index based on seek target
    const targetIdx = questionSegments.findIndex(
      (seg) => clamped >= seg.startSec && clamped <= seg.endSec
    );
    if (targetIdx !== -1 && targetIdx !== selectedQuestionIndex) {
      onSelectQuestionIndex(targetIdx);
    }
  };

  const handleSelectQuestion = (index: number) => {
    if (index < 0 || index >= totalQuestions) return;
    onSelectQuestionIndex(index);
    const seg = questionSegments[index];
    if (seg) {
      seekToTime(seg.startSec);
    }
  };

  const handlePlayCurrentQuestion = () => {
    if (activeQuestion) {
      seekToTime(activeQuestion.startSec);
      setIsPaused(false);
    }
  };

  const handleTimelineTap = (e: any) => {
    if (timelineBarWidth <= 0 || totalDuration <= 0) return;
    const locationX = e.nativeEvent.locationX;
    const ratio = Math.max(0, Math.min(1, locationX / timelineBarWidth));
    const targetTime = ratio * totalDuration;
    seekToTime(targetTime);
  };

  const togglePlayPause = () => {
    setIsPaused((prev) => !prev);
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const enterFullscreen = () => {
    setIsFullscreen(true);
    wasLockedRef.current = true;
    Orientation.lockToLandscape();
  };

  const exitFullscreen = () => {
    setIsFullscreen(false);
    wasLockedRef.current = false;
    Orientation.lockToPortrait();
  };

  const toggleFullscreen = () => {
    isFullscreen ? exitFullscreen() : enterFullscreen();
  };

  useEffect(() => {
    return () => {
      if (wasLockedRef.current) {
        Orientation.lockToPortrait();
      }
    };
  }, []);

  const onLoad = (data: any) => {
    setVideoDuration(data.duration || reportData.duration_seconds || 0);
    setLoading(false);
  };

  const handleProgress = (data: any) => {
    if (isSlidingRef.current) return;
    const time = data.currentTime || 0;
    setCurrentTime(time);

    // Automatically synchronize active question as video plays across turns
    const currentIdx = questionSegments.findIndex(
      (seg) => time >= seg.startSec && time <= seg.endSec
    );
    if (currentIdx !== -1 && currentIdx !== selectedQuestionIndex) {
      onSelectQuestionIndex(currentIdx);
    }
  };

  const onEnd = () => {
    setIsPaused(true);
    setCurrentTime(0);
    videoRef.current?.seek(0);
  };

  // Word count of candidate answer
  const wordCount = useMemo(() => {
    if (activeQuestion.words.length > 0) {
      return activeQuestion.words.length;
    }
    const text = activeQuestion.answerText.trim();
    return text ? text.split(/\s+/).length : 0;
  }, [activeQuestion]);

  const progressPercent = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  const videoPlayerComponent = (
    <View style={[styles.rapidlyVideoContainer, isFullscreen && styles.rapidlyVideoFullscreen]}>
      <Video
        ref={videoRef}
        source={{ uri: reportData.recording_url || '' }}
        style={[styles.rapidlyVideo, isFullscreen && styles.rapidlyVideoFullscreenElement]}
        paused={isPaused}
        muted={isMuted}
        resizeMode="contain"
        fullscreen={false}
        onLoad={onLoad}
        onProgress={handleProgress}
        onEnd={onEnd}
        progressUpdateInterval={200}
        ignoreSilentSwitch="ignore"
        playInBackground={false}
        playWhenInactive={false}
      />

      {loading && (
        <ActivityIndicator size="large" color="#fff" style={styles.rapidlyLoader} />
      )}

      {isPaused && !loading && (
        <TouchableOpacity style={styles.rapidlyBigPlayButton} onPress={togglePlayPause}>
          <SvgXml xml={videoButton} />
        </TouchableOpacity>
      )}

      {/* Segmented Timeline Video Controls */}
      {!loading && (
        <View style={styles.rapidlyControlBar}>
          <TouchableOpacity onPress={togglePlayPause} style={styles.rapidlyControlButton}>
            <SvgXml xml={isPaused ? playVideoIcon : pauseVideoIcon} />
          </TouchableOpacity>

          <Typography variant="mediumTxtxs" color={colors.base.white} style={styles.rapidlyTimeText}>
            {formatTime(currentTime)}
          </Typography>

          {/* Segmented Chapter Timeline Bar */}
          <Pressable
            style={styles.rapidlyTimelineTrackWrapper}
            onLayout={(e) => setTimelineBarWidth(e.nativeEvent.layout.width)}
            onPress={handleTimelineTap}
          >
            <View style={styles.rapidlyTimelineTrack}>
              {/* Filled Progress */}
              <View style={[styles.rapidlyTimelineProgress, { width: `${progressPercent}%` }]} />

              {/* Scrubber Thumb */}
              <View style={[styles.rapidlyScrubberThumb, { left: `${progressPercent}%` }]} />

              {/* Chapter Markers for Each Question (skip starting dot at 0:00) */}
              {questionSegments.map((seg, idx) => {
                if (idx === 0 || seg.startSec <= 0.5) return null;
                const markerLeftPct = totalDuration > 0 ? (seg.startSec / totalDuration) * 100 : 0;
                const isPassed = currentTime >= seg.startSec;
                return (
                  <TouchableOpacity
                    key={`marker-${idx}`}
                    style={[
                      styles.rapidlyChapterMarker,
                      { left: `${markerLeftPct}%` },
                      isPassed && styles.rapidlyChapterMarkerPassed,
                    ]}
                    onPress={() => handleSelectQuestion(idx)}
                  />
                );
              })}
            </View>
          </Pressable>

          <Typography variant="mediumTxtxs" color={colors.gray[400]} style={styles.rapidlyTimeText}>
            {formatTime(totalDuration)}
          </Typography>

          <TouchableOpacity onPress={toggleMute} style={styles.rapidlyControlButton}>
            <SvgXml xml={isMuted ? muteVolumeIcon : sounIcon} />
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleFullscreen} style={styles.rapidlyControlButton}>
            <SvgXml xml={expandIcon} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.rapidlyWrapper}>
      {/* Top Header Row with Breakdown Action */}
      <View style={styles.rapidlyTopHeaderRow}>
        <Typography variant="semiBoldTxtlg" color={colors.gray[900]}>
          Interview Report
        </Typography>

        {onPressBreakdown && (
          <TouchableOpacity onPress={onPressBreakdown} style={styles.breakdownButton}>
            <Typography variant="semiBoldTxtxs" color={colors.brand[600]}>
              Breakdown
            </Typography>
          </TouchableOpacity>
        )}
      </View>

      {/* Main Video Player */}
      {!isFullscreen && videoPlayerComponent}

      {/* Fullscreen Modal */}
      <Modal
        visible={isFullscreen}
        transparent={false}
        animationType="fade"
        supportedOrientations={['landscape', 'landscape-left', 'landscape-right']}
        onRequestClose={exitFullscreen}
        statusBarTranslucent={Platform.OS === 'android'}
        presentationStyle={Platform.OS === 'ios' ? 'fullScreen' : undefined}
      >
        <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.rapidlyFullscreenSafeArea}>
          {videoPlayerComponent}
        </SafeAreaView>
      </Modal>

      {/* Dedicated Rapidly Questions Card */}
      <View style={styles.rapidlyQuestionCard}>
        {/* Header with Step Arrows */}
        <View style={styles.rapidlyCardHeaderRow}>
          <Typography variant="semiBoldTxtlg" color={colors.gray[900]}>
            Questions
          </Typography>

          <View style={styles.rapidlyStepperWrap}>
            <Typography variant="regularTxtsm" color={colors.gray[500]}>
              {`${selectedQuestionIndex + 1}/${totalQuestions}`}
            </Typography>

            <TouchableOpacity
              disabled={selectedQuestionIndex === 0}
              onPress={() => handleSelectQuestion(selectedQuestionIndex - 1)}
              style={[
                styles.rapidlyStepperBtn,
                selectedQuestionIndex === 0 && styles.rapidlyStepperBtnDisabled,
              ]}
            >
              <Typography
                variant="semiBoldTxtmd"
                color={selectedQuestionIndex === 0 ? colors.gray[300] : colors.gray[700]}
              >
                {'‹'}
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={selectedQuestionIndex === totalQuestions - 1}
              onPress={() => handleSelectQuestion(selectedQuestionIndex + 1)}
              style={[
                styles.rapidlyStepperBtn,
                selectedQuestionIndex === totalQuestions - 1 && styles.rapidlyStepperBtnDisabled,
              ]}
            >
              <Typography
                variant="semiBoldTxtmd"
                color={selectedQuestionIndex === totalQuestions - 1 ? colors.gray[300] : colors.gray[700]}
              >
                {'›'}
              </Typography>
            </TouchableOpacity>
          </View>
        </View>

        {/* Question Title */}
        <Typography variant="boldTxtxs" color={colors.brand[600]} style={styles.rapidlyQuestionBadge}>
          {`QUESTION ${selectedQuestionIndex + 1}`}
        </Typography>

        <Typography variant="semiBoldTxtmd" color={colors.gray[900]} style={styles.rapidlyQuestionTitle}>
          {activeQuestion.questionText}
        </Typography>

        {/* Candidate Response Section */}
        <View style={styles.rapidlyResponseHeaderRow}>
          <Typography variant="boldTxtxs" color={colors.gray[500]} style={styles.rapidlyResponseLabel}>
            {`${(candidateName || 'CANDIDATE').toUpperCase()}'S RESPONSE`}
          </Typography>

          <TouchableOpacity onPress={handlePlayCurrentQuestion} style={styles.rapidlyPlaySnippetBtn}>
            <Typography variant="semiBoldTxtxs" color={colors.brand[600]}>
              {`▷ ${formatTime(activeQuestion.durationSec)}`}
            </Typography>
          </TouchableOpacity>
        </View>

        {/* Word-by-Word Audio Sync Transcription */}
        <View style={styles.rapidlyTranscriptionWrap}>
          {activeQuestion.words.length > 0 ? (
            <View style={styles.rapidlyWordRow}>
              {activeQuestion.words.map((w, wIdx) => {
                const isWordActive = currentTime >= w.start && currentTime <= w.end;
                return (
                  <Typography
                    key={`w-${wIdx}`}
                    variant="regularTxtsm"
                    color={isWordActive ? colors.brand[700] : colors.gray[700]}
                    style={[
                      styles.rapidlyWordText,
                      isWordActive && styles.rapidlyWordActive,
                    ]}
                  >
                    {w.word + ' '}
                  </Typography>
                );
              })}
            </View>
          ) : (
            <Typography variant="regularTxtsm" color={colors.gray[700]} style={styles.rapidlyWordText}>
              {activeQuestion.answerText || 'No transcription available.'}
            </Typography>
          )}
        </View>

        {/* Bottom Word Count & Copy Pill */}
        <View style={styles.rapidlyCardFooterRow}>
          <Typography variant="regularTxtxs" color={colors.gray[500]}>
            {`🕒 ${wordCount} words`}
          </Typography>

          <CopyText text={activeQuestion.answerText} message="Transcription copied">
            <View style={styles.rapidlyCopyPill}>
              <SvgXml xml={copyIcon} width={14} height={14} />
              <Typography variant="mediumTxtxs" color={colors.gray[700]}>
                Copy
              </Typography>
            </View>
          </CopyText>
        </View>
      </View>
    </View>
  );
};
