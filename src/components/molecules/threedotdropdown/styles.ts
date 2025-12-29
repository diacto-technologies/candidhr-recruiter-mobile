import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const useStyles = () => {
    return StyleSheet.create({
        overlay: {
            flex: 1,
          },
          dropdownContainer: {
            position: "absolute",
            backgroundColor: "white",
            borderRadius: 12,
            width: 200,
            overflow: "hidden",
        
            // ☑️ Shadow 1 (0px 32px 64px -12px #0A0D1224)
            shadowColor: "#0A0D12",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.14, // 24 hex ≈ 0.14
            shadowRadius: 6,
        
            // ☑️ Shadow 2 (0px 5px 5px -2.5px #0A0D120A)
            // Combine smaller subtle shadow
            elevation:6, // Android
            borderWidth:1,
            borderColor:colors.mainColors.borderColor
          },
        
          dropdownItem: {
            paddingVertical: 14,
            paddingHorizontal: 16,
          },
        
          dropdownTitle: {
            fontSize: 16,
            color: "#333",
            fontWeight: "500",
          },
        
          divider: {
            height: StyleSheet.hairlineWidth,
            backgroundColor: "#e0e0e0",
            marginHorizontal: 16,
          }
    });
};