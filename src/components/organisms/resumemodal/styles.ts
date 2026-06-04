import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { screenWidth, screenHeight } from '../../../utils/devicelayout';

export const useStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.6)',
      justifyContent: 'center',
    },
    modalContent: {
      width: screenWidth,
      height: screenHeight * 0.9,
      backgroundColor: '#fff',
      borderTopLeftRadius: 18,
      borderTopRightRadius: 18,
      overflow: 'hidden',
    },
    header: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    pdfContainer: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    pdf: {
      flex: 1,
      width: screenWidth,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};
