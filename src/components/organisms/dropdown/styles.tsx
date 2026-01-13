import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../../theme/colors';
import { Fonts } from '../../../theme/fonts';

export const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
    },

    container: {
        width: '100%',
        overflow: 'visible',
        backgroundColor: colors.common.white,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.gray[300],
        paddingLeft: 12,
        paddingRight: 6,
        paddingVertical: 0,
        shadowColor: '#0A0D12',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },

    containerFocused: {
        borderColor: colors.brand[600],
        borderWidth: 2,
    },

    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },

    dropdownLabelStyle: {
        fontFamily: Fonts.InterBold,
        fontSize: 16,
        fontWeight: '500',
        fontStyle: 'normal',
        lineHeight: 24,
        color: colors.gray[900],
    },

    helpIconContainer: {
        marginLeft: 4,
    },

    star: {
        color: colors.error[500],
    },

    dropdown: {
        borderWidth: 0,
        backgroundColor: 'transparent',
        minHeight: 48,
    },

    optionsContainer: {
        borderRadius: 8,
        borderColor: colors.gray[300],
        borderWidth: 1,
        elevation: 20,
        shadowColor: '#0A0D12',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        marginTop: 4,
        backgroundColor: colors.common.white,
        maxHeight: 300,
    },

    labelText: {
        fontFamily: Fonts.InterBold,
        fontSize: 16,
        fontWeight: '500',
        fontStyle: 'normal',
        lineHeight: 24,
        color: colors.gray[900],
    },

    error: {
        marginTop: 4,
        fontSize: 12,
        color: colors.error[500],
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    pickerWrapper: {
        flex: 1,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 12,
    },

    optionText: {
        fontFamily: Fonts.InterBold,
        fontSize: 16,
        fontWeight: '500',
        fontStyle: 'normal',
        lineHeight: 24,
        color: colors.gray[900],
    },

    valueRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    selectedTextStyle: {
        color: colors.gray[900],
        fontFamily: Fonts.InterMedium,
        fontSize: 16,
        fontWeight: '500',
        fontStyle: 'normal',
        lineHeight: 24,
    },

    selectedTextStyleHidden: {
        color: 'transparent',
        fontSize: 1,
        height: 0,
    },

    selectedValueContainer: {
        position: 'relative',
        flex: 1,
    },

    customSelectedDisplay: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 60,
        paddingRight: 40,
        pointerEvents: 'none',
        gap: 8,
    },

    placeholderStyle: {
        color: colors.gray[500],
        fontFamily: Fonts.InterMedium,
        fontSize: 16,
        fontWeight: '500',
        fontStyle: 'normal',
        lineHeight: 24,
    },

    selectedItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
    },

    selectedNameText: {
        fontFamily: Fonts.InterBold,
        fontSize: 16,
        fontWeight: '600',
        color: colors.gray[900],
    },

    selectedUsernameText: {
        fontFamily: Fonts.InterRegular,
        fontSize: 16,
        fontWeight: '400',
        color: colors.gray[500],
        marginLeft: 4,
    },

    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },

    selectedOptionItem: {
        backgroundColor: colors.brand[50],
    },

    optionTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 8,
        marginRight: 8,
        flexWrap: 'wrap',
    },

    optionNameText: {
        fontFamily: Fonts.InterMedium,
        fontSize: 16,
        fontWeight: '500',
        color: colors.gray[900],
        flex: 1,
        minWidth: 0,
        flexShrink: 1,
    },

    optionUsernameText: {
        fontFamily: Fonts.InterRegular,
        fontSize: 16,
        fontWeight: '400',
        color: colors.gray[500],
        marginLeft: 4,
    },

    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },

    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },

    statusText: {
        fontFamily: Fonts.InterMedium,
        fontSize: 14,
        fontWeight: '500',
        color: colors.gray[900],
    },

    numberBadge: {
        backgroundColor: colors.gray[100],
        borderRadius: 6,
        paddingVertical: 4,
        paddingHorizontal: 8,
        flexShrink: 0,
    },

    optionNumberText: {
        fontFamily: Fonts.InterMedium,
        fontSize: 12,
        fontWeight: '500',
        color: colors.gray[700],
    },

    checkmarkIcon: {
        marginLeft: 8,
    },

    selectedNumberBadge: {
        backgroundColor: colors.brand[50],
        borderRadius: 12,
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderColor: colors.brand[200],
        flexShrink: 0,
    },

    selectedNumberText: {
        fontFamily: Fonts.InterMedium,
        fontSize: 12,
        fontWeight: '500',
        color: colors.brand[700],
    },

    selectedTotalBadge: {
        backgroundColor: colors.brand[50],
        borderRadius: 12,
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderColor: colors.brand[200],
        flexShrink: 0,
    },

    selectedTotalText: {
        fontFamily: Fonts.InterMedium,
        fontSize: 12,
        fontWeight: '500',
        color: colors.brand[700],
    },

});
