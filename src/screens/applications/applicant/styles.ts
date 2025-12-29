import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { useRNSafeAreaInsets } from '../../../hooks/useRNSafeAreaInsets';

export const useStyles = () => {
    const inset = useRNSafeAreaInsets()
    return StyleSheet.create({
        container: {
            backgroundColor: colors.neutrals.lightGray,
            flex: 1,
            paddingTop:inset.insetsTop
            // paddingHorizontal: 16,
            // paddingVertical: 12,
        },
        text: { fontSize: 22, fontWeight: '600' }
    });
};
