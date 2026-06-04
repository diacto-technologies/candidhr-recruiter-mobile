// components/filters/FilterOptionItem.tsx
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Typography } from '../../atoms';
import { FilterOptionItemProps } from './filteroptionitem.d';
import { useStyles } from './styles';

const FilterOptionItem: React.FC<FilterOptionItemProps> = ({ label, count, isChecked, onPress }) => {
  const styles = useStyles();

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

export default FilterOptionItem;

