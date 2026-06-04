import React from 'react';
import { View, StyleSheet } from 'react-native';
import Typography from '../../atoms/typography';
import { colors } from '../../../theme/colors';
import { shadowStyles } from '../../../theme/shadowcolor';

interface AppHeaderProps {
  left?: React.ReactNode;
  title?: string | React.ReactNode;
  right?: React.ReactNode;
  borderCondition?: boolean;
}

const AppHeader = ({ left, title, right, borderCondition = false }: AppHeaderProps) => {
  return (
    <View style={[styles.container, { borderBottomWidth: !borderCondition ? 1 : 0 }]}>
      <View style={styles.leftSlot}>
        {left}
        {typeof title === 'string' ? (
          <View style={styles.titleContainer}>
            <Typography variant="semiBoldTxtxl" numberOfLines={1}>
              {title}
            </Typography>
          </View>
        ) : (
          <View style={styles.titleContainer}>{title}</View>
        )}
      </View>

      <View style={styles.rightSlot}>{right}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.base.white,
    paddingHorizontal: 16,
    borderBottomColor: colors.gray['200'],
     ...shadowStyles.shadow_xs
  },
  leftSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  titleContainer: {
    marginLeft: 12,
    flex: 1,
  },
  rightSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 12,
  },
});

export default AppHeader;
