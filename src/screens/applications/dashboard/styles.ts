import { StyleSheet, useWindowDimensions } from 'react-native';
import { colors } from '../../../theme/colors';
import { useRNSafeAreaInsets } from '../../../hooks/useRNSafeAreaInsets';
import DeviceInfo from "react-native-device-info";


export const useStyles = () => {
    const { insetsBottom, insetsTop } = useRNSafeAreaInsets();
    const { width } = useWindowDimensions();
    const isTablet = DeviceInfo.isTablet();
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.gray[50],
            paddingTop: insetsTop
        },
        scrollContent: {
            flex: 1,
            paddingHorizontal: 16,
            paddingVertical: 16,
        },
        listContainer: {
            gap: 16,
            paddingBottom: insetsBottom + 16
        },
        statGrid: {
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
        },

        statItem: {
            width: isTablet ? "49.5%" : "100%",
            marginBottom: 12,
        },
        chartGrid: {
            flexDirection: "row",
            justifyContent: "space-between",
          },
          
          chartItem: {
            width: "49.5%",
          },
    });
};
