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
  PanResponder,
} from "react-native";
import Video, { OnLoadData, OnProgressData, OnSeekData } from "react-native-video";
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
  chapters = [],
  activeChapterIndex,
  onChapterChange,
  seekToTime,
  onProgress,
  fullscreen: externalFullscreen,
  resizeMode = "contain",
}: VideoPlayerBoxProps) {
  const videoRef = useRef<React.ElementRef<typeof Video>>(null);
  const navigation = useNavigation<any>();

  const effectiveStartTime = startTime || initialTime || 0;

  const [isPaused, setIsPaused] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [internalFullscreen, setInternalFullscreen] = useState(false);
  const [videoFileDuration, setVideoFileDuration] = useState(0);
  const [currentRelativeTime, setCurrentRelativeTime] = useState(0);
  const [sliderWidth, setSliderWidth] = useState(0);
  const [loading, setLoading] = useState(true);

  const isSlidingRef = useRef(false);
  const sliderRef = useRef<View>(null);
  const sliderWidthRef = useRef(0);
  const sliderPageXRef = useRef(0);
  const lastChapterRef = useRef<number>(activeChapterIndex || 0);
  const savedTimeRef = useRef<number>(0);
  const needRestoreRef = useRef<boolean>(false);
  const isSeekingRef = useRef<boolean>(false);
  const seekTargetTimeRef = useRef<number | null>(null);
  const seekTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragStartTimeRef = useRef(0);
  const wasLockedRef = useRef(false);

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

  const measureSlider = () => {
    sliderRef.current?.measure((_x, _y, width, _height, pageX) => {
      if (width > 0) {
        sliderWidthRef.current = width;
        setSliderWidth(width);
      }
      if (pageX !== undefined && pageX > 0) {
        sliderPageXRef.current = pageX;
      }
    });
  };

  const seekToRelativeTime = (relTime: number, targetChapter?: number) => {
    const clampedRel = Math.max(0, Math.min(effectiveDuration || 9999, relTime));
    isSeekingRef.current = true;
    seekTargetTimeRef.current = clampedRel;
    savedTimeRef.current = clampedRel;
    setCurrentRelativeTime(clampedRel);

    if (targetChapter !== undefined) {
      lastChapterRef.current = targetChapter;
    } else if (chapters && chapters.length > 0) {
      let matched = 0;
      for (let i = 0; i < chapters.length; i++) {
        if (clampedRel >= chapters[i].time - 0.5) {
          matched = i;
        } else {
          break;
        }
      }
      lastChapterRef.current = matched;
      onChapterChange?.(matched);
    }

    const targetAbsTime = effectiveStartTime + clampedRel;
    videoRef.current?.seek(targetAbsTime);

    onProgress?.({
      currentTime: clampedRel,
      absoluteTime: targetAbsTime,
      playableDuration: videoFileDuration,
    });

    if (seekTimeoutRef.current) {
      clearTimeout(seekTimeoutRef.current);
    }
    seekTimeoutRef.current = setTimeout(() => {
      isSeekingRef.current = false;
      seekTargetTimeRef.current = null;
    }, 1200);
  };

  useEffect(() => {
    if (activeChapterIndex !== undefined && chapters && chapters[activeChapterIndex]) {
      const targetTime = chapters[activeChapterIndex].time;
      lastChapterRef.current = activeChapterIndex;
      if (Math.abs(currentRelativeTime - targetTime) > 0.5) {
        seekToRelativeTime(targetTime, activeChapterIndex);
        setIsPaused(false);
      }
    }
  }, [activeChapterIndex]);

  useEffect(() => {
    if (seekToTime !== undefined && seekToTime >= 0) {
      seekToRelativeTime(seekToTime);
      setIsPaused(false);
    }
  }, [seekToTime]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt) => {
          isSlidingRef.current = true;
          measureSlider();
          const currentWidth = sliderWidthRef.current || sliderWidth;
          if (currentWidth <= 0 || effectiveDuration <= 0) return;
          const touchX =
            sliderPageXRef.current > 0
              ? evt.nativeEvent.pageX - sliderPageXRef.current
              : evt.nativeEvent.locationX;
          const ratio = Math.max(0, Math.min(1, touchX / currentWidth));
          const newTime = ratio * effectiveDuration;
          dragStartTimeRef.current = newTime;
          setCurrentRelativeTime(newTime);
        },
        onPanResponderMove: (evt) => {
          const currentWidth = sliderWidthRef.current || sliderWidth;
          if (currentWidth <= 0 || effectiveDuration <= 0) return;
          const touchX =
            sliderPageXRef.current > 0
              ? evt.nativeEvent.pageX - sliderPageXRef.current
              : evt.nativeEvent.locationX;
          const ratio = Math.max(0, Math.min(1, touchX / currentWidth));
          const newTime = ratio * effectiveDuration;
          setCurrentRelativeTime(newTime);
        },
        onPanResponderRelease: (evt) => {
          isSlidingRef.current = false;
          const currentWidth = sliderWidthRef.current || sliderWidth;
          if (currentWidth <= 0 || effectiveDuration <= 0) return;
          const touchX =
            sliderPageXRef.current > 0
              ? evt.nativeEvent.pageX - sliderPageXRef.current
              : evt.nativeEvent.locationX;
          const ratio = Math.max(0, Math.min(1, touchX / currentWidth));
          let targetTime = ratio * effectiveDuration;

          // If tapped close to a chapter dot (within 3 seconds or 3%), snap to that chapter
          if (chapters && chapters.length > 1) {
            for (const ch of chapters) {
              if (Math.abs(targetTime - ch.time) < 3.0) {
                targetTime = ch.time;
                break;
              }
            }
          }

          seekToRelativeTime(targetTime);
          setIsPaused(false);
        },
      }),
    [sliderWidth, effectiveDuration, chapters]
  );

  const togglePlayPause = () => {
    if (isPaused) {
      if (effectiveDuration > 0 && currentRelativeTime >= effectiveDuration - 0.5) {
        seekToRelativeTime(0);
      } else {
        const targetAbsTime = effectiveStartTime + currentRelativeTime;
        videoRef.current?.seek(targetAbsTime);
      }
      setIsPaused(false);
    } else {
      setIsPaused(true);
    }
  };

  const toggleMute = () => setIsMuted((prev) => !prev);

  const enterFullscreen = () => {
    needRestoreRef.current = true;
    if (externalFullscreen === undefined) {
      setInternalFullscreen(true);
    }
    wasLockedRef.current = true;
    Orientation.lockToLandscape();
  };

  const exitFullscreen = () => {
    needRestoreRef.current = true;
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
    savedTimeRef.current = 0;
    needRestoreRef.current = false;
    setCurrentRelativeTime(0);
    setLoading(true);
    if (effectiveStartTime > 0) {
      videoRef.current?.seek(effectiveStartTime);
    }
  }, [source, effectiveStartTime]);

  useEffect(() => {
    return () => {
      if (wasLockedRef.current) {
        Orientation.lockToPortrait();
      }
      if (seekTimeoutRef.current) {
        clearTimeout(seekTimeoutRef.current);
      }
    };
  }, []);

  const onLoad = (data: OnLoadData) => {
    const dur = data.duration || 0;
    setVideoFileDuration(dur);
    setLoading(false);

    // Restore playback position ONLY when returning from fullscreen
    if (needRestoreRef.current && savedTimeRef.current > 0) {
      needRestoreRef.current = false;
      const restoreTime = savedTimeRef.current;
      isSeekingRef.current = true;
      seekTargetTimeRef.current = restoreTime;
      setCurrentRelativeTime(restoreTime);
      const targetAbs = effectiveStartTime + restoreTime;
      videoRef.current?.seek(targetAbs);
      setTimeout(() => {
        videoRef.current?.seek(targetAbs);
      }, 100);
      seekTimeoutRef.current = setTimeout(() => {
        isSeekingRef.current = false;
        seekTargetTimeRef.current = null;
      }, 1200);
    } else if (effectiveStartTime > 0) {
      videoRef.current?.seek(effectiveStartTime);
      setTimeout(() => {
        videoRef.current?.seek(effectiveStartTime);
      }, 50);
      setTimeout(() => {
        videoRef.current?.seek(effectiveStartTime);
      }, 200);
    } else {
      setCurrentRelativeTime(0);
    }
  };

  const onReadyForDisplay = () => {
    setLoading(false);
  };

  const onSeek = (_data: OnSeekData) => {
    isSeekingRef.current = false;
    seekTargetTimeRef.current = null;
    if (seekTimeoutRef.current) {
      clearTimeout(seekTimeoutRef.current);
      seekTimeoutRef.current = null;
    }
  };

  const handleProgress = (data: OnProgressData) => {
    if (isSlidingRef.current) {
      return;
    }
    const absTime = data.currentTime || 0;
    const relTime = Math.max(0, absTime - effectiveStartTime);

    // Ignore stale progress events while seeking
    if (isSeekingRef.current && seekTargetTimeRef.current !== null) {
      if (Math.abs(relTime - seekTargetTimeRef.current) > 1.2) {
        return; // Ignore stale pre-seek frame
      }
      isSeekingRef.current = false;
      seekTargetTimeRef.current = null;
      if (seekTimeoutRef.current) {
        clearTimeout(seekTimeoutRef.current);
        seekTimeoutRef.current = null;
      }
    }

    savedTimeRef.current = relTime;

    // If segment reaches duration limit, pause and loop back to start of question
    if (effectiveDuration > 0 && relTime >= effectiveDuration) {
      setIsPaused(true);
      setCurrentRelativeTime(0);
      savedTimeRef.current = 0;
      videoRef.current?.seek(effectiveStartTime);
      onProgress?.({
        currentTime: 0,
        absoluteTime: effectiveStartTime,
        playableDuration: data.playableDuration,
      });
      return;
    }

    setCurrentRelativeTime(relTime);
    onProgress?.({
      currentTime: relTime,
      absoluteTime: absTime,
      playableDuration: data.playableDuration,
    });

    if (chapters && chapters.length > 0 && onChapterChange) {
      let matched = 0;
      for (let i = 0; i < chapters.length; i++) {
        if (relTime >= chapters[i].time - 0.2) {
          matched = i;
        } else {
          break;
        }
      }
      if (matched !== lastChapterRef.current) {
        lastChapterRef.current = matched;
        onChapterChange(matched);
      }
    }
  };

  const onEnd = () => {
    setIsPaused(true);
    setCurrentRelativeTime(0);
    savedTimeRef.current = 0;
    videoRef.current?.seek(effectiveStartTime);
  };

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
            onSeek={onSeek}
            onEnd={onEnd}
            progressUpdateInterval={250}
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

              <TouchableOpacity onPress={toggleMute} style={styles.controlButton}>
                {isMuted ? (
                  <SvgXml xml={muteVolumeIcon} />
                ) : (
                  <SvgXml xml={sounIcon} />
                )}
              </TouchableOpacity>

              <Text style={[styles.timeText, fullscreen && styles.timeTextFullscreen]}>
                {formatTime(currentRelativeTime)}
              </Text>

              <View
                ref={sliderRef}
                style={styles.slider}
                onLayout={(e) => {
                  const w = e.nativeEvent.layout.width;
                  if (w > 0) {
                    sliderWidthRef.current = w;
                    setSliderWidth(w);
                  }
                  measureSlider();
                }}
                {...panResponder.panHandlers}
              >
                {/* Track Background */}
                <View style={styles.trackBackground} pointerEvents="none" />

                {/* Played Progress */}
                <View
                  pointerEvents="none"
                  style={[
                    styles.trackProgress,
                    {
                      width: `${
                        effectiveDuration > 0
                          ? Math.max(0, Math.min(100, (currentRelativeTime / effectiveDuration) * 100))
                          : 0
                      }%`,
                    },
                  ]}
                />

                {/* Chapter Separation Dots (only for questions after Q1) */}
                {chapters && chapters.length > 1 && (
                  <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
                    {chapters.map((ch, idx) => {
                      if (idx === 0 || ch.time <= 0.5) return null;
                      const dotPercent =
                        effectiveDuration > 0
                          ? Math.max(0, Math.min(100, (ch.time / effectiveDuration) * 100))
                          : 0;
                      if (dotPercent < 2 || dotPercent > 98) return null;
                      const isPassed = currentRelativeTime >= ch.time;
                      return (
                        <View
                          key={`ch-dot-${idx}`}
                          style={[styles.chapterDotTouchArea, { left: `${dotPercent}%` }]}
                        >
                          <View
                            style={[
                              styles.chapterDot,
                              isPassed && styles.chapterDotPassed,
                            ]}
                          />
                        </View>
                      );
                    })}
                  </View>
                )}

                {/* Clean solid white circle Thumb */}
                <View
                  pointerEvents="none"
                  style={[
                    styles.thumb,
                    {
                      left: `${
                        effectiveDuration > 0
                          ? Math.max(0, Math.min(100, (currentRelativeTime / effectiveDuration) * 100))
                          : 0
                      }%`,
                    },
                  ]}
                />
              </View>

              <Text style={[styles.timeText, fullscreen && styles.timeTextFullscreen]}>
                {formatTime(effectiveDuration)}
              </Text>

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
      {fullscreen ? (
        <Modal
          visible={true}
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
      ) : (
        videoContent
      )}
    </>
  );
}
