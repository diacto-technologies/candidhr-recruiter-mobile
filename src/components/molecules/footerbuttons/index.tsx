import React from "react";
import { View, StyleSheet } from "react-native";
import Button from "../../atoms/button";

interface FooterButtonsProps {
  leftButtonProps: React.ComponentProps<typeof Button>;
  rightButtonProps: React.ComponentProps<typeof Button>;
}

const FooterButtons: React.FC<FooterButtonsProps> = ({
  leftButtonProps,
  rightButtonProps,
}) => {
  return (
    <View style={styles.footer}>
      <View style={{ flex: 1 }}>
        <Button {...leftButtonProps} />
      </View>

      <View style={{ flex: 1 }}>
        <Button {...rightButtonProps} />
      </View>
    </View>
  );
};

export default FooterButtons;

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderColor: "#E5E5E5",
    columnGap: 12,
  },
});
