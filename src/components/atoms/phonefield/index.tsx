import { View, TextInput } from 'react-native';
import React, { FC, useState } from 'react';
import Typography from '../typography';
import { colors } from '../../../theme/colors';
import { PhoneInputProps } from './phonefield';
import { useStyles } from './styles';

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

    const handleFocus = () => {
        setIsFocus(true);
        onFocus?.();
    };

    const handleBlur = () => {
        setIsFocus(false);
        onBlur?.();
    };

    const styles = useStyles(size, isFocus, disabled, isError);

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
            <View style={styles.phoneInputContainer}>
                <View style={styles.prefixContainer}>
                    <Typography variant="regularTxtmd" color={colors.gray[600]}>+91</Typography>
                </View>
                <View style={styles.divider} />
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

export default PhoneInput;