import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const useStyles = () => {
    return StyleSheet.create({
        container: {
            flex: 1,
          },
          text: { fontSize: 22, fontWeight: '600' }
    });
};