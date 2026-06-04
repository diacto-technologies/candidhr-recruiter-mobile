export interface VideoPlayerBoxProps {
  source: string;
  onProgress?: (data: {
    currentTime: number;
    playableDuration: number;
  }) => void;
  fullscreen?: boolean;
  resizeMode?: "contain" | "cover" | "stretch";
}
