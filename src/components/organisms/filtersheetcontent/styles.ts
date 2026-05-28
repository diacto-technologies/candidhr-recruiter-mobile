import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexShrink: 1,
  },
  filterListContainer: {
    marginVertical: 16,
  },
  filterListContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  activeFilterPill: {
    flexDirection: 'row',
    paddingLeft: 12,
    paddingRight: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: colors.gray[50],
    borderWidth: 1,
    borderColor: colors.gray[200],
    alignItems: 'center',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    flexShrink: 1,
  },
  rightContent: {
    flex: 1,
    flexShrink: 1,
  },
  leftTabsContainer: {
    width: 124,
    flexGrow: 0,
    backgroundColor: colors.gray[50],
    gap: 10,
    borderTopRightRadius: 20,
  },
  tabItem: {
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 4,
    position: 'relative'
  },
  firstTabItem: {
    borderTopRightRadius: 20,
  },
  activeTabItem: {
    backgroundColor: '#F5F5F5',
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#6C4BE7',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  footer: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderColor: '#E5E5E5',
    columnGap: 12,
  },
});
