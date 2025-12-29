import React, { useState, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Animated, Easing } from "react-native";
import Typography from "../../../atoms/typography";
import { colors } from "../../../../theme/colors";
import Sound from "react-native-sound";
import { SvgXml } from "react-native-svg";
import { playIcon } from "../../../../assets/svg/play";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { selectResumeScreeningResponses } from "../../../../features/applications/selectors";

Sound.setCategory("Playback");

const ScreeningQuestions = () => {
  const screeningResponses = useAppSelector(selectResumeScreeningResponses);

  const [selectedTab, setSelectedTab] = useState("All");
  const [playingId, setPlayingId] = useState<number | null>(null);

  const soundRef = useRef<Sound | null>(null);

  const [progressMap, setProgressMap] = useState<
    Record<number, { current: number; duration: number }>
  >({});

  const progressAnimMap = useRef<Record<number, Animated.Value>>({}).current;

  const formattedData =
    screeningResponses?.map((item, idx) => ({
      id: idx + 1,
      type: item.type,
      question: item.question.text,
      textAnswer: item.text,
      audioUrl: item.audio_file,
    })) ?? [];

  const tabs = ["All", "Audio", "Text"];

  const filteredData =
    selectedTab === "All"
      ? formattedData
      : formattedData.filter((item) =>
          selectedTab === "Audio" ? item.type === "audio" : item.type === "text"
        );

  // Format mm:ss
  const formatTime = (sec: number) => {
    if (!sec) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  // PLAY / PAUSE + Animation
  const togglePlay = (id: number, url: string | null) => {
    if (!url) return;

    // Pause same audio
    if (playingId === id) {
      soundRef.current?.pause();
      setPlayingId(null);
      progressAnimMap[id]?.stopAnimation();
      return;
    }

    // Stop previous audio
    if (soundRef.current) {
      soundRef.current.stop();
      soundRef.current.release();
    }

    const sound = new Sound(url, undefined, (err) => {
      if (err) {
        console.log("Sound load error:", err);
        return;
      }

      const dur = sound.getDuration();

      setProgressMap((prev) => ({
        ...prev,
        [id]: { current: 0, duration: dur },
      }));

      setPlayingId(id);

      // Create animation instance if not exists
      if (!progressAnimMap[id]) {
        progressAnimMap[id] = new Animated.Value(0);
      }

      const anim = progressAnimMap[id];
      anim.setValue(0);

      Animated.timing(anim, {
        toValue: 1,
        duration: dur * 1000,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();

      sound.play((success) => {
        setPlayingId(null);
        anim.setValue(0);

        setProgressMap((prev) => ({
          ...prev,
          [id]: { current: 0, duration: dur },
        }));

        sound.release();
      });

      // Track actual time
      const timer = setInterval(() => {
        if (playingId !== id || !soundRef.current) {
          clearInterval(timer);
          return;
        }

        sound.getCurrentTime((t) => {
          setProgressMap((prev) => ({
            ...prev,
            [id]: { ...prev[id], current: t },
          }));
        });
      }, 300);

      soundRef.current = sound;
    });
  };

  return (
    <View style={styles.card}>
      {/* TITLE */}
      <Typography variant="semiBoldTxtlg">Screening questions</Typography>

      {/* TABS */}
      <View style={styles.tabsRow}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setSelectedTab(tab)}
            style={[
              styles.tabBtn,
              selectedTab === tab ? styles.tabBtnActive : styles.tabBtnDeactive,
            ]}
          >
            <Typography
              variant="mediumTxtsm"
              color={selectedTab === tab ? colors.brand[700] : colors.gray[700]}
            >
              {tab}
            </Typography>
          </TouchableOpacity>
        ))}
      </View>

      {/* LIST */}
      {filteredData.map((item) => {
        const prog = progressMap[item.id] || { current: 0, duration: 0 };
        const anim = progressAnimMap[item.id] || new Animated.Value(0);

        const animatedWidth = anim.interpolate({
          inputRange: [0, 1],
          outputRange: ["0%", "100%"],
        });

        return (
          <View key={item.id} style={styles.innerCard}>
            <Typography variant="mediumTxtmd">{item.id}. {item.question}</Typography>

            {/* AUDIO PLAYER */}
            {item.type === "audio" && (
              <View style={styles.audioBox}>
                <TouchableOpacity onPress={() => togglePlay(item.id, item.audioUrl)}>
                  <SvgXml xml={playIcon} width={30} height={30} />
                </TouchableOpacity>

                {/* Current time */}
                <Typography variant="regularTxtsm">{formatTime(prog.current)}</Typography>

                {/* Progress bar */}
                <View style={styles.progressBackground}>
                  <Animated.View
                    style={[styles.progressFill, { width: animatedWidth }]}
                  />
                </View>

                {/* Duration */}
                <Typography variant="regularTxtsm">
                  {formatTime(prog.duration)}
                </Typography>
              </View>
            )}

            {/* TEXT RESPONSE */}
            {item.type === "text" && (
              <Typography variant="P2">{item.textAnswer}</Typography>
            )}
          </View>
        );
      })}
    </View>
  );
};

export default ScreeningQuestions;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.common.white,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  tabsRow: {
    flexDirection: "row",
    gap: 8,
  },
  tabBtn: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  tabBtnActive: {
    backgroundColor: colors.brand[50],
    borderColor: colors.brand[200],
    borderWidth: 1,
  },
  tabBtnDeactive: {
    backgroundColor: colors.gray[50],
    borderColor: colors.gray[200],
    borderWidth: 1,
  },
  innerCard: {
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 10,
    padding: 12,
    gap: 12,
  },
  audioBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.gray[100],
    padding: 12,
    borderRadius: 12,
  },
  progressBackground: {
    flex: 1,
    height: 10,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#635BFF",
    borderRadius: 10,
  },
});
