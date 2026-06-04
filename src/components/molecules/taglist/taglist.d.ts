export interface TagListProps {
  data: string[];
  textColor?: string;
  bgColor?: string;
  borderColor?: string;
  renderIcon?: (item: string, index: number) => React.ReactNode;
}
