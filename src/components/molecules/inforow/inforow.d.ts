import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import React from 'react';

export interface InfoRowProps {
  icon: string;
  title: string;
  value?: React.ReactNode;
  copyText?: string;
  fallbackValue?: string;
  style?: StyleProp<ViewStyle>;
  iconBoxStyle?: StyleProp<ViewStyle>;
  textBoxStyle?: StyleProp<ViewStyle>;
  valueStyle?: StyleProp<TextStyle>;
  titleStyle?: StyleProp<TextStyle>;
  valueNumberOfLines?: number;
  titleNumberOfLines?: number;
  valueEllipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
  titleEllipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
  rightContent?: React.ReactNode;
  onPress?: () => void;
  height?: number;
  width?: number;
}
