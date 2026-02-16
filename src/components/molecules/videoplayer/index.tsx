import React, { useRef, useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
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

interface VideoPlayerBoxProps {
  source: string;
  onProgress?: (data: {
    currentTime: number;
    playableDuration: number;
  }) => void;
  fullscreen?: boolean;
  resizeMode?: "contain" | "cover" | "stretch";
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
  fullscreen: externalFullscreen,
  resizeMode = "contain",
}: VideoPlayerBoxProps) {
  const videoRef = useRef<React.ElementRef<typeof Video>>(null);
  const navigation = useNavigation<any>();
  const { width, height } = Dimensions.get('window');
  const isLandscape = width > height;

  const [isPaused, setIsPaused] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [internalFullscreen, setInternalFullscreen] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(true);

  const hasSource = Boolean(source);
  const fullscreen = externalFullscreen !== undefined ? externalFullscreen : internalFullscreen;

  const togglePlayPause = () => setIsPaused((prev) => !prev);
  const toggleMute = () => setIsMuted((prev) => !prev);

  const enterFullscreen = () => {
    if (externalFullscreen === undefined) {
      setInternalFullscreen(true);
    }
    Orientation.lockToLandscape();
    // Status bar will be handled by Modal's presentationStyle on iOS
    // For Android, we use statusBarTranslucent prop on Modal
  };

  const exitFullscreen = () => {
    if (externalFullscreen === undefined) {
      setInternalFullscreen(false);
    }
    Orientation.unlockAllOrientations();
  };

  const toggleFullscreen = () => {
    fullscreen ? exitFullscreen() : enterFullscreen();
  };

  useEffect(() => {
    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);

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

  const videoContent = (
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
            style={[styles.video, fullscreen && styles.videoFullscreen]}
            paused={isPaused}
            muted={isMuted}
            resizeMode={resizeMode}
            fullscreen={false}
            fullscreenAutorotate={true}
            fullscreenOrientation="landscape"
            onLoad={onLoad}
            onProgress={handleProgress}
            onEnd={onEnd}
            progressUpdateInterval={500}
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
                  <SvgXml xml={pauseVideoIcon} />
                ) : (
                  <SvgXml xml={playVideoIcon} />
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
                {formatTime(currentTime)} / {formatTime(duration)}
              </Text>

              <Slider
                style={styles.slider}
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
