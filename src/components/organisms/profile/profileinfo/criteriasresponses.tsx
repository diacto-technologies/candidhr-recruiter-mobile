import React from "react";
import { View, StyleSheet } from "react-native";
import Typography from "../../../atoms/typography";
import { colors } from "../../../../theme/colors";

interface CriteriaItem {
  id: number;
  question: string;
  response: string;
  expected: string;
}

interface Props {
  data: CriteriaItem[];
}

const CriteriaResponsesCard = ({ data }: Props) => {
  return (
    <View style={styles.card}>
      <Typography variant="semiBoldTxtlg">
        Criteria responses
      </Typography>

      {data.map((item) => (
        <View key={item.id} style={styles.innerCard}>
          {/* Question */}
          <View style={{flexDirection:'row'}}>
            <Typography variant="mediumTxtmd" color="#1F2937">
              {item.id}. {""}
            </Typography>
            <Typography variant="mediumTxtmd" color="#1F2937">
             {item.question}
            </Typography>
          </View>
          {/* Response */}
          <View style={styles.row}>
            <Typography variant="regularTxtsm" color={colors.gray[600]}>
              Response :
            </Typography>
            <Typography variant="semiBoldTxtsm" color={colors?.error[500]}>
              {"  "}
              {item.response}
            </Typography>
          </View>

          {/* Expected */}
          <View style={styles.row}>
            <Typography variant="regularTxtsm" color={colors.gray[600]}>
              Expected response :
            </Typography>
            <Typography variant="semiBoldTxtsm" color={colors?.success[500]}>
              {"  "}
              {item.expected}
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
    gap: 16
  },

  title: {
    marginBottom: 14,
  },

  innerCard: {
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 10,
    padding: 12,
    gap:12,
    backgroundColor: colors.base.white,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});
