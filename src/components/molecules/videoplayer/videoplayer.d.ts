export interface VideoChapter {
  time: number;
  title?: string;
}

export interface VideoPlayerBoxProps {
  source: string;
  startTime?: number;
  duration?: number;
  initialTime?: number;
  chapters?: VideoChapter[];
  activeChapterIndex?: number;
  onChapterChange?: (index: number) => void;
  seekToTime?: number;
  onProgress?: (data: {
    currentTime: number;
    absoluteTime?: number;
    playableDuration?: number;
  }) => void;
  onDurationLoaded?: (duration: number) => void;
  fullscreen?: boolean;
  resizeMode?: "contain" | "cover" | "stretch";
  showMuteButton?: boolean;
}

