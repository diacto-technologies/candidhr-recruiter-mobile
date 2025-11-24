// components/filters/FilterOptionItem.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Typography } from '../../atoms';

interface Props {
  label: string;
  count?: number;
  isChecked: boolean;
  onPress: () => void;
}

const FilterOptionItem: React.FC<Props> = ({ label, count, isChecked, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.row}>
      
      {/* Checkbox + Label */}
      <View style={styles.left}>
        <View style={[styles.checkbox, isChecked && styles.checkedBox]} />
        <Typography variant="P2">{label}</Typography>
      </View>

      {/* Count badge */}
      {count !== undefined && (
        <View style={styles.badge}>
          <Typography variant="P3">{count}</Typography>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 4,
  },
  checkedBox: {
    backgroundColor: '#6C4BE7',
    borderColor: '#6C4BE7',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
});

export default FilterOptionItem;
