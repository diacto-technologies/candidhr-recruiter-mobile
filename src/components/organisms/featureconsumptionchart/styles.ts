import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { Fonts } from '../../../theme/fonts';
import { shadowStyles } from '../../../theme/shadowcolor';
import { isTablet } from 'react-native-device-info';

export const useStyles = () => {
    return StyleSheet.create({
        container: {
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 16,
            borderWidth: 0.5,
            borderColor: colors.gray['200'],
            ...shadowStyles.shadow_xs,
            gap:20,
            height:290,
        },
        title: {
            fontSize: 18,
            fontWeight: '700',
            marginBottom: 16,
        },
        xAxisLabel: {
            fontSize: 12,
            fontFamily: Fonts.InterRegular,
            fontWeight: '400',
            color: colors.gray['600'],
            textAlign: 'center',
        },
        topLabelContainer: {
            alignItems: 'center',
            justifyContent: 'flex-end',
            overflow: 'visible',
        },
        topLabelText: {
            fontSize: 12,
            fontFamily: Fonts.InterBold,
            fontWeight: '700',
            color: colors.gray['800'],
            textAlign: 'center',
            marginBottom: 4,
            minWidth: 40,
        },
        tooltipWrapperLeftSide: {
            position: 'absolute',
            flexDirection: 'row',
            alignItems: 'center',
            top: -8,
            marginLeft: isTablet() ? 285 : 105,
            zIndex: 1000,
        },
        tooltipWrapperRightSide: {
            position: 'absolute',
            flexDirection: 'row',
            alignItems: 'center',
            top: -8,
            marginLeft: isTablet() ? -125 : -102,
            zIndex: 1000,
        },
        tooltipArrowLeft: {
            width: 0,
            height: 0,
            borderTopWidth: 5,
            borderBottomWidth: 5,
            borderRightWidth: 7,
            borderTopColor: 'transparent',
            borderBottomColor: 'transparent',
            borderRightColor: colors.base.black,
        },
        tooltipArrowRight: {
            width: 0,
            height: 0,
            borderTopWidth: 5,
            borderBottomWidth: 5,
            borderLeftWidth: 7,
            borderTopColor: 'transparent',
            borderBottomColor: 'transparent',
            borderLeftColor: colors.base.black,
        },
        tooltipContainer: {
            backgroundColor: colors.base.black,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            minWidth: 88,
        },
        gridLines: {
            marginTop: 16,
            height: 164,
            justifyContent: 'flex-end',
            position: 'relative'
        },
        barLabels: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'flex-end',
            paddingHorizontal: 20,
        },
        barItem: {
            alignItems: 'center',
            gap: 8,
            paddingHorizontal: 10,
        },
    });
};
