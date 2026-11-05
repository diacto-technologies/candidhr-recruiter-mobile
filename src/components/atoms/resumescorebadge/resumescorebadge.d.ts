import { StyleProp, TextStyle, ViewStyle } from 'react-native';

export type ResumeScoreBadgeSize = 'sm' | 'md' | 'lg';

export interface ResumeScoreBadgeCandidate {
  resume_score?: number | string | null;
  match_score?: number | string | null;
  overall_score?: number | string | null;
}

export interface ResumeScoreBadgeProps {
  score?: number | string | null;
  candidate?: ResumeScoreBadgeCandidate | null;
  size?: ResumeScoreBadgeSize;
  showLabel?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  fallbackText?: string;
}

