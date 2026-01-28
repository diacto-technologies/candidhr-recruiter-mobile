import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { hexToRgb } from '../../../utils/hexToRgb';
import { Fonts } from '../../../theme/fonts';
import { shadowStyles } from '../../../theme/shadowcolor';

export const useStyles = (props: any, isFocus: boolean, size: any) => {

  return StyleSheet.create({
    // Root Wrapper
    container: {
      gap: 5,
    },

    // Label Row
    labelRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 3,
    },

    // Pressable Wrapper
    pressableBase: {
      alignItems: props?.multiline ? 'flex-start' : 'center',
      borderRadius: 8,
      borderStyle: 'solid',
      borderWidth: isFocus ? 2 : 1,
      flexDirection: 'row',
      gap: 10,
      overflow: 'hidden',
      paddingHorizontal: 16,
    },
    pressableDynamic: {
      backgroundColor: props.disable
        ? colors.gray[50]
        : props.textFieldColor
          ? props.textFieldColor
          : colors.base.white,
      borderColor: props.isError
        ? hexToRgb(colors.error[400], 0.8)
        : isFocus
          ? colors.brand[500]
          : colors.gray[300],
      ...(props.multiline === true && { paddingVertical: 10 }),
      ...shadowStyles.shadow_xs
    },

    // TextInput
    inputBase: {
      color: props.disable
        ? colors.gray[500] : colors.gray[900],
      flex: 1,
      fontSize: 14,
      margin: 0,
      padding: 0,
    },
    inputWithValue: {
      fontFamily: Fonts.InterRegular,
      fontSize: 16,
      fontWeight: '400',
      fontStyle: 'normal',
    },
    inputWithoutValue: {
      fontFamily: Fonts.InterRegular,
      fontSize: 16,
      fontWeight: '400',
      fontStyle: 'normal',
    },
    inputDynamic: {
      height:
        props.multiline === true
          ? props.height
            ? props.height
            : size[props.size || 'Medium']
          : size[props.size || 'Medium'],
      ...(props.multiline === true && { textAlignVertical: 'top' }),
    },

    // Error Text
    errorText: {
      color: colors.success[400],
    },
    topGlow: {
      ...StyleSheet.absoluteFillObject,
      borderTopWidth: 1,
      borderColor: 'transparent',
      borderTopColor: 'rgba(255, 255, 255, 0.7)',
      borderLeftColor: 'rgba(255, 255, 255, 0.4)',
      borderRadius: 8,
      pointerEvents: 'none',
    },

    // NEW: Bottom 3D shadow – matches your screenshot perfectly
    bottomShadow: {
      ...StyleSheet.absoluteFillObject,
      borderBottomWidth: 2,
      borderBottomColor: 'rgba(10, 13, 18, 0.08)',   // #0A0D1214
      borderRightWidth: 1,
      borderRightColor: 'rgba(10, 13, 18, 0.06)',
      borderLeftWidth: 1,
      borderLeftColor: 'rgba(10, 13, 18, 0.04)',
      borderRadius: 8,
      pointerEvents: 'none',
    },
    // Add this inside your StyleSheet.create({ ... })

    // TRUE inner shadow – exactly like your design
    insetShadow: {
      ...StyleSheet.absoluteFillObject,
      shadowColor: 'red',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,        // 8% → matches #0A0D120D
      shadowRadius: 2,
      // iOS inset
      backgroundColor: 'transparent',
      // Android inset simulation
      elevation: 0,
    },
  });
};
