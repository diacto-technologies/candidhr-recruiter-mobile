import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { SvgXml } from 'react-native-svg';
import { colors } from '../../../theme/colors';
import { Fonts } from '../../../theme/fonts';
import Typography from '../typography';
import { UrlInputFieldProps } from './urlinputfield';

const copyIcon = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.25 2.5H12.1667C14.0335 2.5 14.9669 2.5 15.68 2.86331C16.3072 3.18289 16.8171 3.69282 17.1367 4.32003C17.5 5.03307 17.5 5.96649 17.5 7.83333V13.75M5.16667 17.5H11.9167C12.8501 17.5 13.3168 17.5 13.6733 17.3183C13.9869 17.1586 14.2419 16.9036 14.4017 16.59C14.5833 16.2335 14.5833 15.7668 14.5833 14.8333V8.08333C14.5833 7.14991 14.5833 6.6832 14.4017 6.32668C14.2419 6.01308 13.9869 5.75811 13.6733 5.59832C13.3168 5.41667 12.8501 5.41667 11.9167 5.41667H5.16667C4.23325 5.41667 3.76654 5.41667 3.41002 5.59832C3.09641 5.75811 2.84144 6.01308 2.68166 6.32668C2.5 6.6832 2.5 7.14991 2.5 8.08333V14.8333C2.5 15.7668 2.5 16.2335 2.68166 16.59C2.84144 16.9036 3.09641 17.1586 3.41002 17.3183C3.76654 17.5 4.23325 17.5 5.16667 17.5Z" stroke="#A4A7AE" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

// Helper functions to extract protocol from URL
const getProtocol = (url: string): string => {
  if (url.startsWith('https://')) return 'https://';
  if (url.startsWith('http://')) return 'http://';
  return 'https://'; // default
};

const removeProtocol = (url: string): string => {
  if (url.startsWith('https://')) return url.slice(8);
  if (url.startsWith('http://')) return url.slice(7);
  return url;
};

const UrlInputField = forwardRef((props: UrlInputFieldProps, ref) => {
  const {
    value,
    onChangeText,
    placeholder = 'www.example.com',
    editable = true,
    disabled = false,
    disable = false,
    label,
    showCopyIcon = true,
    onCopy,
    error,
    isError,
    ...rest
  } = props;

  // Support both 'disabled' and 'disable' props
  const isDisabled = disabled || disable;

  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Extract protocol and value without protocol
  const protocol = getProtocol(value);
  const displayValue = removeProtocol(value);

  useImperativeHandle(ref, () => inputRef.current);

  const handleCopy = () => {
    // Copy the full URL (with protocol)
    const fullUrl = value.startsWith('http://') || value.startsWith('https://') 
      ? value 
      : `${protocol}${value}`;
    Clipboard.setString(fullUrl);
    
    if (onCopy) {
      onCopy(fullUrl);
    } else {
      // Show a brief feedback
      if (Platform.OS === 'ios') {
        Alert.alert('Copied', 'URL copied to clipboard');
      }
    }
  };

  const handleChangeText = (text: string) => {
    // Store the full URL with protocol
    onChangeText(`${protocol}${text}`);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <View style={styles.container}>
      {label && (
        <Typography variant="mediumTxtsm" color={colors.gray[700]} style={styles.label}>
          {label}
        </Typography>
      )}
      <View style={styles.inputRow}>
        {/* Prefix Box - shows extracted protocol */}
        <View style={[
          styles.prefixContainer, 
          isFocused && !isDisabled && styles.prefixContainerFocused,
          isDisabled && styles.prefixContainerDisabled,
        ]}>
          <Typography variant="regularTxtmd" color={colors.gray[500]}>
            {protocol}
          </Typography>
        </View>

        {/* Input Field - shows URL without protocol */}
        <View
          style={[
            styles.inputContainer,
            isFocused && !isDisabled && styles.inputContainerFocused,
            isError && styles.inputContainerError,
            isDisabled && styles.inputContainerDisabled,
          ]}
        >
          <TextInput
            {...rest}
            ref={inputRef}
            value={displayValue}
            onChangeText={handleChangeText}
            placeholder={placeholder}
            placeholderTextColor={colors.gray[500]}
            style={[styles.textInput, isDisabled && styles.textInputDisabled]}
            editable={editable && !isDisabled}
            autoCapitalize="none"
            keyboardType="url"
            onFocus={handleFocus}
            onBlur={handleBlur}
          />

          {/* Copy Icon */}
          {showCopyIcon && (
            <Pressable
              onPress={handleCopy}
              style={({ pressed }) => [
                styles.copyButton,
                pressed && styles.copyButtonPressed,
              ]}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <SvgXml xml={copyIcon} width={20} height={20} />
            </Pressable>
          )}
        </View>
      </View>

      {isError && error && (
        <Typography variant="regularTxtsm" color={colors.error[600]} style={styles.errorText}>
          {error}
        </Typography>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    marginBottom: 0,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prefixContainer: {
    height: 44,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray[50],
    borderRightWidth: 0,
  },
  prefixContainerFocused: {
    borderColor: colors.brand[500],
  },
  inputContainer: {
    flex: 1,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: colors.base.white,
    paddingHorizontal: 12,
    // shadowColor: '#0A0D12',
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.05,
    // shadowRadius: 2,
    // elevation: 1,
  },
  inputContainerFocused: {
    borderWidth: 2,
    borderColor: colors.brand[500],
  },
  inputContainerError: {
    borderColor: colors.error[400],
  },
  inputContainerDisabled: {
    borderColor: colors.gray[300],
  },
  prefixContainerDisabled: {
    backgroundColor: colors.gray[50],
    borderColor: colors.gray[300],
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontWeight:'400',
    fontFamily: Fonts.InterRegular,
    color: colors.gray[900],
    padding: 0,
    margin: 0,
  },
  copyButton: {
    padding: 4,
    marginLeft: 8,
  },
  copyButtonPressed: {
    opacity: 0.6,
  },
  errorText: {
    marginTop: 4,
  },
});

export { UrlInputField };
