import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { hexToRgb } from '../../../utils/hexToRgb';
import { Fonts } from '../../../theme/fonts';

export const useStyles = (props: any, isFocus: boolean, size: any) => {

  return StyleSheet.create({
    // Root Wrapper
    container: {
      gap: 5,
    },

    // Label Row
    labelRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 3,
    },

    // Pressable Wrapper
    pressableBase: {
      alignItems: props?.multiline ? 'flex-start' : 'center',
      borderRadius: 12,
      borderStyle: 'solid',
      borderWidth: 1,
      flexDirection: 'row',
      gap: 10,
      overflow: 'hidden',
      paddingHorizontal: 16,
    },
    pressableDynamic: {
      backgroundColor:
        props.disable === true
          ? hexToRgb(colors.grayScale.lightGray, 0.5)
          : props.textFieldColor
            ? props.textFieldColor
            : colors.common.white,
      borderColor: props.isError
        ? hexToRgb(colors.mainColors.brightRed, 0.8)
        : isFocus
          ? colors.mainColors.main
          : colors.grayScale.veryLightGray,
      ...(props.multiline === true && { paddingVertical: 10 }),
    },

    // TextInput
    inputBase: {
      color: '#777777',
      flex: 1,
      fontSize: 14,
      margin: 0,
      padding: 0,
    },
    inputWithValue: {
      fontFamily: Fonts.calibribold,
      fontWeight: '700',
    },
    inputWithoutValue: {
      fontFamily: Fonts.calibriregular,
      fontWeight: '400',
    },
    inputDynamic: {
      height:
        props.multiline === true
          ? props.height
            ? props.height
            : 55
          : size[props.size || 'Medium'],
      ...(props.multiline === true && { textAlignVertical: 'top' }),
    },

    // Error Text
    errorText: {
      color: colors.common.black,
    },
  });
};
