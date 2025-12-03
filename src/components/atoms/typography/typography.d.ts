// components/typography/typography.d.ts

import {
  TextProps,
  TextStyle,
  NativeSyntheticEvent,
  TextLayoutEventData,
  GestureResponderEvent,
} from 'react-native';
import { ReactNode } from 'react';

export interface TypographyProps extends TextProps {
  variant?:
    | 'H1XL'
    | 'H1'
    | 'H2'
    | 'H3'
    | 'H4'
    | 'P1'
    | 'P2'
    | 'P3'
    | 'P4'
    | 'T1'
    | 'T2'
    | 'P0M'
    | 'P1M'
    | 'P2M'

    // ==== Display Regular ====
    | 'regularD2xl'
    | 'regularDxl'
    | 'regularDlg'
    | 'regularDmd'
    | 'regularDsm'
    | 'regularDxs'
    | 'regularTxtxl'
    | 'regularTxtlg'
    | 'regularTxtmd'
    | 'regularTxtsm'
    | 'regularTxtxs'

    // ==== Medium ====
    | 'mediumD2xl'
    | 'mediumDxl'
    | 'mediumDlg'
    | 'mediumDmd'
    | 'mediumDsm'
    | 'mediumDxs'
    | 'mediumTxtxl'
    | 'mediumTxtlg'
    | 'mediumTxtmd'
    | 'mediumTxtsm'
    | 'mediumTxtxs'

    // ==== SemiBold ====
    | 'semiBoldD2xl'
    | 'semiBoldDxl'
    | 'semiBoldDlg'
    | 'semiBoldDmd'
    | 'semiBoldDsm'
    | 'semiBoldDxs'
    | 'semiBoldTxtxl'
    | 'semiBoldTxtlg'
    | 'semiBoldTxtmd'
    | 'semiBoldTxtsm'
    | 'semiBoldTxtxs'

    // ==== Bold ====
    | 'boldD2xl'
    | 'boldDxl'
    | 'boldDlg'
    | 'boldDmd'
    | 'boldDsm'
    | 'boldDxs'
    | 'boldTxtxl'
    | 'boldTxtlg'
    | 'boldTxtmd'
    | 'boldTxtsm'
    | 'boldTxtxs';

  color?: string;
  style?: TextStyle;
  children?: ReactNode;
  numberOfLines?: number;

  ellipsizeMode?: 'tail' | 'head' | 'middle' | 'clip';
  textBreakStrategy?: 'highQuality' | 'simple' | 'balanced';
  dataDetectorType?: null | 'phoneNumber' | 'link' | 'email' | 'none' | 'all';
  lineBreakMode?: 'head' | 'middle' | 'tail' | 'clip';

  onPress?: (event: GestureResponderEvent) => void;
  onPressIn?: (event: GestureResponderEvent) => void;
  onPressOut?: (event: GestureResponderEvent) => void;
  onLongPress?: (event: GestureResponderEvent) => void;

  onTextLayout?: (event: NativeSyntheticEvent<TextLayoutEventData>) => void;
}
