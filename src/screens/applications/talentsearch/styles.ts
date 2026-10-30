import { StyleSheet } from 'react-native';
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
      backgroundColor: brandColors[50] || '#F4F3FF',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 16,
      maxWidth: '85%',
      borderWidth: 1,
      borderColor: brandColors[100] || '#E0E7FF',
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
    streamingText: {
      marginLeft: 10,
      flex: 1,
    },

    // Results Header
    resultHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginBottom: 14,
      paddingHorizontal: 4,
    },
    searchIconBadge: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: brandColors[50] || '#F4F3FF',
      alignItems: 'center',
      justifyContent: 'center',
    },
    resultHeaderText: {
      flex: 1,
    },

    // Candidates Table Card
    resultsCard: {
      backgroundColor: colors.base.white,
      borderWidth: 1,
      borderColor: colors.gray[200],
      borderRadius: 12,
      overflow: 'hidden',
      marginBottom: 24,
      ...shadowStyles.shadow_sm,
    },
    tableInner: {
      minWidth: 700,
    },
    tableHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.gray[50],
      borderBottomWidth: 1,
      borderBottomColor: colors.gray[200],
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    tableRow: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: colors.gray[100],
      paddingVertical: 14,
      paddingHorizontal: 16,
      backgroundColor: colors.base.white,
    },
    tableRowAlt: {
      backgroundColor: '#F9F8FF',
    },

    // Table Columns
    colCandidate: {
      width: 220,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    candidateInfo: {
      flex: 1,
    },
    colJob: {
      width: 150,
      paddingRight: 10,
    },
    colCity: {
      width: 120,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingRight: 10,
    },
    colSummary: {
      width: 100,
      paddingRight: 10,
    },
    colResume: {
      width: 100,
      paddingRight: 10,
    },
    colStatus: {
      width: 140,
    },

    // Candidate Avatar & Status Badges
    avatarCircle: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: brandColors[100] || '#E0E7FF',
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
    tableFooter: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderTopWidth: 1,
      borderTopColor: colors.gray[100],
      alignItems: 'center',
      backgroundColor: colors.gray[50],
    },
  });
};
