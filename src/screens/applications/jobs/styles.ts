import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { useRNSafeAreaInsets } from '../../../hooks/useRNSafeAreaInsets';

export const useStyles = () => {
     const inset = useRNSafeAreaInsets()
    return StyleSheet.create({
        container: {flex:1,backgroundColor: colors.base.white,},
        subContainer:{flex:1},
        text: { fontSize: 22, fontWeight: '600' },
         floatingButton: {
          position: 'absolute',
          right: 24,
          bottom: inset.insetsBottom + 88,
        },
    });
};