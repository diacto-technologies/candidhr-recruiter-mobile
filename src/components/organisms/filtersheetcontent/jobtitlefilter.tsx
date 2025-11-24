// components/filters/tabs/JobTitleFilter.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Typography from '../../atoms/typography';

const jobTitles = [
  { label: 'Hybrid', count: 23 },
  { label: 'Work from office', count: 3 },
  { label: 'Remote', count: 12 },
];

const JobTitleFilter = () => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (label: string) => {
    setSelected((prev) =>
      prev.includes(label)
        ? prev.filter((i) => i !== label)
        : [...prev, label]
    );
  };

  return (
    <>
      {jobTitles.map((item) => {
        const isChecked = selected.includes(item.label);

        return (
          <TouchableOpacity
            key={item.label}
            style={styles.row}
            onPress={() => toggle(item.label)}
          >
            {/* Checkbox + Label */}
            <View style={styles.left}>
              <View style={[styles.checkbox, isChecked && styles.checked]}>
                {isChecked && (
                  <Icon name="check" size={16} color="#FFFFFF" />
                )}
              </View>

              <Typography variant="P2">{item.label}</Typography>
            </View>

            {/* Count badge */}
            <View style={styles.badge}>
              <Typography variant="P3">{item.count}</Typography>
            </View>
          </TouchableOpacity>
        );
      })}
    </>
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
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: '#6C4BE7',
    borderColor: '#6C4BE7',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
});

export default JobTitleFilter;
