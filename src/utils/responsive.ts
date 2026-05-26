import { Dimensions, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');

// Base design (standard iPhone width)
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

// Scale based on width
export const scale = (size: number) =>
  (width / guidelineBaseWidth) * size;

// Moderate scale (best for spacing)
export const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

// Vertical scale
export const verticalScale = (size: number) =>
  (height / guidelineBaseHeight) * size;

// Font size helper
export const fs = (size: number) =>
  Math.round(PixelRatio.roundToNearestPixel(moderateScale(size)));