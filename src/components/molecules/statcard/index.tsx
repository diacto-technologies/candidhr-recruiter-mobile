import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Typography from '../../atoms/typography';
import { colors } from '../../../theme/colors';
import { StatCardProps } from './statcard';
import { Shimmer } from '../../atoms';
import { selectAnalyticsLoading } from '../../../features/dashbaord';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useStyles } from './styles';

import {
  useSharedValue,
  withTiming,
  useDerivedValue,
  runOnJS,
  Easing,
} from 'react-native-reanimated';

function shouldAnimateNumericValue(value: string): boolean {
  const s = String(value ?? '').trim();
  if (s === '' || s === '—') return false;
  if (s.includes('%')) return false;
  const n = Number(s);
  return Number.isFinite(n);
}

/** Hooks only run when this component is mounted (numeric values only). */
const AnimatedNumericStat = ({ value }: { value: string }) => {
  const animatedValue = useSharedValue(0);
  const [displayValue, setDisplayValue] = useState(0);
  const analyticsLoading = useAppSelector(selectAnalyticsLoading);

  useEffect(() => {
    if (!analyticsLoading) {
      animatedValue.value = 0;
      const n = Number(value);
      animatedValue.value = withTiming(Number.isFinite(n) ? n : 0, {
        duration: 1000,
        easing: Easing.out(Easing.exp),
      });
    }
  }, [value, analyticsLoading, animatedValue]);

  useDerivedValue(() => {
    runOnJS(setDisplayValue)(Math.floor(animatedValue.value));
  });

  return (
    <Typography variant="semiBoldDsm">
      {displayValue}
    </Typography>
  );
};

const StatCard = ({
  title,
  value,
  percentage: _percentage,
  subText,
  onPressInfo: _onPressInfo,
  tooltipText: _tooltipText,
}: StatCardProps) => {
  const styles = useStyles();
  const analyticsLoading = useAppSelector(selectAnalyticsLoading);
  const animateNumeric = shouldAnimateNumericValue(value);

  return (
    <View style={styles.card}>
      <View style={{ gap: 4 }}>
        {analyticsLoading ? (
          <Shimmer
            style={{
              width: 80,
              height: 24,
              borderRadius: 6,
            }}
          />
        ) : animateNumeric ? (
          <AnimatedNumericStat value={value} />
        ) : (
          <Typography variant="semiBoldDsm">
            {value}
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

          <Typography variant="regularTxtxs" color={colors.gray['600']}>
            {subText}
          </Typography>
        </View>
      </View>
    </View>
  );
};

export default StatCard;
