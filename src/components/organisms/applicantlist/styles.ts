import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import DeviceInfo from 'react-native-device-info';
import { shadowStyles } from '../../../theme/shadowcolor';

export const useStyles = () => {
  const isTablet = DeviceInfo.isTablet();
  return StyleSheet.create({
    card: {
      width:isTablet ? '49%':"100%",
      marginHorizontal:isTablet ? 5:0,
      backgroundColor: colors.base.white,
      padding: 16,
      borderRadius: 12,
      borderWidth: 0.5,
      borderColor: colors.gray[200],
      gap: 12,
      ...shadowStyles.shadow_xs
    },

    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    rowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    borderWrapper: {
      height:40,
      width:40,
      backgroundColor: colors.gray[100],
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: 'rgba(0, 0, 0, 0.08)',
      borderRadius:999,
      // padding: 4,
    },

    avatar: {
      width: 42,
      height: 42,
      borderRadius: 40,
      borderWidth: 1,
      borderColor: 'rgba(0, 0, 0, 0.08)',
    },

    name: {
      fontSize: 16,
      fontWeight: '700',
      color: '#1D2939',
    },
    appliedOn: {
      fontSize: 13,
      color: '#475467',
      marginTop: 4,
    },
    date: {
      color: '#7F56D9',
      textDecorationLine: 'underline',
    },

    appliedFor: {
      marginTop: 12,
      fontSize: 14,
      color: '#475467',
    },
    bold: {
      fontWeight: '600',
      color: '#1D2939',
    },

    divider: {
      height: 1,
      backgroundColor: '#EDEEEF',
      marginVertical: 12,
    },

    stage: {
      color: '#475467',
      fontSize: 14,
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

      // 🌫 Shadow (matches CSS box-shadow)
      shadowColor: "rgba(10, 13, 18, 0.05)",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 1,
      shadowRadius: 2,

      // Android
      elevation: 2,
      gap: 4,
    },

    statusDot: {
      width: 6,
      height: 6,
      borderRadius: 4,
      //backgroundColor: colors.brand[500],
    },
    statusText: {
      fontSize: 12,
      color: '#7F56D9',
      fontWeight: '500',
    },

    menu: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.gray[400],
    },
    initialCircle: {
      height:"90%",
      width:"90%",
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.gray[100],
      borderRadius:999
    }
  });
};