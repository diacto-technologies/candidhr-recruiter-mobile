export interface VideoChapterMarker {
  time: number; // in seconds
  title?: string;
}

export interface VideoPlayerBoxProps {
  source: string;
  startTime?: number;
  duration?: number;
  initialTime?: number;
  chapters?: VideoChapterMarker[];
  activeChapterIndex?: number;
  onChapterChange?: (index: number) => void;
  onProgress?: (data: {
    currentTime: number;
    absoluteTime?: number;
    playableDuration?: number;
  }) => void;
  fullscreen?: boolean;
  resizeMode?: "contain" | "cover" | "stretch";
}
