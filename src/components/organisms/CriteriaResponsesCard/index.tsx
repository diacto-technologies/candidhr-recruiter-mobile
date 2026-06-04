import React from "react";
import { View } from "react-native";
import { selectApplicationResponses, selectApplicationsDetailLoading } from "../../../features/applications/selectors";
import { useAppSelector } from "../../../hooks/useAppSelector";
import Shimmer from "../../../components/atoms/shimmer";
import Typography from "../../../components/atoms/typography";
import { colors } from "../../../theme/colors";
import { CriteriaResponsesCardProps } from "./criteriaresponsescard.d";
import { useStyles } from "./styles";

/** API may return strings or `{ label, value }` (dropdown/radio) — Text cannot render objects. */
function formatCriteriaField(value: unknown): string {
  if (value == null || value === "") return "";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value.map(formatCriteriaField).filter(Boolean).join(", ");
  }
  if (typeof value === "object") {
    const o = value as Record<string, unknown>;
    if (o.label != null && o.label !== "") return String(o.label);
    if (o.value != null && o.value !== "") return String(o.value);
    try {
      return JSON.stringify(value);
    } catch {
      return "";
    }
  }
  return String(value);
}

const CriteriaResponsesCardShimmer = () => {
  const styles = useStyles();

  return (
    <View style={styles.card}>
      <Shimmer height={20} width="50%" />

      {[1, 2, 3].map(i => (
        <View key={i} style={styles.innerCard}>
          <Shimmer width="90%" height={16} />

          <View style={styles.row}>
            <Shimmer width="30%" height={14} />
            <Shimmer width="40%" height={14} style={styles.shimmerMargin} />
          </View>

          <View style={styles.row}>
            <Shimmer width="40%" height={14} />
            <Shimmer width="35%" height={14} style={styles.shimmerMargin} />
          </View>
        </View>
      ))}
    </View>
  );
};

const CriteriaResponsesCard: React.FC<CriteriaResponsesCardProps> = () => {
  const applicationResponses = useAppSelector(selectApplicationResponses);
  const loading = useAppSelector(selectApplicationsDetailLoading);
  const styles = useStyles();

  if (loading) {
    return <CriteriaResponsesCardShimmer />;
  }

  return (
    <View style={styles.card}>
      <Typography variant="semiBoldTxtlg">
        Criteria Responses
      </Typography>

      {applicationResponses?.length > 0 ? (
        applicationResponses.map((item, index) => {
          const questionText = formatCriteriaField(item?.criteria?.question as unknown);
          const responseText = formatCriteriaField(item?.response as unknown);
          const expectedText = formatCriteriaField(item?.criteria?.expected_response as unknown);
          const matchesExpected =
            responseText !== "" &&
            expectedText !== "" &&
            responseText === expectedText;
          const rowKey =
            (item?.criteria?.id != null && String(item.criteria.id)) ||
            item.id ||
            `idx-${index}`;

          return (
            <View key={rowKey} style={styles.innerCard}>
              {/* Question */}
              <View style={styles.questionRow}>
                <Typography variant="mediumTxtmd" color={colors.gray[900]}>
                  {index + 1}.
                </Typography>
                <Typography variant="mediumTxtmd" color={colors.gray[900]}>
                  {" "}
                  {questionText}
                </Typography>
              </View>

              {/* Response */}
              {responseText !== "" && (
                <View style={styles.row}>
                  <Typography variant="regularTxtsm" color={colors.gray[600]}>
                    Response :
                  </Typography>
                  <Typography
                    variant="semiBoldTxtsm"
                    color={
                      matchesExpected
                        ? colors.success[500]
                        : colors.error[500]
                    }
                  >
                    {"  "}
                    {responseText}
                  </Typography>
                </View>
              )}

              {/* Expected */}
              {expectedText !== "" && (
                <View style={styles.row}>
                  <Typography variant="regularTxtsm" color={colors.gray[600]}>
                    Expected response :
                  </Typography>
                  <Typography variant="semiBoldTxtsm" color={colors.success[500]}>
                    {"  "}
                    {expectedText}
                  </Typography>
                </View>
              )}
            </View>
          );
        })
      ) : (
        /* EMPTY STATE */
        <View style={styles.emptyState}>
          <View style={styles.emptyStateTextContainer}>
            <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
              No criteria responses available
            </Typography>
            <Typography variant="regularTxtsm" color={colors.gray[500]}>
              Criteria responses will appear here when available.
            </Typography>
          </View>

          <View style={styles.avatarCircle}>
            <Typography variant="semiBoldTxtsm" color={colors.gray[600]}>
              CR
            </Typography>
          </View>
        </View>
      )}
    </View>
  );
};

export default CriteriaResponsesCard;
