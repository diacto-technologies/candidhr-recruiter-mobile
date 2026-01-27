import { StyleSheet, useWindowDimensions } from "react-native";
import { useRNSafeAreaInsets } from "../../../hooks/useRNSafeAreaInsets";
import DeviceInfo from "react-native-device-info";
import { colors } from "../../../theme/colors";

export const useStyles = () => {
    const { insetsBottom, insetsTop } = useRNSafeAreaInsets();
    return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.gray[50],
      paddingHorizontal: 16,
    },
  
    profileCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.base.white,
      borderRadius: 16,
      padding: 16,
      marginTop: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.gray[200],
    },
    profileLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatarWrap: {
      width: 44,
      height: 44,
      borderRadius: 22,
      overflow: 'hidden',
      marginRight: 12,
      borderWidth: 1,
      borderColor: "#00000014"
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
    },
    avatarPlaceholder: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.gray[200],
      alignItems: 'center',
      justifyContent: 'center',
    },
    profileInfo: {
      justifyContent: 'center',
    },
  
    detailsCard: {
      backgroundColor: colors.base.white,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.gray[200],
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.gray[200],
    },
  
    card: {
      backgroundColor: colors.base.white,
      borderRadius: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.gray[200],
      overflow: 'hidden',
    },
  
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 16,
      backgroundColor: colors.base.white,
    },
    rowDivider: {
      borderBottomWidth: 1,
      borderBottomColor: colors.gray[200],
      marginHorizontal: 16
    },
  
    rowLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  
    rowIconWrap: {
      padding: 8,
      borderRadius: 50,
      backgroundColor: colors.gray[50],
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
  
    logoutIconWrap: {
      backgroundColor: colors.error[50],
      borderColor: colors.error[200],
    },
  })
}