import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const useStyles = (
  size: number,
  borderRadius: number,
  imageSize: number,
  badgeSize: number
) => {
  return StyleSheet.create({
    wrapper: {
      position: 'relative',
      alignSelf: 'center',
      justifyContent: 'center',
    },
    container: {
      backgroundColor: colors.base.white,
      borderWidth: 2,
      borderColor: colors.gray[200],
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
      width: size,
      height: size,
      borderRadius: borderRadius,
    },
    imageWrapper: {
      width: imageSize,
      height: imageSize,
      borderRadius: imageSize / 2,
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
    },
    initialsContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.gray[100],
      width: size,
      height: size,
      borderRadius: borderRadius,
    },
    editBadge: {
      position: 'absolute',
      bottom: -4,
      right: -4,
      backgroundColor: colors.base.white,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: 1,
      borderColor: colors.gray[100],
      width: badgeSize,
      height: badgeSize,
      borderRadius: 100,
    },
    logoImage: {
      width: '100%',
      height: '100%',
    },
  });
};
