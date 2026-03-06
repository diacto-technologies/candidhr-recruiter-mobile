import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  ViewStyle,
  TouchableOpacity,
  Image
} from "react-native";
import { useAppSelector } from "../../../../../../hooks/useAppSelector";
import {
  selectAssessmentDetailedReport,
  selectAssessmentReport,
} from "../../../../../../features/applications/selectors";
import { getAssessmentDetailedReportRequestAction } from "../../../../../../features/applications/actions";
import { useAppDispatch } from "../../../../../../hooks/useAppDispatch";
import CodingQuestionCard from "../codingquestioncard";
import Typography from "../../../../../../components/atoms/typography";
import { colors } from "../../../../../../theme/colors";
import Ring from "../../../../../../components/atoms/ring";
import Divider from "../../../../../../components/atoms/divider";
import VideoPlayerBox from "../../../../../../components/molecules/videoplayer";
import { useStyles } from "./styles";
import { SvgXml } from "react-native-svg";
import { arrowDown } from "../../../../../../assets/svg/arrowdown";
import SnapshotModal from "../../../../../../components/molecules/snapshotmodal";

type QuestionType = {
  isCorrect: boolean;
  id: number;
  time: string;
  difficulty: "Easy" | "Medium" | "Hard";
  type: "Multiple" | "Text" | "MCQ";
  question: string;
  chips?: {
    id: number;
    label: string;
    isCorrect: boolean;
    isSelected: boolean;
  }[];
  description?: string;
  aiScore?: number;
  aiNote?: string;
  aiBreakdown?: {
    label: string;
    note: string;
    score: number;
  }[];
  aiRelevanceReason?: string;
};

type AssessmentCard = {
  id: string;
  title: string;
  questions: number;
  correct: number;
  percent: number;
};

interface Props {
  style?: ViewStyle;
}

type TabType = "QUESTIONS" | "CODING";

const formatDifficulty = (difficulty?: string) => {
  if (!difficulty) return "Easy";
  return (
    difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
  ) as "Easy" | "Medium" | "Hard";
};

const formatQuestionType = (type?: string) => {
  switch (type) {
    case "multiple":
      return "Multiple";
    case "single":
      return "MCQ";
    case "text":
      return "Text";
    default:
      return "Text";
  }
};

