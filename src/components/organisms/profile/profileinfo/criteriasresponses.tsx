import React from "react";
import { View, StyleSheet } from "react-native";
import Typography from "../../../atoms/typography";
import { colors } from "../../../../theme/colors";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { selectApplicationResponses, selectApplicationsDetailLoading } from "../../../../features/applications/selectors";
import Shimmer from "../../../atoms/shimmer";


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
        ApplicationResponses.map((item, index) => (
          <View key={index} style={styles.innerCard}>
            {/* Question */}
            <View style={{ flexDirection: 'row' }}>
              <Typography variant="mediumTxtmd" color="#1F2937">
                {index + 1}.
              </Typography>
              <Typography variant="mediumTxtmd" color="#1F2937">
                {" "}
                {item?.criteria?.question}
              </Typography>
            </View>

            {/* Response */}
            {item?.response && (
              <View style={styles.row}>
                <Typography variant="regularTxtsm" color={colors.gray[600]}>
                  Response :
                </Typography>
                <Typography
                  variant="semiBoldTxtsm"
                  color={
                    item.response === item?.criteria?.expected_response
                      ? colors.success[500]
                      : colors.error[500]
                  }
                >
                  {"  "}
                  {item.response}
                </Typography>
              </View>
            )}

            {/* Expected */}
            {item?.criteria?.expected_response && (
              <View style={styles.row}>
                <Typography variant="regularTxtsm" color={colors.gray[600]}>
                  Expected response :
                </Typography>
                <Typography variant="semiBoldTxtsm" color={colors.success[500]}>
                  {"  "}
                  {item.criteria.expected_response}
                </Typography>
              </View>
            )}
          </View>
        ))
      ) : (
        /* EMPTY STATE */
        <View style={styles.emptyState}>
          <View>
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
    backgroundColor: colors.common.white,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 12,
    padding: 16,
    gap: 16,
    shadowColor: '#0A0D12',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
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
