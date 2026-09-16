import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { Fonts } from '../../../theme/fonts';
import { shadowStyles } from '../../../theme/shadowcolor';

export const useStyles = () => {
    return StyleSheet.create({
        container: {
            backgroundColor: colors.base.white,
            borderRadius: 12,
            paddingVertical: 16,
            paddingHorizontal: 8,
            borderWidth: 0.5,
            borderColor: colors.gray['200'],
            gap: 16,
            ...shadowStyles.shadow_xs
        },
        headerRow: {
            paddingHorizontal: 6,
        },
        chartWrapper: {
            width: '100%',
        },
        xAxisLabel: {
            fontSize: 10.5,
            fontFamily: Fonts.InterMedium,
            color: colors.gray['600'],
            textAlign: 'center',
        },
        topLabelContainer: {
            alignItems: 'center',
            justifyContent: 'flex-end',
            overflow: 'visible',
        },
        topLabelText: {
            fontSize: 11,
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
            top: -10,
            marginLeft: 34,
            zIndex: 1000,
        },
        tooltipWrapperRightSide: {
            position: 'absolute',
            flexDirection: 'row',
            alignItems: 'center',
            top: -10,
            marginLeft: -116,
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
            minWidth: 96,
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
            paddingHorizontal: 6 
        }
    });
};