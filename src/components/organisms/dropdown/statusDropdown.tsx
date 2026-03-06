import React, { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Dropdown as ElementDropdown } from 'react-native-element-dropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Typography from '../../atoms/typography';
import { styles } from './styles';
import { colors } from '../../../theme/colors';
import ChangeStatusModal from '../changeStatusModal';
import type { ChangeStatusModalProps } from '../changeStatusModal';

export interface StatusDropdownProps {
  label: string;
  options: Array<{ id: string; name: string; [key: string]: any }>;
  labelKey?: string;
  valueKey?: string;
  setValue?: string | null;
  onSelect?: (item: any) => void;
  error?: string;
  disableDropdown?: boolean;
  customContainerStyle?: object;
  compact?: boolean;
  /** When true, clicking the field opens ChangeStatusModal instead of the inline dropdown */
  openModalOnClick?: boolean;
  /** When true: click field → dropdown opens; select option → modal opens (dropdown value does NOT change until modal confirms) */
  openModalOnSelect?: boolean;
  /** Props for ChangeStatusModal (applicantName, currentStatus, newStatusOptions, onUpdateStatus) */
  changeStatusModalProps?: Omit<ChangeStatusModalProps, 'visible' | 'onClose'>;
}

/* ---------- STATUS COLOR MAP ---------- */

const STATUS_COLOR_MAP: Record<string, string> = {
  approved: colors.success[500],
  "not approved": colors.error[500],
  rejected: colors.error[500],
  shortlisted: colors.success[500],
  "on hold": colors.warning[500],
  pending: colors.warning[500],
  "approval pending": colors.warning[500],
};

/* ---------- STATUS LABEL MAP ---------- */

const STATUS_LABEL_MAP: Record<string, string> = {
  pending: "Approval Pending",
  under_review: "Approval Pending",
  approved: "Approved",
  not_approved: "Not Approved",
};

/* ---------- HELPERS ---------- */

const normalizeStatus = (value?: string) =>
  value ? value.replace(/_/g, " ").toLowerCase() : "";

