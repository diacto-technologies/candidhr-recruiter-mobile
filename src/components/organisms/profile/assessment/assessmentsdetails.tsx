// src/components/organisms/profile/Assessments.tsx
import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ViewStyle,
} from "react-native";
import { colors } from "../../../../theme/colors";
import Typography from "../../../atoms/typography";
import Ring from "../../../atoms/ring";

type QuestionType = {
  id: number;
  time: string; // "34 / 60 Sec."
  difficulty: "Easy" | "Medium" | "Hard";
  type: "Multiple" | "Text" | "MCQ" | "Audio";
  question: string;
  chips?: string[]; // answer options / tags
  description?: string;
};

type AssessmentCard = {
  title: string;
  questions: number;
  correct: number;
  percent: number; // 0-100
};

interface Props {
  assessments?: AssessmentCard[];
  questions?: QuestionType[];
  style?: ViewStyle;
}

const AssessmentsDetails = ({ assessments = [], questions = [], style }: Props) => {
  // sample fallback data if none passed
  const demoAssessments: AssessmentCard[] = [
    { title: "Research analyst", questions: 10, correct: 3, percent: 45 },
    { title: "Overall", questions: 0, correct: 0, percent: 76 },
  ];
  const demoQuestions: QuestionType[] = [
    {
      id: 1,
      time: "34 / 60 Sec.",
      difficulty: "Easy",
      type: "Multiple",
      question: "Which of the following are common backend programming languages?",
      chips: ["Python", "JavaScript", "HTML", "Ruby"],
    },
    {
      id: 2,
      time: "34 / 60 Sec.",
      difficulty: "Medium",
      type: "Text",
      question: "Which of the following are common backend programming languages?",
      description:
        "Reddit young minds One AI conversation at a time. Fueled by cutting-edge AI, Miko connects with kids, responds to their emotions and fosters empathy in every interaction.",
    },
  ];

  const cards = assessments.length ? assessments : demoAssessments;
  const qs = questions.length ? questions : demoQuestions;

  return (
    <View style={[styles.container, style]}>
      <Typography variant="semiBoldTxtlg" color={colors.gray[900]}>
        Assessments
      </Typography>

      {/* Top row with two cards and dashed connector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.topRow}
      >
        {cards.map((item, index) => (
          <View key={index} style={styles.topCard}>
            <View style={styles.topCardInner}>

              <Ring percent={item.percent} size={60} showText />

              <View style={{ gap: 2 }}>
                <Typography variant="semiBoldTxtmd" >
                  {item.title}
                </Typography>

                <Typography variant="regularTxtsm" color={colors.gray[600]}>
                  Question : <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>{item.questions < 10 ? `0${item.questions}` : item.questions}</Typography>
                </Typography>

                <Typography variant="regularTxtsm" color={colors.gray[600]}>
                  Correct : <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>{item.correct < 10 ? `0${item.correct}` : item.correct}</Typography>
                </Typography>
              </View>

            </View>
          </View>
        ))}
      </ScrollView>


      {/* Questions list */}
      <ScrollView nestedScrollEnabled>
        {qs.map((q) => (
          <View key={q.id} style={styles.qCard}>
            <View style={styles.qCardTop}>
              <Typography variant="regularTxtsm" color={colors.gray[600]}>
                {q.time}
              </Typography>

              <View style={styles.topChips}>
                <View style={[styles.smallChip, { backgroundColor: colors.brand[50], borderColor: colors.brand[200] }]}>
                  <Typography variant="mediumTxtxs" color={colors.brand[700]}>{q.difficulty}</Typography>
                </View>
                <View style={[styles.smallChip, { backgroundColor: colors.warning[50], borderColor: colors.warning[200] }]}>
                  <Typography variant="mediumTxtxs" color={colors.warning[700]}>{q.type}</Typography>
                </View>
              </View>
            </View>

            <View style={{ padding: 12, gap: 12 }}>
              <View style={{ flexDirection: 'row' }}>
                <Typography variant="mediumTxtmd" color="#1F2937">
                  {q.id}.
                </Typography>
                <Typography variant="mediumTxtmd" color="#1F2937">
                  {q.question}
                </Typography>
              </View>
              {q.chips && (
                <View style={styles.optionRow}>
                  {q.chips.map((c, i) => (
                    <TouchableOpacity
                      key={i}
                      style={[
                        styles.optionChip,
                        {
                          backgroundColor:
                            c === "Python"
                              ? colors.error[50]
                              : c === "HTML"
                                ? colors.success[50]
                                : colors.gray[50],

                          borderColor:
                            c === "Python"
                              ? colors.error[200]
                              : c === "HTML"
                                ? colors.success[200]
                                : colors.gray[200],
                        },
                      ]}
                    >
                      <Typography variant="mediumTxtsm" color={colors.gray[700]}>
                        {c}
                      </Typography>
                    </TouchableOpacity>
                  ))}
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
    </View>
  );
};

export default AssessmentsDetails;

/* ---------------- styles ---------------- */
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.common.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray[200],
    padding: 16,
    gap: 20,
  },

  header: {
    marginBottom: 12,
  },

  topRow: {
    // marginBottom: 12,
  },

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

  rightRingWrap: {
    marginLeft: 12,
  },

  qCard: {
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 12,
    //padding: 14,
    marginBottom: 12,
    backgroundColor: colors.common.white,
    gap: 12,
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
    marginTop: 12,
  },

  optionChip: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: colors.gray[50],
    borderWidth: 1,
    borderColor: colors.gray[200],
    gap: 8,
  },

  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },

  ringOuter: {
    justifyContent: "center",
    alignItems: "center",
  },

  ringCenter: {
    justifyContent: "center",
    alignItems: "center",
  },
});
