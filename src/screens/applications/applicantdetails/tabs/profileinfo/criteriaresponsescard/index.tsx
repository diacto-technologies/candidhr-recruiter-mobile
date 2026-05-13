import React from "react";
import { View, StyleSheet } from "react-native";
import { selectApplicationResponses, selectApplicationsDetailLoading } from "../../../../../../features/applications/selectors";
import { useAppSelector } from "../../../../../../hooks/useAppSelector";
import Shimmer from "../../../../../../components/atoms/shimmer";
import Typography from "../../../../../../components/atoms/typography";
import { colors } from "../../../../../../theme/colors";
import { shadowStyles } from "../../../../../../theme/shadowcolor";
import { SvgXml } from "react-native-svg";
import { commentIcon } from "../../../../../../assets/svg/comments";
import { Illustrations } from "../../../../../../assets/svg/illustrations";

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
  return (
    <View style={styles.card}>
      <Shimmer height={20} width="50%" />

      {[1, 2, 3].map(i => (
        <View key={i} style={styles.innerCard}>
          <Shimmer width="90%" height={16} />

          <View style={styles.row}>
            <Shimmer width="30%" height={14} />
            <Shimmer width="40%" height={14} style={{ marginLeft: 8 }} />
          </View>

          <View style={styles.row}>
            <Shimmer width="40%" height={14} />
            <Shimmer width="35%" height={14} style={{ marginLeft: 8 }} />
          </View>
        </View>
      ))}
    </View>
  );
};

const CriteriaResponsesCard = () => {
  const ApplicationResponses = useAppSelector(selectApplicationResponses);
  const loading = useAppSelector(selectApplicationsDetailLoading);
  if (loading) {
    return <CriteriaResponsesCardShimmer />;
  }

  return (
    <View style={styles.card}>
      <Typography variant="semiBoldTxtlg">
        Criteria Responses
      </Typography>

      {ApplicationResponses?.length > 0 ? (
        ApplicationResponses.map((item, index) => {
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
            <View style={{ flexDirection: 'row' }}>
              <Typography variant="mediumTxtmd" color="#1F2937">
                {index + 1}.
              </Typography>
              <Typography variant="mediumTxtmd" color="#1F2937">
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
          <View style={{flex:1}}>
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

const styles = StyleSheet.create({
  card: {
    flex:1,
    backgroundColor: colors.common.white,
    borderWidth: 0.5,
    borderColor: colors.gray[200],
    borderRadius: 12,
    padding: 16,
    gap: 16,
    // shadowColor: '#0A0D12',
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.05,
    // shadowRadius: 3,
    // elevation: 1,
    ...shadowStyles.shadow_xs
  },

  title: {
    marginBottom: 14,
  },

  innerCard: {
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 10,
    padding: 12,
    gap: 12,
    backgroundColor: colors.base.white,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  emptyState: {
    borderRadius: 12,
    backgroundColor: colors.gray[50],
    flexDirection: 'row',
    alignSelf:'center',
    marginHorizontal: 20,
    padding:20,
    alignItems:'center'
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
