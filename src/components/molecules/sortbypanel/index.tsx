import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Typography from '../../atoms/typography';
import Icon from '../../atoms/vectoricon';
import { colors } from '../../../theme/colors';

interface SortOption {
  label: string;
  sortBy: string;
  sortDir: 'asc' | 'desc';
}

interface SortByPanelProps {
  options: SortOption[];
  currentSortBy?: string;
  currentSortDir?: 'asc' | 'desc';
  defaultLabel?: string;
  onSortChange: (sortBy: string, sortDir: 'asc' | 'desc') => void;
}

const SortByPanel: React.FC<SortByPanelProps> = ({
  options,
  currentSortBy,
  currentSortDir = 'desc',
  defaultLabel = 'Applied On: New → Old',
  onSortChange,
}) => {
  const [sortExpanded, setSortExpanded] = useState(false);

  const selectedOption = options.find(
    (o) => o.sortBy === currentSortBy && currentSortDir === o.sortDir
  );

  return (
    <View style={styles.sortByBlock}>
      <TouchableOpacity
        style={styles.sortByHeader}
        onPress={() => setSortExpanded((e) => !e)}
        activeOpacity={0.7}
      >
        <View style={styles.sortBySummaryWrap}>
          <Typography variant="P1M" color={colors.gray[700]}>
            Sort by
          </Typography>
          <Typography
            variant="P1M"
            color={colors.gray[800]}
            numberOfLines={1}
            style={styles.sortByLabel}
          >
            {selectedOption?.label ?? defaultLabel}
          </Typography>
        </View>
        <Icon
          name={sortExpanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={colors.gray[600]}
          iconFamily="Feather"
        />
      </TouchableOpacity>

      {sortExpanded && (
        <View style={styles.sortByExpanded}>
          <Typography variant="P1M" color={colors.gray[700]} style={styles.sortBySectionTitle}>
            Sort By
          </Typography>
          {options.map((option) => {
            const isSelected =
              currentSortBy === option.sortBy && currentSortDir === option.sortDir;

            return (
              <TouchableOpacity
                key={`${option.sortBy}-${option.sortDir}`}
                onPress={() => onSortChange(option.sortBy, option.sortDir)}
                style={[styles.radioRow, isSelected && styles.radioRowSelected]}
                activeOpacity={0.7}
              >
                {/* Text */}
                <View style={{ flex: 1, paddingRight: 10 }}>
                  <Typography
                    variant="P1M"
                    color={colors.gray[800]}>
                    {option.label}
                  </Typography>
                </View>

                {/* Radio */}
                <View style={styles.radioOuter}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sortByBlock: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  sortByHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray[200],
    backgroundColor: colors.common.white,
  },
  sortBySummaryWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 0,
  },
  sortByLabel: {
    flexShrink: 1,
  },
  sortByExpanded: {
    marginTop: 16,
    gap: 4,
  },
  sortBySectionTitle: {
    marginTop: 12,
    marginBottom: 8,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray[200],
    backgroundColor: colors.common.white,
    marginBottom: 4,
  },
  radioRowSelected: {
    borderColor: colors.brand[400],
    backgroundColor: colors.brand[50],
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.gray[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: colors.brand[500],
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.brand[500],
  },
});

export default SortByPanel;
