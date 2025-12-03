import React, { useState, useRef } from "react";
import { View, TouchableOpacity } from "react-native";
import Video from "react-native-video";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useStyles } from "./styles";
import Slider from "@react-native-community/slider";

const VideoPlayerBox = () => {
  const styles = useStyles();

  const videoRef = useRef(null);

  const [paused, setPaused] = useState(true);
  const [muted, setMuted] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const [volume, setVolume] = useState(0.7);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const onLoad = (data) => setDuration(data.duration);
  const onProgress = (data) => setCurrentTime(data.currentTime);

  const onSeek = (value) => {
    videoRef?.current?.seek(value);
    setCurrentTime(value);
  };

  return (
    <View style={styles.container}>
      {/* VIDEO */}
      <Video
        ref={videoRef}
        source={{ uri: "https://www.w3schools.com/html/mov_bbb.mp4" }}
        style={styles.video}
        paused={paused}
        muted={muted}
        volume={volume}
        resizeMode={isFullscreen ? "contain" : "cover"}
        onLoad={onLoad}
        onProgress={onProgress}
      />

      {/* CENTER PLAY BTN */}
      {paused && (
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => setPaused(false)}
        >
          <View style={styles.playCircle}>
            <Ionicons name="play" size={40} color="#fff" />
          </View>
        </TouchableOpacity>
      )}

      {/* BOTTOM CONTROLS */}
      <View style={styles.controlBar}>
        <View style={{flexDirection:'row'}}>
        {/* Play Pause */}
        <TouchableOpacity onPress={() => setPaused(!paused)}>
          <Ionicons name={paused ? "play" : "pause"} size={32} color="#fff" />
        </TouchableOpacity>

        {/* Volume Toggle */}
        <TouchableOpacity
          onPress={() => setShowVolumeSlider(!showVolumeSlider)}
        >
          <Ionicons
            name={muted ? "volume-mute" : "volume-medium"}
            size={32}
            color="#fff"
          />
        </TouchableOpacity>
        </View>

        {/* Fullscreen */}
        <TouchableOpacity onPress={() => setIsFullscreen(!isFullscreen)}>
          <Ionicons
            name={isFullscreen ? "contract-outline" : "expand-outline"}
            size={32}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      {/* 🎚️ VOLUME SLIDER POPUP */}
      {showVolumeSlider && (
       <View style={styles.volumeSliderContainer}>
       <View style={styles.rotateWrapper}>
         <Slider
           style={styles.verticalSlider}
           minimumValue={0}
           maximumValue={1}
           value={volume}
           step={0.05}
           minimumTrackTintColor="#fff"
           maximumTrackTintColor="gray"
           thumbTintColor="#fff"
           onValueChange={(value) => {
             setMuted(false);
             setVolume(value);
           }}
         />
       </View>
     </View>
      )}

      {/* SEEK BAR */}
      <Slider
        style={styles.seekBar}
        minimumValue={0}
        maximumValue={duration}
        value={currentTime}
        minimumTrackTintColor="#fff"
        maximumTrackTintColor="gray"
        thumbTintColor="#fff"
        onSlidingComplete={(value) => onSeek(value)}
      />
    </View>
  );
};

export default VideoPlayerBox;
