import { StyleSheet } from 'react-native';
import { colors } from '../../../../../theme/colors';
import { shadowStyles } from '../../../../../theme/shadowcolor';

export const useStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    cardContainer: {
      backgroundColor: colors.common.white,
      borderRadius: 16,
      borderWidth: 0.5,
      borderColor: colors.gray[200],
      padding: 16,
      marginTop: 16,
      ...shadowStyles.shadow_xs,
    },
    topHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerRightWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    stepperWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    stepperBtn: {
      width: 32,
      height: 32,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.gray[200],
      backgroundColor: colors.base.white,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepperBtnDisabled: {
      opacity: 0.4,
    },
    breakdownButton: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 6,
      backgroundColor: colors.brand[50],
      borderWidth: 1,
      borderColor: colors.brand[200],
    },
    headerDivider: {
      marginVertical: 14,
    },
    responseMetaRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 12,
      marginBottom: 10,
    },
    responseCandidateLabel: {
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    },
    timestampJumpBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
      backgroundColor: colors.brand[50],
    },
    transcriptionFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 14,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: colors.gray[100],
    },
    copyBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.gray[200],
      backgroundColor: colors.base.white,
    },
    mainVideoCard: {
      borderRadius: 12,
      overflow: 'hidden',
      marginTop: 16,
      position: 'relative',
    },
    questionHeader: {
      marginTop: 16,
      marginBottom: 16,
      gap: 6,
    },
    questionNumberLabel: {
      letterSpacing: 0.5,
    },
    videoTitle: {
      lineHeight: 24,
    },
    transcriptionSection: {
      gap: 16,
      marginTop: 8,
    },
    transcriptionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    transcriptionTabs: {
      flexDirection: 'row',
      gap: 8,
    },
    transcriptionTab: {
      paddingVertical: 4,
      paddingHorizontal: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.gray[200],
      backgroundColor: colors.gray[50],
    },
    transcriptionTabActive: {
      backgroundColor: colors.brand[50],
      borderColor: colors.brand[200],
    },
    transcriptionContent: {},
    transcriptionText: {
      lineHeight: 22,
      color: colors.gray[700],
    },
    wordWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    wordHighlight: {
      borderRadius: 6,
    },
    transcriptionSegments: {
      gap: 12,
    },
    transcriptionSegment: {
      gap: 4,
    },
    transcriptionSegmentText: {
      lineHeight: 22,
    },
    transcriptionTimestamp: {
      marginTop: 2,
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
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.brand[100],
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 2,
    },
    criteriaContent: {
      flex: 1,
    },
    levelsList: {
      gap: 8,
      marginBottom: 14,
    },
    levelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: '#F9FAFB',
      borderRadius: 10,
      paddingVertical: 12,
      paddingHorizontal: 14,
    },
    levelBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      minWidth: 36,
      alignItems: 'center',
      justifyContent: 'center',
    },
    levelName: {
      flex: 1,
    },
    disclaimerText: {
      lineHeight: 16,
      marginTop: 8,
    },
    modalFooter: {
      paddingTop: 14,
      borderTopWidth: 1,
      borderTopColor: colors.gray[200],
    },
    backButtonWrap: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderWidth: 1.5,
      borderColor: colors.brand[600],
      borderRadius: 8,
      alignSelf: 'flex-start',
      backgroundColor: colors.base.white,
    },

    // Breakdown Modal Specific
    scoreHeroRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      marginBottom: 14,
    },
    cefrBadgeLarge: {
      borderWidth: 2,
      borderColor: '#16A34A',
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 8,
      backgroundColor: colors.base.white,
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 54,
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
      gap: 4,
      marginBottom: 14,
    },
    segment: {
      flex: 1,
      height: 8,
      borderRadius: 4,
    },
    summaryParagraph: {
      lineHeight: 20,
      marginBottom: 14,
    },
    skillCardsList: {
      gap: 10,
      marginBottom: 14,
    },
    skillCard: {
      backgroundColor: colors.base.white,
      borderRadius: 12,
      padding: 14,
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
      backgroundColor: '#DCFCE7',
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
      alignItems: 'center',
      justifyContent: 'center',
    },
    skillDesc: {
      lineHeight: 18,
    },
    breakdownFooterRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 14,
      borderTopWidth: 1,
      borderTopColor: colors.gray[200],
    },
    howCalculatedButton: {
      paddingVertical: 4,
    },

    // ─── Interview Monitoring Modal ───────────────────────────────────────────
    monitoringSectionHeader: {
      marginTop: 20,
      marginBottom: 10,
      letterSpacing: 0.5,
    },
    monitoringDeviceCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.base.white,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.gray[200],
      padding: 12,
      marginBottom: 4,
    },
    monitoringDeviceIconWrap: {
      width: 40,
      height: 40,
      borderRadius: 8,
      backgroundColor: colors.gray[50],
      borderWidth: 1,
      borderColor: colors.gray[200],
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    monitoringDeviceTextWrap: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 8,
    },
    monitoringBarChart: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 8,
      paddingVertical: 6,
    },
    monitoringBarItem: {
      flex: 1,
      alignItems: 'center',
    },
    monitoringBarCountWrap: {
      height: 18,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 6,
    },
    monitoringBarTrack: {
      width: '100%',
      height: 48,
      borderRadius: 10,
      backgroundColor: '#F2F4F7',
      overflow: 'hidden',
      justifyContent: 'flex-end',
    },
    monitoringBarFill: {
      width: '100%',
      backgroundColor: '#6172F3',
    },
    monitoringBarLabel: {
      marginTop: 8,
    },
    monitoringObservedList: {
      marginTop: 4,
      marginBottom: 8,
    },
    monitoringObservedRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.gray[100],
    },
    monitoringObservedIcon: {
      width: 38,
      height: 38,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    monitoringObservedIconAmber: {
      backgroundColor: '#FEF6EE',
      borderWidth: 1,
      borderColor: '#FEDF89',
    },
    monitoringObservedIconPurple: {
      backgroundColor: '#EEEDFF',
      borderWidth: 1,
      borderColor: '#DDDBFF',
    },
    monitoringObservedIconHighlighted: {
      backgroundColor: '#FEF6EE',
      borderWidth: 1,
      borderColor: '#FEDF89',
    },
    monitoringObservedIconDefault: {
      backgroundColor: '#F9FAFB',
      borderWidth: 1,
      borderColor: colors.gray[200],
    },
    monitoringFooter: {
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.gray[200],
      backgroundColor: colors.gray[50],
      marginHorizontal: -18,
      paddingHorizontal: 18,
      marginBottom: -24,
      paddingBottom: 24,
      borderBottomLeftRadius: 18,
      borderBottomRightRadius: 18,
    },
    monitoringButton: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 6,
      backgroundColor: colors.gray[50],
      borderWidth: 1,
      borderColor: colors.gray[200],
    },

    // ─── Abandoned / Not Completed Interview Card ─────────────────────────────
    abandonedCard: {
      backgroundColor: colors.common.white,
      borderRadius: 16,
      borderWidth: 0.5,
      borderColor: colors.gray[200],
      paddingVertical: 36,
      paddingHorizontal: 24,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 16,
      ...shadowStyles.shadow_xs,
    },
    abandonedIconWrap: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: '#F4F3FF',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    abandonedTitle: {
      marginBottom: 8,
      textAlign: 'center',
    },
    abandonedDesc: {
      textAlign: 'center',
      maxWidth: 440,
      lineHeight: 22,
    },
    abandonedMonitoringBtn: {
      marginTop: 18,
    },

    // Utilities
    flex1: {
      flex: 1,
    },
    marginTop2: {
      marginTop: 2,
    },
  });


