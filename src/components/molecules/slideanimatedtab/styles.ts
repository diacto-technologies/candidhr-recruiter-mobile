import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const useStyles = () => {
    return StyleSheet.create({
        container: {
            flexDirection: 'row',
            gap: 24,
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: colors.base.white,
          },
          tabBtn: {
            paddingBottom: 8,
          },
    });
};