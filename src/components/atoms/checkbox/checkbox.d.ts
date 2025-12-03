export interface ICheckBox {
  checked?: true | false;
  onChange?: () => void;
  color?: string;
  type?: 'round' | 'square';
}
