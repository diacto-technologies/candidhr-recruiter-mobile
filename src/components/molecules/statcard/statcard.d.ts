export interface StatCardProps {
    title: string;
    value: string;
    percentage: string;
    subText: string;
    onPressInfo?: () => void;
    tooltipText?: string;
    /** When true, values ≥ 1000 show as 1.1K / 1.5M (international compact notation). */
    isCompact?: boolean;
    loading?: boolean;
  }