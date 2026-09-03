import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

export interface VideoResponseTranscriptionWord {
  word: string;
  start?: number | null;
  end?: number | null;
}

export interface VideoResponseTranscriptionSegment {
  text?: string;
  start?: number | null;
  end?: number | null;
  words?: VideoResponseTranscriptionWord[];
}

export interface VideoResponseItem {
  id?: string;
  questionText: string;
  startedAt?: string | null;
  duration?: number | null; // in seconds
  startTime?: number | null; // in seconds
  endTime?: number | null; // in seconds
  videoFile?: string | null;
  videoThumbnail?: string | null;
  transcriptionText?: string | null;
  transcriptionSegments?: VideoResponseTranscriptionSegment[];
}

export interface VideoResponseCardProps {
  responses: VideoResponseItem[];
  activeIndex?: number;
  onActiveIndexChange?: (index: number) => void;
  emptyMessage?: string;
  headerRight?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}
