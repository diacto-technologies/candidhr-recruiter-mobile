import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const useStyles = () => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.gray[50],
        },
        scrollContent: {
            paddingHorizontal: 16,
            paddingVertical: 16,
        },
        listContainer: {
            gap: 16,
        }
    });
};
