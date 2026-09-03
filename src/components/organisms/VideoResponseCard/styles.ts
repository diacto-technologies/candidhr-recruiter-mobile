import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { shadowStyles } from '../../../theme/shadowcolor';

export const useStyles = () => {
  return StyleSheet.create({
    responsesCard: {
      backgroundColor: colors.common.white,
      borderRadius: 16,
      borderWidth: 0.5,
      borderColor: colors.gray[200],
      padding: 16,
      marginTop: 16,
      ...shadowStyles.shadow_xs,
    },
    rowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerRightWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    responseDropdownWrapper: {
      marginTop: 16,
      zIndex: 1000,
    },
    responseDropdownButton: {
      borderWidth: 1,
      borderColor: colors.gray[300],
      borderRadius: 8,
      backgroundColor: colors.common.white,
      padding: 12,
      shadowColor: 'rgb(10, 13, 18)',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    responseSelectedItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flex: 1,
    },
    responseSelectedContent: {
      flex: 1,
    },
    responseDropdownContainer: {
      borderWidth: 1,
      borderColor: colors.gray[300],
      borderRadius: 8,
      backgroundColor: colors.common.white,
      marginTop: 4,
      elevation: 10,
      shadowColor: '#0A0D12',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      maxHeight: 400,
      overflow: 'hidden',
    },
    responseDropdownScroll: {
      maxHeight: 400,
    },
    responseDropdownItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      gap: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.gray[200],
    },
    responseDropdownItemActive: {
      backgroundColor: colors.brand[25],
      borderLeftWidth: 3,
      borderLeftColor: colors.brand[600],
    },
    responseThumbnail: {
      width: 70,
      height: 70,
      borderRadius: 10,
    },
    thumbnail: {
      width: 70,
      height: 70,
      borderRadius: 10,
      backgroundColor: colors.gray[900],
    },
    responseDropdownContent: {
      flex: 1,
      gap: 4,
    },
    tagRow: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 10,
    },
    tag: {
      backgroundColor: colors.gray[100],
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    mainVideoCard: {
      borderRadius: 12,
      overflow: 'hidden',
      marginTop: 16,
      position: 'relative',
    },
    videoTitle: {
      marginTop: 16,
      marginBottom: 16,
    },
    transcriptionSection: {
      gap: 16,
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
      color: colors.gray[700],
    },
    transcriptionTimestamp: {
      marginTop: 2,
    },
    emptyContainer: {
      paddingHorizontal: 16,
      paddingBottom: 12,
    },
  });
};
