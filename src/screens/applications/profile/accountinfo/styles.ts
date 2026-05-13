import { StyleSheet, useWindowDimensions } from "react-native";
import { useRNSafeAreaInsets } from "../../../../hooks/useRNSafeAreaInsets";
import { colors } from "../../../../theme/colors";

const getModalWidth = (width: number) =>
  Math.max(320, Math.min(width - 32, 400));

export const useStyles = () => {
   const { insetsBottom, insetsTop } = useRNSafeAreaInsets();
    const { width } = useWindowDimensions();
    const modalWidth = getModalWidth(width);
    return StyleSheet.create({
    keyboardView: {
      flex: 1,
    },
    container: {
      // flex: 1,
      backgroundColor: colors.gray[50],
    },
    avatarSection: {
      alignItems: 'center',
      paddingVertical: 24,
      backgroundColor: colors.base.white,
      borderBottomColor: colors.gray[100],
    },
    avatarContainer: {
      position: 'relative',
    },
    avatar: {
      width: 96,
      height: 96,
      borderRadius: 48,
    },
    avatarPlaceholder: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: colors.gray[200],
      alignItems: 'center',
      justifyContent: 'center',
    },
    editAvatarButton: {
      position: 'absolute',
      bottom: 5,
      right: 0,
      padding:8,
      borderRadius:100,
      backgroundColor: colors.base.white,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    formContainer: {
      paddingHorizontal: 16,
      paddingTop: 24,
      backgroundColor: colors.base.white,
    },
    fieldContainer: {
      marginBottom: 20,
    },
    label: {
      marginBottom: 6,
    },
    disabledField: {
      backgroundColor: colors.gray[50],
    },
    phoneContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    phoneCodeContainer: {
      height: 56,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: colors.gray[200],
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8,
      backgroundColor: colors.base.white,
    },
    phoneInputContainer: {
      flex: 1,
    },
    dropdownContainer: {
      borderWidth: 1,
      borderColor: colors.gray[200],
      borderRadius: 12,
      backgroundColor: colors.base.white,
    },
    dropdown: {
      height: 44,
      paddingHorizontal: 16,
    },
    placeholderStyle: {
      fontSize: 16,
      color: colors.gray[500],
    },
    selectedTextStyle: {
      fontSize: 16,
      color: colors.gray[900],
    },
    buttonContainer: {
      paddingHorizontal: 16,
      paddingBottom: insetsBottom,
    },
    saveButton: {
      width: '100%',
      height: 48,
      borderRadius: 12,
      backgroundColor: colors.brand[600],
    },
    /** SetProfilePhotoModal */
    modalBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(10, 13, 18, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 16,
    },
    modalCard: {
      width: modalWidth,
      backgroundColor: colors.base.white,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.gray[200],
      padding: 4,
    },
    submodalCard: {
      borderWidth: 2,
      borderRadius: 16,
      borderColor: colors.gray[200],
      overflow: 'hidden',
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomColor: colors.gray[200],
      backgroundColor: colors.base.white,
    },
    modalBody: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      gap: 12,
      backgroundColor: colors.base.white,
    },
    photoOptionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.gray[200],
      backgroundColor: colors.gray[50],
      gap: 12,
    },
    photoOptionIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: colors.base.white,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.gray[200],
    },
  })
}