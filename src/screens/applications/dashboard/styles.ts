import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { useRNSafeAreaInsets } from '../../../hooks/useRNSafeAreaInsets';

export const useStyles = () => {
    const { insetsBottom, insetsTop } = useRNSafeAreaInsets();
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.gray[50],
            paddingTop: insetsTop
        },
        scrollContent: {
            flex:1,
            paddingHorizontal: 16,
            paddingVertical: 16,
        },
        listContainer: {
            gap: 16,
            paddingBottom: insetsBottom+16
        }
    });
};
