import { StyleSheet, useWindowDimensions } from 'react-native';
import DeviceInfo from "react-native-device-info";
import { useRNSafeAreaInsets } from '../../../../hooks/useRNSafeAreaInsets'
import { colors } from '../../../../theme/colors';

export const useStyles = () => {
    const insets = useRNSafeAreaInsets()
    return StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.gray[200],
    backgroundColor: colors.base.white,
    gap:12,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    height: 40,
    width: 40,
    borderRadius: 25,
    marginRight: 12,
  },

  initialCircle: {
    backgroundColor: colors.gray[200],
    alignItems: "center",
    justifyContent: "center",
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.gray[900],
  },

  email: {
    color: colors.gray[500],
    fontSize: 13,
    // marginTop: 2,
  },

  menu: {
    fontSize: 18,
    color: colors.gray[500],
  },

  info: {
    fontSize: 14,
    color: colors.gray[600],
    // marginVertical: 2,
  },

  bold: {
    fontWeight: "600",
    color: colors.gray[900],
  },

  divider: {
    height: 1,
    backgroundColor: colors.gray[200],
    // marginVertical: 12,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  assignedText: {
    fontSize: 14,
    color: colors.gray[600],
  },

 statusBadge: {
      backgroundColor: colors.base.white,
      borderRadius: 6,
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 2,
      paddingHorizontal: 8,

      borderWidth: 1,
      borderColor: colors.gray[300],

      // 🌫 Shadow (matches CSS box-shadow)
      shadowColor: "rgba(10, 13, 18, 0.05)",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 1,
      shadowRadius: 2,

      // Android
      elevation: 2,
      gap: 4,
    },

    statusDot: {
      width: 6,
      height: 6,
      borderRadius: 4,
      //backgroundColor: colors.brand[500],
    },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    marginRight: 6,
  },

  checkCircle: {
    height: 18,
    width: 18,
    borderRadius: 9,
    backgroundColor: "#2E7D32",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },

  checkMark: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },

  statusText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.gray[800],
  },

  assignContainer: {
    padding: 16,
    backgroundColor: "#fff",
  },

  filterContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: colors.gray[200],
  },
});
}