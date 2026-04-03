import { ReactNode } from 'react';

export interface IBottomsheet {
  visible?: true | false;
  onClose?: () => void;
  onClearAll?: () => void;
  children?: ReactNode;
  title?: string;
  subTitle?: string;
  showHeadline?: true | false;
  hight:any;
  /**
   * Ratio of screen height to cap the bottom sheet.
   * Example: 0.8 => max height = screenHeight * 0.8
   */
  sheetHeightRatio?: number;
}
