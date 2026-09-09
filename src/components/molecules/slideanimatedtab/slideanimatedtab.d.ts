export type TabItem = string | { key: string; label: string };

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabPress: (tab: string, index: number) => void;
  onTabLayout?: (e: LayoutChangeEvent, index: number) => void;
}

export interface TabLayout {
  x: number;
  width: number;
}

export interface Props {
  tabs: TabItem[];
  activeTab: string;
  onChangeTab: (label: string, index: number) => void;
  counts?: Record<string, number>;
  countShow?: boolean;
}