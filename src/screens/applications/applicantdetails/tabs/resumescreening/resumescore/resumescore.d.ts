export interface ScoreItem {
  title: string;
  percentage: string;
  completed: boolean;
  value: string;
}

export interface Props {
  overall: string;
  details: ScoreItem[];
  isloading: boolean;
}
