import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../../theme/colors';

const { width } = Dimensions.get('window');
export const TRACK_WIDTH = width * 0.48;
export const THUMB_SIZE = 26;

export const useStyles = () => {
  return StyleSheet.create({
    container: {
      paddingLeft: width * 0.076,
    },

    badge: {
      alignSelf: 'flex-start',
    },

    sliderContainer: {
      marginTop: 14,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },

    track: {
      height: 6,
      backgroundColor: colors.gray[200],
      borderRadius: 6,
      position: 'absolute',
    },

    trackFill: {
      height: 6,
      backgroundColor: colors.brand[600],
      borderRadius: 6,
      position: 'absolute',
      left: 0,
    },

    thumb: {
      position: 'absolute',
      width: THUMB_SIZE,
      height: THUMB_SIZE,
      backgroundColor: colors.common.white,
      borderRadius: THUMB_SIZE,
      borderWidth: 2,
      borderColor: colors.brand[600],
      elevation: 4,
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },
  });
};
