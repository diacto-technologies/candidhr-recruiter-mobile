import { StyleSheet } from 'react-native';
import { IButton } from './button';
import { colors } from '../../../theme/colors';

export const useStyles = (props: IButton & { pressed?: boolean }) => {
  const heightMap = {
    Large: 73,
    Regular: 56,
    Medium: 44,
    Small: 40,
    Tab: 32,
  };

  const height = typeof props.size === 'number' ? props.size : heightMap[props.size || 'Medium'];
  const radius = props.borderRadius ?? 8;

  // Customizable values with smart fallbacks
  const bgColor = props.buttonColor || '#645CE7';
  const shadowColor = props.shadowColor ||  colors.brand[600];
  const lightOpacity = props.shadowOpacityLight ?? 0.05;
  const darkOpacity = props.shadowOpacityDark ?? 0.18;
  const gradientOpacity = props.borderGradientOpacity ?? 0.12;

  return StyleSheet.create({
    container: {
      height,
      //minWidth: 140,
      //paddingHorizontal: props.paddingHorizontal ?? 32,
      borderRadius: radius,
      backgroundColor:props.disabled?colors.brand[300]:bgColor,
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },

    // Gradient Border (top white → transparent)
    borderGradient: {
      ...StyleSheet.absoluteFillObject,
      borderRadius:radius,
      borderWidth: 2,
      borderTopColor: `rgba(255,255,255,${gradientOpacity})`,
      borderLeftColor: `rgba(255,255,255,${gradientOpacity * 0.5})`,
      borderRightColor: `rgba(255,255,255,${gradientOpacity * 0.25})`,
      borderBottomColor: 'transparent',
    },

    // Inset shadows (exactly like your CSS)
    innerShadow: {
      ...StyleSheet.absoluteFillObject,
      borderRadius:20,
      //borderWidth:2,
      borderColor: `${shadowColor}${Math.round(darkOpacity * 255).toString(16).padStart(2, '0')}`,
      //borderTopWidth: 2,
      //borderTopColor: `${shadowColor}${Math.round(lightOpacity * 255).toString(16).padStart(2, '0')}`,
      borderBottomWidth:2,
      borderBottomColor: `${shadowColor}${Math.round(lightOpacity * 255).toString(16).padStart(2, '0')}`,
      opacity: 0.8,
    },

    content: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      zIndex: 1,

    },

    pressedOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.15)',
      borderRadius: radius,
    },
  });
};