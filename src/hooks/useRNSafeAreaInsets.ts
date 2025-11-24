import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useRNSafeAreaInsets = () => {
  const insets = useSafeAreaInsets();

  return {
    insetsTop: insets.top,
    insetsBottom: insets.bottom,
    insetsLeft: insets.left,
    insetsRight: insets.right,
  };
};
