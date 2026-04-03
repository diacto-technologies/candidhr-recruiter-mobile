import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  Dropdown as ElementDropdown,
  MultiSelect as ElementMultiSelect,
} from 'react-native-element-dropdown';

import Typography from '../../atoms/typography';
import { colors } from '../../../theme/colors';
import { styles } from './styles';
import type { CommonDropdownProps } from './types';

const CommonDropdown = ({
  placeholder,
  options,
  value,
  onChange,
  onOpen,
  labelKey = 'name',
  valueKey = 'id',
  usernameKey = 'username',
  disabled,
  error,
  containerStyle,
  searchable = false,
  searchPlaceholder = 'Search...',
  searchField = 'name',
  mode = 'default',
  dropdownPosition = 'bottom',
  multiSelect = false,
  onLoadMore,
}: CommonDropdownProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const items = useMemo(() => {
    return (options ?? []).map((item) => ({
      label: item?.[labelKey],
      value: item?.[valueKey],
      name: item?.[labelKey],
      username: item?.[usernameKey] ? `@${item[usernameKey]}` : '',
      original: item,
    }));
  }, [options, labelKey, valueKey, usernameKey]);

  const multiValues = useMemo(() => {
    if (!multiSelect) return [];
    return Array.isArray(value) ? value : value != null && value !== '' ? [value] : [];
  }, [multiSelect, value]);

  const selectedItem = !multiSelect ? items.find((i) => i.value === value) : undefined;
  const selectedItems = useMemo(() => {
    if (!multiSelect) return [];
    const set = new Set(multiValues);
    return items.filter((i) => set.has(i.value));
  }, [items, multiSelect, multiValues]);

  const selectedValuesSet = useMemo(() => new Set(multiValues), [multiValues]);

  const handleRemoveChip = (chipValue: any) => {
    if (!multiSelect) return;
    const nextValues = multiValues.filter((v) => v !== chipValue);
    const nextOptions = items
      .filter((i) => nextValues.includes(i.value))
      .map((i) => i.original);
    onChange(nextValues, nextOptions);
  };

  const normalizeMultiOnChange = (next: any) => {
    if (Array.isArray(next)) {
      // Some versions return an array of values, others return array of objects.
      if (next.length > 0 && typeof next[0] === 'object' && next[0] != null) {
        const values = next
          .map((x) => (x?.value !== undefined ? x.value : x?.[valueKey]))
          .filter((v) => v !== undefined);
        return values;
      }
      return next;
    }
    return next != null && next !== '' ? [next] : [];
  };

  return (
    <View style={[styles.wrapper, { zIndex: isFocused ? 999 : 1 }]}>
      <View
        style={[
          styles.container,
          isFocused && styles.containerFocused,
          containerStyle,
        ]}
      >
        <View style={styles.selectedValueContainer}>
          {multiSelect ? (
            <ElementMultiSelect
              data={items}
              value={multiValues}
              labelField="label"
              valueField="value"
              placeholder=""
              disable={!!disabled}
              style={styles.dropdown}
              containerStyle={styles.optionsContainer}
              selectedTextStyle={styles.selectedTextStyleHidden as any}
              selectedStyle={{ height: 0, width: 0, opacity: 0 } as any}
              activeColor={colors.brand[50]}
              mode={mode as any}
              dropdownPosition={dropdownPosition as any}
              search={searchable}
              searchPlaceholder={searchPlaceholder}
              searchField={searchField as any}
              flatListProps={
                onLoadMore
                  ? { onEndReached: onLoadMore, onEndReachedThreshold: 0.3 }
                  : undefined
              }
              onFocus={() => {
                setIsFocused(true);
                onOpen?.();
              }}
              onBlur={() => setIsFocused(false)}
              renderSelectedItem={() => <View style={{ height: 0, width: 0 }} />}
              onChange={(next) => {
                const nextValues = normalizeMultiOnChange(next);
                const nextOptions = items
                  .filter((i) => nextValues.includes(i.value))
                  .map((i) => i.original);
                onChange(nextValues, nextOptions);
              }}
              renderItem={(item) => {
                const isSelected = selectedValuesSet.has(item.value);

                return (
                  <View
                    style={[
                      styles.optionItem,
                      isSelected && styles.selectedOptionItem,
                    ]}
                  >
                    <Typography style={styles.optionNameText} numberOfLines={1}>
                      {item.name}
                    </Typography>

                    <View style={styles.rightContainer}>
                      {!!item.username && (
                        <Typography
                          style={styles.usernameText}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {item.username}
                        </Typography>
                      )}

                      {isSelected && (
                        <Ionicons
                          name="checkmark"
                          size={20}
                          color={colors.brand[600]}
                          style={styles.checkIcon}
                        />
                      )}
                    </View>
                  </View>
                );
              }}
              renderRightIcon={() => (
                <Ionicons
                  name={isFocused ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={colors.gray[500]}
                  style={{ marginRight: 12 }}
                />
              )}
            />
          ) : (
            <ElementDropdown
              data={items}
              value={value}
              labelField="label"
              valueField="value"
              placeholder=""
              disable={!!disabled}
              style={styles.dropdown}
              containerStyle={styles.optionsContainer}
              selectedTextStyle={styles.selectedTextStyleHidden}
              activeColor={colors.brand[50]}
              mode={mode as any}
              dropdownPosition={dropdownPosition as any}
              search={searchable}
              searchPlaceholder={searchPlaceholder}
              searchField={searchField}
              flatListProps={
                onLoadMore
                  ? { onEndReached: onLoadMore, onEndReachedThreshold: 0.3 }
                  : undefined
              }
              onFocus={() => {
                setIsFocused(true);
                onOpen?.();
              }}
              onBlur={() => setIsFocused(false)}
              onChange={(item) => onChange(item.value, item.original)}
              renderItem={(item) => {
                const isSelected = item.value === value;

                return (
                  <View
                    style={[
                      styles.optionItem,
                      isSelected && styles.selectedOptionItem,
                    ]}
                  >
                    <Typography style={styles.optionNameText} numberOfLines={1}>
                      {item.name}
                    </Typography>

                    <View style={styles.rightContainer}>
                      {!!item.username && (
                        <Typography
                          style={styles.usernameText}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {item.username}
                        </Typography>
                      )}

                      {isSelected && (
                        <Ionicons
                          name="checkmark"
                          size={20}
                          color={colors.brand[600]}
                          style={styles.checkIcon}
                        />
                      )}
                    </View>
                  </View>
                );
              }}
              renderRightIcon={() => (
                <Ionicons
                  name={isFocused ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={colors.gray[500]}
                  style={{ marginRight: 12 }}
                />
              )}
            />
          )}


          {/* ✅ Custom Selected / Placeholder Display */}
          {multiSelect ? (
            <View style={styles.customSelectedDisplay}>
              {selectedItems.length > 0 ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.chipsScroll}
                >
                  {selectedItems.map((chip) => (
                    <Pressable
                      key={`${chip.value}`}
                      onPress={() => handleRemoveChip(chip.value)}
                      style={styles.chip}
                      hitSlop={6}
                    >
                      <Text style={styles.chipText} numberOfLines={1}>
                        {chip.name}
                      </Text>
                      <Ionicons name="close" size={16} color={colors.gray[400]} />
                    </Pressable>
                  ))}
                </ScrollView>
              ) : (
                <Text style={styles.placeholderStyle}>{placeholder}</Text>
              )}
            </View>
          ) : selectedItem ? (
            <View style={styles.customSelectedDisplay}>
              <Typography
                style={styles.selectedTextStyle}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {selectedItem.name}
              </Typography>

              {!!selectedItem.username && (
                <Typography style={styles.usernameText}>
                  {' '}
                  {selectedItem.username}
                </Typography>
              )}
            </View>
          ) : (
            <View style={styles.customSelectedDisplay}>
              <Text style={styles.placeholderStyle}>{placeholder}</Text>
            </View>
          )}
        </View>
      </View>

      {!!error && <Typography style={styles.error}>{error}</Typography>}
    </View>
  );
};

export default CommonDropdown;
