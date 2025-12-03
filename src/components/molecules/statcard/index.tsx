import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Typography from '../../atoms/typography';
import { SvgXml } from 'react-native-svg';
import { colors } from '../../../theme/colors';
import { StatCardProps } from './statcard';
import { userIcon } from '../../../assets/svg/usericon';
import { infoIcon } from '../../../assets/svg/infoicon';
import { arrowDownGreenIcon } from '../../../assets/svg/arrowdown';


const StatCard = ({ title, value, percentage, subText, onPressInfo }: StatCardProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <View style={styles.row}>
          <SvgXml xml={userIcon} />
          <Typography variant="regularTxtsm" style={styles.title} color={colors.gray['600']}>
            {title}
          </Typography>
        </View>

        <Pressable onPress={onPressInfo}>
          <SvgXml xml={infoIcon} />
        </Pressable>
      </View>

      {/* Main Value */}
      <View style={{gap:4}}>
      <Typography variant="semiBoldDsm">
        {value}
      </Typography>

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

const styles = StyleSheet.create({
  card: {
    flex: 1,
    width: '100%',
    height:140,
    backgroundColor: colors.base.white,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray['200'],
    shadowColor: 'rgba(10, 13, 18, 0.3)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    marginLeft: 8,
  },
  percent: {
    marginLeft: 6,
  },
  subText: {
    marginLeft: 6,
  },
});
