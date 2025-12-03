import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const useStyles = (color?: string) => {
  return StyleSheet.create({
    checkBox: {
      alignItems: 'center',
      borderColor: color ? color : colors.gray[300],
      borderRadius: 5,
      borderStyle: 'solid',
      borderWidth: 1,
      height: 20,
      justifyContent: 'center',
      width: 20,
    },
    checkBoxRound: {
      alignItems: 'center',
      borderColor: color ? color : colors.mainColors.main,
      borderRadius: 20 / 2,
      borderStyle: 'solid',
      borderWidth: 1,
      height: 20,
      justifyContent: 'center',
      width: 20,
    },
    checkBoxRoundActive: {
      alignItems: 'center',
      backgroundColor: color ? color : colors.mainColors.main,
      borderRadius: 13.33 / 2,
      height: 13.33,
      justifyContent: 'center',
      width: 13.33,
    },
  });
};
