import React, { useMemo, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TextInputProps,
  FlatList,
  Pressable,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { colors } from '../../../theme/colors';
import { searchIcon } from '../../../assets/svg/search';
import { clearIcon } from '../../../assets/svg/clear';

type DropItem = {
  id: string;
  title: string;
};

interface SearchBarProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;

  // ✅ NEW
  dropdown?: boolean;
  data?: DropItem[];
  onSelect?: (item: DropItem) => void;
  onEndReached?: () => void;
  loading?: boolean;
  onClear?: () => void;
}

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
  ...rest
}) => {
  const [open, setOpen] = useState(false);

  // ✅ Use API-filtered data directly (no local filtering)
  const filteredData = useMemo(() => data, [data]);

  const handleSelect = (item: DropItem) => {
    onChangeText(item.title); // ✅ set selected text in input
    onSelect?.(item);         // ✅ send selected full object
    setOpen(false);
  };

  const handleClear = () => {
    onChangeText('');
    onClear?.();
    setOpen(false);
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

      {/* ✅ Dropdown list */}
      {dropdown && open && (
        <View style={styles.dropdownBox}>
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <Pressable style={styles.item} onPress={() => handleSelect(item)}>
                <Text style={styles.itemText}>{item.title}</Text>
              </Pressable>
            )}
            onEndReached={onEndReached}                 // ✅ pagination trigger
            onEndReachedThreshold={0.6}                 // ✅ important
            ListFooterComponent={() =>
              loading ? (
                <View style={{ padding: 12 }}>
                  <Text style={{ textAlign: "center", color: colors.gray[500] }}>
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

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    position: 'relative',
    zIndex: 9999,
    elevation: 9999,
  },

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

  clearButton: {
    marginLeft: 8,
    padding: 4,
  },

  placeholder: {
    position: 'absolute',
    left: 46,
    right: 10,
    color: '#A3A3A7',
    fontSize: 18,
  },

  dropdownBox: {
    position: 'absolute',     // ✅ make it float
    top: 50,                  // ✅ below input
    left: 0,
    right: 0,

    backgroundColor: colors.base.white,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 10,
    maxHeight: 260,
    overflow: 'hidden',

    // ✅ IMPORTANT
    zIndex: 9999,
    elevation: 10,

    shadowColor: '#0A0D12',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },

  item: {
    paddingVertical: 14,
    paddingHorizontal: 12,
  },

  itemText: {
    fontSize: 16,
    color: colors.gray[900],
  },

  emptyBox: {
    padding: 16,
  },

  emptyText: {
    color: colors.gray[500],
  },
});
