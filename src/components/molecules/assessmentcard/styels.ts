import { StyleSheet, useWindowDimensions } from 'react-native';
import { colors } from '../../../theme/colors';

export const useStyles = () => {
    return StyleSheet.create({
        card: {
            flex:1,
            padding: 16,
            gap: 12,
            marginBottom: 16
        },

        rowBetween: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            //alignItems: 'center',
        },

        /** Blueprint list card — title + overflow menu (matches test AssessmentCard) */
        listCardTitleRow: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
        },
        listCardTitleText: {
            width: '95%',
        },
        metaSpacer: {
            marginRight: 10,
        },
        listCardStatusRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 15,
        },
        avatarMarginFirst: {
            marginLeft: 0,
        },
        avatarMarginOverlap: {
            marginLeft: -12,
        },
        dropdownMenuItemIcon: {
            marginRight: 10,
        },

        metaRow: {
            flexDirection: 'row',
            alignItems: 'center',
        },

        statusBadge: {
            backgroundColor: colors.base.white,
            borderRadius: 6,
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 2,
            paddingHorizontal: 8,
            borderWidth: 1,
            borderColor: colors.gray[300],
            shadowColor: "rgba(10, 13, 18, 0.05)",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 1,
            shadowRadius: 2,
            elevation: 2,
            gap: 4,
        },
        statusDot: {
            width: 6,
            height: 6,
            borderRadius: 4,
            //backgroundColor: colors.brand[500],
        },
        avatarGroup: {
            flexDirection: 'row',
            alignItems: 'center',
        },

        avatar: {
            width: 25,
            height: 25,
            borderRadius: 18,
            borderWidth: 1,
            borderColor: '#00000014',
        },

        moreAvatar: {
            backgroundColor:colors.gray[50],
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: -8,
        },

        initialAvatar: {
            backgroundColor: colors.gray[200], // or any brand color
            justifyContent: 'center',
            alignItems: 'center',
          },

        /** Duplicate Test confirm modal — circular icon behind copy glyph */
        duplicateModalIconWrap: {
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.brand[50],
        },

        /** Delete Test confirm modal — light pink circle + trash */
        deleteModalIconWrap: {
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.error[50],
        },

        /** Archive Test confirm modal — light brand circle + archive glyph */
        archiveModalIconWrap: {
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.brand[50],
        },
    })
}