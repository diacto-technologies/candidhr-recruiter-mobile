export type PhoneInputSize = 'Large' | 'Regular' | 'Medium' | 'Small' | 'Tab';

export interface PhoneInputProps {
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
