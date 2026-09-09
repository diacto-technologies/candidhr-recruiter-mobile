import { StyleSheet } from 'react-native';
import { colors } from '../../../../theme/colors';

export const useStyles = () => {
    return StyleSheet.create({
        container: { paddingHorizontal: 16, paddingTop:20, gap: 3 },
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
        metaSection: {
            gap: 6,
        },
        metaRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
        },
        ownerDetails: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            flex: 1,
            minWidth: 0,
        },
        ownerTextCol: {
            flex: 1,
            minWidth: 0,
        },
        sharedDetails: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            flex: 1,
            minWidth: 0,
        },
        sharedAvatarsRow: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        sharedAvatarOverlap: {
            marginLeft: -8,
        },
        moreAvatar: {
            width: 26,
            height: 26,
            borderRadius: 13,
            borderWidth: 1.5,
            borderColor: colors.base.white,
            backgroundColor: colors.gray[100],
            justifyContent: 'center',
            alignItems: 'center',
        },
    });
};
