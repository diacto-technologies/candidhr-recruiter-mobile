import { CommonDropdownOption } from "../../organisms/commondropdown/types";

export interface DropdownFilterProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  options: CommonDropdownOption[];
}
