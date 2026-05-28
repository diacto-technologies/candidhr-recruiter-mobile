import { StyleSheet, useWindowDimensions } from "react-native";
import { colors } from "../../../theme/colors";

const getModalWidth = (width: number) => Math.max(320, Math.min(width - 32, 400));

export const useStyles = () => {
    const { width } = useWindowDimensions();
    const modalWidth = getModalWidth(width);
    
    return StyleSheet.create({
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
    });
};
