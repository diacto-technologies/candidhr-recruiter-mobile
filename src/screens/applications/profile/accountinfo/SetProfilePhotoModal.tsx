import React, { useCallback } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Typography from '../../../../components/atoms/typography';
import { colors } from '../../../../theme/colors';
import { useStyles } from './styles';
import { closeIcon } from '../../../../assets/svg/closeicon';
import { SvgXml } from 'react-native-svg';

export interface SetProfilePhotoModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectGallery: () => void;
  onSelectCamera: () => void;
}

export const SetProfilePhotoModal: React.FC<SetProfilePhotoModalProps> = ({
  visible,
  onClose,
  onSelectGallery,
  onSelectCamera,
}) => {
  const styles = useStyles();

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleGallery = useCallback(() => {
    onClose();
    onSelectGallery();
  }, [onClose, onSelectGallery]);

  const handleCamera = useCallback(() => {
    onClose();
    onSelectCamera();
  }, [onClose, onSelectCamera]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.modalBackdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.modalCard}>
          <View style={styles.submodalCard}>
            <View style={styles.modalHeader}>
              <Typography variant="semiBoldTxtlg" color={colors.gray[900]}>
                Set profile photo
              </Typography>
              <Pressable onPress={handleClose} hitSlop={10}>
                <SvgXml xml={closeIcon} />
              </Pressable>
            </View>

            <View style={styles.modalBody}>
              <Pressable style={styles.photoOptionRow} onPress={handleGallery}>
                <View style={styles.photoOptionIcon}>
                  <Ionicons name="images-outline" size={24} color={colors.gray[700]} />
                </View>
                <Typography variant="mediumTxtmd" color={colors.gray[900]}>
                  Gallery
                </Typography>
              </Pressable>

              <Pressable style={styles.photoOptionRow} onPress={handleCamera}>
                <View style={styles.photoOptionIcon}>
                  <Ionicons name="camera-outline" size={24} color={colors.gray[700]} />
                </View>
                <Typography variant="mediumTxtmd" color={colors.gray[900]}>
                  Camera
                </Typography>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
