import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Dropdown as ElementDropdown } from 'react-native-element-dropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Typography from '../../atoms/typography';
import { styles } from './styles';
import { colors } from '../../../theme/colors';
import { DropdownProps } from './types';
import { getStatusColor } from '../applicantlist/helper';

const Dropdown = ({
  label,
  options = [],
  labelKey = 'name',
  valueKey = 'id',
  usernameKey = 'username',
  showIndexAndTotal = true,
  dropdownLabel,
  setValue,
  onSelect,
  error,
  disableDropdown,
  customContainerStyle,
  statusKey,
  searchable = false,
  searchPlaceholder = 'Search...',
  searchField = 'name',
  showHelpIcon = false,
  onPressHelpIcon,
}: DropdownProps) => {

  const [value, setValueInternal] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  /* ----- MAP OPTIONS ----- */
  useEffect(() => {
    const mapped = options.map((item, index) => {
      const indexs = index + 1
      const name = item[labelKey] || '';
      const status = statusKey && item[statusKey] ? item[statusKey] : '';
      const username = usernameKey && item[usernameKey] ? `@${item[usernameKey]}` : '';
      const labelText = username ? `${name} ${username}` : name;

      return {
        label: labelText,
        value: item[valueKey],
        original: item,
        name: name,
        username: username,
        indexs: index + 1,
        total: options.length,
        status: status
      };
    });
    setItems(mapped);
  }, [options, labelKey, usernameKey, valueKey]);

  /* ----- DEFAULT VALUE SUPPORT ----- */
  useEffect(() => {
    if (setValue !== undefined && setValue !== null) {
      setValueInternal(setValue);
    }
  }, [setValue]);

  const selectedItem = items.find(i => i.value === value);

  return (
    <View style={styles.wrapper}>
      <View style={[
        styles.container,
        isFocused && styles.containerFocused,
        customContainerStyle
      ]}>
        <View style={styles.selectedValueContainer}>
          <ElementDropdown
            data={items}
            value={value}
            labelField="label"
            valueField="value"
            placeholder={label}
            disable={disableDropdown}
            style={styles.dropdown}
            containerStyle={styles.optionsContainer}
            selectedTextStyle={styles.selectedTextStyleHidden}
            placeholderStyle={styles.placeholderStyle}
            activeColor={colors.brand[50]}

            // ✅ SHOW SEARCH ONLY IF searchable === true
            search={searchable}
            searchPlaceholder={searchPlaceholder}
            searchField={searchField}
            inputSearchStyle={styles.searchInput}
            renderItem={(item, selected) => (
              <View style={[styles.optionItem, selected && styles.selectedOptionItem]}>
                <View style={styles.optionTextContainer}>
                  <Typography style={styles.optionNameText} numberOfLines={1} ellipsizeMode="tail">
                    {item.name}
                  </Typography>

                  {item.status && (
                    <View style={styles.statusBadge}>
                      <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
                      <Typography style={styles.statusText}>{item.status}</Typography>
                    </View>
                  )}

                  {showIndexAndTotal && (
                    <View style={styles.numberBadge}>
                      <Text style={styles.optionNumberText}>#{item.indexs}</Text>
                    </View>
                  )}
                </View>

                {selected && (
                  <Ionicons
                    name="checkmark"
                    size={20}
                    color={colors.brand[600]}
                    style={styles.checkmarkIcon}
                  />
                )}
              </View>
            )}

            onChange={item => {
              setValueInternal(item.value);
              onSelect?.(item.original);
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}

            flatListProps={{ nestedScrollEnabled: true }}



            renderLeftIcon={() => (
              <View style={{ paddingLeft:8}}>
                <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
                  {label}{' '}
                </Typography>
              </View>
            )}
            renderRightIcon={() => (
              <View style={styles.rightIconContainer}>
                {showHelpIcon && (
                  <TouchableOpacity
                    onPress={onPressHelpIcon}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    activeOpacity={0.7}
                    style={styles.helpIconTouch}
                  >
                    <Ionicons
                      name="information-circle-outline"
                      size={18}
                      color={colors.gray[500]}
                    />
                  </TouchableOpacity>
                )}
                <Ionicons
                  name={isFocused ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={colors.gray[500]}
                  style={styles.chevronIcon}
                />
              </View>
            )}
          />
          {selectedItem && (
            <View
              style={[
                styles.customSelectedDisplay,
                showHelpIcon && styles.customSelectedDisplayWithHelp,
              ]}
            >
              <View style={styles.selectedContentRow}>
                <Typography style={styles.selectedItemNameText} numberOfLines={1} ellipsizeMode='tail'>
                  {" "} {selectedItem.name}
                </Typography>
                {showIndexAndTotal && (
                  <Typography style={styles.selectedIndexText} numberOfLines={1}>
                    {` ${selectedItem.indexs}`}
                  </Typography>
                )}
              </View>
              {showIndexAndTotal && (
                <View style={styles.selectedTotalBadge}>
                  <Text style={styles.selectedTotalText}>{selectedItem.total}</Text>
                </View>
              )}
            </View>
          )}
          {!selectedItem && (
            <View
              style={[
                styles.customSelectedDisplay,
                showHelpIcon && styles.customSelectedDisplayWithHelp,
              ]}
            >
              <Text style={styles.placeholderStyle}>{label}</Text>
            </View>
          )}
        </View>
      </View>

      {error && <Typography style={styles.error}>{error}</Typography>}
    </View>
  );
};

export default Dropdown;
