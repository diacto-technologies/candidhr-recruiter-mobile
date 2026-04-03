import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  ScrollView,
  ViewStyle,
  TouchableOpacity,
  Image,
  Platform,
  Linking,
  useWindowDimensions,
} from "react-native";
import { useAppSelector } from "../../../../../../hooks/useAppSelector";
import {
  selectAssessmentReport,
  selectPerformanceReport,
  selectPerformanceReportLoading,
} from "../../../../../../features/applications/selectors";
import { useAppDispatch } from "../../../../../../hooks/useAppDispatch";
import { getPerformanceReportRequestAction } from "../../../../../../features/applications/actions";
import Typography from "../../../../../../components/atoms/typography";
import { colors } from "../../../../../../theme/colors";
import Shimmer from "../../../../../../components/atoms/shimmer";
import Ring from "../../../../../../components/atoms/ring";
import Divider from "../../../../../../components/atoms/divider";
import CodingQuestionCard from "../codingquestioncard";
import VideoPlayerBox from "../../../../../../components/molecules/videoplayer";
import SnapshotModal from "../../../../../../components/molecules/snapshotmodal";
import { useStyles } from "./styles";
import { SvgXml } from "react-native-svg";
import { arrowDown } from "../../../../../../assets/svg/arrowdown";
import Ionicons from "react-native-vector-icons/Ionicons";

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

/** Web section row: "Considered: 5 of 5" — uses questions_considered only (no answered fallback). */
const formatSectionConsideredOf = (section: any) => {
  const den = section?.total_questions ?? section?.select_random ?? 0;
  const raw = section?.questions_considered;
  if (raw !== undefined && raw !== null && Number.isFinite(Number(raw))) {
    return `${Number(raw)} of ${den}`;
  }
  return den > 0 ? `— of ${den}` : "—";
};

const formatSectionPercent = (p: number) => {
  const n = Number(p);
  if (!Number.isFinite(n)) return "0%";
  if (Math.abs(n - Math.round(n)) < 1e-6) return `${Math.round(n)}%`;
  return `${n.toFixed(2)}%`;
};

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

const normalizeAiEvaluation = (ai: any, questionPoints?: number) => {
  if (!ai || typeof ai !== "object") return null;

  const flags: string[] = Array.isArray(ai?.ai_flags)
    ? ai.ai_flags.map((item: any) => String(item).toLowerCase())
    : [];

  const breakdownFromArray = Array.isArray(ai?.ai_breakdown)
    ? ai.ai_breakdown.map((item: any) => ({
      key: String(item?.key ?? item?.label ?? "").trim(),
      label: String(item?.label ?? toLabelFromKey(item?.key) ?? "Metric").trim(),
      note: String(item?.note ?? "").trim(),
      score: Number(item?.score ?? 0),
    }))
    : [];

  const breakdownFromObject =
    !breakdownFromArray.length && ai?.ai_subscores && typeof ai.ai_subscores === "object"
      ? Object.entries(ai.ai_subscores).map(([k, v]: [string, any]) => ({
        key: k,
        label: toLabelFromKey(k) || "Metric",
        note: "",
        score: Number(v ?? 0),
      }))
      : [];

  const breakdown = breakdownFromArray.length ? breakdownFromArray : breakdownFromObject;

  const improvements = Array.isArray(ai?.ai_improvements)
    ? ai.ai_improvements.map((item: any) => String(item).trim()).filter(Boolean)
    : [];

  return {
    status: String(ai?.ai_status ?? "").trim() || "Scored",
    score: Number(ai?.ai_score ?? ai?.ai_overall_score ?? 0),
    maxScore: Number(questionPoints ?? 5) || 5,
    note: String(ai?.ai_note ?? ai?.ai_summary ?? ai?.ai_feedback ?? "").trim(),
    relevance: String(ai?.ai_relevance ?? "").trim(),
    language: String(ai?.ai_language ?? "").trim(),
    isOffTopic: flags.includes("off_topic"),
    breakdown,
    improvements,
  };
};

