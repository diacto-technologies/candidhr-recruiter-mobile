import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Dropdown as ElementDropdown } from 'react-native-element-dropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Typography from '../../atoms/typography';
import { styles } from './styles';
import { colors } from '../../../theme/colors';
import { getStatusColor } from '../applicantlist/helper';

export interface StatusDropdownProps {
  label: string;
  options: Array<{ id: string; name: string; [key: string]: any }>;
  labelKey?: string;
  valueKey?: string;
  setValue?: string;
  onSelect?: (item: any) => void;
  error?: string;
  disableDropdown?: boolean;
  customContainerStyle?: object;
}

const StatusDropdown = ({
  label,
  options = [],
  labelKey = 'name',
  valueKey = 'id',
  setValue,
  onSelect,
  error,
  disableDropdown,
  customContainerStyle,
}: StatusDropdownProps) => {

  const [value, setValueInternal] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  /* ----- MAP OPTIONS ----- */
  useEffect(() => {
    const mapped = options.map((item) => {
      const name = item[labelKey] || '';

      return {
        label: name,
        value: item[valueKey],
        original: item,
        name: name,
      };
    });
    setItems(mapped);
  }, [options, labelKey, valueKey]);

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
                  <View style={styles.statusBadge}>
                    <View style={[
                      styles.statusDot,
                      { backgroundColor: getStatusColor(item.name) || colors.gray[500] }
                    ]} />
                    <Typography variant="mediumTxtmd" color={colors.gray[900]}>{item.name}</Typography>
                  </View>
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
              <View style={styles.statusBadge}>
                <View style={[
                  styles.statusDot,
                  { backgroundColor: getStatusColor(selectedItem.name) || colors.gray[500] }
                ]} />
                <Text style={styles.selectedTextStyle} numberOfLines={1}>
                  {selectedItem.name}
                </Text>
              </View>
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

export default StatusDropdown;
