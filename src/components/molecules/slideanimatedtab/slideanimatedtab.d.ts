export interface TabsProps {
    tabs: string[];
    activeTab: string;
    onTabPress: (tab: string, index: number) => void;
    onTabLayout?: (e: LayoutChangeEvent, index: number) => void;
  }