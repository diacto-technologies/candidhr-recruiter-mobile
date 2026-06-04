import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { Fonts } from '../../../theme/fonts';
import { shadowStyles } from '../../../theme/shadowcolor';

export const useStyles = (isFocused: boolean, isDisabled: boolean, isError?: boolean) => {
  return StyleSheet.create({
    container: {
      gap: 6,
    },
    label: {
      marginBottom: 0,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    prefixContainer: {
      height: 44,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: isFocused && !isDisabled ? colors.brand[500] : colors.gray[300],
      borderTopLeftRadius: 8,
      borderBottomLeftRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.gray[50],
      borderRightWidth: 0,
      ...shadowStyles.xs,
    },
    inputContainer: {
      flex: 1,
      height: 44,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: isFocused && !isDisabled ? 2 : 1,
      borderColor: isError
        ? colors.error[400]
        : isFocused && !isDisabled
          ? colors.brand[500]
          : colors.gray[300],
      borderTopRightRadius: 8,
      borderBottomRightRadius: 8,
      backgroundColor: colors.base.white,
      paddingHorizontal: 12,
    },
    textInput: {
      flex: 1,
      fontSize: 16,
      fontWeight: '400',
      fontFamily: Fonts.InterRegular,
      color: isDisabled ? colors.gray[500] : colors.gray[900],
      padding: 0,
      margin: 0,
    },
    copyButton: {
      padding: 4,
      marginLeft: 8,
    },
    copyButtonPressed: {
      opacity: 0.6,
    },
    errorText: {
      marginTop: 4,
    },
  });
};
