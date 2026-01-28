import { StyleSheet } from 'react-native';
import { colors } from '../../../../theme/colors';
import DeviceInfo from 'react-native-device-info';
import { shadowStyles } from '../../../../theme/shadowcolor';


export const useStyles = () => {
    const isTablet = DeviceInfo.isTablet();
    return StyleSheet.create({
        card: {
            width:isTablet ? '49%':"100%",
            marginHorizontal:isTablet ? 5:0,
            backgroundColor: colors.common.white,
            borderRadius: 12,
            padding: 16,
            borderWidth: 0.5,
            borderColor: '#E5E7EB',
            ...shadowStyles.shadow_xs
        },
        row: { flexDirection: 'row', alignItems: 'center'},
        rowBetween: {flexDirection: 'row', justifyContent: 'space-between'},
        dot: { marginHorizontal: 6, height: 16, borderColor: colors.mainColors.borderColor, borderWidth: 1 },
        author: { color: '#475467', fontSize: 13, marginTop: 8 },
        statusText: { fontSize: 12, marginLeft: 6, fontWeight: '500', color: '#344054' },
        statusDot: { width: 8, height: 8, borderRadius: 50 },
        // published: { backgroundColor: colors.common.white },
        // unpublished: { backgroundColor: colors.common.white },
    
        // --- Empty Screen Styles ---
        emptyContainer: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 20,
            marginTop: -40,
        },
        emptyTitle: {
            fontSize: 20,
            fontWeight: '700',
            color: '#101828',
            marginTop: 15,
        },
        emptySubtitle: {
            fontSize: 14,
            color: '#667085',
            textAlign: 'center',
            marginTop: 8,
        },
        createButton: {
            marginTop: 30,
            backgroundColor: '#6366F1',
            paddingVertical: 14,
            paddingHorizontal: 40,
            borderRadius: 10,
        },
        buttonText: {
            color: 'white',
            fontWeight: '600',
            fontSize: 16,
        },
        statusBadge: {
            alignItems: 'center',
        },
        tabContainer: {
            position: "relative",
            backgroundColor:colors.base.white,
          },
          bottomBorder: {
            height: 1,
            backgroundColor: colors.mainColors.borderColor || "#E5E5E5",
            marginTop: -1,
          },
    });
};