const AssessmentsDetailsV2 = ({ style }: Props) => {
  const styles = useStyles();
  const { width: windowWidth } = useWindowDimensions();
  const isNarrowHeader = windowWidth < 420;
  /** Below this width, stack metrics in one column so pairs don’t squeeze or clip. */
  const isCompactMetrics = windowWidth < 420;
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<TabType>("QUESTIONS");
  const [expandedAI, setExpandedAI] = useState<string | null>(null);
  const [snapshotModalVisible, setSnapshotModalVisible] = useState(false);
  const [selectedSnapshot, setSelectedSnapshot] = useState<string | null>(null);
  const assessmentReport = useAppSelector(selectAssessmentReport);
  const performanceReport = useAppSelector(selectPerformanceReport) as any;
  const loadingPerformanceReport = useAppSelector(selectPerformanceReportLoading);
  const assessmentLogId = assessmentReport?.id;
  const questions: any[] = performanceReport?.question_analysis?.questions ?? [];
  const hasQuestions = questions.some((q) => q?.question_type !== "coding");
  const hasCoding = questions.some((q) => q?.question_type === "coding");
  const overall = performanceReport?.overall_performance;
  const assessmentInfo = performanceReport?.assessment_info;
  const sectionsList = performanceReport?.section_performance?.sections ?? [];
  const section0 = sectionsList[0];
  const skipped =
    overall?.unanswered ??
    performanceReport?.question_analysis?.total_questions_skipped ??
    0;

  /** Web dashboard KPI row: MARKS / ANSWERED / CONSIDERED / GRADE (overall, all sections). */
  const overallTotalQuestions = overall?.total_questions ?? 0;
  const sumQuestionsConsideredSections = sectionsList.reduce((acc: number, s: any) => {
    const v = s?.questions_considered;
    if (v !== undefined && v !== null && Number.isFinite(Number(v))) return acc + Number(v);
    return acc;
  }, 0);
  const hasConsideredFromSections = sectionsList.some(
    (s: any) => s?.questions_considered !== undefined && s?.questions_considered !== null
  );
  const overallConsideredApi = (overall as any)?.questions_considered;
  const aggregateConsideredKpi =
    overallConsideredApi !== undefined &&
    overallConsideredApi !== null &&
    Number.isFinite(Number(overallConsideredApi))
      ? `${Number(overallConsideredApi)} / ${overallTotalQuestions}`
      : hasConsideredFromSections && overallTotalQuestions > 0
        ? `${sumQuestionsConsideredSections} / ${overallTotalQuestions}`
        : overallTotalQuestions > 0
          ? `— / ${overallTotalQuestions}`
          : "—";

  // While performance report is loading, show shimmer instead of empty state.
  // When loading is done, and the result is still absent, show empty state.
  const shouldShowEmptyState = !loadingPerformanceReport && (!performanceReport || (!hasQuestions && !hasCoding));

  useEffect(() => {
    if (!assessmentLogId) return;
    dispatch(getPerformanceReportRequestAction(assessmentLogId));
  }, [assessmentLogId, dispatch]);

  useEffect(() => {
    if (!performanceReport) return;
    setActiveTab(getTabForReport(performanceReport));
  }, [performanceReport]);

  if (shouldShowEmptyState) {
    return (
      <View style={[styles.container, style]}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            gap: 16,
            paddingVertical: 28,
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              backgroundColor: colors.warning?.[50] ?? colors.brand?.[25],
              borderWidth: 1,
              borderColor: colors.warning?.[200] ?? colors.brand?.[200],
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name="time-outline"
              size={22}
              color={colors.warning?.[700] ?? colors.brand?.[700]}
            />
          </View>

          <View style={{ gap: 8, alignItems: "center" }}>
            <Typography variant="semiBoldTxtlg" color={colors.gray[900]}>
              Result Not Available Yet
            </Typography>
            <Typography
              variant="regularTxtsm"
              color={colors.gray[500]}
              style={{ textAlign: "center" }}
            >
              Assessment result not yet generated. Please ensure assessment is completed.
            </Typography>
          </View>

          <View style={{ gap: 10, width: "100%", paddingHorizontal: 20 }}>
            <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
              <View
                style={{
                  marginTop: 6,
                  width: 6,
                  height: 6,
                  borderRadius: 999,
                  backgroundColor: colors.warning?.[400] ?? colors.brand?.[400],
                }}
              />
              <Typography variant="regularTxtsm" color={colors.gray[600]}>
                Waiting for completion
              </Typography>
            </View>

            <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
              <View
                style={{
                  marginTop: 6,
                  width: 6,
                  height: 6,
                  borderRadius: 999,
                  backgroundColor: colors.warning?.[400] ?? colors.brand?.[400],
                }}
              />
              <Typography variant="regularTxtsm" color={colors.gray[600]}>
                Results auto-generate on completion
              </Typography>
            </View>
          </View>
        </View>
      </View>
    );
  }

  if (loadingPerformanceReport) {
    return (
      <View style={[styles.container, style]}>
        <View style={{ gap: 10 }}>
          <Shimmer width="40%" height={18} borderRadius={8} />
          <View style={{ flexDirection: "row", gap: 12 }}>
            <Shimmer width="45%" height={14} borderRadius={8} />
            <Shimmer width="45%" height={14} borderRadius={8} />
          </View>
          <Shimmer width="85%" height={90} borderRadius={16} />
          <Shimmer width="95%" height={220} borderRadius={12} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <View
        style={{
          flexDirection: isNarrowHeader ? "column" : "row",
          alignItems: isNarrowHeader ? "stretch" : "center",
          justifyContent: "space-between",
          gap: isNarrowHeader ? 12 : 8,
          width: "100%",
        }}
      >
        <View style={{ flex: isNarrowHeader ? undefined : 1, minWidth: 0 }}>
          <Typography variant="semiBoldTxtlg" color={colors.gray[900]}>
            Assessments
          </Typography>
        </View>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 10,
            alignItems: "center",
            justifyContent: isNarrowHeader ? "flex-start" : "flex-end",
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
                {sectionsList.length > 1
                  ? `${sectionsList.length} sections`
                  : section0?.section_name
                    ? toTitleCase(section0.section_name)
                    : ""}
              </Typography>
            </View>
          </View>

          {/* Web parity: overall KPI strip (MARKS, ANSWERED, CONSIDERED, GRADE) — mobile uses wrapped 2×2 grid */}
          <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
            <View style={styles.statGrid}>
              <View
                style={[
                  styles.statTile,
                  {
                    backgroundColor: colors.Rose[25],
                    borderColor: colors.Rose[200],
                  },
                ]}
              >
                <Typography variant="mediumTxtxs" color={colors.gray[500]}>
                  MARKS
                </Typography>
                <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
                  {overall?.score ?? 0} / {overall?.total_marks ?? 0}
                </Typography>
              </View>

              <View style={styles.statTile}>
                <Typography variant="mediumTxtxs" color={colors.gray[500]}>
                  ANSWERED
                </Typography>
                <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
                  {overall?.questions_answered ?? 0} / {overallTotalQuestions}
                </Typography>
                {skipped > 0 ? (
                  <Typography variant="regularTxtxs" color={colors.gray[500]}>
                    {skipped} skipped
                  </Typography>
                ) : null}
              </View>

              <View style={styles.statTile}>
                <Typography variant="mediumTxtxs" color={colors.gray[500]}>
                  CONSIDERED
                </Typography>
                <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
                  {aggregateConsideredKpi}
                </Typography>
              </View>

              <View style={styles.statTile}>
                <Typography variant="mediumTxtxs" color={colors.gray[500]}>
                  GRADE
                </Typography>
                <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
                  {overall?.grade ?? "—"}
                </Typography>
              </View>
            </View>
          </View>

          <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
            <Divider height={1} marginVertical={0} color={colors.gray[200]} />
          </View>

          <View style={{ paddingHorizontal: 16, paddingBottom: 16, width: "100%" }}>
            {sectionsList.length === 0 ? (
              <Typography variant="regularTxtsm" color={colors.gray[500]}>
                No section breakdown available.
              </Typography>
            ) : (
              sectionsList.map((section: any, index: number) => {
                const tq = section?.total_questions ?? 0;
                const pct = Number(section?.percentage ?? 0);
                const consideredOf = formatSectionConsideredOf(section);
                return (
                  <View
                    key={`${String(section?.section_name ?? "s")}-${index}`}
                    style={{
                      borderTopWidth: index > 0 ? 1 : 0,
                      borderColor: colors.gray[200],
                      paddingTop: index > 0 ? 16 : 0,
                      marginTop: index > 0 ? 0 : 0,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 10,
                      }}
                    >
                      <View style={{ flex: 1, minWidth: 0, gap: 10 }}>
                        <View
                          style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <Typography
                            variant="semiBoldTxtmd"
                            color={colors.gray[900]}
                            style={{ flexShrink: 1 }}
                          >
                            {toTitleCase(section?.section_name ?? "")}
                          </Typography>
                          {section?.performance_rating ? (
                            <View
                              style={{
                                paddingHorizontal: 8,
                                paddingVertical: 4,
                                borderRadius: 999,
                                backgroundColor: colors.gray[50],
                                borderWidth: 1,
                                borderColor: colors.gray[200],
                              }}
                            >
                              <Typography variant="regularTxtxs" color={colors.gray[600]}>
                                {section.performance_rating}
                              </Typography>
                            </View>
                          ) : null}
                        </View>

                        {isCompactMetrics ? (
                          <View style={styles.statMetricSingleCol}>
                            <Typography variant="regularTxtsm" color={colors.gray[600]}>
                              Score:{" "}
                              <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                                {section?.score ?? 0}/{section?.max_score ?? 0}
                              </Typography>
                            </Typography>
                            <Typography variant="regularTxtsm" color={colors.gray[600]}>
                              Correct:{" "}
                              <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                                {section?.questions_correct ?? 0}/{tq}
                              </Typography>
                            </Typography>
                            <Typography variant="regularTxtsm" color={colors.gray[600]}>
                              Wrong:{" "}
                              <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                                {section?.questions_wrong ?? 0}
                              </Typography>
                            </Typography>
                            <Typography variant="regularTxtsm" color={colors.gray[600]}>
                              Considered:{" "}
                              <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                                {consideredOf}
                              </Typography>
                            </Typography>
                            <Typography
                              variant="regularTxtsm"
                              color={colors.gray[600]}
                              style={{ flexShrink: 1 }}
                            >
                              Rule:{" "}
                              <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                                {section?.scoring_rule ?? "—"}
                              </Typography>
                            </Typography>
                          </View>
                        ) : (
                          <View style={styles.statMetricTwoCol}>
                            <View style={styles.statMetricCol}>
                              <Typography variant="regularTxtsm" color={colors.gray[600]}>
                                Score:{" "}
                                <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                                  {section?.score ?? 0}/{section?.max_score ?? 0}
                                </Typography>
                              </Typography>
                              <Typography variant="regularTxtsm" color={colors.gray[600]}>
                                Wrong:{" "}
                                <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                                  {section?.questions_wrong ?? 0}
                                </Typography>
                              </Typography>
                              <Typography
                                variant="regularTxtsm"
                                color={colors.gray[600]}
                                style={{ flexShrink: 1 }}
                              >
                                Rule:{" "}
                                <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                                  {section?.scoring_rule ?? "—"}
                                </Typography>
                              </Typography>
                            </View>
                            <View style={styles.statMetricCol}>
                              <Typography variant="regularTxtsm" color={colors.gray[600]}>
                                Correct:{" "}
                                <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                                  {section?.questions_correct ?? 0}/{tq}
                                </Typography>
                              </Typography>
                              <Typography variant="regularTxtsm" color={colors.gray[600]}>
                                Considered:{" "}
                                <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                                  {consideredOf}
                                </Typography>
                              </Typography>
                            </View>
                          </View>
                        )}
                      </View>

                      <Typography
                        variant="semiBoldTxtlg"
                        color={colors.gray[900]}
                        style={{ flexShrink: 0, minWidth: 56, textAlign: "right" }}
                      >
                        {formatSectionPercent(pct)}
                      </Typography>
                    </View>

                    <View
                      style={{
                        marginTop: 10,
                        height: 4,
                        width: "100%",
                        backgroundColor: colors.gray[100],
                        borderRadius: 2,
                        overflow: "hidden",
                      }}
                    >
                      <View
                        style={{
                          height: "100%",
                          borderRadius: 2,
                          backgroundColor: colors.error[500],
                          width: `${Math.min(100, Math.max(0, pct))}%`,
                        }}
                      />
                    </View>
                  </View>
                );
              })
            )}
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
                                const isFullyCorrect =
                                  providedSet.size === correctSet.size &&
                                  [...providedSet].every((id) => correctSet.has(id));
                                const isSelectedCorrect = isFullyCorrect && isProvided && isCorrectOpt;
                                const isSelectedWrong = isProvided && (!isCorrectOpt || !isFullyCorrect);

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
                          {/* <Typography variant="mediumTxtsm" color={colors.gray[600]}>
                            Correct answer:
                          </Typography> */}
                          {/* <View style={styles.optionRow}>
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
                          </View> */}
                          {String(q?.question_type).toLowerCase() !== "text" && (
                            <>
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
                                      <Typography variant="mediumTxtsm" color={colors.success[700]}>
                                        {String(idNum)}
                                      </Typography>
                                    </View>
                                  ))}
                              </View>
                            </>
                          )}
                          {/* AI evaluation for text answers */}
                          {(() => {
                            const ai = normalizeAiEvaluation(q?.ai_evaluation, q?.points);
                            if (!ai || String(q?.question_type).toLowerCase() !== "text") return null;

                            const aiId = String(q?.question_id ?? index);
                            const isExpanded = expandedAI === aiId;

                            return (
                              <View
                                style={{
                                  marginTop: 8,
                                  borderRadius: 16,
                                  borderWidth: 1,
                                  borderColor: colors.gray[200],
                                  overflow: "hidden",
                                  backgroundColor: colors.brand[25],
                                }}
                              >
                                <TouchableOpacity
                                  onPress={() => setExpandedAI(isExpanded ? null : aiId)}
                                  style={{
                                    paddingHorizontal: 16,
                                    paddingTop: 14,
                                    paddingBottom: 12,
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                  }}
                                >
                                  <View style={{ flex: 1, paddingRight: 10, gap: 4 }}>
                                    <Typography variant="semiBoldTxtxl" color={colors.brand[600]}>
                                      {!isExpanded ? 'Hide AI Analysis' : 'View AI Analysis'}
                                    </Typography>
                                    {/* <Typography variant="semiBoldTxtxl" color={colors.brand[600]}>
                                      {Number(ai.score).toFixed(2)}
                                    </Typography> */}
                                  </View>

                                  <View style={{ paddingTop: 2 }}>
                                    <SvgXml
                                      xml={arrowDown}
                                      width={18}
                                      height={18}
                                      style={{
                                        transform: [{ rotate: isExpanded ? "180deg" : "0deg" }],
                                      }}
                                    />
                                  </View>
                                </TouchableOpacity>

                                {isExpanded && (
                                  <View
                                    style={{
                                      paddingHorizontal: 16,
                                      paddingBottom: 14,
                                      gap: 14,
                                    }}
                                  >
                                    <View
                                      style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                      }}
                                    >
                                      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>

                                        {/* Left: AI Evaluation title + status + note */}
                                        <View style={{ flex: 1 }}>
                                          <Typography variant="semiBoldTxtlg" color={colors.gray[800]}>
                                            AI Evaluation
                                          </Typography>
                                          <Typography variant="regularTxtsm" color={colors.gray[500]}>
                                            {toTitleCase(ai.status)}
                                          </Typography>
                                        </View>

                                        {/* Right: Score — pushed to the far right end */}
                                        <View style={{ alignItems: "flex-end" }}>
                                          <Typography variant="semiBoldTxtxl" color={colors.brand[600]}>
                                            {`${ai.score}/${ai.maxScore}`}
                                          </Typography>
                                          <Typography variant="regularTxtsm" color={colors.gray[500]}>
                                            AI Score
                                          </Typography>
                                        </View>

                                      </View>
                                    </View>
                                    {ai.note ? (
                                      <Typography variant="regularTxtmd" color={colors.gray[900]}>
                                        {ai.note}
                                      </Typography>
                                    ) : null}
                                    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                                      {ai.relevance ? (
                                        <View
                                          style={[
                                            styles.smallChip,
                                            { backgroundColor: colors.common.white, borderColor: colors.gray[200] },
                                          ]}
                                        >
                                          <Typography variant="mediumTxtsm" color={colors.gray[700]}>
                                            {`Relevance: ${toTitleCase(ai.relevance)}`}
                                          </Typography>
                                        </View>
                                      ) : null}

                                      {ai.language ? (
                                        <View
                                          style={[
                                            styles.smallChip,
                                            { backgroundColor: colors.common.white, borderColor: colors.gray[200] },
                                          ]}
                                        >
                                          <Typography variant="mediumTxtsm" color={colors.gray[700]}>
                                            {`Language: ${ai.language}`}
                                          </Typography>
                                        </View>
                                      ) : null}

                                      <View
                                        style={[
                                          styles.smallChip,
                                          {
                                            backgroundColor: ai.isOffTopic ? colors.error[50] : colors.success[50],
                                            borderColor: ai.isOffTopic ? colors.error[200] : colors.success[200],
                                          },
                                        ]}
                                      >
                                        <Typography
                                          variant="mediumTxtsm"
                                          color={ai.isOffTopic ? colors.error[700] : colors.success[700]}
                                        >
                                          {ai.isOffTopic ? "Off Topic" : "On Topic"}
                                        </Typography>
                                      </View>
                                    </View>

                                    {ai.breakdown.length > 0 && (
                                      <View style={{ gap: 10 }}>
                                        <Typography variant="semiBoldTxtxl" color={colors.gray[800]}>
                                          Score Breakdown
                                        </Typography>

                                        {ai.breakdown.map((item: any, idx: number) => (
                                          <View
                                            key={`${item.key}-${idx}`}
                                            style={{
                                              backgroundColor: colors.common.white,
                                              borderRadius: 14,
                                              borderWidth: 1,
                                              borderColor: colors.gray[200],
                                              padding: 12,
                                              gap: 6,
                                            }}
                                          >
                                            <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
                                              {item.label}
                                            </Typography>
                                            {item.note ? (
                                              <Typography variant="regularTxtmd" color={colors.gray[600]}>
                                                {item.note}
                                              </Typography>
                                            ) : null}
                                            <View
                                              style={{
                                                marginTop: 2,
                                                height: 8,
                                                borderRadius: 999,
                                                backgroundColor: colors.gray[200],
                                                overflow: "hidden",
                                              }}
                                            >
                                              <View
                                                style={{
                                                  width: `${Math.max(
                                                    0,
                                                    Math.min(100, (Number(item.score) || 0) * 100)
                                                  )}%`,
                                                  height: "100%",
                                                  backgroundColor: colors.brand[600],
                                                }}
                                              />
                                            </View>
                                          </View>
                                        ))}
                                      </View>
                                    )}

                                    {ai.improvements.length > 0 && (
                                      <View
                                        style={{
                                          padding: 12,
                                          borderRadius: 12,
                                          borderWidth: 1,
                                          borderColor: colors.warning[200],
                                          backgroundColor: colors.warning[50],
                                          gap: 6,
                                        }}
                                      >
                                        <Typography variant="semiBoldTxtmd" color={colors.warning[900]}>
                                          AREAS TO IMPROVE
                                        </Typography>
                                        {ai.improvements.map((line: string, idx: number) => (
                                          <Typography key={`${line}-${idx}`} variant="regularTxtmd" color={colors.warning[800]}>
                                            {line}
                                          </Typography>
                                        ))}
                                      </View>
                                    )}
                                  </View>
                                )}
                              </View>
                            );
                          })()}
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

