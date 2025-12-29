import React, { forwardRef, useEffect, useState } from 'react';
import { View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Typography from '../../atoms/typography';
import { styles } from './styles';
import { colors } from '../../../theme/colors';
import { DropdownProps } from './types';
import { SvgXml } from 'react-native-svg';
import { arrowDown } from '../../../assets/svg/arrowdown';

const Dropdown = forwardRef<any, DropdownProps>(
  (
    {
      label,
      options = [],
      labelKey = 'name',
      valueKey = 'id',
      onSelect,
      error,
      disableDropdown,
      dropdownLabel,
      setValue,
      customContainerStyle,
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const [value, setValueInternal] = useState<any>(null);
    const [items, setItems] = useState<any[]>([]);

    /* ---------------- set default value ---------------- */
    useEffect(() => {
      if (setValue !== undefined && setValue !== null) {
        setValueInternal(setValue);
      }
    }, [setValue]);

    /* ---------------- map options ---------------- */
    useEffect(() => {
      const mapped = options.map(item => ({
        label: `${item[labelKey]}`,
        value: item[valueKey],
        original: item,
      }));
      setItems(mapped);
    }, [options, labelKey, valueKey]);

    return (
      <View style={[styles.container, customContainerStyle]}>
        <View style={styles.row}>
          {/* {dropdownLabel && (
              <Typography style={styles.dropdownLabelStyle}>
                {dropdownLabel}:
              </Typography>
            )} */}

          <View style={styles.pickerWrapper}>
            <DropDownPicker
              ref={ref}
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValueInternal}
              setItems={setItems}
              disabled={disableDropdown}
              placeholder={label}

              listMode="SCROLLVIEW"
              scrollViewProps={{ nestedScrollEnabled: true }}

              style={styles.dropdown}
              dropDownContainerStyle={[
                styles.optionsContainer,
                {
                  elevation: 10,
                  zIndex: 1000,
                },
              ]}

              ArrowDownIconComponent={() => <SvgXml xml={arrowDown} />}
              ArrowUpIconComponent={() => (
                <Ionicons name="chevron-up" size={15} color={colors.gray[400]} />
              )}

              onChangeValue={(val) => {
                const selectedItem = items.find(i => i.value === val);
                if (selectedItem) {
                  onSelect?.(selectedItem.original);
                }
              }}
            />

          </View>
        </View>

        {error && <Typography style={styles.error}>{error}</Typography>}
      </View>
    );
  }
);

export default Dropdown;
