import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import Typography from "../../../atoms/typography";
import { colors } from "../../../../theme/colors";
import { SvgXml } from "react-native-svg";
import { Wavy_CheckIcon } from "../../../../assets/svg/wavy_check";
import { checkIcon } from "../../../../assets/svg/check";
import Shimmer from "../../../atoms/shimmer";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { selectApplicationsDetailLoading } from "../../../../features/applications/selectors";

interface ScoreItem {
  title: string;
  percentage: string;
  completed: boolean;
  value:string;
}

interface Props {
  overall: string;
  status: string;
  details: ScoreItem[];
  isloading:boolean
}

const ResumeScoreShimmer = () => {
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

const ResumeScore = ({ overall, status, details,isloading }: Props) => {
  if(isloading){
   return <ResumeScoreShimmer/>
  }
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Typography variant="semiBoldTxtlg">Resume Score</Typography>

        <View style={styles.statusPill}>
          <Typography variant="mediumTxtxs" color={colors.success[700]}>
            {status}
          </Typography>
        </View>
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

      {details.map((item, index) => (
        <View key={index} style={styles.detailRow}>
          <View style={styles.rowLeft}>
            {/* Icon */}
            {item.completed ? (
               <SvgXml xml={checkIcon} height={20} width={20}/>
            ) : (
                <SvgXml xml={Wavy_CheckIcon} height={20} width={20}/>
            )}

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

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.common.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray[200],
    padding: 16,
    gap: 16,
    shadowColor: '#0A0D12',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  statusPill: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    gap: 8,
    borderRadius: 9999,
    backgroundColor: colors.success[50],
    borderWidth: 1,
    borderColor: colors.success[200],
  },
  
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap:8
  },

  divider: {
    height: 1,
    backgroundColor: colors.gray[200],
  },

  viewMoreRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  gradientWrapper: {
    flex:1,
    overflow: "hidden",
  },
  
  gradientBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
  },
  gradientTextcontainer:{
    flexDirection:'row',
    paddingHorizontal: 16, 
    paddingVertical:12,
     alignItems:'center'
  }
  
});
