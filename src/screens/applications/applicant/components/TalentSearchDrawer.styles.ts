import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../../../theme/colors';
import { shadowStyles } from '../../../../theme/shadowcolor';
import { useRNSafeAreaInsets } from '../../../../hooks/useRNSafeAreaInsets';

const { width: screenWidth } = Dimensions.get('window');
export const DRAWER_WIDTH = Math.min(screenWidth * 0.82, 340);

export const useStyles = (brandColors = colors.brand) => {
  const { insetsBottom } = useRNSafeAreaInsets();

  return StyleSheet.create({
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(16, 24, 40, 0.4)',
      zIndex: 1000,
    },
    drawerContainer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      width: DRAWER_WIDTH,
      backgroundColor: colors.base.white,
      zIndex: 1001,
      paddingBottom: Math.max(insetsBottom, 16),
      borderRightWidth: 1,
      borderRightColor: colors.gray[200],
      ...shadowStyles.shadow_lg,
    },
    drawerHeader: {
      height: 56,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.gray[100],
    },
    headerTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    headerIconBox: {
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: brandColors[50] || colors.brand[50],
      alignItems: 'center',
      justifyContent: 'center',
    },
    closeButton: {
      padding: 6,
      borderRadius: 6,
    },
    newSearchButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginHorizontal: 16,
      marginTop: 14,
      marginBottom: 10,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 10,
      backgroundColor: brandColors[50] || colors.brand[50],
      borderWidth: 1,
      borderColor: brandColors[200] || colors.brand[200],
    },
    newSearchText: {
      flex: 1,
    },
    sectionLabel: {
      paddingHorizontal: 16,
      marginTop: 12,
      marginBottom: 6,
      letterSpacing: 0.8,
    },
    historyScroll: {
      flex: 1,
      paddingHorizontal: 8,
    },
    historyScrollContent: {
      paddingVertical: 4,
    },
    historyItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 10,
      borderRadius: 8,
      marginVertical: 2,
    },
    historyItemActive: {
      backgroundColor: colors.gray[50],
    },
    historyIconBox: {
      width: 28,
      height: 28,
      borderRadius: 6,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    historyTextContainer: {
      flex: 1,
      marginRight: 6,
    },
    deleteItemButton: {
      padding: 6,
      borderRadius: 4,
    },
    emptyStateContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 48,
      paddingHorizontal: 20,
    },
    emptyStateText: {
      marginTop: 10,
      textAlign: 'center',
    },
    emptyStateSubtext: {
      marginTop: 4,
      textAlign: 'center',
    },
    drawerFooter: {
      paddingHorizontal: 16,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.gray[100],
    },
    clearAllButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 10,
      borderRadius: 8,
      backgroundColor: colors.gray[50],
      borderWidth: 1,
      borderColor: colors.gray[200],
    },
  });
};
