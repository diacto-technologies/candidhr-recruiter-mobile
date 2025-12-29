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
            paddingHorizontal: 16,
            paddingTop: 10,
            gap: 12,
            position: "relative",
          },
          tabBtn: {
            paddingBottom: 12,
            paddingHorizontal: 6,
          },
          tabInner: {
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          },
        
          // Badge bubble
          countBadge: {
            paddingHorizontal:8,
            paddingVertical: 2,
            borderRadius:9999,
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