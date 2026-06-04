import React from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import Typography from "../../atoms/typography";
import { colors } from "../../../theme/colors";
import { SnapshotModalProps } from "./snapshotmodal.d";
import { useStyles } from "./styles";

const SnapshotModal = ({ visible, imageUri, onClose }: SnapshotModalProps) => {
  const styles = useStyles();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      supportedOrientations={[
        'portrait',
        'portrait-upside-down',
        'landscape',
        'landscape-left',
        'landscape-right',
      ]}
    >
      <View style={styles.backdrop}>
        {/* Close Button */}
        <TouchableOpacity
          onPress={onClose}
          style={styles.closeButton}
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
            style={styles.image}
            resizeMode="stretch"
          />
        )}
      </View>
    </Modal>
  );
};

export default SnapshotModal;