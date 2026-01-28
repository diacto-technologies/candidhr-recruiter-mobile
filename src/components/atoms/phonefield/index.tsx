import { View, TextInput, StyleSheet } from 'react-native';
import React, { FC, useState } from 'react';
import Typography from '../typography';
import { colors } from '../../../theme/colors';
import { Fonts } from '../../../theme/fonts';
import { shadowStyles } from '../../../theme/shadowcolor';
import { Colors } from '../../../constants';

type PhoneInputSize = 'Large' | 'Regular' | 'Medium' | 'Small' | 'Tab';

const SIZE_MAP: Record<PhoneInputSize, number> = {
    Large: 73,
    Regular: 56,
    Medium: 44,
    Small: 40,
    Tab: 32,
};

interface PhoneInputProps {
    value: string;
    onChangeText: (text: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    label?: string;
    isRequired?: boolean;
    isError?: boolean;
    error?: string;
    size?: PhoneInputSize;
    disabled?: boolean;
}

const PhoneInput: FC<PhoneInputProps> = ({
    value,
    onChangeText,
    onBlur,
    onFocus,
    label,
    isRequired,
    isError,
    error,
    size = 'Medium',
    disabled = false,
}) => {
    const [isFocus, setIsFocus] = useState(false);
    const height = SIZE_MAP[size];

    const handleFocus = () => {
        setIsFocus(true);
        onFocus?.();
    };

    const handleBlur = () => {
        setIsFocus(false);
        onBlur?.();
    };

    return (
        <View style={styles.container}>
            {label && (
                <View style={styles.labelRow}>
                    <Typography variant="regularTxtsm">{label}</Typography>
                    {isRequired && (
                        <Typography color={colors.mainColors.main} variant="regularTxtsm">
                            *
                        </Typography>
                    )}
                </View>
            )}
            <View style={[
                styles.phoneInputContainer,
                {
                    borderColor: isError
                        ? colors.error[400]
                        : isFocus && !disabled
                            ? colors.brand[500]
                            : colors.gray[300],
                    borderWidth: isFocus && !disabled ? 2 : 1,
                    backgroundColor: disabled ?  colors.gray[50] : colors.base.white,
                },
            ]}>
                <View style={[styles.prefixContainer, { height }]}>
                    <Typography variant="regularTxtmd" color={colors.gray[600]}>+91</Typography>
                </View>
                <View style={[styles.divider, { height }]} />
                <TextInput
                    placeholder="000 000 0000"
                    keyboardType="phone-pad"
                    value={value}
                    placeholderTextColor={colors.gray[500]}
                    onChangeText={onChangeText}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    editable={!disabled}
                    style={[
                        styles.input,
                        { height },
                        value ? styles.inputWithValue : styles.inputWithoutValue,
                        disabled && styles.inputDisabled,
                    ]}
                    maxLength={10}
                />
            </View>
            {isError && error && (
                <Typography variant="regularTxtsm" color={colors.error[600]}>
                    {error}
                </Typography>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: 5,
    },
    labelRow: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 3,
    },
    phoneInputContainer: {
        backgroundColor: colors.base.white,
        borderRadius: 8,
        borderStyle: 'solid',
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
        ...shadowStyles.xs
    },
    prefixContainer: {
        paddingHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:colors.gray[50]
    },
    divider: {
        width: 1,
        backgroundColor: colors.gray[300],
    },
    input: {
        flex: 1,
        paddingHorizontal: 16,
        color: colors.gray[900],
        fontSize: 16,
        margin: 0,
        padding: 0,
    },
    inputWithValue: {
        fontFamily: Fonts.InterRegular,
        fontSize: 16,
        fontWeight: '400',
        fontStyle: 'normal',
        color:colors.gray[900]
    },
    inputWithoutValue: {
        fontFamily: Fonts.InterRegular,
        fontSize: 16,
        fontWeight: '400',
        fontStyle: 'normal',
        color:colors.gray[400]
    },
    inputDisabled: {
        color: colors.gray[500],
    },
});

export default PhoneInput;