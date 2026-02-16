export interface MenuItem {
    id: string;
    title: string;
    icon: string;
    onPress?: () => void;
    isLogout?: boolean;
  }
  
  export interface MenuSection {
    id: string;
    items: MenuItem[];
  }
  