import React from "react";
import { View } from "react-native";
import SearchBar from "../../atoms/searchbar";

interface Props {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
}

const TextSearchFilter: React.FC<Props> = ({ value, onChange, placeholder }) => {
  return (
    <View style={{ paddingHorizontal: 10 }}>
      <SearchBar
        value={value}
        placeholder={placeholder || "Search"}
        onChangeText={onChange}
      />
    </View>
  );
};

export default TextSearchFilter;
