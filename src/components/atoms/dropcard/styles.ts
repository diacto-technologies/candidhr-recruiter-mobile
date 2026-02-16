import { StyleSheet, useWindowDimensions } from 'react-native';
import { colors } from '../../../theme/colors';
import { useRNSafeAreaInsets } from '../../../hooks/useRNSafeAreaInsets';
import DeviceInfo from "react-native-device-info";

export const useStyles = () => {
    const { insetsBottom, insetsTop } = useRNSafeAreaInsets();
    const { width } = useWindowDimensions();
    const isTablet = DeviceInfo.isTablet();
    return StyleSheet.create({
        dropcard: {
          width: 260,
          paddingVertical: 0,
          flexDirection: "column",
          alignItems: "flex-start",
      
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "#E9EAEB",
          backgroundColor: "#FFFFFF",
      
          // shadow-lg (iOS)
          shadowColor: "#0A0D12",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.03,
          shadowRadius: 6,
      
          // elevation (Android)
          elevation: 3,
        },
      })
    }