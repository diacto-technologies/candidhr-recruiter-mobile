import React, { useEffect, useMemo, useState } from "react";
import { View, ScrollView, ViewStyle, TouchableOpacity, Image, Platform, Linking } from "react-native";
import { useAppSelector } from "../../../../../../hooks/useAppSelector";
import {
  selectAssessmentReport,
  selectPerformanceReport,
} from "../../../../../../features/applications/selectors";
import { useAppDispatch } from "../../../../../../hooks/useAppDispatch";
import { getPerformanceReportRequestAction } from "../../../../../../features/applications/actions";
import Typography from "../../../../../../components/atoms/typography";
import { colors } from "../../../../../../theme/colors";
import Ring from "../../../../../../components/atoms/ring";
import Divider from "../../../../../../components/atoms/divider";
import CodingQuestionCard from "../codingquestioncard";
import VideoPlayerBox from "../../../../../../components/molecules/videoplayer";
import SnapshotModal from "../../../../../../components/molecules/snapshotmodal";
import { useStyles } from "./styles";

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
  return (difficulty.charAt(0).toUpperCase() + difficulty.slice(1)) as
    | "Easy"
    | "Medium"
    | "Hard";
};

const getTabForReport = (report: any): TabType => {
  const questions: any[] = report?.question_analysis?.questions ?? [];
  const hasNonCoding = questions.some((q) => q?.question_type !== "coding");
  const hasCoding = questions.some((q) => q?.question_type === "coding");
  if (!hasNonCoding && hasCoding) return "CODING";
  return "QUESTIONS";
};

const isAcceptedStatus = (status: any) => {
  const id = status?.id ?? status?.status_id;
  const desc = status?.description ?? "";
  return id === 3 || String(desc).toLowerCase() === "accepted";
};

const toTitleCase = (value?: string) =>
  String(value ?? "")
    .split(/[\s_-]+/g)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const formatQuestionTypeLabel = (value?: string) => {
  const v = String(value ?? "").toLowerCase();
  if (!v) return "Text";
  if (v.includes("coding")) return "Coding";
  if (v.includes("single_choice")) return "MCQ";
  if (v.includes("multiple_choice")) return "Multiple";
  if (v.includes("mcq")) return "MCQ";
  if (v.includes("multiple")) return "Multiple";
  return toTitleCase(value);
};

const parseChoiceIds = (value: any): number[] => {
  if (value == null) return [];
  if (Array.isArray(value)) {
    return value
      .map((v) => Number(v))
      .filter((n) => Number.isFinite(n));
  }

  const str = String(value).trim();
  if (!str) return [];

  try {
    const parsed = JSON.parse(str);
    if (Array.isArray(parsed)) {
      return parsed
        .map((v) => Number(v))
        .filter((n) => Number.isFinite(n));
    }
  } catch {
    // ignore
  }

  return str
    .split(/\r?\n|,|\|/g)
    .map((p) => Number(String(p).trim().replace(/^"+|"+$/g, "")))
    .filter((n) => Number.isFinite(n));
};

