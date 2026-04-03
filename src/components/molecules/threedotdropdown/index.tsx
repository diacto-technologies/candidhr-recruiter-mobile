// components/ThreeDotDropdown.tsx
import React from "react";
import {
  Modal,
  Pressable,
  View,
  Text,
} from "react-native";
import { useStyles } from "./styles";
interface MenuItem {
  name: string;
  title?: string;
  onPress: () => void;
}

interface ThreeDotDropdownProps {
  visible: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  top?: number;
  right?: number;
  left?: number;
  bottom?: number;
}

const ThreeDotDropdown: React.FC<ThreeDotDropdownProps> = ({
  visible,
  onClose,
  menuItems,
  top,
  right,
  left,
  bottom,
}) => {
  const styles = useStyles();

  const isBottomLeftAnchored = left !== undefined || bottom !== undefined;
  const positionStyle: Record<string, number> = {};
  if (!isBottomLeftAnchored) {
    // Default positioning for existing callers.
    positionStyle.top = top ?? 90;
    positionStyle.right = right ?? 20;
  } else {
    // When bottom/left are provided, ignore default top/right to avoid conflicts.
    if (top !== undefined) positionStyle.top = top;
    if (right !== undefined) positionStyle.right = right;
    if (left !== undefined) positionStyle.left = left;
    if (bottom !== undefined) positionStyle.bottom = bottom;
  }

  return (
    <Modal transparent visible={visible} animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={[styles.dropdownContainer, positionStyle]}>
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
export default ThreeDotDropdown;
