import React, { useMemo, useState } from 'react';
import { View, TextInput, Text, FlatList, Pressable } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { colors } from '../../../theme/colors';
import { searchIcon } from '../../../assets/svg/search';
import { clearIcon } from '../../../assets/svg/clear';
import { SearchBarProps, DropItem } from './searchbar.d';
import { useStyles } from './styles';

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  dropdown = false,
  data = [],
  onSelect,
  onEndReached,
  loading = false,
  onClear,
  externalDropdown = false,
  ...rest
}) => {
  const [open, setOpen] = useState(false);
  const styles = useStyles();

  // ✅ Use API-filtered data directly (no local filtering)
  const filteredData = useMemo(() => data, [data]);

  const handleSelect = (item: DropItem) => {
    onChangeText(item.title); // ✅ set selected text in input
    onSelect?.(item);         // ✅ send selected full object
    setOpen(false);
  };

  const handleClear = () => {
    setOpen(false);
    /** Parent `onClear` is responsible for clearing value + refetch (e.g. dashboard job filter). */
    if (onClear) {
      onClear();
    } else {
      onChangeText('');
    }
  };

  return (
    <View style={styles.wrapper}>
      {/* ✅ Input */}
      <View style={styles.container}>
        <SvgXml xml={searchIcon} style={styles.icon} />

        {/* Fake placeholder */}
        {!value && (
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.placeholder}>
            {placeholder}
          </Text>
        )}

        <TextInput
          style={styles.input}
          value={value}
          onChangeText={(txt) => {
            onChangeText(txt);
            if (dropdown) setOpen(true);
          }}
          placeholder=""
          onFocus={() => dropdown && setOpen(true)}
          {...rest}
        />

        {/* ✅ Clear button */}
        {value && onClear && (
          <Pressable onPress={handleClear} style={styles.clearButton}>
            <SvgXml xml={clearIcon} />
          </Pressable>
        )}
      </View>

      {/* ✅ Dropdown list (only when NOT rendered externally) */}
      {dropdown && open && !externalDropdown && (
        <View style={styles.dropdownBox}>
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
            renderItem={({ item }) => (
              <Pressable style={styles.item} onPress={() => handleSelect(item)}>
                <Text style={styles.itemText}>{item.title}</Text>
              </Pressable>
            )}
            onEndReached={onEndReached}                 // ✅ pagination trigger
            onEndReachedThreshold={0.6}                 // ✅ important
            ListFooterComponent={() =>
              loading ? (
                <View style={styles.footerLoader}>
                  <Text style={styles.footerLoaderText}>
                    Loading...
                  </Text>
                </View>
              ) : null
            }
          />
        </View>
      )}
    </View>
  );
};

export default SearchBar;

