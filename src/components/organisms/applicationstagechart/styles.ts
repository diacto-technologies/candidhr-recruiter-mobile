import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { Fonts } from '../../../theme/fonts';
import { shadowStyles } from '../../../theme/shadowcolor';

export const useStyles = () => {
    return StyleSheet.create({
        container: {
            backgroundColor: colors.base.white,
            borderRadius: 12,
            padding: 16,
            borderWidth: 0.5,
            borderColor: colors.gray['200'],
            gap:20,
            ...shadowStyles.shadow_xs
        },
    
        xAxisLabel: {
            fontSize: 12,
            fontFamily: Fonts.InterRegular,
            fontWeight: '400',
            color: colors.gray['600'],
            textAlign: 'center',
        },
        tooltipWrapper: {
            position: 'absolute',
            flexDirection: 'row',
            alignItems: 'center',
            top: -22,
            marginLeft: 40,
        },
        tooltipArrow: {
            width: 0,
            height: 0,
            borderTopWidth: 6,
            borderBottomWidth: 6,
            borderRightWidth: 8,
            borderTopColor: 'transparent',
            borderBottomColor: 'transparent',
        },
    
        tooltipContainer: {
            backgroundColor: colors.base.black,
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
        },
    });
};