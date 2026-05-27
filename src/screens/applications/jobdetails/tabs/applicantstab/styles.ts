import { StyleSheet, useWindowDimensions } from 'react-native';
import DeviceInfo from "react-native-device-info";
import { colors } from '../../../../../theme/colors';
import { useRNSafeAreaInsets } from '../../../../../hooks/useRNSafeAreaInsets';

export const useStyles = () => {
    const { insetsBottom, insetsTop } = useRNSafeAreaInsets();
    const { width } = useWindowDimensions();
    const isTablet = DeviceInfo.isTablet();
    return StyleSheet.create({
        container: { padding: 16 },
        card: {
          borderWidth: 1,
          borderColor: "#E5E7EB",
          borderRadius: 12,
          padding: 14,
          marginBottom: 12,
          //backgroundColor: "#fff",
        },
        avatar: {
          width: 48,
          height: 48,
          borderRadius: 30,
          marginRight: 12,
        },
        name: { fontSize: 16, fontWeight: "600", color: "#111827" },
        sub: { fontSize: 13, color: "#6B7280", marginTop: 2 },
        status: {
          marginTop: 10,
          padding: 6,
          //backgroundColor: "#EEF2FF",
          color: "#4338CA",
          alignSelf: "flex-start",
          borderRadius: 8,
          fontSize: 12,
          fontWeight: "600",
        },
        switchContainer: {
          flexDirection: 'row',
          gap: 12,
          paddingTop: 12,
          alignItems: 'center'
        },
        mainContainer: { flex: 1 },
        searchContainer: { paddingHorizontal: 16, gap: 4, paddingVertical: 16 },
        switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
        flatListContent: {
          paddingHorizontal: 16,
          paddingVertical: 16,
          gap: 16,
          flexGrow: 1,
          backgroundColor: colors.common.slightlygray,
        },
        emptyStateBg: { height: '100%', width: '100%', top: -90 },
        emptyStateContainer: { flex: 1, alignSelf: 'center', alignContent: 'center', justifyContent: "center" },
        emptyStateTextWrap: { alignItems: 'center', paddingHorizontal: 16, zIndex: 10, marginBottom: 10 },
        emptyStateSubtext: { textAlign: 'center' },
        emptyStateSvg: { zIndex: -1 },
      })
 }