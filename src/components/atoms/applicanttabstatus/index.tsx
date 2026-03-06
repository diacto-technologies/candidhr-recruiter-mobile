import React from "react";
import Typography from "../typography";
import { colors } from "../../../theme/colors";
import { View, StyleSheet } from "react-native";
import { shadowStyles } from "../../../theme/shadowcolor";

interface ApplicantTabStatusProps {
  status?: string;
}

const ApplicantTabStatus: React.FC<ApplicantTabStatusProps> = ({ status }) => {

  const getStatusLabel = () => {
    switch (status) {
      case "approved":
        return "Approved";
      case "approval_pending":
        return "Approval Pending";
      case "not_approved":
        return "Not Approved";
      default:
        return "Not Approved";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "approved":
        return colors.success[500];
      case "approval_pending":
        return colors.warning[500];
      case "not_approved":
        return colors.error[500];
      default:
        return colors.gray[400];
    }
  };

  return (
    <View style={styles.shortListedCard}>
      <View style={styles.row}>
        <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
          Status
        </Typography>

        <View
          style={[
            styles.dot,
            { backgroundColor: getStatusColor() }
          ]}
        />

        <Typography variant="mediumTxtmd" color={colors.gray[900]}>
          {getStatusLabel()}
        </Typography>
      </View>
    </View>
  );
};

export default ApplicantTabStatus;

const styles = StyleSheet.create({
  shortListedCard: {
    backgroundColor: colors.common.white,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: colors.gray[300],
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 8,
    ...shadowStyles.shadow_xs,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  dot: {
    height: 8,
    width: 8,
    borderRadius: 30,
  },
});