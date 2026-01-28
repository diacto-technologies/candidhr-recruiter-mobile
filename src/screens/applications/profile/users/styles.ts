import { StyleSheet, useWindowDimensions } from "react-native";
import { useRNSafeAreaInsets } from "../../../../hooks/useRNSafeAreaInsets";
import DeviceInfo from "react-native-device-info";
import { windowWidth } from "../../../../utils/devicelayout";
import { colors } from "../../../../theme/colors";
import { Fonts } from "../../../../theme/fonts";
import { shadowStyles } from "../../../../theme/shadowcolor";

export const useStyles = () => {
    const { insetsBottom, insetsTop } = useRNSafeAreaInsets();
    const { width } = useWindowDimensions();
    const isTablet = DeviceInfo.isTablet();
    const MIN_COL_WIDTH = windowWidth * 0.35;
    const modalWidth = isTablet ? Math.min(760, width * 0.8) : Math.max(320, width - 32);
    return StyleSheet.create({
    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 16,
      gap: 12,
    },
    searchContainer: {
      flex: 1,
    },
    sortButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.gray[300],
      backgroundColor: colors.base.white,
      shadowColor: '#0A0D12',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 2,
      elevation: 2,
    },
    sortText: {
      marginLeft: 8,
    },
  
    card: {
      flex: 1,
      backgroundColor: colors.base.white,
      borderTopWidth: 1,
      borderColor: colors.gray[200],
    },
  
    tableContainer: {
      flexDirection: 'row',
    },
  
    headerRow: {
      flexDirection: 'row',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderColor: colors.gray[200],
      paddingLeft: 20,
      backgroundColor: colors.gray[50],
    },
  
    headerText: {
      minWidth: MIN_COL_WIDTH,
      marginRight: 16,
    },
  
    row: {
      flexDirection: 'row',
      height: 73,
      borderBottomWidth: 1,
      borderColor: colors.gray[200],
      paddingLeft: 20,
      alignItems: 'center',
    },
  
    cell: {
      fontFamily: Fonts.InterRegular,
      fontSize: 14,
      minWidth: MIN_COL_WIDTH,
      marginRight: 16,
    },
  
    /** FIXED LEFT COLUMN */
    leftFixedWrapper: {
      width: '50%',
      backgroundColor: colors.base.white,
      borderRightWidth: 1,
      borderColor: colors.gray[200],
      zIndex: 10,
    },
  
    leftFixedColumn: {
      height: 73,
      paddingLeft: 20,
      borderBottomWidth: 1,
      borderColor: colors.gray[200],
      justifyContent: 'center',
    },
  
    /** SCROLLBAR */
    scrollTrack: {
      paddingVertical: 10,
    },
    scrollThumb: {
      height: 6,
      backgroundColor: colors.mainColors.scrollBar,
      borderRadius: 10,
    },
  
    paginationContainer: {
      flexDirection: 'row',
      borderColor: colors.gray[200],
      alignSelf: 'center',
    },
  
    buttonContainer: {
      paddingHorizontal: 16,
      paddingTop: 16,
      backgroundColor: colors.base.white,
      borderTopWidth: 1,
      borderTopColor: colors.gray[100],
    },
  
    addButton: {
      width: '100%',
      height: 48,
      borderRadius: 12,
      backgroundColor: colors.brand[600],
    },
    actionCell: {
      width: 40,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    dropdown: {
      position: 'absolute',
      top: 18,
      right: 20,
      width: 140,
      backgroundColor: '#FFF',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.gray[200],
      zIndex: 999,
      ...shadowStyles.shadow_3xl
    },
    
    dropdownItem: {
      flexDirection:'row',
      alignItems:'center',
      paddingVertical: 8,
      paddingHorizontal: 14,
    },

    /** ADD USER MODAL */
    modalBackdrop: {
      flex: 1,
      backgroundColor: "rgba(10, 13, 18, 0.5)",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 16,
    },
    modalCard: {
      width: modalWidth,
      backgroundColor: colors.base.white,
      borderRadius: 20,
      // overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.gray[200],
      // ...shadowStyles.shadow_3xl,
      padding:4,
    },
    submodalCard:{
      borderWidth:2,
      borderRadius: 16,
      borderColor: colors.gray[200],
      overflow: "hidden",
    },
    modalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 12,
      //borderBottomWidth: 1,
      borderBottomColor: colors.gray[200],
      backgroundColor: colors.base.white,
    },
    modalBody: {
      paddingHorizontal: 20,
      //paddingVertical: 18,
      gap: 16,
    },
    /** UPDATE ROLE MODAL */
    infoBanner: {
      flexDirection: "row",
      alignItems: "flex-start",
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 12,
      backgroundColor: colors.warning[50],
      borderWidth: 1,
      borderColor: colors.warning[200],
      gap: 8,
    },
    infoBannerText: {
      flex: 1,
    },
    fieldLabelRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginBottom: 8,
    },
    textInput: {
      borderWidth: 1,
      borderColor: colors.gray[300],
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
      backgroundColor: colors.base.white,
      fontFamily: Fonts.InterRegular,
      fontSize: 16,
      color: colors.gray[900],
    },
    roleSelector: {
      borderWidth: 1,
      borderColor: colors.gray[300],
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
      backgroundColor: colors.base.white,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    modalFooter: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderTopWidth: 1,
      borderTopColor: colors.gray[200],
      flexDirection: "row",
      gap: 12,
      backgroundColor: colors.base.white,
    },
    updateRoleFooter: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      //borderTopWidth: 1,
      borderTopColor: colors.gray[200],
      flexDirection: "row",
      backgroundColor: colors.base.white,
    },
    cancelButton: {
      height: 48,
      paddingHorizontal: 18,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.gray[300],
      backgroundColor: colors.base.white,
      justifyContent: "center",
      alignItems: "center",
    },
    innerShadowTop: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 8,
      backgroundColor: "rgba(0,0,0,0.06)",
    },
    
    innerShadowBottom: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 8,
      backgroundColor: "rgba(0,0,0,0.04)",
    },
    
  })
}