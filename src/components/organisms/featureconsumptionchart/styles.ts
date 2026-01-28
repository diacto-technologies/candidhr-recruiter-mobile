import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { Fonts } from '../../../theme/fonts';
import { shadowStyles } from '../../../theme/shadowcolor';

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
        tooltipWrapper: {
            position: 'absolute',
            flexDirection: 'row',
            alignItems: 'center',
            top: -8,
            marginLeft: 105,
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
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
        },
    });
};
