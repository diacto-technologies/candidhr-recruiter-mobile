import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { Fonts } from '../../../theme/fonts';

export const useStyles = () => {
    return StyleSheet.create({
        container: {
            backgroundColor: colors.base.white,
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.gray['200'],
            shadowColor: '#0A0D12',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 3,
            elevation: 1,
            gap:20,
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