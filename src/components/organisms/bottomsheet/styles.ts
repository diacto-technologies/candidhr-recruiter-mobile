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
    modalRoot: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.1)',
    },
    sheetContainer: {
      alignSelf: 'stretch',
      backgroundColor: colors.common.white,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      overflow: 'hidden',
      marginHorizontal: 6,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
    },
    topSection: {
      marginTop: 5,
      paddingTop: 10,
      gap: 16,
    },
    dragHandle: {
      width: 35,
      height: 5,
      borderRadius: 5,
      backgroundColor: '#ccc',
      alignSelf: 'center',
    },
    subTitle: {
      fontSize: 16,
      fontWeight: '700',
    },
    touchableMask: {
      flex: 1,
    },
    clearAllWrap: {
      flex: 1,
      alignItems: 'flex-end',
    },

    wrapper: {
      backgroundColor: '#00000077',
      flex: 1,
    },
    closeIcon: { flex: 1, backgroundColor: 'rgba(0,0,0,0.1)' },
  });
};
