import { StyleSheet, useWindowDimensions } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { colors } from '../../../theme/colors';

export const useStyles = () => {
  const { width } = useWindowDimensions();
  const isTablet = DeviceInfo.isTablet();
  const modalWidth = isTablet ? Math.min(760, width * 0.8) : Math.max(320, width - 32);

  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(10, 13, 18, 0.45)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 16,
    },
    card: {
      width: modalWidth,
      backgroundColor: colors.base.white,
      borderRadius: 16,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.gray[200],
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      //borderBottomWidth: 1,
      borderBottomColor: colors.gray[200],
      backgroundColor: colors.base.white,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flexShrink: 1,
    },
    headerIconWrap: {
      width: 30,
      height: 30,
      borderRadius: 100,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.warning[300],
    },
    body: {
      paddingHorizontal: 20,
      paddingVertical: 22,
      backgroundColor: colors.base.white,
      alignItems: 'center',
    },
    message: {
      textAlign: 'center',
      lineHeight: 26,
    },
    footer: {
      flexDirection: 'row',
      padding: 16,
      gap: 12,
      backgroundColor: colors.base.white,
    },
  });
};

