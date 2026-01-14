import React from 'react';
import { View, TextInput, StyleSheet, Text, Platform, TextInputProps } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { colors } from '../../../theme/colors';
import { searchIcon } from '../../../assets/svg/search';

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

      {/* Fake placeholder */}
      {!value && (
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={styles.placeholder}
        >
          {placeholder}
        </Text>
      )}

      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder=""
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
    borderColor: colors.gray[300],
    paddingHorizontal: 14,
    height: 44,
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
    color: colors.gray[500],
  },
  placeholder: {
    position: 'absolute',
    left: 46, // icon margin + padding
    right: 10,
    color: '#A3A3A7',
    fontSize: 18,
  },
});

export default SearchBar;
