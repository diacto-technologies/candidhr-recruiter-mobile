import { StyleSheet } from 'react-native';
import { colors } from '../../../../../theme/colors';

export const useStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      //backgroundColor: colors.base.white,
      //padding: 16,
    },
    topHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    breakdownButton: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 6,
      backgroundColor: colors.brand[50],
      borderWidth: 1,
      borderColor: colors.brand[200],
    },
    questionDropdownTrigger: {
      borderWidth: 1,
      borderColor: colors.gray[300],
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 12,
      backgroundColor: colors.base.white,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    dropdownOptionsList: {
      borderWidth: 1,
      borderColor: colors.gray[200],
      borderRadius: 8,
      backgroundColor: colors.base.white,
      marginBottom: 10,
      overflow: 'hidden',
    },
    dropdownOptionItem: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.gray[100],
    },
    dropdownOptionActive: {
      backgroundColor: colors.brand[50],
    },
    badgeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 14,
    },
    pillBadge: {
      backgroundColor: colors.gray[100],
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 8,
    },
    videoContainer: {
      borderRadius: 12,
      overflow: 'hidden',
      marginBottom: 16,
      backgroundColor: colors.gray[900],
      height: 220,
    },
    videoPlayerBox: {
      width: '100%',
      height: '100%',
    },
    questionHeader: {
      marginBottom: 12,
    },
    transcriptionSection: {
      marginTop: 12,
    },
    transcriptionHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    toggleRow: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 12,
    },
    toggleButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.gray[300],
      backgroundColor: colors.base.white,
    },
    toggleButtonActive: {
      borderColor: colors.brand[600],
      backgroundColor: colors.brand[50],
    },
    continuousBox: {
      backgroundColor: colors.gray[50],
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.gray[200],
    },
    wordWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 4,
    },
    wordHighlight: {
      backgroundColor: colors.brand[100],
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 4,
    },
    timelineRow: {
      flexDirection: 'row',
      gap: 12,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.gray[100],
    },
    timelineTimestamp: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      backgroundColor: colors.brand[50],
      alignSelf: 'flex-start',
    },
    timelineContent: {
      flex: 1,
    },
    emptyStateContainer: {
      padding: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },

    // Modal Styles
    modalOverlay: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalBackdrop: {
      flex: 1,
    },
    modalContainer: {
      backgroundColor: colors.base.white,
      borderTopLeftRadius: 18,
      borderTopRightRadius: 18,
      paddingHorizontal: 18,
      paddingTop: 16,
      paddingBottom: 24,
      maxHeight: '85%',
    },
    modalHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingBottom: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.gray[200],
    },
    modalScroll: {
      marginVertical: 12,
    },
    closeButton: {
      padding: 6,
    },
    introParagraph: {
      lineHeight: 20,
      marginBottom: 14,
    },
    sectionHeader: {
      letterSpacing: 0.5,
      marginTop: 10,
      marginBottom: 8,
    },
    criteriaList: {
      gap: 10,
      marginBottom: 14,
    },
    criteriaRow: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'flex-start',
    },
    criteriaIconWrap: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.brand[50],
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 2,
    },
    criteriaContent: {
      flex: 1,
    },
    levelsList: {
      gap: 6,
      marginBottom: 14,
    },
    levelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      backgroundColor: colors.gray[50],
      borderRadius: 8,
      padding: 8,
    },
    levelBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      minWidth: 32,
      alignItems: 'center',
    },
    levelName: {
      flex: 1,
    },
    disclaimerText: {
      lineHeight: 16,
      marginTop: 8,
    },
    modalFooter: {
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.gray[200],
    },
    backButtonWrap: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: colors.brand[600],
      borderRadius: 6,
      alignSelf: 'flex-start',
    },

    // Breakdown Modal Specific
    scoreHeroRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      marginBottom: 12,
    },
    cefrBadgeLarge: {
      borderWidth: 1.5,
      borderColor: colors.success[500],
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: colors.success[50],
    },
    scoreHeroInfo: {
      flex: 1,
    },
    rowAlignBaseline: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: 4,
    },
    segmentedBar: {
      flexDirection: 'row',
      gap: 3,
      marginBottom: 14,
    },
    segment: {
      flex: 1,
      height: 8,
      borderRadius: 2,
    },
    summaryParagraph: {
      lineHeight: 20,
      marginBottom: 14,
    },
    skillCardsList: {
      gap: 8,
      marginBottom: 14,
    },
    skillCard: {
      backgroundColor: colors.gray[50],
      borderRadius: 10,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.gray[200],
    },
    skillCardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 6,
    },
    skillLevelPill: {
      backgroundColor: colors.success[100],
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
    },
    skillDesc: {
      lineHeight: 16,
    },
    breakdownFooterRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.gray[200],
    },
    howCalculatedButton: {
      paddingVertical: 4,
    },

    // Utilities
    flex1: {
      flex: 1,
    },
    marginTop2: {
      marginTop: 2,
    },
  });
