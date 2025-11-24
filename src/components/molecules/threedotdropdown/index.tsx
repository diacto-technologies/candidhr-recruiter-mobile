// components/ThreeDotDropdown.tsx
import React from "react";
import {
  Modal,
  Pressable,
  View,
  Text,
  StyleSheet,
} from "react-native";
import { colors } from "../../../theme/colors";

interface MenuItem {
  title: string;
  onPress: () => void;
}

interface ThreeDotDropdownProps {
  visible: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  top?: number;
  right?: number;
}

const ThreeDotDropdown: React.FC<ThreeDotDropdownProps> = ({
  visible,
  onClose,
  menuItems,
  top = 200,
  right = 20,
}) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={[styles.dropdownContainer, { top, right }]}>
          {menuItems.map((item, index) => (
            <View key={index}>
              {index > 0 && <View style={styles.divider} />}
              <Pressable
                style={styles.dropdownItem}
                android_ripple={{ color: "#f0f0f0" }}
                onPress={() => {
                  item.onPress();
                  onClose();
                }}
              >
                <Text style={styles.dropdownTitle}>{item.name}</Text>
              </Pressable>
            </View>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    shadowOffset: { width: 0, height: 32 },
    shadowOpacity: 0.14, // 24 hex ≈ 0.14
    shadowRadius: 64,

    // ☑️ Shadow 2 (0px 5px 5px -2.5px #0A0D120A)
    // Combine smaller subtle shadow
    elevation: 16, // Android
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
  },
});

export default ThreeDotDropdown;
