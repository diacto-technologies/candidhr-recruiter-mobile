import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { Fonts } from '../../../theme/fonts';
import { shadowStyles } from '../../../theme/shadowcolor';

export const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },

  container: {
    width: '100%',
    backgroundColor: colors.common.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray[300],
    ...shadowStyles.shadow_xs,
  },

  containerDisabled: {
    backgroundColor: colors.gray[100],
  },

  containerFocused: {
    borderColor: colors.brand[600],
    borderWidth: 2,
  },

  containerError: {
    borderColor: colors.error[500],
    borderWidth: 1,
  },

  dropdown: {
    minHeight: 48,
    width: '100%',
    backgroundColor: 'transparent',
    borderWidth: 0,
  },

  optionsContainer: {
    borderRadius: 8,
    borderColor: colors.gray[200],
    borderWidth: 1,
    marginTop: 4,
    backgroundColor: colors.common.white,
    maxHeight: 200,
    ...shadowStyles.lg
  },

  selectedTextStyleHidden: {
    height: 0,
    fontSize: 1,
    color: 'transparent',
    width: 0,
    opacity: 0,
  },

  selectedValueContainer: {
    position: 'relative',
  },

  rightIconContainer: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },

  customSelectedDisplay: {
    position: 'absolute',
    left: 12,
    right: 40,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    pointerEvents: 'box-none',
  },

  chipsScroll: {
    flexGrow: 0,
  },

  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.gray[200],
    backgroundColor: colors.gray[50],
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
  },

  chipAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    marginRight: 6,
    backgroundColor: colors.gray[200],
  },

  chipAvatarFallback: {
    width: 22,
    height: 22,
    borderRadius: 11,
    marginRight: 6,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },

  chipText: {
    fontFamily: Fonts.InterMedium,
    fontSize: 14,
    color: colors.gray[900],
    marginRight: 8,
    maxWidth: 140,
  },

  placeholderStyle: {
    //display: 'none',
    fontFamily: Fonts.InterMedium,
    fontSize: 16,
    fontWeight:'500',
    lineHeight:24,
    color: colors.gray[500],
  },

  selectedTextStyle: {
    fontFamily: Fonts.InterMedium,
    fontSize: 16,
    color: colors.gray[900],
  },

  optionMiddle: {
    flex: 1,
    minWidth: 0,
  },

  optionItemAlignedTop: {
    alignItems: 'flex-start',
  },

  checkboxOuter: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.gray[300],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
    flexShrink: 0,
  },
  checkboxOuterChecked: {
    borderColor: colors.brand[600],
    backgroundColor: colors.brand[600],
  },

  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 8,
  },

  selectedOptionItem: {
    backgroundColor: colors.gray[50],
  },

  optionNameText: {
    fontFamily: Fonts.InterMedium,
    fontSize: 16,
    color: colors.gray[900],
    flex: 1,
    minWidth: 0,
  },

  optionPrimaryColumn: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },

  selectedValueStacked: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
    gap: 2,
  },

  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexShrink: 0,
    gap: 8,
  },

  checkIcon: {
    marginLeft: 0,
  },

  usernameText: {
    fontFamily: Fonts.InterMedium,
    fontSize: 14,
    color: colors.gray[500],
    flexShrink: 1,
    maxWidth: '50%',
  },

  error: {
    marginTop: 4,
    fontSize: 12,
    color: colors.error[500],
  },
});
