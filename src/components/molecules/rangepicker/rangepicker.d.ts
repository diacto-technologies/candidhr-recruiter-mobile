export interface RangePickerProps {
  onClose: () => void;
  onApply: (range: { start?: string; end?: string }) => void;
  mode?: "single" | "range";
  initialValue?: { start?: string; end?: string };
}
