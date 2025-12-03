import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const useStyles = () => {
    return StyleSheet.create({
        container: { flex: 1, backgroundColor: '#fff' },
        inner: {
          padding: 16,
          gap: 24,
        },
        subtitle: { color: '#606060', marginBottom: 8 },
        gap: { gap: 6 },
        validateTxt:{color:colors.brand[600]},
        bottomContainer: {
         width:'100%',
         marginBottom:70
        },
    });
};