import { colors } from '../../../../../theme/colors';
import { StyleSheet } from 'react-native';
import { shadowStyles } from '../../../../../theme/shadowcolor';

export const useStyles = () => {
    return StyleSheet.create({
        container: {
            flex: 1,
            gap: 16,
        },

        shortListedCard: {
            backgroundColor: colors.common.white,
            borderRadius: 8,
            borderWidth: 0.5,
            borderColor: colors.gray[300],
            paddingVertical: 10,
            paddingHorizontal: 14,
            gap: 8,
            // shadowColor: '#0A0D12',
            // shadowOffset: { width: 0, height: 1 },
            // shadowOpacity: 0.05,
            // shadowRadius: 3,
            // elevation: 1,
            ...shadowStyles.shadow_xs
        },

        rowBetween: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
        },

        row: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },

        statusDot: {
            height: 8,
            width: 8,
            borderRadius: 30,
            backgroundColor: colors.success[500],
        },
    })
}