import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ViewStyle,
  Touchable,
  TouchableOpacity,
} from "react-native";

import { colors } from "../../../../theme/colors";
import Typography from "../../../atoms/typography";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import {
  selectAssessmentDetailedReport,
  selectAssessmentReport,
} from "../../../../features/applications/selectors";
import Ring from "../../../atoms/ring";
import VideoPlayerBox from "../../../molecules/videoplayer";
import { getAssessmentDetailedReportRequestAction } from "../../../../features/applications/actions";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import CodingQuestionCard from "./codingquestioncard";
import Divider from "../../../atoms/divider";

type QuestionType = {
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
  const [selectedAssessmentIndex, setSelectedAssessmentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<TabType>("QUESTIONS");
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
    else{
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
              ? "No response available."
              : undefined,
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
                  <Typography variant="regularTxtsm" color={colors.gray[600]}>
                    {q.description}
                  </Typography>
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
              "https://www.w3schools.com/html/mov_bbb.mp4"
            }
          />
        </View>
      )}
    </View>
  );
};

export default AssessmentsDetails;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.common.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray[200],
    padding: 16,
    gap: 20,
  },

  topRow: {},

  topCard: {
    marginRight: 12,
  },

  topCardInner: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    padding: 12,
    borderWidth: 2,
    borderColor: colors.brand[500],
    gap: 12,
  },

  videoSection: {
    gap: 8,
  },

  qCard: {
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: colors.common.white,
  },

  qCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.gray[50],
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    padding: 12,
  },

  topChips: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  smallChip: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
  },

  optionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  optionChip: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
});
