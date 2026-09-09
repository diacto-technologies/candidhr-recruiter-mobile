import React, { useMemo } from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  Pressable,
  ScrollView,
} from "react-native";
import Typography from "../../atoms/typography";
import { colors } from "../../../theme/colors";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useStyles } from "./styles";
import type {
  PerformanceReportResponse,
  AssessmentLog,
  AssessmentOption,
  PersonalityScreeningInterviewOption,
} from "../../../features/applications/types";

interface Props {
  visible: boolean;
  onClose: () => void;
  performanceReport?: PerformanceReportResponse | null;
  currentSessionLog?: AssessmentLog | null;
  currentAssessmentOption?: AssessmentOption | null;
  interviewOption?: PersonalityScreeningInterviewOption | null;
}

const formatTestDetailDate = (dateVal?: string | null): string => {
  if (!dateVal) return "—";
  const date = new Date(dateVal);
  if (isNaN(date.getTime())) return "—";

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;

  return `${month} ${day}, ${year}, ${hours}:${minutes} ${ampm}`;
};

const formatInterviewDetailDate = (dateVal?: string | null): string => {
  if (!dateVal) return "—";
  const date = new Date(dateVal);
  if (isNaN(date.getTime())) return "—";

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12;

  return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
};

export default function TestDetailsModal({
  visible,
  onClose,
  performanceReport,
  currentSessionLog,
  currentAssessmentOption,
  interviewOption,
}: Props) {
  const styles = useStyles();

  const assessmentInfo = performanceReport?.assessment_info;
  const overall = performanceReport?.overall_performance;
  const timeAnalytics = performanceReport?.time_analytics;

  const durationFormatted = useMemo(() => {
    const rawTimeLimit = (timeAnalytics as { time_limit?: number } | undefined)?.time_limit;
    if (typeof rawTimeLimit === "number" && rawTimeLimit > 0) {
      const mins = Math.round(rawTimeLimit / 60);
      return `${mins}m`;
    }
    if (timeAnalytics?.time_limit_formatted) {
      return timeAnalytics.time_limit_formatted;
    }
    return "—";
  }, [timeAnalytics]);

  const sentByName = useMemo(() => {
    if (currentAssessmentOption?.sent_by) {
      if (typeof currentAssessmentOption.sent_by === "string") {
        return currentAssessmentOption.sent_by;
      }
      if (
        typeof currentAssessmentOption.sent_by === "object" &&
        currentAssessmentOption.sent_by !== null &&
        "name" in currentAssessmentOption.sent_by
      ) {
        return String(currentAssessmentOption.sent_by.name);
      }
    }

    const info = assessmentInfo as Record<string, unknown> | undefined;
    if (info?.sent_by) {
      if (typeof info.sent_by === "string") return info.sent_by;
      if (
        typeof info.sent_by === "object" &&
        info.sent_by !== null &&
        "name" in (info.sent_by as Record<string, unknown>)
      ) {
        return String((info.sent_by as Record<string, unknown>).name);
      }
    }
    if (info?.assigned_by) {
      if (typeof info.assigned_by === "string") return info.assigned_by;
      if (
        typeof info.assigned_by === "object" &&
        info.assigned_by !== null &&
        "name" in (info.assigned_by as Record<string, unknown>)
      ) {
        return String((info.assigned_by as Record<string, unknown>).name);
      }
    }

    if (currentSessionLog?.action_taken_by?.name) {
      return currentSessionLog.action_taken_by.name;
    }
    if (currentSessionLog?.updated_by) {
      return currentSessionLog.updated_by;
    }

    return "—";
  }, [currentAssessmentOption, assessmentInfo, currentSessionLog]);

  const detailRows = useMemo(() => {
    if (interviewOption) {
      const sentBy =
        typeof interviewOption.sent_by === "object" && interviewOption.sent_by !== null
          ? interviewOption.sent_by.name || "—"
          : "—";

      return [
        {
          label: "Status",
          value: interviewOption.status || "—",
        },
        {
          label: "Sent by",
          value: sentBy,
        },
        {
          label: "Total questions",
          value:
            interviewOption.total_questions != null
              ? String(interviewOption.total_questions)
              : "—",
        },
        {
          label: "Assigned",
          value: formatInterviewDetailDate(interviewOption.assigned_at),
        },
        {
          label: "Started",
          value: formatInterviewDetailDate(interviewOption.started_at),
        },
        {
          label: "Completed",
          value: formatInterviewDetailDate(interviewOption.completed_at),
        },
        {
          label: "Valid from",
          value: formatInterviewDetailDate(interviewOption.valid_from),
        },
        {
          label: "Valid until",
          value: formatInterviewDetailDate(interviewOption.valid_until),
        },
      ];
    }

    return [
      {
        label: "Assessment",
        value:
          assessmentInfo?.blueprint_name ||
          currentAssessmentOption?.blueprint_name ||
          assessmentInfo?.job_title ||
          currentAssessmentOption?.job_title ||
          "—",
      },
      {
        label: "Status",
        value:
          assessmentInfo?.status ||
          currentAssessmentOption?.status ||
          "—",
      },
      {
        label: "Sent by",
        value: sentByName,
      },
      {
        label: "Passing score",
        value:
          overall?.passing_threshold != null
            ? `${overall.passing_threshold}%`
            : "—",
      },
      {
        label: "Duration",
        value: durationFormatted,
      },
      {
        label: "Total questions",
        value:
          overall?.total_questions != null
            ? String(overall.total_questions)
            : "—",
      },
      {
        label: "Assigned",
        value: formatTestDetailDate(
          assessmentInfo?.assigned_at ||
          currentAssessmentOption?.sent_at ||
          currentAssessmentOption?.created_at
        ),
      },
      {
        label: "Started",
        value: formatTestDetailDate(
          assessmentInfo?.started_at ||
          currentAssessmentOption?.started_at
        ),
      },
      {
        label: "Completed",
        value: formatTestDetailDate(
          assessmentInfo?.completed_at ||
          currentAssessmentOption?.completed_at
        ),
      },
      {
        label: "Valid from",
        value: formatTestDetailDate(
          assessmentInfo?.valid_from ||
          currentAssessmentOption?.sent_at ||
          currentAssessmentOption?.created_at
        ),
      },
      {
        label: "Valid until",
        value: formatTestDetailDate(
          assessmentInfo?.valid_to ||
          currentAssessmentOption?.valid_until
        ),
      },
    ];
  }, [
    interviewOption,
    assessmentInfo,
    currentAssessmentOption,
    overall,
    sentByName,
    durationFormatted,
  ]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          {/* Header */}
          <View style={styles.header}>
            <Typography variant="semiBoldTxtlg" color={colors.gray[900]}>
              Test details
            </Typography>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={20} color={colors.gray[500]} />
            </TouchableOpacity>
          </View>

          {/* Details list */}
          <ScrollView
            style={styles.contentList}
            showsVerticalScrollIndicator={false}
          >
            {detailRows.map((row, index) => {
              const isLast = index === detailRows.length - 1;
              return (
                <View
                  key={row.label}
                  style={[styles.row, isLast && styles.lastRow]}
                >
                  <Typography
                    variant="regularTxtsm"
                    color={colors.gray[600]}
                    style={styles.label}
                  >
                    {row.label}
                  </Typography>
                  <Typography
                    variant="regularTxtsm"
                    color={colors.gray[900]}
                    style={styles.value}
                  >
                    {row.value}
                  </Typography>
                </View>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
