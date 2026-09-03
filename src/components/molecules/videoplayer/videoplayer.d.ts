export interface VideoPlayerBoxProps {
  source: string;
  startTime?: number;
  duration?: number;
  initialTime?: number;
  onProgress?: (data: {
    currentTime: number;
    absoluteTime?: number;
    playableDuration?: number;
  }) => void;
  fullscreen?: boolean;
  resizeMode?: "contain" | "cover" | "stretch";
}
