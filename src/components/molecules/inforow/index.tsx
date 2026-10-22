import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { SvgXml } from 'react-native-svg';
import Typography from '../../atoms/typography';
import CopyText from '../copyText';
import { colors } from '../../../theme/colors';
import { copyIcon } from '../../../assets/svg/copy';
import { InfoRowProps } from './inforow.d';
import { useStyles } from './styles';

export const InfoRow: React.FC<InfoRowProps> = React.memo(({
  icon,
  title,
  value,
  copyText,
  fallbackValue = 'Not provided',
  style,
  iconBoxStyle,
  textBoxStyle,
  valueStyle,
  titleStyle,
  valueNumberOfLines,
  titleNumberOfLines,
  valueEllipsizeMode,
  titleEllipsizeMode,
  rightContent,
  height = 20,
  width = 20,
  onPress,
}) => {
  const styles = useStyles();

  const renderValue = () => {
    if (value === null || value === undefined || value === '') {
      return (
        <Typography
          variant="semiBoldTxtsm"
          color={colors.gray[800]}
          style={valueStyle}
          numberOfLines={valueNumberOfLines}
          ellipsizeMode={valueEllipsizeMode}
        >
          {fallbackValue}
        </Typography>
      );
    }

    if (typeof value === 'string' || typeof value === 'number') {
      return (
        <Typography
          variant="semiBoldTxtsm"
          color={colors.gray[800]}
          style={valueStyle}
          numberOfLines={valueNumberOfLines}
          ellipsizeMode={valueEllipsizeMode}
        >
          {value}
        </Typography>
      );
    }

    return value;
  };

  const content = (
    <>
      <View style={[styles.iconBox, iconBoxStyle]}>
        <SvgXml xml={icon} height={height} width={width} color={colors.gray[600]} />
      </View>

      <View
        style={[
          styles.textBox,
          Boolean(rightContent || copyText) && { marginRight: 8 },
          textBoxStyle,
        ]}
      >
        {renderValue()}
        {Boolean(title) && (
          <Typography
            variant="regularTxtsm"
            color={colors.gray[600]}
            style={titleStyle}
            numberOfLines={titleNumberOfLines}
            ellipsizeMode={titleEllipsizeMode}
          >
            {title}
          </Typography>
        )}
      </View>

      {Boolean(copyText) && (
        <CopyText text={copyText!} message={`${title} copied`}>
          <SvgXml xml={copyIcon} height={20} width={20} />
        </CopyText>
      )}

      {rightContent}
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={[styles.row, style]}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={[styles.row, style]}>{content}</View>;
});

export default InfoRow;
export type { InfoRowProps } from './inforow.d';
