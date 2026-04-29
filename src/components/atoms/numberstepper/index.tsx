import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react'
import { View, Pressable, StyleSheet, TextInput } from 'react-native'
import Typography from '../typography'
import { colors } from '../../../theme/colors'
import { SvgXml } from 'react-native-svg'
import { plusIcon } from '../../../assets/svg/plus'
import { minusIcon } from '../../../assets/svg/minus'
import { Fonts } from '../../../theme/fonts'

/** Matches TextField: border, radius, height (Medium), shadow */
const ROW_HEIGHT = 44
const SIDE_WIDTH = 44

type Props = {
  value: number
  onChange: (val: number) => void
  min?: number
  max?: number
  step?: number
  /** Shown after the padded number, e.g. "Seconds" */
  unitLabel?: string
  /** Minimum digit width for leading zeros */
  padLength?: number
  /** Allow typing the value in addition to +/- buttons */
  editable?: boolean
  /** Disable +/- and typing */
  disabled?: boolean
  /** Validation: red border + message below the control */
  error?: string
}

export type NumberStepperHandle = {
  /**
   * Push the current in-edit draft to `onChange` and return the resulting number
   * (e.g. before Continue) so parent validation matches what the user typed.
   */
  commit: () => number
}

const NumberStepper = forwardRef<NumberStepperHandle, Props>(function NumberStepper(
  {
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    unitLabel = 'Seconds',
    padLength = 2,
    editable = true,
    disabled = false,
    error,
  },
  ref
) {
  const [focused, setFocused] = useState(false)
  const [draft, setDraft] = useState(() => String(value))

  useEffect(() => {
    if (focused) {
      setDraft(String(value))
    }
  }, [value, focused])

  const parseAndClamp = (raw: string) => {
    if (raw === '') {
      return min
    }
    const n = parseInt(raw.replace(/\D/g, ''), 10)
    if (Number.isNaN(n)) {
      return min
    }
    return Math.min(max, Math.max(min, n))
  }

  const commitDraft = (raw: string) => {
    onChange(parseAndClamp(raw))
  }

  /** When focused, `value` from parent lags the TextInput; +/- must use the in-edit draft. */
  const getEffectiveValue = (): number => {
    if (disabled) {
      return value
    }
    if (focused) {
      if (draft === '') {
        return min
      }
      return parseAndClamp(draft)
    }
    return value
  }

  useImperativeHandle(
    ref,
    () => ({
      commit: () => {
        if (disabled) {
          return value
        }
        if (focused) {
          const n = parseAndClamp(draft)
          onChange(n)
          setFocused(false)
          return n
        }
        return value
      },
    }),
    [disabled, focused, draft, value, min, max, onChange]
  )

  const handleIncrement = () => {
    if (disabled) return
    const current = getEffectiveValue()
    const next = current < min ? min : current + step
    const nextClamped = Math.min(max, next)
    onChange(nextClamped)
    if (focused) {
      setDraft(String(nextClamped))
    }
  }

  const handleDecrement = () => {
    if (disabled) return
    const current = getEffectiveValue()
    const next = current - step
    const nextClamped = Math.max(min, next)
    onChange(nextClamped)
    if (focused) {
      setDraft(String(nextClamped))
    }
  }

  const nForBounds = getEffectiveValue()
  const atMin = nForBounds <= min
  const atMax = nForBounds >= max
  const disableMinus = disabled || atMin
  const disablePlus = disabled || atMax
  const padded = String(value).padStart(padLength, '0')
  const displayStr = focused ? draft : padded
  const iconMuted = colors.gray[600]
  /** Tight width so digits sit next to the unit (wide minWidth + textAlign center created a large gap). */
  const inputCharCount = Math.max(displayStr.length, 1)
  const inputWidth = Math.min(96, Math.max(24, inputCharCount * 12 + 6))

  return (
    <View style={styles.root}>
    <View
      style={[
        styles.container,
        disabled && styles.containerDisabled,
        error ? styles.containerError : null,
      ]}
    >
      <Pressable
        onPress={handleDecrement}
        disabled={disableMinus}
        style={({ pressed }) => [
          styles.sideButton,
          styles.sideButtonLeft,
          pressed && !disabled && styles.pressed,
          disableMinus && styles.disabled,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Decrease"
      >
        <SvgXml xml={minusIcon} color={disabled ? colors.gray[400] : iconMuted} />
      </Pressable>

      <View style={styles.center}>
        <View style={styles.valueRow}>
          {editable && !disabled ? (
            <>
              <TextInput
                style={[styles.input, { width: inputWidth, maxWidth: inputWidth }]}
                value={displayStr}
                onChangeText={(t) => setDraft(t.replace(/\D/g, ''))}
                onFocus={() => {
                  setFocused(true)
                  setDraft(String(value))
                }}
                onBlur={() => {
                  commitDraft(draft)
                  setFocused(false)
                }}
                keyboardType="number-pad"
                selectTextOnFocus
                accessibilityLabel="Value"
              />
              {unitLabel ? (
                <Typography
                  variant="regularTxtmd"
                  color={colors.gray[500]}
                  style={styles.unitAfterValue}
                >
                  {unitLabel}
                </Typography>
              ) : null}
            </>
          ) : (
            <>
              <Typography
                variant="semiBoldTxtmd"
                color={disabled ? colors.gray[400] : colors.gray[900]}
              >
                {padded}
              </Typography>
              {unitLabel ? (
                <Typography
                  variant="regularTxtmd"
                  color={disabled ? colors.gray[400] : colors.gray[500]}
                  style={styles.unitAfterValue}
                >
                  {unitLabel}
                </Typography>
              ) : null}
            </>
          )}
        </View>
      </View>

      <Pressable
        onPress={handleIncrement}
        disabled={disablePlus}
        style={({ pressed }) => [
          styles.sideButton,
          pressed && !disabled && styles.pressed,
          disablePlus && styles.disabled,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Increase"
      >
        <SvgXml xml={plusIcon} color={disabled ? colors.gray[400] : colors.gray[400]} />
      </Pressable>
    </View>
    {error ? (
      <Typography variant="regularTxtsm" color={colors.error[600]}>
        {error}
      </Typography>
    ) : null}
    </View>
  )
})

const styles = StyleSheet.create({
  root: {
    gap: 5,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: colors.base.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray[300],
    overflow: 'hidden',
  },
  containerError: {
    borderColor: colors.error[500],
  },
  containerDisabled: {
    backgroundColor: colors.gray[100],
  },
  sideButton: {
    width: SIDE_WIDTH,
    minHeight: ROW_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideButtonLeft: {
    borderRightWidth: 1,
    borderColor: colors.gray[300],
  },
  center: {
    flex: 1,
    minHeight: ROW_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    borderRightWidth: 1,
    borderColor: colors.gray[300],
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flexGrow: 0,
    flexShrink: 0,
    maxWidth: '100%',
  },
  unitAfterValue: {
    marginLeft: 2,
  },
  input: {
    minHeight: ROW_HEIGHT,
    textAlign: 'right',
    flexGrow: 0,
    flexShrink: 0,
    fontFamily: Fonts.InterSemiBold,
    fontSize: 16,
    color: colors.gray[900],
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  pressed: {
    backgroundColor: colors.gray[50],
  },
  disabled: {
    opacity: 0.45,
  },
})

export default NumberStepper
