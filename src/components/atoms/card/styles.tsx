import { StyleSheet, useWindowDimensions } from 'react-native';
import { colors } from '../../../theme/colors';
import { useRNSafeAreaInsets } from '../../../hooks/useRNSafeAreaInsets';
import DeviceInfo from "react-native-device-info";
import { shadowStyles } from '../../../theme/shadowcolor';

export const useStyles = () => {
    const isTablet = DeviceInfo.isTablet();
    return StyleSheet.create({
        // base: {
        //   backgroundColor: "#FFFFFF",
        //   borderRadius: 8,
        //   borderWidth: 1,
        //   borderColor: "#E9EAEB",
        //   shadowColor: "#0A0D12",
        //   shadowOffset: { width: 0, height: 4 },
        //   shadowOpacity: 0.03,
        //   shadowRadius: 6,
        //   elevation: 3,
        // },
        base: {
          width: isTablet ? '49%' : "100%",
          marginHorizontal: isTablet ? 5 : 0,
          backgroundColor: colors.base.white,
          borderRadius: 12,
          borderWidth: 0.5,
          borderColor: colors.gray[200],
          ...shadowStyles.shadow_xs
        },
      
      })
    }