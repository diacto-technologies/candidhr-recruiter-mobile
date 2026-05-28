import React from "react";
import { View} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Shimmer from "../../../components/atoms/shimmer";
import Typography from "../../../components/atoms/typography";
import { colors } from "../../../theme/colors";

import { useStyles } from "./styles";
import { Props } from "./resumescore";

const ResumeScoreShimmer = () => {
  const styles = useStyles();
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Shimmer width="40%" height={18} />
        <Shimmer width={60} height={20} borderRadius={999} />
      </View>

      {/* Gradient score bar */}
      <Shimmer height={44} borderRadius={8} />

      {/* Detailed score title */}
      <Shimmer width="35%" height={16} />

      {/* Score rows */}
      {[1, 2, 3, 4, 5].map((_, index) => (
        <View key={index} style={styles.detailRow}>
          <View style={styles.rowLeft}>
            <Shimmer width={20} height={20} borderRadius={10} />
            <Shimmer width={120} height={14} />
          </View>

          <Shimmer width={32} height={16} />
        </View>
      ))}
    </View>
  );
};

const ResumeScore = ({ overall, details, isloading }: Props) => {
  const styles = useStyles();

  if(isloading){
   return <ResumeScoreShimmer/>
  }
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Typography variant="semiBoldTxtlg">Resume Score</Typography>
      </View>
      {/* Gradient Score Bar */}
      <View style={styles.gradientWrapper}>
        <LinearGradient
          colors={[
            "rgba(254,200,75,0.74)",
            "rgba(254,200,75,0.0)"
          ]}
          start={{ x: 0, y: 0.5 }}   // 90deg → left → right
          end={{ x: 1, y: 0.5 }}
          style={styles.gradientBox}
        >
          <View style={styles.gradientTextcontainer}>
            <Typography variant="mediumTxtsm" style={{ flex: 1 }} color={colors.gray[900]}>
              Overall score
            </Typography>
            <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>{overall}</Typography>
          </View>
        </LinearGradient>
      </View>

      {/* Detailed Score */}
      <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
        Detailed score
      </Typography>

      {details.map((item) => (
        <View key={item.title} style={styles.detailRow}>
          <View style={styles.rowLeft}>
            <Typography
              variant="mediumTxtsm"
              color={item.completed ? colors.gray[700] : colors.gray[600]}
            >
              {item.title} ({item?.percentage})
            </Typography>
          </View>

          <Typography variant="semiBoldTxtmd" color={colors.gray[700]}>{item.value}</Typography>
        </View>
      ))}
    </View>
  );
};

export default ResumeScore;