const getDotColor = (status?: string) => {
  const normalized = normalizeStatus(status);
  return STATUS_COLOR_MAP[normalized] || colors.gray[500];
};

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
  compact = false,
  openModalOnClick = false,
  openModalOnSelect = false,
  changeStatusModalProps,
}: StatusDropdownProps) => {

  const [value, setValueInternal] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [changeStatusModalVisible, setChangeStatusModalVisible] = useState(false);
  const [pendingSelectedValue, setPendingSelectedValue] = useState<string | null>(null);

  /* ---------- MAP OPTIONS ---------- */

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

  /* ---------- DEFAULT VALUE ---------- */

  useEffect(() => {
    if (setValue !== undefined && setValue !== null) {
      setValueInternal(setValue);
    }
  }, [setValue]);

  const selectedItem = items.find(i => i.value === value);

  /* ---------- DISPLAY LABEL ---------- */

  const displayLabel = selectedItem
    ? selectedItem.name
    : value
      ? STATUS_LABEL_MAP[value] ||
        String(value)
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase())
      : null;

  const dropdownStyle = compact
    ? [styles.dropdown, styles.dropdownCompact]
    : styles.dropdown;

  const containerStyle = compact
    ? [styles.container, styles.containerCompact, isFocused && styles.containerFocused, customContainerStyle]
    : [styles.container, isFocused && styles.containerFocused, customContainerStyle];

  const displayStyle = compact
    ? [styles.customSelectedDisplay, styles.customSelectedDisplayCompact]
    : styles.customSelectedDisplay;

  // When openModalOnClick is true (and not openModalOnSelect), click field → modal only, no dropdown.
  const useModalOnly = Boolean(openModalOnClick && !openModalOnSelect);

  if (useModalOnly) {
    const modalProps = changeStatusModalProps ?? {
      applicantName: undefined,
      currentStatus: value ?? undefined,
      newStatusOptions: items.map((i) => ({ id: i.value, name: i.name })),
      onUpdateStatus: (newStatusId: string) => {
        setValueInternal(newStatusId);
        const orig = items.find((i) => i.value === newStatusId)?.original;
        if (orig) onSelect?.(orig);
      },
    };

    return (
      <View style={[styles.wrapper, compact && styles.wrapperCompact]}>
        <Pressable
          style={containerStyle}
          onPress={() => !disableDropdown && setChangeStatusModalVisible(true)}
          disabled={disableDropdown}
        >
          <View style={styles.selectedValueContainer}>
            <View style={[dropdownStyle, { flexDirection: 'row', alignItems: 'center' }]}>
              <View style={{ marginRight: compact ? 6 : 8 }}>
                <Typography
                  variant={compact ? 'semiBoldTxtsm' : 'semiBoldTxtmd'}
                  color={colors.gray[900]}
                >
                  {label}
                </Typography>
              </View>
            </View>
            {displayLabel ? (
              <View style={displayStyle}>
                <View style={styles.statusBadge}>
                  <View
                    style={[
                      styles.statusDot,
                      compact && styles.statusDotCompact,
                      { backgroundColor: getDotColor(displayLabel) }
                    ]}
                  />
                  <Text
                    style={[
                      styles.selectedTextStyle,
                      compact && styles.selectedTextStyleCompact
                    ]}
                    numberOfLines={1}
                  >
                    {displayLabel}
                  </Text>
                </View>
                <View style={{ flex: 1 }} />
                <Ionicons name="chevron-down" size={20} color={colors.gray[500]} />
              </View>
            ) : (
              <View style={displayStyle}>
                <Text
                  style={[
                    styles.placeholderStyle,
                    compact && styles.placeholderStyleCompact
                  ]}
                  numberOfLines={1}
                >
                  {label}
                </Text>
                <View style={{ flex: 1 }} />
                <Ionicons name="chevron-down" size={20} color={colors.gray[500]} />
              </View>
            )}
          </View>
        </Pressable>
        <ChangeStatusModal
          visible={changeStatusModalVisible}
          onClose={() => setChangeStatusModalVisible(false)}
          {...modalProps}
        />
        {error && <Typography style={styles.error}>{error}</Typography>}
      </View>
    );
  }

  return (
    <View style={[styles.wrapper, compact && styles.wrapperCompact]}>

      <View style={containerStyle}>
        <View style={styles.selectedValueContainer}>

          <ElementDropdown
            data={items}
            value={value}
            labelField="label"
            valueField="value"
            placeholder={""}
            disable={disableDropdown}
            style={dropdownStyle}
            containerStyle={styles.optionsContainer}
            selectedTextStyle={styles.selectedTextStyleHidden}
            placeholderStyle={compact ? styles.placeholderStyleHidden : styles.placeholderStyle}
            activeColor={colors.brand[50]}

            renderItem={(item, selected) => (
              <View style={[styles.optionItem, selected && styles.selectedOptionItem]}>
                <View style={styles.optionTextContainer}>
                  <View style={styles.statusBadge}>

                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: getDotColor(item.name) }
                      ]}
                    />

                    <Typography variant="mediumTxtmd" color={colors.gray[900]}>
                      {item.name}
                    </Typography>

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
              if (openModalOnSelect && changeStatusModalProps) {
                setPendingSelectedValue(item.value);
                setChangeStatusModalVisible(true);
              } else {
                setValueInternal(item.value);
                onSelect?.(item.original);
              }
            }}

            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}

            renderLeftIcon={() => (
              <View style={{ marginRight: compact ? 6 : 8 }}>
                <Typography
                  variant={compact ? 'semiBoldTxtsm' : 'semiBoldTxtmd'}
                  color={colors.gray[900]}
                >
                  {label}
                </Typography>
              </View>
            )}
          />

          {/* ---------- SELECTED VALUE DISPLAY ---------- */}

          {displayLabel ? (
            <View style={displayStyle}>
              <View style={styles.statusBadge}>

                <View
                  style={[
                    styles.statusDot,
                    compact && styles.statusDotCompact,
                    { backgroundColor: getDotColor(displayLabel) }
                  ]}
                />

                <Text
                  style={[
                    styles.selectedTextStyle,
                    compact && styles.selectedTextStyleCompact
                  ]}
                  numberOfLines={1}
                >
                  {displayLabel}
                </Text>

              </View>
            </View>
          ) : (
            <View style={displayStyle}>
              <Text
                style={[
                  styles.placeholderStyle,
                  compact && styles.placeholderStyleCompact
                ]}
                numberOfLines={1}
              >
                {label}
              </Text>
            </View>
          )}

        </View>
      </View>

      {openModalOnSelect && changeStatusModalProps ? (
        <ChangeStatusModal
          visible={changeStatusModalVisible}
          onClose={() => {
            setChangeStatusModalVisible(false);
            setPendingSelectedValue(null);
          }}
          {...changeStatusModalProps}
          initialNewStatusId={pendingSelectedValue}
        />
      ) : null}

      {error && <Typography style={styles.error}>{error}</Typography>}

    </View>
  );
};

export default StatusDropdown;