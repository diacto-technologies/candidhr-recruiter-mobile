import React from "react";
import { TouchableOpacity, View, ToastAndroid, Platform, Alert } from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import { SvgXml } from "react-native-svg";
import { copyIcon } from "../../../assets/svg/copy";

interface Props {
  text: string;      // text to copy
  children?: React.ReactNode;   // optional label or icon
  message?: string;  // success message
}

const CopyText: React.FC<Props> = ({ text, children, message = "Copied" }) => {

  const handleCopy = () => {
    Clipboard.setString(text);

    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert(message);
    }
  };

  return (
    <TouchableOpacity
    onPress={handleCopy}
    activeOpacity={0.6}
    style={{ padding: 6, borderRadius: 50 }}
  >
    {children ?? <SvgXml xml={copyIcon} />}
  </TouchableOpacity>
  );
};

export default CopyText;
