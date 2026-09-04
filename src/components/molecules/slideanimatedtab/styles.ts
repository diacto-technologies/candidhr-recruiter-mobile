import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const useStyles = () => {
    return StyleSheet.create({
        // container: {
        //     flexDirection: 'row',
        //     gap: 24,
        //     paddingHorizontal: 16,
        //     paddingVertical: 12,
        //     backgroundColor: colors.base.white,
        //   },
          // tabBtn: {
          //   paddingBottom: 8,
          // },
          tabRow: {
            flexDirection: "row",
            paddingHorizontal: 12,
            paddingTop: 6,
            gap: 8,
            position: "relative",
          },
          tabBtn: {
            paddingBottom: 10,
            paddingHorizontal: 4,
          },
          tabInner: {
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
          },
        
          // Badge bubble
          countBadge: {
            paddingHorizontal: 6,
            paddingVertical: 1.5,
            borderRadius: 9999,
            borderWidth: 1.5,
          },
          countActive: {
            backgroundColor: colors.brand[50],
            borderColor: colors.brand[200],
          },
          countInactive: {
            backgroundColor: colors.gray[50],
            borderColor: colors.gray[200],
          },
        
          underline: {
            position: "absolute",
            bottom: 0,
            height: 3,
            backgroundColor: colors.brand[700],
            borderRadius: 100,
          },
    });
};