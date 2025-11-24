import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { screenWidth } from '../../../utils/devicelayout';

export const useStyles = () =>
  StyleSheet.create({
    backdrop: {
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
      flex: 1,
      justifyContent: 'center',
    },
    button: {
      alignItems: 'center',
      alignSelf: 'center',
      backgroundColor: colors.mainColors.main,
      borderRadius: 12,
      height: 48,
      justifyContent: 'center',
      minWidth: 82,
      paddingHorizontal: 32,
      paddingVertical: 12,
    },

    closeButtonWrapper: {
      position: 'absolute',
      right: 16,
      top: 16,
      zIndex: 1,
    },

    container: {
      alignItems: 'center',
      alignSelf: 'center',
      gap: 16,
      justifyContent: 'center',
      opacity: 1,
      paddingHorizontal: 16,
      paddingVertical: 20,
      width: screenWidth - 32,
    },
    gifImage: {
      alignItems: 'center',
      alignSelf: 'center',
      borderRadius: 82,
      height: 136,
      justifyContent: 'center',
      width: 136,
    },
    lottieStyle: {
      alignItems: 'center',
      alignSelf: 'center',
      height: 120,
      justifyContent: 'center',
      width: 120,
    },
    whiteModalButton: {
      borderColor: colors.mainColors.main,
      borderRadius: 12,
      borderWidth: 1,
      height: 48,
      justifyContent: 'center',
      width: 166,
    },

    whiteModalButtonContainer: {
      flexDirection: 'row',
      gap: 16,
      width: 348,
    },

    whiteModalButtonFilled: {
      backgroundColor: colors.mainColors.main,
    },
    flexView: {
      flex: 1,
    },
    distanceStyle: {
      gap: 7,
    },
  });
