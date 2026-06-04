export interface TimelineItem {
  title: string;
  date?: string;
  status: "completed" | "current" | "upcoming";
}

export interface TimelineCardProps {
  progress: number;
  data: TimelineItem[];
  title: string;
}
