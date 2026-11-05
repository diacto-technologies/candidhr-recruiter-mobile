import { StyleSheet, Platform } from 'react-native';
import { colors } from '../../../theme/colors';
import { shadowStyles } from '../../../theme/shadowcolor';
import { useRNSafeAreaInsets } from '../../../hooks/useRNSafeAreaInsets';

export const useStyles = (brandColors = colors.brand) => {
  const { insetsBottom } = useRNSafeAreaInsets();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.base.white,
    },
    // Top Header Bar
    headerBar: {
      height: 56,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.gray[100],
      backgroundColor: colors.base.white,
    },
    headerIconButton: {
      width: 40,
      height: 40,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerCenterContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },

    // Content Scroll
    keyboardAvoidingView: {
      flex: 1,
    },
    contentScroll: {
      flex: 1,
    },
    contentScrollContainer: {
      paddingHorizontal: 20,
      paddingTop: 28,
      paddingBottom: 24,
    },

    // Hero Section
    heroSection: {
      alignItems: 'center',
      marginBottom: 32,
    },
    heroIconContainer: {
      width: 58,
      height: 58,
      borderRadius: 18,
      backgroundColor: brandColors[50] || colors.brand[50],
      borderWidth: 1.5,
      borderColor: brandColors[200] || colors.brand[200],
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
      ...shadowStyles.shadow_xs,
    },
    heroTitle: {
      fontSize: 22,
      lineHeight: 28,
      fontWeight: '700',
      color: colors.gray[900],
      textAlign: 'center',
      letterSpacing: -0.4,
    },
    heroSubtitle: {
      fontSize: 14,
      lineHeight: 21,
      fontWeight: '400',
      color: colors.gray[500],
      textAlign: 'center',
      marginTop: 8,
      paddingHorizontal: 12,
      maxWidth: 330,
    },

    // Prompt Section
    sectionHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 12,
      paddingHorizontal: 2,
    },
    sectionLabel: {
      fontSize: 11,
      fontWeight: '600',
      letterSpacing: 0.8,
      textTransform: 'uppercase',
      color: colors.gray[400],
    },
    cardsContainer: {
      gap: 10,
    },
    suggestionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 14,
      backgroundColor: colors.base.white,
      borderWidth: 1,
      borderColor: colors.gray[200],
      ...shadowStyles.shadow_xs,
    },
    cardIconCircle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: brandColors[50] || colors.brand[50],
      borderWidth: 1,
      borderColor: brandColors[100] || colors.brand[100],
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 14,
    },
    cardText: {
      flex: 1,
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '500',
      color: colors.gray[800],
      marginRight: 8,
    },
    chevronBox: {
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },

    // Bottom Input Bar
    bottomSection: {
      paddingHorizontal: 16,
      paddingTop: 10,
      paddingBottom: Math.max(insetsBottom, 14),
      backgroundColor: colors.base.white,
      borderTopWidth: 1,
      borderTopColor: colors.gray[100],
    },
    disclaimerText: {
      fontSize: 11,
      fontWeight: '400',
      color: colors.gray[400],
      textAlign: 'center',
      marginBottom: 10,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.gray[50],
      borderWidth: 1,
      borderColor: colors.gray[200],
      borderRadius: 26,
      paddingLeft: 16,
      paddingRight: 6,
      paddingVertical: 5,
      ...shadowStyles.shadow_xs,
    },
    inputField: {
      flex: 1,
      fontSize: 14,
      color: colors.gray[900],
      paddingVertical: 6,
      paddingRight: 8,
    },
    sendButton: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: brandColors[600] || colors.brand[600],
      alignItems: 'center',
      justifyContent: 'center',
      ...shadowStyles.shadow_xs,
    },

    // User Query Message Bubble
    userBubbleContainer: {
      alignItems: 'flex-end',
      marginBottom: 20,
    },
    userBubble: {
      backgroundColor: brandColors[50] || colors.brand[50],
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 16,
      maxWidth: '85%',
      borderWidth: 1,
      borderColor: brandColors[200] || colors.brand[200],
    },

    // Streaming Status Indicator
    streamingStatusBox: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingVertical: 12,
      backgroundColor: colors.gray[50],
      borderRadius: 12,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.gray[200],
    },
    streamingStatusErrorBox: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingVertical: 12,
      backgroundColor: colors.gray[50],
      borderRadius: 12,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.error[300],
    },
    streamingText: {
      marginLeft: 10,
      flex: 1,
    },

    // Results Header matching screenshot
    resultHeaderRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
      marginBottom: 16,
      paddingHorizontal: 2,
    },
    searchIconBadge: {
      width: 28,
      height: 28,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: brandColors[200] || colors.brand[200] || '#D0D5DD',
      backgroundColor: brandColors[50] || colors.brand[50] || '#F9F5FF',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 0,
    },
    resultHeaderText: {
      flex: 1,
      fontSize: 14,
      lineHeight: 22,
      color: colors.gray[800],
    },
    resultsCard: {
      backgroundColor: colors.base.white,
      borderWidth: 1,
      borderColor: colors.gray[200],
      borderRadius: 16,
      height: 540,
      overflow: 'hidden',
      marginBottom: 20,
      ...shadowStyles.shadow_xs,
    },
    resultsCardSingle: {
      height: 165,
    },
    resultsCardDouble: {
      height: 275,
    },
    resultsScroll: {
      flex: 1,
      backgroundColor: colors.base.white,
    },
    resultsScrollContent: {
      padding: 12,
      gap: 10,
    },
    tableFooter: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderTopWidth: 1,
      borderTopColor: colors.gray[200],
      alignItems: 'center',
      backgroundColor: colors.base.white,
    },
    paginationLoadingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      marginTop: 6,
    },
    loadMoreButton: {
      marginTop: 6,
      paddingVertical: 6,
      paddingHorizontal: 14,
      borderRadius: 8,
      backgroundColor: brandColors[50] || colors.brand[50] || '#EEF0FF',
      borderWidth: 1,
      borderColor: brandColors[200] || colors.brand[200] || '#E0E2EC',
      alignItems: 'center',
      justifyContent: 'center',
    },

    // Table Structure
    tableInner: {
      minWidth: 890,
      flex: 1,
    },
    tableHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: colors.gray[50],
      borderBottomWidth: 1,
      borderBottomColor: colors.gray[200],
    },
    tableVerticalScroll: {
      flex: 1,
    },
    tableRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.gray[100],
      backgroundColor: colors.base.white,
    },
    tableRowAlt: {
      backgroundColor: colors.gray[25] || '#FCFCFD',
    },
    colCandidate: {
      width: 210,
      flexDirection: 'row',
      alignItems: 'center',
      paddingRight: 12,
    },
    candidateInfo: {
      flex: 1,
      justifyContent: 'center',
    },
    colJob: {
      width: 170,
      paddingRight: 12,
      justifyContent: 'center',
    },
    colCity: {
      width: 120,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingRight: 12,
    },
    colSummary: {
      width: 190,
      paddingRight: 12,
      justifyContent: 'center',
    },
    colResume: {
      width: 80,
      paddingRight: 12,
      justifyContent: 'center',
    },
    colStatus: {
      width: 120,
      justifyContent: 'center',
    },

    // Candidates Mobile Card List
    candidateCardsContainer: {
      gap: 12,
      marginBottom: 24,
    },
    candidateCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.base.white,
      borderWidth: 1,
      borderColor: colors.gray[200],
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 14,
      ...shadowStyles.shadow_xs,
    },
    candidateCardLeft: {
      flex: 1,
      marginRight: 12,
    },
    candidateName: {
      fontSize: 16,
      lineHeight: 22,
      fontWeight: '700',
      color: colors.gray[900],
    },
    candidateEmail: {
      fontSize: 13,
      lineHeight: 18,
      color: colors.gray[500],
      marginTop: 2,
    },
    candidateMetaWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      columnGap: 12,
      rowGap: 4,
      marginTop: 8,
    },
    candidateJobRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    candidateJobText: {
      fontSize: 13,
      lineHeight: 18,
      color: colors.gray[700],
      flexShrink: 1,
    },
    candidateLocationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    candidateLocationText: {
      fontSize: 13,
      lineHeight: 18,
      color: colors.gray[600],
      flexShrink: 1,
    },
    scoreBadge: {
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 5,
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 44,
    },
    scoreText: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '700',
    },

    // Candidate Avatar & Status Badges (retained if needed)
    avatarCircle: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: brandColors[100] || colors.brand[100],
      borderWidth: 1,
      borderColor: brandColors[200] || colors.brand[200],
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarImg: {
      width: 34,
      height: 34,
      borderRadius: 17,
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.gray[300],
      backgroundColor: colors.base.white,
      alignSelf: 'flex-start',
    },
    statusDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.gray[700],
    },
  });
};
