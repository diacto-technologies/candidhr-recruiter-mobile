import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { Fonts } from '../../../theme/fonts';

export const useStyles = () => {
  return StyleSheet.create({
    container: {
      backgroundColor: colors.base.white,
      borderRadius: 10,
      borderColor: colors?.gray[200],
      borderWidth: 1,
    },
    wrapper: {
      flexDirection: "row",
    },
    lineNumbers: {
      marginRight: 12,
      borderColor: colors?.gray[200],
      backgroundColor: colors?.gray[50],
      padding: 10,
    },
    lineNumber: {
      color: colors.gray[400],
      height: 20,
      textAlign: "right",
    },
    editor: {
      minHeight: 160,
      fontFamily: Fonts.InterRegular,
      fontSize: 14,
      lineHeight: 20,
      color: colors.gray[700],
    },
    readOnly: {
      color: colors.gray[600],
    },
  });
};
