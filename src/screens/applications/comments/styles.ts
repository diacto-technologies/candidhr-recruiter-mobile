import { StyleSheet } from "react-native";
import { useRNSafeAreaInsets } from "../../../hooks/useRNSafeAreaInsets";
import { windowWidth } from "../../../utils/devicelayout";
import { colors } from "../../../theme/colors";
import { Fonts } from "../../../theme/fonts";


export const useStyles = () => {
    const MIN_COL_WIDTH = windowWidth * 0.35;
    const insets = useRNSafeAreaInsets();

    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.base.white,
        },
        content: {
            flex: 1,
            padding: 16,
        },
        loadingWrap: {
            paddingVertical: 24,
            alignItems: 'center',
            justifyContent: 'center',
        },
        errorText: {
            padding: 16,
        },
        emptyText: {
            padding: 16,
            textAlign: 'center',
        },
        hintText: {
            paddingHorizontal: 16,
            paddingTop: 8,
        },
        card: {
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderColor: colors.gray[200],
        },
        headerRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        userRow: {
            flexDirection: 'row',
            gap: 10,
        },
        avatar: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.gray[200],
        },
        nameRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        tag: {
            backgroundColor: colors.brand[25],
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 8,
            borderColor: colors.brand[200],
            borderWidth: 1
        },
        rightRow: {
            alignItems: 'flex-end',
        },
        menuDot: {
            paddingTop: 4,
        },
        commentText: {
            marginTop: 10,
        },
        reasonPillsWrap: {
            marginTop: 10,
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
        },
        reasonPill: {
            alignSelf: 'flex-start',
            borderWidth: 1,
            borderColor: colors.brand[200],
            borderRadius: 999,
            paddingHorizontal: 10,
            paddingVertical: 2,
            backgroundColor: colors.brand[50],
        },
        commentContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            borderTopWidth: 1,
            borderColor: colors.gray[200],
            paddingTop:15,
            paddingVertical: insets.insetsBottom-10,
            paddingHorizontal:16,
        },
        buttonRow: {
            paddingLeft: 5,
        },
        reasonEditPanel: {
            paddingHorizontal: 16,
            paddingTop: 12,
            paddingBottom: 16,
            borderTopWidth: 1,
            borderColor: colors.gray[200],
            gap: 12,
            backgroundColor: colors.base.white,
        },
        reasonInlineEditor: {
            marginTop: 12,
            gap: 12,
        },
        categoryPillsWrap: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
            marginTop: 8,
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
        reasonEditActions: {
            flexDirection: 'row',
            gap: 12,
            justifyContent: 'flex-end',
            marginTop: 4,
        },
        reasonEditCancel: {
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: colors.gray[300],
            backgroundColor: colors.base.white,
        },
        reasonEditSave: {
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 10,
            backgroundColor: colors.brand[600],
        },
        reasonEditSaveDisabled: {
            opacity: 0.55,
        },
    });
};