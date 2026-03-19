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

        sectionCard: {
          borderWidth: 1,
          borderColor: colors.gray[200],
          borderRadius: 16,
          backgroundColor: colors.common.white,
          padding: 16,
          gap: 14,
        },

        sectionHeaderRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },

        sectionTitleRow: {
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        },

        statGrid: {
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 12,
        },

        statTile: {
          flexGrow: 1,
          flexBasis: "47%",
          paddingVertical: 14,
          paddingHorizontal: 14,
          borderRadius: 12,
          backgroundColor: colors.gray[50],
          borderWidth: 1,
          borderColor: colors.gray[200],
          gap: 6,
        },

        violationRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 6,
        },

        warningIcon: {
          width: 20,
          height: 20,
          borderRadius: 999,
          backgroundColor: colors.warning[50],
          borderWidth: 1,
          borderColor: colors.warning[200],
          alignItems: "center",
          justifyContent: "center",
        },

        bulletRow: {
          flexDirection: "row",
          alignItems: "flex-start",
          gap: 10,
        },
      });
 }