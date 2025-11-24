import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Typography from '../../atoms/typography';
import { SvgXml } from 'react-native-svg';
import { colors } from '../../../theme/colors';
import { StatCardProps } from './statcard';
import { userIcon } from '../../../assets/svg/usericon';
import { infoIcon } from '../../../assets/svg/infoicon';
import { arrowDownGreenIcon } from '../../../assets/svg/arrowdown';
// import { arrowDownGreenIcon } from '../../assets/svg/arrowdown';
// import { infoIcon } from '../../assets/svg/infoicon';
// import { userIcon } from '../../assets/svg/usericon';


const StatCard = ({ title, value, percentage, subText, onPressInfo }: StatCardProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <View style={styles.row}>
          <SvgXml xml={userIcon}/>
          <Typography variant="P1" style={styles.title} color={colors.grayScale.darkGray}>
            {title}
          </Typography>
        </View>

        <Pressable onPress={onPressInfo}>
          <SvgXml xml={infoIcon} />
        </Pressable>
      </View>

      {/* Main Value */}
      <Typography variant="H1XL" style={styles.value} color={colors.mainColors.blueGrayTitle}>
        {value}
      </Typography>

      {/* Percentage Row */}
      <View style={styles.row}>
        <SvgXml xml={arrowDownGreenIcon}  />
        <Typography variant="T2" style={styles.percent} color={colors.mainColors.emeraldGreen}>
          {percentage}
        </Typography>

        <Typography variant="P1" style={styles.subText} color={colors.grayScale.darkGray}>
          {subText}
        </Typography>
      </View>

    </View>
  );
};

export default StatCard;

const styles = StyleSheet.create({
  card: {
    flex:1,
    width: '100%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius:12,
    borderWidth: 1,
    borderColor: colors.mainColors.borderColor,
    shadowColor: 'rgba(10, 13, 18, 0.05)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    gap:16,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    marginLeft: 8,
  },

  value: {
    color: colors.grayScale.black,
  },

  percent: {
    marginLeft: 6,
  },

  subText: {
    marginLeft: 6,
  },
});
