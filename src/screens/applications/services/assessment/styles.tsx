import { StyleSheet, useWindowDimensions } from 'react-native';
import DeviceInfo from "react-native-device-info";
import { shadowStyles } from '../../../../theme/shadowcolor';
import { colors } from '../../../../theme/colors';

export const useStyles = () => {
    const isTablet = DeviceInfo.isTablet();
    return StyleSheet.create({
          bottomBorder: {
            height: 1,
            backgroundColor: colors.mainColors.borderColor || "#E5E5E5",
            marginTop: -1,
          },
    });
};
