// components/Button/Button.tsx
import React from 'react';
import { Pressable, View, ActivityIndicator } from 'react-native';
import Typography from '../typography';
import { useStyles } from './styles';
import { renderNode } from '../../../utils/renderNode';
import { IButton } from './button';
import { colors } from '../../../theme/colors';

const Button: React.FC<IButton> = (props) => {
  const [pressed, setPressed] = React.useState(false);
  const styles = useStyles({ ...props, pressed });

  const getTextColor = () => {
    if (props.textColor) return props.textColor;
    if (props.variant === 'text' || props.variant === 'outline') return props.buttonColor || colors.mainColors.main;
    return colors.common.white;
  };

  const getLoaderColor = () => {
    return props.textColor || colors.common.white;
  };

  return (
    <Pressable
      {...props}
      // onPressIn={() => setPressed(true)}
      // onPressOut={() => setPressed(false)}
      style={styles.container}
      disabled={props.disabled || props.isLoading}
    >
      {/* Gradient Border */}
      <View style={styles.borderGradient} pointerEvents="none" />
      <View style={styles.innerShadow} pointerEvents="none" />

      {props.isLoading ? (
        <ActivityIndicator color={getLoaderColor()} size="small" />
      ) : (
        <View style={styles.content}>
          {renderNode(props.startIcon)}
          {props.children && (
            <Typography
              variant="semiBoldTxtxs"
              color={getTextColor()}
            >
              {props.children}
            </Typography>
          )}
          
          {renderNode(props.middleIcon)}
          {renderNode(props.endIcon)}
        </View>
      )}

      {pressed && <View style={styles.pressedOverlay} pointerEvents="none" />}
    </Pressable>
  );
};

export default Button;