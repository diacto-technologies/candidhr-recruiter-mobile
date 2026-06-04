import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { Fonts } from '../../../theme/fonts';
import { shadowStyles } from '../../../theme/shadowcolor';
import { PhoneInputSize } from './phonefield';

export const SIZE_MAP: Record<PhoneInputSize, number> = {
    Large: 73,
    Regular: 56,
    Medium: 44,
    Small: 40,
    Tab: 32,
};

export const useStyles = (
    size: PhoneInputSize,
    isFocus: boolean,
    disabled: boolean,
    isError?: boolean
) => {
    const height = SIZE_MAP[size];

    return StyleSheet.create({
        container: {
            gap: 5,
        },
        labelRow: {
            alignItems: 'center',
            flexDirection: 'row',
            gap: 3,
        },
        phoneInputContainer: {
            backgroundColor: disabled ? colors.gray[50] : colors.base.white,
            borderRadius: 8,
            borderStyle: 'solid',
            flexDirection: 'row',
            alignItems: 'center',
            overflow: 'hidden',
            borderColor: isError
                ? colors.error[400]
                : isFocus && !disabled
                    ? colors.brand[500]
                    : colors.gray[300],
            borderWidth: isFocus && !disabled ? 2 : 1,
            ...shadowStyles.xs,
        },
        prefixContainer: {
            paddingHorizontal: 16,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.gray[50],
            height,
        },
        divider: {
            width: 1,
            backgroundColor: colors.gray[300],
            height,
        },
        input: {
            flex: 1,
            paddingHorizontal: 16,
            color: colors.gray[900],
            fontSize: 16,
            margin: 0,
            padding: 0,
            height,
        },
        inputWithValue: {
            fontFamily: Fonts.InterRegular,
            fontSize: 16,
            fontWeight: '400',
            fontStyle: 'normal',
            color: colors.gray[900],
        },
        inputWithoutValue: {
            fontFamily: Fonts.InterRegular,
            fontSize: 16,
            fontWeight: '400',
            fontStyle: 'normal',
            color: colors.gray[400],
        },
        inputDisabled: {
            color: colors.gray[500],
        },
    });
};
