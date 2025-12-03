import { StyleSheet } from 'react-native';

export const useStyles = () => {
    return StyleSheet.create({
        container: { flex: 1, backgroundColor: '#fff' },
        inner: {
            padding: 16,
            gap: 24,
        },
        gap: { gap: 6 },
    });
};