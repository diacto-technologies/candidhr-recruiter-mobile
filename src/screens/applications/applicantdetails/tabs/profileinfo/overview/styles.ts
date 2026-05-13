import { StyleSheet } from 'react-native';
import { useRNSafeAreaInsets } from '../../../../../../hooks/useRNSafeAreaInsets';
import { shadowStyles } from '../../../../../../theme/shadowcolor';
import { colors } from '../../../../../../theme/colors';

export const useStyles = () => {
    const inset = useRNSafeAreaInsets()
    return StyleSheet.create({
        card: {
            backgroundColor: colors.common.white,
            borderRadius: 12,
            borderWidth: 0.5,
            borderColor: colors.gray[200],
            gap: 16,
            padding: 16,
            // shadowColor: '#0A0D12',
            // shadowOffset: { width: 0, height: 1 },
            // shadowOpacity: 0.05,
            // shadowRadius: 3,
            // elevation: 1,
            ...shadowStyles.shadow_xs
        },
        row: {
            flexDirection: "row",
            alignItems: "center",
        },
        iconBox: {
            padding: 10,
            borderRadius: 8,
            borderWidth: 1,
            backgroundColor: colors.base.white,
            borderColor: colors.gray[300],
            justifyContent: "center",
            alignItems: "center",
            //shadowColor: '#000',
            //shadowOffset: { width: 0, height: 1 },
            //shadowOpacity: 0.1,
            //shadowRadius: 2,
            //elevation: 1,
        },

        textBox: {
            flex: 1,
            marginLeft: 14,
        },

        divider: {
            height: 1,
            backgroundColor: colors.gray[200],
        },
        videoBox: {
            flex: 1,
            width: "100%",
            //height: 180,
            borderRadius: 14,
            //overflow: "hidden",
            // position: "relative",
        },
        video: {
            width: "100%",
            height: "100%",
        },
        insetTop: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 5,
            backgroundColor: "rgba(10,13,18,0.05)",
            zIndex: 1,
        },

        insetBottom: {
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 6,
            backgroundColor: "rgba(10,13,18,0.04)",
            zIndex: 1,
        },
    })
};