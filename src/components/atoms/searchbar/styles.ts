import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const useStyles = () => {
  return StyleSheet.create({
    wrapper: {
      width: '100%',
      position: 'relative',
      zIndex: 9999,
      elevation: 9999,
    },
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.common.white,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.gray[300],
      paddingHorizontal: 14,
      height: 44,
      shadowColor: '#0A0D12',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 2,
      elevation: 2,
    },
    icon: {
      marginRight: 8,
    },
    input: {
      flex: 1,
      fontSize: 18,
      color: colors.gray[500],
    },
    clearButton: {
      marginLeft: 8,
      padding: 4,
    },
    placeholder: {
      position: 'absolute',
      left: 46,
      right: 10,
      color: '#A3A3A7',
      fontSize: 18,
    },
    dropdownBox: {
      position: 'absolute',
      top: 50,
      left: 0,
      right: 0,
      backgroundColor: colors.base.white,
      borderWidth: 1,
      borderColor: colors.gray[300],
      borderRadius: 10,
      maxHeight: 260,
      overflow: 'hidden',
      zIndex: 9999,
      elevation: 10,
      shadowColor: '#0A0D12',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
    },
    item: {
      paddingVertical: 14,
      paddingHorizontal: 12,
    },
    itemText: {
      fontSize: 16,
      color: colors.gray[900],
    },
    emptyBox: {
      padding: 16,
    },
    emptyText: {
      color: colors.gray[500],
    },
    footerLoader: {
      padding: 12,
    },
    footerLoaderText: {
      textAlign: 'center',
      color: colors.gray[500],
    },
  });
};