const toLabelFromKey = (value?: string) => {
  const v = String(value ?? "").trim();
  if (!v) return "";
  return v
    .replace(/_/g, " ")
    .split(/\s+/g)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

const AssessmentsDetailsV2 = ({ style }: Props) => {
  const styles = useStyles();
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<TabType>("QUESTIONS");
  const [snapshotModalVisible, setSnapshotModalVisible] = useState(false);
  const [selectedSnapshot, setSelectedSnapshot] = useState<string | null>(null);
  const assessmentReport = useAppSelector(selectAssessmentReport);
  const performanceReport = useAppSelector(selectPerformanceReport) as any;
  const assessmentLogId = assessmentReport?.id;
  const questions: any[] = performanceReport?.question_analysis?.questions ?? [];
  const hasQuestions = questions.some((q) => q?.question_type !== "coding");
  const hasCoding = questions.some((q) => q?.question_type === "coding");
  const overall = performanceReport?.overall_performance;
  const assessmentInfo = performanceReport?.assessment_info;
  const section0 = performanceReport?.section_performance?.sections?.[0];

  useEffect(() => {
    if (!assessmentLogId) return;
    dispatch(getPerformanceReportRequestAction(assessmentLogId));
  }, [assessmentLogId, dispatch]);

  useEffect(() => {
    if (!performanceReport) return;
    setActiveTab(getTabForReport(performanceReport));
  }, [performanceReport]);

  return (
    <View style={[styles.container, style]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flex: 1 }}>
          <Typography variant="semiBoldTxtlg" color={colors.gray[900]}>
            Assessments
          </Typography>
        </View>
        <View
          style={{
            flexDirection: "row",
            gap: 8,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                backgroundColor: colors.success[500],
              }}
            />
            <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
              {overall?.correct_answers ?? 0}
            </Typography>
            <Typography variant="regularTxtsm" color={colors.gray[500]}>
              Correct
            </Typography>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                backgroundColor: colors.error[500],
              }}
            />
            <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
              {overall?.wrong_answers ?? 0}
            </Typography>
            <Typography variant="regularTxtsm" color={colors.gray[500]}>
              Incorrect
            </Typography>
          </View>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.topRow}
      >
        {/* {cards.map((item, index) => (
          <View key={index} style={styles.topCard}>
            <TouchableOpacity
              style={[
                styles.topCardInner,
                {
                  borderColor:
                    selectedAssessmentIndex === index
                      ? colors.brand[500]
                      : colors.gray[200],
                },
              ]}
              onPress={() => handleAssessmentSelect(index)}
            >
              <Ring percent={item.percent} showText />

              <View style={{ gap: 2 }}>
                <Typography variant="semiBoldTxtmd">{item.title}</Typography>

                <Typography variant="regularTxtsm" color={colors.gray[600]}>
                  Question:{" "}
                  <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                    {item.questions < 10 ? `0${item.questions}` : item.questions}
                  </Typography>
                </Typography>

                <Typography variant="regularTxtsm" color={colors.gray[600]}>
                  Correct:{" "}
                  <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                    {item.correct < 10 ? `0${item.correct}` : item.correct}
                  </Typography>
                </Typography>
              </View>
            </TouchableOpacity>
          </View>
        ))} */}
      </ScrollView>

      {/* ---------- OVERALL PERFORMANCE (V2) ---------- */}
      {overall && (
        <View
          style={{
            borderWidth: 1,
            borderColor: colors.gray[200],
            borderRadius: 14,
            backgroundColor: colors.common.white,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 12,
              padding: 16,
              alignItems: "center",
            }}
          >
            <Ring percent={overall?.percentage ?? 0} showText />

            <View style={{ flex: 1, gap: 6 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 5,
                }}
              >
                <Typography variant="semiBoldTxtlg" color={colors.gray[900]} style={{ flex: 1 }}   // ✅ allow shrinking
                  // numberOfLines={1}
                  ellipsizeMode="tail">
                  {assessmentInfo?.blueprint_name ?? ""}
                </Typography>

                {assessmentInfo?.status && (
                  <View
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 999,
                      backgroundColor:
                        String(assessmentInfo.status).toLowerCase() === "passed"
                          ? colors.success[50]
                          : colors.error[50],
                      borderWidth: 1,
                      borderColor:
                        String(assessmentInfo.status).toLowerCase() === "passed"
                          ? colors.success[200]
                          : colors.error[200],
                    }}
                  >
                    <Typography
                      variant="mediumTxtxs"
                      color={
                        String(assessmentInfo.status).toLowerCase() === "passed"
                          ? colors.success[700]
                          : colors.error[700]
                      }

                    >
                      {toTitleCase(assessmentInfo.status)}
                    </Typography>
                  </View>
                )}
              </View>

              <Typography variant="regularTxtsm" color={colors.gray[600]}>
                {section0?.section_name ? toTitleCase(section0.section_name) : ""}
              </Typography>
            </View>
          </View>

          {/* <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 10,
              paddingHorizontal: 16,
              paddingBottom: 16,
            }}
          >
            {[
              {
                label: "MARKS",
                value: `${overall?.score ?? 0} / ${overall?.total_marks ?? 0}`,
              },
              {
                label: "ANSWERED",
                value: `${overall?.questions_answered ?? 0} / ${overall?.total_questions ?? 0}`,
              },
              {
                label: "CONSIDERED",
                value: `${section0?.questions_considered ?? overall?.questions_answered ?? 0} / ${
                  section0?.select_random ?? overall?.total_questions ?? 0
                }`,
              },
              { label: "GRADE", value: `${overall?.grade ?? "_"}` },
            ].map((s) => (
              <View
                key={s.label}
                style={{
                  flexGrow: 1,
                  flexBasis: "47%",
                  paddingVertical: 12,
                  paddingHorizontal: 12,
                  borderRadius: 12,
                  backgroundColor: colors.gray[50],
                  borderWidth: 1,
                  borderColor: colors.gray[200],
                }}
              >
                <Typography variant="mediumTxtxs" color={colors.gray[500]}>
                  {s.label}
                </Typography>
                <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
                  {s.value}
                </Typography>
              </View>
            ))}
          </View> */}

          {/* <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 18,
              paddingHorizontal: 16,
              paddingBottom: 16,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  backgroundColor: colors.success[500],
                }}
              />
              <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                {overall?.correct_answers ?? 0}
              </Typography>
              <Typography variant="regularTxtsm" color={colors.gray[500]}>
                correct
              </Typography>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  backgroundColor: colors.error[500],
                }}
              />
              <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                {overall?.wrong_answers ?? 0}
              </Typography>
              <Typography variant="regularTxtsm" color={colors.gray[500]}>
                incorrect
              </Typography>
            </View>
          </View> */}
         {/* <Divider height={1} marginVertical={5}/> */}
          <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
            <View
              style={{
                //marginTop: 12,
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 14,
              }}
            >
              <Typography variant="regularTxtsm" color={colors.gray[600]}>
                Score:{" "}
                <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                  {section0?.score ?? overall?.score ?? 0}/{section0?.max_score ?? overall?.total_marks ?? 0}
                </Typography>
              </Typography>

              <Typography variant="regularTxtsm" color={colors.gray[600]}>
                Correct:{" "}
                <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                  {section0?.questions_correct ?? overall?.correct_answers ?? 0}/
                  {section0?.total_questions ?? overall?.total_questions ?? 0}
                </Typography>
              </Typography>

              <Typography variant="regularTxtsm" color={colors.gray[600]}>
                Wrong:{" "}
                <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                  {section0?.questions_wrong ?? overall?.wrong_answers ?? 0}
                </Typography>
              </Typography>

              <Typography variant="regularTxtsm" color={colors.gray[600]}>
                Considered:{" "}
                <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                  {section0?.questions_considered ?? overall?.questions_answered ?? 0} of{" "}
                  {section0?.total_questions ?? overall?.total_questions ?? 0}
                </Typography>
              </Typography>

              <Typography variant="regularTxtsm" color={colors.gray[600]}>
                Rule:{" "}
                <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                  {section0?.scoring_rule ?? "_"}
                </Typography>
              </Typography>
            </View>
          </View>
        </View>
      )}

      {/* ---------- QUESTIONS TAB (Non-coding) ---------- */}
      {activeTab === "QUESTIONS" && hasQuestions && (
        <ScrollView nestedScrollEnabled>
          {questions
            .filter((q) => q?.question_type !== "coding")
            .map((q: any, index: number) => {
              const id = q?.question_id ?? String(index + 1);
              const isCorrect = Boolean(q?.is_correct);
              const difficulty = formatDifficulty(q?.difficulty);
              const time = `${q?.time_spent ?? 0} Sec.`;
              const status = q?.status ?? (isCorrect ? "Correct" : "Incorrect");

              const bg = isCorrect ? colors.success[50] : colors.error[50];
              const border = isCorrect ? colors.success[200] : colors.error[200];
              const text = isCorrect ? colors.success[700] : colors.error[700];

              return (
                <View key={id} style={styles.qCard}>
                  <View style={styles.qCardTop}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                      <Typography variant="regularTxtsm" color={colors.gray[600]}>
                        {time}
                      </Typography>

                      <View
                        style={[
                          styles.smallChip,
                          {
                            backgroundColor: isCorrect ? colors.success[50] : colors.error[50],
                            borderColor: isCorrect ? colors.success[200] : colors.error[200],
                          },
                        ]}
                      >
                        <Typography
                          variant="mediumTxtxs"
                          color={isCorrect ? colors.success[700] : colors.error[700]}
                        >
                          {`${q?.score_obtained ?? 0} / ${q?.points ?? 0} pts`}
                        </Typography>
                      </View>
                    </View>

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
                          {difficulty}
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
                          {formatQuestionTypeLabel(q?.question_type)}
                        </Typography>
                      </View>
                    </View>
                  </View>

                  <View style={{ padding: 12, gap: 12 }}>
                    <Typography variant="mediumTxtmd" color={colors.gray[900]}>
                      {index + 1}. {q?.question_text ?? "_"}
                    </Typography>

                    {(() => {
                      const providedChoiceIds = parseChoiceIds(q?.answer_provided);
                      const correctChoiceIds = parseChoiceIds(q?.correct_answer);

                      const choices: Array<{
                        choice_id: number;
                        choice_text: string;
                        is_correct?: boolean;
                      }> = Array.isArray(q?.choices) ? q.choices : [];

                      const correctSet = new Set<number>(
                        choices.length
                          ? choices
                            .filter(
                              (c) =>
                                Boolean(c?.is_correct) ||
                                correctChoiceIds.includes(Number(c?.choice_id))
                            )
                            .map((c) => Number(c?.choice_id))
                            .filter((n) => Number.isFinite(n))
                          : correctChoiceIds
                      );

                      const providedSet = new Set<number>(
                        providedChoiceIds.map((n) => Number(n)).filter((n) => Number.isFinite(n))
                      );

                      return (
                        <View style={{ gap: 12 }}>
                          {/* Options row (show ALL unselected too) */}
                          {choices.length > 0 ? (
                            <View style={styles.optionRow}>
                              {choices.map((c) => {
                                const idNum = Number(c?.choice_id);
                                const label = String(c?.choice_text ?? "").trim() || "_";

                                const isProvided = providedSet.has(idNum);
                                const isCorrectOpt = correctSet.has(idNum);

                                const isSelectedCorrect = isProvided && isCorrectOpt;
                                const isSelectedWrong = isProvided && !isCorrectOpt;

                                const backgroundColor = isSelectedCorrect
                                  ? colors.success[50]
                                  : isSelectedWrong
                                    ? colors.error[50]
                                    : colors.common.white;
                                const borderColor = isSelectedCorrect
                                  ? colors.success[200]
                                  : isSelectedWrong
                                    ? colors.error[200]
                                    : colors.gray[200];
                                const color = isSelectedCorrect
                                  ? colors.success[700]
                                  : isSelectedWrong
                                    ? colors.error[700]
                                    : colors.gray[700];

                                return (
                                  <View
                                    key={String(c?.choice_id)}
                                    style={[
                                      styles.optionChip,
                                      { backgroundColor, borderColor },
                                    ]}
                                  >
                                    <Typography variant="mediumTxtsm" color={color}>
                                      {label}
                                    </Typography>
                                  </View>
                                );
                              })}
                            </View>
                          ) : (
                            <View
                              style={{
                                padding: 12,
                                borderRadius: 8,
                                backgroundColor: colors.gray[50],
                                borderWidth: 1,
                                borderColor: colors.gray[200],
                                gap: 6,
                              }}
                            >
                              <Typography variant="regularTxtsm" color={colors.gray[700]}>
                                Answer Provided
                              </Typography>
                              <Typography variant="regularTxtsm" color={colors.gray[900]}>
                                {String(q?.answer_provided ?? "").trim() || "—"}
                              </Typography>
                            </View>
                          )}

                          <Divider />

                          {/* Correct answer row */}
                          <Typography variant="mediumTxtsm" color={colors.gray[600]}>
                            Correct answer:
                          </Typography>
                          <View style={styles.optionRow}>
                            {choices.length > 0
                              ? (() => {
                                const correctChoices = choices.filter((c) =>
                                  correctSet.has(Number(c?.choice_id))
                                );
                                const missingCorrect = correctChoices.filter(
                                  (c) => !providedSet.has(Number(c?.choice_id))
                                );
                                const toShow = missingCorrect.length ? missingCorrect : correctChoices;

                                return toShow.map((c) => (
                                  <View
                                    key={`correct-${String(c?.choice_id)}`}
                                    style={[
                                      styles.optionChip,
                                      {
                                        backgroundColor: colors.success[50],
                                        borderColor: colors.success[200],
                                      },
                                    ]}
                                  >
                                    <Typography variant="mediumTxtsm" color={colors.success[700]}>
                                      {String(c?.choice_text ?? "").trim() || "_"}
                                    </Typography>
                                  </View>
                                ));
                              })()
                              : correctChoiceIds.map((idNum) => (
                                <View
                                  key={`correct-${String(idNum)}`}
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
                                    {String(idNum)}
                                  </Typography>
                                </View>
                              ))}
                          </View>

                          {/* Status chip */}
                          <View
                            style={{
                              alignSelf: "flex-start",
                              paddingHorizontal: 10,
                              paddingVertical: 4,
                              borderRadius: 999,
                              backgroundColor: bg,
                              borderWidth: 1,
                              borderColor: border,
                            }}
                          >
                            <Typography variant="semiBoldTxtxs" color={text}>
                              {status}
                            </Typography>
                          </View>
                        </View>
                      );
                    })()}
                  </View>
                </View>
              );
            })}
        </ScrollView>
      )}

      {/* ---------- CODING TAB ---------- */}
      {activeTab === "CODING" && hasCoding && (
        <View style={{ gap: 12 }}>
          {questions
            .filter((q) => q?.question_type === "coding")
            .map((q: any, index: number) => {
              const ce = q?.coding_evaluation ?? {};
              const tcr: any[] = ce?.test_cases_result ?? [];
              const key = q?.question_id ?? String(index);

              return (
                <View key={key} style={{ gap: 12 }}>
                  <CodingQuestionCard
                    index={index}
                    title={q?.question_text}
                    language={ce?.language}
                    code={q?.answer_provided}
                    pointsObtained={q?.score_obtained}
                    totalPoints={q?.points}
                    timeSpentSeconds={q?.time_spent}
                    testCases={tcr.map((tc: any) => ({
                      input: tc?.stdin,
                      output: tc?.stdout ?? tc?.stderr ?? "",
                      expectedOutput: tc?.expected_output ?? "",
                      passed: isAcceptedStatus(tc?.status ?? tc),
                    }))}
                    canEditCode={false}
                  />
                </View>
              );
            })}
        </View>
      )}

      {/* ---------- PROCTORING ---------- */}
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

export default AssessmentsDetailsV2;

