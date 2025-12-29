import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const useStyles = () => {
    return StyleSheet.create({
        container: { flex: 1, backgroundColor: '#fff' },
        centerWrap: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 32,
        },
        iconContainer: { alignItems: 'center' },
        iconCircle: {
            width: 56,
            height: 56,
            borderRadius: 100,
            backgroundColor: colors.brand[100],
            justifyContent: 'center',
            alignItems: 'center',
        },

        textWrap: { alignItems: 'center' },
        subtitle: { textAlign: 'center', maxWidth: 290 },
        footer: { alignItems: 'center' },
    });
};
