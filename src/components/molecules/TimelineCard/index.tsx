import React from "react";
import { View } from "react-native";
import { SvgXml } from "react-native-svg";
import Typography from "../../../components/atoms/typography";
import Ring from "../../../components/atoms/ring";
import { colors } from "../../../theme/colors";
import { checkMarkIcon } from "../../../assets/svg/checkmark";
import { TimelineCardProps } from "./timelinecard.d";
import { useStyles } from "./styles";

const getTitleColor = (status: "completed" | "current" | "upcoming") => {
  if (status === "current") return colors.brand[700];
  return colors.gray[700];
};

const getDateColor = (status: "completed" | "current" | "upcoming") => {
  if (status === "upcoming") return colors.gray[400];
  return colors.gray[600];
};

const CustomTimeline: React.FC<TimelineCardProps> = ({
  progress,
  data,
  title = "Timeline",
}) => {
  const styles = useStyles();

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Typography variant="semiBoldTxtlg" color={colors.gray[900]}>
          {title}
        </Typography>

        {/* Progress circle */}
        <View style={styles.progressContainer}>
          <Ring percent={progress} size={20} strokeWidth={4} rotation={90} />
          <Typography variant="semiBoldTxtmd">{progress}%</Typography>
        </View>
      </View>

      {/* Timeline List */}
      <View>
        {data.map((item, index) => {
          const isLast = index === data.length - 1;
          const isCompletedOrCurrent = item.status === "completed" || item.status === "current";
          const isCurrent = item.status === "current";

          return (
            <View key={index} style={styles.rowContainer}>
              {/* Left Side */}
              <View style={styles.iconColumn}>
                {/* DOTS */}
                {item.status === "completed" && (
                  <View style={styles.completedDot}>
                    <SvgXml xml={checkMarkIcon} />
                  </View>
                )}

                {item.status === "current" && (
                  <View style={styles.currentDot}>
                    <View style={styles.completedDot}>
                      <View style={styles.completedInner} />
                    </View>
                  </View>
                )}

                {item.status === "upcoming" && (
                  <View style={styles.pendingDot}>
                    <View style={styles.pendingInner} />
                  </View>
                )}

                {/* VERTICAL LINE */}
                {!isLast && (
                  <View
                    style={[
                      styles.verticalLine,
                      isCompletedOrCurrent
                        ? styles.verticalLineCompletedCurrent
                        : styles.verticalLineUpcoming,
                      isCurrent && styles.verticalLineCurrentMargin,
                    ]}
                  />
                )}
              </View>

              {/* Right Text */}
              <View style={styles.textContainer}>
                <Typography
                  variant="semiBoldTxtsm"
                  color={getTitleColor(item.status)}
                >
                  {item.title}
                </Typography>

                <Typography
                  variant="regularTxtsm"
                  color={getDateColor(item.status)}
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
