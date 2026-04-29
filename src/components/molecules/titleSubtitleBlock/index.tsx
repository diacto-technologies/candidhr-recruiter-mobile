import React from 'react';
import { View, StyleSheet, type StyleProp, type TextStyle } from 'react-native';
import Typography from '../../atoms/typography';
import type { TypographyProps } from '../../atoms/typography/typography';
import { colors } from '../../../theme/colors';
import type { TitleSubtitleBlockProps, TitleSubtitleTypographyProps } from './types';

const DEFAULT_SUBTITLE_VARIANT: NonNullable<TitleSubtitleBlockProps['subtitleVariant']> = 'regularTxtsm';
const DEFAULT_TITLE_VARIANT: NonNullable<TitleSubtitleBlockProps['titleVariant']> = 'semiBoldTxtxl';

function splitTypographyRest(props: TitleSubtitleTypographyProps | undefined): {
  style: TypographyProps['style'];
  variant: TypographyProps['variant'];
  color: TypographyProps['color'];
  rest: Partial<TypographyProps>;
} {
  if (!props) {
    return { style: undefined, variant: undefined, color: undefined, rest: {} };
  }
  const { style, variant, color, ...rest } = props;
  return { style, variant, color, rest };
}

const TitleSubtitleBlock = ({
  title,
  subtitle,
  titleVariant = DEFAULT_TITLE_VARIANT,
  subtitleVariant = DEFAULT_SUBTITLE_VARIANT,
  titleProps,
  subtitleProps,
  style,
  gap = 4,
}: TitleSubtitleBlockProps) => {
  const t = splitTypographyRest(titleProps);
  const s = splitTypographyRest(subtitleProps);

  const hasSubtitle = subtitle != null && subtitle !== '';

  return (
    <View style={[styles.root, { gap }, style]}>
      {hasSubtitle && (
        <Typography
          variant={s.variant ?? subtitleVariant}
          color={s.color ?? colors.gray[600]}
          {...s.rest}
          style={StyleSheet.flatten([styles.line, s.style] as StyleProp<TextStyle>)}
        >
          {subtitle}
        </Typography>
      )}
      <Typography
        variant={t.variant ?? titleVariant}
        color={t.color ?? colors.gray[900]}
        {...t.rest}
        style={StyleSheet.flatten([styles.line, t.style] as StyleProp<TextStyle>)}
      >
        {title}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    maxWidth: '100%',
    width: '100%',
    alignItems: 'center',
  },
  /** Full width so `textAlign: 'center'` actually centers in the header (Text is not full-width by default). */
  line: {
    textAlign: 'center',
    width: '100%',
  },
});

export type { TitleSubtitleBlockProps, TitleSubtitleTypographyProps } from './types';
export default TitleSubtitleBlock;
