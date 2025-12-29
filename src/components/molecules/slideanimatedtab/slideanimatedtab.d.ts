export interface TabsProps {
    tabs: string[];
    activeTab: string;
    onTabPress: (tab: string, index: number) => void;
    onTabLayout?: (e: LayoutChangeEvent, index: number) => void;
  }

  export interface TabLayout {
    x: number;
    width: number;
  }
  
  export interface Props {
    tabs: string[];
    activeTab: string;
    onChangeTab: (label: string, index: number) => void;
    counts?: Record<string, number>; // 🔥 counts added
  }