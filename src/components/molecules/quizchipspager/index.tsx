import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
    View,
    ScrollView,
    Pressable,
    StyleSheet,
    NativeSyntheticEvent,
    NativeScrollEvent,
    LayoutChangeEvent,
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Typography from '../../atoms/typography'
import { colors } from '../../../theme/colors'

const SCROLL_STEP = 140

export type QuizChipsPagerProps = {
    count: number
    /** Active chip index, or -1 for none (e.g. new draft while saved quizzes exist). */
    selectedIndex: number
    onSelect: (index: number) => void
    /** Label prefix before the number (default "Quiz") */
    labelPrefix?: string
}

const QuizChipsPager: React.FC<QuizChipsPagerProps> = ({
    count,
    selectedIndex,
    onSelect,
    labelPrefix = 'Quiz',
}) => {
    const scrollRef = useRef<ScrollView>(null)
    const [scrollX, setScrollX] = useState(0)
    const [contentWidth, setContentWidth] = useState(0)
    const [viewportWidth, setViewportWidth] = useState(0)

    const maxScroll = Math.max(0, contentWidth - viewportWidth)
    const canScrollLeft = scrollX > 2
    const canScrollRight = scrollX < maxScroll - 2

    const scrollBy = useCallback(
        (delta: number) => {
            const next = Math.max(0, Math.min(maxScroll, scrollX + delta))
            scrollRef.current?.scrollTo({ x: next, animated: true })
        },
        [maxScroll, scrollX],
    )

    const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
        setScrollX(e.nativeEvent.contentOffset.x)
    }, [])

    useEffect(() => {
        if (count < 1 || selectedIndex !== count - 1) return
        const id = requestAnimationFrame(() => {
            scrollRef.current?.scrollToEnd({ animated: true })
        })
        return () => cancelAnimationFrame(id)
    }, [count, selectedIndex])

    const chips = Array.from({ length: count }, (_, i) => i)

    return (
        <View style={styles.row}>
            <Pressable
                onPress={() => canScrollLeft && scrollBy(-SCROLL_STEP)}
                style={[styles.chevronHit, !canScrollLeft && styles.chevronDisabled]}
                disabled={!canScrollLeft}
                accessibilityLabel="Scroll quizzes left"
            >
                <Ionicons
                    name="chevron-back"
                    size={22}
                    fill={canScrollLeft ? colors.gray[600] : colors.gray[300]}
                />
            </Pressable>

            <ScrollView
                ref={scrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
                scrollEventThrottle={16}
                onContentSizeChange={(w) => setContentWidth(w)}
                onLayout={(e: LayoutChangeEvent) =>
                    setViewportWidth(e.nativeEvent.layout.width)
                }
                contentContainerStyle={styles.scrollContent}
                style={styles.scroll}
            >
                {chips.map((index) => {
                    const active = index === selectedIndex
                    return (
                        <Pressable
                            key={`${count}-${index}`}
                            onPress={() => onSelect(index)}
                            style={[styles.chip, active ? styles.chipActive : styles.chipIdle]}
                            accessibilityRole="tab"
                            accessibilityState={{ selected: active }}
                        >
                            <Typography
                                variant="mediumTxtsm"
                                color={active ? colors.brand[700] : colors.gray[700]}
                            >
                                {`${labelPrefix}: ${index + 1}`}
                            </Typography>
                        </Pressable>
                    )
                })}
            </ScrollView>

            <Pressable
                onPress={() => canScrollRight && scrollBy(SCROLL_STEP)}
                style={[styles.chevronHit, !canScrollRight && styles.chevronDisabled]}
                disabled={!canScrollRight}
                accessibilityLabel="Scroll quizzes right"
            >
                <Ionicons
                    name="chevron-forward"
                    size={22}
                    fill={canScrollRight ? colors.gray[600] : colors.gray[300]}
                />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical:16,
        paddingHorizontal: 8,
        backgroundColor: colors.base.white,
        borderTopWidth:1,
        borderColor:colors.gray[200],
    },
    chevronHit: {
        // padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chevronDisabled: {
        opacity: 0.45,
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 4,
    },
    chip: {
        paddingHorizontal:12,
        paddingVertical:4,
        borderRadius: 8,
        borderWidth: 1,
    },
    chipIdle: {
        backgroundColor: colors.gray[50],
        borderColor: colors.gray[200],
    },
    chipActive: {
        backgroundColor: colors.brand[50],
        borderColor: colors.brand[500],
    },
})

export default QuizChipsPager
