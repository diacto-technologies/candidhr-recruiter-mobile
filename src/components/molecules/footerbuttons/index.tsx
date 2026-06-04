import React from "react";
import { View } from "react-native";
import Button from "../../atoms/button";
import { useRNSafeAreaInsets } from "../../../hooks/useRNSafeAreaInsets";
import { FooterButtonsProps } from "./footerbuttons.d";
import { useStyles } from "./styles";

const FooterButtons: React.FC<FooterButtonsProps> = ({
  leftButtonProps,
  rightButtonProps,
  footerStyle,
}) => {
  const insets = useRNSafeAreaInsets();
  const styles = useStyles();

  return (
    <View
      style={[
        styles.footer,
        { paddingBottom: insets.insetsBottom + 5 },
        footerStyle, // merge custom style
      ]}
    >
      <View style={styles.buttonWrapper}>
        <Button {...leftButtonProps} />
      </View>

      <View style={styles.buttonWrapper}>
        <Button {...rightButtonProps} />
      </View>
    </View>
  );
};

export default FooterButtons;

