import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
 export const useStyles = () => {
    return StyleSheet.create({
        bg: {
            flex: 1,
            width: "100%",
            height: "100%",
            justifyContent: "space-between",
          },
          headerLogo: {
            flexDirection: "row",
            gap: 10,
            alignSelf: "center",
            alignItems: "center",
          },
          logoWrapper: {
            paddingTop:5,
            alignItems:'center',
          },
          content: {
            paddingHorizontal:16,
            paddingBottom: 40,
            gap:12
          },
          signInBtn: {
            backgroundColor: colors.brand[600],
            paddingVertical: 16,
            borderRadius: 12,
            marginBottom: 16,
          },
          contactBtn: {
            backgroundColor: colors.base.white,
            paddingVertical: 16,
            borderRadius: 12,
          },
    });
};
