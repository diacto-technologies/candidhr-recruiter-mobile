import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Animated, Easing } from "react-native";
import Typography from "../../../atoms/typography";
import { colors } from "../../../../theme/colors";
import Sound from "react-native-sound";
import { SvgXml } from "react-native-svg";
import { pauseIcon } from "../../../../assets/svg/pause";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { selectResumeScreeningResponses, selectResumeScreeningResponsesLoading } from "../../../../features/applications/selectors";
import { pauseVideoIcon } from "../../../../assets/svg/pausevideo";
import { playVideoIcon } from "../../../../assets/svg/playvideoIcon";
import { playIcon } from "../../../../assets/svg/play";
import Shimmer from "../../../atoms/shimmer";

Sound.setCategory("Playback");


const ScreeningQuestionsShimmer = () => {
  return (
    <View style={styles.card}>
      {/* Title */}
      <Shimmer width="45%" height={20} />

      {/* Tabs */}
      <View style={styles.tabsRow}>
        {[1, 2, 3].map(i => (
          <Shimmer key={i} width={70} height={28} borderRadius={8} />
        ))}
      </View>

      {/* Questions */}
      {[1, 2, 3].map(i => (
        <View key={i} style={styles.innerCard}>
          <Shimmer width="90%" height={16} />

          {/* Audio / text placeholder */}
          <Shimmer width="100%" height={44} borderRadius={12} />
        </View>
      ))}
    </View>
  );
};

const ScreeningQuestions = () => {
  const screeningResponses = useAppSelector(selectResumeScreeningResponses);
  const loading = useAppSelector(selectResumeScreeningResponsesLoading);

  const [selectedTab, setSelectedTab] = useState<'All' | 'Audio' | 'Text'>('All');
  const [playingId, setPlayingId] = useState<number | null>(null);

  const soundRef = useRef<Sound | null>(null);
  const timersRef = useRef<Record<number, NodeJS.Timeout>>({});
  const progressAnimMap = useRef<Record<number, Animated.Value>>({}).current;

  const [progressMap, setProgressMap] = useState<
    Record<number, { current: number; duration: number }>
  >({});

  /* ------------------ FORMAT DATA ------------------ */
  const formattedData =
    screeningResponses?.map((item: any, idx: number) => ({
      id: idx + 1,
      type: item?.type, // 'audio' | 'text'
      question: item?.question?.text,
      textAnswer: item?.text,
      audioUrl: item?.audio_file,
    })) ?? [];

  const tabs: Array<'All' | 'Audio' | 'Text'> = ['All', 'Audio', 'Text'];

  const filteredData =
    selectedTab === 'All'
      ? formattedData
      : formattedData.filter((item) =>
          selectedTab === 'Audio'
            ? item.type === 'audio'
            : item.type === 'text'
        );

  const hasData = filteredData.length > 0;

  /* ------------------ HELPERS ------------------ */
  const formatTime = (sec: number) => {
    if (!sec) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' + s : s}`;
  };

  const cleanup = () => {
    if (soundRef.current) {
      soundRef.current.stop();
      soundRef.current.release();
      soundRef.current = null;
    }

    if (playingId && timersRef.current[playingId]) {
      clearInterval(timersRef.current[playingId]);
      delete timersRef.current[playingId];
    }

    if (playingId && progressAnimMap[playingId]) {
      progressAnimMap[playingId].stopAnimation();
      progressAnimMap[playingId].setValue(0);
    }
  };

  const togglePlay = (id: number, url?: string) => {
    if (!url) return;

    if (playingId === id) {
      cleanup();
      setPlayingId(null);
      return;
    }

    cleanup();

    const sound = new Sound(url, undefined, (err) => {
      if (err) {
        console.log('Sound load error:', err);
        return;
      }

      soundRef.current = sound;
      setPlayingId(id);

      const duration = sound.getDuration();

      setProgressMap((prev) => ({
        ...prev,
        [id]: { current: 0, duration },
      }));

      if (!progressAnimMap[id]) {
        progressAnimMap[id] = new Animated.Value(0);
      }

      Animated.timing(progressAnimMap[id], {
        toValue: 1,
        duration: duration * 1000,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();

      timersRef.current[id] = setInterval(() => {
        sound.getCurrentTime((current) => {
          setProgressMap((prev) => ({
            ...prev,
            [id]: { current, duration },
          }));
        });
      }, 300);

      sound.play(() => {
        cleanup();
        setPlayingId(null);
      });
    });
  };

  useEffect(() => {
    return () => cleanup();
  }, []);

  /* ------------------ LOADING ------------------ */
  if (loading) {
    return <ScreeningQuestionsShimmer />;
  }

  /* ------------------ UI ------------------ */
  return (
    <View style={styles.card}>
      <Typography variant="semiBoldTxtlg">Screening Questions</Typography>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setSelectedTab(tab)}
            style={[
              styles.tabBtn,
              selectedTab === tab
                ? styles.tabBtnActive
                : styles.tabBtnDeactive,
            ]}
          >
            <Typography
              variant="mediumTxtsm"
              color={
                selectedTab === tab
                  ? colors.brand[700]
                  : colors.gray[700]
              }
            >
              {tab}
            </Typography>
          </TouchableOpacity>
        ))}
      </View>

      {/* EMPTY STATE */}
      {!hasData && (
        <View style={styles.emptyState}>
          <View>
            <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
              No screening responses available
            </Typography>
            <Typography variant="regularTxtsm" color={colors.gray[500]}>
              When the candidate submits answers, they’ll show up here
              automatically.
            </Typography>
          </View>

          <View style={styles.avatarCircle}>
            <Typography variant="semiBoldTxtsm" color={colors.gray[600]}>
              Q/A
            </Typography>
          </View>
        </View>
      )}

      {/* LIST */}
      {hasData &&
        filteredData.map((item) => {
          const prog = progressMap[item.id] || { current: 0, duration: 0 };
          const anim = progressAnimMap[item.id] || new Animated.Value(0);

          const animatedWidth = anim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
          });

          return (
            <View key={item.id} style={styles.innerCard}>
              <Typography variant="mediumTxtmd">
                {item.id}. {item.question}
              </Typography>

              {item.type === 'audio' && (
                <View style={styles.audioBox}>
                  <TouchableOpacity
                    onPress={() => togglePlay(item.id, item.audioUrl)}
                  >
                    <SvgXml
                      xml={
                        playingId === item.id ? playIcon : pauseIcon
                      }
                      width={24}
                      height={24}
                    />
                  </TouchableOpacity>

                  <Typography variant="regularTxtsm">
                    {formatTime(prog.current)}
                  </Typography>

                  <View style={styles.progressBackground}>
                    <Animated.View
                      style={[
                        styles.progressFill,
                        { width: animatedWidth },
                      ]}
                    />
                  </View>

                  <Typography variant="regularTxtsm">
                    {formatTime(prog.duration)}
                  </Typography>
                </View>
              )}

              {item.type === 'text' && (
                <Typography variant="P2">
                  {item.textAnswer}
                </Typography>
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
    alignItems:'center',
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
    justifyContent:'center',
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
  emptyState: {
    borderRadius: 12,
    backgroundColor: colors.gray[50],
    flexDirection: 'row',
    alignSelf:'center',
    marginHorizontal: 20,
    padding:20
  },
  
  avatarCircle: {
    height: 48,
    width: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor:colors.gray[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
});
