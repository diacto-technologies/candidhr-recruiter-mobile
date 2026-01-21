import React from 'react';
import { View, Pressable } from 'react-native';
import Typography from '../../atoms/typography';
import { SvgXml } from 'react-native-svg';
import { colors } from '../../../theme/colors';
import { StatCardProps } from './statcard';
import { userIcon } from '../../../assets/svg/usericon';
import { infoIcon } from '../../../assets/svg/infoicon';
import { arrowDownGreenIcon } from '../../../assets/svg/arrowdown';
import { Shimmer } from '../../atoms';
import { selectAnalyticsLoading } from '../../../features/dashbaord';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useStyles } from './styles';
import InfoTooltip from '../../atoms/Infotooltip';


const StatCard = ({ title, value, percentage, subText, onPressInfo,tooltipText }: StatCardProps) => {
  const styles = useStyles();
  const analyticsLoading = useAppSelector(selectAnalyticsLoading)
  return (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        {analyticsLoading ? (
          <Shimmer style={{ width: 150, height: 24 }} />
        ) : (
          <View style={styles.row}>
            <SvgXml xml={userIcon} />
            <Typography variant="regularTxtsm" style={styles.title} color={colors.gray["600"]}>
              {title}
            </Typography>
          </View>
        )}

        <InfoTooltip text={`${tooltipText}`}>
          <SvgXml xml={infoIcon} />
        </InfoTooltip>
      </View>

      {/* Main Value */}
      <View style={{ gap: 4 }}>
        {analyticsLoading ? (
          <Shimmer style={{
            width: 80,
            height: 24,
            borderRadius: 6,
          }} />
        ) : (
          <Typography variant="semiBoldDsm">
            {String(value)}
          </Typography>
        )}
        {/* Percentage Row */}
        <View style={styles.row}>
          <SvgXml xml={arrowDownGreenIcon} />
          <Typography variant="semiBoldTxtxs" color={colors.success['500']}>
            {percentage}
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
