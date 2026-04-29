import React from 'react';
import {
  View,
  StyleSheet,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import Typography from '../typography';
import type { TypographyProps } from '../typography/typography';
import { colors } from '../../../theme/colors';
import type { LabelProps } from './label.d';

const DEFAULT_BG = colors.warning[50];
const DEFAULT_BORDER = colors.warning[200];
const DEFAULT_TEXT = colors.warning[800];
const DEFAULT_VARIANT: TypographyProps['variant'] = 'mediumTxtxs';

const Label = ({
  text,
  children,
  backgroundColor = DEFAULT_BG,
  borderColor = DEFAULT_BORDER,
  borderWidth = 1,
  borderRadius = 9999,
  textColor,
  variant,
  paddingHorizontal = 10,
  paddingVertical = 4,
  style,
  textStyle,
  typographyProps,
}: LabelProps) => {
  const content = children ?? text ?? '';
  const {
    style: typoUserStyle,
    variant: tpVariant,
    color: tpColor,
    ...restTypo
  } = typographyProps ?? {};
  const mergedTextStyle: StyleProp<TextStyle> = [textStyle, typoUserStyle].filter(
    Boolean,
  ) as StyleProp<TextStyle>;
  const resolvedVariant = variant ?? tpVariant ?? DEFAULT_VARIANT;
  const resolvedColor = textColor ?? tpColor ?? DEFAULT_TEXT;

  const containerStyle: StyleProp<ViewStyle> = [
    styles.base,
    {
      backgroundColor,
      borderColor,
      borderWidth,
      borderRadius,
      paddingHorizontal,
      paddingVertical,
    },
    style,
  ];

  return (
    <View style={containerStyle}>
      <Typography
        {...restTypo}
        variant={resolvedVariant}
        color={resolvedColor}
        style={mergedTextStyle}
      >
        {content}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export type { LabelProps } from './label.d';
export default Label;
