import React, { useRef, useState, useEffect, useMemo } from "react";
import {
  View,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Text,
  Dimensions,
  Modal,
  Platform,
} from "react-native";
import Video from "react-native-video";
import Slider from "@react-native-community/slider";
import Orientation from "react-native-orientation-locker";
import { SvgXml } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { videoButton } from "../../../assets/svg/videobutton";
import { sounIcon } from "../../../assets/svg/sound";
import { pauseVideoIcon } from "../../../assets/svg/pausevideo";
import { expandIcon } from "../../../assets/svg/expand";
import { playVideoIcon } from "../../../assets/svg/playvideoIcon";
import { muteVolumeIcon } from "../../../assets/svg/mutevoulme";
import { colors } from "../../../theme/colors";
import { styles } from "./styles";
import { VideoPlayerBoxProps } from "./videoplayer.d";

const formatTime = (seconds?: number) => {
  if (!isFinite(seconds as number) || seconds! < 0) {
    seconds = 0;
  }
  const mins = Math.floor(seconds! / 60);
  const secs = Math.floor(seconds! % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default function VideoPlayerBox({
  source,
  startTime = 0,
  duration: segmentDuration,
  initialTime,
  chapters,
  activeChapterIndex,
  onChapterChange,
  onProgress,
  fullscreen: externalFullscreen,
  resizeMode = "contain",
}: VideoPlayerBoxProps) {
  const videoRef = useRef<React.ElementRef<typeof Video>>(null);
  const navigation = useNavigation<any>();
  const { width, height } = Dimensions.get('window');
  const isLandscape = width > height;

  const hasChapters = Boolean(chapters && chapters.length > 0);
  const effectiveStartTime = hasChapters ? 0 : (startTime || initialTime || 0);

  const [isPaused, setIsPaused] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [internalFullscreen, setInternalFullscreen] = useState(false);
  const [videoFileDuration, setVideoFileDuration] = useState(0);
  const [currentDisplayTime, setCurrentDisplayTime] = useState(0);
  const [sliderWidth, setSliderWidth] = useState(0);
  const [loading, setLoading] = useState(true);

  const isSlidingRef = useRef(false);
  const seekingTargetRef = useRef<number | null>(null);
  const seekTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const effectiveDuration = useMemo(() => {
    if (segmentDuration && segmentDuration > 0) {
      return segmentDuration;
    }
    if (videoFileDuration > 0) {
      return Math.max(0, videoFileDuration - effectiveStartTime);
    }
    return 0;
  }, [segmentDuration, videoFileDuration, effectiveStartTime]);

  const hasSource = Boolean(source);
  const fullscreen = externalFullscreen !== undefined ? externalFullscreen : internalFullscreen;

  const seekToTime = (targetTime: number, isFromUserSeek = true) => {
    const clamped = Math.max(0, Math.min(effectiveDuration || 9999, targetTime));
    setCurrentDisplayTime(clamped);
    const targetAbsTime = hasChapters ? clamped : (effectiveStartTime + clamped);

    seekingTargetRef.current = targetAbsTime;
    if (seekTimeoutRef.current) {
      clearTimeout(seekTimeoutRef.current);
    }
    seekTimeoutRef.current = setTimeout(() => {
      seekingTargetRef.current = null;
    }, 800);

    videoRef.current?.seek(targetAbsTime);

    if (isFromUserSeek && hasChapters && chapters) {
      let activeIdx = 0;
      for (let i = chapters.length - 1; i >= 0; i--) {
        if (clamped >= chapters[i].time - 0.2) {
          activeIdx = i;
          break;
        }
      }
      if (activeIdx !== activeChapterIndex) {
        onChapterChange?.(activeIdx);
      }
    }

    onProgress?.({
      currentTime: clamped,
      absoluteTime: targetAbsTime,
      playableDuration: videoFileDuration,
    });
  };

  const togglePlayPause = () => {
    if (isPaused) {
      if (effectiveDuration > 0 && currentDisplayTime >= effectiveDuration - 0.5) {
        seekToTime(0);
      } else {
        const targetAbsTime = hasChapters ? currentDisplayTime : (effectiveStartTime + currentDisplayTime);
        videoRef.current?.seek(targetAbsTime);
      }
      setIsPaused(false);
    } else {
      setIsPaused(true);
    }
  };

  const toggleMute = () => setIsMuted((prev) => !prev);

  const wasLockedRef = useRef(false);

  const enterFullscreen = () => {
    if (externalFullscreen === undefined) {
      setInternalFullscreen(true);
    }
    wasLockedRef.current = true;
    Orientation.lockToLandscape();
  };

  const exitFullscreen = () => {
    if (externalFullscreen === undefined) {
      setInternalFullscreen(false);
    }
    wasLockedRef.current = false;
    Orientation.lockToPortrait();
  };

  const toggleFullscreen = () => {
    fullscreen ? exitFullscreen() : enterFullscreen();
  };

  useEffect(() => {
    setIsPaused(true);
    isSlidingRef.current = false;
    seekingTargetRef.current = null;
    setCurrentDisplayTime(0);
    setLoading(true);
    if (effectiveStartTime > 0) {
      videoRef.current?.seek(effectiveStartTime);
    }
  }, [source, effectiveStartTime]);

  useEffect(() => {
    if (
      hasChapters &&
      chapters &&
      activeChapterIndex !== undefined &&
      activeChapterIndex >= 0 &&
      activeChapterIndex < chapters.length
    ) {
      const targetTime = chapters[activeChapterIndex].time;
      if (Math.abs(currentDisplayTime - targetTime) > 0.5) {
        seekToTime(targetTime, false);
      }
    }
  }, [activeChapterIndex, hasChapters, chapters]);

  useEffect(() => {
    return () => {
      if (seekTimeoutRef.current) {
        clearTimeout(seekTimeoutRef.current);
      }
      if (wasLockedRef.current) {
        Orientation.lockToPortrait();
      }
    };
  }, []);

  const onLoad = (data: any) => {
    setVideoFileDuration(data.duration || 0);
    setCurrentDisplayTime(0);
    if (effectiveStartTime > 0) {
      videoRef.current?.seek(effectiveStartTime);
      setTimeout(() => {
        videoRef.current?.seek(effectiveStartTime);
      }, 50);
      setTimeout(() => {
        videoRef.current?.seek(effectiveStartTime);
      }, 200);
    }
    setLoading(false);
  };

  const onReadyForDisplay = () => {
    if (effectiveStartTime > 0) {
      videoRef.current?.seek(effectiveStartTime);
    }
  };

  const handleProgress = (data: any) => {
    if (isSlidingRef.current) {
      return;
    }
    const absTime = data.currentTime || 0;

    // If seeking is in progress, ignore stale incoming progress events until player arrives near target
    if (seekingTargetRef.current !== null) {
      if (Math.abs(absTime - seekingTargetRef.current) < 1.0) {
        seekingTargetRef.current = null;
      } else {
        return;
      }
    }

    const relTime = hasChapters ? absTime : Math.max(0, absTime - effectiveStartTime);

    // If segment reaches duration limit in non-chapter mode, pause and loop back
    if (!hasChapters && effectiveDuration > 0 && relTime >= effectiveDuration) {
      setIsPaused(true);
      setCurrentDisplayTime(0);
      videoRef.current?.seek(effectiveStartTime);
      onProgress?.({
        currentTime: 0,
        absoluteTime: effectiveStartTime,
        playableDuration: data.playableDuration,
      });
      return;
    }

    setCurrentDisplayTime(relTime);

    // If chapters are present, synchronize active chapter
    if (hasChapters && chapters) {
      let activeIdx = 0;
      for (let i = chapters.length - 1; i >= 0; i--) {
        if (relTime >= chapters[i].time - 0.2) {
          activeIdx = i;
          break;
        }
      }
      if (activeIdx !== activeChapterIndex) {
        onChapterChange?.(activeIdx);
      }
    }

    onProgress?.({
      currentTime: relTime,
      absoluteTime: absTime,
      playableDuration: data.playableDuration,
    });
  };

  const onEnd = () => {
    setIsPaused(true);
    setCurrentDisplayTime(0);
    videoRef.current?.seek(effectiveStartTime);
  };

  const progressPercent = effectiveDuration > 0 ? (currentDisplayTime / effectiveDuration) * 100 : 0;

  const videoContent = (
    <View style={[styles.container, fullscreen && styles.fullscreen]}>
      {!hasSource && <></>}

      {hasSource && (
        <>
          <Video
            ref={videoRef}
            source={{ uri: source }}
            style={[styles.video, fullscreen && styles.videoFullscreen]}
            paused={isPaused}
            muted={isMuted}
            resizeMode={resizeMode}
            fullscreen={false}
            fullscreenAutorotate={false}
            fullscreenOrientation="landscape"
            onLoad={onLoad}
            onReadyForDisplay={onReadyForDisplay}
            onProgress={handleProgress}
            onEnd={onEnd}
            progressUpdateInterval={200}
            ignoreSilentSwitch="ignore"
            playInBackground={false}
            playWhenInactive={false}
          />

          {loading && (
            <ActivityIndicator size="large" color="#fff" style={styles.loader} />
          )}

          {isPaused && !loading && (
            <TouchableOpacity
              style={styles.bigPlayButton}
              onPress={togglePlayPause}
            >
              <SvgXml xml={videoButton} />
            </TouchableOpacity>
          )}

          {!loading && (
            <View style={[styles.controls, fullscreen && styles.controlsFullscreen]}>
              <TouchableOpacity onPress={togglePlayPause} style={styles.controlButton}>
                {isPaused ? (
                  <SvgXml xml={playVideoIcon} />
                ) : (
                  <SvgXml xml={pauseVideoIcon} />
                )}
              </TouchableOpacity>

              <Text style={[styles.timeText, fullscreen && styles.timeTextFullscreen]}>
                {formatTime(currentDisplayTime)}
              </Text>

              {/* Segmented Timeline with Chapter Dots */}
              {hasChapters ? (
                <Pressable
                  style={styles.timelineTrackWrapper}
                  onLayout={(e) => setSliderWidth(e.nativeEvent.layout.width)}
                  onPress={(e) => {
                    if (sliderWidth <= 0 || effectiveDuration <= 0) return;
                    const locationX = e.nativeEvent.locationX;
                    const ratio = Math.max(0, Math.min(1, locationX / sliderWidth));
                    seekToTime(ratio * effectiveDuration);
                  }}
                >
                  <View style={styles.timelineTrack}>
                    <View style={[styles.timelineProgress, { width: `${progressPercent}%` }]} />
                    <View style={[styles.scrubberThumb, { left: `${progressPercent}%` }]} />

                    {/* Chapter Marker Dots (skip starting dot at 0:00) */}
                    {chapters?.map((ch, idx) => {
                      if (idx === 0 || ch.time <= 0.5) return null;
                      const dotLeftPct = effectiveDuration > 0 ? (ch.time / effectiveDuration) * 100 : 0;
                      const isPassed = currentDisplayTime >= ch.time;
                      return (
                        <TouchableOpacity
                          key={`ch-${idx}`}
                          style={[
                            styles.chapterDot,
                            { left: `${dotLeftPct}%` },
                            isPassed && styles.chapterDotPassed,
                          ]}
                          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                          onPress={() => seekToTime(ch.time, true)}
                        />
                      );
                    })}
                  </View>
                </Pressable>
              ) : (
                <Pressable
                  style={styles.slider}
                  onLayout={(e) => setSliderWidth(e.nativeEvent.layout.width)}
                  onPress={(e) => {
                    if (sliderWidth <= 0 || effectiveDuration <= 0) return;
                    const locationX = e.nativeEvent.locationX;
                    const ratio = Math.max(0, Math.min(1, locationX / sliderWidth));
                    seekToTime(ratio * effectiveDuration);
                  }}
                >
                  <Slider
                    style={StyleSheet.absoluteFillObject}
                    minimumValue={0}
                    maximumValue={effectiveDuration > 0 ? effectiveDuration : 1}
                    value={currentDisplayTime}
                    minimumTrackTintColor={colors.base.white}
                    maximumTrackTintColor="#555"
                    thumbTintColor="transparent"
                    onSlidingStart={() => {
                      isSlidingRef.current = true;
                    }}
                    onValueChange={(val) => {
                      setCurrentDisplayTime(val);
                    }}
                    onSlidingComplete={(val) => {
                      isSlidingRef.current = false;
                      seekToTime(val);
                    }}
                  />
                </Pressable>
              )}

              <Text style={[styles.timeText, fullscreen && styles.timeTextFullscreen]}>
                {formatTime(effectiveDuration)}
              </Text>

              <TouchableOpacity onPress={toggleMute} style={styles.controlButton}>
                {isMuted ? (
                  <SvgXml xml={muteVolumeIcon} />
                ) : (
                  <SvgXml xml={sounIcon} />
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={toggleFullscreen} style={styles.controlButton}>
                <SvgXml xml={expandIcon} />
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );

  return (
    <>
      {!fullscreen && videoContent}
      <Modal
        visible={fullscreen}
        transparent={false}
        animationType="fade"
        supportedOrientations={['landscape', 'landscape-left', 'landscape-right']}
        onRequestClose={exitFullscreen}
        statusBarTranslucent={Platform.OS === 'android'}
        presentationStyle={Platform.OS === 'ios' ? 'fullScreen' : undefined}
      >
        <View style={styles.modalContent}>
          <SafeAreaView 
            edges={Platform.OS === 'ios' ? ['bottom'] : ['left', 'right', 'bottom']} 
            style={styles.safeAreaContainer}
          >
            <View style={styles.fullscreenWrapper}>
              {videoContent}
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </>
  );
}
