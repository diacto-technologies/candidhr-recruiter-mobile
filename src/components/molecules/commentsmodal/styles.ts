import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const useStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.base.white,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    card: {
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderColor: colors.gray[200],
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    userRow: {
      flexDirection: 'row',
      gap: 10,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.gray[200],
    },
    nameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    tag: {
      backgroundColor: colors.brand[50],
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 6,
    },
    rightRow: {
      alignItems: 'flex-end',
    },
    menuDot: {
      paddingTop: 4,
    },
    commentText: {
      marginTop: 10,
    },
    commentContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderTopWidth: 1,
      borderColor: colors.gray[200],
    },
    buttonRow: {
      paddingLeft: 5,
    },
  });
};
