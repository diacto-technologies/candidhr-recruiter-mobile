import { StyleSheet } from 'react-native';
import { colors } from '../../../../theme/colors';
import { shadowStyles } from '../../../../theme/shadowcolor';

export const useStyles = () => {
    return StyleSheet.create({
        container: { gap: 16, flex: 1},

        row: { flexDirection: "row", alignItems: "center", gap: 8 },
        rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
      
        greenDot: {
          height: 8,
          width: 8,
          borderRadius: 50,
          backgroundColor: colors.success[500],
        },
      
        shortListedCard: {
          backgroundColor: colors.common.white,
          borderRadius: 8,
          borderWidth: 0.5,
          borderColor: colors.gray[300],
          paddingVertical: 10,
          paddingHorizontal: 14,
          // shadowColor: '#0A0D12',
          // shadowOffset: { width: 0, height: 1 },
          // shadowOpacity: 0.05,
          // shadowRadius: 3,
          // elevation: 1,
          ...shadowStyles.shadow_xs,
          gap: 16,
          paddingTop: 16
        },
      
        tabContainer: {
          flexDirection: "row",
          backgroundColor: colors.gray[50],
          borderRadius: 8,
          borderWidth: 1,
          borderColor: colors.gray[200],
          padding: 4,
          gap: 8,
        },
      
        tab: {
          paddingVertical: 6,
          paddingHorizontal: 14,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: colors.gray[200],
          backgroundColor: colors.gray[50],
        },
      
        activeTab: {
          backgroundColor: colors.brand[50],
          borderColor: colors.brand[200],
        },
      
        summaryCard: {
          borderWidth: 1,
          borderColor: colors.brand[200],
          backgroundColor: colors.brand[25],
          padding: 16,
          borderRadius: 12,
        },
      
        scoreBadge: {
          paddingVertical: 4,
          paddingHorizontal: 10,
          backgroundColor: colors.warning[50],
          borderRadius: 20,
          borderWidth: 1,
          borderColor: colors.warning[200],
        },
      
        summaryText: {
          marginTop: 10,
          lineHeight: 20,
        },
      
        dividerWrapper: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 20,
        },
      
        dividerLine: {
          height: 1,
          flex: 1,
          backgroundColor: "#D8D8FF",
        },
      
        resizeIcon: {
          paddingHorizontal: 12,
        },
      
        responsesCard: {
          backgroundColor: colors.common.white,
          borderRadius: 12,
          borderWidth: 0.5,
          borderColor: colors.gray[200],
          padding: 16,
          marginTop: 16,
          ...shadowStyles.shadow_xs
        },
      
        tagRow: {
          flexDirection: "row",
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
          overflow: "hidden",
          marginTop: 16,
          position: "relative",
        },
      
        videoPreview: {
          height: 170,
          backgroundColor: colors.gray[300],
          borderRadius: 12,
        },
      
        playCircle: {
          width: 56,
          height: 56,
          borderRadius: 50,
          backgroundColor: colors.common.white,
          opacity: 0.85,
          position: "absolute",
          top: "40%",
          left: "40%",
        },
      
        divider: {
          height: 1,
          backgroundColor: colors.gray[200],
          marginVertical: 20,
        },
      
        responseItem: {
          flexDirection: "row",
          gap: 14,
          alignItems: "center",
          backgroundColor: colors.common.white,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.gray[200],
          padding: 10,
          marginBottom: 10,
        },
      
        activeResponseItem: {
          borderColor: colors.brand[600],
          backgroundColor: colors.brand[25],
          shadowColor: "#645CE7",
          shadowOpacity: 0.12,
          shadowRadius: 8,
          elevation: 4,
        },
      
        thumbnail: {
          width: 70,
          height: 70,
          borderRadius: 10,
          backgroundColor: colors.gray[900],
        },
        statusDot: {
          height: 8,
          width: 8,
          borderRadius: 30,
          backgroundColor: colors.success[500],
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
        
        responseDropdown: {
          borderWidth: 1,
          borderColor: colors.gray[300],
          borderRadius: 8,
          backgroundColor: colors.common.white,
          minHeight: 50,
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
        responseSelectedItem: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          flex: 1,
        },
        responseThumbnail: {
          width: 70,
          height: 70,
          borderRadius: 10,
        },
        responseThumbnailSmall: {
          width: 50,
          height: 50,
          borderRadius: 8,
        },
        thumbnailSmall: {
          width: 50,
          height: 50,
          borderRadius: 8,
          backgroundColor: colors.gray[300],
        },
        responseDropdownContent: {
          flex: 1,
          gap: 4,
        },
        responseSelectedContent: {
          flex: 1,
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
        transcriptionContent: {
          //marginTop: 4,
        },
        transcriptionText: {
          lineHeight: 22,
          color: colors.gray[700],
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
    });
};
