import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { shadowStyles } from '../../../theme/shadowcolor';

const DOT_SIZE = 24;

export const useStyles = () => {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.common.white,
      borderWidth: 0.5,
      borderRadius: 12,
      borderColor: colors.gray[200],
      padding: 16,
      gap: 20,
      ...shadowStyles.shadow_xs,
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
    },

    iconColumn: {
      paddingRight: 12,
      alignItems: "center",
    },

    verticalLine: {
      width: 2,
      height: 50,
      marginVertical: 4,
    },
    
    verticalLineCompletedCurrent: {
      backgroundColor: colors.brand[600],
    },

    verticalLineUpcoming: {
      backgroundColor: colors.gray[300],
    },

    verticalLineCurrentMargin: {
      marginRight: 6,
    },

    textContainer: {
      flex: 1,
    },

    // Completed (big green)
    completedDot: {
      width: DOT_SIZE,
      height: DOT_SIZE,
      borderRadius: DOT_SIZE / 2,
      backgroundColor: colors.brand[600],
      justifyContent: "center",
      alignItems: "center",
      padding: 8,
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
      borderRadius: 9999,
      borderWidth: 3,
      borderColor: colors.brand[600],
      justifyContent: "center",
      alignItems: "center",
      right: 3,
    },

    pendingDot: {
      width: DOT_SIZE + 6,
      height: DOT_SIZE + 6,
      borderRadius: DOT_SIZE / 2 + 3,
      borderWidth: 3,
      borderColor: colors.gray[200],
      justifyContent: "center",
      alignItems: "center",
      right: 0.9,
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
};
