import { ReactNode } from 'react';
import { ViewStyle, TextStyle } from 'react-native';
import { OrderV2 } from '../../screens/application/itemcheckout/itemcheckout';

export interface IModalBox {
  visible: boolean;
  title?: string;
  message?: string;
  amount?: number;
  backgroundColor?: string;
  width?: number;
  height?: number;
  borderRadius?: number;
  onClose?: () => void;
  buttonText?: string;
  buttonStyle?: ViewStyle;
  buttonTextStyle?: TextStyle;
  onButtonPress?: () => void;
  children?: ReactNode;
  showGreenModal?: true | false;
  showWhiteModal?: true | false;
  data?: OrderV2
}
