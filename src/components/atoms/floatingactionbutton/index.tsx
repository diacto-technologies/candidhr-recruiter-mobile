import React from 'react';
import { Pressable, View, ViewStyle, StyleProp } from 'react-native';
import { colors } from '../../../theme/colors';
import { SvgXml } from 'react-native-svg';
import { FloatingActionButtonProps } from './floatingactionbutton.d';
import { useStyles } from './styles';
import Typography from '../typography';

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  value,
  size = 56,
  backgroundColor = colors.brand[600],
  iconColor = colors.common.white,
  badgeCount,
  badgeBackgroundColor,
  badgeTextColor = colors.base.white,
  style,
  ...rest
}) => {
  const styles = useStyles(size, backgroundColor);
  const countNumber = typeof badgeCount === 'number' ? badgeCount : Number(badgeCount);
  const showBadge = !isNaN(countNumber) && countNumber > 0;
  const displayCount = countNumber > 99 ? '99+' : String(countNumber);

  return (
    <Pressable
      {...rest}
      style={[styles.button, style as StyleProp<ViewStyle>]}
    >
      <SvgXml
        xml={value}
        width={size * 0.50}
        height={size * 0.50}
        stroke={iconColor}
        color={iconColor}
      />
      {showBadge && (
        <View
          style={[
            styles.badge,
            badgeBackgroundColor ? { backgroundColor: badgeBackgroundColor } : undefined,
          ]}
        >
          <Typography
            variant="mediumTxtxs"
            color={badgeTextColor}
            style={{ fontSize: 10, lineHeight: 12 }}
          >
            {displayCount}
          </Typography>
        </View>
      )}
    </Pressable>
  );
};

export default FloatingActionButton;


