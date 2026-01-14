import React, { useRef, useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Text,
} from "react-native";
import Video from "react-native-video";
import Slider from "@react-native-community/slider";
import Orientation from "react-native-orientation-locker";
import { SvgXml } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";

import { videoButton } from "../../../assets/svg/videobutton";
import { sounIcon } from "../../../assets/svg/sound";
import { pauseVideoIcon } from "../../../assets/svg/pausevideo";
import { expandIcon } from "../../../assets/svg/expand";
import { playVideoIcon } from "../../../assets/svg/playvideoIcon";
import { muteVolumeIcon } from "../../../assets/svg/mutevoulme";
import { colors } from "../../../theme/colors";

interface VideoPlayerBoxProps {
  source: string;
  onProgress?: (data: {
    currentTime: number;
    playableDuration: number;
  }) => void;
}

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
  onProgress,
}: VideoPlayerBoxProps) {
  const videoRef = useRef<React.ElementRef<typeof Video>>(null);
  const navigation = useNavigation<any>();

  const [isPaused, setIsPaused] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(true);

  const hasSource = Boolean(source);

  const togglePlayPause = () => setIsPaused((prev) => !prev);
  const toggleMute = () => setIsMuted((prev) => !prev);

  const enterFullscreen = () => {
    Orientation.lockToLandscape();
    navigation.setOptions({ statusBarHidden: true });
    setFullscreen(true);
    videoRef.current?.presentFullscreenPlayer();
  };

  const exitFullscreen = () => {
    Orientation.unlockAllOrientations();
    navigation.setOptions({ statusBarHidden: false });
    setFullscreen(false);
    videoRef.current?.dismissFullscreenPlayer();
  };

  const toggleFullscreen = () => {
    fullscreen ? exitFullscreen() : enterFullscreen();
  };

  const onFullscreenPlayerWillPresent = () => {
    Orientation.lockToLandscape();
    navigation.setOptions({ statusBarHidden: true });
    setFullscreen(true);
  };

  const onFullscreenPlayerWillDismiss = () => {
    Orientation.unlockAllOrientations();
    navigation.setOptions({ statusBarHidden: false });
    setFullscreen(false);
  };

  useEffect(() => {
    return () => {
      Orientation.unlockAllOrientations();
      navigation.setOptions({ statusBarHidden: false });
    };
  }, [navigation]);

  const onLoad = (data: any) => {
    setDuration(data.duration || 0);
    setCurrentTime(0);
    setLoading(false);
  };

  const handleProgress = (data: any) => {
    setCurrentTime(Math.max(0, data.currentTime));
    onProgress?.(data);
  };

  const onEnd = () => {
    setIsPaused(true);
    setCurrentTime(0);
    videoRef.current?.seek(0);
  };

  return (
    <View style={[styles.container, fullscreen && styles.fullscreen]}>
      {!hasSource && (
        <View style={styles.noVideoBox}>
          <Text style={styles.noVideoText}>
            No introduction video uploaded by this candidate.
          </Text>
        </View>
      )}

      {hasSource && (
        <>
          <Video
            ref={videoRef}
            source={{ uri: source }}
            style={styles.video}
            paused={isPaused}
            muted={isMuted}
            resizeMode="contain"
            fullscreen={fullscreen}
            fullscreenOrientation="landscape"
            onLoad={onLoad}
            onProgress={handleProgress}
            onEnd={onEnd}
            onFullscreenPlayerWillPresent={onFullscreenPlayerWillPresent}
            onFullscreenPlayerWillDismiss={onFullscreenPlayerWillDismiss}
            progressUpdateInterval={500}
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
            <View style={styles.controls}>
              <TouchableOpacity onPress={togglePlayPause}>
                {isPaused ? (
                  <SvgXml xml={pauseVideoIcon} />
                ) : (
                  <SvgXml xml={playVideoIcon} />
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={toggleMute}>
                {isMuted ? (
                  <SvgXml xml={muteVolumeIcon} />
                ) : (
                  <SvgXml xml={sounIcon} />
                )}
              </TouchableOpacity>

              <Text style={styles.timeText}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </Text>

              <Slider
                style={{ flex: 1, marginHorizontal: 8 }}
                minimumValue={0}
                maximumValue={duration}
                value={currentTime}
                minimumTrackTintColor={colors.base.white}
                maximumTrackTintColor="#555"
                thumbTintColor="transparent"
                onSlidingComplete={(val) =>
                  videoRef.current?.seek(val)
                }
              />

              <TouchableOpacity onPress={toggleFullscreen}>
                <SvgXml xml={expandIcon} />
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 180,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  fullscreen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%",
    width: "100%",
    zIndex: 9999,
    borderRadius: 0,
  },
  video: {
    width: "100%",
    height: "100%",
  },
  noVideoBox: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  noVideoText: {
    color: "#444",
    fontSize: 14,
    textAlign: "center",
  },
  bigPlayButton: {
    position: "absolute",
    alignSelf: "center",
    top: "40%",
  },
  loader: {
    position: "absolute",
    top: "45%",
    left: "45%",
  },
  controls: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  timeText: {
    color: "#fff",
    fontSize: 12,
    marginHorizontal: 6,
    minWidth: 80,
    textAlign: "center",
  },
});
