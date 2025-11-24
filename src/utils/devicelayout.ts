import { Dimensions } from 'react-native';

export const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');
export const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

// Percentage helpers
export const widthPercentage = (percent: number) => (windowWidth * percent) / 100;
export const heightPercentage = (percent: number) => (windowHeight * percent) / 100;
