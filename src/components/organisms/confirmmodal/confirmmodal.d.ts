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

  /** Optional: full control over header icon (e.g. `<Ionicons name="warning" … />`). Overrides `headerIconName`. */
  headerIcon?: ReactNode;
  /** Optional: Ionicons name when `headerIcon` is not provided */
  headerIconName?: string;
  confirmIconName?: string; // Ionicons name

  /** Optional: custom close control (e.g. `<SvgXml xml={closeIcon} />`). Defaults to built-in close icon. */
  closeButton?: ReactNode;

  /** When true, Cancel is on the left and confirm on the right (matches common “Cancel | Primary” order). */
  cancelFirst?: boolean;
}

