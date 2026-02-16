import { StyleSheet, useWindowDimensions } from 'react-native';
import DeviceInfo from "react-native-device-info";
import { useRNSafeAreaInsets } from '../../../../../hooks/useRNSafeAreaInsets';
import { colors } from '../../../../../theme/colors';

export const useStyles = () => {
    const { insetsBottom, insetsTop } = useRNSafeAreaInsets();
    const { width } = useWindowDimensions();
    const isTablet = DeviceInfo.isTablet();
    return StyleSheet.create({
        container: { padding: 16, gap: 16},
        sectionTitle: { fontSize: 18, fontWeight: "700", marginTop: 20 },
        text: { marginTop: 8, color: "#374151", lineHeight: 20 },
        list: { color: "#4B5563" },
        tagWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
        tag: {
          backgroundColor: colors.common.white,
          borderWidth: 1,
          borderColor: '#D5D7DA',
          borderRadius: 6,
          paddingVertical: 2,
          paddingHorizontal: 5,
          //minWidth: 56,
          //minHeight: 24,
          shadowColor: "#0A0D12",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 3,
          elevation: 1,
        },
      
        bulletRow: {
          flexDirection: "row",
          alignItems: "flex-start",
          gap: 4,
          marginBottom: 4,
        },
        bulletText: {
          flex: 1,
        },
        section: {
          gap: 8,
          marginTop: 16,
        },
      
      })
    }