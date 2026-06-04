export interface SetProfilePhotoModalProps {
  visible: boolean;
  onClose: () => void;
  /** iOS: fired after modal dismiss animation completes — open native picker here. */
  onDismiss?: () => void;
  onSelectGallery: () => void;
  onSelectCamera: () => void;
}
