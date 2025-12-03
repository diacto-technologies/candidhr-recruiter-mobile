import { StyleSheet } from 'react-native';

export const useStyles = () => {
    return StyleSheet.create({
        container: { flex: 1, backgroundColor: '#fff' },

        inner: {
          width: 375,
          paddingHorizontal: 16,
          paddingTop: 16,
          gap: 16,
          alignSelf: 'center',
        },
      
        subtitle: { color: '#606060', marginBottom: 8 },
      
        label: { marginTop: 8 },
      
        helper: { color: '#606060', marginTop: -6 },
    });
};