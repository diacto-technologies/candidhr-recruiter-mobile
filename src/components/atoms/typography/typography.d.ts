// import { ReactNode } from 'react';
// import {
//   StyleProp,
//   TextProps,
//   Text,
//   NativeSyntheticEvent,
//   TextLayoutEventData,
//   GestureResponderEvent,
//   TextStyle,
// } from 'react-native';

// export interface TypographyProps extends TextProps {
//   variant?:
//     | 'H1'
//     | 'H1B'
//     | 'H1C'
//     | 'H2'
//     | 'H2B'
//     | 'H2C'
//     | 'H3'
//     | 'H3B'
//     | 'H3C'
//     | 'H4'
//     | 'H4B'
//     | 'H4C'
//     | 'H5'
//     | 'H5B'
//     | 'H5C'
//     | 'H6'
//     | 'H7'
//     | 'H6B'
//     | 'H6C'
//     | 'P1'
//     | 'P1B'
//     | 'P1C'
//     | 'P2'
//     | 'P2B'
//     | 'P2C'
//     | 'P3'
//     | 'P3B'
//     | 'P3C'
//     | 'P4'
//     | 'P4B'
//     | 'P4C'
//     | 'P5'
//     | 'P5B'
//     | 'P5C'
//     | 'P6'
//     | 'P6B'
//     | 'P6C'
//     | 'P11'
//     | 'T11';
//   color?: string;
//   style?: TextStyle;
//   children?: ReactNode;
//   numberOfLines?: number;
//   ellipsizeMode?: 'tail' | 'head' | 'middle' | 'clip' | undefined;
//   onTextLayout?: ((event: NativeSyntheticEvent<TextLayoutEventData>) => void) | undefined;
//   textBreakStrategy?: 'highQuality' | 'simple' | 'balanced' | undefined;
//   dataDetectorType?: null | 'phoneNumber' | 'link' | 'email' | 'none' | 'all' | undefined;
//   lineBreakMode?: 'head' | 'middle' | 'tail' | 'clip' | undefined;
//   onPress?: ((event: GestureResponderEvent) => void) | undefined;

//   onPressIn?: ((event: GestureResponderEvent) => void) | undefined;
//   onPressOut?: ((event: GestureResponderEvent) => void) | undefined;
//   onLongPress?: ((event: GestureResponderEvent) => void) | undefined;
// }

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
    | 'P1M'
    |'P2M'
    ;

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

