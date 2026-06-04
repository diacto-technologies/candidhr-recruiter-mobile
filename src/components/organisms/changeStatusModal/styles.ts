import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const useStyles = () => {
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(10, 13, 18, 0.45)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 16,
    },
    card: {
      width: '100%',
      maxWidth: 400,
      maxHeight: '90%',
      backgroundColor: colors.base.white,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.gray[200],
      overflow: 'hidden',
      padding: 4,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.gray[200],
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flexShrink: 1,
    },
    headerIconWrap: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.brand[100],
    },
    scroll: { maxHeight: 400 },
    scrollContent: { padding: 20, paddingBottom: 12 },
    section: {
      gap: 12,
      marginBottom: 20,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    newStatusOptions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 20,
    },
    pillRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 12,
    },
    pill: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: colors.gray[100],
      borderWidth: 1,
      borderColor: colors.gray[200],
    },
    pillSelected: {
      backgroundColor: colors.brand[600],
      borderColor: colors.brand[600],
    },
    checkRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 4,
      borderWidth: 1.5,
      borderColor: colors.gray[400],
      marginRight: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkboxChecked: {
      backgroundColor: colors.brand[600],
      borderColor: colors.brand[600],
    },
    hint: {
      marginBottom: 12,
      marginLeft: 30,
    },
    label: {
      marginBottom: 6,
      marginTop: 4,
    },
    inputWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.gray[300],
      borderRadius: 8,
      paddingHorizontal: 12,
      minHeight: 44,
    },
    input: {
      flex: 1,
      fontSize: 14,
      borderWidth: 1,
      borderRadius: 8,
      color: colors.gray[900],
      paddingVertical: 10,
    },
    textArea: {
      minHeight: 80,
      textAlignVertical: 'top',
    },
    footer: {
      flexDirection: 'row',
      gap: 12,
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: colors.gray[200],
    },
    submodalCard: {
      borderWidth: 2,
      borderRadius: 16,
      borderColor: colors.gray[200],
      overflow: "hidden",
    },
    categoryPill: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.gray[300],
      backgroundColor: colors.base.white,
    },
    categoryPillSelected: {
      backgroundColor: colors.brand[50],
      borderColor: colors.brand[400],
    },
    optionSection: {
      gap: 12,
      borderWidth: 2,
      padding: 16,
      borderRadius: 12,
    },
    optionSectionActive: {
      borderColor: colors.brand[500],
    },
    optionSectionInactive: {
      borderColor: colors.gray[200],
    },
    reasonSectionMargin: {
      marginBottom: 20,
    },
    optionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    reasonDropdownContainer: {
      gap: 12,
    },
    categoriesContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 8,
    },
    emailFieldsContainer: {
      gap: 8,
    },
    requiredLabelRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    categoryHint: {
      marginTop: 8,
    },
  });
};
