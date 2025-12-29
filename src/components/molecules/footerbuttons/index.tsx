import React from "react";
import { View, StyleSheet } from "react-native";
import Button from "../../atoms/button";
import { colors } from "../../../theme/colors";
import { useRNSafeAreaInsets } from "../../../hooks/useRNSafeAreaInsets";

interface FooterButtonsProps {
  leftButtonProps: React.ComponentProps<typeof Button>;
  rightButtonProps: React.ComponentProps<typeof Button>;
}

const FooterButtons: React.FC<FooterButtonsProps> = ({
  leftButtonProps,
  rightButtonProps,
}) => {
  const insets = useRNSafeAreaInsets();

  return (
    <View style={[styles.footer, { paddingBottom: insets.insetsBottom+16, paddingTop:16}]}>
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
    paddingHorizontal: 12,
    backgroundColor: colors.base.white,
    borderTopWidth: 1,
    borderColor: "#E5E5E5",
    columnGap: 12,
  },
});
