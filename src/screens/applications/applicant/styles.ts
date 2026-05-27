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
        text: { fontSize: 22, fontWeight: '600' },
        flatListContent: { paddingVertical: 16, paddingHorizontal: 16, gap: 12, flexGrow: 1 },
        emptyStateBg: { height: '100%', width: '100%', top: -90 },
        emptyStateContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 },
        emptyStateContent: { alignItems: 'center', marginBottom: 10, zIndex: 10 },
        emptyStateSubtext: { textAlign: 'center' },
    });
};
