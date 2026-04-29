import type { ReactNode } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import type { TypographyProps } from '../typography/typography';

export interface LabelProps {
  /** Primary string content; ignored if `children` is passed */
  text?: string;
  children?: ReactNode;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  /** Passed to `Typography` as `color` */
  textColor?: string;
  /** `Typography` variant (default `mediumTxtxs`) */
  variant?: TypographyProps['variant'];
  paddingHorizontal?: number;
  paddingVertical?: number;
  /** Container styles */
  style?: StyleProp<ViewStyle>;
  /** Merged into `Typography` `style` */
  textStyle?: StyleProp<TextStyle>;
  /** Extra props for `Typography` (e.g. `numberOfLines`) */
  typographyProps?: Omit<Partial<TypographyProps>, 'children'>;
}
