import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../theme/colors';
import { searchIcon } from '../../../assets/svg/search';
import { SvgXml } from 'react-native-svg';

interface SearchBarProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  ...rest
}) => {
  return (
    <View style={styles.container}>
     <SvgXml xml={searchIcon} style={styles.icon} />

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#A3A3A7"
        value={value}
        onChangeText={onChangeText}
        {...rest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.common.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D5D7DA',
    paddingHorizontal: 14,
    height:44,
    shadowColor: '#0A0D12',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: '#1C1E21',
  },
});

export default SearchBar;
