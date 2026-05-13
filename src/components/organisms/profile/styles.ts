import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { screenWidth } from '../../../utils/devicelayout';

export const useStyles = () =>
    StyleSheet.create({
        container: {
            backgroundColor: colors.base.white,
            overflow: 'hidden',
        },
        header: {
            height: 90,
            borderRadius: 12,
            margin: 4
        },
        photoWrapper: {
            position: 'absolute',
            top: 35,
            left: 18,
            zIndex: 10,
        },
        shimmerBorder: {
            width: 105,
            height: 105,
            borderRadius: 999,
            backgroundColor: colors.base.white,
            padding: 4,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: 'rgba(0, 0, 0, 0.08)',
        },
        infoContainer: {
            paddingHorizontal: 16,
            paddingTop: 52,
            paddingBottom: 16,
            gap: 16,
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        iconRow: {
            flexDirection: 'row',
            gap: 12,
        },
        iconBox: {
            width: 40,
            height: 40,
            backgroundColor: colors.base.white,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.gray[300],
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 1,
        },
    });