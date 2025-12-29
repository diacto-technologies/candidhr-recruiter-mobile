import { StyleSheet } from 'react-native';
import { colors } from '../../../../theme/colors';

export const useStyles = () => {
    return StyleSheet.create({
        container: { paddingHorizontal: 16, paddingVertical: 20, gap: 3 },
        title: { fontSize: 22, fontWeight: "700", color: "#111827" },
        subtitle: { marginTop: 4, fontSize: 14, color: "#6B7280" },
        row: { marginTop: 6, flexDirection: 'row', alignItems: 'center' },
        location: { color: "#6B7280", fontSize: 14 },
        chipRow: { flexDirection: "row", gap: 8 },
        chip: {
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 6,
            borderWidth: 1,
        },
        close: {
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 50,
            borderWidth: 1,
        },
        closedTag: {
            color: "#B91C1C",
            fontWeight: "600",
        },
        dot: { marginHorizontal: 6, height: 16, borderColor: colors.mainColors.borderColor, borderWidth: 1 },
    });
};
