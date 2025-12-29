import React, { useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Text,
} from "react-native";
import Video from "react-native-video";
import Slider from "@react-native-community/slider";
import Orientation from "react-native-orientation-locker";
import { SvgXml } from "react-native-svg";

import { videoButton } from "../../../assets/svg/videobutton";
import { sounIcon } from "../../../assets/svg/sound";
import { pauseVideoIcon } from "../../../assets/svg/pausevideo";
import { expandIcon } from "../../../assets/svg/expand";
import { playVideoIcon } from "../../../assets/svg/playvideoIcon";
import { muteVolumeIcon } from "../../../assets/svg/mutevoulme";
import { colors } from "../../../theme/colors";

interface VideoPlayerBoxProps {
  source: string;
  onProgress?: (data: { currentTime: number; playableDuration: number }) => void;
}

/* ---------------- TIME FORMATTER ---------------- */
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

export default function VideoPlayerBox({ source, onProgress }: VideoPlayerBoxProps) {
  const videoRef = useRef<Video>(null);

  const [isPaused, setIsPaused] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(true);

  /* ---------------- HANDLERS ---------------- */

  const togglePlayPause = () => {
    setIsPaused((prev) => !prev);
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const toggleFullscreen = () => {
    if (fullscreen) {
      Orientation.unlockAllOrientations();
      StatusBar.setHidden(false);
      setFullscreen(false);
    } else {
      Orientation.lockToLandscape();
      StatusBar.setHidden(true);
      setFullscreen(true);
    }
  };

  const onLoad = (data: any) => {
    setDuration(data.duration);
    setLoading(false);
  };

  const handleProgress = (data: any) => {
    setCurrentTime(data.currentTime);
    onProgress?.(data);
  };

  const onEnd = () => {
    setIsPaused(true);
    setCurrentTime(0);
    videoRef.current?.seek(0);
  };

  /* ---------------- RENDER ---------------- */

  return (
    <View style={[styles.container, fullscreen && styles.fullscreen]}>
      {/* VIDEO */}
      <Video
        ref={videoRef}
        source={{ uri: source }}
        style={styles.video}
        paused={isPaused}
        muted={isMuted}
        resizeMode="contain"
        onLoad={onLoad}
        onProgress={handleProgress}
        onEnd={onEnd}
        progressUpdateInterval={500}
      />

      {/* LOADER */}
      {loading && (
        <ActivityIndicator size="large" color="#fff" style={styles.loader} />
      )}

      {/* BIG PLAY BUTTON */}
      {isPaused && !loading && (
        <TouchableOpacity
          style={styles.bigPlayButton}
          onPress={togglePlayPause}
        >
          <SvgXml xml={videoButton} />
        </TouchableOpacity>
      )}

      {/* CONTROLS */}
      {!loading && (
        <View style={styles.controls}>
          {/* Play / Pause */}
          <TouchableOpacity onPress={togglePlayPause}>
            {isPaused ?
              <SvgXml
                xml={pauseVideoIcon}
                color={colors.base.white}
              />
              :
              <SvgXml
                xml={playVideoIcon}
                color={colors.base.white}
                style={{ marginHorizontal: 8 }}
              />
            }
          </TouchableOpacity>

          {/* Volume */}
          <TouchableOpacity onPress={toggleMute}>
            {isMuted ?
              <SvgXml
                xml={muteVolumeIcon}
                color={colors.base.white}
              />
              :
              <SvgXml
                xml={sounIcon}
                color={colors.base.white}
              />
            }
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
            //disabled
            onSlidingComplete={(val) =>
              videoRef.current?.seek(val)
            }
          />

          {/* Fullscreen */}
          <TouchableOpacity onPress={toggleFullscreen}>
            <SvgXml xml={expandIcon} color={colors.base.white} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

/* ---------------- STYLES ---------------- */

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
