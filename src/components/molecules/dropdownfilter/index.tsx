import React from "react";
import { View } from "react-native";
import CommonDropdown from "../../organisms/commondropdown";
import { CommonDropdownOption } from "../../organisms/commondropdown/types";

interface Props {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  options: CommonDropdownOption[];
}

const DropdownFilter: React.FC<Props> = ({
  value,
  onChange,
  placeholder,
  options,
}) => {
  return (
    <View style={{ paddingHorizontal: 10 }}>
      <CommonDropdown
        placeholder={placeholder || "Select"}
        options={options}
        value={value}
        labelKey="label"
        valueKey="value"
        onChange={onChange}
      />
    </View>
  );
};

export default DropdownFilter;