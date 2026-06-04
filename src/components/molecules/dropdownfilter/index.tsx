import React from "react";
import { View } from "react-native";
import CommonDropdown from "../../organisms/commondropdown";
import { DropdownFilterProps } from "./dropdownfilter.d";
import { useStyles } from "./styles";

const DropdownFilter: React.FC<DropdownFilterProps> = ({
  value,
  onChange,
  placeholder,
  options,
}) => {
  const styles = useStyles();

  return (
    <View style={styles.container}>
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