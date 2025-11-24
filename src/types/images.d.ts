declare module '*.jpg';
declare module '*.jpeg';
declare module '*.png';
declare module '*.svg' {
    import { type SvgProps } from 'react-native-svg';
  
    const content: React.StatelessComponent<SvgProps>;
    export default content;
  }
declare module 'react-native-vector-icons/Ionicons';
declare module 'react-native-vector-icons/MaterialCommunityIcons';
declare module 'react-native-vector-icons/MaterialIcons';

declare module 'react-native-svg-charts';
declare module 'd3-scale';