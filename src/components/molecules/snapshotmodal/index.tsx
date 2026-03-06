import React from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import Typography from "../../atoms/typography";
import { colors } from "../../../theme/colors";

interface Props {
  visible: boolean;
  imageUri: string | null;
  onClose: () => void;
}

const { width, height } = Dimensions.get("window");

const SnapshotModal = ({ visible, imageUri, onClose }: Props) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.85)",
          justifyContent: "center",
          alignItems: "center",
          padding: 16,
        }}
      >
        {/* Close Button */}
        <TouchableOpacity
          onPress={onClose}
          style={{
            position: "absolute",
            top: 50,
            right: 20,
            zIndex: 10,
          }}
        >
          <Typography
            variant="semiBoldTxtlg"
            color={colors.base.white}
          >
            ✕
          </Typography>
        </TouchableOpacity>

        {/* Image */}
        {imageUri && (
          <Image
            source={{ uri: imageUri }}
            style={{
              width: width * 0.9,
              height: height * 0.6,
              borderRadius: 16,
            }}
            resizeMode="stretch"
          />
        )}
      </View>
    </Modal>
  );
};

export default SnapshotModal;