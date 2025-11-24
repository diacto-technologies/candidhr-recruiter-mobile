export interface StatCardProps {
    title: string;
    value: string | number;
    percentage: string;
    subText: string;
    onPressInfo?: () => void;
  }