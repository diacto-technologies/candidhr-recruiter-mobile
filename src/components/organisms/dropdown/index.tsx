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
}: DropdownProps) => {

  const [value, setValueInternal] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  /* ----- MAP OPTIONS ----- */
  useEffect(() => {
    const mapped = options.map((item,index) => {
      const indexs=index+1
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
        status:status
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

            renderItem={(item, selected) => (
            <View style={[styles.optionItem, selected && styles.selectedOptionItem]}>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionNameText} numberOfLines={1} ellipsizeMode="tail">
                  {item.name}
                </Text>
                {item.status && ( <View style={styles.statusBadge}> <View style={[styles.statusDot,{ backgroundColor: getStatusColor(item.status) }]} /> <Typography style={styles.statusText}>{item.status}</Typography> </View> )}
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

          flatListProps={{ nestedScrollEnabled: true }}

          onChange={item => {
            setValueInternal(item.value);
            onSelect?.(item.original);
          }}

          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}

          renderLeftIcon={() => (
            <View style={{ marginRight: 8 }}>
              <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>{label} </Typography>
            </View>
          )}
        />
        {selectedItem && (
          <View style={styles.customSelectedDisplay}>
            <Text style={styles.selectedTextStyle} numberOfLines={1}>
             {" "} {selectedItem.name}{showIndexAndTotal ? ` ${selectedItem.indexs}` : ''}
            </Text>
            {showIndexAndTotal && (
              <View style={styles.selectedTotalBadge}>
                <Text style={styles.selectedTotalText}>{selectedItem.total}</Text>
              </View>
            )}
          </View>
        )}
        {!selectedItem && (
          <View style={styles.customSelectedDisplay}>
            {/* <Text style={styles.placeholderStyle}>{label}</Text> */}
          </View>
        )}
        </View>
      </View>

      {error && <Typography style={styles.error}>{error}</Typography>}
    </View>
  );
};

export default Dropdown;
