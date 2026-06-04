import React, { useState, useMemo } from "react";
import { View, TouchableOpacity, Animated } from "react-native";
import { SvgXml } from "react-native-svg";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { selectResumeScreeningResponses, selectResumeScreeningResponsesLoading } from "../../../features/applications/selectors";
import Shimmer from "../../../components/atoms/shimmer";
import Typography from "../../../components/atoms/typography";
import { colors } from "../../../theme/colors";
import { playIcon } from "../../../assets/svg/play";
import { pauseIcon } from "../../../assets/svg/pause";
import { useAudioPlayer } from "../../../hooks/useAudioPlayer";
import { ScreeningQuestionsProps } from "./screeningquestions.d";
import { useStyles } from "./styles";

const ScreeningQuestionsShimmer = () => {
  const styles = useStyles();

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

const ScreeningQuestions: React.FC<ScreeningQuestionsProps> = () => {
  const screeningResponses = useAppSelector(selectResumeScreeningResponses);
  const loading = useAppSelector(selectResumeScreeningResponsesLoading);
  const styles = useStyles();

  const [selectedTab, setSelectedTab] = useState<'All' | 'Audio' | 'Text'>('All');

  const {
    playingId,
    progressMap,
    progressAnimMap,
    togglePlay,
    handleSeek,
    setProgressBarWidth,
  } = useAudioPlayer();

  /* ------------------ FORMAT DATA ------------------ */
  const formattedData = useMemo(() => {
    return (screeningResponses ?? []).map((item: any, idx: number) => {
      const type: 'audio' | 'text' =
        (item?.response_type ?? item?.type) === 'audio' ? 'audio' : 'text';

      const question =
        item?.question_text ??
        item?.question?.text ??
        '';

      const textAnswer =
        item?.text_answer ??
        item?.text ??
        '';

      const audioUrl =
        item?.audio_url ??
        item?.audio_file ??
        undefined;

      return {
        id: idx + 1,
        type,
        question,
        textAnswer,
        audioUrl,
      };
    });
  }, [screeningResponses]);

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
          <View style={styles.emptyStateTextContainer}>
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
                        playingId === item.id ? playIcon:pauseIcon
                      }
                      width={24}
                      height={24}
                    />
                  </TouchableOpacity>

                  <Typography variant="regularTxtsm">
                    {formatTime(prog.current)}
                  </Typography>

                  <TouchableOpacity
                    style={styles.progressBackground}
                    onLayout={(e) => {
                      setProgressBarWidth(e.nativeEvent.layout.width);
                    }}
                    onPress={(e) => {
                      handleSeek(item.id, e.nativeEvent.locationX);
                    }}
                    activeOpacity={1}
                  >
                    <Animated.View
                      style={[
                        styles.progressFill,
                        { width: animatedWidth },
                      ]}
                    />
                  </TouchableOpacity>

                  <Typography variant="regularTxtsm">
                    {prog.duration ? formatTime(prog.duration) : ''}
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