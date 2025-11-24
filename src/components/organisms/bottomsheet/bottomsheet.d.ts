import { ReactNode } from 'react';

export interface IBottomsheet {
  visible?: true | false;
  onClose?: () => void;
  children?: ReactNode;
  title?: string;
  subTitle?: string;
  showHeadline?: true | false;
}
