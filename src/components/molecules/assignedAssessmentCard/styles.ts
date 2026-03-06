import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import DeviceInfo from 'react-native-device-info';
import { shadowStyles } from '../../../theme/shadowcolor';

export const useStyles = () => {
  const isTablet = DeviceInfo.isTablet();

  return StyleSheet.create({
    card: {
      width: isTablet ? '49%' : '100%',
      marginHorizontal: isTablet ? 5 : 0,
      backgroundColor: colors.base.white,
      padding: 16,
      borderRadius: 12,
      borderWidth: 0.5,
      borderColor: colors.gray[200],
      gap: 12,
      marginBottom:16,
      ...shadowStyles.shadow_xs,
    },

    rowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    profileRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },

    avatarWrapper: {
      height: 40,
      width: 40,
      borderRadius: 999,
      backgroundColor: colors.gray[100],
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth:1,
      borderColor:'#00000014'
    },

    avatar: {
      height: 40,
      width: 40,
      borderRadius: 999,
    },

    infoSection: {
      gap: 6,
    },
    
    statusBadge: {
        backgroundColor: colors.base.white,
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderColor: colors.gray[300],
        shadowColor: "rgba(10, 13, 18, 0.05)",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 2,
        elevation: 2,
        gap: 4,
    },

    statusDot: {
      width: 6,
      height: 6,
      borderRadius: 4,
    },
  });
};
