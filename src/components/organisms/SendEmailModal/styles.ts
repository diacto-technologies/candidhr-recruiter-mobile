import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const useStyles = () => {
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(10, 13, 18, 0.45)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 16,
    },
    card: {
      width: '100%',
      maxWidth: 400,
      maxHeight: '90%',
      backgroundColor: colors.base.white,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.gray[200],
      overflow: 'hidden',
      padding: 4,
    },
    submodalCard: {
      borderWidth: 2,
      borderRadius: 16,
      borderColor: colors.gray[200],
      overflow: 'hidden',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.gray[200],
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flexShrink: 1,
    },
    scroll: {
      maxHeight: 400,
    },
    scrollContent: {
      padding: 20,
      paddingBottom: 12,
    },
    emailFieldsContainer: {
      gap: 8,
    },
    requiredLabelRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    input: {
      flex: 1,
      fontSize: 14,
      borderWidth: 1,
      borderRadius: 8,
      color: colors.gray[900],
      paddingVertical: 10,
    },
    textArea: {
      minHeight: 80,
      textAlignVertical: 'top',
    },
    label: {
      marginBottom: 6,
      marginTop: 4,
    },
  });
};
