import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { IIconButton } from './iconbutton';

export const useStyles = (props: IIconButton) => {
  const sizeMap = {
    Large: 73,
    Regular: 56,
    Medium: 48,
    Small: 40,
    Tab: 32,
  };

  const defaultSize = typeof props.size === 'number' ? props.size : sizeMap[props.size || 'Medium'];

  const baseColor = props.disabled
    ? colors.neutrals.lightGray
    : props.buttonColor
    ? props.buttonColor
    : colors.mainColors.main;

  return StyleSheet.create({
    button: {
      ...(props.variant === undefined && {
        backgroundColor: baseColor,
        ...(props.showOutline && {
          borderWidth: 1.5,
          borderColor: baseColor,
          borderStyle: 'solid',
        }),
      }),
      ...(props.variant === 'contain' && {
        backgroundColor: baseColor,
        ...(props.showOutline && {
          borderWidth: 1.5,
          borderColor: baseColor,
          borderStyle: 'solid',
        }),
      }),
      ...(props.variant === 'text' && {}),
      ...(props.variant === 'outline' && {
        borderWidth: 1.5,
        borderColor: baseColor,
        borderStyle: 'solid',
      }),
      alignItems: 'center',
      borderRadius: 10,
      height: defaultSize,
      justifyContent: 'center',
      overflow: 'hidden',
      width: defaultSize,
    },
  });
};
