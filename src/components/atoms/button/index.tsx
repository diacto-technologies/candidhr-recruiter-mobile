import React from 'react';
import { Pressable, View, ActivityIndicator, StyleProp, ViewStyle } from 'react-native';
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
    if (props.variant === 'text' || props.variant === 'outline') return props.buttonColor || colors.brand[600] || colors.mainColors.main;
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
      style={props.style ? ([styles.container, props.style] as StyleProp<ViewStyle>) : styles.container}
      disabled={props.disabled || props.isLoading}
    >
      {/* Gradient Border for contain variant */}
      {props.variant !== 'outline' && props.variant !== 'text' && (
        <>
          <View style={styles.borderGradient} pointerEvents="none" />
          <View style={styles.innerShadow} pointerEvents="none" />
        </>
      )}

      {props.isLoading ? (
        <ActivityIndicator color={getLoaderColor()} size="small" />
      ) : (
        <View style={styles.content} pointerEvents="none">
          {renderNode(props.startIcon)}
          {props.children && (
            <Typography
             variant={props.textVariant || "semiBoldTxtsm"}
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