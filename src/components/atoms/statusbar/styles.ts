import { StyleSheet } from 'react-native';
import { useRNSafeAreaInsets } from '../../../hooks/useRNSafeAreaInsets';
import { screenWidth } from '../../../utils/devicelayout';

export const useStyles = () => {
  const { insetsTop } = useRNSafeAreaInsets();

  return StyleSheet.create({
    statusBar: {
      height: insetsTop,
      position: 'absolute',
      width: screenWidth,
      zIndex: 999,
    },
  });
};
