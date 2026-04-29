import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors } from '../../../theme/colors';

const ACCENT = colors.brand[600];

type PickerModalFooterProps = {
  onCancel: () => void;
  onApply: () => void;
  applyDisabled?: boolean;
  /** e.g. keypad icon — rendered to the left of Cancel / Apply */
  leftAccessory?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * Shared Cancel / Apply row used by {@link DateRangePicker} and time pickers
 * so modal actions stay visually consistent.
 */
export function PickerModalFooter({
  onCancel,
  onApply,
  applyDisabled = false,
  leftAccessory,
  style,
}: PickerModalFooterProps) {
  return (
    <View style={[styles.footer, style]}>
      {leftAccessory != null ? (
        <View style={styles.leftSlot}>{leftAccessory}</View>
      ) : null}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.cancel} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.apply, applyDisabled && styles.applyDisabled]}
          disabled={applyDisabled}
          onPress={onApply}
        >
          <Text style={styles.applyText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    marginTop: 14,
    alignItems: 'center',
    columnGap: 10,
  },
  leftSlot: {
    paddingVertical: 4,
  },
  actions: {
    flex: 1,
    flexDirection: 'row',
    columnGap: 10,
  },
  cancel: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.gray[200],
    padding: 12,
    alignItems: 'center',
  },
  cancelText: { color: colors.gray[800], fontWeight: '500' },
  apply: {
    flex: 1,
    backgroundColor: ACCENT,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  applyDisabled: { opacity: 0.5 },
  applyText: { color: 'white', fontWeight: '600' },
});
