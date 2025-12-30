import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
export const useStyles = () => {
  return StyleSheet.create({
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.common.backdrop,
      zIndex: 9999,
    },
    container: {
      backgroundColor: '#fff',
      height: 0,
      overflow: 'hidden',
      width: '100%',
    },
    draggableContainer: {
      alignItems: 'center',
      backgroundColor: 'transparent',
      width: '100%',
    },
    draggableIcon: {
      backgroundColor: '#ccc',
      borderRadius: 5,
      height: 5,
      margin: 10,
      width: 35,
    },
    header: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 20,
      justifyContent:'space-between',
      paddingHorizontal: 20,
    },
    mask: {
      backgroundColor: 'transparent',
      flex: 1,
    },
    sheetContainer: {
      backgroundColor: colors.common.white,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      overflow: 'hidden',
      marginHorizontal:6,
      borderBottomLeftRadius:16,
      borderBottomRightRadius:16,
    },
    subTitle: {
      fontSize: 16,
      fontWeight: '700',
    },
    touchableMask: {
      flex: 1,
    },

    wrapper: {
      backgroundColor: '#00000077',
      flex: 1,
    },
    closeIcon: { flex: 1, backgroundColor: colors.common.backdrop, marginBottom:20, paddingHorizontal:6,}
  });
};
