import { StyleSheet, useWindowDimensions } from 'react-native';
import { colors } from '../../../theme/colors';
import { useRNSafeAreaInsets } from '../../../hooks/useRNSafeAreaInsets';
import DeviceInfo from "react-native-device-info";
import { shadowStyles } from '../../../theme/shadowcolor';

export const useStyles = () => {
  return StyleSheet.create({
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
}