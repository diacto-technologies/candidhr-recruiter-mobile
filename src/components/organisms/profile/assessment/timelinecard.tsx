import React from "react";
import { View, StyleSheet } from "react-native";
import Typography from "../../../atoms/typography";
import { colors } from "../../../../theme/colors";
import { SvgXml } from "react-native-svg";
import { checkMarkIcon } from "../../../../assets/svg/checkmark";
import Ring from "../../../atoms/ring";
interface TimelineItem {
  title: string;
  date?: string;
  status: "completed" | "current" | "upcoming";
}

interface Props {
  progress: number;
  data: TimelineItem[];
}

const CustomTimeline = ({ progress, data }: Props) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Typography variant="semiBoldTxtlg" color={colors.gray[900]}>Timeline</Typography>

        {/* Progress circle */}
        <View style={styles.progressContainer}>
        <Ring percent={50} size={20} strokeWidth={4} rotation={90}/>
          <Typography variant="semiBoldTxtmd">{progress}%</Typography>
        </View>
      </View>

      {/* Timeline List */}
      <View>
        {data.map((item, index) => {
          const isLast = index === data.length - 1;

          return (
            <View key={index} style={styles.rowContainer}>
              {/* Left Side */}
              <View style={styles.iconColumn}>
                {/* DOTS */}
                {item.status === "completed" && (
                  <View style={styles.completedDot}>
                    {/* <View style={styles.completedInner} /> */}
                    <SvgXml xml={checkMarkIcon} />
                  </View>
                )}

                {item.status === "current" && (
                  <View style={[styles.currentDot,{right:3}]}>
                      <View style={[styles.completedDot]}>
                     <View style={styles.completedInner} />
                    </View>
                  </View>
                )}

                {item.status === "upcoming" && (
                 <View style={[styles.pendingDot,{right:0.9}]}>
                 {/* <View style={styles.completedDot}> */}
                <View style={styles.pendingInner} />
               {/* </View> */}
             </View>
                )}

                {/* VERTICAL LINE */}
                {!isLast && (
                  <View
                    style={[
                      styles.verticalLine,
                      {
                        backgroundColor:
                          item.status === "completed" || item.status === "current"
                            ? colors.brand[600]
                            : colors.gray[300],
                            marginRight:item.status === "current"?6:0
                      },
                    ]}
                  />
                )}
              </View>

              {/* Right Text */}
              <View style={styles.textContainer}>
                <Typography
                  variant="semiBoldTxtsm"
                  color={
                    item.status === "current"
                      ? colors.brand[700]
                      : item.status === "upcoming"
                      ? colors.gray[700]
                      : colors.gray[700]
                  }
                >
                  {item.title}
                </Typography>

                <Typography
                  variant="regularTxtsm"
                  color={
                    item.status === "upcoming"
                      ? colors.gray[400]
                      : colors.gray[600]
                  }
                >
                  {item.date || "—"}
                </Typography>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default CustomTimeline;


const DOT_SIZE = 24;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.common.white,
    borderWidth: 0.5,
    borderRadius: 12,
    borderColor: colors.gray[200],
    padding: 16,
    gap:20,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  progressCircle: {
    width: 30,
    height: 30,
    borderRadius: 20,
    borderWidth: 5,
    borderColor: colors.gray[300],
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  progressFill: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderWidth: 5,
    borderColor: colors.brand[600],
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    borderRadius: 12,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    //marginBottom: 22,
  },

  iconColumn: {
    paddingRight:12,
    alignItems: "center",
  },

  verticalLine: {
    width: 2,
    height: 50,
    marginVertical: 4,
  },

  textContainer: {
    flex: 1,
    //paddingBottom: 8,
  },

  // Completed (big green)
  completedDot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: colors.brand[600],
    justifyContent: "center",
    alignItems: "center",
    padding:8
  },

  completedInner: {
    width: 10,
    height: 10,
    backgroundColor: colors.common.white,
    borderRadius: 5,
  },
  pendingInner: {
    width: 10,
    height: 10,
    backgroundColor: colors.gray[200],
    borderRadius: 5,
  },

  // Current active dot
  currentDot: {
    width: DOT_SIZE + 10,
    height: DOT_SIZE + 10,
    borderRadius:9999,
    borderWidth: 3,
    borderColor: colors.brand[600],
    justifyContent: "center",
    alignItems: "center",
  },

  pendingDot: {
    width: DOT_SIZE + 6,
    height: DOT_SIZE + 6,
    borderRadius: DOT_SIZE / 2 + 3,
    borderWidth: 3,
    borderColor: colors.gray[200],
    justifyContent: "center",
    alignItems: "center",
  },

  currentInner: {
    width: 14,
    height: 14,
    backgroundColor: colors.brand[600],
    borderRadius: 7,
  },

  // Upcoming grey
  upcomingDot: {
    width: DOT_SIZE - 6,
    height: DOT_SIZE - 6,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: colors.gray[300],
  },
});

