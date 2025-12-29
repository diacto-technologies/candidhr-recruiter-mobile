import React from "react";
import { View, StyleSheet } from "react-native";
import Typography from "../../../atoms/typography";
import { colors } from "../../../../theme/colors";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { selectApplicationResponses } from "../../../../features/applications/selectors";

const CriteriaResponsesCard = () => {
  const ApplicationResponses = useAppSelector(selectApplicationResponses);
  return (
    <View style={styles.card}>
      <Typography variant="semiBoldTxtlg">
        Criteria responses
      </Typography>

      {ApplicationResponses?.map((item, index) => (
        <View key={index} style={styles.innerCard}>
          {/* Question */}
          <View style={{ flexDirection: 'row' }}>
          <Typography variant="mediumTxtmd" color="#1F2937">
              {index+1 ?? ""} {""}
            </Typography>
            <Typography variant="mediumTxtmd" color="#1F2937">
              {item?.criteria?.question ?? ""} {""}
            </Typography>
            <Typography variant="mediumTxtmd" color="#1F2937">
              {/* {item?.question} */}
            </Typography>
          </View>
          {/* Response */}
          <View style={styles.row}>
            <Typography variant="regularTxtsm" color={colors.gray[600]}>
              Response :
            </Typography>
            <Typography
              variant="semiBoldTxtsm"
              color={
                item?.response === item?.criteria?.expected_response
                  ? colors.success[500]
                  : colors.error[500]
              }
            >
              {"  "}
              {item?.response ?? ""}
            </Typography>
          </View>

          {/* Expected */}
          <View style={styles.row}>
            <Typography variant="regularTxtsm" color={colors.gray[600]}>
              Expected response :
            </Typography>
            <Typography variant="semiBoldTxtsm" color={colors?.success[500]}>
              {"  "}
              {item?.criteria?.expected_response ?? ""}
            </Typography>
          </View>
        </View>
      ))}
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
});
