import { StyleSheet } from 'react-native'
import { colors } from '../../../theme/colors'

export const styles = StyleSheet.create({
    field: {
        gap: 4,
    },
    optionsLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionsList: {
        gap: 12,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    optionInputWrap: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.gray[200],
        borderRadius: 8,
        backgroundColor: colors.base.white,
        minHeight: 44,
        paddingLeft: 12,
    },
    optionInputWrapDisabled: {
        backgroundColor: colors.gray[100],
    },
    optionInput: {
        flex: 1,
        fontSize: 14,
        color: colors.gray[900],
        paddingVertical: 10,
        paddingRight: 8,
    },
    optionInputDisabled: {
        color: colors.gray[400],
    },
    selectorHit: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioFrame: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: colors.gray[300],
        backgroundColor: colors.base.white,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioFrameSelected: {
        borderColor: colors.brand[600],
    },
    radioInnerDot: {
        width: 11,
        height: 11,
        borderRadius: 5.5,
        backgroundColor: colors.brand[600],
    },
    yesNoList: {
        gap: 12,
    },
    yesNoRow: {
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.gray[200],
        backgroundColor: colors.base.white,
        paddingVertical: 14,
        paddingHorizontal: 16,
        minHeight: 48,
        justifyContent: 'center',
    },
    yesNoRowSelected: {
        backgroundColor: colors.brand[50],
        borderColor: colors.brand[200],
    },
    deleteBtn: {
        padding: 8,
    },
    deleteBtnPressed: {
        opacity: 0.7,
    },
    deleteBtnDisabled: {
        opacity: 0.35,
    },
    fieldDisabled: {
        opacity: 2,
    },
})
