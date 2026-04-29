import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { TypographyProps } from '../../atoms/typography/typography';

export type TitleSubtitleTypographyProps = Omit<Partial<TypographyProps>, 'children'>;

export interface TitleSubtitleBlockProps {
  title: ReactNode;
  subtitle?: ReactNode;
  titleVariant?: TypographyProps['variant'];
  subtitleVariant?: TypographyProps['variant'];
  titleProps?: TitleSubtitleTypographyProps;
  subtitleProps?: TitleSubtitleTypographyProps;
  style?: StyleProp<ViewStyle>;
  gap?: number;
}
