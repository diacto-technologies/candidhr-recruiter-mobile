import { StyleSheet, useWindowDimensions } from "react-native";
import { useRNSafeAreaInsets } from "../../../../hooks/useRNSafeAreaInsets";
import DeviceInfo from "react-native-device-info";
import { colors } from "../../../../theme/colors";
import { Fonts } from "../../../../theme/fonts";

export const useStyles = () => {
    const { insetsBottom, insetsTop } = useRNSafeAreaInsets();
    const { width } = useWindowDimensions();
    const isTablet = DeviceInfo.isTablet();
    return StyleSheet.create({
    keyboardView: {
      flex: 1,
    },
    container: {
      flex: 1,
      backgroundColor: colors.base.white,
    },
    logoSection: {
      alignItems: 'center',
      paddingVertical: 24,
      backgroundColor: colors.base.white,
      borderBottomColor: colors.gray[100],
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
    textArea: {
      height: 128,
      textAlignVertical: 'top',
      paddingTop: 12,
    },
    dropdownContainer: {
      borderWidth: 1,
      borderColor: colors.gray[200],
      borderRadius: 8,
      backgroundColor: colors.gray[50],
    },
    dropdown: {
      height: 44,
      paddingHorizontal: 16,
    },
    placeholderStyle: {
      fontFamily: Fonts.InterMedium,
      fontSize: 16,
      fontWeight: '500',
      fontStyle: 'normal',
      lineHeight: 24,
      color: colors.gray[900],
    },
    selectedTextStyle: {
      fontFamily: Fonts.InterMedium,
      fontSize: 16,
      fontWeight: '500',
      fontStyle: 'normal',
      lineHeight: 24,
      color: colors.gray[900],
    },
    dropdownListContainer: {
      backgroundColor: colors.base.white,
    },
    searchIconContainer: {
      marginRight: 8,
    },
    urlInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    httpPrefix: {
      height: 56,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: colors.gray[200],
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8,
      backgroundColor: colors.gray[50],
    },
    urlInput: {
      flex: 1,
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
    buttonContainer: {
      paddingHorizontal: 16,
      marginBottom: insetsTop+20,
      marginTop:32
    },
    saveButton: {
      width: '100%',
      height: 48,
      borderRadius: 12,
      backgroundColor: colors.brand[600],
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
    avatarContainer: {
      position: 'relative',
    },
  })
}