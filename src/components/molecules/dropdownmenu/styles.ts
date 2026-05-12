import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { shadowStyles } from '../../../theme/shadowcolor';

export const dropdownMenuStyles = StyleSheet.create({
  modalRoot: {
    flex: 1,
  },
  backdropDim: {
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
  },
  dropdown: {
    position: 'absolute',
    width: 140,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray[200],
    zIndex: 2,
    ...shadowStyles.shadow_3xl,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  dropdownItemIcon: {
    marginRight: 5,
  },
  customContent: {
    padding: 12,
  },
});
