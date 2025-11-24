import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { IButton } from './button';

export const useStyles = (props: IButton) => {
  const size = {
    Large: 73,
    Regular: 56,
    Medium: 48,
    Small: 40,
    Tab: 32,
  };

  return StyleSheet.create({
    button: {
      ...(!props.variant && {
        backgroundColor: props.disabled
          ? colors.grayScale.lightGray
          : props.buttonColor
            ? props.buttonColor
            : colors.mainColors.main,
        borderWidth: 1.5,
        borderColor: props.disabled
          ? colors.grayScale.lightGray
          : props.buttonColor
            ? props.buttonColor
            : colors.mainColors.main,
        borderStyle: 'solid',
      }),
      ...(props.variant === 'contain' && {
        backgroundColor: props.disabled
          ? colors.grayScale.lightGray
          : props.buttonColor
            ? props.buttonColor
            : colors.mainColors.main,
        borderWidth: 1.5,
        borderColor: props.disabled
          ? colors.grayScale.lightGray
          : props.borderColor
            ? props.borderColor
            : colors.mainColors.main,
        borderStyle: 'solid',
      }),
      ...(props.variant === 'text' && {}),
      ...(props.variant === 'outline' && {
        borderWidth: 1.5,
        borderColor: props.disabled
          ? colors.grayScale.lightGray
          : props.buttonColor
            ? props.buttonColor
            : colors.mainColors.main,
        borderStyle: 'solid',
      }),

      alignItems: 'center',
      height: typeof props.size === 'number' ? props.size : size[props.size || 'Medium'],
      justifyContent: 'center',
      overflow: 'hidden',
      paddingHorizontal: props.paddingHorizontal ? props.paddingHorizontal : 10,
    },
    content: {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
      flex: 1,
      gap: 10,
      justifyContent: 'center',
      //width: '100%',
    },
  });
};
