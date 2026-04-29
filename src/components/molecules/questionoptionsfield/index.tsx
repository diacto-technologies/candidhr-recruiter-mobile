import React from 'react'
import { View, Pressable, TextInput } from 'react-native'
import { SvgXml } from 'react-native-svg'
import Typography from '../../atoms/typography'
import Button from '../../atoms/button'
import { plusIcon } from '../../../assets/svg/plus'
import { colors } from '../../../theme/colors'
import { styles } from './styles'
import type { QuestionOptionsFieldProps } from './types'
import { closeIcon } from '../../../assets/svg/closeicon'
import CheckBox from '../../atoms/checkbox'

const QuestionOptionsField: React.FC<QuestionOptionsFieldProps> = ({
    mode,
    options,
    isOptionCorrect,
    onOptionTextChange,
    onAddOption,
    onRemoveOption,
    onToggleCorrect,
    minOptions = 2,
    label = 'Options',
    labelColor = colors.gray[700],
    required = true,
    disabled = false,
    showAddOption = true,
    optionInputsEditable = true,
    optionsPresentation = 'standard',
}) => {
    const atMin = options.length <= minOptions
    const isYesNo = optionsPresentation === 'yesNo'

    return (
        <View style={[styles.field, disabled && styles.fieldDisabled]} pointerEvents={disabled ? 'none' : 'auto'}>
            <View style={styles.optionsLabelRow}>
                <Typography variant="semiBoldTxtsm" color={labelColor}>
                    {label}
                </Typography>
                {required ? (
                    <Typography variant="semiBoldTxtsm" color={colors.error[500]}>
                        {' '}*
                    </Typography>
                ) : null}
            </View>
            {isYesNo ? (
                <View style={styles.yesNoList}>
                    {options.map((opt) => {
                        const selected = isOptionCorrect(opt.id)
                        return (
                            <Pressable
                                key={opt.id}
                                onPress={() => onToggleCorrect(opt.id)}
                                accessibilityRole="radio"
                                accessibilityState={{ selected }}
                                style={({ pressed }) => [
                                    styles.yesNoRow,
                                    selected && styles.yesNoRowSelected,
                                    pressed && { opacity: 0.92 },
                                ]}
                            >
                                <Typography variant="semiBoldTxtsm" color={colors.gray[900]}>
                                    {opt.text}
                                </Typography>
                            </Pressable>
                        )
                    })}
                </View>
            ) : (
            <View style={styles.optionsList}>
                {options.map((opt, index) => (
                    <View key={opt.id} style={styles.optionRow}>
                        <View
                            style={[
                                styles.optionInputWrap,
                                disabled && styles.optionInputWrapDisabled,
                            ]}
                        >
                            <TextInput
                                style={[styles.optionInput, disabled && styles.optionInputDisabled]}
                                placeholder={`Option ${index + 1}`}
                                placeholderTextColor={colors.gray[500]}
                                value={opt.text}
                                onChangeText={(t) => onOptionTextChange(opt.id, t)}
                                editable={!disabled && optionInputsEditable}
                            />
                            {mode === 'single' ? (
                                <Pressable
                                    onPress={() => onToggleCorrect(opt.id)}
                                    style={styles.selectorHit}
                                    accessibilityRole="radio"
                                    accessibilityState={{
                                        checked: isOptionCorrect(opt.id),
                                    }}
                                >
                                    <View
                                        style={[
                                            styles.radioFrame,
                                            isOptionCorrect(opt.id) && styles.radioFrameSelected,
                                        ]}
                                    >
                                        {isOptionCorrect(opt.id) ? (
                                            <View style={styles.radioInnerDot} />
                                        ) : null}
                                    </View>
                                </Pressable>
                            ) : (
                                <View style={styles.selectorHit}>
                                    <CheckBox
                                        checked={isOptionCorrect(opt.id)}
                                        onChange={() => onToggleCorrect(opt.id)}
                                        type="square"
                                    />
                                </View>
                            )}
                        </View>
                        <Pressable
                            onPress={() => onRemoveOption(opt.id)}
                            disabled={disabled || atMin}
                            style={({ pressed }) => [
                                styles.deleteBtn,
                                pressed && styles.deleteBtnPressed,
                                (disabled || atMin) && styles.deleteBtnDisabled,
                            ]}
                            accessibilityLabel="Remove option"
                        >
                            <SvgXml xml={closeIcon} color={colors.gray[400]} height={32} width={32} />
                        </Pressable>
                    </View>
                ))}
            </View>
            )}
            {showAddOption && !isYesNo ? (
            <View style={{width:'40%',marginTop:5}}>
            <Button
                buttonColor={colors.gray[50]}
                borderWidth={1}
                borderColor={colors?.gray[200]}
                variant="outline"
                paddingHorizontal={12}
                size={40}
                onPress={onAddOption}
                textColor={colors.gray[700]}
                startIcon={<SvgXml xml={plusIcon} color={colors.gray[400]}
                 />
            }
                disabled={disabled}
            >
                Add option
            </Button>
            </View>
            ) : null}
        </View>
    )
}

export default QuestionOptionsField
