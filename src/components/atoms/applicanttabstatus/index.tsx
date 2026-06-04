import React from "react";
import Typography from "../typography";
import { colors } from "../../../theme/colors";
import { View } from "react-native";
import { useStyles } from "./styles";
import { getStatusColor, getStatusLabel } from "../../../constants/applicantStatus";


interface ApplicantTabStatusProps {
  status?: string;
}

const ApplicantTabStatus: React.FC<ApplicantTabStatusProps> = ({ status }) => {
  const styles = useStyles();

  return (
    <View style={styles.shortListedCard}>
      <View style={styles.row}>
        <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
          Status
        </Typography>

        <View
          style={[
            styles.dot,
            { backgroundColor: getStatusColor(status as string) }
          ]}
        />

        <Typography variant="mediumTxtmd" color={colors.gray[900]}>
          {getStatusLabel(status as string)}
        </Typography>
      </View>
    </View>
  );
};

export default ApplicantTabStatus;

// const styles = StyleSheet.create({
//   shortListedCard: {
//     backgroundColor: colors.common.white,
//     borderRadius: 8,
//     borderWidth: 0.5,
//     borderColor: colors.gray[300],
//     paddingVertical: 10,
//     paddingHorizontal: 14,
//     gap: 8,
//     ...shadowStyles.shadow_xs,
//   },

//   row: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//   },

//   dot: {
//     height: 8,
//     width: 8,
//     borderRadius: 30,
//   },
// });