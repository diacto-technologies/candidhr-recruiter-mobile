import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Typography from '../../atoms/typography';
import { colors } from '../../../theme/colors';
import { StatCardProps } from './statcard';
import { Shimmer } from '../../atoms';
import { useStyles } from './styles';
import { formatCompactNumber } from '../../../utils/formatCompactNumber';

import {
  useSharedValue,
  withTiming,
  useDerivedValue,
  runOnJS,
  Easing,
} from 'react-native-reanimated';

/**
 * Decide whether to animate value or not
 */
function shouldAnimateNumericValue(value: string): boolean {
  const s = String(value ?? '').trim();
  if (s === '' || s === '—') return false;
  if (s.includes('%')) return false;

  const normalized = s.replace(/,/g, '');
  const n = Number(normalized);

  return Number.isFinite(n);
}

/**
 * Animated Numeric Component (supports decimals ✅)
 */
const AnimatedNumericStat = ({
  value,
  isCompact = false,
}: {
  value: string;
  isCompact?: boolean;
}) => {
  const animatedValue = useSharedValue(0);
  const [displayValue, setDisplayValue] = useState('0');

  // detect decimal places from original value
  const getDecimalPlaces = (val: string) => {
    const normalized = val.replace(/,/g, '');
    if (!normalized.includes('.')) return 0;
    return normalized.split('.')[1].length;
  };

  const decimalPlaces = getDecimalPlaces(value);

  useEffect(() => {
    animatedValue.value = 0;

    const normalized = value.replace(/,/g, '');
    const n = Number(normalized);

    animatedValue.value = withTiming(Number.isFinite(n) ? n : 0, {
      duration: 1000,
      easing: Easing.out(Easing.exp),
    });
  }, [value, animatedValue]);

  const updateDisplayValue = (val: number) => {
    let formatted = '';

    if (isCompact) {
      formatted = formatCompactNumber(val);
    } else if (decimalPlaces > 0) {
      formatted = val.toFixed(decimalPlaces);
    } else {
      formatted = Math.floor(val).toString();
    }

    setDisplayValue(formatted);
  };

  useDerivedValue(() => {
    // Note: Calling runOnJS triggers a React state update during animation. 
    // For high performance, consider moving this formatting to a worklet 
    // and using Animated.TextInput with useAnimatedProps.
    runOnJS(updateDisplayValue)(animatedValue.value);
  });

  return (
    <Typography variant="semiBoldDsm">
      {displayValue}
    </Typography>
  );
};

/**
 * Main Stat Card Component
 */
function formatStatDisplayValue(value: string, isCompact: boolean): string {
  if (!isCompact) return value;
  const n = Number(String(value).replace(/,/g, ''));
  if (!Number.isFinite(n)) return value;
  return formatCompactNumber(n);
}

const StatCard = ({
  title,
  value,
  subText,
  isCompact = false,
  loading = false,
}: StatCardProps) => {
  const styles = useStyles();
  const animateNumeric = shouldAnimateNumericValue(value);

  return (
    <View style={styles.card}>
      <View style={{ gap: 4 }}>
        {loading ? (
          <Shimmer
            style={{
              width: 80,
              height: 24,
              borderRadius: 6,
            }}
          />
        ) : animateNumeric ? (
          <AnimatedNumericStat value={value} isCompact={isCompact} />
        ) : (
          <Typography variant="semiBoldDsm">
            {formatStatDisplayValue(value, isCompact)}
          </Typography>
        )}

        <View style={styles.row}>
          <Typography
            variant="regularTxtsm"
            style={styles.title}
            color={colors.gray['600']}
            numberOfLines={2}
          >
            {title}
          </Typography>

          {!!subText && (
            <Typography variant="regularTxtxs" color={colors.gray['600']}>
              {subText}
            </Typography>
          )}
        </View>
      </View>
    </View>
  );
};

export default StatCard;