import { GestureResponderEvent } from 'react-native';

export interface IHeader {
  title?: string; // optional (default "Checkout")
  onBack?: (event?: GestureResponderEvent) => void; // optional back press callback
  backNavigation?:boolean;
  edit?:boolean;
  threedot?:boolean;
  borderCondition?:boolean;
  showTitle?: boolean;
}
