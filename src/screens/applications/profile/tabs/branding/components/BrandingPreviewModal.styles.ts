import { StyleSheet } from 'react-native';
import { colors } from '../../../../../../theme/colors';

export const usePreviewModalStyles = (brandColor: string = colors.brand[600]) => {
  const activeColor = brandColor || colors.brand[600];

  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 24,
    },
    modalCard: {
      backgroundColor: colors.base.white,
      borderRadius: 20,
      width: '100%',
      maxHeight: '94%',
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 10,
    },
    headerContainer: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.gray[200],
    },
    headerTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    eyeIconContainer: {
      width: 32,
      height: 32,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerSubtitle: {
      marginTop: 6,
      lineHeight: 18,
    },
    closeButton: {
      width: 36,
      height: 36,
      borderColor: colors.gray[200],
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.base.white,
    },
    previewScroll: {
      backgroundColor: '#F1F5F9',
    },
    previewScrollContent: {
      padding: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },

    // Mobile Phone Frame Styles
    phoneFrame: {
      width: '100%',
      maxWidth: 340,
      backgroundColor: colors.base.white,
      borderRadius: 28,
      borderWidth: 3,
      borderColor: '#1E293B',
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 10,
      elevation: 4,
    },
    phoneNotchWrap: {
      height: 22,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.base.white,
    },
    phoneIsland: {
      width: 60,
      height: 7,
      borderRadius: 4,
      backgroundColor: '#0F172A',
    },

    // Mobile Brand Bar on Jobs Screen (showing logo + brand name)
    mobileBrandBar: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 14,
      paddingTop: 8,
      paddingBottom: 4,
    },
    mobileLogoImage: {
      width: 26,
      height: 26,
    },
    mobileAutoLetterBadge: {
      width: 24,
      height: 24,
      borderRadius: 6,
      alignItems: 'center',
      justifyContent: 'center',
    },
    mobileAutoLetterText: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.base.white,
    },
    mobileBrandTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.gray[900],
      flexShrink: 1,
    },

    mobileHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 14,
      paddingVertical: 6,
    },
    mobileHeaderTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.gray[900],
    },
    mobileSearchBtn: {
      width: 28,
      height: 28,
      alignItems: 'center',
      justifyContent: 'center',
    },
    mobileTabsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.gray[200],
    },
    mobileTabItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingVertical: 8,
      paddingHorizontal: 8,
    },
    mobileTabItemActive: {
      borderBottomWidth: 2,
      borderBottomColor: activeColor,
    },
    mobileTabTextActive: {
      fontSize: 12,
      fontWeight: '600',
      color: activeColor,
    },
    mobileTabTextInactive: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.gray[500],
    },
    mobileBadgeActive: {
      paddingHorizontal: 6,
      paddingVertical: 1,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: activeColor,
      backgroundColor: `${activeColor}12`,
    },
    mobileBadgeActiveText: {
      fontSize: 10,
      fontWeight: '600',
      color: activeColor,
    },
    mobileBadgeInactive: {
      paddingHorizontal: 6,
      paddingVertical: 1,
      borderRadius: 10,
      backgroundColor: colors.gray[100],
    },
    mobileBadgeInactiveText: {
      fontSize: 10,
      fontWeight: '500',
      color: colors.gray[500],
    },

    // Job Cards Shimmer List
    mobileCardList: {
      padding: 10,
      gap: 10,
      backgroundColor: colors.gray[50],
    },
    mobileJobCard: {
      backgroundColor: colors.base.white,
      borderWidth: 1,
      borderColor: colors.gray[200],
      borderRadius: 10,
      padding: 12,
      gap: 8,
    },
    mobileCardTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    mobileTagsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 2,
    },
    mobileTagsLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    mobileCardFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 4,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: colors.gray[100],
    },
    mobileStatsGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    mobileAuthorGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },

    // Floating Filter Bar
    mobileFloatingFilterBar: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderTopWidth: 1,
      borderTopColor: colors.gray[200],
      backgroundColor: colors.base.white,
    },
    mobileFilterButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
      marginRight: 2,
    },
    mobileFilterButtonText: {
      fontSize: 10,
      fontWeight: '600',
      color: colors.gray[700],
    },
    mobileChipActive: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: activeColor,
      backgroundColor: `${activeColor}12`,
    },
    mobileChipActiveText: {
      fontSize: 9.5,
      fontWeight: '600',
      color: activeColor,
    },
    mobileChipInactive: {
      paddingHorizontal: 7,
      paddingVertical: 3,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.gray[200],
      backgroundColor: colors.base.white,
    },
    mobileChipInactiveText: {
      fontSize: 9.5,
      fontWeight: '500',
      color: colors.gray[600],
    },

    // Bottom Navigation Bar
    mobileBottomNav: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      height: 44,
      borderTopWidth: 1,
      borderTopColor: colors.gray[200],
      backgroundColor: colors.base.white,
    },
    mobileNavItem: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
    mobileHomeBarWrap: {
      height: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.base.white,
    },
    mobileHomeBar: {
      width: 90,
      height: 3,
      borderRadius: 2,
      backgroundColor: '#0F172A',
    },
  });
};
