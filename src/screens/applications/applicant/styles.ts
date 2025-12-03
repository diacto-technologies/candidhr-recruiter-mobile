import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const useStyles = () => {
    return StyleSheet.create({
        container: {
            backgroundColor: colors.neutrals.lightGray,
            flex: 1,
            // paddingHorizontal: 16,
            // paddingVertical: 12,
        },
        text: { fontSize: 22, fontWeight: '600' }
    });
};
