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

  containerFocused: {
    borderColor: colors.brand[600],
    borderWidth: 2,
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
    pointerEvents: 'none',
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

  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },

  selectedOptionItem: {
    backgroundColor: colors.gray[50],
  },

  optionNameText: {
    fontFamily: Fonts.InterMedium,
    fontSize: 16,
    color: colors.gray[900],
    flex: 1,
  },

  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
  },

  checkIcon: {
    marginLeft: 8,
  },

  usernameText: {
    fontFamily: Fonts.InterMedium,
    fontSize: 14,
    color: colors.gray[500],
  },

  error: {
    marginTop: 4,
    fontSize: 12,
    color: colors.error[500],
  },
});
