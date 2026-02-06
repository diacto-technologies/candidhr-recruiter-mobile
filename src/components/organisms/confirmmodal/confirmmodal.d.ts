import { ReactNode } from 'react';
import type { IButton } from '../../atoms/button/button';

export interface IConfirmModal {
  visible: boolean;
  title?: string;
  message?: ReactNode;

  confirmText?: string;
  cancelText?: string;

  onConfirm: () => void;
  onCancel: () => void;

  /** Optional: allow closing from X / backdrop */
  onClose?: () => void;
  dismissOnBackdropPress?: boolean;

  /** Optional button overrides */
  confirmButtonProps?: Partial<IButton>;
  cancelButtonProps?: Partial<IButton>;

  /** Optional: override icons */
  headerIconName?: string; // Ionicons name
  confirmIconName?: string; // Ionicons name
}

