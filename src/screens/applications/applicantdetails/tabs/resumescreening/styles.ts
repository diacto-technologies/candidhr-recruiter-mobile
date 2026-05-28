import { StyleSheet } from 'react-native';
import { shadowStyles } from '../../../../../theme/shadowcolor';
import { colors } from '../../../../../theme/colors';

export const useStyles = () => {
    return StyleSheet.create({
        container: { gap: 16 },
        shortListedCard: {
            backgroundColor: colors.common.white,
            borderRadius: 8,
            borderWidth: 0.5,
            borderColor: colors.gray[300],
            paddingVertical: 10,
            paddingHorizontal: 14,
            gap: 8,
            ...shadowStyles.shadow_xs
        },
        reviewRow: {
            flexDirection: "row",
            alignItems: "center",
            marginTop: 12,
        },
    });
};