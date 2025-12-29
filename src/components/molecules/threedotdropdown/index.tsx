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
import { useStyles } from "./styles";

interface MenuItem {
  name: string;
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
  const styles = useStyles();
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
                  //item.onPress();
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
export default ThreeDotDropdown;
