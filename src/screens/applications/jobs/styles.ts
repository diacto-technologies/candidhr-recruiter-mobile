import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { useRNSafeAreaInsets } from '../../../hooks/useRNSafeAreaInsets';

export const useStyles = () => {
    const { insetsBottom, insetsTop } = useRNSafeAreaInsets();
    return StyleSheet.create({
        container: {flex:1,backgroundColor: colors.base.white,},
        subContainer:{flex:1},
        text: { fontSize: 22, fontWeight: '600' }
    });
};