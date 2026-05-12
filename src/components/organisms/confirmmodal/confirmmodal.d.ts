import { ReactNode } from 'react';
import type { IButton } from '../../atoms/button/button';

export interface IConfirmModal {
  visible: boolean;
  title?: string;
  /** Optional line under the title (e.g. helper copy). */
  subtitle?: ReactNode;
  message?: ReactNode;
  /** Body content alignment (default centered to match older modals). */
  bodyAlign?: 'center' | 'left';

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

  /**
   * Left confirm button icon. Pass `false` to hide the default trash icon (e.g. brand/red actions without an icon).
   * When omitted, keeps the legacy default delete icon for destructive confirms.
   */
  confirmStartIcon?: ReactNode | false;

  /** Optional: custom close control (e.g. `<SvgXml xml={closeIcon} />`). Defaults to built-in close icon. */
  closeButton?: ReactNode;

  /** When true, Cancel is on the left and confirm on the right (matches common “Cancel | Primary” order). */
  cancelFirst?: boolean;
}

