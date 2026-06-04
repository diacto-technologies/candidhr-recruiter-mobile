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
    scroll: { maxHeight: 400 },
    scrollContent: { padding: 20, paddingBottom: 12 },
    section: {
      gap: 12,
      marginBottom: 20,
    },
    sharedList: {
      gap: 0,
    },
    sharedRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.gray[100],
    },
    avatarWrap: {
      marginRight: 12,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
    },
    avatarPlaceholder: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.gray[100],
      borderWidth: 1,
      borderColor: colors.gray[200],
      alignItems: 'center',
      justifyContent: 'center',
    },
    sharedInfo: {
      flex: 1,
      minWidth: 0,
    },
    rolePill: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.brand[200],
      backgroundColor: colors.brand[50],
      marginRight: 12,
    },
    deleteWrap: {
      padding: 4,
    },
    submodalCard: {
      borderWidth: 2,
      borderRadius: 16,
      borderColor: colors.gray[200],
      overflow: 'hidden',
    },
    closeButtonContainer: {
      marginHorizontal: 20,
      marginVertical: 10,
    },
  });
};
