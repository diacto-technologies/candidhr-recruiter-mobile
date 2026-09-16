import React from 'react';
import { View, StyleSheet } from 'react-native';
import Typography from '../../atoms/typography';
import { colors } from '../../../theme/colors';
import { shadowStyles } from '../../../theme/shadowcolor';

interface AppHeaderProps {
  left?: React.ReactNode;
  title?: string | React.ReactNode;
  badgeCount?: number | string;
  right?: React.ReactNode;
  borderCondition?: boolean;
}

const AppHeader = ({ left, title, badgeCount, right, borderCondition = false }: AppHeaderProps) => {
  return (
    <View style={[styles.container, { borderBottomWidth: !borderCondition ? 1 : 0 }]}>
      <View style={styles.leftSlot}>
        {left}
        {typeof title === 'string' ? (
          <View style={styles.titleContainer}>
            <View style={styles.titleRow}>
              <Typography variant="semiBoldTxtxl" numberOfLines={1} style={styles.titleText}>
                {title}
              </Typography>
              {badgeCount !== undefined && badgeCount !== null && (
                <View style={styles.badge}>
                  <Typography variant="mediumTxtxs" color={colors.gray[700]}>
                    {typeof badgeCount === 'number' ? badgeCount.toLocaleString() : badgeCount}
                  </Typography>
                </View>
              )}
            </View>
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleText: {
    flexShrink: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
    backgroundColor: colors.gray[50],
    borderWidth: 1.5,
    borderColor: colors.gray[200],
  },
  rightSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 12,
  },
});

export default AppHeader;