const AssessmentsDetails = ({ style }: Props) => {
  const styles = useStyles();
  const [selectedAssessmentIndex, setSelectedAssessmentIndex] = useState(0);
  const [expandedAI, setExpandedAI] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("QUESTIONS");
  const [visibleCount, setVisibleCount] = useState(5);
  const [snapshotModalVisible, setSnapshotModalVisible] = useState(false);
  const [selectedSnapshot, setSelectedSnapshot] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const assessmentDetailedReport = useAppSelector(
    selectAssessmentDetailedReport
  );
  const assessmentReport = useAppSelector(selectAssessmentReport);
  const assessments = assessmentReport?.assessments ?? [];
  const assessmentLogId = assessmentReport?.id;
  const hasQuestions =
    (assessmentDetailedReport?.answers?.length ?? 0) > 0;

  const hasCoding =
    (assessmentDetailedReport?.submissions?.length ?? 0) > 0;

  const cards: AssessmentCard[] = assessments.map((item: any) => ({
    id: item?.id,
    title: item.name,
    questions: item.result?.question_count ?? 0,
    correct: item.result?.correct ?? 0,
    percent: item.result?.percentage ?? 0,
  }));


  useEffect(() => {
    if (!assessmentDetailedReport) return;

    const hasQuestions =
      (assessmentDetailedReport?.answers?.length ?? 0) > 0;

    const hasCoding =
      (assessmentDetailedReport?.submissions?.length ?? 0) > 0;

    if (!hasQuestions && hasCoding) {
      setActiveTab("CODING");
    }
    else {
      setActiveTab("QUESTIONS");
    }
  }, [assessmentDetailedReport]);


  const handleAssessmentSelect = (
    assessmentLogId: string,
    assessmentId: string,
    index: number,
    item: { questions: number }
  ) => {
    if (selectedAssessmentIndex === index) return;

    setSelectedAssessmentIndex(index);
    setActiveTab("QUESTIONS");

    dispatch(
      getAssessmentDetailedReportRequestAction({
        assessmentLogId,
        assessmentId,
      })
    );
  };



  const qs: QuestionType[] =
    assessmentDetailedReport?.answers?.map(
      (item: any, index: number) => {
        const choices = item.question?.choices
          ? JSON.parse(item.question.choices)
          : [];

        const selectedChoices = item.selected_choice ?? [];

        return {
          id: index + 1,
          isCorrect: Boolean(item.correct),
          time: `${item.duration} / ${item.question.time_limit} Sec.`,
          difficulty: formatDifficulty(
            item.question?.difficulty?.difficulty
          ),
          type: formatQuestionType(item.question?.type),
          question: item.question?.text ?? "_",

          chips:
            item.question?.type !== "text"
              ? choices.map((c: any) => ({
                id: c.id,
                label: c.value,
                isCorrect: Boolean(c.correct),
                isSelected: selectedChoices.some(
                  (s: any) => s.id === c.id
                ),
              }))
              : undefined,

          description:
            item.question?.type === "text"
              ? item.text?.trim() || "No response available."
              : undefined,

          aiScore: item.ai_score,
          aiNote: item.ai_note,
          aiBreakdown: item.ai_breakdown,
          aiRelevanceReason: item.ai_relevance_reason,
        };
      }
    ) ?? [];
  return (
    <View style={[styles.container, style]}>
      <Typography variant="semiBoldTxtlg" color={colors.gray[900]}>
        Assessments
      </Typography>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.topRow}
      >
        {cards.map((item, index) => (
          <View key={index} style={styles.topCard}>
            <TouchableOpacity
              style={[styles.topCardInner, {
                borderColor: selectedAssessmentIndex === index ? colors.brand[500]
                  : colors.gray[200]
              }]}
              onPress={() => {
                if (!assessmentLogId) return;

                handleAssessmentSelect(
                  assessmentLogId,
                  item?.id,
                  index,
                  item
                );
              }}>
              <Ring percent={item.percent} showText />

              <View style={{ gap: 2 }}>
                <Typography variant="semiBoldTxtmd">
                  {item.title}
                </Typography>

                <Typography variant="regularTxtsm" color={colors.gray[600]}>
                  Question:{" "}
                  <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                    {item.questions < 10
                      ? `0${item.questions}`
                      : item.questions}
                  </Typography>
                </Typography>

                <Typography variant="regularTxtsm" color={colors.gray[600]}>
                  Correct:{" "}
                  <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                    {item.correct < 10
                      ? `0${item.correct}`
                      : item.correct}
                  </Typography>
                </Typography>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {activeTab === "QUESTIONS" && hasQuestions && (
        <ScrollView nestedScrollEnabled>
          {qs.map((q) => (
            <View key={q.id} style={styles.qCard}>
              <View style={styles.qCardTop}>
                <Typography variant="regularTxtsm" color={colors.gray[600]}>
                  {q.time}
                </Typography>

                <View style={styles.topChips}>
                  <View
                    style={[
                      styles.smallChip,
                      {
                        backgroundColor: colors.brand[50],
                        borderColor: colors.brand[200],
                      },
                    ]}
                  >
                    <Typography variant="mediumTxtxs" color={colors.brand[700]}>
                      {q.difficulty}
                    </Typography>
                  </View>

                  <View
                    style={[
                      styles.smallChip,
                      {
                        backgroundColor: colors.warning[50],
                        borderColor: colors.warning[200],
                      },
                    ]}
                  >
                    <Typography variant="mediumTxtxs" color={colors.warning[700]}>
                      {q.type}
                    </Typography>
                  </View>
                </View>
              </View>

              <View style={{ padding: 12, gap: 12 }}>
                <Typography variant="mediumTxtmd" color={colors.gray[900]}>
                  {q.id}. {q.question}
                </Typography>

                {q.chips && (
                  <View style={{ gap: 12 }}>
                    {/* ---------- USER SELECTED ANSWERS ---------- */}
                    <View style={styles.optionRow}>
                      {(q.chips.some(c => c.isSelected)
                        ? q.chips.filter(c => c.isSelected)
                        : q.chips
                      ).map((c) => {
                        const isSelected = c.isSelected;
                        const isCorrect = c.isCorrect;

                        let backgroundColor = colors.gray[50];
                        let borderColor = colors.gray[200];
                        let textColor = colors.gray[700];

                        if (isSelected && isCorrect) {
                          backgroundColor = colors.success[50];
                          borderColor = colors.success[200];
                          textColor = colors.success[700];
                        } else if (isSelected && !isCorrect) {
                          backgroundColor = colors.error[50];
                          borderColor = colors.error[200];
                          textColor = colors.error[700];
                        }

                        return (
                          <View
                            key={c.id}
                            style={[
                              styles.optionChip,
                              { backgroundColor, borderColor },
                            ]}
                          >
                            <Typography variant="mediumTxtsm" color={textColor}>
                              {c.label}
                            </Typography>
                          </View>
                        );
                      })}

                      {/* ---------- NO SELECTION MESSAGE ---------- */}
                      {q.chips.every(c => !c.isSelected) && (
                        <Typography
                          variant="regularTxtsm"
                          color={colors.error[500]}
                        >
                          No option selected
                        </Typography>
                      )}
                    </View>


                    <Divider />

                    {/* ---------- CORRECT ANSWERS ---------- */}
                    <View style={{ gap: 6 }}>
                      <Typography
                        variant="mediumTxtsm"
                        color={colors.gray[600]}
                      >
                        Correct Answer
                      </Typography>

                      <View style={styles.optionRow}>
                        {q.chips
                          .filter(c => c.isCorrect)
                          .map((c) => (
                            <View
                              key={c.id}
                              style={[
                                styles.optionChip,
                                {
                                  backgroundColor: colors.success[50],
                                  borderColor: colors.success[200],
                                },
                              ]}
                            >
                              <Typography
                                variant="mediumTxtsm"
                                color={colors.success[700]}
                              >
                                {c.label}
                              </Typography>
                            </View>
                          ))}
                      </View>
                    </View>
                  </View>
                )}
                {q.description && (
                  <View
                    style={{
                      padding: 12,
                      borderRadius: 8,
                      backgroundColor: q.isCorrect
                        ? colors.success[50]
                        : colors.error[50],
                      borderWidth: 1,
                      borderColor: q.isCorrect
                        ? colors.success[200]
                        : colors.error[200],
                    }}
                  >
                    <Typography
                      variant="regularTxtsm"
                      color={
                        q.isCorrect
                          ? colors.success[700]
                          : colors.error[700]
                      }
                    >
                      {q.description}
                    </Typography>
                  </View>
                )}
                {/* 🔥 AI SECTION FOR TEXT QUESTIONS */}
                {q.type === "Text" && q.aiScore !== undefined && (
                  <View
                    style={{
                      marginTop: 12,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: colors.brand[100],
                      backgroundColor: colors.brand[25],
                      overflow: "hidden",
                    }}
                  >
                    {/* HEADER (Clickable) */}
                    <TouchableOpacity
                      onPress={() =>
                        setExpandedAI(expandedAI === q.id ? null : q.id)
                      }
                      style={{
                        padding: 16,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        // alignItems: "center",
                        marginRight: 10
                      }}
                    >
                      <View>
                        <Typography
                          variant="semiBoldTxtmd"
                          color={colors.gray[600]}
                        >
                          AI Score
                        </Typography>

                        <Typography
                          variant="semiBoldTxtxl"
                          color={colors.brand[600]}
                        >
                          {q.aiScore?.toFixed(2)}
                        </Typography>

                        {q.aiNote && (
                          <Typography
                            variant="regularTxtsm"
                            color={colors.gray[600]}
                          >
                            {q.aiNote}
                          </Typography>
                        )}
                      </View>

                      <SvgXml
                        xml={arrowDown}
                        width={20}
                        height={20}
                        style={{
                          transform: [
                            { rotate: expandedAI === q.id ? "180deg" : "0deg" },
                          ],
                        }}
                      />
                    </TouchableOpacity>

                    {/* EXPANDABLE CONTENT */}
                    {expandedAI === q.id && (
                      <View style={{ padding: 16, gap: 16 }}>
                        {/* BREAKDOWN */}
                        {q.aiBreakdown?.length > 0 && (
                          <View style={{ gap: 12 }}>
                            <Typography
                              variant="semiBoldTxtmd"
                              color={colors.gray[900]}
                            >
                              Breakdown
                            </Typography>

                            {q.aiBreakdown.map((b: any, i: number) => (
                              <View
                                key={i}
                                style={{
                                  padding: 12,
                                  borderRadius: 10,
                                  backgroundColor: colors.base.white,
                                  gap: 8,
                                  borderColor: colors.gray[200],
                                  borderWidth: 1,
                                }}
                              >
                                <View>
                                  <Typography
                                    variant="semiBoldTxtsm"
                                    color={colors.gray[900]}
                                  >
                                    {b.label}
                                  </Typography>

                                  <Typography
                                    variant="regularTxtsm"
                                    color={colors.gray[600]}
                                  >
                                    {b.note}
                                  </Typography>
                                </View>

                                <View
                                  style={{
                                    height: 6,
                                    backgroundColor: colors.gray[200],
                                    borderRadius: 4,
                                    overflow: "hidden",
                                  }}
                                >
                                  <View
                                    style={{
                                      width: `${(b.score ?? 0) * 100}%`,
                                      height: 6,
                                      backgroundColor: colors.brand[600],
                                    }}
                                  />
                                </View>
                              </View>
                            ))}
                          </View>
                        )}

                        {/* RELEVANCE */}
                        {q.aiRelevanceReason && (
                          <View
                            style={{
                              padding: 12,
                              borderRadius: 10,
                              backgroundColor: colors.base.white,
                              borderColor: colors.gray[200],
                              borderWidth: 1,
                            }}
                          >
                            <Typography
                              variant="semiBoldTxtsm"
                              color={colors.gray[900]}
                            >
                              Why relevance was judged this way
                            </Typography>

                            <Typography
                              variant="regularTxtsm"
                              color={colors.gray[700]}
                            >
                              {q.aiRelevanceReason}
                            </Typography>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* ---------- CODING TAB ---------- */}
      {activeTab === "CODING" && hasCoding && (
        <View>
          {assessmentDetailedReport?.submissions?.map(
            (item: any, index: number) => (
              <CodingQuestionCard
                key={item.id}
                index={index}
                title={item.question?.title}
                language={item.language}
                code={item.code}
                testCases={item.test_cases.map((tc: any) => ({
                  input: tc.input,
                  output: tc.stdout,
                  passed: tc.passed,
                }))}
                canEditCode={false}
              />
            )
          )}
        </View>
      )}

      {/* ---------- RECORDING ---------- */}
      {assessmentDetailedReport?.result?.proctoring?.video_thumbnail && (
        <View style={styles.videoSection}>
          <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
            Recording
          </Typography>

          <VideoPlayerBox
            source={
              assessmentDetailedReport?.result?.proctoring?.video_file ??
              ""
            }
          />
          {/* ================= GAZE SNAPSHOTS ================= */}
          {assessmentDetailedReport?.result?.proctoring?.gaze_snapshots?.length > 0 && (
            <View style={{ marginTop: 24, gap: 16 }}>
              {/* Header */}
              <View style={{ gap: 2 }}>
                <View style={{flexDirection:'row'}}>
                <Typography
                  variant="semiBoldTxtlg"
                  color={colors.gray[900]}
                >
                  Gaze snapshots
                </Typography>
                <View
                style={{
                  paddingHorizontal: 14,
                  //paddingVertical: 6,
                  borderRadius: 20,
                  backgroundColor: colors.gray[100],
                  alignSelf:'center'
                }}
              >
                <Typography
                  variant="mediumTxtsm"
                  color={colors.gray[700]}
                >
                  {
                    assessmentDetailedReport?.result?.proctoring?.gaze_snapshots
                      ?.length
                  }{" "}
                  captured
                </Typography>
              </View>
              </View>
                <Typography
                  variant="regularTxtsm"
                  color={colors.gray[600]}
                >
                  Extreme gaze moments from the proctoring video.
                </Typography>
              </View>
              {/* Grid */}
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                {assessmentDetailedReport?.result?.proctoring?.gaze_snapshots
                  ?.slice(0, visibleCount)
                  .map((snapshot) => (
                    <TouchableOpacity
                      key={snapshot.id}
                      onPress={() => {
                        setSelectedSnapshot(snapshot.image);
                        setSnapshotModalVisible(true);
                      }}
                      style={{
                        width: "48%",
                        aspectRatio: 1.6,
                        borderRadius: 16,
                        overflow: "hidden",
                        backgroundColor: colors.gray[100],
                        // marginBottom: 16,
                        // marginRight: index % 2 === 0 ? "4%" : 0,
                      }}
                    >
                      <Image
                        source={{ uri: snapshot.image }}
                        style={{ width: "100%", height: "100%" }}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  ))}

                {/* Show More Card */}
                {assessmentDetailedReport?.result?.proctoring?.gaze_snapshots
                  ?.length > visibleCount && (
                    <TouchableOpacity
                      onPress={() => setVisibleCount((prev) => prev + 5)}
                      style={{
                        width: "48%",
                        aspectRatio: 1.6,
                        borderRadius: 16,
                        borderWidth: 1,
                        borderStyle: "dashed",
                        borderColor: colors.brand[300],
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: colors.brand[50],
                        //gap: 6,
                      }}
                    >
                      <Typography
                        variant="semiBoldTxtlg"
                        color={colors.brand[600]}
                      >
                        +
                      </Typography>

                      <Typography
                        variant="semiBoldTxtsm"
                        color={colors.brand[600]}
                      >
                        Show next 5
                      </Typography>

                      <Typography
                        variant="regularTxtsm"
                        color={colors.brand[700]}
                      >
                        {assessmentDetailedReport?.result?.proctoring
                          ?.gaze_snapshots.length - visibleCount}{" "}
                        more
                      </Typography>
                    </TouchableOpacity>
                  )}
              </View>
            </View>
          )}
        </View>
      )}
      <SnapshotModal
        visible={snapshotModalVisible}
        imageUri={selectedSnapshot}
        onClose={() => {
          setSnapshotModalVisible(false);
          setSelectedSnapshot(null);
        }}
      />
    </View>
  );
};

export default AssessmentsDetails;