import { StyleSheet, useWindowDimensions } from 'react-native';
import { colors } from '../../../../../../theme/colors';
import { shadowStyles } from '../../../../../../theme/shadowcolor';

export const useStyles = () => {
    return  StyleSheet.create({
        container: {
          backgroundColor: colors.common.white,
          borderRadius: 12,
          borderWidth: 0.5,
          borderColor: colors.gray[200],
          padding: 16,
          gap: 20,
          ...shadowStyles.shadow_xs
        },
      
        topRow: {},
      
        topCard: {
          marginRight: 12,
        },
      
        topCardInner: {
          flexDirection: "row",
          alignItems: "center",
          borderRadius: 10,
          padding: 12,
          borderWidth: 2,
          borderColor: colors.brand[500],
          gap: 12,
        },
      
        videoSection: {
          gap: 8,
        },
      
        qCard: {
          borderWidth: 1,
          borderColor: colors.gray[200],
          borderRadius: 12,
          marginBottom: 12,
          backgroundColor: colors.common.white,
        },
      
        qCardTop: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: colors.gray[50],
          borderTopRightRadius: 12,
          borderTopLeftRadius: 12,
          padding: 12,
        },
      
        topChips: {
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
        },
      
        smallChip: {
          paddingHorizontal: 8,
          paddingVertical: 2,
          borderRadius: 999,
          borderWidth: 1,
        },
      
        optionRow: {
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 8,
        },
      
        optionChip: {
          paddingHorizontal: 12,
          paddingVertical: 4,
          borderRadius: 8,
          borderWidth: 1,
        },
      });
 }