import { StyleSheet } from 'react-native';

export const useStyles = () => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#fff',
          },
        
          inner: {
            zIndex:9999,
            padding: 16,
            gap: 24,
          },
        
          subtitle: {
            marginBottom: 8,
            color: '#606060',
          },
        
          label: {
            gap: 6
          },
        
          row: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          },
        
          forgot: {
            color: '#5F48E6',
          }
    });
};