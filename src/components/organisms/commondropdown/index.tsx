import React, { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Dropdown as ElementDropdown } from 'react-native-element-dropdown';

import Typography from '../../atoms/typography';
import { colors } from '../../../theme/colors';
import { styles } from './styles';
import type { CommonDropdownProps } from './types';

const CommonDropdown = ({
  placeholder,
  options,
  value,
  onChange,
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

  const selectedItem = items.find((i) => i.value === value);

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
            onFocus={() => setIsFocused(true)}
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
                      <Typography style={styles.usernameText}>
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

            /* 🔥 RIGHT SIDE ARROW */
            renderRightIcon={() => (
              <Ionicons
                name={isFocused ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={colors.gray[500]}
                style={{ marginRight: 12 }}
              />
            )}
          />


          {/* ✅ Custom Selected / Placeholder Display */}
          {selectedItem ? (
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
