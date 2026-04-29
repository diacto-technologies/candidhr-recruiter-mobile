import React, { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  Dropdown as ElementDropdown,
  MultiSelect as ElementMultiSelect,
} from 'react-native-element-dropdown';

import Typography from '../../atoms/typography';
import { colors } from '../../../theme/colors';
import { styles } from './styles';
import type { CommonDropdownOption, CommonDropdownProps } from './types';

/** Sentinel `value` for the synthetic “Select all” row (never passed to parent `onChange`). */
export const COMMON_DROPDOWN_SELECT_ALL_VALUE = '__COMMON_DROPDOWN_SELECT_ALL__';

/** When label (name/title/etc.) is missing, show masked id: `****` + last 4 chars of value. */
export function formatDropdownLabelWhenMissing(
  rawLabel: unknown,
  valueId: unknown
): string {
  const trimmed =
    rawLabel != null && String(rawLabel).trim() !== ''
      ? String(rawLabel).trim()
      : '';
  if (trimmed !== '') {
    return trimmed;
  }
  const idStr = valueId != null ? String(valueId) : '';
  if (idStr === '') {
    return '—';
  }
  const tail = idStr.length <= 4 ? idStr : idStr.slice(-4);
  return `****${tail}`;
}

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
  highlightError,
  containerStyle,
  searchable = false,
  searchPlaceholder = 'Search...',
  searchField = 'name',
  mode = 'default',
  dropdownPosition = 'bottom',
  multiSelect = false,
  onLoadMore,
  subLabelBuilder,
  multiSelectCheckbox = false,
  multiSelectSummary = false,
  showSelectAllOption = false,
  selectAllOptionLabel = 'Select all applicants',
}: CommonDropdownProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const showInvalidVisual = !!error || !!highlightError;

  const items = useMemo(() => {
    const mapped = (options ?? []).map((item) => {
      const rawLabel = item?.[labelKey];
      const valueId = item?.[valueKey];
      const display = formatDropdownLabelWhenMissing(rawLabel, valueId);
      const subLine =
        typeof subLabelBuilder === 'function'
          ? (() => {
              const s = subLabelBuilder(item);
              return s != null && String(s).trim() !== '' ? String(s).trim() : '';
            })()
          : '';
      const labelForSearch = subLine
        ? `${display} ${subLine}`.replace(/\s+/g, ' ').trim()
        : display;
      return {
        label: labelForSearch,
        value: valueId,
        name: display,
        subLine,
        username:
          subLine || subLabelBuilder
            ? ''
            : item?.[usernameKey]
              ? `@${item[usernameKey]}`
              : '',
        original: item,
        isSelectAllRow: false,
      };
    });

    if (multiSelect && showSelectAllOption && mapped.length > 0) {
      return [
        {
          label: selectAllOptionLabel,
          value: COMMON_DROPDOWN_SELECT_ALL_VALUE,
          name: selectAllOptionLabel,
          subLine: '',
          username: '',
          original: {} as CommonDropdownOption,
          isSelectAllRow: true,
        },
        ...mapped,
      ];
    }
    return mapped;
  }, [
    options,
    labelKey,
    valueKey,
    usernameKey,
    subLabelBuilder,
    multiSelect,
    showSelectAllOption,
    selectAllOptionLabel,
  ]);

  const multiValues = useMemo(() => {
    if (!multiSelect) return [];
    return Array.isArray(value) ? value : value != null && value !== '' ? [value] : [];
  }, [multiSelect, value]);

  const selectedItem = !multiSelect ? items.find((i) => i.value === value) : undefined;
  const selectedItems = useMemo(() => {
    if (!multiSelect) return [];
    const set = new Set(multiValues);
    return items.filter(
      (i) => set.has(i.value) && !i.isSelectAllRow
    );
  }, [items, multiSelect, multiValues]);

  const dataRows = useMemo(() => items.filter((i) => !i.isSelectAllRow), [items]);

  const allDataIds = useMemo(
    () => dataRows.map((r) => r.value).filter((v) => v !== undefined && v !== null),
    [dataRows]
  );

  const allApplicantsSelected = useMemo(() => {
    if (allDataIds.length === 0) return false;
    return allDataIds.every((id) => multiValues.includes(id));
  }, [allDataIds, multiValues]);

  const selectedValuesSet = useMemo(() => new Set(multiValues), [multiValues]);

  const handleRemoveChip = (chipValue: any) => {
    if (!multiSelect) return;
    const nextValues = multiValues.filter((v) => v !== chipValue);
    const nextOptions = items
      .filter(
        (i) => nextValues.includes(i.value) && !i.isSelectAllRow
      )
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

  type ListRow = (typeof items)[number];

  const renderOptionRow = (item: ListRow, rowSelected: boolean) => {
    const stacked = Boolean(item.subLine);
    const useCheckbox = !!(multiSelect && multiSelectCheckbox);
    const centerBlock = stacked ? (
          <View style={styles.optionPrimaryColumn}>
            <Typography
              variant="semiBoldTxtsm"
              color={colors.gray[900]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.name}
            </Typography>
            <Typography
              variant="regularTxtsm"
              color={colors.gray[600]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {item.subLine}
            </Typography>
          </View>
        ) : (
          <Typography style={styles.optionNameText} numberOfLines={1}>
            {item.name}
          </Typography>
        );

    return (
      <View
        style={[
          styles.optionItem,
          stacked && useCheckbox ? styles.optionItemAlignedTop : null,
          rowSelected && styles.selectedOptionItem,
        ]}
      >
        {useCheckbox ? (
          <View
            style={[
              styles.checkboxOuter,
              rowSelected && styles.checkboxOuterChecked,
            ]}
          >
            {rowSelected ? (
              <Ionicons
                name="checkmark"
                size={14}
                color={colors.base.white}
              />
            ) : null}
          </View>
        ) : null}

        <View style={styles.optionMiddle}>{centerBlock}</View>

        <View style={styles.rightContainer}>
          {!stacked && !!item.username ? (
            <Typography
              style={styles.usernameText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.username}
            </Typography>
          ) : null}

          {!useCheckbox && rowSelected ? (
            <Ionicons
              name="checkmark"
              size={20}
              color={colors.brand[600]}
              style={styles.checkIcon}
            />
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.wrapper, { zIndex: isFocused ? 999 : 1 }]}>
      <View
        style={[
          styles.container,
          disabled && styles.containerDisabled,
          isFocused && !showInvalidVisual && styles.containerFocused,
          showInvalidVisual && styles.containerError,
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
                const raw = normalizeMultiOnChange(next);
                if (
                  multiSelect &&
                  showSelectAllOption &&
                  raw.includes(COMMON_DROPDOWN_SELECT_ALL_VALUE)
                ) {
                  if (allApplicantsSelected) {
                    onChange([], []);
                  } else {
                    onChange([...allDataIds], dataRows.map((r) => r.original));
                  }
                  return;
                }

                const nextValues = raw.filter(
                  (v: unknown) => v !== COMMON_DROPDOWN_SELECT_ALL_VALUE,
                );

                const nextOptions = items
                  .filter(
                    (i) =>
                      nextValues.includes(i.value) && !i.isSelectAllRow,
                  )
                  .map((i) => i.original);
                onChange(nextValues, nextOptions);
              }}
              renderItem={(item: ListRow) =>
                renderOptionRow(
                  item,
                  item.isSelectAllRow
                    ? allApplicantsSelected
                    : selectedValuesSet.has(item.value),
                )
              }
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
              renderItem={(item) => renderOptionRow(item, item.value === value)}
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
              {multiSelectSummary ? (
                selectedItems.length > 0 ? (
                  <Typography
                    variant="semiBoldTxtsm"
                    color={colors.gray[900]}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={{ flexShrink: 1 }}
                  >
                    {selectedItems.map((c) => c.name).join(', ')}
                  </Typography>
                ) : (
                  <Text style={styles.placeholderStyle}>{placeholder}</Text>
                )
              ) : selectedItems.length > 0 ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.chipsScroll}
                >
                  {selectedItems.map((chip) => {
                    const orig = chip.original as CommonDropdownOption | undefined;
                    const avatarUri =
                      orig?.profile_pic != null && String(orig.profile_pic).trim() !== ''
                        ? String(orig.profile_pic)
                        : orig?.avatar != null && String(orig.avatar).trim() !== ''
                          ? String(orig.avatar)
                          : null;
                    return (
                      <Pressable
                        key={`${chip.value}`}
                        onPress={() => handleRemoveChip(chip.value)}
                        style={styles.chip}
                        hitSlop={6}
                      >
                        {avatarUri ? (
                          <Image
                            source={{ uri: avatarUri }}
                            style={styles.chipAvatar}
                          />
                        ) : (
                          <View style={styles.chipAvatarFallback}>
                            <Ionicons name="person" size={12} color={colors.gray[500]} />
                          </View>
                        )}
                        <Text style={styles.chipText} numberOfLines={1}>
                          {chip.name}
                        </Text>
                        {!disabled &&
                          <Ionicons name="close" size={16} color={colors.gray[400]} />
                        }
                      </Pressable>
                    );
                  })}
                </ScrollView>
              ) : (
                <Text style={styles.placeholderStyle}>{placeholder}</Text>
              )}
            </View>
          ) : selectedItem ? (
            <View style={styles.customSelectedDisplay}>
              {selectedItem.subLine ? (
                <View style={styles.selectedValueStacked}>
                  <Typography
                    variant="semiBoldTxtsm"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    color={colors.gray[900]}
                  >
                    {selectedItem.name}
                  </Typography>
                  <Typography
                    variant="regularTxtsm"
                    color={colors.gray[600]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {selectedItem.subLine}
                  </Typography>
                </View>
              ) : (
                <>
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
                </>
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
