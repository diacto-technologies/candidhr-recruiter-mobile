import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Typography from '../../atoms/typography';
import { SvgXml } from 'react-native-svg';
import { colors } from '../../../theme/colors';
import { StatCardProps } from './statcard';
import { userIcon } from '../../../assets/svg/usericon';
import { infoIcon } from '../../../assets/svg/infoicon';
import { Shimmer } from '../../atoms';
import { selectAnalyticsLoading } from '../../../features/dashbaord';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useStyles } from './styles';
import InfoTooltip from '../../atoms/Infotooltip';

import Animated, {
  useSharedValue,
  withTiming,
  useDerivedValue,
  runOnJS,
  Easing,
} from 'react-native-reanimated';

const StatCard = ({
  title,
  value,
  percentage,
  subText,
  onPressInfo,
  tooltipText,
}: StatCardProps) => {
  const styles = useStyles();
  const analyticsLoading = useAppSelector(selectAnalyticsLoading);

  // 🔢 Animated value
  const animatedValue = useSharedValue(0);

  // 🖥️ State to display value
  const [displayValue, setDisplayValue] = useState(0);

  // 🚀 Start animation
  useEffect(() => {
    if (!analyticsLoading) {
      animatedValue.value = 0;

      animatedValue.value = withTiming(Number(value) || 0, {
        duration: 1000,
        easing: Easing.out(Easing.exp),
      });
    }
  }, [value, analyticsLoading]);

  // 🔁 Update UI from animated value
  useDerivedValue(() => {
    runOnJS(setDisplayValue)(Math.floor(animatedValue.value));
  });

  return (
    <View style={styles.card}>
      
      {/* 🔹 Header (optional, you commented earlier) */}
      {/* Uncomment if needed */}
      {/* 
      <View style={styles.rowBetween}>
        {analyticsLoading ? (
          <Shimmer style={{ width: 150, height: 24 }} />
        ) : (
          <View style={styles.row}>
            <SvgXml xml={userIcon} />
            <Typography
              variant="regularTxtsm"
              style={styles.title}
              color={colors.gray["600"]}
            >
              {title}
            </Typography>
          </View>
        )}

        <InfoTooltip text={`${tooltipText}`}>
          <SvgXml xml={infoIcon} />
        </InfoTooltip>
      </View> 
      */}

      {/* 🔹 Main Value */}
      <View style={{ gap: 4 }}>
        {analyticsLoading ? (
          <Shimmer
            style={{
              width: 80,
              height: 24,
              borderRadius: 6,
            }}
          />
        ) : (
          <Typography variant="semiBoldDsm">
            {displayValue}
          </Typography>
        )}

        {/* 🔹 Bottom Row */}
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