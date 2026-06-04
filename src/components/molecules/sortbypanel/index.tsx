import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Typography from '../../atoms/typography';
import Icon from '../../atoms/vectoricon';
import { colors } from '../../../theme/colors';
import { SortByPanelProps } from './sortbypanel.d';
import { useStyles } from './styles';

const SortByPanel: React.FC<SortByPanelProps> = ({
  options,
  currentSortBy,
  currentSortDir = 'desc',
  defaultLabel = 'Applied On: New → Old',
  onSortChange,
}) => {
  const [sortExpanded, setSortExpanded] = useState(false);
  const styles = useStyles();

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
                <View style={styles.radioTextWrap}>
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

export default SortByPanel;

