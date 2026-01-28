import { StyleSheet } from "react-native";
import { useRNSafeAreaInsets } from "../../../../hooks/useRNSafeAreaInsets";
import { colors } from "../../../../theme/colors";
export const useStyles = () => {
    const { insetsBottom, insetsTop } = useRNSafeAreaInsets();
    return StyleSheet.create({
    keyboardView: {
      flex: 1,
    },
    container: {
      flex: 1,
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
      paddingBottom: insetsTop+16,
    },
    saveButton: {
      width: '100%',
      height: 48,
      borderRadius: 12,
      backgroundColor: colors.brand[600],
    },
  })
}