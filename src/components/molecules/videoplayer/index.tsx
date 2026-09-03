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
  onProgress,
  fullscreen: externalFullscreen,
  resizeMode = "contain",
}: VideoPlayerBoxProps) {
  const videoRef = useRef<React.ElementRef<typeof Video>>(null);
  const navigation = useNavigation<any>();
  const { width, height } = Dimensions.get('window');
  const isLandscape = width > height;

  const effectiveStartTime = startTime || initialTime || 0;

  const [isPaused, setIsPaused] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [internalFullscreen, setInternalFullscreen] = useState(false);
  const [videoFileDuration, setVideoFileDuration] = useState(0);
  const [currentRelativeTime, setCurrentRelativeTime] = useState(0);
  const [sliderWidth, setSliderWidth] = useState(0);
  const [loading, setLoading] = useState(true);

  const isSlidingRef = useRef(false);

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

  const seekToRelativeTime = (relTime: number) => {
    const clampedRel = Math.max(0, Math.min(effectiveDuration || 9999, relTime));
    setCurrentRelativeTime(clampedRel);
    const targetAbsTime = effectiveStartTime + clampedRel;
    videoRef.current?.seek(targetAbsTime);
    onProgress?.({
      currentTime: clampedRel,
      absoluteTime: targetAbsTime,
      playableDuration: videoFileDuration,
    });
  };

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
    };
  }, []);

  const onLoad = (data: any) => {
    setVideoFileDuration(data.duration || 0);
    setCurrentRelativeTime(0);
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
    const relTime = Math.max(0, absTime - effectiveStartTime);

    // If segment reaches duration limit, pause and loop back to start of question
    if (effectiveDuration > 0 && relTime >= effectiveDuration) {
      setIsPaused(true);
      setCurrentRelativeTime(0);
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
  };

  const onEnd = () => {
    setIsPaused(true);
    setCurrentRelativeTime(0);
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
                {formatTime(currentRelativeTime)} / {formatTime(effectiveDuration)}
              </Text>

              <Pressable
                style={styles.slider}
                onLayout={(e) => setSliderWidth(e.nativeEvent.layout.width)}
                onPress={(e) => {
                  if (sliderWidth <= 0 || effectiveDuration <= 0) return;
                  const locationX = e.nativeEvent.locationX;
                  const ratio = Math.max(0, Math.min(1, locationX / sliderWidth));
                  seekToRelativeTime(ratio * effectiveDuration);
                }}
              >
                <Slider
                  style={StyleSheet.absoluteFillObject}
                  minimumValue={0}
                  maximumValue={effectiveDuration > 0 ? effectiveDuration : 1}
                  value={currentRelativeTime}
                  minimumTrackTintColor={colors.base.white}
                  maximumTrackTintColor="#555"
                  thumbTintColor="transparent"
                  onSlidingStart={() => {
                    isSlidingRef.current = true;
                  }}
                  onValueChange={(val) => {
                    setCurrentRelativeTime(val);
                  }}
                  onSlidingComplete={(val) => {
                    isSlidingRef.current = false;
                    seekToRelativeTime(val);
                  }}
                />
              </Pressable>

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
